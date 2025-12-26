#!/bin/bash
# Comprehensive fix for DNS resolution issue
# The domain app.pay2play.net exists in public DNS, so we need to ensure /etc/hosts takes precedence

set -e

echo "=== Fixing DNS Resolution for app.pay2play.net ==="
echo ""

echo "Step 1: Checking current /etc/hosts entries..."
if grep -q "app.pay2play.net" /etc/hosts 2>/dev/null; then
    echo "Current entries:"
    grep "pay2play" /etc/hosts
else
    echo "No pay2play entries found"
fi

echo ""
echo "Step 2: Removing any old .local entries..."
sudo sed -i '' '/pay2play\.local/d' /etc/hosts 2>/dev/null || true

echo ""
echo "Step 3: Ensuring .net entries are at the TOP of /etc/hosts (before any existing pay2play entries)..."
# Remove any existing .net entries first
sudo sed -i '' '/pay2play\.net/d' /etc/hosts 2>/dev/null || true

# Add entries right after localhost (or at the top if localhost doesn't exist)
if grep -q "^127.0.0.1.*localhost" /etc/hosts 2>/dev/null; then
    # Insert after localhost line
    sudo sed -i '' '/^127\.0\.0\.1.*localhost/a\
127.0.0.1	app.pay2play.net\
127.0.0.1	venues.pay2play.net\
127.0.0.1	fun.pay2play.net\
127.0.0.1	ui.pay2play.net
' /etc/hosts
else
    # Add at the beginning
    echo "127.0.0.1	app.pay2play.net
127.0.0.1	venues.pay2play.net
127.0.0.1	fun.pay2play.net
127.0.0.1	ui.pay2play.net" | sudo tee -a /etc/hosts > /dev/null
fi

echo "✓ Added .net entries to /etc/hosts"

echo ""
echo "Step 4: Verifying /etc/hosts entries..."
grep "pay2play" /etc/hosts || echo "ERROR: Entries not found!"

echo ""
echo "Step 5: Flushing DNS cache (this may require your password)..."
sudo dscacheutil -flushcache 2>&1
sudo killall -HUP mDNSResponder 2>&1 || true
echo "✓ DNS cache flushed"

echo ""
echo "Step 6: Waiting 2 seconds for cache to clear..."
sleep 2

echo ""
echo "Step 7: Testing DNS resolution..."
if command -v getent &> /dev/null; then
    RESULT=$(getent hosts app.pay2play.net 2>&1 || echo "FAILED")
    echo "$RESULT"
    if [[ "$RESULT" == *"127.0.0.1"* ]]; then
        echo ""
        echo "✓ SUCCESS! DNS now resolves to 127.0.0.1"
    elif [[ "$RESULT" == *"104.143"* ]]; then
        echo ""
        echo "✗ Still resolving to external IP. Try:"
        echo "  1. Restart your computer (most reliable)"
        echo "  2. Or: sudo killall mDNSResponder && sudo dscacheutil -flushcache && sudo killall mDNSResponder"
    else
        echo ""
        echo "? Could not verify. Please check manually:"
        echo "  getent hosts app.pay2play.net"
    fi
else
    echo "getent not available, please verify manually with:"
    echo "  ping -c 1 app.pay2play.net"
    echo "Should show 127.0.0.1"
fi

echo ""
echo "=== Next Steps ==="
echo "1. Clear browser cache OR use incognito/private window"
echo "2. If still not working, restart your computer"
echo "3. Verify Caddy is running: sudo caddy run --config Caddyfile"
echo "4. Try accessing: http://app.pay2play.net"
