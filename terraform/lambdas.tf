# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Policy for DynamoDB and S3
resource "aws_iam_policy" "lambda_policy" {
  name        = "${var.project_name}-lambda-policy"
  description = "Policy for Nanna Memorial Lambda execution"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Effect   = "Allow"
        Resource = [
          aws_dynamodb_table.content_table.arn,
          "${aws_dynamodb_table.content_table.arn}/index/*"
        ]
      },
      {
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Effect   = "Allow"
        Resource = [
          aws_s3_bucket.media_bucket.arn,
          "${aws_s3_bucket.media_bucket.arn}/*"
        ]
      },
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

# Lambda Function (Consolidated)
resource "aws_lambda_function" "site_api" {
  filename      = "lambda.zip"
  function_name = "${var.project_name}-api"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler" 
  runtime       = "nodejs18.x"
  source_code_hash = filebase64sha256("lambda.zip")
  timeout       = 30

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.content_table.name
      BUCKET_NAME = aws_s3_bucket.media_bucket.id
      ADMIN_KEY  = var.admin_key
    }
  }
}

# Video Processor Lambda
resource "aws_lambda_function" "video_processor" {
  filename      = "lambda.zip" # Reusing the same zip for both
  function_name = "${var.project_name}-video-processor"
  role          = aws_iam_role.lambda_role.arn
  handler       = "video-processor.handler"
  runtime       = "nodejs18.x"
  source_code_hash = filebase64sha256("lambda.zip")
  timeout       = 300 # Longer timeout for video uploads
  memory_size   = 512 # More memory for processing streams

  environment {
    variables = {
      TABLE_NAME           = aws_dynamodb_table.content_table.name
      GOOGLE_CLIENT_ID     = var.google_client_id
      GOOGLE_CLIENT_SECRET = var.google_client_secret
      GOOGLE_REFRESH_TOKEN = var.google_refresh_token
    }
  }
}

# S3 Trigger for Video Processor
resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.video_processor.arn
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.media_bucket.arn
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.media_bucket.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.video_processor.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "media/"
  }

  depends_on = [aws_lambda_permission.allow_bucket]
}

