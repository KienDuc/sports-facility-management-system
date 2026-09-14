from fastapi import APIRouter, HTTPException, Depends

from backend.app.models.service import Service
from backend.app.models.court import Court
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.schemas.ai import AIChatRequest, AIChatResponse
from backend.app.services.ai_service import ask_gemini

router = APIRouter(tags=["AIAssistant"])


@router.get("/health")
def health_check():
    return {"status": "ok"}


@router.post("/chat", response_model=AIChatResponse)
async def chat(data: AIChatRequest, db: Session = Depends(get_db)):
    try:
        # Lấy danh sách dịch vụ đang hoạt động
        services = db.query(Service).filter(Service.is_available == True).all()
        service_text = "\n".join([f"- {s.name}: {s.price}đ" for s in services])
        if not service_text:
            service_text = "- Hiện tại chưa có dịch vụ nào."

        courts = db.query(Court).filter(Court.is_active == True).all()
        court_text = "\n".join([f"- {c.name} (Môn: {c.type}): {c.price_per_hour}đ/giờ" for c in courts])
        if not court_text:
            court_text = "- Hiện tại hệ thống chưa có sân nào được mở."

        result = await ask_gemini(data.message, service_text, court_text)
        return {
            "success": True,
            "data": result,
        }
    except ValueError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except RuntimeError as error:
        raise HTTPException(status_code=502, detail=str(error)) from error
