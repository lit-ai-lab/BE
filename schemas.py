from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import date


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

    model_config = ConfigDict(from_attributes=True)
