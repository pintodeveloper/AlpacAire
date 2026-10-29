import csv
import io
import os
from datetime import datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo

import matplotlib

matplotlib.use("Agg")
import matplotlib.dates as mdates  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from flask import Blueprint, Response, current_app, jsonify, request, send_file, stream_with_context  # noqa: E402
from reportlab.lib import colors  # noqa: E402
from reportlab.lib.pagesizes import A4  # noqa: E402
from reportlab.lib.styles import ParagraphStyle  # noqa: E402
from reportlab.lib.units import mm  # noqa: E402
from reportlab.platypus import (Image, KeepTogether, PageBreak, Paragraph, SimpleDocTemplate,  # noqa: E402
                                Spacer, Table, TableStyle)
from sqlalchemy import and_, false, func, literal_column, or_  # noqa: E402

from . import thresholds as T  # noqa: E402
from .auth import requiere, usuario_actual  # noqa: E402
from .extensions import db  # noqa: E402
from .models import Frente, Lectura  # noqa: E402

bp = Blueprint("reportes", __name__)
TZ = ZoneInfo(os.getenv("TZ_MINA", "America/Bogota"))
LOGO = os.path.join(os.path.dirname(__file__), "static", "logo.png")

PIZARRA = colors.HexColor("#2B4650")
CARBON = colors.HexColor("#1D2427")
VETA = colors.HexColor("#CFD7D6")
ROCA = colors.HexColor("#EDF0EF")
C_ALERTA = colors.HexColor("#E3A600")
C_PELIGRO = colors.HexColor("#C0392B")

ANEXO_BUCKET = {"dia": 1800, "semana": 3 * 3600, "mes": 12 * 3600}


def periodo():
    """Devuelve (desde_utc, hasta_utc, etiqueta, tipo) según los parámetros."""
    tipo = request.args.get("rango", "dia")
    hoy = datetime.now(TZ).date()
    fecha = request.args.get("fecha")
    fin_dia = datetime.strptime(fecha, "%Y-%m-%d").date() if fecha else hoy
    if tipo == "personalizado":
        d = datetime.strptime(request.args["desde"], "%Y-%m-%d").date()
        h = datetime.strptime(request.args["hasta"], "%Y-%m-%d").date()
        dias = (h - d).days + 1
        tipo = "dia" if dias <= 1 else "semana" if dias <= 8 else "mes"
    else:
        dias = {"dia": 1, "semana": 7, "mes": 30}.get(tipo, 1)
        h, d = fin_dia, fin_dia - timedelta(days=dias - 1)
    desde = datetime.combine(d, time.min, TZ)
    hasta = datetime.combine(h, time.max, TZ)
    etiqueta = d.strftime("%d/%m/%Y") if d == h else f"{d:%d/%m/%Y} al {h:%d/%m/%Y}"
    return desde.astimezone(timezone.utc), hasta.astimezone(timezone.utc), etiqueta, tipo


def _frentes():
    fid = request.args.get("frente_id")
    q = Frente.query.order_by(Frente.id)
    if fid and fid.isdigit():
        q = q.filter(Frente.id == int(fid))
    return q.all()


def _cond(var, nivel):
    cfg, col = T.VARIABLES[var], getattr(Lectura, var)
    if var == "o2":
        if nivel == "peligro":
            return or_(col < cfg["peligro_min"], col > cfg["peligro_max"])
        return or_(and_(col < cfg["alerta_min"], col >= cfg["peligro_min"]),
                   and_(col > cfg["alerta_max"], col <= cfg["peligro_max"]))
    if nivel == "peligro":
        return col > cfg["peligro_max"] if cfg.get("peligro_max") is not None else false()
    pm = cfg.get("peligro_max")
    c = col > cfg["alerta_max"]
    return and_(c, col <= pm) if pm is not None else c


def resumen(frente_id, desde, hasta):
    cols = []
    for v in T.VARIABLES:
        c = getattr(Lectura, v)
        cols += [func.min(c), func.avg(c), func.max(c),
                 func.count().filter(_cond(v, "alerta")), func.count().filter(_cond(v, "peligro"))]
    fila = (db.session.query(func.count(Lectura.id), *cols)
            .filter(Lectura.frente_id == frente_id, Lectura.ts >= desde, Lectura.ts <= hasta).one())
    total, datos = fila[0], fila[1:]
    out = {}
    for i, v in enumerate(T.VARIABLES):
        mn, av, mx, na, np_ = datos[i * 5: i * 5 + 5]
        out[v] = {"min": mn, "avg": float(av) if av is not None else None, "max": mx,
                  "alerta": na or 0, "peligro": np_ or 0}
    return total, out


def serie(frente_id, desde, hasta, bucket, vars_):
    b = func.to_timestamp(func.floor(func.extract("epoch", Lectura.ts) / literal_column(str(int(bucket)))) * literal_column(str(int(bucket))))
    q = (db.session.query(b.label("t"), *[func.avg(getattr(Lectura, v)) for v in vars_])
         .filter(Lectura.frente_id == frente_id, Lectura.ts >= desde, Lectura.ts <= hasta)
         .group_by(b).order_by(b))
    return q.all()


def _fmt(v, var):
    if v is None:
        return "—"
    dec = 3 if var in ("ch4", "h2s", "no2") else 0 if var == "co2" else 1
    return f"{v:,.{dec}f}".replace(",", " ")


def _limite(var):
    c = T.VARIABLES[var]
    if var == "o2":
        return f"{c['peligro_min']}–{c['peligro_max']}"
    return f"≤ {_fmt(c['alerta_max'], var)}"


def grafica(frente, filas):
    vars_ = ["temp_efectiva", "ch4", "co", "o2"]
    fig, axes = plt.subplots(len(vars_), 1, figsize=(7.2, 6.4), sharex=True)
    t = [f[0].astimezone(TZ) for f in filas]
    for ax, (i, v) in zip(axes, enumerate(vars_)):
        cfg = T.VARIABLES[v]
        y = [f[1 + i] for f in filas]
        ax.plot(t, y, color="#2B4650", linewidth=1.1)
        for k, col in (("alerta_max", "#E3A600"), ("peligro_max", "#C0392B"),
                       ("alerta_min", "#E3A600"), ("peligro_min", "#C0392B")):
            if cfg.get(k) is not None:
                ax.axhline(cfg[k], color=col, linewidth=0.8, linestyle="--")
        ax.set_ylabel(f"{cfg['corto']} ({cfg['unidad']})", fontsize=8)
        ax.tick_params(labelsize=7)
        ax.grid(alpha=0.25)
        for s in ("top", "right"):
            ax.spines[s].set_visible(False)
    axes[-1].xaxis.set_major_formatter(mdates.DateFormatter("%d/%m %H:%M", tz=TZ))
    fig.autofmt_xdate()
    fig.suptitle(frente.nombre, fontsize=10, x=0.01, ha="left", color="#1D2427")
    fig.tight_layout()
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=150)
    plt.close(fig)
    buf.seek(0)
    return buf


@bp.get("/pdf")
@requiere("exportar")
def pdf():
    try:
        desde, hasta, etiqueta, tipo = periodo()
    except (KeyError, ValueError):
        return jsonify(error="Revisa las fechas del rango."), 400
    frentes = _frentes()
    autor = usuario_actual()

    st = {
        "h1": ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=17, textColor=CARBON, leading=21),
        "h2": ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=12.5, textColor=PIZARRA,
                             spaceBefore=8, spaceAfter=5),
        "p": ParagraphStyle("p", fontName="Helvetica", fontSize=9, textColor=CARBON, leading=12.5),
        "small": ParagraphStyle("s", fontName="Helvetica", fontSize=7.5, textColor=colors.HexColor("#56656A"),
                                leading=10),
    }
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=16 * mm, rightMargin=16 * mm,
                            topMargin=16 * mm, bottomMargin=16 * mm,
                            title=f"AlpacAire - Reporte {etiqueta}", author="AlpacAire")
    story = []

    cab = [Paragraph("Reporte de condiciones atmosféricas", st["h1"]),
           Paragraph(f"{current_app.config['MINA_NOMBRE']} &nbsp; | &nbsp; Periodo: <b>{etiqueta}</b>", st["p"]),
           Paragraph(f"Generado el {datetime.now(TZ):%d/%m/%Y %I:%M %p} por {autor.nombre}", st["small"])]
    if os.path.exists(LOGO):
        story.append(Table([[cab, Image(LOGO, width=26 * mm, height=21.7 * mm)]],
                           colWidths=[150 * mm, 28 * mm],
                           style=[("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
    else:
        story += cab
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph(
        "Clasificación según el Decreto 1886 de 2015 (arts. 7, 53, 217 y 218) y los TLV de la ACGIH que "
        "el mismo decreto adopta (art. 74). <b>Alerta</b>: supera el valor límite permisible de 8 h. "
        "<b>Peligro</b>: supera el límite de corta exposición o el máximo que obliga a evacuar.", st["small"]))

    for idx, f in enumerate(frentes):
        total, res = resumen(f.id, desde, hasta)
        bloque = [Paragraph(f"{f.nombre} <font size=9 color='#56656A'>({f.codigo}, {f.descripcion})</font>",
                            st["h2"]),
                  Paragraph(f"{total:,} capturas en el periodo".replace(",", "."), st["small"]),
                  Spacer(1, 2 * mm)]
        data = [["Variable", "Mín.", "Prom.", "Máx.", "Límite", "En alerta", "En peligro"]]
        estilo = [
            ("FONT", (0, 0), (-1, 0), "Helvetica-Bold", 8),
            ("FONT", (0, 1), (-1, -1), "Helvetica", 8),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("BACKGROUND", (0, 0), (-1, 0), PIZARRA),
            ("ALIGN", (1, 0), (-1, -1), "RIGHT"),
            ("LINEBELOW", (0, 1), (-1, -1), 0.4, VETA),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, ROCA]),
            ("TOPPADDING", (0, 0), (-1, -1), 3.5), ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5),
        ]
        for r, (v, cfg) in enumerate(T.VARIABLES.items(), start=1):
            x = res[v]
            data.append([f"{cfg['nombre']} ({cfg['unidad']})", _fmt(x["min"], v), _fmt(x["avg"], v),
                         _fmt(x["max"], v), _limite(v), str(x["alerta"]), str(x["peligro"])])
            if x["alerta"]:
                estilo.append(("TEXTCOLOR", (5, r), (5, r), colors.HexColor("#8A6500")))
                estilo.append(("FONT", (5, r), (5, r), "Helvetica-Bold", 8))
            if x["peligro"]:
                estilo.append(("TEXTCOLOR", (6, r), (6, r), C_PELIGRO))
                estilo.append(("FONT", (6, r), (6, r), "Helvetica-Bold", 8))
        bloque.append(Table(data, colWidths=[52 * mm, 18 * mm, 18 * mm, 18 * mm, 26 * mm, 22 * mm, 22 * mm],
                            style=TableStyle(estilo)))
        story.append(KeepTogether(bloque))

        bucket = max(300, int((hasta - desde).total_seconds() / 300))
        filas = serie(f.id, desde, hasta, bucket, ["temp_efectiva", "ch4", "co", "o2"])
        if filas:
            story.append(Spacer(1, 3 * mm))
            story.append(Image(grafica(f, filas), width=178 * mm, height=158 * mm))

        # Anexo: capturas agregadas del periodo
        b = ANEXO_BUCKET.get(tipo, 3600)
        vars_ = list(T.VARIABLES)
        filas = serie(f.id, desde, hasta, b, vars_)
        if filas:
            story.append(PageBreak())
            story.append(Paragraph(f"Capturas de {f.nombre} (promedio cada {b // 60} min)", st["h2"]))
            cab_t = ["Fecha y hora"] + [T.VARIABLES[v]["corto"] for v in vars_]
            rows = [cab_t] + [[fl[0].astimezone(TZ).strftime("%d/%m %I:%M %p")] +
                              [_fmt(fl[1 + i], v) for i, v in enumerate(vars_)] for fl in filas]
            est = [("FONT", (0, 0), (-1, 0), "Helvetica-Bold", 7), ("FONT", (0, 1), (-1, -1), "Helvetica", 7),
                   ("BACKGROUND", (0, 0), (-1, 0), PIZARRA), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                   ("ALIGN", (1, 0), (-1, -1), "RIGHT"), ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, ROCA]),
                   ("TOPPADDING", (0, 0), (-1, -1), 2), ("BOTTOMPADDING", (0, 0), (-1, -1), 2)]
            for r, fl in enumerate(filas, start=1):
                for i, v in enumerate(vars_):
                    n, _, _ = T.evaluar(v, fl[1 + i])
                    if n == T.PELIGRO:
                        est += [("TEXTCOLOR", (1 + i, r), (1 + i, r), C_PELIGRO),
                                ("FONT", (1 + i, r), (1 + i, r), "Helvetica-Bold", 7)]
                    elif n == T.ALERTA:
                        est += [("TEXTCOLOR", (1 + i, r), (1 + i, r), colors.HexColor("#8A6500"))]
            story.append(Table(rows, repeatRows=1, colWidths=[28 * mm] + [18.75 * mm] * len(vars_),
                               style=TableStyle(est)))
        if idx < len(frentes) - 1:
            story.append(PageBreak())

    def pie(canvas, doc_):
        canvas.saveState()
        canvas.setFont("Helvetica", 7)
        canvas.setFillColor(colors.HexColor("#56656A"))
        canvas.drawString(16 * mm, 9 * mm, "AlpacAire — IMS Alpaca 2026")
        canvas.drawRightString(A4[0] - 16 * mm, 9 * mm, f"Página {doc_.page}")
        canvas.restoreState()

    doc.build(story, onFirstPage=pie, onLaterPages=pie)
    buf.seek(0)
    nombre = f"alpacaire_{tipo}_{desde.astimezone(TZ):%Y%m%d}.pdf"
    return send_file(buf, mimetype="application/pdf", as_attachment=True, download_name=nombre)


@bp.get("/csv")
@requiere("exportar")
def csv_export():
    """Todas las capturas crudas del periodo, para análisis en Excel."""
    try:
        desde, hasta, _etq, tipo = periodo()
    except (KeyError, ValueError):
        return jsonify(error="Revisa las fechas del rango."), 400
    ids = [f.id for f in _frentes()]
    nombres = {f.id: f.nombre for f in Frente.query.all()}
    q = (Lectura.query.filter(Lectura.frente_id.in_(ids), Lectura.ts >= desde, Lectura.ts <= hasta)
         .order_by(Lectura.ts).yield_per(2000))

    def gen():
        yield "\ufeff"  # BOM para que Excel lea las tildes
        out = io.StringIO()
        w = csv.writer(out, delimiter=";")
        w.writerow(["fecha_hora", "frente"] + Lectura.CAMPOS)
        for lec in q:
            w.writerow([lec.ts.astimezone(TZ).strftime("%Y-%m-%d %H:%M:%S"), nombres[lec.frente_id]] +
                       [getattr(lec, c) for c in Lectura.CAMPOS])
            if out.tell() > 64_000:
                yield out.getvalue()
                out.seek(0)
                out.truncate()
        yield out.getvalue()

    return Response(stream_with_context(gen()), mimetype="text/csv",
                    headers={"Content-Disposition": f"attachment; filename=alpacaire_{tipo}_{desde:%Y%m%d}.csv"})
