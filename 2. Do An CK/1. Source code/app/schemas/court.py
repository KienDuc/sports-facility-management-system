from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class CourtBase(BaseModel):
  name: str = Field(
      ..., min_length=2, max_length=100, examples=["Sân Bóng Đá 1 (5 người)"]
  )
  type: str = Field(
      ...,
      description="Loại sân: football, badminton, tennis",
      examples=["football"],
  )
  price_per_hour: float = Field(
      ..., gt=0, description="Giá thuê mỗi giờ, phải lớn hơn 0", examples=[200000]
  )
  is_active: bool = Field(default=True, description="Trạng thái sân hoạt động")

class CourtCreate(CourtBase):
    pass # Kế thừa toàn bộ từ CourtBase

class CourtUpdate(BaseModel):
  name: Optional[str] = Field(None, min_length=2, max_length=100)
  type: Optional[str] = None
  price_per_hour: Optional[float] = Field(None, gt=0)
  is_active: Optional[bool] = None

class CourtResponse(CourtBase):
    id: int

    class Config:
        from_attributes = True