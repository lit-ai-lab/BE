# domain/pdf/service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import DetailView
from utils.s3_client import s3_client, BUCKET_NAME
from botocore.config import Config
import os

def get_pdf_presigned_url(detail_view_id: int, db: Session):
    print(f"📥 PDF 요청: detail_view_id={detail_view_id}")

    # 1. DB 조회
    detail = db.query(DetailView).filter(DetailView.id == detail_view_id).first()
    if not detail:
        raise HTTPException(status_code=404, detail="DetailView not found")

    file_hash = detail.file_hash
    if not file_hash:
        raise HTTPException(status_code=404, detail="File hash not found")

    # 2. S3 presigned URL 생성
    key = f"pdfs/{file_hash}.pdf"

    try:
        # boto3 client 재정의 (가급적 utils에서 addressing_style 설정 포함하도록 리팩터링 추천)
        url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": BUCKET_NAME, "Key": key},
            ExpiresIn=3600,
        )
    except Exception as e:
        print(f"❌ S3 URL 생성 오류: {e}")
        raise HTTPException(status_code=500, detail="Presigned URL 생성 실패")

    print(f"✅ S3 presigned URL 생성됨: {url}")
    return {"url": url}
