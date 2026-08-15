from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.booking import Booking

router = APIRouter(prefix="/bookings", tags=["Bookings"])