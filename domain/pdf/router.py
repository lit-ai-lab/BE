from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from utils.s3_client import s3_client, BUCKET_NAME
from domain.pdf.service import get_pdf_presigned_url
from database import get_db

router = APIRouter()

@router.get("/pdf-url")
def fetch_pdf_url(
    detail_view_id: int = None,
    file_hash: str = None,
    db: Session = Depends(get_db)
):
    if not detail_view_id and not file_hash:
        raise HTTPException(status_code=400, detail="detail_view_id 또는 file_hash가 필요합니다.")

    if detail_view_id:
        return get_pdf_presigned_url(detail_view_id, db)

    if file_hash:
        key = f"pdfs/{file_hash}.pdf"

        # 🔍 S3에 실제로 존재하는지 검사
        try:
            s3_client.head_object(Bucket=BUCKET_NAME, Key=key)
        except s3_client.exceptions.ClientError as e:
            if e.response['Error']['Code'] == "404":
                return JSONResponse(status_code=404, content={"error": "PDF 파일이 존재하지 않습니다."})
            raise HTTPException(status_code=500, detail=f"S3 검사 실패: {str(e)}")

        # ✅ 존재하는 경우 presigned URL 발급
        try:
            url = s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": BUCKET_NAME, "Key": key},
                ExpiresIn=3600
            )
            return {"url": url}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Presigned URL 생성 실패: {str(e)}")
