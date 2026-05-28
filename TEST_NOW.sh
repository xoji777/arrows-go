#!/bin/bash

# 🚀 Arrows Game - iOS Testing (Quick Start)

echo "=========================================="
echo "🎮 Arrows Game - Quick Test"
echo "=========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install it first."
    exit 1
fi

echo "✅ Node.js found"
echo ""

# Start local server
echo "🚀 Starting local server..."
echo "📍 Open browser: http://localhost:8080"
echo ""
echo "To test iOS features in browser:"
echo "  1. Press F12 (Developer Tools)"
echo "  2. Press Ctrl+Shift+M (Device Mode)"
echo "  3. Select iPhone 14 Pro"
echo "  4. Go to Console tab"
echo ""
echo "What to test:"
echo "  ✓ Tap on game pieces"
echo "  ✓ Drag empty area (pan - 4 directions)"
echo "  ✓ Simulate pinch zoom (DevTools: Shift + drag)"
echo "  ✓ Check console logs"
echo ""
echo "Press Ctrl+C to stop"
echo "=========================================="
echo ""

# Start http-server
npx http-server www -p 8080 -o "http://localhost:8080"
