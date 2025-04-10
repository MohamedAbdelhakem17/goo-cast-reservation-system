#!/bin/bash

echo "? Pulling latest updates..."
git pull origin main

echo "?? Installing backend dependencies..."
cd server
npm install

echo "?? Building frontend..."
cd ../client
npm install
npm run build -- --base=/goocast/

echo "?? Restarting backend..."

pm2 restart goocast
