FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
# Si se define, la pantalla de ingreso muestra los usuarios de demostración con esta contraseña.
ARG VITE_DEMO_PASSWORD=""
ENV VITE_DEMO_PASSWORD=$VITE_DEMO_PASSWORD
RUN npm run build

FROM nginx:1.27-alpine
# PORT lo asigna el host (Railway usa su propia variable); API_UPSTREAM es la dirección interna de la API.
ENV PORT=80 API_UPSTREAM=http://api:5000
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
