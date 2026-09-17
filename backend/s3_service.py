import os
import logging
from uuid import uuid4
import boto3
from botocore.exceptions import ClientError, NoCredentialsError

logger = logging.getLogger("pathfind.s3")

# S3 Configuration
S3_BUCKET = os.getenv("S3_BUCKET_NAME")
S3_REGION = os.getenv("AWS_REGION", "us-east-1")
USE_S3 = os.getenv("USE_S3", "false").lower() == "true"

# Fallback to local storage if S3 not configured
LOCAL_UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "uploads")
os.makedirs(LOCAL_UPLOAD_DIR, exist_ok=True)


def get_s3_client():
    """Get S3 client with credentials from environment or IAM role."""
    try:
        if os.getenv("AWS_ACCESS_KEY_ID") and os.getenv("AWS_SECRET_ACCESS_KEY"):
            # Use explicit credentials
            return boto3.client(
                "s3",
                region_name=S3_REGION,
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            )
        else:
            # Use IAM role or default credential chain
            return boto3.client("s3", region_name=S3_REGION)
    except NoCredentialsError:
        logger.warning("AWS credentials not found, falling back to local storage")
        return None


def upload_file_to_s3(file_content, filename, content_type):
    """Upload file to S3 bucket and return public URL."""
    if not S3_BUCKET:
        raise ValueError("S3_BUCKET_NAME environment variable is required for S3 uploads")

    s3_client = get_s3_client()
    if not s3_client:
        raise RuntimeError("Failed to initialize S3 client")

    # Generate unique filename
    safe_filename = f"{uuid4().hex}_{filename}"
    key = f"uploads/{safe_filename}"

    try:
        s3_client.put_object(
            Bucket=S3_BUCKET,
            Key=key,
            Body=file_content,
            ContentType=content_type,
            # Make file publicly readable
            ACL="public-read",
        )
        
        # Construct public URL
        public_url = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{key}"
        logger.info(f"Successfully uploaded {filename} to S3: {public_url}")
        return public_url, safe_filename
    except ClientError as e:
        logger.error(f"Failed to upload {filename} to S3: {e}")
        raise


def upload_file_locally(file_content, filename):
    """Fallback: Upload file to local filesystem."""
    safe_filename = f"{uuid4().hex}_{filename}"
    file_path = os.path.join(LOCAL_UPLOAD_DIR, safe_filename)
    
    with open(file_path, "wb") as f:
        f.write(file_content)
    
    # Return local URL
    local_url = f"/static/uploads/{safe_filename}"
    logger.info(f"Uploaded {filename} to local storage: {local_url}")
    return local_url, safe_filename


def upload_file(file_content, filename, content_type="application/octet-stream"):
    """
    Upload file to S3 or local storage based on configuration.
    Returns (url, filename) tuple.
    """
    if USE_S3 and S3_BUCKET:
        try:
            return upload_file_to_s3(file_content, filename, content_type)
        except Exception as e:
            logger.error(f"S3 upload failed, falling back to local storage: {e}")
            return upload_file_locally(file_content, filename)
    else:
        logger.info("S3 not configured, using local storage")
        return upload_file_locally(file_content, filename)


def delete_file_from_s3(key):
    """Delete file from S3 bucket."""
    if not S3_BUCKET:
        return False
    
    s3_client = get_s3_client()
    if not s3_client:
        return False
    
    try:
        s3_client.delete_object(Bucket=S3_BUCKET, Key=key)
        logger.info(f"Deleted {key} from S3")
        return True
    except ClientError as e:
        logger.error(f"Failed to delete {key} from S3: {e}")
        return False


def delete_file_locally(filename):
    """Delete file from local storage."""
    file_path = os.path.join(LOCAL_UPLOAD_DIR, filename)
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Deleted {filename} from local storage")
            return True
    except OSError as e:
        logger.error(f"Failed to delete {filename} from local storage: {e}")
    return False
