from fastapi import APIRouter, HTTPException

from app.schemas.ai import AIChatRequest, AIChatResponse
from app.services.ai_service import ask_gemini

router = APIRouter(prefix="/ai-assistant", tags=["AIAssistant"])


@router.get("/health")
def health_check():
    return {"status": "ok"}


@router.post("/chat", response_model=AIChatResponse)
def chat(data: AIChatRequest):
    try:
        result = ask_gemini(data.message)
        return {
            "success": True,
            "data": result,
        }
    except ValueError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except RuntimeError as error:
        raise HTTPException(status_code=502, detail=str(error)) from error
