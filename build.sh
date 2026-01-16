#!/bin/bash

# Build script for Live-Lexxy
# This script builds the JavaScript and CSS assets for distribution

echo "Building Live-Lexxy assets..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build JavaScript
echo "Building JavaScript..."
npm run build:js

# Build CSS
echo "Building CSS..."
npm run build:css

echo "Build complete! Assets are in the dist/ directory."
