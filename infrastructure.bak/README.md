# Recipe AI Finder Infrastructure

This directory contains the Terraform configuration for deploying the Recipe AI Finder application on AWS.

## Infrastructure Components

- VPC with public subnets
- Application Load Balancer
- Auto Scaling Group with EC2 instances
- Route 53 DNS configuration
- ACM SSL certificate
- Security Groups
- IAM roles and policies

## Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform installed (version 1.0.0 or later)
- A registered domain in Route 53

## Setup Instructions

1. Create a `terraform.tfvars` file based on the example:

```bash
cp terraform.tfvars.example terraform.tfvars
```

2. Edit the `terraform.tfvars` file with your specific values:

```hcl
aws_region  = "us-east-1"
domain_name = "recipe-ai-finder.com"
key_name    = "your-ssh-key-name"
env_vars = {
  NEXTAUTH_URL          = "https://recipe-ai-finder.com"
  NEXTAUTH_SECRET       = "your-nextauth-secret"
  OPENAI_API_KEY        = "your-openai-api-key"
  # Add other environment variables as needed
}
```

3. Initialize Terraform:

```bash
terraform init
```

4. Deploy the application code to S3:

```bash
./deploy.sh
```

5. Apply the Terraform configuration:

```bash
terraform apply
```

## Updating the Application

1. Make changes to your application code
2. Deploy the updated code to S3:

```bash
./deploy.sh
```

3. Terminate the current EC2 instance to force a new deployment:

```bash
aws autoscaling terminate-instance-in-auto-scaling-group --instance-id <instance-id> --no-should-decrement-desired-capacity
```

## Notes

- The infrastructure is designed to support both the apex domain (recipe-ai-finder.com) and www subdomain (www.recipe-ai-finder.com)
- SSL certificates are automatically provisioned and validated through DNS
- Health checks are configured to ensure the application is responding correctly
