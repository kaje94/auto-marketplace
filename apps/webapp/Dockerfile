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
COPY package.json nx.json pnpm-* go.* ./
COPY apps/webapp/package.json apps/webapp/pnpm-* apps/webapp/
COPY libs/protos libs/protos
COPY apps/service/go.* apps/service/

# Install dependencies
RUN devbox run pnpm install --frozen-lockfile

# Copy the apps/webapp directories
COPY apps/webapp apps/webapp

# Set necessary build-time variables as args
# Public env args
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_SUPPORT_EMAIL
ARG NEXT_PUBLIC_IMAGE_CDN_BASE
ARG NEXT_PUBLIC_SENTRY_KEY
# Private env args
ARG GRPC_API_BASE_URL
ARG AUTH0_SECRET
ARG AUTH0_BASE_URL
ARG AUTH0_ISSUER_BASE_URL
ARG AUTH0_CLIENT_ID
ARG AUTH0_CLIENT_SECRET
ARG AUTH0_AUDIENCE
ARG AUTH0_SCOPE
ARG NEXT_CONTACT_US_FORM_KEY
ARG RECAPTCHA_SITE_SECRET

# Set those args as env variables
# Public env variables
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_SUPPORT_EMAIL=$NEXT_PUBLIC_SUPPORT_EMAIL
ENV NEXT_PUBLIC_IMAGE_CDN_BASE=$NEXT_PUBLIC_IMAGE_CDN_BASE
ENV NEXT_PUBLIC_SENTRY_KEY=$NEXT_PUBLIC_SENTRY_KEY
# Private env variables
ENV GRPC_API_BASE_URL=$GRPC_API_BASE_URL
ENV AUTH0_SECRET=$AUTH0_SECRET
ENV AUTH0_BASE_URL=$AUTH0_BASE_URL
ENV AUTH0_ISSUER_BASE_URL=$AUTH0_ISSUER_BASE_URL
ENV AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID
ENV AUTH0_CLIENT_SECRET=$AUTH0_CLIENT_SECRET
ENV AUTH0_AUDIENCE=$AUTH0_AUDIENCE
ENV AUTH0_SCOPE=$AUTH0_SCOPE
ENV NEXT_CONTACT_US_FORM_KEY=$NEXT_CONTACT_US_FORM_KEY
ENV RECAPTCHA_SITE_SECRET=$RECAPTCHA_SITE_SECRET

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
