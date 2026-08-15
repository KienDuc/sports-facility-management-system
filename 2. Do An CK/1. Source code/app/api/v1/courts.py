from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.court import Court
from app.models.time_slot import TimeSlot
from app.schemas.court import CourtCreate, CourtResponse

router = APIRouter(prefix="/courts", tags=["Courts"])

# Danh sách 16 khung giờ chuẩn cố định sẵn
DEFAULT_HOURS = [
    ("06:00", "07:00"),
    ("07:00", "08:00"),
    ("08:00", "09:00"),
    ("09:00", "10:00"),
    ("10:00", "11:00"),
    ("11:00", "12:00"),
    ("12:00", "13:00"),
    ("13:00", "14:00"),
    ("14:00", "15:00"),
    ("15:00", "16:00"),
    ("16:00", "17:00"),
    ("17:00", "18:00"),
    ("18:00", "19:00"),
    ("19:00", "20:00"),
    ("20:00", "21:00"),
    ("21:00", "22:00"),
]

@router.get("/", response_model=List[CourtResponse])
def get_courts(db: Session = Depends(get_db)):
    return db.query(Court).all()

@router.post("/", response_model=CourtResponse, status_code=status.HTTP_201_CREATED)
def create_court(court_in: CourtCreate, db: Session = Depends(get_db)):
    # 1. Tạo sân mới
    new_court = Court(**court_in.model_dump())
    db.add(new_court)
    db.commit()
    db.refresh(new_court)

    # 2. Tự động tạo 16 slot giờ cố định cho sân vừa tạo
    slots_to_create = [
        TimeSlot(court_id=new_court.id, start_time=start, end_time=end)
        for start, end in DEFAULT_HOURS
    ]
    db.add_all(slots_to_create)
    db.commit()

    return new_court