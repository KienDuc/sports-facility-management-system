from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceResponse, ServiceUpdate

router = APIRouter(prefix="/services", tags=["Services"])


# --- 1. API: LẤY DANH SÁCH DỊCH VỤ ---
@router.get("/", response_model=List[ServiceResponse])
def get_services(db: Session = Depends(get_db)):
    return db.query(Service).all()


# --- 2. API: THÊM DỊCH VỤ MỚI ---
@router.post("/", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
def create_service(service_in: ServiceCreate, db: Session = Depends(get_db)):
    new_service = Service(**service_in.model_dump())
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service


# --- 3. API: CẬP NHẬT DỊCH VỤ (Sửa thông tin / Bật-Tắt trạng thái) ---
@router.patch("/{service_id}", response_model=ServiceResponse)
def update_service(service_id: int, service_in: ServiceUpdate, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Không tìm thấy dịch vụ này")

    update_data = service_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(service, key, value)

    db.commit()
    db.refresh(service)
    return service
