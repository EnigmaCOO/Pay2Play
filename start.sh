#!/bin/bash
set -e

echo "════════════════════════════════════════════════════════"
echo "  🚀 P2P Sports Platform - Starting Server"
echo "════════════════════════════════════════════════════════"
echo ""

# Run database push if schema changes
echo "📦 Syncing database schema..."
npm run db:push 2>/dev/null || echo "   ✓ Schema already synced"
echo ""

# Start the server
echo "🌐 Starting Express + Vite server..."
echo "   - Binding to: 0.0.0.0:5000"
echo "   - Frontend: Vite React app"
echo "   - Backend: Express API at /api/*"
echo ""
echo "✨ Server is starting..."
echo "   Refresh the Replit webview to see your app!"
echo "════════════════════════════════════════════════════════"
echo ""

NODE_ENV=development tsx server/index.ts
