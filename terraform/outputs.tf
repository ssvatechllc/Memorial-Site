output "api_url" {
  value = aws_api_gateway_stage.prod.invoke_url
}

output "website_url" {
  value = aws_s3_bucket_website_configuration.frontend_website.website_endpoint
}

output "frontend_bucket" {
  value = aws_s3_bucket.frontend_bucket.id
}

output "cloudfront_url" {
  value = "https://${aws_cloudfront_distribution.frontend_distribution.domain_name}"
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.frontend_distribution.id
}
