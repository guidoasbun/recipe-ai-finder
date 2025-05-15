#!/bin/bash
set -e

# This script packages and deploys the application code to S3

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Variables
S3_BUCKET="recipe-ai-finder-app-code"
APP_DIR="$(dirname "$(dirname "$(realpath "$0")")")"
TEMP_DIR="/tmp/recipe-ai-finder-deploy"
ZIP_FILE="recipe-ai-finder.zip"

echo "Packaging application from $APP_DIR"

# Create a temporary directory
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

# Copy application files to temp directory
echo "Copying application files..."
cp -r "$APP_DIR/src" "$APP_DIR/public" "$APP_DIR/package.json" "$APP_DIR/package-lock.json" "$APP_DIR/next.config.mjs" "$TEMP_DIR/"

# Copy additional configuration files
if [ -f "$APP_DIR/jsconfig.json" ]; then
    cp "$APP_DIR/jsconfig.json" "$TEMP_DIR/"
fi

if [ -f "$APP_DIR/postcss.config.mjs" ]; then
    cp "$APP_DIR/postcss.config.mjs" "$TEMP_DIR/"
fi

if [ -f "$APP_DIR/eslint.config.mjs" ]; then
    cp "$APP_DIR/eslint.config.mjs" "$TEMP_DIR/"
fi

if [ -f "$APP_DIR/middleware.js" ]; then
    echo "Copying middleware.js file..."
    cp "$APP_DIR/middleware.js" "$TEMP_DIR/"
fi

# Copy .env.local to the temp directory
if [ -f "$APP_DIR/.env.local" ]; then
    echo "Copying .env.local file..."
    cp "$APP_DIR/.env.local" "$TEMP_DIR/"
else
    echo "Warning: .env.local file not found!"
fi

# Create zip file
echo "Creating zip file..."
cd "$TEMP_DIR"
zip -r "$ZIP_FILE" ./*

# Check if S3 bucket exists
if ! aws s3api head-bucket --bucket "$S3_BUCKET" 2>/dev/null; then
    echo "S3 bucket $S3_BUCKET does not exist. Creating it..."
    aws s3 mb "s3://$S3_BUCKET" --region us-east-1
    
    # Wait for bucket to be available
    echo "Waiting for bucket to be available..."
    sleep 5
fi

# Upload to S3
echo "Uploading to S3..."
aws s3 cp "$TEMP_DIR/$ZIP_FILE" "s3://$S3_BUCKET/"

# Clean up
echo "Cleaning up..."
rm -rf "$TEMP_DIR"

echo "Deployment package uploaded to s3://$S3_BUCKET/$ZIP_FILE"
echo "You can now run 'terraform apply' to deploy the infrastructure"
