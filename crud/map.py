from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Viewer
from collections import defaultdict
import re



def get_category_task_summary(db: Session, region: str = None):
    # [1] Top10 분야 조회
    category_query = db.query(Viewer.category, func.count().label("count"))
    if region:
        category_query = category_query.filter(Viewer.state.contains(region))
    category_query = (  
        category_query.filter(Viewer.category.isnot(None))
        .group_by(Viewer.category)
        .order_by(func.count().desc())
        .limit(10)
    )
    top10_categories_result = category_query.all()

    categories_output = []

    task_global_id = 1  # 전체 task에 대해 id 연속 증가

    # [2] 각 분야별 task 포함
    for cat_idx, (category_full, category_count) in enumerate(top10_categories_result):
        # ✅ 앞 숫자 제거 (예: "04 계약" → "계약")
        if " " in category_full:
            _, category_name = category_full.split(" ", 1)
        else:
            category_name = category_full
            
        # 분야별 업무 top10 조회
        task_query = db.query(Viewer.task, func.count().label("count")).filter(
            Viewer.category == category_full,
            Viewer.task.isnot(None)
        )
        if region:
            task_query = task_query.filter(Viewer.state.contains(region))
        task_query = (
            task_query.group_by(Viewer.task)
            .order_by(func.count().desc())
            .limit(10)
        )
        tasks_result = task_query.all()

        # 업무 리스트에 ID 포함
        tasks_output = []
        for task, count in tasks_result:
            tasks_output.append({
                "id": task_global_id,
                "task": task,
                "count": count
            })
            task_global_id += 1

        # 하나의 카테고리 블록
        categories_output.append({
            "id": cat_idx + 1,
            "category": category_name,
            "count": category_count,
            "tasks": tasks_output
        })

    return {
        "region": region if region else "전국",
        "categories": categories_output
    }

# ─── 새로 추가 ────────────────────────────────────────────────────────────────
def get_tasks_by_region(db: Session):
    """
    각 region(state) 별로 Viewer.task 의 상위 10개를 rank, name 형태로 반환
    """
    # 1) 저장된 state 값 → 표시할 전체 이름 매핑
    display_name = {
        "서울": "서울특별시",
        "부산": "부산광역시",
        "대구": "대구광역시",
        "인천": "인천광역시",
        "광주": "광주광역시",
        "대전": "대전광역시",
        "울산": "울산광역시",
        "세종": "세종특별자치시",
        "경기": "경기도",
        "강원": "강원특별자치도",
        "충북": "충청북도",
        "충남": "충청남도",
        "전북": "전라북도",
        "전남": "전라남도",
        "경북": "경상북도",
        "경남": "경상남도",
        "제주": "제주특별자치도",
    }

    # 2) 최종 정렬 순서
    ORDER = [
        "서울특별시","부산광역시","대구광역시","인천광역시","광주광역시",
        "대전광역시","울산광역시","세종특별자치시","경기도","강원특별자치도",
        "충청북도","충청남도","전라북도","전라남도","경상북도","경상남도",
        "제주특별자치도",
    ]

    # 3) DB에서 고유 region 목록 조회
    regions = (
        db.query(Viewer.state)
          .filter(Viewer.state.isnot(None))
          .group_by(Viewer.state)
          .order_by(Viewer.state)  # 이건 임시; 나중에 ORDER로 재정렬
          .all()
    )

    output = []
    for (state,) in regions:
        # 표시 이름으로 변환 (매핑이 없으면 기존 state)
        region_name = display_name.get(state, state)

        # task+category 집계
        tasks_q = (
            db.query(
                Viewer.task,
                Viewer.category,
                func.count().label("cnt")
            )
            .filter(Viewer.state == state, Viewer.task.isnot(None))
            .group_by(Viewer.task, Viewer.category)
            .order_by(func.count().desc())
            .limit(10)
            .all()
        )

        tasks_list = [
            {
                "rank": idx + 1,
                "name": task,
                "category": category
            }
            for idx, (task, category, cnt) in enumerate(tasks_q)
        ]

        output.append({
            "region": region_name,
            "tasks": tasks_list
        })

    # 4) 원하는 순서대로 정렬
    output.sort(
        key=lambda x: ORDER.index(x["region"]) 
                      if x["region"] in ORDER 
                      else len(ORDER)
    )

    return output