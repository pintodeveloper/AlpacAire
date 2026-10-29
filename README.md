# AlpacAire

Monitoreo atmosférico en tiempo real para la mina subterránea de carbón ficticia **"La coqueta"** (Cúcuta).
Los sensores envían lecturas a una API Flask, que las guarda en PostgreSQL y las evalúa contra los límites del
**Decreto 1886 de 2015**. El frontend en React consulta el estado cada 5 segundos y hace sonar una sirena cuando
hay que evacuar.

```
sensores / simulador ──POST /api/lecturas──▶ Flask API ──▶ PostgreSQL (volumen persistente)
                                               ▲
navegador ◀── Nginx (React compilado) ──/api───┘   (sondeo cada 5 s)
```

## Arranque rápido (Docker)

Requisitos: Docker Desktop.

```powershell
cd C:\Users\pc11\Documents\AlpacAire
copy .env.example .env      # opcional: cambia claves
docker compose up -d --build
```

Abre <http://localhost:8080>. La primera vez se crean las tablas y 30 días de historia simulada.

| Usuario      | Rol              | Contraseña     |
|--------------|------------------|----------------|
| `andrey`     | Ingeniero (admin)| `Coqueta2026!` |
| `sst`        | Supervisor SST   | `Coqueta2026!` |
| `dueno`      | Dueño de la mina | `Coqueta2026!` |
| `ministerio` | Ministerio       | `Coqueta2026!` |
| `operario`   | Operario         | `Coqueta2026!` |
| `obrero`     | Obrero           | `Coqueta2026!` |

**Para la demo:** entra como `andrey`, ve a *Situación actual* y usa el selector *Simulador de sensores*
(Normal / Alerta / Peligro). En unos 20 a 40 s los valores cambian y en *Peligro* suena la sirena.

Comandos útiles:

```powershell
docker compose logs -f api          # ver la API
docker compose exec api flask reset-db   # borrar y volver a sembrar
docker compose down                 # detener (los datos se conservan)
docker compose down -v              # detener y BORRAR la base de datos
```

## Qué puede hacer cada rol

| Sección            | Ingeniero | SST | Dueño | Ministerio | Operario | Obrero |
|--------------------|:-:|:-:|:-:|:-:|:-:|:-:|
| Situación actual   | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Frentes            | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Detalles (gráficas)| ✔ | ✔ | ✔ | ✔ | ✔ |   |
| Operarios / Obreros| ✔ (edita) | ✔ (edita) | ✔ | ✔ |   |   |
| Exportar PDF / CSV | ✔ | ✔ | ✔ | ✔ |   |   |
| Normatividad y políticas, Formatos | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Simulador / usuarios | ✔ | | | | | |

Los permisos viven en `backend/app/auth.py` (`PERMISOS`).

## Límites usados (Decreto 1886 de 2015)

| Variable | Alerta | Peligro (evacuar) | Base |
|---|---|---|---|
| Temperatura efectiva | > 28 °C | > 31 °C | arts. 217 y 218 (te = 0,7·th + 0,3·ts − V) |
| Metano (CH₄) | > 0,5 % | > 1,0 % | art. 53 |
| Oxígeno (O₂) | < 20 % o > 22,5 % | < 19,5 % (hipoxia) o > 23,5 % (conflagración) | art. 7 |
| Monóxido de carbono | > 25 ppm | > 50 ppm | art. 74 → TLV ACGIH |
| Dióxido de carbono | > 5 000 ppm | > 30 000 ppm | TLV ACGIH TWA / STEL |
| Ácido sulfhídrico | > 1 ppm | > 5 ppm | TLV ACGIH TWA / STEL |
| Dióxido de nitrógeno | > 0,2 ppm | > 0,6 ppm | TLV ACGIH TWA (excursión 3×) |
| Humedad relativa | > 90 % | — | referencia operativa (el decreto no la fija) |

El decreto fija directamente metano, oxígeno y temperatura efectiva; para los gases tóxicos remite a los TLV de la
ACGIH (art. 74). El umbral de **peligro** de esos gases es un criterio del equipo (STEL o excursión de la ACGIH):
revísenlo con el jurado o el ingeniero de la mina. Todo es configurable en `backend/app/thresholds.py`.

Si un frente deja de reportar por más de 30 s, pasa a *Alerta* ("Los sensores no reportan").

## Conectar sensores reales

```http
POST /api/lecturas
X-API-Key: <SENSOR_API_KEY>
Content-Type: application/json

[{ "frente": "FN-01", "temp_seca": 26.1, "temp_humeda": 22.8, "velocidad_aire": 1.1,
   "humedad_relativa": 79, "co": 4.2, "ch4": 0.21, "o2": 20.8, "co2": 1050, "h2s": 0.12, "no2": 0.05 }]
```

`temp_efectiva` se calcula si no se envía. El servicio `simulator` hace exactamente esto cada 5 s; al tener
sensores reales basta con quitarlo del `docker-compose.yml`.

## Desarrollo sin Docker

```powershell
# Base de datos
docker compose up -d db
# API
cd backend
python -m venv .venv; .venv\Scripts\activate
pip install -r requirements.txt
$env:DATABASE_URL="postgresql://alpacaire:alpacaire@localhost:5432/alpacaire"; $env:FLASK_APP="wsgi.py"
flask seed; flask run
# Simulador (otra terminal)
$env:API_URL="http://localhost:5000"; python simulator.py
# Frontend (otra terminal)
cd frontend; npm install; npm run dev     # http://localhost:5173
```

> Para el desarrollo local, el puerto 5432 de la base no está publicado; agrega `ports: ["5432:5432"]` al
> servicio `db` si lo necesitas.

## Despliegue en Railway (recomendado)

Un proyecto de Railway con 4 servicios, todos desde este repositorio:

| Servicio (nombre exacto) | Origen | Root Directory | Variables |
|---|---|---|---|
| `Postgres` | Database → PostgreSQL | — | (las crea Railway) |
| `api` | GitHub repo | `/backend` | `DATABASE_URL=${{Postgres.DATABASE_URL}}`, `GUNICORN_BIND=[::]:5000`, `JWT_SECRET_KEY`, `SENSOR_API_KEY`, `SEED_PASSWORD` |
| `simulador` | GitHub repo | `/backend` | `MODO=simulador`, `API_URL=http://api.railway.internal:5000`, `SENSOR_API_KEY=${{api.SENSOR_API_KEY}}` |
| `web` | GitHub repo | `/frontend` | `API_UPSTREAM=http://api.railway.internal:5000`, opcional `VITE_DEMO_PASSWORD` |

Solo `web` lleva dominio público (Settings → Networking → Generate Domain). Cada push a `main` redespliega.

## Despliegue en un servidor propio

Cada push a `main` ejecuta GitHub Actions: prueba la API contra PostgreSQL (`backend/tests/smoke_test.py`),
compila el frontend y publica las imágenes en `ghcr.io/pintodeveloper/alpacaire-api` y `alpacaire-web`.

```bash
sudo apt install -y docker.io docker-compose-v2 git
git clone https://github.com/pintodeveloper/AlpacAire.git && cd AlpacAire
cp .env.example .env && nano .env          # claves reales
sudo docker compose up -d --build
```

## Estructura

```
backend/   Flask: app/ (api, auth, reportes PDF, umbrales, modelos, simulación), simulator.py
frontend/  React + TypeScript + Vite; Nginx sirve el build y hace proxy de /api
img/       logo original
```
