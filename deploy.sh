#!/bin/bash

echo "⚡ Pulling latest updates..."
git pull origin main

echo "📦 Installing backend dependencies..."
cd server
npm install

echo "🧱 Building frontend..."
cd ../client
npm install

BUILD_OUTPUT=$(npm run build -- --base=/goocast/ 2>&1)  
BUILD_STATUS=$?

if [ $BUILD_STATUS -ne 0 ]; then
    echo -e "🚨 Frontend build failed!\n\nError Details:\n$BUILD_OUTPUT" | mail -s "Build Error: Frontend Build Failed" m.abdelhakem@dottopia.com
    exit 1
else
    echo "✅ Frontend build succeeded!" | mail -s "Build Success: Frontend Build Succeeded" m.abdelhakem@dottopia.com
fi

echo "🚀 Restarting backend..."

pm2 restart goocast
