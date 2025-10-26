variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "Domain name"
  type        = string
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "recipe-ai-finder"
}

variable "github_owner" {
  description = "GitHub repository owner"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}

variable "github_token" {
  description = "GitHub personal access token"
  type        = string
  sensitive   = true
}

variable "container_port" {
  description = "Container port"
  type        = number
  default     = 3000
}

variable "fargate_cpu" {
  description = "Fargate CPU units"
  type        = number
  default     = 256
}

variable "fargate_memory" {
  description = "Fargate memory in MB"
  type        = number
  default     = 512
}

variable "desired_count" {
  description = "Desired number of tasks"
  type        = number
  default     = 1
}

variable "min_count" {
  description = "Minimum number of tasks"
  type        = number
  default     = 1
}

variable "max_count" {
  description = "Maximum number of tasks"
  type        = number
  default     = 3
}

# Application secrets
variable "openai_api_key" {
  description = "OpenAI API Key"
  type        = string
  sensitive   = true
}

variable "cognito_client_id" {
  description = "Cognito Client ID"
  type        = string
  sensitive   = true
}

variable "cognito_client_secret" {
  description = "Cognito Client Secret"
  type        = string
  sensitive   = true
}

variable "cognito_issuer" {
  description = "Cognito Issuer URL"
  type        = string
  sensitive   = true
}

variable "google_client_id" {
  description = "Google OAuth Client ID"
  type        = string
  sensitive   = true
}

variable "google_client_secret" {
  description = "Google OAuth Client Secret"
  type        = string
  sensitive   = true
}

variable "app_aws_access_key_id" {
  description = "AWS Access Key ID for application (DynamoDB/S3)"
  type        = string
  sensitive   = true
}

variable "app_aws_secret_access_key" {
  description = "AWS Secret Access Key for application"
  type        = string
  sensitive   = true
}

variable "dynamo_table_name" {
  description = "DynamoDB table name"
  type        = string
  default     = "Recipes-recipe-ai"
}

variable "s3_bucket_name" {
  description = "S3 bucket name for recipe images"
  type        = string
  default     = "recipe-ai-images"
}
