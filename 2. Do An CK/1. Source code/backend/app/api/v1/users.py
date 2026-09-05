from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.schemas.user import UserCreate, UserUpdate, UserResponse
from backend.app.core.security import get_password_hash
from backend.app.api.v1.deps import get_current_user, get_current_active_admin

router = APIRouter(tags=["Users"])


@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    """Lấy thông tin tài khoản đang đăng nhập"""
    return current_user


@router.get("/", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_admin)):
    """Lấy danh sách tài khoản nhân viên (Chỉ Admin)"""
    return db.query(User).all()


@router.post("/", response_model=UserResponse)
def create_user(user_in: UserCreate, db: Session = Depends(get_db),
                current_user: User = Depends(get_current_active_admin)):
    """Tạo tài khoản mới (Chỉ Admin)"""
    if db.query(User).filter(User.username == user_in.username).first():
        raise HTTPException(status_code=400, detail="Tên đăng nhập đã tồn tại")

    db_user = User(
        username=user_in.username,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        is_active=user_in.is_active,
        is_admin=user_in.is_admin,
        created_by=current_user.username
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.patch("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    """Cập nhật thông tin tài khoản (Chỉ Admin)"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")

    # Lấy dữ liệu gửi lên (chỉ lấy những trường có thay đổi)
    if hasattr(user_in, 'model_dump'):
        update_data = user_in.model_dump(exclude_unset=True)
    else:
        update_data = user_in.dict(exclude_unset=True)

    # Xử lý riêng trường hợp Admin muốn đổi mật khẩu
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

    # Cập nhật các trường vào database object
    for key, value in update_data.items():
        setattr(db_user, key, value)

    # Ghi nhận người thực hiện chỉnh sửa
    db_user.updated_by = current_user.username

    db.commit()
    db.refresh(db_user)
    return db_user


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    """Xóa tài khoản (Chỉ Admin)"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")

    # [BẢO MẬT] Không cho phép admin đang đăng nhập tự xóa chính tài khoản của mình
    if db_user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Lỗi: Bạn không thể tự xóa tài khoản của chính mình!")

    db.delete(db_user)
    db.commit()

    return {"message": f"Đã xóa tài khoản '{db_user.username}' thành công"}