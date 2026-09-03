from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from starlette.responses import RedirectResponse

from backend.app.api.v1.router import api_router
from backend.app.db.session import engine, Base
from backend.app.config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="SFMS Backend API Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

# Khi vào trang chủ port 8000, tự động chuyển hướng sang tài liệu Swagger UI
@app.get("/", include_in_schema=False)
def root_redirect():
    return RedirectResponse(url="/docs")

# Endpoint kiểm tra trạng thái hoạt động của server (Health check)
@app.get("/health", tags=["System"])
def health_check():
    return {"status": "ok", "message": f"{settings.PROJECT_NAME} API is running"}

# if os.path.exists("static"):
#     app.mount("/static", StaticFiles(directory="static"), name="static")
#
# @app.get("/")
# def read_index():
#     if os.path.exists("static/index.html"):
#         return FileResponse("static/index.html")
#     return {"message": "Server FastAPI đang chạy thành công! Mời truy cập /docs để xem Swagger UI."}
