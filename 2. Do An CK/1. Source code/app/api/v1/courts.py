from fastapi import APIRouter, Depends, status, HTTPException
import traceback
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.court import Court
from app.models.time_slot import TimeSlot
from app.schemas.court import CourtCreate, CourtResponse, CourtUpdate

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
# @router.post("/", response_model=CourtResponse, status_code=status.HTTP_201_CREATED)
# def create_court(court_in: CourtCreate, db: Session = Depends(get_db)):
#     try:
#         # 1. Xử lý triệt để lỗi Pydantic (Hỗ trợ cả v1 và v2)
#         if hasattr(court_in, 'model_dump'):
#             court_data = court_in.model_dump()
#         else:
#             court_data = court_in.dict()
#
#         # 2. Tạo sân mới
#         new_court = Court(**court_data)
#         db.add(new_court)
#         db.commit()
#         db.refresh(new_court)
#
#         # 3. Tự động tạo 16 slot giờ
#         slots_to_create = [
#             TimeSlot(court_id=new_court.id, start_time=start, end_time=end)
#             for start, end in DEFAULT_HOURS
#         ]
#         db.add_all(slots_to_create)
#         db.commit()
#
#         return new_court
#
#     except Exception as e:
#         db.rollback() # Hoàn tác database nếu có lỗi
#         print("====== LỖI BACKEND ======")
#         traceback.print_exc() # In chi tiết lỗi ra màn hình PyCharm
#         # Đẩy thẳng lỗi về cho Frontend để hiển thị popup
#         raise HTTPException(status_code=500, detail=f"Lỗi hệ thống: {str(e)}")

@router.patch("/{court_id}", response_model=CourtResponse)
def update_court(court_id: int, court_in: CourtUpdate, db: Session = Depends(get_db)):
        # Tìm sân theo ID
        court = db.query(Court).filter(Court.id == court_id).first()
        if not court:
            raise HTTPException(status_code=404, detail="Không tìm thấy sân này")

        # Lấy dữ liệu gửi lên (chỉ lấy những trường có thay đổi)
        if hasattr(court_in, 'model_dump'):
            update_data = court_in.model_dump(exclude_unset=True)
        else:
            update_data = court_in.dict(exclude_unset=True)

        # Cập nhật vào database
        for key, value in update_data.items():
            setattr(court, key, value)

        db.commit()
        db.refresh(court)
        return court