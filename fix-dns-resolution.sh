#!/bin/bash
# Fix DNS resolution for app.pay2play.net to use /etc/hosts instead of public DNS

set -e

echo "=== Current DNS Resolution Check ==="
echo "Checking what app.pay2play.net resolves to..."

if command -v getent &> /dev/null; then
    RESULT=$(getent hosts app.pay2play.net 2>&1 || echo "NOT_FOUND")
elif command -v host &> /dev/null; then
    RESULT=$(host app.pay2play.net 2>&1 | grep "has address" || echo "NOT_FOUND")
else
    RESULT=$(nslookup app.pay2play.net 2>&1 | grep "Address:" | tail -1 || echo "NOT_FOUND")
fi

echo "$RESULT"

if [[ "$RESULT" == *"104.143.9.210"* ]] || [[ "$RESULT" == *"NOT_FOUND"* ]]; then
    echo ""
    echo "✗ DNS is resolving to external IP or not found. Fixing..."
    
    echo ""
    echo "=== Step 1: Check /etc/hosts ==="
    if grep -q "app.pay2play.net" /etc/hosts 2>/dev/null; then
        echo "✓ Found app.pay2play.net in /etc/hosts:"
        grep "app.pay2play.net" /etc/hosts
    else
        echo "✗ app.pay2play.net NOT in /etc/hosts. Adding..."
        echo "127.0.0.1	app.pay2play.net" | sudo tee -a /etc/hosts > /dev/null
        echo "127.0.0.1	venues.pay2play.net" | sudo tee -a /etc/hosts > /dev/null
        echo "127.0.0.1	fun.pay2play.net" | sudo tee -a /etc/hosts > /dev/null
        echo "127.0.0.1	ui.pay2play.net" | sudo tee -a /etc/hosts > /dev/null
        echo "✓ Added entries"
    fi
    
    echo ""
    echo "=== Step 2: Remove old .local entries (if any) ==="
    if grep -q "pay2play.local" /etc/hosts 2>/dev/null; then
        echo "Found .local entries. Removing them..."
        sudo sed -i '' '/pay2play\.local/d' /etc/hosts
        echo "✓ Removed .local entries"
    else
        echo "✓ No .local entries found"
    fi
    
    echo ""
    echo "=== Step 3: Flush DNS Cache ==="
    echo "Flushing macOS DNS cache..."
    sudo dscacheutil -flushcache
    sudo killall -HUP mDNSResponder
    echo "✓ DNS cache flushed"
    
    echo ""
    echo "=== Step 4: Verify Resolution ==="
    sleep 1
    if command -v getent &> /dev/null; then
        NEW_RESULT=$(getent hosts app.pay2play.net 2>&1 || echo "FAILED")
    else
        NEW_RESULT=$(ping -c 1 -W 1 app.pay2play.net 2>&1 | grep "PING" | grep -o "127\.0\.0\.1\|104\.143" || echo "FAILED")
    fi
    
    echo "$NEW_RESULT"
    
    if [[ "$NEW_RESULT" == *"127.0.0.1"* ]]; then
        echo ""
        echo "✓ SUCCESS! DNS now resolves to 127.0.0.1"
        echo ""
        echo "Next steps:"
        echo "1. Clear your browser cache or use incognito/private window"
        echo "2. Restart Caddy if needed: sudo caddy run --config Caddyfile"
        echo "3. Try accessing http://app.pay2play.net again"
    else
        echo ""
        echo "✗ Still not resolving correctly. Try:"
        echo "1. Restart your computer (most reliable DNS cache flush)"
        echo "2. Or try: sudo killall mDNSResponder && sudo dscacheutil -flushcache"
        echo "3. Check /etc/hosts manually: cat /etc/hosts | grep pay2play"
    fi
else
    if [[ "$RESULT" == *"127.0.0.1"* ]]; then
        echo ""
        echo "✓ DNS is already resolving to 127.0.0.1 correctly"
        echo "If browser still shows redirect, clear browser cache or use incognito mode"
    fi
fi
