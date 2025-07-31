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

# Mount static files from the frontend build
# if os.path.exists("frontend/FE/dist"):
#     app.mount("/assets",
#               StaticFiles(directory="frontend/FE/dist/assets"),
#               name="assets")
#     app.mount("/static",
#               StaticFiles(directory="frontend/FE/dist"),
#               name="static")

# ✅ 정적 PDF 등 (only if directory exists)
if os.path.exists("static"):
    app.mount("/files", StaticFiles(directory="static"), name="files")

# @app.get("/")
# def root():
#     """Health check endpoint for deployment"""
#     return {"status": "healthy", "message": "FastAPI server is running"}

# @app.get("/app")
# def serve_app():
#     """Serve the React app if files exist"""
#     index_path = os.path.join("frontend/FE/dist", "index.html")
#     if os.path.exists(index_path):
#         return FileResponse(index_path)
#     return {"error": "Frontend not built"}


# 헬스체크 전용 엔드포인트
@app.get("/health", include_in_schema=False)
def healthcheck():
    return {"status": "OK", "timestamp": datetime.utcnow().isoformat() + "Z"}


# PDF 다운로드 API
@app.get("/api/viewer/{uuid}/pdf", tags=["Viewer"])
async def get_viewer_pdf(uuid: str):
    file_path = f"static/pdfs/{uuid}.pdf"
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="PDF not found")
    return FileResponse(file_path, media_type="application/pdf")


# # Catch-all route to serve React app for client-side routing
# @app.get("/{path:path}")
# async def serve_spa(path: str):
#     """Serve React app for all routes that don't match API endpoints"""
#     # Skip API routes and static files
#     if path.startswith("api/") or path.startswith(
#             "static/") or path.startswith("files/"):
#         raise HTTPException(status_code=404, detail="Not found")

#     index_path = os.path.join("frontend/FE/dist", "index.html")
#     if os.path.exists(index_path):
#         return FileResponse(index_path)
#     return {"error": "Frontend not built"}

# 개발용 실행
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
