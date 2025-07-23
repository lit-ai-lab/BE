from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import List, Optional

from models import Viewer as ViewerModel, OriginalText, DetailView
from schemas import ViewerFilter


def get_filtered_viewers(db: Session,
                         filters: ViewerFilter) -> List[ViewerModel]:
    query = db.query(ViewerModel)

    print(filters.region_id)
    # 1) 지역 필터 (state: ex. 전라남도)1
    if filters.region_id is not None:
        query = query.filter(ViewerModel.state == filters.region_id)

    # 2) 감사실시기관 필터
    if filters.agency_id is not None:
        query = query.filter(
            ViewerModel.inspection_agency.ilike(f"%{filters.agency_id}%"))

    # 3) 감사결과 종류 필터
    if filters.audit_type_id is not None:
        query = query.filter(
            ViewerModel.inspection_type == filters.audit_type_id)

    # 4) 날짜 필터
    if filters.start_date and filters.end_date:
        print("start_date")
        # date 컬럼이 'YYYY-MM-DD' 문자열이면 lexicographical 비교가 날짜 비교와 동일합니다
        query = query.filter(
            ViewerModel.date >= filters.start_date.isoformat(),
            ViewerModel.date <= filters.end_date.isoformat(),
        )
    # elif filters.start_date:
    #     query = query.filter(
    #         ViewerModel.date >= filters.start_date.isoformat())
    # elif filters.end_date:
    #     query = query.filter(ViewerModel.date <= filters.end_date.isoformat())

    # 5) 분야(category) 필터
    if filters.category_id is not None:
        query = query.filter(ViewerModel.category == filters.category_id)

    # 6) 업무(task) 필터
    if filters.task_id is not None:
        query = query.filter(ViewerModel.task == filters.task_id)

    # 7) 키워드 검색 (summary, audit_result)
    if filters.keyword:
        kw = f"%{filters.keyword}%"
        query = (query.join(
            DetailView, ViewerModel.detail_view_id == DetailView.id).join(
                OriginalText,
                OriginalText.detail_view_id == DetailView.id).filter(
                    OriginalText.preprocessed_text.ilike(kw)))

    # 8) 특이사례 포함 여부
    if not filters.include_special:
        query = query.filter(ViewerModel.special_case.is_(None))

    return query.all()
