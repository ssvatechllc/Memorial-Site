terraform {
  backend "s3" {
    bucket = "nanna-memorial-tf-state"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}
