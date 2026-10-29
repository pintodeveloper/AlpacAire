from functools import wraps

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, jwt_required

from .extensions import db
from .models import Usuario

bp = Blueprint("auth", __name__)

# Qué puede hacer cada rol. El frontend usa la misma lista para armar el menú.
PERMISOS = {
    "ingeniero": {"situacion", "frentes", "detalles", "operarios", "obreros", "exportar",
                  "editar_personal", "usuarios", "observaciones"},
    "supervisor_sst": {"situacion", "frentes", "detalles", "operarios", "obreros", "exportar",
                       "editar_personal", "observaciones", "escribir_observaciones"},
    "dueno": {"situacion", "frentes", "detalles", "operarios", "obreros", "exportar"},
    "ministerio": {"situacion", "frentes", "detalles", "operarios", "obreros", "exportar",
                   "observaciones", "escribir_observaciones"},
    "operario": {"situacion", "frentes", "detalles"},
    "obrero": {"situacion", "frentes"},
}


def usuario_actual():
    return db.session.get(Usuario, int(get_jwt_identity()))


def requiere(permiso):
    def deco(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*a, **kw):
            rol = get_jwt().get("rol")
            if permiso not in PERMISOS.get(rol, set()):
                return jsonify(error="Tu rol no tiene acceso a esta sección."), 403
            return fn(*a, **kw)

        return wrapper

    return deco


def _payload(u):
    d = u.to_dict()
    d["permisos"] = sorted(PERMISOS.get(u.rol, set()))
    return d


@bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    u = Usuario.query.filter_by(usuario=(data.get("usuario") or "").strip().lower()).first()
    if not u or not u.activo or not u.check_password(data.get("password") or ""):
        return jsonify(error="Usuario o contraseña incorrectos."), 401
    token = create_access_token(identity=str(u.id), additional_claims={"rol": u.rol})
    return {"token": token, "usuario": _payload(u)}


@bp.get("/me")
@jwt_required()
def me():
    u = usuario_actual()
    if not u or not u.activo:
        return jsonify(error="Usuario inactivo."), 401
    return _payload(u)
