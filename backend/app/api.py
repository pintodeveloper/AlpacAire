import math
from datetime import datetime, timedelta, timezone

from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import get_jwt, jwt_required
from sqlalchemy import func, literal_column

from . import thresholds as T
from .auth import PERMISOS, requiere, usuario_actual
from .extensions import db
from .models import ROLES, Ajuste, Frente, Lectura, Observacion, Persona, Usuario

bp = Blueprint("api", __name__)

SENSOR_TIMEOUT_S = 30
RANGOS = {"1h": 3600, "6h": 6 * 3600, "24h": 86400, "7d": 7 * 86400, "30d": 30 * 86400}


def _utc(dt):
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def _parse_fecha(s):
    if not s:
        return None
    return _utc(datetime.fromisoformat(s.replace("Z", "+00:00")))


# ---------------------------------------------------------------- catálogos
@bp.get("/umbrales")
@jwt_required()
def umbrales():
    return {"variables": T.VARIABLES, "informativas": T.VARIABLES_INFO,
            "permanencia_te": T.PERMANENCIA_TE, "mina": current_app.config["MINA_NOMBRE"]}


@bp.get("/frentes")
@requiere("frentes")
def frentes():
    return jsonify([f.to_dict() for f in Frente.query.order_by(Frente.id)])


# ---------------------------------------------------------------- estado
def evaluar_lectura(lec: Lectura):
    variables, acciones, nivel = {}, [], T.NORMAL
    for key in T.VARIABLES:
        valor = getattr(lec, key)
        n, riesgo, accion = T.evaluar(key, valor)
        variables[key] = {"valor": valor, "nivel": T.NIVEL_NOMBRE[n], "riesgo": riesgo}
        if n > T.NORMAL and accion:
            acciones.append({"variable": key, "nivel": T.NIVEL_NOMBRE[n], "texto": accion})
        nivel = max(nivel, n)
    for key in T.VARIABLES_INFO:
        variables[key] = {"valor": getattr(lec, key), "nivel": "info", "riesgo": None}
    return nivel, variables, acciones


@bp.get("/estado")
@requiere("situacion")
def estado():
    ahora = datetime.now(timezone.utc)
    salida, global_n, acciones_glob = [], T.NORMAL, []
    personas = dict(
        db.session.query(Persona.frente_id, func.count(Persona.id))
        .filter(Persona.activo.is_(True)).group_by(Persona.frente_id).all()
    )
    for f in Frente.query.order_by(Frente.id):
        lec = Lectura.query.filter_by(frente_id=f.id).order_by(Lectura.ts.desc()).first()
        item = f.to_dict()
        item["personas"] = personas.get(f.id, 0)
        if not lec:
            item.update(nivel="sin_datos", lectura=None, variables={}, acciones=[])
            n = T.ALERTA
            acciones = [{"variable": None, "nivel": "alerta",
                         "texto": "Este frente aún no tiene lecturas. Verificar la instalación de los sensores."}]
        else:
            n, variables, acciones = evaluar_lectura(lec)
            edad = (ahora - _utc(lec.ts)).total_seconds()
            item.update(lectura_ts=_utc(lec.ts).isoformat(), variables=variables, edad_s=round(edad))
            if edad > SENSOR_TIMEOUT_S and n < T.PELIGRO:
                n = max(n, T.ALERTA)
                acciones.insert(0, {"variable": None, "nivel": "alerta",
                                    "texto": f"Los sensores no reportan hace {int(edad // 60)} min {int(edad % 60)} s. Verificar comunicación."})
                item["nivel"] = "sin_datos"
            else:
                item["nivel"] = T.NIVEL_NOMBRE[n]
        item["acciones"] = acciones
        for a in acciones:
            acciones_glob.append({**a, "frente": f.nombre, "frente_id": f.id})
        global_n = max(global_n, n)
        salida.append(item)

    acciones_glob.sort(key=lambda a: a["nivel"] != "peligro")
    return {"nivel": T.NIVEL_NOMBRE[global_n], "generado": ahora.isoformat(),
            "frentes": salida, "acciones": acciones_glob}


# ---------------------------------------------------------------- lecturas
@bp.get("/lecturas")
@requiere("detalles")
def lecturas():
    ahora = datetime.now(timezone.utc)
    hasta = _parse_fecha(request.args.get("hasta")) or ahora
    desde = _parse_fecha(request.args.get("desde"))
    if not desde:
        desde = hasta - timedelta(seconds=RANGOS.get(request.args.get("rango", "1h"), 3600))
    rango_s = max(60, (hasta - desde).total_seconds())

    ids = [int(x) for x in request.args.get("frente_id", "").split(",") if x.strip().isdigit()]
    claves = [v for v in request.args.get("vars", "").split(",") if v in Lectura.CAMPOS] or list(T.VARIABLES)

    bucket = math.ceil(rango_s / 400 / 5) * 5  # ~400 puntos por serie
    filtros = [Lectura.ts >= desde, Lectura.ts <= hasta]
    if ids:
        filtros.append(Lectura.frente_id.in_(ids))

    if bucket <= 5:
        cols = [Lectura.frente_id, Lectura.ts] + [getattr(Lectura, c) for c in claves]
        filas = db.session.query(*cols).filter(*filtros).order_by(Lectura.ts).all()
    else:
        b = func.to_timestamp(func.floor(func.extract("epoch", Lectura.ts) / literal_column(str(int(bucket)))) * literal_column(str(int(bucket))))
        cols = [Lectura.frente_id, b.label("ts")] + [func.avg(getattr(Lectura, c)).label(c) for c in claves]
        filas = (db.session.query(*cols).filter(*filtros)
                 .group_by(Lectura.frente_id, b).order_by(b).all())

    series = {}
    for fila in filas:
        punto = {"ts": _utc(fila[1]).isoformat()}
        for i, c in enumerate(claves):
            v = fila[2 + i]
            punto[c] = None if v is None else round(float(v), 3)
        series.setdefault(str(fila[0]), []).append(punto)
    return {"desde": desde.isoformat(), "hasta": hasta.isoformat(), "bucket_s": max(bucket, 5),
            "variables": claves, "series": series}


@bp.post("/lecturas")
def recibir_lecturas():
    """Endpoint de ingesta para los sensores (o el simulador). Requiere X-API-Key."""
    if request.headers.get("X-API-Key") != current_app.config["SENSOR_API_KEY"]:
        return jsonify(error="API key de sensor inválida."), 401
    data = request.get_json(silent=True)
    items = data if isinstance(data, list) else [data] if data else []
    codigos = {f.codigo: f.id for f in Frente.query.all()}
    creadas = 0
    for it in items:
        fid = it.get("frente_id") or codigos.get(it.get("frente"))
        if not fid:
            continue
        lec = Lectura(frente_id=fid, ts=_parse_fecha(it.get("ts")) or datetime.now(timezone.utc))
        for c in Lectura.CAMPOS:
            if it.get(c) is not None:
                setattr(lec, c, float(it[c]))
        if lec.temp_efectiva is None and lec.temp_humeda is not None and lec.temp_seca is not None:
            lec.temp_efectiva = T.temperatura_efectiva(lec.temp_humeda, lec.temp_seca, lec.velocidad_aire or 0)
        db.session.add(lec)
        creadas += 1
    db.session.commit()
    return {"creadas": creadas}, 201


# ---------------------------------------------------------------- personal
CAMPOS_PERSONA = ["nombre", "documento", "cargo", "maquina", "turno", "frente_id", "activo"]


@bp.get("/personal")
@jwt_required()
def personal():
    tipo = request.args.get("tipo", "obrero")
    permiso = "operarios" if tipo == "operario" else "obreros"
    if permiso not in PERMISOS.get(get_jwt().get("rol"), set()):
        return jsonify(error="Tu rol no tiene acceso a esta sección."), 403
    q = Persona.query.filter_by(tipo=tipo).order_by(Persona.nombre)
    return jsonify([p.to_dict() for p in q])


@bp.post("/personal")
@requiere("editar_personal")
def crear_persona():
    d = request.get_json(silent=True) or {}
    if not (d.get("nombre") or "").strip() or d.get("tipo") not in ("operario", "obrero"):
        return jsonify(error="Escribe el nombre y elige si es operario u obrero."), 400
    p = Persona(tipo=d["tipo"])
    for c in CAMPOS_PERSONA:
        if c in d:
            setattr(p, c, d[c] if d[c] != "" else None)
    db.session.add(p)
    db.session.commit()
    return p.to_dict(), 201


@bp.put("/personal/<int:pid>")
@requiere("editar_personal")
def editar_persona(pid):
    p = db.get_or_404(Persona, pid)
    d = request.get_json(silent=True) or {}
    for c in CAMPOS_PERSONA:
        if c in d:
            setattr(p, c, d[c] if d[c] != "" else None)
    db.session.commit()
    return p.to_dict()


@bp.delete("/personal/<int:pid>")
@requiere("editar_personal")
def borrar_persona(pid):
    p = db.get_or_404(Persona, pid)
    db.session.delete(p)
    db.session.commit()
    return {"ok": True}


# ---------------------------------------------------------------- usuarios
@bp.get("/usuarios")
@requiere("usuarios")
def usuarios():
    return jsonify([u.to_dict() for u in Usuario.query.order_by(Usuario.id)])


@bp.post("/usuarios")
@requiere("usuarios")
def crear_usuario():
    d = request.get_json(silent=True) or {}
    if d.get("rol") not in ROLES or not d.get("usuario") or not d.get("password"):
        return jsonify(error="Usuario, contraseña y rol son obligatorios."), 400
    if Usuario.query.filter_by(usuario=d["usuario"].lower()).first():
        return jsonify(error="Ese nombre de usuario ya existe."), 409
    u = Usuario(usuario=d["usuario"].lower(), nombre=d.get("nombre") or d["usuario"], rol=d["rol"])
    u.set_password(d["password"])
    db.session.add(u)
    db.session.commit()
    return u.to_dict(), 201


# ---------------------------------------------------------------- observaciones
@bp.get("/observaciones")
@requiere("observaciones")
def observaciones():
    q = Observacion.query.order_by(Observacion.ts.desc()).limit(30)
    return jsonify([o.to_dict() for o in q])


@bp.post("/observaciones")
@requiere("escribir_observaciones")
def crear_observacion():
    texto = ((request.get_json(silent=True) or {}).get("texto") or "").strip()
    if not texto:
        return jsonify(error="Escribe la observación antes de enviarla."), 400
    o = Observacion(autor_id=usuario_actual().id, texto=texto)
    db.session.add(o)
    db.session.commit()
    return o.to_dict(), 201


@bp.post("/observaciones/<int:oid>/leida")
@requiere("usuarios")
def marcar_leida(oid):
    o = db.get_or_404(Observacion, oid)
    o.leida = True
    db.session.commit()
    return o.to_dict()


# ---------------------------------------------------------------- simulador
@bp.get("/simulacion")
def leer_escenario():
    """El simulador consulta aquí qué escenario reproducir (con su API key)."""
    if request.headers.get("X-API-Key") != current_app.config["SENSOR_API_KEY"]:
        return jsonify(error="API key de sensor inválida."), 401
    return {"escenario": Ajuste.leer("escenario", "normal")}


@bp.put("/simulacion")
@requiere("usuarios")
def cambiar_escenario():
    esc = (request.get_json(silent=True) or {}).get("escenario")
    if esc not in ("normal", "alerta", "peligro"):
        return jsonify(error="Escenario no válido."), 400
    Ajuste.escribir("escenario", esc)
    return {"escenario": esc}


@bp.get("/simulacion/estado")
@requiere("usuarios")
def ver_escenario():
    return {"escenario": Ajuste.leer("escenario", "normal")}
