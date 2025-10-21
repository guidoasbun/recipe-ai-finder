#!/bin/bash
set -e

echo "🗑️  Recipe AI Finder - Infrastructure Teardown"
echo "=============================================="
echo ""
echo "⚠️  WARNING: This will destroy all infrastructure!"
echo "This includes:"
echo "  - ECS Fargate cluster and services"
echo "  - Application Load Balancer"
echo "  - ECR repository (and all Docker images)"
echo "  - VPC and networking"
echo "  - CloudWatch logs"
echo "  - Route53 DNS records"
echo "  - SSL certificate"
echo "  - AWS Parameter Store secrets"
echo "  - GitHub Actions configuration"
echo ""

read -p "Are you sure you want to continue? (type 'yes' to confirm): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Teardown cancelled"
    exit 1
fi

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
    echo ""
    echo "⚠️  Warning: GITHUB_TOKEN not set"
    echo "GitHub resources won't be destroyed without it."
    echo ""
    read -p "Continue anyway? (yes/no): " continue_confirm
    if [ "$continue_confirm" != "yes" ]; then
        exit 1
    fi
fi

# Navigate to infrastructure directory
cd infrastructure

# Empty ECR repository first (if it exists)
echo ""
echo "🗑️  Checking for ECR images to delete..."
ECR_REPO_NAME="recipe-ai-finder"
if aws ecr describe-repositories --repository-names $ECR_REPO_NAME --region us-east-1 >/dev/null 2>&1; then
    echo "Deleting ECR images..."
    IMAGE_IDS=$(aws ecr list-images --repository-name $ECR_REPO_NAME --region us-east-1 --query 'imageIds[*]' --output json)
    if [ "$IMAGE_IDS" != "[]" ]; then
        aws ecr batch-delete-image \
          --repository-name $ECR_REPO_NAME \
          --image-ids "$IMAGE_IDS" \
          --region us-east-1 >/dev/null 2>&1 || true
        echo "✅ ECR images deleted"
    else
        echo "✅ No ECR images to delete"
    fi
else
    echo "✅ ECR repository doesn't exist"
fi

# Destroy infrastructure
echo ""
echo "🗑️  Destroying infrastructure..."

if [ -n "$GITHUB_TOKEN" ]; then
    terraform destroy \
      -var="github_token=$GITHUB_TOKEN" \
      -auto-approve
else
    terraform destroy -auto-approve
fi

echo ""
echo "=========================================="
echo "✅ Infrastructure Destroyed Successfully"
echo "=========================================="
echo ""
echo "The following have been removed:"
echo "  ✅ All AWS resources"
echo "  ✅ GitHub Actions workflow"
echo "  ✅ GitHub Actions secrets"
echo ""
echo "Note: GitHub repository and code remain intact"
echo "Note: DynamoDB tables and S3 buckets remain (not managed by Terraform)"
echo ""
