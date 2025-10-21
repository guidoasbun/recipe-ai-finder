# GitHub Provider Configuration
provider "github" {
  token = var.github_token
  owner = var.github_owner
}

# Create GitHub Actions workflow file
resource "github_repository_file" "deploy_workflow" {
  repository          = var.github_repo
  branch              = "main"
  file                = ".github/workflows/deploy.yml"
  commit_message      = "Add ECS Fargate deployment workflow [terraform]"
  overwrite_on_create = true

  content = templatefile("${path.module}/templates/deploy-workflow.yml.tpl", {
    aws_region     = var.aws_region
    ecr_repository = aws_ecr_repository.app.name
    ecs_cluster    = aws_ecs_cluster.main.name
    ecs_service    = aws_ecs_service.main.name
    container_name = var.app_name
    domain_name    = var.domain_name
  })
}

# GitHub Actions Secrets
resource "github_actions_secret" "aws_access_key_id" {
  repository      = var.github_repo
  secret_name     = "AWS_ACCESS_KEY_ID"
  plaintext_value = var.app_aws_access_key_id
}

resource "github_actions_secret" "aws_secret_access_key" {
  repository      = var.github_repo
  secret_name     = "AWS_SECRET_ACCESS_KEY"
  plaintext_value = var.app_aws_secret_access_key
}

resource "github_actions_secret" "aws_region" {
  repository      = var.github_repo
  secret_name     = "AWS_REGION"
  plaintext_value = var.aws_region
}

# Data source for repository
data "github_repository" "repo" {
  full_name = "${var.github_owner}/${var.github_repo}"
}
