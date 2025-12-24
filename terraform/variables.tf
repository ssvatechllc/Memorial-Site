variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project Name"
  type        = string
  default     = "nanna-memorial"
}

variable "admin_key" {
  description = "Admin API Key"
  type        = string
  sensitive   = true
}
