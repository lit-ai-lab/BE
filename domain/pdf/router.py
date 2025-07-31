# domain/pdf/router.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from domain.pdf.service import get_pdf_presigned_url
router = APIRouter()

# @router.get("/pdf-url")
# def pdf_url(detail_view_id: str, db: Session = Depends(get_db)):
#     url = get_presigned_pdf_url(detail_view_id, db)
#     if url is None:
#         raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다.")
#     return {"url": url}


# @router.get("/")
# def get_pdf_url(id: int = Query(..., description="DetailView의 id")):
#     return get_pdf_presigned_url(id)

# @router.get("/pdf-url")
# def fetch_pdf_url(detail_view_id: int, db: Session = Depends(get_db)):
#     return get_pdf_presigned_url(detail_view_id, db)

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
        from utils.s3_client import s3_client, BUCKET_NAME
        key = f"pdfs/{file_hash}.pdf"
        try:
            url = s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": BUCKET_NAME, "Key": key},
                ExpiresIn=3600
            )
            return {"url": url}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Presigned URL 생성 실패: {str(e)}")
