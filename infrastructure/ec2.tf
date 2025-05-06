resource "aws_instance" "app" {
  ami                    = "ami-084568db4383264d4"
  instance_type          = "t3.small"
  subnet_id              = aws_subnet.public.id
  associate_public_ip_address = true
  key_name               = var.key_name
  vpc_security_group_ids      = [aws_security_group.ec2_sg.id]
  user_data = <<-EOF
              #!/bin/bash
              cd /home/ubuntu

              # Install dependencies
              apt update -y
              apt install -y git curl nginx

              # Install Node.js 18
              curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
              apt install -y nodejs

              # Install PM2
              npm install -g pm2

              # Set up swap to avoid OOM during build
              fallocate -l 2G /swapfile
              chmod 600 /swapfile
              mkswap /swapfile
              swapon /swapfile
              echo '/swapfile none swap sw 0 0' >> /etc/fstab

              # Clone and build the app
              git clone https://github.com/guidoasbun/recipe-ai-finder.git
              chown -R ubuntu:ubuntu /home/ubuntu/recipe-ai-finder
              cd /home/ubuntu/recipe-ai-finder

              # Optional: set up .env here manually or via external script if needed

              npm install
              npm run build

              # Start the app using PM2
              cd /home/ubuntu/recipe-ai-finder
              pm2 start npm --name "recipe-app" -- start
              pm2 startup systemd
              pm2 save

              # Configure Nginx reverse proxy
              # cat > /etc/nginx/sites-available/default <<NGINX_CONF
              # server {
              #     listen 80;
              #     server_name recipe-ai-finder.com www.recipe-ai-finder.com;
              #
              #     location / {
              #         proxy_pass http://localhost:3000;
              #         proxy_http_version 1.1;
              #         proxy_set_header Upgrade \$http_upgrade;
              #         proxy_set_header Connection 'upgrade';
              #         proxy_set_header Host \$host;
              #         proxy_cache_bypass \$http_upgrade;
              #     }
              # }
              # NGINX_CONF
              #
              # systemctl restart nginx
  EOF
  tags = {
    Name = "RecipeFinderApp"
  }
}