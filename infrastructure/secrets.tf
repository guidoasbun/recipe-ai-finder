# Generate a secure NextAuth secret
resource "random_password" "nextauth_secret" {
  length  = 32
  special = true
}

# AWS Parameter Store - Application Secrets
resource "aws_ssm_parameter" "openai_api_key" {
  name  = "/${var.app_name}/OPENAI_API_KEY"
  type  = "SecureString"
  value = var.openai_api_key

  tags = local.tags
}

resource "aws_ssm_parameter" "nextauth_secret" {
  name  = "/${var.app_name}/NEXTAUTH_SECRET"
  type  = "SecureString"
  value = random_password.nextauth_secret.result

  tags = local.tags
}

resource "aws_ssm_parameter" "cognito_client_id" {
  name  = "/${var.app_name}/COGNITO_CLIENT_ID"
  type  = "SecureString"
  value = var.cognito_client_id

  tags = local.tags
}

resource "aws_ssm_parameter" "cognito_client_secret" {
  name  = "/${var.app_name}/COGNITO_CLIENT_SECRET"
  type  = "SecureString"
  value = var.cognito_client_secret

  tags = local.tags
}

resource "aws_ssm_parameter" "cognito_issuer" {
  name  = "/${var.app_name}/COGNITO_ISSUER"
  type  = "SecureString"
  value = var.cognito_issuer

  tags = local.tags
}

resource "aws_ssm_parameter" "google_client_id" {
  name  = "/${var.app_name}/GOOGLE_CLIENT_ID"
  type  = "SecureString"
  value = var.google_client_id

  tags = local.tags
}

resource "aws_ssm_parameter" "google_client_secret" {
  name  = "/${var.app_name}/GOOGLE_CLIENT_SECRET"
  type  = "SecureString"
  value = var.google_client_secret

  tags = local.tags
}

resource "aws_ssm_parameter" "app_aws_access_key_id" {
  name  = "/${var.app_name}/AWS_ACCESS_KEY_ID"
  type  = "SecureString"
  value = var.app_aws_access_key_id

  tags = local.tags
}

resource "aws_ssm_parameter" "app_aws_secret_access_key" {
  name  = "/${var.app_name}/AWS_SECRET_ACCESS_KEY"
  type  = "SecureString"
  value = var.app_aws_secret_access_key

  tags = local.tags
}

resource "aws_ssm_parameter" "dynamo_table_name" {
  name  = "/${var.app_name}/DYNAMO_TABLE_NAME"
  type  = "String"
  value = var.dynamo_table_name

  tags = local.tags
}

resource "aws_ssm_parameter" "s3_bucket_name" {
  name  = "/${var.app_name}/S3_BUCKET_NAME"
  type  = "String"
  value = var.s3_bucket_name

  tags = local.tags
}

resource "aws_ssm_parameter" "nextauth_url" {
  name  = "/${var.app_name}/NEXTAUTH_URL"
  type  = "String"
  value = "https://${var.domain_name}"

  tags = local.tags
}

resource "aws_ssm_parameter" "aws_region" {
  name  = "/${var.app_name}/AWS_REGION"
  type  = "String"
  value = var.aws_region

  tags = local.tags
}
