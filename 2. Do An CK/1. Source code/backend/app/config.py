import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(override=True)

# Vị trí file config.py hiện tại (vd: backend/app/config.py)
CURRENT_FILE = Path(__file__).resolve()

# thư mục 'backend'
BACKEND_DIR = CURRENT_FILE.parent.parent

# Tạo một thư mục riêng tên là 'data' bên trong 'backend'
DATA_DIR = BACKEND_DIR / "data"
DATA_DIR.mkdir(exist_ok=True) # Tạo folder 'data' nếu chưa tồn tại

DB_PATH = DATA_DIR / "sfms.db"

class Settings:
    PROJECT_NAME: str = "Sports Facility Management System (Elite Sport)"
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH.as_posix()}")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")

    # JWT Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "chuoi_bi_mat_sieu_bao_mat_cua_sfms")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24))  # Mặc định 24h

settings = Settings()
