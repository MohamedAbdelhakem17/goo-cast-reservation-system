#!/bin/bash

set -e
ERROR_MESSAGE=""
SUCCESS=true

FROM_NAME="Goocast Deploy Bot"
TO_EMAIL="m.abdelhakem@dottopia.com"

print_section() {
    echo "================= $1 ================="
}

send_error_email() {
    echo -e "An error occurred during the deployment process.\n\nError Details:\n$ERROR_MESSAGE" \
    | mail -s "Deployment Error" -aFrom:"$FROM_NAME <$FROM_EMAIL>" "$TO_EMAIL"
    exit 1
}

send_success_email() {
    echo "Deployment completed successfully." \
    | mail -s "Deployment Success" -aFrom:"$FROM_NAME <$FROM_EMAIL>" "$TO_EMAIL"
}

REQUIRED_COMMANDS=("git" "npm" "pm2" "mail")

for cmd in "${REQUIRED_COMMANDS[@]}"; do
    if ! command -v $cmd &> /dev/null; then
        ERROR_MESSAGE="Required command '$cmd' is not installed or not in PATH."
        send_error_email
    fi
done

print_section "Pulling latest updates..."
if ! git pull origin main 2>&1; then
    ERROR_MESSAGE="Failed to pull latest updates from git."
    send_error_email
fi

print_section "Installing backend dependencies..."
cd server
if ! npm install 2>&1; then
    ERROR_MESSAGE="Failed to install backend dependencies."
    send_error_email
fi

print_section "Building frontend..."
cd ../client
if ! npm install 2>&1; then
    ERROR_MESSAGE="Failed to install frontend dependencies."
    send_error_email
fi

BUILD_OUTPUT=$(npm run build -- --base=/goocast/ 2>&1)
BUILD_STATUS=$?

if [ $BUILD_STATUS -ne 0 ]; then
    ERROR_MESSAGE="Frontend build failed.\n\nDetails:\n$BUILD_OUTPUT"
    send_error_email
fi

print_section "Restarting backend..."
cd ../server
if ! pm2 restart goocast 2>&1; then
    ERROR_MESSAGE="Failed to restart backend with PM2."
    send_error_email
fi

if [ "$SUCCESS" = true ]; then
    send_success_email
fi
