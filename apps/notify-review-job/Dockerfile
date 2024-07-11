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
COPY apps/notify-review-job/go.* apps/notify-review-job/
COPY apps/api-service apps/api-service
COPY apps/subscriptions-job apps/subscriptions-job
COPY apps/expire-listings-job apps/expire-listings-job
COPY libs/go-utils libs/go-utils
COPY libs/protos libs/protos

# Install dependencies
RUN devbox run pnpm install --frozen-lockfile
RUN devbox run go mod download

# Copy the go notify-review-job source directory
COPY apps/notify-review-job apps/notify-review-job

# Build go notify-review-job
ENV CGO_ENABLED 0
ENV GOOS linux
RUN devbox run go build -o apps/notify-review-job/bin/notify-review-job apps/notify-review-job/cmd/main.go

###############
## Run stage ##
###############

# Deploy the application binary into a lean image
FROM cgr.dev/chainguard/static:latest AS run-stage
COPY --from=build-stage /code/apps/notify-review-job/bin/notify-review-job .
ENTRYPOINT ["./notify-review-job"]