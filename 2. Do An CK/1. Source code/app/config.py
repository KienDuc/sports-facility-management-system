import os

class Settings:
    PROJECT_NAME: str = "Sports Facility Management System"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sfms.db")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

settings = Settings()