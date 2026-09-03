from typing import Optional
from pydantic import BaseModel, Field


class ServiceBase(BaseModel):
    name: str = Field(
        ..., min_length=2, max_length=100, examples=["Nước suối Aquafina"]
    )
    unit: str = Field(
        default="Lượt", max_length=20, description="Đơn vị tính", examples=["Chai"]
    )
    price: float = Field(
        ..., gt=0, description="Đơn giá, phải lớn hơn 0", examples=[10000]
    )
    is_available: bool = Field(default=True, description="Trạng thái đang cung cấp")


class ServiceCreate(ServiceBase):
    pass  # Kế thừa toàn bộ từ ServiceBase


class ServiceUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    unit: Optional[str] = Field(None, max_length=20)
    price: Optional[float] = Field(None, gt=0)
    is_available: Optional[bool] = None


class ServiceResponse(ServiceBase):
    id: int

    class Config:
        from_attributes = True
