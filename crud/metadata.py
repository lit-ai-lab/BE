from sqlalchemy import func, distinct
from sqlalchemy.orm import Session
from models import MetaData

def get_home_metadata(db: Session) -> dict:
    
    inspection_agency_count= (
        db.query(func.count(distinct(MetaData.inspection_agency))).scalar() or 0
    )
    related_agency_count= (
        db.query(func.count(distinct(MetaData.related_agency))).scalar() or 0
    )
    audit_note_count= (
        db.query(func.count(distinct(MetaData.audit_note))).scalar() or 0
    )
    case_uuid_count= (
        db.query(func.count(distinct(MetaData.case_uuid))).scalar() or 0
    )
    return {
        "inspection_agency_count": inspection_agency_count,
        "related_agency_count":    related_agency_count,
        "audit_note_count":        audit_note_count,
        "case_uuid_count":         case_uuid_count,
    }


