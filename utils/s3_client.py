# utils/s3_client.py
import boto3
import os
from dotenv import load_dotenv
from botocore.config import Config

load_dotenv()

AWS_REGION = os.getenv("AWS_DEFAULT_REGION", "ap-northeast-2")
BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

s3_client = boto3.client(
    "s3",
    region_name=AWS_REGION,
    config=Config(s3={"addressing_style": "virtual"})  # ✅ 여기만 설정
)

__all__ = ["s3_client", "BUCKET_NAME"]
