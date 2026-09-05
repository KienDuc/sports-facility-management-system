from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse
from sqlalchemy.orm import Session

from backend.app.api.v1.router import api_router
from backend.app.db.session import engine, Base, SessionLocal
from backend.app.config import settings
from backend.app.models.user import User
from backend.app.core.security import get_password_hash

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Elite Sport (SFMS) Backend API Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Hàm tạo tài khoản Admin mặc định khi khởi chạy server ---
def init_db():
    db: Session = SessionLocal()
    try:
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            default_admin = User(
                username="admin",
                hashed_password=get_password_hash("123456"), # Mật khẩu mặc định: 123456
                full_name="Quản Trị Viên",
                is_active=True,
                is_admin=True,
                created_by="system"
            )
            db.add(default_admin)
            db.commit()
            print("Đã tạo tài khoản admin mặc định!")
    finally:
        db.close()

# Khởi chạy hàm nạp dữ liệu
@app.on_event("startup")
def startup_event():
    init_db()

app.include_router(api_router, prefix="/api/v1")

# Khi vào trang chủ port 8000, tự động chuyển hướng sang tài liệu Swagger UI
@app.get("/", include_in_schema=False)
def root_redirect():
    return RedirectResponse(url="/docs")

# Endpoint kiểm tra trạng thái hoạt động của server (Health check)
@app.get("/health", tags=["System"])
def health_check():
    return {"status": "ok", "message": f"{settings.PROJECT_NAME} API is running"}
