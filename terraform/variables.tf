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

variable "google_client_id" {
  description = "Google OAuth Client ID"
  type        = string
  default     = ""
}

variable "google_client_secret" {
  description = "Google OAuth Client Secret"
  type        = string
  sensitive   = true
  default     = ""
}

variable "google_refresh_token" {
  description = "Google OAuth Refresh Token"
  type        = string
  sensitive   = true
  default     = ""
}

variable "admin_username" {
  description = "Admin Username"
  type        = string
  default     = "admin"
}

variable "admin_password" {
  description = "Admin Password"
  type        = string
  sensitive   = true
}

variable "session_secret" {
  description = "Secret for JWT session tokens"
  type        = string
  sensitive   = true
  default     = "nanna-memorial-secret-2024"
}
