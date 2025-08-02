# ----------- Base image mit Node.js 22 -----------
FROM node:22-alpine AS builder

# Arbeitsverzeichnis setzen
WORKDIR /app

# Pakete & Lockfile kopieren
COPY package.json package-lock.json ./

# Nur Production-Dependencies installieren (optional)
RUN npm ci --omit=dev

# Quellcode kopieren
COPY . .

# Vite Build
RUN npm run build


# ----------- Finales, schlankes Image zum Ausliefern -----------
FROM nginx:alpine

# Arbeitsverzeichnis für Nginx
WORKDIR /usr/share/nginx/html

# Baue die Produktionsdateien ein
COPY --from=builder /app/dist .

# Optional: Eigene nginx.conf überschreiben
# COPY nginx.conf /etc/nginx/nginx.conf

# Exponiere Port 80
EXPOSE 80

# Standard-Startbefehl
CMD ["nginx", "-g", "daemon off;"]