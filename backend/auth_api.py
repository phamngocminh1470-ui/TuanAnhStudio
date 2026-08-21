"""
auth_api.py — Authentication & User Profile API
================================================
Endpoints:
  POST /api/auth/register   - Đăng ký tài khoản mới
  POST /api/auth/login      - Đăng nhập, nhận JWT token
  GET  /api/auth/me         - Lấy thông tin user hiện tại
  PUT  /api/auth/profile    - Cập nhật hồ sơ cá nhân
  PUT  /api/auth/password   - Đổi mật khẩu

Security:
  - Mật khẩu hash bằng bcrypt (passlib)
  - JWT token HS256, expire 30 ngày
  - Middleware `get_current_user` dùng cho protected endpoints
"""

import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Header, status
from pydantic import BaseModel
from sqlmodel import Session, select

# ─── Lazy import để tránh lỗi nếu thư viện chưa cài ──────────────────────
try:
    from jose import JWTError, jwt
    from passlib.context import CryptContext
    _AUTH_AVAILABLE = True
except ImportError:
    _AUTH_AVAILABLE = False
    jwt = None
    JWTError = Exception

from database import User, UserProgress, LearningSession, get_session, get_or_create_user_progress, update_streak, _now_iso, _today

# ─── CẤU HÌNH JWT ────────────────────────────────────────────────────────────
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "khkt-ai-english-mentor-secret-key-2026-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

# ─── PASSWORD HASHING ─────────────────────────────────────────────────────────
if _AUTH_AVAILABLE:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
else:
    pwd_context = None

router = APIRouter()


# ─── PYDANTIC REQUEST/RESPONSE MODELS ─────────────────────────────────────────

class RegisterRequest(BaseModel):
    username: str
    fullname: str
    password: str
    email: str = ""
    role: str = "student"       # "student", "teacher", "admin"
    grade: str = "12"
    target_score: float = 7.0
    experiment_group: str = "ADAPTIVE"

class LoginRequest(BaseModel):
    username: str
    password: str

class ProfileUpdateRequest(BaseModel):
    fullname: Optional[str] = None
    email: Optional[str] = None
    grade: Optional[str] = None
    target_score: Optional[float] = None
    avatar_seed: Optional[str] = None
    experiment_group: Optional[str] = None

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

class AdminResetPasswordRequest(BaseModel):
    username: str
    new_password: str


# ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

def _hash_password(password: str) -> str:
    if not _AUTH_AVAILABLE:
        raise HTTPException(status_code=500, detail="Thư viện passlib chưa được cài đặt.")
    return pwd_context.hash(password)


def _verify_password(plain: str, hashed: str) -> bool:
    if not _AUTH_AVAILABLE:
        return False
    return pwd_context.verify(plain, hashed)


def _create_access_token(data: dict) -> str:
    if not _AUTH_AVAILABLE:
        raise HTTPException(status_code=500, detail="Thư viện python-jose chưa được cài đặt.")
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def _user_to_dict(user: User) -> dict:
    """Chuyển User model sang dict trả về frontend (KHÔNG bao gồm hashed_password)."""
    return {
        "id": user.id,
        "username": user.username,
        "fullname": user.fullname,
        "email": user.email,
        "role": user.role,
        "grade": user.grade,
        "target_score": user.target_score,
        "avatar_seed": user.avatar_seed or user.username,
        "is_active": user.is_active,
        "created_at": user.created_at,
        "experiment_group": user.experiment_group,
    }


# ─── AUTH DEPENDENCY ─────────────────────────────────────────────────────────

def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_session)
) -> Optional[User]:
    """
    Dependency: Parse JWT token từ Authorization header.
    Trả về User nếu token hợp lệ, None nếu không có token.
    Raise 401 nếu token sai/hết hạn.
    """
    if not authorization:
        return None
    
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None
    
    if not _AUTH_AVAILABLE:
        return None
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            return None
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.exec(select(User).where(User.username == username)).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Tài khoản không tồn tại hoặc đã bị khoá.")
    
    return user


def require_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_session)
) -> User:
    """Giống get_current_user nhưng raise 401 nếu chưa đăng nhập."""
    user = get_current_user(authorization, db)
    if not user:
        raise HTTPException(status_code=401, detail="Vui lòng đăng nhập để tiếp tục.")
    return user


# ─── ENDPOINTS ────────────────────────────────────────────────────────────────

@router.post("/auth/register")
async def register(request: RegisterRequest, db: Session = Depends(get_session)):
    """
    Đăng ký tài khoản mới.
    Username phải duy nhất. Mật khẩu tối thiểu 6 ký tự.
    """
    # Validate
    if len(request.username.strip()) < 3:
        raise HTTPException(status_code=400, detail="Tên đăng nhập phải có ít nhất 3 ký tự.")
    if len(request.password) < 6:
        raise HTTPException(status_code=400, detail="Mật khẩu phải có ít nhất 6 ký tự.")
    if not request.fullname.strip():
        raise HTTPException(status_code=400, detail="Họ và tên không được để trống.")
    if request.role not in ["student", "teacher", "admin"]:
        raise HTTPException(status_code=400, detail="Vai trò không hợp lệ.")
    
    # Kiểm tra trùng username
    existing = db.exec(select(User).where(User.username == request.username.strip())).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"Tên đăng nhập '{request.username}' đã tồn tại.")
    
    now = _now_iso()
    user = User(
        username=request.username.strip().lower(),
        fullname=request.fullname.strip(),
        email=request.email.strip(),
        hashed_password=_hash_password(request.password),
        role=request.role,
        grade=request.grade,
        target_score=request.target_score,
        avatar_seed=request.username.strip(),
        experiment_group=request.experiment_group or "ADAPTIVE",
        created_at=now,
        updated_at=now,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Tạo UserProgress rỗng
    get_or_create_user_progress(user.id, db)
    
    token = _create_access_token({"sub": user.username})
    
    return {
        "status": "success",
        "message": "Đăng ký tài khoản thành công!",
        "token": token,
        "token_type": "bearer",
        "user": _user_to_dict(user)
    }


@router.post("/auth/login")
async def login(request: LoginRequest, db: Session = Depends(get_session)):
    """
    Đăng nhập. Trả về JWT token nếu credentials đúng.
    """
    user = db.exec(select(User).where(User.username == request.username.strip().lower())).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Tên đăng nhập hoặc mật khẩu không đúng.")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Tài khoản của bạn đã bị khoá. Vui lòng liên hệ quản trị viên.")
    if not _verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Tên đăng nhập hoặc mật khẩu không đúng.")
    
    token = _create_access_token({"sub": user.username})
    
    return {
        "status": "success",
        "message": "Đăng nhập thành công!",
        "token": token,
        "token_type": "bearer",
        "user": _user_to_dict(user)
    }


@router.get("/auth/me")
async def get_me(current_user: User = Depends(require_current_user)):
    """Lấy thông tin user đang đăng nhập."""
    return {
        "status": "success",
        "user": _user_to_dict(current_user)
    }


@router.put("/auth/profile")
async def update_profile(
    request: ProfileUpdateRequest,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_session)
):
    """Cập nhật hồ sơ cá nhân (fullname, email, grade, target_score, avatar_seed)."""
    user = db.get(User, current_user.id)
    
    if request.fullname is not None:
        if not request.fullname.strip():
            raise HTTPException(status_code=400, detail="Họ và tên không được để trống.")
        user.fullname = request.fullname.strip()
    if request.email is not None:
        user.email = request.email.strip()
    if request.grade is not None:
        user.grade = request.grade
    if request.target_score is not None:
        if not (0 <= request.target_score <= 10):
            raise HTTPException(status_code=400, detail="Mục tiêu điểm phải từ 0 đến 10.")
        user.target_score = request.target_score
    if request.avatar_seed is not None:
        user.avatar_seed = request.avatar_seed
    if request.experiment_group is not None:
        if request.experiment_group not in ["ADAPTIVE", "CONTROL"]:
            raise HTTPException(status_code=400, detail="Nhóm thực nghiệm không hợp lệ. Phải là 'ADAPTIVE' hoặc 'CONTROL'.")
        user.experiment_group = request.experiment_group
    
    user.updated_at = _now_iso()
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {
        "status": "success",
        "message": "Cập nhật hồ sơ thành công!",
        "user": _user_to_dict(user)
    }


@router.put("/auth/password")
async def change_password(
    request: PasswordChangeRequest,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_session)
):
    """Đổi mật khẩu. Yêu cầu mật khẩu cũ để xác nhận."""
    user = db.get(User, current_user.id)
    
    if not _verify_password(request.current_password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Mật khẩu hiện tại không đúng.")
    if len(request.new_password) < 6:
        raise HTTPException(status_code=400, detail="Mật khẩu mới phải có ít nhất 6 ký tự.")
    if request.new_password == request.current_password:
        raise HTTPException(status_code=400, detail="Mật khẩu mới phải khác mật khẩu cũ.")
    
    user.hashed_password = _hash_password(request.new_password)
    user.updated_at = _now_iso()
    db.add(user)
    db.commit()
    
    return {"status": "success", "message": "Đổi mật khẩu thành công!"}


@router.post("/auth/admin/reset-password")
async def admin_reset_password(
    request: AdminResetPasswordRequest,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_session)
):
    """Admin reset mật khẩu cho user khác (không cần mật khẩu cũ)."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Chỉ quản trị viên mới có thể reset mật khẩu.")
    
    target_user = db.exec(select(User).where(User.username == request.username)).first()
    if not target_user:
        raise HTTPException(status_code=404, detail=f"Không tìm thấy tài khoản '{request.username}'.")
    if len(request.new_password) < 6:
        raise HTTPException(status_code=400, detail="Mật khẩu mới phải có ít nhất 6 ký tự.")
    
    target_user.hashed_password = _hash_password(request.new_password)
    target_user.updated_at = _now_iso()
    db.add(target_user)
    db.commit()
    
    return {"status": "success", "message": f"Đã reset mật khẩu cho tài khoản '{request.username}'."}


@router.get("/auth/users")
async def list_users(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_session)
):
    """Xem danh sách tất cả học sinh và tiến độ học tập cho bảng giám sát KHKT."""
    users = db.exec(select(User)).all()
    enriched = []
    for u in users:
        u_dict = _user_to_dict(u)
        prog = db.exec(select(UserProgress).where(UserProgress.user_id == u.id)).first()
        if prog:
            u_dict["theta"] = getattr(prog, 'theta', 0.0)
            u_dict["streak_days"] = getattr(prog, 'streak_days', 0)
            u_dict["total_sessions"] = getattr(prog, 'total_sessions', 0)
            u_dict["total_questions"] = getattr(prog, 'total_questions', 0)
            u_dict["total_correct"] = getattr(prog, 'total_correct', 0)
            u_dict["accuracy"] = round((prog.total_correct / prog.total_questions * 100), 1) if prog.total_questions > 0 else 0.0
        else:
            u_dict["theta"] = 0.0
            u_dict["accuracy"] = 0.0
            u_dict["streak_days"] = 0
            u_dict["total_sessions"] = 0
            u_dict["total_questions"] = 0
            u_dict["total_correct"] = 0
        enriched.append(u_dict)

    return {
        "status": "success",
        "total": len(enriched),
        "users": enriched
    }


@router.put("/auth/users/{username}/toggle-active")
async def toggle_user_active(
    username: str,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_session)
):
    """Admin khóa/mở khóa tài khoản."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Chỉ quản trị viên mới có thể thao tác này.")
    
    target = db.exec(select(User).where(User.username == username)).first()
    if not target:
        raise HTTPException(status_code=404, detail=f"Không tìm thấy tài khoản '{username}'.")
    if target.username == current_user.username:
        raise HTTPException(status_code=400, detail="Không thể tự khóa tài khoản của chính mình.")
    
    target.is_active = not target.is_active
    target.updated_at = _now_iso()
    db.add(target)
    db.commit()
    
    action = "mở khóa" if target.is_active else "khóa"
    return {"status": "success", "message": f"Đã {action} tài khoản '{username}'."}


@router.post("/auth/admin/reset-progress/{username}")
async def admin_reset_student_progress(
    username: str,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_session)
):
    """
    Admin reset toàn bộ tiến độ học tập (theta, mastery, history) của một học sinh.
    Session logs KHÔNG bị xóa — phục vụ tính toàn vẹn dữ liệu nghiên cứu KHKT.
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Chỉ quản trị viên mới có thể reset tiến độ học sinh.")
    
    target = db.exec(select(User).where(User.username == username)).first()
    if not target:
        raise HTTPException(status_code=404, detail=f"Không tìm thấy tài khoản '{username}'.")

    progress = get_or_create_user_progress(target.id, db)

    progress.theta = 0.0
    progress.skill_mastery_json = "{}"
    progress.irt_history_json = "[]"
    progress.sm2_data_json = "{}"
    progress.streak_days = 0
    progress.last_active_date = ""
    progress.total_sessions = 0
    progress.total_questions = 0
    progress.total_correct = 0
    progress.updated_at = _now_iso()

    db.add(progress)
    db.commit()

    return {
        "status": "success",
        "message": f"Đã reset tiến độ học tập của '{username}'. Lịch sử phiên học giữ nguyên cho nghiên cứu."
    }


@router.put("/auth/users/{username}/change-group")
async def change_user_experiment_group(
    username: str,
    group: str,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_session)
):
    """Admin/Teacher thay đổi nhóm thực nghiệm (ADAPTIVE/CONTROL) của học sinh."""
    if current_user.role not in ["admin", "teacher"]:
        raise HTTPException(status_code=850, detail="Không có quyền thực hiện thao tác này.")
    
    if group not in ["ADAPTIVE", "CONTROL"]:
        raise HTTPException(status_code=400, detail="Nhóm thực nghiệm không hợp lệ. Phải là 'ADAPTIVE' hoặc 'CONTROL'.")
        
    target = db.exec(select(User).where(User.username == username)).first()
    if not target:
        raise HTTPException(status_code=404, detail=f"Không tìm thấy tài khoản '{username}'.")
        
    target.experiment_group = group
    target.updated_at = _now_iso()
    db.add(target)
    db.commit()
    
    return {
        "status": "success", 
        "message": f"Đã chuyển học sinh '{username}' sang nhóm '{group}'."
        "test_server": "succes", 
        "serrev": "Dax chuyen server";
    }   

    return {
        "status": "success",
        "message": "da chuyen hoc sinh"  '{username}' sang nhom '{group}'."
    }
    

