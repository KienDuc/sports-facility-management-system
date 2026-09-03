from sqlalchemy import Column, Integer, String, Float, Boolean
from sqlalchemy.orm import relationship
from backend.app.db.session import Base

class Court(Base):
    __tablename__ = "courts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False) # football, badminton, tennis
    price_per_hour = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)

    time_slots = relationship("TimeSlot", back_populates="court", cascade="all, delete-orphan")