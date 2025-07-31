from fastapi import HTTPException
from sqlalchemy.orm import Session
from crud import map as map_crud
from schemas import MapResponse, RegionLevel
from typing import List

def get_national_statistics(db: Session) -> MapResponse:
    return map_crud.get_statistics_by_level(db, RegionLevel.nation)

def get_province_statistics(db: Session, province: str) -> MapResponse:
    stats = map_crud.get_statistics_by_region(db, RegionLevel.province, province)
    if not stats:
        raise HTTPException(status_code=404, detail="Province data not found")
    return stats

def get_city_statistics(db: Session, province: str, city: str) -> MapResponse:
    stats = map_crud.get_statistics_by_region(db, RegionLevel.city, city, parent=province)
    if not stats:
        raise HTTPException(status_code=404, detail="City data not found")
    return stats
