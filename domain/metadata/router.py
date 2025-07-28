from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import MetaData
from schemas import MetaData as MD
from crud.metadata import get_home_metadata

router = APIRouter(prefix="", tags=["Metadata"],)

@router.get("", response_model=MD, summary="홈 메타데이터 조회")
def read_home_metadata(db: Session = Depends(get_db)):
    """
    metadata 테이블에서
    감사실시기관·관련기관·감사사항·case_uuid의
    유니크 개수를 집계하여 반환합니다.
    """
    return get_home_metadata(db)