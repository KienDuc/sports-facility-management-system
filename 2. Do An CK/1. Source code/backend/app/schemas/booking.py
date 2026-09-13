from typing import Optional, List

from pydantic import BaseModel


class BookingServiceItem(BaseModel):
    service_id: int
    quantity: int = 1
    unit_price: float

class BookingCreate(BaseModel):
    court_id: int
    booking_date: str
    start_time: str
    end_time: str
    customer_name: str
    customer_phone: str
    status: str = "booked" # Mặc định là booked (Màu Đỏ)
    services: Optional[List[BookingServiceItem]] = []

class BookingStatusUpdate(BaseModel):
    status: str