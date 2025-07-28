from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from schemas import RegionTasks

from database import get_db
from crud.map import (
    # get_top10_categories,
    # get_sunburst_categories_only,
    # get_top10_tasks_by_category,
    get_tasks_by_region,
    get_category_task_summary)

router = APIRouter(prefix="", tags=["Map"])


def simplify_region_name(region: Optional[str]) -> Optional[str]:
    if region is None:
        return None
    replacements = {
        "서울특별시": "서울",
        "부산광역시": "부산",
        "대구광역시": "대구",
        "인천광역시": "인천",
        "광주광역시": "광주",
        "대전광역시": "대전",
        "울산광역시": "울산",
        "세종특별자치시": "세종",
        "경기도": "경기",
        "강원특별자치도": "강원",
        "충청북도": "충청북도",
        "충청남도": "충청남도",
        "전북특별자치도": "전북",
        "전라남도": "전라남도",
        "경상북도": "경상북도",
        "경상남도": "경상남도",
        "제주특별자치도": "제주"
    }
    return replacements.get(region, region)


@router.get("/overview/")
def get_summary(region: str = None, db: Session = Depends(get_db)):
    region = simplify_region_name(region)
    return get_category_task_summary(db, region)


@router.get("/TOP", response_model=List[RegionTasks])
def tasks_by_region(db: Session = Depends(get_db)):
    """
    각 권역별 상위 10개 업무를
    [{ region: "...", tasks: [ {rank:1,name:"..."}, ... ] }, ...]
    형태로 반환
    """
    return get_tasks_by_region(db)