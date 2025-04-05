# Use the official Node.js image as the base image
FROM node:20 as development

ENV NODE_ENV=development \
    SHELL=/bin/bash \
    TMP_DIR=/mnt/tmp \
    WORKDIR=/app

ARG GROUP_ID=1000
ARG USER_ID=1000

WORKDIR ${WORKDIR}

ENV npm_config_cache="${TMP_DIR}/npm-cache" \
    npm_config_store_dir="${TMP_DIR}/pnpm-store"

RUN echo "Installing pnpm" \
    && PNPM_VERSION='9.15.4' \
    && npm install -g "pnpm@${PNPM_VERSION}"

RUN echo 'Creating "node" user' \
    && echo 'Configuring folder permissions' \
    && if [ ! -d "$TMP_DIR" ] ; then mkdir "$TMP_DIR" ; fi \
    && chown -R node:node ${TMP_DIR} ${WORKDIR} \
    && echo '==============================='

# Expose the application port
EXPOSE 3001