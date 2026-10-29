"""Prueba de humo: siembra 1 día, ingesta, estado, gráficas y PDF."""
import os

os.environ.setdefault("SEED_PASSWORD", "Coqueta2026!")
from app import create_app  # noqa: E402
from app.seed import sembrar  # noqa: E402

app = create_app()
with app.app_context():
    sembrar(dias=1)

c = app.test_client()
tok = c.post("/api/auth/login", json={"usuario": "andrey", "password": "Coqueta2026!"}).get_json()["token"]
H = {"Authorization": f"Bearer {tok}"}

r = c.post("/api/lecturas", headers={"X-API-Key": "sensor-dev-key"},
           json=[{"frente": "FN-01", "temp_seca": 26, "temp_humeda": 23, "velocidad_aire": 1, "ch4": 1.3,
                  "co": 5, "o2": 20.8, "co2": 900, "h2s": 0.1, "no2": 0.05, "humedad_relativa": 80}])
assert r.status_code == 201, r.data
e = c.get("/api/estado", headers=H).get_json()
assert e["nivel"] == "peligro", e["nivel"]
for rango in ("1h", "24h", "7d"):
    assert c.get(f"/api/lecturas?rango={rango}", headers=H).status_code == 200
assert c.get("/api/personal?tipo=obrero", headers=H).status_code == 200
pdf = c.get("/api/reportes/pdf?rango=dia", headers=H)
assert pdf.status_code == 200 and pdf.data[:4] == b"%PDF", pdf.data[:200]
csv = c.get("/api/reportes/csv?rango=dia", headers=H)
assert csv.status_code == 200
tok_ob = c.post("/api/auth/login", json={"usuario": "obrero", "password": "Coqueta2026!"}).get_json()["token"]
assert c.get("/api/reportes/pdf", headers={"Authorization": f"Bearer {tok_ob}"}).status_code == 403
print("OK: estado =", e["nivel"], "| PDF", len(pdf.data), "bytes")
