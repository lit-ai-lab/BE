from pydantic import BaseModel, Field, ConfigDict, validator
from typing import Optional, List
from datetime import date
import re

CATEGORY_NAME_TO_FULL = {
    "세입(지방세)": "01 세입(지방세)",
    "세입(지방세외수입)": "02 세입(지방세외수입)",
    "예산 편성 및 지출": "03 예산 편성 및 지출",
    "계약": "04 계약",
    "보조금": "05 보조금",
    "기금": "06 기금",
    "국고금, 시·도·군 금고금(보관금)": "07 국고금/시도군 금고금",
    "국·공유재산": "08 국공유재산",
    "유가증권": "09 유가증권",
    "기획관리": "10 기획관리",
    "인사조직": "11 인사조직",
    "문서관리": "12 문서관리",
    "협조보고": "13 협조보고",
    "규제·감독": "14 규제감독",
    "민원 및 인허가": "15 민원 및 인허가",
    "기타": "기타"
    
}

# 단일 조회 시 응답
class Viewer(BaseModel):
    id: int
    state: Optional[str]
    inspection_agency: Optional[str]
    disposition_request: Optional[str]
    related_agency: Optional[str]
    audit_result: Optional[str]
    category: Optional[str]
    task: Optional[str]
    summary: Optional[str]
    special_case: Optional[str]

    model_config = ConfigDict(from_attributes=True)
    
    @validator("category", pre=True)
    def strip_category_number(cls, v: str) -> str:
        return re.sub(r"^\d+\s*", "", v) if isinstance(v, str) else v



class MapStat(BaseModel):
    region: str
    caseCount: int

    model_config = ConfigDict(from_attributes=True)


# 분야별 통계 (Top10)
class CategoryStats(BaseModel):
    category: str
    count: int
    task_count: int


class Sunburst(BaseModel):
    labels: List[str]
    parents: List[str]
    values: List[int]


# /maps/overview 응답용 스키마
class StatisticsOverview(BaseModel):
    top10_categories: List[CategoryStats]
    sunburst: Sunburst


class TaskStats(BaseModel):
    task: str
    count: int

class Task(BaseModel):
    rank: int   
    name: str
    category: str
    
    @validator("category", pre=True)
    def strip_category_number(cls, v: str) -> str:
        return re.sub(r"^\d+\s*", "", v) if isinstance(v, str) else v

# # 권역별 분야(정태적)
class RegionTasks(BaseModel):
    region: str
    tasks: List[Task]

    


SHORT_TO_FULL = {
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
    "충청북도": "충청북도",
    "충청남도": "충청남도",
    "전북": "전북특별자치도",
    "전라남도": "전라남도",
    "경상북도": "경상북도",
    "경상남도": "경상남도",
    "제주": "제주특별자치도",
}
FULL_TO_SHORT = {full: short for short, full in SHORT_TO_FULL.items()}


class ViewerFilter(BaseModel):
    model_config = ConfigDict(from_attributes=True, validate_by_name=True)

    region_id: Optional[str] = Field(None, alias="regionId")
    agency_id: Optional[str] = Field(None, alias="agencyId")
    audit_type_id: Optional[str] = Field(None, alias="auditTypeId")  # ✅ 오타 수정
    start_date: Optional[date] = Field(None, alias="startDate")
    end_date: Optional[date] = Field(None, alias="endDate")
    category_id: Optional[str] = Field(None, alias="categoryId")
    task_id: Optional[str] = Field(None, alias="taskId")
    keyword: Optional[str] = Field(None, alias="keyword")
    include_special: bool = Field(False, alias="includeSpecial")

    @validator("region_id", pre=True)
    def normalize_region_id(cls, v):
        if not v:
            return v
        # 요청에 "광주광역시" 가 들어오면 "광주" 로 바꿔서 필터링
        return FULL_TO_SHORT.get(v, v)

    @validator("category_id", pre=True)
    def normalize_category(cls, v):
        if not v:
            return v
        # “인사조직” → “11 인사조직”
        return CATEGORY_NAME_TO_FULL.get(v, v)


class DetailViewOut(BaseModel):
    id: int
    inspection_agency: Optional[str]
    date: Optional[str]
    audit_note: Optional[str]
    related_agency: Optional[str]
    audit_result: Optional[str]
    category: Optional[str]
    task: Optional[str]
    summary: Optional[str]
    keyword: Optional[str]
    file_size: Optional[str]
    registration_date: Optional[str]
    file_hash: Optional[str]

    model_config = ConfigDict(from_attributes=True)

    @validator("category", pre=True)
    def strip_category_number(cls, v: str) -> str:
        if isinstance(v, str) and " " in v:
            return v.split(" ", 1)[1]  # 번호 제거 후 이름만 반환
        return v

#홈 메타데이터 feat.daon
class MetaData(BaseModel):
    inspection_agency_count: int
    related_agency_count: int
    audit_note_count: int
    case_uuid_count: int
