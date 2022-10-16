#!/usr/bin/env bash

set -eu

export NGINX_DOMAIN=${NGINX_DOMAIN:-site.localhost}
export NGINX_WORKER_PROCESSES=${NGINX_WORKER_PROCESSES:-1}
export NGINX_WORKER_CONNECTIONS=${NGINX_WORKER_CONNECTIONS:-1024}
export NGINX_PORT=${NGINX_PORT:-80}
export NGINX_SECURE_PORT=${NGINX_SECURE_PORT:-443}
export NGINX_UPLOAD_MAX_FILESIZE=${NGINX_UPLOAD_MAX_FILESIZE:-64M}

export NGINX_GZIP=${NGINX_GZIP:-on}
export NGINX_GZIP_COMP_LEVEL=${NGINX_GZIP_COMP_LEVEL:-2}

export NGINX_BROTLI=${NGINX_BROTLI:-on}
export NGINX_BROTLI_COMP_LEVEL=${NGINX_BROTLI_COMP_LEVEL:-4}

export NGINX_PROXY_CONNECT_TIMEOUT=${NGINX_PROXY_CONNECT_TIMEOUT:-10s}
export NGINX_PROXY_SEND_TIMEOUT=${NGINX_PROXY_SEND_TIMEOUT:-300s}
export NGINX_PROXY_READ_TIMEOUT=${NGINX_PROXY_READ_TIMEOUT:-300s}

rm -rf /etc/nginx/conf.d/default.conf

# mkdir -p /etc/nginx/ssl
# openssl req -x509 -newkey rsa:2048 -sha256 -days 730 -nodes \
#     -keyout /etc/nginx/ssl/website.key -out /etc/nginx/ssl/website.crt \
#     -subj "/CN=${NGINX_DOMAIN}" \
#     -addext "subjectAltName=DNS:${NGINX_DOMAIN},DNS:*.${NGINX_DOMAIN}"

NGINX_VARS=(
    "NGINX_WORKER_PROCESSES"
    "NGINX_WORKER_CONNECTIONS"
    "NGINX_PORT"
    "NGINX_SECURE_PORT"
    "NGINX_UPLOAD_MAX_FILESIZE"
    "NGINX_GZIP"
    "NGINX_GZIP_COMP_LEVEL"
    "NGINX_BROTLI"
    "NGINX_BROTLI_COMP_LEVEL"
    "NGINX_PROXY_CONNECT_TIMEOUT"
    "NGINX_PROXY_SEND_TIMEOUT"
    "NGINX_PROXY_READ_TIMEOUT"
)

E_NGINX_VARS="$(for x in ${NGINX_VARS[@]}; do printf "\${%s} " $x ;done)"

envsubst "$E_NGINX_VARS" \
    </etc/nginx/server.nginx.template \
    >/etc/nginx/nginx.conf

envsubst "$E_NGINX_VARS" \
    </etc/nginx/conf.d/vhost.nginx.template \
    >/etc/nginx/conf.d/vhost.conf

exec "$@"
