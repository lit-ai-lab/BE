from sqlalchemy import Column, Integer, String, Date, Boolean, Text
from database import Base

from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# base=deteractive_base
#dd

class Viewer(Base):
    __tablename__ = 'viewer'

    id = Column(Integer, primary_key=True, index=True)

    # 직접 저장하는 단순 텍스트 필드들
    state = Column(String, nullable=True)                # 지역명 (ex. 전라남도)
    inspection_agency = Column(String, nullable=True)     # 감사실시기관
    disposition_request = Column(Text, nullable=True)     # 처분요구 및 조치사항
    related_agency = Column(String, nullable=True)        # 관련기관
    audit_result = Column(Text, nullable=True)            # 감사결과 종류
    category = Column(String, nullable=True)             # 분야 (auto_분야)
    task = Column(String, nullable=True)                 # 업무 (auto_업무)
    summary = Column(Text, nullable=True)                # auto_요약
    special_case = Column(Text, nullable=True)         # 특이사례 여부
    date = Column(String, nullable=True)                ##시작 날짜
    inspection_type = Column(String, nullable=True)     # 감사종류
    detail_view_id = Column(Integer, ForeignKey("detail_view.id"), nullable=True)
    detail_view = relationship("DetailView", back_populates="viewers")
    file_hash = Column(Text, nullable=True)



class MapStatistic(Base):
    __tablename__ = "map_statistics"

    id = Column(Integer, primary_key=True, index=True)
    state = Column(String, index=True)
    category = Column(String, index=True)
    task = Column(String, index=True)
    


class DetailView(Base):
    __tablename__ = "detail_view"

    id = Column(Integer, primary_key=True, index=True)
    inspection_agency = Column(String, nullable=True)     # 기관명
    date = Column(String, nullable=True)                   # 감사날짜
    audit_note = Column(Text, nullable=True)               # 감사사항
    related_agency = Column(String, nullable=True)         # 감사대상
    audit_result = Column(Text, nullable=True)             # 감사결과
    category = Column(String, nullable=True)               # 분야
    task = Column(String, nullable=True)                   # 업무
    summary = Column(Text, nullable=True)                  # 요약
    keyword = Column(String, nullable=True)                # 핵심키워드
    file_size = Column(String, nullable=True)              # 파일크기
    registration_date = Column(String, nullable=True)      # 작성일
    file_hash = Column(Text, nullable=True)
    
    viewers   = relationship("Viewer",       back_populates="detail_view")
    originals = relationship("OriginalText", back_populates="detail_view")

class OriginalText(Base):
    __tablename__ = "original_text"
    
    id = Column(Integer, primary_key=True, index=True)
    preprocessed_text = Column(Text, nullable=True)     #원본텍스트
    detail_view_id = Column(Integer, ForeignKey("detail_view.id"), nullable=True)   #detail.view아이디
    detail_view       = relationship("DetailView", back_populates="originals")

class MetaData(Base):
    __tablename__ = "metadata"

    id = Column(Integer, primary_key=True)
    inspection_agency = Column(String, nullable=True)
    related_agency = Column(String, nullable=True)
    audit_note = Column(Text, nullable=True)
    case_uuid = Column(Text, nullable=True)
    