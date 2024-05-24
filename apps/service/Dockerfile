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
RUN devbox run -- echo "Installed Packages."

USER root:root

# Copy core files
COPY package.json nx.json pnpm-* go.* ./
COPY apps/service/go.* apps/service/
COPY libs/protos libs/protos


# Install dependencies
RUN devbox run pnpm install
RUN devbox run go mod download

# Copy the apps/service directories
COPY apps/service apps/service

# Build go service
ENV CGO_ENABLED 0
ENV GOOS linux
RUN devbox run go build -o apps/service/bin/service apps/service/cmd/main.go


###############
## Run stage ##
###############

# Deploy the application binary into a lean image
FROM gcr.io/distroless/base-debian11 AS run-stage
COPY --from=build-stage /code/apps/service/bin/service .
ENTRYPOINT ["./service"]