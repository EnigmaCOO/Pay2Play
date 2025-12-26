#!/bin/bash
# Script to restart Caddy with updated .net domain configuration

echo "Stopping existing Caddy processes..."

# Try to find and kill Caddy processes
pkill -f caddy 2>/dev/null
sleep 1

# Kill any process on port 2019
if lsof -ti :2019 > /dev/null 2>&1; then
    echo "Killing process on port 2019..."
    kill -9 $(lsof -ti :2019) 2>/dev/null
    sleep 1
fi

# Verify port is free
if lsof -ti :2019 > /dev/null 2>&1; then
    echo "ERROR: Port 2019 is still in use. Please manually kill the process."
    exit 1
fi

echo "Formatting Caddyfile..."
caddy fmt --overwrite Caddyfile

echo "Starting Caddy with new config..."
caddy run --config Caddyfile
