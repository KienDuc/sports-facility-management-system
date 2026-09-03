# app/api/v1/router.py
from fastapi import APIRouter
from backend.app.api.v1 import bookings, services, ai_assistant, statistics
from backend.app.api.v1 import courts

api_router = APIRouter()
api_router.include_router(courts.router)
api_router.include_router(bookings.router, prefix="/bookings")
api_router.include_router(services.router)
api_router.include_router(ai_assistant.router)
api_router.include_router(statistics.router)
