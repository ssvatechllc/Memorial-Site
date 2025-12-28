#!/bin/bash
set -e

PROJECT_NAME="nanna-memorial"
STATE_BUCKET="${PROJECT_NAME}-tf-state"
REGION="us-east-1"

echo "🚀 Starting Nanna Memorial Site Deployment..."

# 1. AWS Credentials Check
if ! aws sts get-caller-identity > /dev/null 2>&1; then
  echo "❌ Error: AWS credentials not found. Please run 'aws configure'."
  exit 1
fi

# 2. State Bucket Initialization
if ! aws s3 ls "s3://$STATE_BUCKET" > /dev/null 2>&1; then
  echo "📦 Creating Terraform state bucket: $STATE_BUCKET..."
  aws s3 mb "s3://$STATE_BUCKET" --region $REGION
  aws s3api put-bucket-versioning --bucket $STATE_BUCKET --versioning-configuration Status=Enabled
  
  echo "⏳ Waiting for S3 bucket propagation (eventual consistency)..."
  for i in {1..12}; do
    if aws s3 ls "s3://$STATE_BUCKET" > /dev/null 2>&1; then
      echo "✅ Bucket $STATE_BUCKET is now visible."
      break
    fi
    echo "   ...still waiting ($((i*5))s)..."
    sleep 5
  done
  # Extra safety buffer for Terraform backend
  sleep 10
else
  echo "✅ State bucket already exists."
fi

# 3. Package Lambda
echo "📦 Packaging Lambda function..."
cd terraform/lambda
if [ ! -d "node_modules" ]; then
  echo "📥 Installing Lambda dependencies..."
  npm install
fi
zip -r ../lambda.zip .
cd ../..


# 4. Terraform Initialization
echo "⚙️ Initializing Terraform..."
cd terraform
# Dynamically create backend config
cat <<EOF > backend.tf
terraform {
  backend "s3" {
    bucket = "$STATE_BUCKET"
    key    = "terraform.tfstate"
    region = "$REGION"
  }
}
EOF

terraform init -reconfigure

# 5. Terraform Plan & Apply
echo "📝 Applying Infrastructure changes..."
# We need the variables for the deployment
if [ -f "../.env" ]; then
  ADMIN_KEY=$(grep VITE_ADMIN_KEY "../.env" | cut -d '=' -f2)
  ADMIN_USER=$(grep VITE_ADMIN_USERNAME "../.env" | cut -d '=' -f2 || echo "admin")
  ADMIN_PASS=$(grep VITE_ADMIN_PASSWORD "../.env" | cut -d '=' -f2)
  G_CLIENT_ID=$(grep GOOGLE_CLIENT_ID "../.env" | cut -d '=' -f2)
  G_CLIENT_SECRET=$(grep GOOGLE_CLIENT_SECRET "../.env" | cut -d '=' -f2)
  G_REFRESH_TOKEN=$(grep GOOGLE_REFRESH_TOKEN "../.env" | cut -d '=' -f2)
else
  ADMIN_KEY="temp-admin-key"
  ADMIN_USER="admin"
  ADMIN_PASS="temp-pass"
  G_CLIENT_ID=""
  G_CLIENT_SECRET=""
  G_REFRESH_TOKEN=""
fi

terraform apply -auto-approve \
  -var="admin_key=$ADMIN_KEY" \
  -var="admin_username=$ADMIN_USER" \
  -var="admin_password=$ADMIN_PASS" \
  -var="aws_region=$REGION" \
  -var="project_name=$PROJECT_NAME" \
  -var="google_client_id=$G_CLIENT_ID" \
  -var="google_client_secret=$G_CLIENT_SECRET" \
  -var="google_refresh_token=$G_REFRESH_TOKEN"


# 6. Extract Outputs
API_URL=$(terraform output -raw api_url)
WEB_BUCKET=$(terraform output -raw frontend_bucket)
CF_URL=$(terraform output -raw cloudfront_url)
CF_ID=$(terraform output -raw cloudfront_distribution_id)
cd ..

# 7. Build Frontend
echo "🏗️ Building Frontend..."
export VITE_AWS_API_URL="${CF_URL}/prod"
rm -rf out
npm run build

# 8. Deploy Frontend
echo "🌐 Uploading to S3..."
aws s3 sync out/ "s3://$WEB_BUCKET" --delete --region $REGION

# 9. Invalidate CloudFront (Optional but recommended)
if [ ! -z "$CF_ID" ]; then
  echo "⚡ Invalidating CloudFront cache..."
  aws cloudfront create-invalidation --distribution-id "$CF_ID" --paths "/*" --region $REGION > /dev/null
fi

echo "✅ Deployment Complete!"
echo "📍 Website URL (HTTPS): $CF_URL"
echo "🔗 API Gateway: $API_URL"
echo "⚠️ Note: CloudFront may take a few minutes to propogate initially."
