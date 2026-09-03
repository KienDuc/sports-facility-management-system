from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from backend.app.db.session import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    booking_code = Column(String(20), unique=True, index=True, nullable=False)
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    booking_date = Column(String(10), nullable=False)  # YYYY-MM-DD
    total_price = Column(Float, default=0.0)
    status = Column(String(20), default="confirmed")  # confirmed, completed, cancelled
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    slots = relationship("BookingSlot", back_populates="booking", cascade="all, delete-orphan")
    services = relationship("BookingService", back_populates="booking", cascade="all, delete-orphan")

class BookingSlot(Base):
    __tablename__ = "booking_slots"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    court_id = Column(Integer, ForeignKey("courts.id"), nullable=False)
    booking_date = Column(String(10), nullable=False)
    start_time = Column(String(10), nullable=False)
    end_time = Column(String(10), nullable=False)
    price = Column(Float, nullable=False)

    booking = relationship("Booking", back_populates="slots")
    court = relationship("Court")

class BookingService(Base):
    __tablename__ = "booking_services"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)

    booking = relationship("Booking", back_populates="services")
    service = relationship("Service")