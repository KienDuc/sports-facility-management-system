from typing import Literal

from pydantic import BaseModel, Field


class AIChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)
    session_id: str | None = None


class AIChatData(BaseModel):
    intent: Literal[
        "greeting",
        "search_available_court",
        "booking_information",
        "price_inquiry",
        "service_inquiry",
        "confirm_booking",
        "unknown",
    ]
    sport_type: str | None = None
    booking_date: str | None = None
    start_time: str | None = None
    end_time: str | None = None
    court_id: int | None = None
    services: list[str] = Field(default_factory=list)
    missing_fields: list[str] = Field(default_factory=list)
    reply: str


class AIChatResponse(BaseModel):
    success: bool
    data: AIChatData
