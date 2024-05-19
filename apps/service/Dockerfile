FROM golang:1.22-alpine
RUN apk add gcompat
WORKDIR /app
COPY bin/service ./
EXPOSE 50051
RUN chmod +x service
CMD ["./service"]


# TODO: use scratch or distroless as base image