#!/bin/sh

# Self-ping script to keep backend alive
# Pings the health endpoint every 10 minutes

PING_INTERVAL=600  # 10 minutes in seconds
HEALTH_ENDPOINT="${BASE_URL:-http://localhost:8080}/health"

echo "Keep-alive service started"
echo "Will ping $HEALTH_ENDPOINT every $PING_INTERVAL seconds"

while true; do
    sleep $PING_INTERVAL
    
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    if wget -q -O /dev/null --timeout=10 "$HEALTH_ENDPOINT" 2>/dev/null; then
        echo "[$timestamp] ✓ Self-ping successful"
    else
        echo "[$timestamp] ⚠ Self-ping failed"
    fi
done
