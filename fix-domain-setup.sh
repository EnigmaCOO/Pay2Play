#!/bin/bash
# Comprehensive script to diagnose and fix domain setup for app.pay2play.net

set -e

echo "=== Step 1: Verify /etc/hosts entries ==="
if grep -q "app.pay2play.net" /etc/hosts 2>/dev/null; then
    echo "✓ Found app.pay2play.net in /etc/hosts:"
    grep "app.pay2play.net" /etc/hosts
else
    echo "✗ app.pay2play.net NOT found in /etc/hosts"
    echo "Adding entries..."
    echo "127.0.0.1	app.pay2play.net" | sudo tee -a /etc/hosts > /dev/null
    echo "127.0.0.1	venues.pay2play.net" | sudo tee -a /etc/hosts > /dev/null
    echo "127.0.0.1	fun.pay2play.net" | sudo tee -a /etc/hosts > /dev/null
    echo "127.0.0.1	ui.pay2play.net" | sudo tee -a /etc/hosts > /dev/null
    echo "✓ Added .net entries to /etc/hosts"
fi

echo ""
echo "=== Step 2: Check DNS resolution ==="
if command -v getent &> /dev/null; then
    RESOLVED=$(getent hosts app.pay2play.net 2>&1 || echo "FAILED")
elif command -v dscacheutil &> /dev/null; then
    RESOLVED=$(dscacheutil -q host -a name app.pay2play.net 2>&1 | grep -i "ip_address" || echo "FAILED")
else
    RESOLVED=$(ping -c 1 -W 1 app.pay2play.net 2>&1 | grep "PING" || echo "FAILED")
fi

if [[ "$RESOLVED" == *"FAILED"* ]] || [[ -z "$RESOLVED" ]]; then
    echo "✗ DNS resolution failed"
    echo "Try: sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder"
else
    echo "✓ DNS resolves to:"
    echo "$RESOLVED"
fi

echo ""
echo "=== Step 3: Check if Caddy is running ==="
if pgrep -f "caddy.*Caddyfile" > /dev/null; then
    echo "✓ Caddy process is running"
    ps aux | grep -i caddy | grep -v grep | head -2
else
    echo "✗ Caddy process not found"
fi

echo ""
echo "=== Step 4: Check port 80 binding ==="
PORT80=$(sudo lsof -i :80 2>&1 | grep LISTEN || echo "")
if [[ -z "$PORT80" ]]; then
    echo "✗ Nothing listening on port 80"
    echo "Caddy needs sudo to bind to port 80. Checking if we can start it..."
else
    echo "✓ Port 80 is in use:"
    echo "$PORT80"
fi

echo ""
echo "=== Step 5: Check port 5002 (Firebase hosting) ==="
PORT5002=$(lsof -i :5002 2>&1 | grep LISTEN || echo "")
if [[ -z "$PORT5002" ]]; then
    echo "✗ Nothing listening on port 5002 (Firebase hosting not running?)"
else
    echo "✓ Port 5002 is in use:"
    echo "$PORT5002"
fi

echo ""
echo "=== Step 6: Test direct backend access ==="
if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5002 | grep -q "200\|301\|302"; then
    echo "✓ Backend on port 5002 is accessible"
else
    echo "✗ Backend on port 5002 is NOT accessible"
fi

echo ""
echo "=== Step 7: Test domain access ==="
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://app.pay2play.net 2>&1 || echo "000")
if [[ "$STATUS" == "200" ]] || [[ "$STATUS" == "301" ]] || [[ "$STATUS" == "302" ]]; then
    echo "✓ Domain is accessible (HTTP $STATUS)"
else
    echo "✗ Domain is NOT accessible (HTTP $STATUS)"
    echo ""
    echo "=== Troubleshooting steps ==="
    echo "1. Ensure /etc/hosts has the correct entries (run script again if needed)"
    echo "2. Clear browser DNS cache or try incognito mode"
    echo "3. Restart Caddy with: sudo caddy run --config Caddyfile"
    echo "4. Or restart emulators: yarn emulators:restart"
fi

echo ""
echo "=== Summary ==="
echo "Run this command to restart Caddy with proper permissions:"
echo "  sudo caddy run --config Caddyfile"
echo ""
echo "Or restart everything:"
echo "  yarn emulators:restart"
