import os
import logging
from uuid import uuid4
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger("pathfind.s3")

# S3 Configuration
S3_BUCKET = os.getenv("S3_BUCKET_NAME") or os.getenv("S3_BUCKET")
S3_REGION = os.getenv("AWS_REGION", "us-east-1")

_use_s3_env = os.getenv("USE_S3")
if _use_s3_env is not None:
    USE_S3 = _use_s3_env.lower() == "true"
else:
    USE_S3 = bool(S3_BUCKET)

# Fallback to local storage if S3 not configured
LOCAL_UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "uploads")
try:
    os.makedirs(LOCAL_UPLOAD_DIR, exist_ok=True)
except (PermissionError, OSError) as e:
    logger.warning(f"Could not create static upload directory '{LOCAL_UPLOAD_DIR}' at startup: {e}")


def get_local_upload_dir():
    """Ensure and return a writable local upload directory."""
    try:
        os.makedirs(LOCAL_UPLOAD_DIR, exist_ok=True)
        return LOCAL_UPLOAD_DIR
    except (PermissionError, OSError):
        tmp_dir = os.path.join("/tmp", "uploads")
        os.makedirs(tmp_dir, exist_ok=True)
        return tmp_dir


def get_s3_client():
    """Get S3 client with credentials from environment or IAM role."""
    try:
        aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
        aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        aws_session_token = os.getenv("AWS_SESSION_TOKEN")
        region = os.getenv("AWS_REGION", "us-east-1")

        if aws_access_key and aws_secret_key:
            kwargs = {
                "service_name": "s3",
                "region_name": region,
                "aws_access_key_id": aws_access_key,
                "aws_secret_access_key": aws_secret_key,
            }
            if aws_session_token:
                kwargs["aws_session_token"] = aws_session_token
            return boto3.client(**kwargs)
        else:
            # Use IAM role or default credential chain
            return boto3.client("s3", region_name=region)
    except Exception as e:
        logger.warning(f"AWS credentials error: {e}, falling back to local storage")
        return None


def generate_presigned_url(filename_or_key: str, expiration: int = 604800) -> str | None:
    """Generate a presigned S3 URL valid for GET operations (default 7 days)."""
    s3_client = get_s3_client()
    if not s3_client or not S3_BUCKET:
        return None
    key = filename_or_key if filename_or_key.startswith("uploads/") else f"uploads/{filename_or_key}"
    try:
        url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": S3_BUCKET, "Key": key},
            ExpiresIn=expiration,
        )
        return url
    except Exception as e:
        logger.error(f"Failed to generate presigned URL for '{key}': {e}")
        return None


def upload_file_to_s3(file_content, filename, content_type):
    """Upload file to S3 bucket and return readable URL."""
    if not S3_BUCKET:
        raise ValueError("S3_BUCKET_NAME environment variable is required for S3 uploads")

    s3_client = get_s3_client()
    if not s3_client:
        raise RuntimeError("Failed to initialize S3 client")

    # Generate unique filename
    safe_filename = f"{uuid4().hex}_{filename}"
    key = f"uploads/{safe_filename}"

    acl_failed = False
    try:
        s3_client.put_object(
            Bucket=S3_BUCKET,
            Key=key,
            Body=file_content,
            ContentType=content_type,
            # Make file publicly readable if bucket allows ACLs
            ACL="public-read",
        )
    except Exception as e:
        acl_failed = True
        logger.warning(f"S3 ACL public-read put_object failed ({e}), retrying without ACL...")
        try:
            s3_client.put_object(
                Bucket=S3_BUCKET,
                Key=key,
                Body=file_content,
                ContentType=content_type,
            )
        except Exception as retry_err:
            logger.error(f"Failed to upload {filename} to S3 bucket {S3_BUCKET}: {retry_err}")
            raise retry_err

    if acl_failed:
        # Generate presigned URL or API proxy URL if bucket blocks public ACLs
        presigned = generate_presigned_url(key)
        public_url = presigned or f"/api/uploads/{safe_filename}"
    else:
        public_url = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{key}"

    logger.info(f"Successfully uploaded {filename} to S3: {public_url}")
    return public_url, safe_filename


def upload_file_locally(file_content, filename):
    """Fallback: Upload file to local filesystem."""
    safe_filename = f"{uuid4().hex}_{filename}"
    upload_dir = get_local_upload_dir()
    file_path = os.path.join(upload_dir, safe_filename)

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
