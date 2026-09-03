from sqlalchemy import Column, Integer, String, Float, Boolean
from backend.app.db.session import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    unit = Column(String(20), default="Lượt")
    price = Column(Float, nullable=False)
    is_available = Column(Boolean, default=True)