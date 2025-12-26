#!/bin/bash
# Diagnostic script to check domain setup for app.pay2play.net

echo "=== Checking /etc/hosts ==="
grep -E "pay2play|127\.0\.0\.1.*pay2play" /etc/hosts 2>&1 || echo "No pay2play entries found in /etc/hosts"

echo ""
echo "=== Checking DNS resolution ==="
if command -v getent &> /dev/null; then
    getent hosts app.pay2play.net 2>&1
elif command -v dscacheutil &> /dev/null; then
    dscacheutil -q host -a name app.pay2play.net 2>&1 | head -5
else
    ping -c 1 app.pay2play.net 2>&1 | head -3
fi

echo ""
echo "=== Checking Caddy process ==="
ps aux | grep -i caddy | grep -v grep || echo "Caddy process not found"

echo ""
echo "=== Checking ports ==="
echo "Port 80 (HTTP):"
lsof -i :80 2>&1 | head -3 || echo "Nothing listening on port 80"
echo ""
echo "Port 2019 (Caddy admin):"
lsof -i :2019 2>&1 | head -3 || echo "Nothing listening on port 2019"
echo ""
echo "Port 5002 (Firebase hosting):"
lsof -i :5002 2>&1 | head -3 || echo "Nothing listening on port 5002"

echo ""
echo "=== Testing Caddy admin API ==="
curl -s http://localhost:2019/config/ 2>&1 | head -5 || echo "Caddy admin API not accessible"

echo ""
echo "=== Testing direct backend (port 5002) ==="
curl -I http://127.0.0.1:5002 2>&1 | head -5 || echo "Backend on port 5002 not accessible"

echo ""
echo "=== Testing domain through Caddy ==="
curl -I http://app.pay2play.net 2>&1 | head -10 || echo "Domain not accessible"

echo ""
echo "=== Caddyfile content ==="
cat Caddyfile 2>&1 | head -20
