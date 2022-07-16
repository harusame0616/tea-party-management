# ------------------------------------------------------------------------------
FROM node:16-slim AS base

WORKDIR /project/app

# ------------------------------------------------------------------------------
FROM  base AS develop

RUN apt-get update -qqy && \
    apt-get install -qqy --no-install-recommends git && \
    apt-get clean -qqy && \
    rm -rf /var/lib/apt/lists/*

USER node

CMD ["npm", "start"]
