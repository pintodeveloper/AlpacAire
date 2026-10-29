"""Historial de eventos: agrupa las lecturas fuera de rango en episodios por frente."""
from datetime import datetime, timedelta, timezone

from flask import Blueprint, request
from sqlalchemy import or_

from . import thresholds as T
from .auth import requiere
from .extensions import db
from .models import Frente, Lectura

bp = Blueprint("historial", __name__)

RANGOS = {"24h": 86400, "7d": 7 * 86400, "30d": 30 * 86400}
# Si entre dos lecturas fuera de rango pasan más de esto, son episodios distintos.
SEPARACION_S = 10 * 60
MAX_FILAS = 60000


def condicion_fuera_de_rango():
    conds = []
    for v, cfg in T.VARIABLES.items():
        col = getattr(Lectura, v)
        if cfg.get("alerta_max") is not None:
            conds.append(col > cfg["alerta_max"])
        if cfg.get("alerta_min") is not None:
            conds.append(col < cfg["alerta_min"])
    return or_(*conds)


def agrupar_episodios(filas, separacion_s=SEPARACION_S):
    """filas: dicts con frente_id, ts (datetime) y variables, ordenadas por frente y ts.

    Devuelve episodios con inicio, fin, nivel máximo y, por variable afectada,
    el peor valor registrado.
    """
    episodios, actual = [], None
    for f in filas:
        hallazgos = {}
        nivel = T.NORMAL
        for v in T.VARIABLES:
            n, riesgo, _ = T.evaluar(v, f.get(v))
            if n > T.NORMAL:
                hallazgos[v] = (n, f[v], riesgo)
                nivel = max(nivel, n)
        if nivel == T.NORMAL:
            continue
        nuevo = (actual is None or actual["frente_id"] != f["frente_id"]
                 or (f["ts"] - actual["fin"]).total_seconds() > separacion_s)
        if nuevo:
            actual = {"frente_id": f["frente_id"], "inicio": f["ts"], "fin": f["ts"],
                      "nivel": nivel, "lecturas": 0, "variables": {}}
            episodios.append(actual)
        actual["fin"] = f["ts"]
        actual["nivel"] = max(actual["nivel"], nivel)
        actual["lecturas"] += 1
        for v, (n, valor, riesgo) in hallazgos.items():
            prev = actual["variables"].get(v)
            # "peor" valor: el más alto, salvo oxígeno bajo (el más bajo)
            peor = valor if prev is None else (
                min(prev["peor"], valor) if v == "o2" and valor < T.VARIABLES["o2"]["alerta_min"] else max(prev["peor"], valor))
            actual["variables"][v] = {"nivel": max(n, prev["nivel"] if prev else 0), "peor": peor, "riesgo": riesgo}
    return episodios


@bp.get("/historial")
@requiere("situacion")
def historial():
    ahora = datetime.now(timezone.utc)
    rango = request.args.get("rango", "7d")
    desde = ahora - timedelta(seconds=RANGOS.get(rango, RANGOS["7d"]))
    q = Lectura.query.filter(Lectura.ts >= desde, condicion_fuera_de_rango())
    fid = request.args.get("frente_id", "")
    if fid.isdigit():
        q = q.filter(Lectura.frente_id == int(fid))
    filas = [
        {"frente_id": l.frente_id, "ts": l.ts if l.ts.tzinfo else l.ts.replace(tzinfo=timezone.utc),
         **{v: getattr(l, v) for v in T.VARIABLES}}
        for l in q.order_by(Lectura.frente_id, Lectura.ts).limit(MAX_FILAS)
    ]
    nombres = {f.id: f.nombre for f in Frente.query.all()}
    salida = []
    for e in agrupar_episodios(filas):
        salida.append({
            "frente_id": e["frente_id"],
            "frente": nombres.get(e["frente_id"], str(e["frente_id"])),
            "inicio": e["inicio"].isoformat(),
            "fin": e["fin"].isoformat(),
            "duracion_s": int((e["fin"] - e["inicio"]).total_seconds()),
            "en_curso": (ahora - e["fin"]).total_seconds() < 60,
            "nivel": T.NIVEL_NOMBRE[e["nivel"]],
            "lecturas": e["lecturas"],
            "variables": [
                {"clave": v, "nombre": T.VARIABLES[v]["nombre"], "unidad": T.VARIABLES[v]["unidad"],
                 "nivel": T.NIVEL_NOMBRE[d["nivel"]], "peor": d["peor"], "riesgo": d["riesgo"]}
                for v, d in sorted(e["variables"].items(), key=lambda x: -x[1]["nivel"])
            ],
        })
    salida.sort(key=lambda e: e["inicio"], reverse=True)
    return {"rango": rango, "desde": desde.isoformat(), "hasta": ahora.isoformat(),
            "truncado": len(filas) >= MAX_FILAS, "episodios": salida}
