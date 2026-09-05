import os
from dotenv import load_dotenv

load_dotenv(override=True)

class Settings:
    PROJECT_NAME: str = "Sports Facility Management System (Elite Sport)"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sfms.db")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")

    # JWT Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "chuoi_bi_mat_sieu_bao_mat_cua_sfms")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24))  # Mặc định 24h

settings = Settings()
