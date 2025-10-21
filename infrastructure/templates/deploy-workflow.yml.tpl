name: Deploy to ECS Fargate

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  AWS_REGION: ${aws_region}
  ECR_REPOSITORY: ${ecr_repository}
  ECS_CLUSTER: ${ecs_cluster}
  ECS_SERVICE: ${ecs_service}
  CONTAINER_NAME: ${container_name}

jobs:
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: $${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: $${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: $${{ env.AWS_REGION }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, tag, and push image to Amazon ECR
        id: build-image
        env:
          ECR_REGISTRY: $${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: $${{ github.sha }}
        run: |
          docker buildx build \
            --platform linux/arm64 \
            -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG \
            -t $ECR_REGISTRY/$ECR_REPOSITORY:latest \
            --push \
            .
          echo "image=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> $GITHUB_OUTPUT

      - name: Download current task definition
        run: |
          aws ecs describe-task-definition \
            --task-definition $${{ env.CONTAINER_NAME }} \
            --query taskDefinition > task-definition.json

      - name: Update task definition with new image
        id: task-def
        uses: aws-actions/amazon-ecs-render-task-definition@v1
        with:
          task-definition: task-definition.json
          container-name: $${{ env.CONTAINER_NAME }}
          image: $${{ steps.build-image.outputs.image }}

      - name: Deploy to Amazon ECS
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: $${{ steps.task-def.outputs.task-definition }}
          service: $${{ env.ECS_SERVICE }}
          cluster: $${{ env.ECS_CLUSTER }}
          wait-for-service-stability: true

      - name: Deployment successful
        run: |
          echo "🚀 Deployment completed successfully!"
          echo "🌐 Application URL: https://${domain_name}"
