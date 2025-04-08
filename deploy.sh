#!/bin/bash

echo "⚡ Pulling latest updates..."
git pull origin main

echo "📦 Installing backend dependencies..."
cd server
npm install

echo "🧱 Building frontend..."
cd ../client
npm install
npm run build

echo "🚀 Restarting backend..."
cd ../server
pm2 restart src/app.js
