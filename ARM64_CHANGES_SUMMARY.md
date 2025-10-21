# ARM64 Architecture Changes Summary

## Changes Made to Support AWS Graviton (ARM64)

### Problem Fixed
Docker images built on Apple Silicon (ARM64) were incompatible with AWS Fargate's default AMD64 architecture, causing deployment failures with error:
```
CannotPullContainerError: image Manifest does not contain descriptor matching platform "linux/amd64"
```

### Solution Implemented
Configured entire infrastructure stack to use ARM64 architecture (AWS Graviton processors).

---

## Files Modified (4 files)

### 1. infrastructure/main.tf
**Change:** Added `runtime_platform` block to ECS Task Definition (line ~439-443)

```hcl
runtime_platform {
  operating_system_family = "LINUX"
  cpu_architecture        = "ARM64"
}
```

**Impact:** ECS will now deploy tasks on ARM64 Graviton processors instead of AMD64.

---

### 2. infrastructure/templates/deploy-workflow.yml.tpl
**Changes:**
- Added Docker Buildx setup step
- Modified Docker build command to explicitly build for ARM64 platform

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Build, tag, and push image to Amazon ECR
  run: |
    docker buildx build \
      --platform linux/arm64 \
      -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG \
      -t $ECR_REGISTRY/$ECR_REPOSITORY:latest \
      --push \
      .
```

**Impact:** GitHub Actions (running on AMD64) can now cross-compile ARM64 images.

---

### 3. deploy.sh
**Change:** Updated Docker build instructions to clarify ARM64 usage

```bash
# If you're on Apple Silicon (M1/M2/M3), use native build:
docker build -t recipe-ai-finder:latest .
docker tag recipe-ai-finder:latest $ECR_URL:latest
docker push $ECR_URL:latest

# If you're on Intel Mac or need explicit ARM64:
docker buildx build --platform linux/arm64 -t $ECR_URL:latest --push .
```

**Impact:** Clear instructions for both Apple Silicon and Intel Macs.

---

### 4. Dockerfile
**Change:** Added documentation comments

```dockerfile
# Multi-stage Dockerfile for Next.js App
# Optimized for ARM64 architecture (AWS Graviton / Apple Silicon)
# Platform: linux/arm64 (default on Apple Silicon Macs)
```

**Impact:** Documentation clarity for future developers.

---

## Benefits of ARM64/Graviton

✅ **Cost Savings:** ~$10/month vs ~$12/month (AMD64) = 17% reduction
✅ **Apple Silicon Compatibility:** Native builds on M1/M2/M3 Macs
✅ **Better Performance:** Graviton processors are optimized for efficiency
✅ **No Cross-Compilation:** Apple Silicon users build natively

---

## Next Steps to Deploy

### 1. Apply Terraform Changes
```bash
cd infrastructure
export GITHUB_TOKEN="your_token_here"
terraform plan -var="github_token=$GITHUB_TOKEN"
terraform apply -var="github_token=$GITHUB_TOKEN"
```

This will update the ECS task definition with ARM64 platform.

### 2. Build and Push ARM64 Docker Image
```bash
cd /Users/rodrigo/code/projects/recipe-ai-finder

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ECR_URL>

# Build and push (native on Apple Silicon)
docker build -t recipe-ai-finder:latest .
docker tag recipe-ai-finder:latest <ECR_URL>:latest
docker push <ECR_URL>:latest
```

### 3. Verify Deployment
```bash
# Check ECS service
aws ecs describe-services \
  --cluster recipe-ai-finder-cluster \
  --services recipe-ai-finder-service \
  --region us-east-1

# View logs
aws logs tail /ecs/recipe-ai-finder --follow --region us-east-1
```

---

## Technical Notes

- **Fargate ARM64 Support:** Available in all major AWS regions including us-east-1
- **Node.js ARM64:** Node 20 Alpine base image supports ARM64 natively
- **Next.js Compatibility:** Next.js 15 fully supports ARM64 architecture
- **Docker Buildx:** Enables cross-platform builds from any architecture

---

## Cost Comparison

| Component | AMD64 | ARM64 (Graviton) |
|-----------|-------|------------------|
| ECS Fargate (256 CPU, 512MB) | ~$12/mo | ~$10/mo |
| ALB | ~$16/mo | ~$16/mo |
| Other Services | ~$3/mo | ~$3/mo |
| **Total** | **~$31/mo** | **~$29/mo** |

**Savings: $2/month (6.5% reduction)**

