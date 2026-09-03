from datetime import date

import requests

from backend.app.config import settings
from backend.app.schemas.ai import AIChatData


def get_response_schema():
    return {
        "type": "object",
        "properties": {
            "intent": {
                "type": "string",
                "enum": [
                    "greeting",
                    "search_available_court",
                    "booking_information",
                    "price_inquiry",
                    "service_inquiry",
                    "confirm_booking",
                    "unknown",
                ],
            },
            "sport_type": {
                "anyOf": [{"type": "string"}, {"type": "null"}],
            },
            "booking_date": {
                "anyOf": [{"type": "string"}, {"type": "null"}],
            },
            "start_time": {
                "anyOf": [{"type": "string"}, {"type": "null"}],
            },
            "end_time": {
                "anyOf": [{"type": "string"}, {"type": "null"}],
            },
            "court_id": {
                "anyOf": [{"type": "integer"}, {"type": "null"}],
            },
            "services": {
                "type": "array",
                "items": {"type": "string"},
            },
            "missing_fields": {
                "type": "array",
                "items": {"type": "string"},
            },
            "reply": {"type": "string"},
        },
        "required": [
            "intent",
            "sport_type",
            "booking_date",
            "start_time",
            "end_time",
            "court_id",
            "services",
            "missing_fields",
            "reply",
        ],
        "additionalProperties": False,
    }


def create_prompt(message: str) -> str:
    today = date.today().isoformat()

    return f"""
Bạn là trợ lý đặt sân thể thao của hệ thống SFMS.
Ngày hiện tại là {today}.

Nhiệm vụ của bạn:
- Hiểu yêu cầu của người dùng bằng tiếng Việt.
- Xác định ý định, loại sân, ngày đặt, giờ bắt đầu, giờ kết thúc và dịch vụ.
- Ngày đặt phải trả về dạng YYYY-MM-DD.
- Thời gian phải trả về dạng HH:MM.
- Nếu thiếu thông tin cần thiết thì thêm tên trường vào missing_fields.
- Không tự khẳng định sân còn trống.
- Không tự tạo đơn đặt sân.
- court_id luôn là null nếu người dùng không nói rõ mã sân.
- Trả lời ngắn gọn, thân thiện bằng tiếng Việt.

Tin nhắn người dùng: {message}
""".strip()


def ask_gemini(message: str) -> AIChatData:
    if not settings.GEMINI_API_KEY:
        raise ValueError("Chưa cấu hình GEMINI_API_KEY")

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.GEMINI_MODEL}:generateContent"
    )

    body = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": create_prompt(message)}],
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json",
            "responseJsonSchema": get_response_schema(),
        },
    }

    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": settings.GEMINI_API_KEY,
    }

    response = None

    try:
        response = requests.post(url, json=body, headers=headers, timeout=30)
        response.raise_for_status()
    except requests.RequestException as error:
        detail = response.text if response is not None else str(error)
        raise RuntimeError(f"Không gọi được Gemini: {detail}") from error

    try:
        result = response.json()
        text = result["candidates"][0]["content"]["parts"][0]["text"]
        return AIChatData.model_validate_json(text)
    except (KeyError, IndexError, ValueError) as error:
        raise RuntimeError("Gemini trả về dữ liệu không hợp lệ") from error
