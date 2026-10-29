import os
from datetime import timedelta

from flask import Flask, jsonify
from flask_cors import CORS

from .extensions import db, jwt


def create_app():
    app = Flask(__name__)
    db_url = os.getenv("DATABASE_URL", "postgresql+psycopg://alpacaire:alpacaire@localhost:5432/alpacaire")
    if db_url.startswith("postgres://"):  # Render/Heroku entregan este prefijo
        db_url = db_url.replace("postgres://", "postgresql+psycopg://", 1)
    elif db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)

    app.config.update(
        SQLALCHEMY_DATABASE_URI=db_url,
        SQLALCHEMY_ENGINE_OPTIONS={"pool_pre_ping": True},
        JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", "cambia-esta-clave-en-produccion-alpacaire"),
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=int(os.getenv("JWT_HORAS", "12"))),
        SENSOR_API_KEY=os.getenv("SENSOR_API_KEY", "sensor-dev-key"),
        MINA_NOMBRE=os.getenv("MINA_NOMBRE", 'Mina "La coqueta"'),
        JSON_SORT_KEYS=False,
    )

    db.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": os.getenv("CORS_ORIGINS", "*")}})

    from .auth import bp as auth_bp
    from .api import bp as api_bp
    from .reportes import bp as rep_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(rep_bp, url_prefix="/api/reportes")

    @app.get("/api/salud")
    def salud():
        return {"ok": True}

    @jwt.unauthorized_loader
    def _sin_token(msg):
        return jsonify(error="Inicia sesión para continuar."), 401

    @jwt.expired_token_loader
    def _expirado(_h, _p):
        return jsonify(error="Tu sesión expiró. Inicia sesión de nuevo."), 401

    # Despliegue de un solo servicio: Flask también entrega el frontend compilado.
    static_dir = os.getenv("STATIC_DIR")
    if static_dir and os.path.isdir(static_dir):
        from flask import abort, send_from_directory

        @app.get("/")
        @app.get("/<path:ruta>")
        def frontend(ruta=""):
            if ruta.startswith("api/"):
                abort(404)
            archivo = os.path.join(static_dir, ruta)
            if ruta and os.path.isfile(archivo):
                return send_from_directory(static_dir, ruta, max_age=31536000 if ruta.startswith("assets/") else 0)
            return send_from_directory(static_dir, "index.html", max_age=0)

    from .seed import register_cli

    register_cli(app)
    return app
