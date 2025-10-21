#!/bin/bash
set -e

echo "🚀 Recipe AI Finder - Terraform Deployment"
echo "=========================================="

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: GITHUB_TOKEN environment variable not set"
    echo ""
    echo "To create a GitHub token:"
    echo "1. Go to: https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Select scopes: repo, workflow, admin:repo_hook"
    echo "4. Copy the token and run:"
    echo "   export GITHUB_TOKEN='your_token_here'"
    exit 1
fi

# Navigate to infrastructure directory
cd infrastructure

# Initialize Terraform
echo ""
echo "📦 Initializing Terraform..."
terraform init

# Validate configuration
echo ""
echo "✅ Validating Terraform configuration..."
terraform validate

# Plan deployment
echo ""
echo "📋 Planning deployment..."
terraform plan \
  -var="github_token=$GITHUB_TOKEN" \
  -out=tfplan

# Confirm deployment
echo ""
read -p "Do you want to apply this plan? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Apply deployment
echo ""
echo "🏗️  Deploying infrastructure (this may take 10-15 minutes)..."
terraform apply tfplan

# Get outputs
echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
terraform output

echo ""
echo "📝 Next Steps:"
echo "1. Wait 2-3 minutes for DNS propagation and certificate validation"
echo "2. Build and push initial Docker image (see below)"
echo "3. Push code to main branch to trigger auto-deployment"
echo ""

# Show initial image push commands
ECR_URL=$(terraform output -raw ecr_repository_url 2>/dev/null || echo "")
if [ -n "$ECR_URL" ]; then
    echo "🐳 To push the initial Docker image (ARM64 for Graviton):"
    echo ""
    echo "cd .."
    echo "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_URL"
    echo ""
    echo "# If you're on Apple Silicon (M1/M2/M3), use native build:"
    echo "docker build -t recipe-ai-finder:latest ."
    echo "docker tag recipe-ai-finder:latest $ECR_URL:latest"
    echo "docker push $ECR_URL:latest"
    echo ""
    echo "# If you're on Intel Mac or need explicit ARM64:"
    echo "docker buildx build --platform linux/arm64 -t $ECR_URL:latest --push ."
fi

echo ""
echo "🌐 Your application will be available at:"
terraform output -raw application_url 2>/dev/null || echo "https://recipe-ai-finder.com"
echo ""
echo ""
echo "📊 To view logs:"
echo "aws logs tail /ecs/recipe-ai-finder --follow --region us-east-1"
echo ""
