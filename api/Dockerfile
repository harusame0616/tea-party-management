# ------------------------------------------------------------------------------
FROM node:16-slim AS base

WORKDIR /project/api

# ------------------------------------------------------------------------------
FROM  base AS develop

RUN apt-get update -qqy && \
    apt-get install -qqy --no-install-recommends git && \
    apt-get clean -qqy && \
    rm -rf /var/lib/apt/lists/*

USER node

CMD ["npm", "run", "dev"]

# ------------------------------------------------------------------------------
FROM base AS build

COPY ./ /project/api/
RUN npm i && npm run build && npm prune --production

# ------------------------------------------------------------------------------
FROM base AS production

COPY --from=build /project/api/node_modules /project/api/node_modules
COPY --from=build /project/api/dest /project/api/dest
COPY --from=build /project/api/package*.json /project/api/

CMD ["node", "./dest/index.js"]