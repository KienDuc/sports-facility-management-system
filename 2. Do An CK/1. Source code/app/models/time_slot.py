from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class TimeSlot(Base):
    __tablename__ = "time_slots"

    id = Column(Integer, primary_key=True, index=True)
    court_id = Column(Integer, ForeignKey("courts.id"), nullable=False)
    start_time = Column(String(10), nullable=False)  # "17:00"
    end_time = Column(String(10), nullable=False)    # "18:00"

    court = relationship("Court", back_populates="time_slots")