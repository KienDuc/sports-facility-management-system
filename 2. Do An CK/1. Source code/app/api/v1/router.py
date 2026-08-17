# app/api/v1/router.py
from fastapi import APIRouter
from app.api.v1 import courts, bookings, services, ai_assistant

api_router = APIRouter()
api_router.include_router(courts.router)
api_router.include_router(bookings.router,prefix="/bookings")
api_router.include_router(services.router)
api_router.include_router(ai_assistant.router)