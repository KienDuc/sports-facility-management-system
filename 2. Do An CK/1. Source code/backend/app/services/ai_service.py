from datetime import date

import httpx

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


def create_prompt(message: str, service_text: str, court_text: str) -> str:
    today = date.today().isoformat()

    return f"""
Bạn là trợ lý đặt sân thể thao của hệ thống SFMS.
Ngày hiện tại là {today}.

Danh sách SÂN ĐANG HOẠT ĐỘNG và GIÁ THUÊ:
{court_text}

Danh sách dịch vụ đang cung cấp (hãy tư vấn giá dựa trên danh sách này nếu khách hỏi):
{service_text}

Nhiệm vụ của bạn:
- QUY TẮC XƯNG HÔ: LUÔN LUÔN xưng là "em" và gọi khách hàng là "anh/chị". 
- LUÔN LUÔN thêm chữ "Dạ" ở đầu câu và chữ "ạ" ở cuối câu hỏi để thể hiện sự lễ phép. (Ví dụ: "Dạ, anh/chị muốn đặt sân lúc mấy giờ ạ?").
- Lệnh CẤM: TUYỆT ĐỐI KHÔNG xưng "tôi" và gọi "bạn".
- Hiểu yêu cầu của người dùng bằng tiếng Việt.
- Xác định ý định, loại sân, ngày đặt, giờ bắt đầu, giờ kết thúc và dịch vụ.
- Ngày đặt phải trả về dạng YYYY-MM-DD.
- Thời gian phải trả về dạng HH:MM.
- Nếu thiếu thông tin cần thiết thì thêm tên trường vào missing_fields.
- Không tự khẳng định sân còn trống.
- Không tự tạo đơn đặt sân.
- court_id luôn là null nếu người dùng không nói rõ mã sân.
- Trả lời ngắn gọn, thân thiện bằng tiếng Việt.
- QUAN TRỌNG NHẤT: Để tìm sân (search_available_court), BẮT BUỘC phải có đủ 4 thông tin: sport_type, booking_date, start_time, end_time.
- Lệnh CẤM: TUYỆT ĐỐI KHÔNG tự đoán, tự bịa ra hay mặc định start_time và end_time nếu người dùng chưa nói rõ.
- Nếu thiếu bất kỳ thông tin nào trong 4 trường bắt buộc trên, PHẢI liệt kê tên trường bị thiếu vào mảng missing_fields và đặt câu hỏi lại cho khách.

Tin nhắn người dùng: {message}
""".strip()


async def ask_gemini(message: str, service_text: str, court_text: str) -> AIChatData:
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
                "parts": [{"text": create_prompt(message, service_text, court_text)}],
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

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=body, headers=headers)
            response.raise_for_status()

    except httpx.HTTPStatusError as error:
        detail = error.response.text
        raise RuntimeError(f"API Gemini báo lỗi: {detail}") from error
    except httpx.RequestError as error:
        raise RuntimeError(f"Lỗi kết nối Gemini: {str(error)}") from error
    # response = None
    #
    # try:
    #     response = requests.post(url, json=body, headers=headers, timeout=30)
    #     response.raise_for_status()
    # except requests.RequestException as error:
    #     detail = response.text if response is not None else str(error)
    #     raise RuntimeError(f"Không gọi được Gemini: {detail}") from error

    try:
        result = response.json()
        text = result["candidates"][0]["content"]["parts"][0]["text"]
        return AIChatData.model_validate_json(text)
    except (KeyError, IndexError, ValueError) as error:
        raise RuntimeError("Gemini trả về dữ liệu không hợp lệ") from error
