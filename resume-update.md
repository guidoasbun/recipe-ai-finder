# Resume Update: AI-Powered Recipe Generator

## Updated Bullet Point

Place under **Education → California State University Fullerton**, after Party-Time Event Platform:

> **AI-Powered Recipe Generator**: Full-stack Next.js 15 app with OpenAI integration (GPT-3.5-turbo, DALL-E 3), AWS Cognito + Google OAuth, DynamoDB, S3; deployed on ECS Fargate via Terraform IaC

---

## Key Technologies

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 15, React 19, Tailwind CSS |
| **AI Integration** | OpenAI GPT-3.5-turbo, DALL-E 3 |
| **Authentication** | NextAuth.js, AWS Cognito, Google OAuth |
| **Database** | AWS DynamoDB (composite keys, GSI) |
| **Storage** | AWS S3 |
| **Infrastructure** | ECS Fargate, ALB, Route 53, ACM |
| **DevOps** | Terraform, Docker, GitHub Actions |
| **Advanced** | Server-Sent Events (SSE) streaming |

---

## Interview Talking Points

### 1. AI Integration
- Integrated OpenAI's GPT-3.5-turbo for dynamic recipe generation based on user-provided ingredients
- Used DALL-E 3 to generate appetizing food images for each recipe
- Implemented structured JSON parsing for reliable API responses

### 2. Real-Time Streaming (SSE)
- Built Server-Sent Events endpoint to stream recipes as they generate
- Parallel image generation with progressive delivery improves perceived performance
- Demonstrates understanding of async patterns and event-driven architecture

### 3. Authentication Architecture
- Dual-provider authentication: AWS Cognito (email/password) + Google OAuth
- JWT session strategy with secure token management
- HMAC-SHA256 SECRET_HASH computation for Cognito compliance
- Protected routes middleware for authorized access

### 4. Database Design
- DynamoDB schema with composite keys (recipeID + userID)
- Global Secondary Index for efficient user recipe queries
- Automatic user creation on first authentication

### 5. Cloud Infrastructure
- Terraform-managed infrastructure (~925 lines of IaC)
- ECS Fargate with ARM64/Graviton processors for cost optimization
- Application Load Balancer with SSL via ACM
- Route 53 DNS with apex and www subdomain support
- Parameter Store for secure secrets management

### 6. DevOps & CI/CD
- Docker multi-stage builds optimized for ARM64
- GitHub Actions pipeline for automated deployments
- Zero-downtime rolling deployments to ECS
- CloudWatch logging and monitoring

---

## Quick Stats
- **Infrastructure Cost**: ~$29/month (optimized with Graviton)
- **Terraform**: 925+ lines across 6 configuration files
- **API Routes**: 8 endpoints (auth, recipes, streaming)
- **AWS Services**: 10+ (ECS, ALB, DynamoDB, S3, Cognito, Route 53, ACM, ECR, CloudWatch, Parameter Store)
