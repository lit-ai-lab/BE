from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Viewer
from collections import defaultdict, Counter
import re



def split_tasks(task_str: str) -> list[str]:
    """
    task 문자열을 ',' 로 분리하여 리스트 반환.
    단, '출납, 보관' 은 하나의 업무로 취급.
    """
    if task_str.strip() == "출납, 보관":
        return ["출납, 보관"]

    # 기본 로직: ',' 기준 분리 + strip
    return [t.strip() for t in task_str.split(",") if t.strip()]



# def get_category_task_summary(db: Session, region: str = None):
#     # [1] Top10 분야 조회
#     category_query = db.query(Viewer.category, func.count().label("count"))
#     if region:
#         category_query = category_query.filter(Viewer.state.contains(region))
#     category_query = (  
#         category_query.filter(Viewer.category.isnot(None))
#         .group_by(Viewer.category)
#         .order_by(func.count().desc())
#         .limit(10)
#     )
#     top10_categories_result = category_query.all()

#     categories_output = []

#     task_global_id = 1  # 전체 task에 대해 id 연속 증가

#     # [2] 각 분야별 task 포함
#     for cat_idx, (category_full, category_count) in enumerate(top10_categories_result):
#         # ✅ 앞 숫자 제거 (예: "04 계약" → "계약")
#         if " " in category_full:
#             _, category_name = category_full.split(" ", 1)
#         else:
#             category_name = category_full
            
#         # 분야별 업무 top10 조회
#         task_query = db.query(Viewer.task, func.count().label("count")).filter(
#             Viewer.category == category_full,
#             Viewer.task.isnot(None)
#         )
#         if region:
#             task_query = task_query.filter(Viewer.state.contains(region))
#         task_query = (
#             task_query.group_by(Viewer.task)
#             .order_by(func.count().desc())
#             .limit(10)
#         )
#         tasks_result = task_query.all()

#         # 업무 리스트에 ID 포함
#         tasks_output = []
#         for task, count in tasks_result:
#             tasks_output.append({
#                 "id": task_global_id,
#                 "task": task,
#                 "count": count
#             })
#             task_global_id += 1

#         # 하나의 카테고리 블록
#         categories_output.append({
#             "id": cat_idx + 1,
#             "category": category_name,
#             "count": category_count,
#             "tasks": tasks_output
#         })

#     return {
#         "region": region if region else "전국",
#         "categories": categories_output
#     }


from collections import Counter

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
    task_global_id = 1

    for cat_idx, (category_full, category_count) in enumerate(top10_categories_result):
        # 앞 숫자 제거
        if " " in category_full:
            _, category_name = category_full.split(" ", 1)
        else:
            category_name = category_full

        # 해당 카테고리의 raw tasks 불러오기
        task_query = db.query(Viewer.task).filter(
            Viewer.category == category_full,
            Viewer.task.isnot(None)
        )
        if region:
            task_query = task_query.filter(Viewer.state.contains(region))
        raw_tasks = task_query.all()

        # 콤마 분리 + 카운팅
        counter = Counter()
        for (task_str,) in raw_tasks:
            counter.update(split_tasks(task_str))

        # top10
        tasks_output = []
        for task_name, count in counter.most_common(10):
            tasks_output.append({
                "id": task_global_id,
                "task": task_name,
                "count": count
            })
            task_global_id += 1

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
# def get_tasks_by_region(db: Session):
#     """
#     각 region(state) 별로 Viewer.task 의 상위 10개를 rank, name 형태로 반환
#     """
#     # 1) 저장된 state 값 → 표시할 전체 이름 매핑
#     display_name = {
#         "서울": "서울특별시",
#         "부산": "부산광역시",
#         "대구": "대구광역시",
#         "인천": "인천광역시",
#         "광주": "광주광역시",
#         "대전": "대전광역시",
#         "울산": "울산광역시",
#         "세종": "세종특별자치시",
#         "경기": "경기도",
#         "강원": "강원특별자치도",
#         "충북": "충청북도",
#         "충남": "충청남도",
#         "전북": "전라북도",
#         "전남": "전라남도",
#         "경북": "경상북도",
#         "경남": "경상남도",
#         "제주": "제주특별자치도",
#     }

#     # 2) 최종 정렬 순서
#     ORDER = [
#         "서울특별시","부산광역시","대구광역시","인천광역시","광주광역시",
#         "대전광역시","울산광역시","세종특별자치시","경기도","강원특별자치도",
#         "충청북도","충청남도","전라북도","전라남도","경상북도","경상남도",
#         "제주특별자치도",
#     ]

#     # 3) DB에서 고유 region 목록 조회
#     regions = (
#         db.query(Viewer.state)
#           .filter(Viewer.state.isnot(None))
#           .group_by(Viewer.state)
#           .order_by(Viewer.state)  # 이건 임시; 나중에 ORDER로 재정렬
#           .all()
#     )

#     output = []
#     for (state,) in regions:
#         # 표시 이름으로 변환 (매핑이 없으면 기존 state)
#         region_name = display_name.get(state, state)

#         # task+category 집계
#         tasks_q = (
#             db.query(
#                 Viewer.task,
#                 Viewer.category,
#                 func.count().label("cnt")
#             )
#             .filter(Viewer.state == state, Viewer.task.isnot(None))
#             .group_by(Viewer.task, Viewer.category)
#             .order_by(func.count().desc())
#             .limit(10)
#             .all()
#         )

#         tasks_list = [
#             {
#                 "rank": idx + 1,
#                 "name": task,
#                 "category": category
#             }
#             for idx, (task, category, cnt) in enumerate(tasks_q)
#         ]

#         output.append({
#             "region": region_name,
#             "tasks": tasks_list
#         })

#     # 4) 원하는 순서대로 정렬
#     output.sort(
#         key=lambda x: ORDER.index(x["region"]) 
#                       if x["region"] in ORDER 
#                       else len(ORDER)
#     )

#     return output


def get_tasks_by_region(db: Session):
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

    ORDER = [
        "서울특별시","부산광역시","대구광역시","인천광역시","광주광역시",
        "대전광역시","울산광역시","세종특별자치시","경기도","강원특별자치도",
        "충청북도","충청남도","전라북도","전라남도","경상북도","경상남도",
        "제주특별자치도",
    ]

    regions = (
        db.query(Viewer.state)
          .filter(Viewer.state.isnot(None))
          .group_by(Viewer.state)
          .order_by(Viewer.state)
          .all()
    )

    output = []
    for (state,) in regions:
        region_name = display_name.get(state, state)

        # raw task, category 불러오기
        raw_tasks = (
            db.query(Viewer.task, Viewer.category)
              .filter(Viewer.state == state, Viewer.task.isnot(None))
              .all()
        )

        # 카운팅 (task별)
        counter = Counter()
        task_to_category = {}

        for task_str, category in raw_tasks:
            for task in split_tasks(task_str):
                counter[task] += 1
                # 카테고리 마지막 값만 저장 (대표용)
                task_to_category[task] = category

        # top10
        tasks_list = []
        for idx, (task_name, count) in enumerate(counter.most_common(10)):
            tasks_list.append({
                "rank": idx + 1,
                "name": task_name,
                "category": task_to_category.get(task_name)
            })

        output.append({
            "region": region_name,
            "tasks": tasks_list
        })

    output.sort(
        key=lambda x: ORDER.index(x["region"]) 
                      if x["region"] in ORDER 
                      else len(ORDER)
    )

    return output
