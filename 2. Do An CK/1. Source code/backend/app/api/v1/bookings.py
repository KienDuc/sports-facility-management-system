import time
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.booking import Booking, BookingSlot
from backend.app.models.court import Court
from backend.app.api.v1.deps import get_current_user
from backend.app.models.user import User

router = APIRouter(tags=["Bookings"])

# --- SCHEMAS (Đã thêm thông tin khách hàng và Schema cập nhật) ---
class BookingCreate(BaseModel):
    court_id: int
    booking_date: str
    start_time: str
    end_time: str
    customer_name: str
    customer_phone: str
    status: str = "booked" # Mặc định là booked (Màu Đỏ)

class BookingStatusUpdate(BaseModel):
    status: str


# --- 0. API: DANH SÁCH ĐƠN ĐẶT & TRA CỨU (Tìm theo Mã đơn / Tên KH / SĐT, lọc theo trạng thái & ngày) ---
@router.get("/")
def get_bookings(
    keyword: Optional[str] = None,
    status: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Booking)

    # Tra cứu nhanh theo Mã đơn / Tên khách hàng / SĐT
    if keyword:
        like_keyword = f"%{keyword.strip()}%"
        query = query.filter(
            or_(
                Booking.booking_code.ilike(like_keyword),
                Booking.customer_name.ilike(like_keyword),
                Booking.customer_phone.ilike(like_keyword),
            )
        )

    # Lọc theo trạng thái đơn (booked / playing / canceled...)
    if status and status != "all":
        query = query.filter(Booking.status == status)

    # Lọc theo khoảng ngày đặt sân
    if date_from:
        query = query.filter(Booking.booking_date >= date_from)
    if date_to:
        query = query.filter(Booking.booking_date <= date_to)

    bookings = query.order_by(Booking.created_at.desc()).all()

    result = []
    for booking in bookings:
        result.append({
            "id": booking.id,
            "booking_code": booking.booking_code,
            "customer_name": booking.customer_name,
            "customer_phone": booking.customer_phone,
            "booking_date": booking.booking_date,
            "total_price": booking.total_price,
            "status": booking.status,
            "note": booking.note,
            "created_at": booking.created_at.isoformat() if booking.created_at else None,
            "created_by": booking.created_by,
            "updated_at": booking.updated_at.isoformat() if booking.updated_at else None,
            "updated_by": booking.updated_by,
            "slots": [
                {
                    "court_id": slot.court_id,
                    "court_name": slot.court.name if slot.court else None,
                    "court_type": slot.court.type if slot.court else None,
                    "start_time": slot.start_time,
                    "end_time": slot.end_time,
                    "price": slot.price,
                }
                for slot in booking.slots
            ],
            "services": [
                {
                    "service_id": bs.service_id,
                    "service_name": bs.service.name if bs.service else None,
                    "unit": bs.service.unit if bs.service else None,
                    "quantity": bs.quantity,
                    "unit_price": bs.unit_price,
                    "total_price": bs.total_price,
                }
                for bs in booking.services
            ],
        })

    return result


# --- 1. API: LẤY LỊCH TRỰC QUAN ---
@router.get("/schedule")
def get_schedule(date: str, db: Session = Depends(get_db)):
    slots = (
        db.query(BookingSlot, Booking)
        .join(Booking, BookingSlot.booking_id == Booking.id)
        .filter(BookingSlot.booking_date == date)
        .filter(Booking.status.in_(["booked", "playing", "canceled"]))
        .all()
    )

    result = []
    for slot, booking in slots:
        result.append({
            "court_id": slot.court_id,
            "start_time": slot.start_time,
            "status": booking.status, # Trả về đúng status (booked/playing) cho Frontend đổi màu
            "customer": booking.customer_name,
            "phone": booking.customer_phone,
            "booking_code": booking.booking_code
        })

    return result


# --- 2. API: TẠO ĐƠN ĐẶT SÂN (NHẬP THÔNG TIN KHÁCH) ---
@router.post("/")
def create_booking(
    data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Kiểm tra sân
    court = db.query(Court).filter(Court.id == data.court_id).first()
    if not court:
        raise HTTPException(status_code=404, detail="Không tìm thấy sân")

    # Tạo mã đơn
    booking_code = f"BK{int(time.time())}"

    # Lưu vào bảng Booking
    new_booking = Booking(
        booking_code=booking_code,
        customer_name=data.customer_name,
        customer_phone=data.customer_phone,
        booking_date=data.booking_date,
        total_price=court.price_per_hour,
        status=data.status,
        note="Admin đặt trực tiếp từ hệ thống",
        created_by=current_user.username
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    # Lưu vào bảng BookingSlot
    new_slot = BookingSlot(
        booking_id=new_booking.id,
        court_id=data.court_id,
        booking_date=data.booking_date,
        start_time=data.start_time,
        end_time=data.end_time,
        price=court.price_per_hour
    )
    db.add(new_slot)
    db.commit()

    return {"message": "Thành công", "booking_code": booking_code}


# --- 3. API: CẬP NHẬT TRẠNG THÁI (ĐỎ -> VÀNG) ---
@router.patch("/{booking_code}/status")
def update_booking_status(
    booking_code: str,
    data: BookingStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.booking_code == booking_code).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn đặt")

    booking.status = data.status
    booking.updated_by = current_user.username
    db.commit()

    return {"message": f"Đã cập nhật trạng thái thành {data.status}"}


# --- 4. API: HỦY ĐƠN ĐẶT SÂN (TRẢ LẠI Ô TRỐNG XANH) ---
@router.delete("/{booking_code}")
def cancel_booking(
    booking_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.booking_code == booking_code).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn đặt")

    # 1. XÓA chi tiết giờ (BookingSlot) để giải phóng ma trận, giúp ô trở về màu XANH
    db.query(BookingSlot).filter(BookingSlot.booking_id == booking.id).delete()

    # 2. VẪN GIỮ LẠI đơn đặt chính (Booking) nhưng đổi status thành 'canceled' để lưu lịch sử
    booking.status = "canceled"
    booking.updated_by = current_user.username
    db.commit()

    return {"message": "Đã hủy đơn thành công"}