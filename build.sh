#!/bin/bash
set -e

echo "Installing dependencies..."
cd server
npm install
cd ..

echo "Build completed successfully!"
