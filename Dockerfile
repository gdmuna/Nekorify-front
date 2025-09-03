ARG VERSION="22-slim"

FROM node:${VERSION} AS builder
WORKDIR /app
COPY . .
RUN npm ci --only=production && npm prune --production && npm run build

FROM nginx:alpine
EXPOSE 80
ENV NODE_ENV=production
WORKDIR /app
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
