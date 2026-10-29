import os
import threading
import time

from app import create_app

app = create_app()

# En un despliegue de un solo servicio (Render gratis) el simulador corre como hilo
# dentro de la API. Con gunicorn usar -w 1 para no duplicar lecturas.
if os.getenv("SIMULADOR_INTERNO") == "1":
    os.environ.setdefault("API_URL", f"http://127.0.0.1:{os.getenv('PORT', '5000')}")

    def _simular():
        time.sleep(8)  # esperar a que gunicorn acepte conexiones
        import simulator

        simulator.main()

    threading.Thread(target=_simular, name="simulador", daemon=True).start()
