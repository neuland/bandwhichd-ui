FROM node:16.17.0-alpine AS build
WORKDIR /home/node
COPY --chown=node:node \
    package.json \
    yarn.lock \
    ./
RUN yarn install --check-files
COPY --chown=node:node \
    index.html \
    tsconfig.json \
    tsconfig.node.json \
    vite.config.ts \
    ./
COPY --chown=node:node mocks ./mocks
COPY --chown=node:node public ./public
COPY --chown=node:node src ./src
COPY --chown=node:node vite-plugin-serve-handler ./vite-plugin-serve-handler
RUN yarn build
FROM nginxinc/nginx-unprivileged:alpine
COPY nginx.conf /etc/nginx/templates/default.conf.template
LABEL org.opencontainers.image.authors="neuland Open Source Maintainers <opensource@neuland-bfi.de>"
LABEL org.opencontainers.image.url="https://github.com/neuland/bandwhichd-ui"
LABEL org.opencontainers.image.documentation="https://github.com/neuland/bandwhichd-ui"
LABEL org.opencontainers.image.source="https://github.com/neuland/bandwhichd-ui"
LABEL org.opencontainers.image.vendor="neuland – Büro für Informatik GmbH"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.title="bandwhichd-ui"
LABEL org.opencontainers.image.description="bandwhichd ui displaying network topology and statistics"
LABEL org.opencontainers.image.version="0.6.2"
COPY --from=build --chown=root:root /home/node/dist /usr/share/nginx/html