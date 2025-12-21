# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/api

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata wget
WORKDIR /root/

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Copy keep-alive script
COPY scripts/keep-alive.sh /usr/local/bin/keep-alive.sh
RUN chmod +x /usr/local/bin/keep-alive.sh

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 -O /dev/null http://localhost:8080/health || exit 1

# Start both the main app and keep-alive script
CMD /usr/local/bin/keep-alive.sh & ./main