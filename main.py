from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from datetime import datetime

from domain.viewer.router import router as viewer_router
from domain.map.router import router as map_router
from domain.metadata.router import router as metadata_router
from domain.pdf.router import router as pdf_router


#2025-07-24  s
app = FastAPI(title="자체감사 시스템", version="1.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Accept-Ranges"],
)

# API 라우터 등록
app.include_router(viewer_router, prefix="/api/viewer", tags=["Viewer"])
app.include_router(map_router, prefix="/api/maps", tags=["Map"])
app.include_router(metadata_router, prefix="/api", tags=["Metadata"])
app.include_router(pdf_router, prefix="/api",tags=["PDF"])
#app.mount("/",StaticFiles(directory="frontend/FE/dist", html=True),name="frontend")



# ✅ 정적 PDF 등 (only if directory exists)
if os.path.exists("static"):
    app.mount("/files", StaticFiles(directory="static"), name="files")


# 헬스체크 전용 엔드포인트
@app.get("/health", include_in_schema=False)
def healthcheck():
    return {"status": "OK", "timestamp": datetime.utcnow().isoformat() + "Z"}

@app.get("/app")
def serve_app():
    """Serve the React app if files exist"""
    index_path = os.path.join("frontend/FE/dist", "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"error": "Frontend not built"}

# 개발용 실행
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
