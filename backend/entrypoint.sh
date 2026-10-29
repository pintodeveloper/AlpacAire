#!/bin/sh
set -e
export FLASK_APP=wsgi.py

# El mismo contenedor sirve como simulador de sensores (MODO=simulador)
if [ "$MODO" = "simulador" ]; then
  exec python simulator.py
fi

# Espera a que PostgreSQL acepte conexiones
python - <<'PY'
import time
from sqlalchemy import create_engine, text
from app import create_app
app = create_app()
url = app.config["SQLALCHEMY_DATABASE_URI"]
for i in range(60):
    try:
        create_engine(url).connect().execute(text("select 1"))
        break
    except Exception as e:
        print(f"Esperando la base de datos ({i + 1}/60)...", flush=True)
        time.sleep(2)
PY

flask seed --dias "${SEED_DIAS:-30}"
exec gunicorn -w "${GUNICORN_WORKERS:-3}" -b "${GUNICORN_BIND:-0.0.0.0:5000}" --timeout 120 --access-logfile - wsgi:app
