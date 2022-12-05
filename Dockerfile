# syntax = docker/dockerfile:1.4

FROM node:12-alpine as build-stage

ARG VUE_APP_STARC_WEBAPI_URL
ARG VUE_APP_STARC_STATIC_URL
ARG VUE_APP_STARC_BATTLE_API_CLIENT_ID

WORKDIR /app

COPY package.json yarn.lock ./

RUN --mount=type=cache,target=/tmp/.yarn_cache <<EOF
    YARN_CACHE_FOLDER=/tmp/.yarn_cache yarn install \
        --pure-lockfile \
        --no-interactive
EOF

COPY ./ .

ENV NODE_ENV=production

ENV VUE_APP_STARC_WEBAPI_URL="${VUE_APP_STARC_WEBAPI_URL}"
ENV VUE_APP_STARC_STATIC_URL="${VUE_APP_STARC_STATIC_URL}"
ENV VUE_APP_STARC_BATTLE_API_CLIENT_ID="${VUE_APP_STARC_BATTLE_API_CLIENT_ID}"

RUN yarn run build


FROM macbre/nginx-http3:1.23.1 as production-stage

RUN apk add --update --no-cache bash

COPY nginx/nginx-entrypoint.sh /
COPY nginx/conf/server.nginx.template /etc/nginx/
COPY nginx/conf/vhost.nginx.template /etc/nginx/conf.d/

RUN mkdir /app
COPY --from=build-stage /app/dist /app

EXPOSE 80/tcp
# EXPOSE 443/tcp
# EXPOSE 443/udp

ENTRYPOINT [ "/nginx-entrypoint.sh" ]
CMD [ "nginx", "-g", "daemon off;" ]
