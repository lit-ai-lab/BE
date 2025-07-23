
from sqlalchemy.orm import Session
from models import Viewer
from schemas import ViewerFilter
from typing import List, Dict, Any

class ViewerService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_filtered_data(self, filters: ViewerFilter) -> List[Dict[str, Any]]:
        """Get filtered viewer data based on provided filters"""
        query = self.db.query(Viewer)
        
        # Apply filters
        if filters.region_id:
            query = query.filter(Viewer.state.ilike(f"%{filters.region_id}%"))
        
        if filters.agency_id:
            query = query.filter(Viewer.inspection_agency.ilike(f"%{filters.agency_id}%"))
            
        if filters.audit_type_id:
            query = query.filter(Viewer.audit_type.ilike(f"%{filters.audit_type_id}%"))
            
        if filters.start_date :
            query = query.filter(Viewer.date >= filters.start_date)
            
        if filters.end_date:
            query = query.filter(Viewer.date <= filters.end_date)
            
        if filters.category_id:
            query = query.filter(Viewer.category.ilike(f"%{filters.category_id}%"))
            
        if filters.task_id:
            query = query.filter(Viewer.task.ilike(f"%{filters.task_id}%"))
            
        if filters.keyword:
            query = query.filter(Viewer.summary.ilike(f"%{filters.keyword}%"))
            
        if not filters.include_special:
            query = query.filter(Viewer.special_case.is_(None))
        
        results = query.all()
        
        # Convert to dict format
        return [
            {
                "id": item.id,
                "state": item.state,
                "inspection_agency": item.inspection_agency,
                "disposition_request": item.disposition_request,
                "related_agency": item.related_agency,
                "audit_result": item.audit_result,
                "category": item.category,
                "task": item.task,
                "summary": item.summary,
                "special_case": item.special_case
            }
            for item in results
        ]
