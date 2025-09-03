ARG VERSION="22-slim"

FROM node:${VERSION} AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
EXPOSE 80
WORKDIR /app
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
