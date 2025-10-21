#!/bin/bash
cd /home/runner/workspace

echo "Keep-alive script started at $(date)" >> /tmp/server-keepalive.log
echo "Working directory: $(pwd)" >> /tmp/server-keepalive.log
echo "NODE_ENV: $NODE_ENV" >> /tmp/server-keepalive.log
echo "PORT: $PORT" >> /tmp/server-keepalive.log

while true; do
    echo "==== Starting server at $(date) ====" >> /tmp/server-keepalive.log
    NODE_ENV=development PORT=5000 npx tsx server/index.ts >> /tmp/server-runtime.log 2>&1
    EXIT_CODE=$?
    echo "Server stopped at $(date) with exit code: $EXIT_CODE" >> /tmp/server-keepalive.log
    if [ $EXIT_CODE -ne 0 ]; then
        echo "ERROR: Server crashed! Last 20 lines of log:" >> /tmp/server-keepalive.log
        tail -20 /tmp/server-runtime.log >> /tmp/server-keepalive.log
    fi
    sleep 2
done
