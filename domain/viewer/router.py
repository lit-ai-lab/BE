from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from typing import List, Optional
from datetime import date, datetime
import pytz
from io import BytesIO
import pandas as pd
import os
from models import Viewer, DetailView, OriginalText
from database import get_db
from schemas import Viewer, ViewerFilter, DetailViewOut  # ViewerSchema → Viewer
from crud.viewer import (get_filtered_viewers, )
from urllib.parse import quote

router = APIRouter(prefix="", tags=["Viewer"])
        

@router.get(
    "/",
    response_model=List[Viewer],
    summary="필터에 맞춘 Viewer 목록 조회",
)
def list_viewers(
    region_id: Optional[str] = Query(None, alias="regionId"),
    agency_id: Optional[str] = Query(None, alias="agencyId"),
    audit_type_id: Optional[str] = Query(None, alias="auditTypeId"),
    category_id: Optional[str] = Query(None, alias="categoryId"),
    task_id: Optional[str] = Query(None, alias="taskId"),
    keyword: Optional[str] = Query(None, alias="keyword"),
    include_special: Optional[bool] = Query(False, alias="includeSpecial"),
    start_date: Optional[str] = Query(None, alias="startDate"),
    end_date: Optional[str] = Query(None, alias="endDate"),
    db: Session = Depends(get_db),
):
    try:
        if region_id == "권역":
            region_id = None
        
        if agency_id == "실시기관":
            agency_id = None
        
        if audit_type_id == "전체":
            audit_type_id = None

        

        filters = ViewerFilter(
            region_id=region_id,
            agency_id=agency_id,
            audit_type_id=audit_type_id,
            category_id=category_id,
            task_id=task_id,
            keyword=keyword,
            include_special=include_special,
            start_date=start_date,
            end_date=end_date,
        )
        return get_filtered_viewers(db, filters)
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="오류")
    
@router.get("/export-file", summary="엑셀 다운로드")
def export_excel_file(
    region_id: Optional[str] = Query(None, alias="regionId"),
    agency_id: Optional[str] = Query(None, alias="agencyId"),
    audit_type_id: Optional[str] = Query(None, alias="auditTypeId"),
    category_id: Optional[str] = Query(None, alias="categoryId"),
    task_id: Optional[str] = Query(None, alias="taskId"),
    keyword: Optional[str] = Query(None, alias="keyword"),
    include_special: Optional[bool] = Query(None, alias="includeSpecial"),
    start_date: Optional[str] = Query(None, alias="startDate"),
    end_date: Optional[str] = Query(None, alias="endDate"),
    db: Session = Depends(get_db),
):
    try:
        filters = ViewerFilter(
            region_id=region_id,
            agency_id=agency_id,
            audit_type_id=audit_type_id,
            category_id=category_id,
            task_id=task_id,
            keyword=keyword,
            include_special=include_special,
            start_date=start_date,
            end_date=end_date,
        )

        viewers = get_filtered_viewers(db, filters)

        rows = []
        for viewer in viewers:
            detail = viewer.detail_view
            keyword_val = detail.keyword if detail else ""
            preprocessed_text = ""
            if detail and detail.originals:
                preprocessed_text = detail.originals[0].preprocessed_text or ""

            rows.append({
                "감사실시기관": viewer.inspection_agency,
                "처분요구명": viewer.disposition_request,
                "관련기관": viewer.related_agency,
                "감사결과": viewer.audit_result,
                "분야": viewer.category,
                "업무": viewer.task,
                "요약": viewer.summary,
                "특이사례": "있음" if viewer.special_case else "",
                "키워드": keyword_val,
                "본문": preprocessed_text,
            })

        df = pd.DataFrame(rows)
        output = BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False, sheet_name="감사 데이터")

        output.seek(0)

        # 안전한 한글 파일명 처리
        kst = pytz.timezone("Asia/Seoul")
        timestamp = datetime.now(kst).strftime("%Y%m%d_%H%M%S")
        raw_filename = f"감사연구원_({start_date})_({end_date})_{timestamp}.xlsx"
        quoted_filename = quote(raw_filename)

        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": f"attachment; filename*=UTF-8''{quoted_filename}"
            }
        )

    except Exception as e:
        print("❌ XLSX export error:", str(e))
        raise HTTPException(status_code=500, detail="엑셀 다운로드 실패")


@router.get(
    "/{detail_view_id}",
    response_model=DetailViewOut,
    summary="상세보기 -> 분석탭 조회",
    )
def get_detail_view(detail_view_id: int, db: Session = Depends(get_db)):
    detail = db.query(DetailView).filter(DetailView.id == detail_view_id).first()
    if not detail:
        raise HTTPException(status_code=404, detail="해당 상세 정보가 존재하지 않습니다.")
    return detail


