"""Simulador de sensores: envía una lectura por frente cada INTERVALO segundos.

En producción se reemplaza por los sensores reales, que hacen el mismo
POST /api/lecturas con el header X-API-Key.
"""
import os
import time

import requests

from app.simulacion import ESCENARIOS, Generador

API = os.getenv("API_URL", "http://api:5000").rstrip("/")
KEY = os.getenv("SENSOR_API_KEY", "sensor-dev-key")
INTERVALO = float(os.getenv("INTERVALO_S", "5"))
CODIGOS = os.getenv("FRENTES", "FN-01,FS-02,FE-03,FO-04").split(",")
H = {"X-API-Key": KEY}


def escenario():
    try:
        return requests.get(f"{API}/api/simulacion", headers=H, timeout=3).json().get("escenario", "normal")
    except Exception:
        return "normal"


def main():
    gen = Generador(len(CODIGOS))
    print(f"Simulador enviando a {API} cada {INTERVALO}s", flush=True)
    while True:
        esc = ESCENARIOS.get(escenario(), {})
        lote = [{"frente": c, **gen.paso(i, esc.get(i))} for i, c in enumerate(CODIGOS)]
        try:
            r = requests.post(f"{API}/api/lecturas", json=lote, headers=H, timeout=5)
            r.raise_for_status()
        except Exception as e:
            print(f"No se pudo enviar el lote: {e}", flush=True)
        time.sleep(INTERVALO)


if __name__ == "__main__":
    main()
