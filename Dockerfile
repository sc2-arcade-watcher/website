# syntax = docker/dockerfile:1.4.2-labs

FROM node:12-alpine as build-stage

RUN <<EOF
    mkdir /app
    chown node:node /app
EOF

ENV YARN_CACHE_FOLDER=/tmp/.yarn_cache

WORKDIR /app

COPY package.json yarn.lock ./

RUN --mount=type=cache,target=/tmp/.yarn_cache <<EOF
    set -eux
    yarn install --pure-lockfile --no-interactive
EOF

COPY ./ .

RUN <<EOF
    set -eux
    yarn run build
EOF

FROM macbre/nginx-http3:1.23.1 as production-stage

ENV NGINX_DOMAIN=sc2arcade.localhost
ENV NGINX_WORKER_PROCESSES=auto
ENV NGINX_WORKER_CONNECTIONS=1024
ENV NGINX_PORT=80
ENV NGINX_SECURE_PORT=443
ENV NGINX_UPLOAD_MAX_FILESIZE=64M

ENV NGINX_GZIP=on
ENV NGINX_GZIP_COMP_LEVEL=4

ENV NGINX_BROTLI=on
ENV NGINX_BROTLI_COMP_LEVEL=6

ENV NGINX_PROXY_CONNECT_TIMEOUT=10s
ENV NGINX_PROXY_SEND_TIMEOUT=60s
ENV NGINX_PROXY_READ_TIMEOUT=60s

RUN <<EOF
    set -eux
    apk add --no-cache \
        bash \
        openssl
EOF

COPY nginx/nginx-entrypoint.sh /
COPY nginx/conf/server.nginx.template /etc/nginx/
COPY nginx/conf/vhost.nginx.template /etc/nginx/conf.d/

RUN mkdir /app
COPY --from=build-stage /app/dist /app

EXPOSE 80/tcp
EXPOSE 443/tcp
EXPOSE 443/udp

ENTRYPOINT [ "/nginx-entrypoint.sh" ]
CMD [ "nginx", "-g", "daemon off;" ]

# COPY nginx.conf /etc/nginx/nginx.conf