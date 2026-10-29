# Imagen única: compila el frontend y lo sirve desde la API Flask.
# La usa render.yaml; docker-compose.yml sigue usando backend/ y frontend/ por separado.
FROM node:20-alpine AS web
WORKDIR /web
COPY frontend/package*.json ./
RUN npm install --no-audit --no-fund
COPY frontend/ .
ARG VITE_DEMO_PASSWORD=""
ENV VITE_DEMO_PASSWORD=$VITE_DEMO_PASSWORD
RUN npm run build

FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 MPLCONFIGDIR=/tmp/mpl TZ=America/Bogota \
    STATIC_DIR=/app/static_web
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
COPY --from=web /web/dist /app/static_web
RUN sed -i "s/\r$//" entrypoint.sh && chmod +x entrypoint.sh
EXPOSE 5000
CMD ["./entrypoint.sh"]
