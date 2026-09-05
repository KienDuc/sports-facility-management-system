from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.schemas.user import Token
from backend.app.core.security import verify_password, create_access_token
from backend.app.config import settings

router = APIRouter(tags=["Auth"])

# Dùng OAuth2PasswordRequestForm để hỗ trợ nút Authorize trong Swagger UI
@router.post("/login", response_model=Token)
def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tài khoản hoặc mật khẩu không chính xác",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Tài khoản đã bị khóa")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "is_admin": user.is_admin},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}