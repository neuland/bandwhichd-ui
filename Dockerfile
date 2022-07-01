FROM node:16.15.0-alpine AS build
WORKDIR /home/node
COPY --chown=node:node package.json package-lock.json ./
RUN npm install
COPY --chown=node:node webpack.config.js ./
COPY --chown=node:node dist ./dist
COPY --chown=node:node src ./src
RUN npm run build:prod
FROM nginxinc/nginx-unprivileged:alpine
LABEL org.opencontainers.image.authors="neuland Open Source Maintainers <opensource@neuland-bfi.de>"
LABEL org.opencontainers.image.url="https://github.com/neuland/bandwhichd-ui"
LABEL org.opencontainers.image.documentation="https://github.com/neuland/bandwhichd-ui"
LABEL org.opencontainers.image.source="https://github.com/neuland/bandwhichd-ui"
LABEL org.opencontainers.image.vendor="neuland – Büro für Informatik GmbH"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.title="bandwhichd-ui"
LABEL org.opencontainers.image.description="bandwhichd ui displaying network topology and statistics"
LABEL org.opencontainers.image.version="0.0.2"
COPY --from=build --chown=root:root /home/node/dist /usr/share/nginx/html
