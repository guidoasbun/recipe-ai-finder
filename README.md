# Recipe AI Finder
[https://www.recipe-ai-finder.com](https://recipe-ai-finder.com/)

Recipe AI Finder is a Next.js application that helps users find recipes based on ingredients they have available. The application uses OpenAI to generate recipe suggestions and is deployed on AWS infrastructure using ECS Fargate with ARM64 (Graviton) processors.

## Features

- Search for recipes based on available ingredients
- AI-powered recipe generation using OpenAI
- View detailed recipe instructions
- Save favorite recipes
- User authentication with AWS Cognito
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Next.js API routes (App Router + Pages Router)
- **Authentication**: NextAuth.js v4 with AWS Cognito
- **AI**: OpenAI (GPT-3.5-turbo for recipes, DALL-E 3 for images)
- **Database**: AWS DynamoDB
- **Storage**: AWS S3
- **Infrastructure**: AWS (ECS Fargate ARM64/Graviton, ALB, ECR, Route 53, ACM, CloudWatch)
- **IaC**: Terraform
- **CI/CD**: GitHub Actions

![infrastructure](/public/infrastructure.png "Infrastructure Architecture")

## Architecture

The application runs on AWS ECS Fargate with ARM64 (Graviton) processors for cost efficiency and performance:

- **Compute**: ECS Fargate tasks running Docker containers (ARM64)
- **Load Balancing**: Application Load Balancer with SSL/TLS
- **Container Registry**: Amazon ECR for Docker images
- **DNS**: Route 53 with custom domain
- **Secrets**: AWS Parameter Store (encrypted)
- **Logs**: CloudWatch Logs
- **Auto-scaling**: Based on CPU/Memory utilization (1-3 tasks)

**Cost**: ~$29/month for production infrastructure

---

## Getting Started

### Visit the Live Application
Go to [https://www.recipe-ai-finder.com](https://recipe-ai-finder.com/)

---

## Local Development

### Prerequisites

- Node.js 20+ and npm
- AWS account (for deployment)
- OpenAI API key
- AWS Cognito configured

### Setup

1. Clone the repository:

```bash
git clone https://github.com/guidoasbun/recipe-ai-finder.git
cd recipe-ai-finder
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with the required environment variables:

```env
# OpenAI
OPENAI_API_KEY=your-openai-api-key

# AWS Cognito
COGNITO_CLIENT_ID=your-cognito-client-id
COGNITO_CLIENT_SECRET=your-cognito-client-secret
COGNITO_ISSUER=https://cognito-idp.us-east-1.amazonaws.com/your-user-pool

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
DYNAMO_TABLE_NAME=Recipes-recipe-ai
S3_BUCKET_NAME=recipe-ai-images
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

The application is deployed on AWS using Terraform-managed infrastructure with ECS Fargate (ARM64/Graviton processors).

### Prerequisites

Before deploying, ensure you have:

1. **Terraform** installed (v1.0+)
   ```bash
   brew install terraform  # macOS
   ```

2. **AWS CLI** installed and configured
   ```bash
   aws configure
   # Enter your AWS credentials and region (us-east-1)
   ```

3. **Docker** installed (for building images)

4. **GitHub Personal Access Token**
   - Go to: https://github.com/settings/tokens
   - Create a token with scopes: `repo`, `workflow`, `admin:repo_hook`
   - Save the token securely

5. **Domain in Route 53**
   - Ensure `recipe-ai-finder.com` is registered and hosted in Route 53

### Initial Deployment

#### Step 1: Set Environment Variables

```bash
export GITHUB_TOKEN="ghp_your_github_token_here"
```

#### Step 2: Deploy Infrastructure

Run the automated deployment script:

```bash
./deploy.sh
```

This script will:
1. Initialize Terraform
2. Validate the configuration
3. Show you a deployment plan
4. Ask for confirmation (type "yes")
5. Deploy all AWS resources (~10-15 minutes)
6. Configure GitHub Actions
7. Display Docker build commands

**What gets created:**
- ✅ VPC with public subnets across 2 availability zones
- ✅ Application Load Balancer with SSL certificate
- ✅ ECS Fargate cluster configured for ARM64 (Graviton)
- ✅ ECR repository for Docker images
- ✅ Route 53 DNS records (apex and www)
- ✅ SSL/TLS certificate (auto-validated via DNS)
- ✅ CloudWatch log groups
- ✅ IAM roles and policies
- ✅ AWS Parameter Store secrets (encrypted)
- ✅ GitHub Actions workflow and secrets

#### Step 3: Build and Push Initial Docker Image

After infrastructure deployment completes, build and push your Docker image:

```bash
# Get ECR repository URL from Terraform output
ECR_URL=$(cd infrastructure && terraform output -raw ecr_repository_url)

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_URL

# Build and push (ARM64 - native on Apple Silicon M1/M2/M3)
docker build -t recipe-ai-finder:latest .
docker tag recipe-ai-finder:latest $ECR_URL:latest
docker push $ECR_URL:latest
```

**Note**: If you're on Apple Silicon (M1/M2/M3), Docker will automatically build ARM64 images. No special flags needed!

#### Step 4: Verify Deployment

```bash
# Check ECS service status
aws ecs describe-services \
  --cluster recipe-ai-finder-cluster \
  --services recipe-ai-finder-service \
  --region us-east-1

# View application logs
aws logs tail /ecs/recipe-ai-finder --follow --region us-east-1
```

#### Step 5: Access Your Application

After DNS propagates (2-3 minutes), visit:
- **https://recipe-ai-finder.com**

---

## Day-to-Day Workflow

Once deployed, GitHub Actions automatically deploys on every push to `main`:

```bash
# 1. Make changes to code
vim src/app/page.js

# 2. Test locally
npm run dev

# 3. Commit and push
git add .
git commit -m "feat: add new feature"
git push origin main

# 4. GitHub Actions deploys automatically!
```

GitHub Actions will:
1. Build a multi-platform Docker image (ARM64)
2. Push to ECR
3. Update ECS task definition
4. Deploy with zero-downtime rolling update

---

## Infrastructure Management

### Teardown (Destroy Everything)

To completely destroy all infrastructure and avoid costs:

```bash
export GITHUB_TOKEN="ghp_your_github_token_here"
./teardown.sh
```

This will:
1. Ask for confirmation (type "yes")
2. Delete all ECR images
3. Destroy all AWS resources
4. Remove GitHub Actions workflow and secrets
5. Complete in ~5 minutes

**What gets deleted:**
- ✅ ECS Fargate cluster and tasks
- ✅ Application Load Balancer
- ✅ ECR repository and all Docker images
- ✅ VPC and networking
- ✅ Route 53 DNS records (A records only)
- ✅ SSL certificate
- ✅ CloudWatch logs
- ✅ AWS Parameter Store secrets
- ✅ GitHub Actions configuration

**What remains:**
- ✅ Your code and GitHub repository
- ✅ DynamoDB tables (Users-recipe-ai, Recipes-recipe-ai)
- ✅ S3 bucket (recipe-ai-images)
- ✅ Route 53 Hosted Zone (domain registration)

### Re-Deploy After Teardown

To deploy again after teardown, simply run:

```bash
export GITHUB_TOKEN="ghp_your_github_token_here"
./deploy.sh
```

Then rebuild and push the Docker image (see Step 3 above).

### Update Infrastructure Configuration

To modify infrastructure settings (e.g., increase CPU/memory):

1. Edit `infrastructure/terraform.tfvars`:
   ```hcl
   fargate_cpu    = 512   # Increase from 256
   fargate_memory = 1024  # Increase from 512
   ```

2. Apply changes:
   ```bash
   cd infrastructure
   export GITHUB_TOKEN="ghp_your_token"
   terraform apply -var="github_token=$GITHUB_TOKEN"
   ```

---

## Monitoring and Logs

### View Live Logs

```bash
# Follow logs in real-time
aws logs tail /ecs/recipe-ai-finder --follow --region us-east-1

# View recent logs
aws logs tail /ecs/recipe-ai-finder --since 1h --region us-east-1
```

### Check ECS Service Status

```bash
aws ecs describe-services \
  --cluster recipe-ai-finder-cluster \
  --services recipe-ai-finder-service \
  --query 'services[0].{Status:status,DesiredCount:desiredCount,RunningCount:runningCount,Deployments:deployments}' \
  --region us-east-1
```

### View CloudWatch Metrics

Visit AWS Console:
- CloudWatch > Log groups > `/ecs/recipe-ai-finder`
- ECS > Clusters > `recipe-ai-finder-cluster`

---

## Cost Breakdown

Monthly costs for production infrastructure:

| Resource | Cost |
|----------|------|
| ECS Fargate (ARM64/Graviton, 256 CPU, 512MB) | ~$10/month |
| Application Load Balancer | ~$16/month |
| ECR Storage (~5GB) | ~$0.50/month |
| CloudWatch Logs (7-day retention) | ~$0.50/month |
| Parameter Store (secrets) | ~$0.35/month |
| Route 53 Hosted Zone | ~$0.50/month |
| Data Transfer | ~$1-2/month |
| **Total** | **~$29/month** |

**Note**: Using ARM64 (Graviton) saves ~17% compared to AMD64 architecture.

---

## Troubleshooting

### Deployment Issues

**Issue**: Terraform validation fails
```bash
cd infrastructure
terraform validate
```

**Issue**: Docker image fails to pull
- Ensure you're building for ARM64 (native on Apple Silicon)
- Verify ECR login: `aws ecr get-login-password --region us-east-1`

**Issue**: ECS task keeps restarting
```bash
# Check logs for errors
aws logs tail /ecs/recipe-ai-finder --follow --region us-east-1

# Check task events
aws ecs describe-services \
  --cluster recipe-ai-finder-cluster \
  --services recipe-ai-finder-service \
  --query 'services[0].events' \
  --region us-east-1
```

**Issue**: DNS not resolving
- Wait 2-3 minutes for DNS propagation
- Verify Route 53 records point to ALB
- Check SSL certificate validation status

### Force New Deployment

To manually trigger a deployment with the latest image:

```bash
aws ecs update-service \
  --cluster recipe-ai-finder-cluster \
  --service recipe-ai-finder-service \
  --force-new-deployment \
  --region us-east-1
```

---

## Project Structure

```
recipe-ai-finder/
├── src/
│   ├── app/              # Next.js App Router pages and API routes
│   ├── pages/api/        # Legacy Pages Router (recipe generation)
│   ├── lib/              # Utilities (openai.js, dynamo.js, s3.js)
│   ├── components/       # React components
│   └── middleware.js     # Auth middleware
├── public/               # Static assets
├── infrastructure/       # Terraform configuration
│   ├── main.tf          # Core AWS resources
│   ├── variables.tf     # Input variables
│   ├── outputs.tf       # Output values
│   ├── secrets.tf       # Parameter Store secrets
│   ├── github.tf        # GitHub Actions config
│   ├── terraform.tfvars # Your specific values (gitignored)
│   └── templates/       # GitHub Actions workflow template
├── Dockerfile           # Multi-stage Docker build (ARM64)
├── deploy.sh            # Automated deployment script
├── teardown.sh          # Automated teardown script
└── next.config.mjs      # Next.js config (standalone output)
```

---

## Environment Variables

### Required for Deployment (in `infrastructure/terraform.tfvars`)

- `aws_region` - AWS region (default: us-east-1)
- `domain_name` - Your domain (recipe-ai-finder.com)
- `github_owner` - GitHub username
- `github_repo` - Repository name
- `openai_api_key` - OpenAI API key
- `cognito_client_id` - Cognito client ID
- `cognito_client_secret` - Cognito client secret
- `cognito_issuer` - Cognito issuer URL
- `app_aws_access_key_id` - AWS credentials for app
- `app_aws_secret_access_key` - AWS secret key

### Managed by Terraform

Terraform automatically creates and manages these in AWS Parameter Store:
- NEXTAUTH_SECRET (auto-generated)
- NEXTAUTH_URL (set to your domain)
- All credentials and configuration

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

For issues and questions:
- Open an issue on GitHub
- Check CloudWatch logs for runtime errors
- Review Terraform state for infrastructure issues

---

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [OpenAI](https://openai.com/)
- Deployed on [AWS](https://aws.amazon.com/)
- Infrastructure managed with [Terraform](https://www.terraform.io/)
