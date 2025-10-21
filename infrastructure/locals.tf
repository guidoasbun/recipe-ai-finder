locals {
  tags = {
    Project     = var.app_name
    Environment = "production"
    ManagedBy   = "terraform"
  }
}
