#!/bin/bash

# Enable error handling and logging
set -e
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "Starting user data script execution at $(date)"

# Update and install dependencies
echo "Updating system packages..."
apt-get update
apt-get install -y curl git nginx unzip awscli

# Install Node.js LTS
echo "Installing Node.js LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify Node.js and npm installation
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Create app directory
echo "Creating application directory..."
mkdir -p /var/www/recipe-ai-finder
cd /var/www/recipe-ai-finder

# Download application code from S3
echo "Downloading application code from S3..."
aws s3 cp s3://recipe-ai-finder-app-code/recipe-ai-finder.zip /tmp/ || {
    echo "Failed to download application code from S3"
    exit 1
}

echo "Extracting application code..."
unzip -o /tmp/recipe-ai-finder.zip -d . || {
    echo "Failed to extract application code"
    exit 1
}

# Create .env.local file with environment variables
echo "Creating environment variables file..."
cat > .env.local << 'EOL'
%{ for key, value in env_vars ~}
${key}=${value}
%{ endfor ~}
EOL

# Install dependencies and build the app
echo "Installing npm dependencies..."
npm ci || {
    echo "Failed to install npm dependencies"
    exit 1
}

echo "Building the application..."
npm run build || {
    echo "Failed to build the application"
    exit 1
}

# Configure Nginx
echo "Configuring Nginx..."
cat > /etc/nginx/sites-available/recipe-ai-finder << 'EOL'
server {
    listen 80;
    server_name localhost;
    
    # Health check endpoint for load balancer
    location = / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Explicitly redirect /index.html to /
    location = /index.html {
        return 301 /;
    }
    
    # Redirect any path ending with /index.html to the path without it
    location ~ ^(.*)/index\.html$ {
        return 301 $1/;
    }
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
    }
}
EOL

# Enable the site
ln -s /etc/nginx/sites-available/recipe-ai-finder /etc/nginx/sites-enabled/ || echo "Symlink already exists"
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "Testing Nginx configuration..."
nginx -t

# Restart Nginx
echo "Restarting Nginx..."
systemctl restart nginx

# Create a systemd service for the Next.js app
echo "Creating systemd service..."
cat > /etc/systemd/system/recipe-ai-finder.service << 'EOL'
[Unit]
Description=Recipe AI Finder Next.js App
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/recipe-ai-finder
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
TimeoutStartSec=180

[Install]
WantedBy=multi-user.target
EOL

# Enable and start the service
echo "Enabling and starting the service..."
systemctl daemon-reload
systemctl enable recipe-ai-finder
systemctl start recipe-ai-finder || {
    echo "Failed to start the service. Checking logs..."
    journalctl -u recipe-ai-finder --no-pager -n 50
    exit 1
}

# Verify service is running
echo "Verifying service status..."
systemctl status recipe-ai-finder

# Create a simple health check file
echo "Creating health check file..."
mkdir -p /var/www/html
echo "OK" > /var/www/html/health.html

# Check if Next.js application is running
echo "Checking if Next.js application is running..."
ps aux | grep next

echo "Checking application logs..."
mkdir -p /var/www/recipe-ai-finder/.next/logs
touch /var/www/recipe-ai-finder/.next/logs/error.log
tail -n 50 /var/www/recipe-ai-finder/.next/logs/error.log 2>/dev/null || echo "No error logs found"

# Wait for the application to be ready
echo "Waiting for application to be ready..."
for i in {1..30}; do
    echo "Attempt $i: Checking if application is responding..."
    curl -v http://localhost:3000 > /tmp/curl_output.txt 2>&1
    if [ $? -eq 0 ]; then
        echo "Application is responding on port 3000"
        cat /tmp/curl_output.txt
        break
    fi
    echo "Waiting for application to start... ($i/30)"
    echo "Curl output:"
    cat /tmp/curl_output.txt
    echo "Service status:"
    systemctl status recipe-ai-finder
    sleep 10
    if [ $i -eq 30 ]; then
        echo "Application failed to respond within timeout"
        systemctl status recipe-ai-finder
        journalctl -u recipe-ai-finder --no-pager -n 100
    fi
done

echo "Recipe AI Finder deployment completed at $(date)!"
