FROM node:16.15.0-alpine AS build
WORKDIR /home/node
COPY --chown=node:node package.json package-lock.json ./
RUN npm install
COPY --chown=node:node webpack.config.js ./
COPY --chown=node:node dist ./dist
COPY --chown=node:node src ./src
RUN npm run build:prod
FROM nginxinc/nginx-unprivileged:alpine
COPY --from=build --chown=root:root /home/node/dist /usr/share/nginx/html
