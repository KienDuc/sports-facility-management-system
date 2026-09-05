from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    full_name: Optional[str] = None
    is_active: bool = True
    is_admin: bool = False

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None

class UserResponse(UserBase):
    id: int
    created_at: Optional[datetime] = None
    created_by: str
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str