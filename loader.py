import json
from pathlib import Path
from sqlalchemy.orm import Session
from sqlalchemy import inspect
from database import SessionLocal, engine
from models import Base, Viewer, MapStatistic, DetailView, OriginalText, MetaData
# -----------------------
# 지역 시군 매핑q
# -----------------------
REGION_CITY_MAP = {
    "경기": {
        "수원시", "고양시", "용인시", "화성시", "성남시", "의정부시", "안양시",
        "부천시", "광명시", "평택시", "동두천시", "안산시", "과천시", "구리시",
        "남양주시", "오산시", "시흥시", "군포시", "의왕시", "하남시", "파주시",
        "이천시", "안성시", "김포시", "광주시", "양주시", "포천시", "여주시"
    },
    "강원": {
        "강릉시", "동해시", "삼척시", "속초시", "원주시", "춘천시", "태백시",
        "고성군", "양구군", "양양군", "영월군", "인제군", "정선군", "철원군",
        "평창군", "홍천군", "화천군", "횡성군"
    },
    "충청북도": {
        "제천시", "청주시", "충주시", "괴산군", "단양군", "보은군", "영동군",
        "옥천군", "음성군", "증평군", "진천군"
    },
    "충청남도": {
        "계룡시", "공주시", "논산시", "당진시", "보령시", "서산시", "아산시",
        "천안시", "금산군", "부여군", "서천군", "예산군", "청양군", "태안군",
        "홍성군"
    },
    "전북": {
        "군산시", "김제시", "남원시", "익산시", "전주시", "정읍시", "고창군",
        "무주군", "부안군", "수창군", "완주군", "임실군", "장수군", "진안군"
    },
    "전라남도": {
        "목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군",
        "구례군", "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군",
        "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군",
        "신안군"
    },
    "경상북도": {
        "경산시", "경주시", "구미시", "김천시", "문경시", "상주시", "안동시",
        "영주시", "영천시", "포항시", "고령군", "봉화군", "성주군", "영덕군",
        "영양군", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군",
        "칠곡군"
    },
    "경상남도": {
        "창원시", "거제시", "김해시", "밀양시", "사천시", "양산시", "진주시",
        "통영시", "거창군", "고성군", "남해군", "산청군", "의령군", "창녕군",
        "하동군", "함안군", "함양군", "합천군"
    }
}

KEYWORD_REGIONS = [
    "서울", "부산", "대구", "인천", "광주", "경기", "대전", "울산",
    "세종", "강원", "충청북도", "충청남도", "전북", "전라남도",
    "경상북도", "경상남도", "제주"
]


# -----------------------
# 유틸 함수들
# -----------------------

def safe_get(item: dict, key: str, default=None):
    """
    JSON 에서 키를 추출한 뒤,
    - 빈 문자열/None은 default 로
    - 문자열에 NUL(0x00)이 있으면 모두 제거
    """
    val = item.get(key, default)
    if not val or not str(val).strip():
        return default
    if isinstance(val, str):
        # NUL 문자 제거
        val = val.replace("\x00", "")
    return val

def resolve_state_name(entry: dict) -> str | None:
    agency_val = entry.get("감사실시기관", "")
    for state, cities in REGION_CITY_MAP.items():
        for city in cities:
            if city in agency_val:
                return state

    key_val = entry.get("key", "")
    if "-" in key_val:
        prefix = key_val.split("-", 1)[0]
        for region in KEYWORD_REGIONS:
            if prefix.startswith(region):
                return region
    return None

def extract_start_date(date_range: str) -> str | None:
    try:
        return date_range.split("~")[0].strip()
    except Exception:
        return None

# -----------------------
# DB 초기화
# -----------------------
print("▶ Using SQLite URL:", engine.url)
print("→ Actual tables before drop:", inspect(engine).get_table_names())

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

print("→ Actual tables after create:", inspect(engine).get_table_names())
# -----------------------
# JSON → DB 적재
# -----------------------
def load_json_to_db(json_path: Path):
    session = SessionLocal()
    inserted = 0
    detail_inserted = 0
    BATCH_SIZE = 1000

    with json_path.open(encoding="utf-8") as f:
        raw_data = json.load(f)

    if isinstance(raw_data, dict):
        raw_data = [raw_data]

    try:
        for item in raw_data:
            # ---------- 공통 필드 추출 ----------
            state = resolve_state_name(item)
            inspection_agency = safe_get(item, "감사실시기관")
            inspection_type = safe_get(item, "감사종류")
            raw_date = safe_get(item, "감사기간")
            date = extract_start_date(raw_date) if raw_date else None
            audit_result = safe_get(item, "처분요구 및 조치사항")  
            # 변경: audit_result가 '모범사례'인 경우 해당 항목을 건너뜁니다.
            if audit_result == "모범사례":
                continue          
            related_agency = safe_get(item, "관련기관")
            disposition_request = safe_get(item, "감사결과종류")
            category = safe_get(item, "auto_분야")
            task = safe_get(item, "auto_업무")
            summary = safe_get(item, "auto_v2_summary")
            if summary and summary.strip().lower() == "na":
                summary = "내용없음"
            special_case = safe_get(item, "auto_특이사례", default=None)
            preprocessed_text = safe_get(item, "preprocessed_text", default=None)
            file_hash = safe_get(item, "file_hash")
            case_uuid = safe_get(item, "case_uuid")  

            # ---------- detail_view 먼저 insert ----------
            audit_note = safe_get(item, "감사사항")
            raw_keyword = safe_get(item, "auto_특성")
            keyword = ", ".join(map(str, raw_keyword)) if isinstance(raw_keyword, list) else raw_keyword
            file_size = safe_get(item, "file_size")
            registration_date = safe_get(item, "registration_date")

            detail_entry = DetailView(
                inspection_agency=inspection_agency,
                date=date,
                audit_note=audit_note,
                related_agency=related_agency,
                audit_result=audit_result,
                category=category,
                task=task,
                summary=summary,
                keyword=keyword,
                file_size=file_size,
                registration_date=registration_date,
                file_hash=file_hash,
            )
            session.add(detail_entry)
            session.flush()

            # ---------- viewer에 detail_view_id 연결 ----------
            viewer_entry = Viewer(
                state=state,
                inspection_agency=inspection_agency,
                disposition_request=disposition_request,
                related_agency=related_agency,
                audit_result=audit_result,
                category=category,
                task=task,
                summary=summary,
                special_case=special_case,
                inspection_type=inspection_type,
                date=date,
                detail_view_id=detail_entry.id,  # 연결
                file_hash=file_hash,
            )
            
            
            original_text_entry = OriginalText(
                preprocessed_text=preprocessed_text,
                detail_view_id=detail_entry.id
            )
            # metadata 삽입 feat.daon
            metadata_entry = MetaData(
                inspection_agency=inspection_agency,
                related_agency=related_agency,
                audit_note=audit_note,
                case_uuid=case_uuid
            )
            session.add_all([detail_entry, viewer_entry, original_text_entry, metadata_entry])
            inserted += 1
            detail_inserted += 1
            
            if inserted % BATCH_SIZE == 0:
                session.commit()
                print(f"  → {inserted}건 커밋 완료")

        session.commit()
        print(f"✅ viewer 테이블에 {inserted}건 삽입 완료")
        print(f"✅ detail_view 테이블에 {detail_inserted}건 삽입 완료")

        # ----------------------------
        # map_statistics 테이블 삽입
        # ----------------------------
        unique_stats = set()
        for item in raw_data:
            state = resolve_state_name(item)
            category = safe_get(item, "auto_분야")
            task = safe_get(item, "auto_업무")

            if state and category and task:
                unique_stats.add((state, category, task))

        for state, category, task in unique_stats:
            map_entry = MapStatistic(
                state=state,
                category=category,
                task=task
            )
            session.add(map_entry)

        print(f"✅ map_statistics 테이블에 {len(unique_stats)}건 삽입 완료")

        session.commit()
        print(f"✅ 전체 {inserted}건 삽입 완료")
    except Exception as e:
        session.rollback()
        print("❌ 삽입 오류 발생:", e)
    finally:
        session.close()
# -----------------------
# 실행
# -----------------------
if __name__ == "__main__":
    load_json_to_db(Path(__file__).parent / "pap2025_41989_false_auto_v2.json")