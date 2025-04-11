#!/bin/bash


set -e  
ERROR_MESSAGE=""
SUCCESS=true

send_error_email() {
    SUBJECT="Deployment Error: $(echo "$ERROR_MESSAGE" | head -n 1)"
    BODY="An error occurred during the deployment process.\n\nError Details:\n$ERROR_MESSAGE"
    echo -e "$BODY" | mail -s "$SUBJECT" m.abdelhakem@dottopia.com
    exit 1
}

send_success_email() {
    echo "Deployment completed successfully." | mail -s "Deployment Success" m.abdelhakem@dottopia.com
}

echo "Pulling latest updates..."
if ! git pull origin main 2>&1; then
    ERROR_MESSAGE="Failed to pull latest updates from git."
    SUCCESS=false
    send_error_email
fi

echo "Installing backend dependencies..."
cd ./server
if ! npm install 2>&1; then
    ERROR_MESSAGE="Failed to install backend dependencies."
    SUCCESS=false
    send_error_email
fi

echo "Building frontend..."
cd ../client
if ! npm install 2>&1; then
    ERROR_MESSAGE="Failed to install frontend dependencies."
    SUCCESS=false
    send_error_email
fi

BUILD_OUTPUT=$(npm run build -- --base=/goocast/ 2>&1)
BUILD_STATUS=$?

if [ $BUILD_STATUS -ne 0 ]; then
    ERROR_MESSAGE="Frontend build failed.\n\nDetails:\n$BUILD_OUTPUT"
    SUCCESS=false
    send_error_email
fi

echo "Restarting backend..."
cd ../server
if ! pm2 restart goocast 2>&1; then
    ERROR_MESSAGE="Failed to restart backend with PM2."
    SUCCESS=false
    send_error_email
fi

if [ "$SUCCESS" = true ]; then
    send_success_email
fi
