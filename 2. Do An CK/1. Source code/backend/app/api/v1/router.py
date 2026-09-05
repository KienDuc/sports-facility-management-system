# app/api/v1/router.py
from fastapi import APIRouter
from backend.app.api.v1 import auth, users, bookings, services, ai_assistant, statistics
from backend.app.api.v1 import courts

api_router = APIRouter()

# Khai báo các router để nó hiện lên Swagger UI
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(courts.router, prefix="/courts", tags=["Courts"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
api_router.include_router(services.router, prefix="/services", tags=["Services"])
api_router.include_router(ai_assistant.router, prefix="/ai-assistant", tags=["AIAssistant"])
api_router.include_router(statistics.router, prefix="/statistics", tags=["Statistics"])
