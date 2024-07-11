###############
# Build Stage #
###############

# Using devbox as base build image
FROM jetpackio/devbox:latest AS build-stage

# Installing your devbox project
WORKDIR /code
RUN mkdir -p /code && chown ${DEVBOX_USER}:${DEVBOX_USER} /code
USER ${DEVBOX_USER}:${DEVBOX_USER}
COPY --chown=${DEVBOX_USER}:${DEVBOX_USER} devbox.json devbox.json
COPY --chown=${DEVBOX_USER}:${DEVBOX_USER} devbox.lock devbox.lock
RUN devbox install
USER root:root

# Copy core files
COPY . .

ENV SKIP_ENV_VALIDATION true


# Install dependencies
RUN devbox run pnpm install --frozen-lockfile

# Copy the apps/webapp directories
COPY apps/webapp apps/webapp

# Set necessary build-time variables as args
# Public env as args
ARG NEXT_PUBLIC_SUPPORT_EMAIL

# Set args as public env variables
ENV NEXT_PUBLIC_SUPPORT_EMAIL=$NEXT_PUBLIC_SUPPORT_EMAIL
# Private temporary env variables (Will be overriden during runtime via runtime variables)
ENV GRPC_API_BASE_URL 'http://localhost:3001'
ENV AUTH0_BASE_URL 'http://localhost:3000'
# Skip rest of the env validations
# Other env variables
ENV PORT 3000
ENV HOSTNAME 0.0.0.0

# Build webapp
RUN devbox run pnpm build:webapp

###############
## Run stage ##
###############

# Deploy the application binary into a lean image
FROM node:20-alpine AS run-stage
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build-stage /code/apps/webapp/public ./apps/webapp/public

RUN mkdir apps/webapp/.next
RUN chown nextjs:nodejs apps/webapp/.next

COPY --from=build-stage --chown=nextjs:nodejs /code/apps/webapp/.next/standalone ./
COPY --from=build-stage --chown=nextjs:nodejs /code/apps/webapp/.next/static ./apps/webapp/.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD HOSTNAME="0.0.0.0" node apps/webapp/server.js
