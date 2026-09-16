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
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Header, Request, status
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

from database import User, UserProgress, UserSession, LearningSession, get_session, get_or_create_user_progress, update_streak, _now_iso, _today

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

def _parse_client_device(request: Optional[Request] = None, user_agent_str: str = "") -> dict:
    """Phân tích User-Agent và IP để nhận diện thiết bị, hệ điều hành và trình duyệt."""
    ua = user_agent_str
    ip = "127.0.0.1"
    if request:
        if not ua:
            ua = request.headers.get("user-agent", "")
        ip_header = request.headers.get("x-forwarded-for")
        if ip_header:
            ip = ip_header.split(",")[0].strip()
        elif request.headers.get("x-real-ip"):
            ip = request.headers.get("x-real-ip").strip()
        elif request.client and request.client.host:
            ip = request.client.host

    # OS detection
    os_name = "Hệ điều hành khác"
    if "Windows NT 10.0" in ua or "Windows NT 11.0" in ua:
        os_name = "Windows 10 / 11"
    elif "Windows NT" in ua:
        os_name = "Windows"
    elif "Android" in ua:
        os_name = "Android"
    elif "iPhone" in ua:
        os_name = "iPhone (iOS)"
    elif "iPad" in ua:
        os_name = "iPad (iPadOS)"
    elif "Mac OS X" in ua:
        os_name = "macOS"
    elif "Linux" in ua:
        os_name = "Linux"

    # Browser detection
    browser = "Trình duyệt Web"
    if "Edg/" in ua:
        browser = "Microsoft Edge"
    elif "CocCoc" in ua:
        browser = "Cốc Cốc"
    elif "Chrome/" in ua:
        browser = "Google Chrome"
    elif "Firefox/" in ua:
        browser = "Mozilla Firefox"
    elif "Safari/" in ua and "Chrome" not in ua:
        browser = "Apple Safari"
    elif "Opera" in ua or "OPR" in ua:
        browser = "Opera"

    device_name = f"Máy tính ({os_name} · {browser})"
    if "Android" in ua:
        device_name = f"Điện thoại Android ({browser})"
    elif "iPhone" in ua:
        device_name = f"iPhone ({browser})"
    elif "iPad" in ua:
        device_name = f"iPad ({browser})"

    return {
        "device_name": device_name,
        "browser": browser,
        "os_name": os_name,
        "ip_address": ip,
        "user_agent": ua[:255] if ua else ""
    }


def _hash_password(password: str) -> str:
    if not _AUTH_AVAILABLE:
        raise HTTPException(status_code=500, detail="Thư viện passlib chưa được cài đặt.")
    return pwd_context.hash(password)


def _verify_password(plain: str, hashed: str) -> bool:
    if not _AUTH_AVAILABLE:
        return False
    return pwd_context.verify(plain, hashed)


def _create_access_token(data: dict, session_id: Optional[str] = None) -> str:
    if not _AUTH_AVAILABLE:
        raise HTTPException(status_code=500, detail="Thư viện python-jose chưa được cài đặt.")
    to_encode = data.copy()
    if session_id:
        to_encode["session_id"] = session_id
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
        "primary_session_id": getattr(user, "primary_session_id", None),
        "created_at": user.created_at,
        "experiment_group": user.experiment_group,
    }


# ─── AUTH DEPENDENCY ─────────────────────────────────────────────────────────

def get_current_user(
    request: Request,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_session)
) -> Optional[User]:
    """
    Dependency: Parse JWT token từ Authorization header.
    Kiểm tra tính hợp lệ của token và session_id:
    - Nếu session đã bị kích hoặc tài khoản kích tất cả các máy khác, trả về 401.
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
        session_id: Optional[str] = payload.get("session_id")
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
    
    now = _now_iso()
    # Kiểm tra trạng thái phiên và kích máy từ xa
    if session_id:
        sess = db.exec(select(UserSession).where(UserSession.session_id == session_id)).first()
        if not sess or not sess.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Thiết bị này đã bị kích đăng xuất từ xa bởi Quản trị viên."
            )
        # Nếu user đã thực hiện kích tất cả các máy khác (revoke_before_ts)
        if user.revoke_before_ts and not sess.is_trusted:
            if sess.created_at < user.revoke_before_ts:
                sess.is_active = False
                sess.revoked_at = now
                db.add(sess)
                db.commit()
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Phiên làm việc trên thiết bị này đã bị hủy bỏ bởi Quản trị viên."
                )
        # Cập nhật thời gian hoạt động gần nhất
        sess.last_active_at = now
        db.add(sess)
        db.commit()
    else:
        # Token cũ (ví dụ token trên máy phòng thi)
        if user.revoke_before_ts:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Phiên đăng nhập cũ đã bị kích ra khỏi hệ thống bởi Quản trị viên."
            )
    
    return user


def require_current_user(
    request: Request,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_session)
) -> User:
    """Giống get_current_user nhưng raise 401 nếu chưa đăng nhập."""
    user = get_current_user(request, authorization, db)
    if not user:
        raise HTTPException(status_code=401, detail="Vui lòng đăng nhập để tiếp tục.")
    return user


# ─── ENDPOINTS ────────────────────────────────────────────────────────────────

@router.post("/auth/register")
async def register(request_body: RegisterRequest, request: Request, db: Session = Depends(get_session)):
    """
    Đăng ký tài khoản mới và khởi tạo phiên đăng nhập đầu tiên.
    """
    if len(request_body.username.strip()) < 3:
        raise HTTPException(status_code=400, detail="Tên đăng nhập phải có ít nhất 3 ký tự.")
    if len(request_body.password) < 6:
        raise HTTPException(status_code=400, detail="Mật khẩu phải có ít nhất 6 ký tự.")
    if not request_body.fullname.strip():
        raise HTTPException(status_code=400, detail="Họ và tên không được để trống.")
    if request_body.role not in ["student", "teacher", "admin"]:
        raise HTTPException(status_code=400, detail="Vai trò không hợp lệ.")
    
    existing = db.exec(select(User).where(User.username == request_body.username.strip())).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"Tên đăng nhập '{request_body.username}' đã tồn tại.")
    
    now = _now_iso()
    session_id = str(uuid.uuid4())
    dev_info = _parse_client_device(request)

    user = User(
        username=request_body.username.strip().lower(),
        fullname=request_body.fullname.strip(),
        email=request_body.email.strip(),
        hashed_password=_hash_password(request_body.password),
        role="student",
        grade=request_body.grade or "12",
        target_score=request_body.target_score or 7.0,
        avatar_seed=request_body.username.strip(),
        experiment_group=request_body.experiment_group or "ADAPTIVE",
        primary_session_id=session_id,
        created_at=now,
        updated_at=now,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Tạo UserSession cho thiết bị đăng ký (được đặt là máy chuẩn nhất)
    sess = UserSession(
        user_id=user.id,
        session_id=session_id,
        device_name=f"Máy chính ({dev_info['os_name']} · {dev_info['browser']})",
        browser=dev_info["browser"],
        os_name=dev_info["os_name"],
        ip_address=dev_info["ip_address"],
        user_agent=dev_info["user_agent"],
        is_trusted=True,
        is_active=True,
        created_at=now,
        last_active_at=now,
    )
    db.add(sess)
    db.commit()

    get_or_create_user_progress(user.id, db)
    token = _create_access_token({"sub": user.username}, session_id=session_id)
    
    return {
        "status": "success",
        "message": "Đăng ký tài khoản thành công!",
        "token": token,
        "token_type": "bearer",
        "session_id": session_id,
        "user": _user_to_dict(user)
    }


@router.post("/auth/login")
async def login(request_body: LoginRequest, request: Request, db: Session = Depends(get_session)):
    """
    Đăng nhập. Lưu phiên đăng nhập thiết bị và trả về JWT token kèm session_id.
    """
    user = db.exec(select(User).where(User.username == request_body.username.strip().lower())).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Tên đăng nhập hoặc mật khẩu không đúng.")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Tài khoản của bạn đã bị khoá. Vui lòng liên hệ quản trị viên.")
    if not _verify_password(request_body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Tên đăng nhập hoặc mật khẩu không đúng.")
    
    now = _now_iso()
    session_id = str(uuid.uuid4())
    dev_info = _parse_client_device(request)

    # Kiểm tra thiết bị tin cậy / máy chuẩn nhất
    active_sessions = db.exec(
        select(UserSession).where(UserSession.user_id == user.id, UserSession.is_active == True)
    ).all()
    
    has_primary = user.primary_session_id is not None
    is_trusted = False
    if not has_primary or len(active_sessions) == 0:
        is_trusted = True
        user.primary_session_id = session_id
        db.add(user)
    
    sess = UserSession(
        user_id=user.id,
        session_id=session_id,
        device_name=dev_info["device_name"],
        browser=dev_info["browser"],
        os_name=dev_info["os_name"],
        ip_address=dev_info["ip_address"],
        user_agent=dev_info["user_agent"],
        is_trusted=is_trusted,
        is_active=True,
        created_at=now,
        last_active_at=now,
    )
    db.add(sess)
    db.commit()

    token = _create_access_token({"sub": user.username}, session_id=session_id)
    
    return {
        "status": "success",
        "message": "Đăng nhập thành công!",
        "token": token,
        "token_type": "bearer",
        "session_id": session_id,
        "is_trusted": is_trusted,
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
        # Chỉ admin hoặc teacher mới được đổi grade qua API, học sinh giữ nguyên khối đã đăng ký
        if current_user.role in ["admin", "teacher"]:
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
    }


# ─── QUẢN LÝ THIẾT BỊ VÀ PHIÊN ĐĂNG NHẬP ─────────────────────────────────────

@router.get("/auth/sessions")
async def get_user_sessions(
    request: Request,
    current_user: User = Depends(require_current_user),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_session)
):
    """
    Lấy danh sách tất cả các thiết bị/phiên đang và đã đăng nhập của người dùng.
    Đánh dấu rõ ràng thiết bị hiện tại (is_current) và máy chuẩn nhất (is_trusted).
    """
    current_session_id = None
    if authorization:
        scheme, _, token = authorization.partition(" ")
        if scheme.lower() == "bearer" and token and _AUTH_AVAILABLE:
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                current_session_id = payload.get("session_id")
            except Exception:
                pass
    
    now = _now_iso()
    dev_info = _parse_client_device(request)
    
    sessions = db.exec(
        select(UserSession)
        .where(UserSession.user_id == current_user.id)
        .order_by(UserSession.created_at.desc())
    ).all()
    
    # Nếu chưa có session nào trong bảng (ví dụ tài khoản đăng nhập trước khi có tính năng),
    # hoặc token hiện tại chưa có session trong DB, tự động tạo session gắn với máy hiện tại:
    matching_sess = None
    if current_session_id:
        matching_sess = next((s for s in sessions if s.session_id == current_session_id), None)
    
    if not matching_sess:
        new_session_id = current_session_id or str(uuid.uuid4())
        matching_sess = UserSession(
            user_id=current_user.id,
            session_id=new_session_id,
            device_name=f"Máy này ({dev_info['os_name']} · {dev_info['browser']})",
            browser=dev_info["browser"],
            os_name=dev_info["os_name"],
            ip_address=dev_info["ip_address"],
            user_agent=dev_info["user_agent"],
            is_trusted=True,
            is_active=True,
            created_at=now,
            last_active_at=now,
        )
        db.add(matching_sess)
        if not current_user.primary_session_id:
            current_user.primary_session_id = new_session_id
            db.add(current_user)
        db.commit()
        db.refresh(matching_sess)
        current_session_id = new_session_id
        # Nạp lại danh sách
        sessions = db.exec(
            select(UserSession)
            .where(UserSession.user_id == current_user.id)
            .order_by(UserSession.created_at.desc())
        ).all()
        
    res_sessions = []
    for s in sessions:
        is_curr = (s.session_id == current_session_id) or (s.id == matching_sess.id)
        res_sessions.append({
            "id": s.id,
            "session_id": s.session_id,
            "device_name": s.device_name,
            "browser": s.browser,
            "os_name": s.os_name,
            "ip_address": s.ip_address,
            "is_trusted": s.is_trusted,
            "is_active": s.is_active,
            "is_current": is_curr,
            "created_at": s.created_at,
            "last_active_at": s.last_active_at,
            "revoked_at": s.revoked_at,
        })
        
    return {
        "status": "success",
        "current_ip": dev_info["ip_address"],
        "current_device": dev_info["device_name"],
        "current_session_id": current_session_id,
        "primary_session_id": current_user.primary_session_id,
        "sessions": res_sessions
    }


@router.post("/auth/sessions/kick-all-others")
async def kick_all_other_sessions(
    request: Request,
    current_user: User = Depends(require_current_user),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_session)
):
    """
    KÍCH ĐĂNG XUẤT TẤT CẢ MÁY KHÁC:
    - Vô hiệu hóa toàn bộ session khác (máy điểm thi, máy lạ, v.v.).
    - Cập nhật revoke_before_ts để vô hiệu hóa toàn bộ JWT cũ không có session.
    - Giữ lại máy hiện tại, thiết lập máy này là 'Máy chuẩn nhất' (is_trusted = True).
    """
    current_session_id = None
    if authorization:
        scheme, _, token = authorization.partition(" ")
        if scheme.lower() == "bearer" and token and _AUTH_AVAILABLE:
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                current_session_id = payload.get("session_id")
            except Exception:
                pass
    
    now = _now_iso()
    dev_info = _parse_client_device(request)
    
    current_sess = None
    if current_session_id:
        current_sess = db.exec(
            select(UserSession).where(UserSession.session_id == current_session_id)
        ).first()
        
    if not current_sess:
        current_session_id = current_session_id or str(uuid.uuid4())
        current_sess = UserSession(
            user_id=current_user.id,
            session_id=current_session_id,
            device_name=f"Máy chính chủ ({dev_info['os_name']} · {dev_info['browser']})",
            browser=dev_info["browser"],
            os_name=dev_info["os_name"],
            ip_address=dev_info["ip_address"],
            user_agent=dev_info["user_agent"],
            is_trusted=True,
            is_active=True,
            created_at=now,
            last_active_at=now,
        )
        db.add(current_sess)
    else:
        current_sess.is_active = True
        current_sess.is_trusted = True
        current_sess.last_active_at = now
        current_sess.device_name = f"Máy chính chủ ({dev_info['os_name']} · {dev_info['browser']})"
        db.add(current_sess)
    
    # Kích tất cả các session khác của user
    all_sessions = db.exec(
        select(UserSession).where(UserSession.user_id == current_user.id)
    ).all()
    
    kicked_count = 0
    for s in all_sessions:
        if s.session_id != current_sess.session_id:
            if s.is_active:
                s.is_active = False
                s.revoked_at = now
                kicked_count += 1
            s.is_trusted = False
            db.add(s)
            
    # Đặt revoke_before_ts và primary_session_id
    current_user.revoke_before_ts = now
    current_user.primary_session_id = current_sess.session_id
    current_user.updated_at = now
    db.add(current_user)
    db.commit()
    db.refresh(current_sess)
    
    # Cấp lại token cho máy hiện tại (được xác thực an toàn kèm session_id)
    new_token = _create_access_token({"sub": current_user.username}, session_id=current_sess.session_id)
    
    return {
        "status": "success",
        "message": f"Đã kích đăng xuất thành công toàn bộ {kicked_count} máy khác! Tài khoản hiện chỉ duy trì trên máy tính này (đã được cài đặt là máy chuẩn nhất).",
        "kicked_count": kicked_count,
        "current_session_id": current_sess.session_id,
        "token": new_token
    }


@router.post("/auth/sessions/{session_id}/kick")
async def kick_single_session(
    session_id: str,
    current_user: User = Depends(require_current_user),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_session)
):
    """Kích một thiết bị cụ thể ra khỏi tài khoản."""
    target_sess = db.exec(
        select(UserSession).where(
            UserSession.session_id == session_id,
            UserSession.user_id == current_user.id
        )
    ).first()
    
    if not target_sess:
        raise HTTPException(status_code=404, detail="Không tìm thấy thiết bị / phiên đăng nhập này.")
    
    now = _now_iso()
    target_sess.is_active = False
    target_sess.revoked_at = now
    db.add(target_sess)
    db.commit()
    
    return {
        "status": "success",
        "message": f"Đã kích thiết bị '{target_sess.device_name}' ({target_sess.ip_address}) ra khỏi tài khoản thành công!"
    }


@router.post("/auth/sessions/set-primary")
async def set_primary_device(
    request: Request,
    current_user: User = Depends(require_current_user),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_session)
):
    """Cài đặt máy tính hiện tại là Thiết bị chính chủ (Chuẩn nhất)."""
    current_session_id = None
    if authorization:
        scheme, _, token = authorization.partition(" ")
        if scheme.lower() == "bearer" and token and _AUTH_AVAILABLE:
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                current_session_id = payload.get("session_id")
            except Exception:
                pass
    
    now = _now_iso()
    dev_info = _parse_client_device(request)
    
    current_sess = None
    if current_session_id:
        current_sess = db.exec(
            select(UserSession).where(UserSession.session_id == current_session_id)
        ).first()
        
    if not current_sess:
        current_session_id = current_session_id or str(uuid.uuid4())
        current_sess = UserSession(
            user_id=current_user.id,
            session_id=current_session_id,
            device_name=f"Máy chính chủ ({dev_info['os_name']} · {dev_info['browser']})",
            browser=dev_info["browser"],
            os_name=dev_info["os_name"],
            ip_address=dev_info["ip_address"],
            user_agent=dev_info["user_agent"],
            is_trusted=True,
            is_active=True,
            created_at=now,
            last_active_at=now,
        )
        db.add(current_sess)
    else:
        current_sess.is_trusted = True
        current_sess.is_active = True
        current_sess.last_active_at = now
        db.add(current_sess)
    
    # Các session khác is_trusted = False
    all_sessions = db.exec(select(UserSession).where(UserSession.user_id == current_user.id)).all()
    for s in all_sessions:
        if s.session_id != current_sess.session_id:
            s.is_trusted = False
            db.add(s)
            
    current_user.primary_session_id = current_sess.session_id
    current_user.updated_at = now
    db.add(current_user)
    db.commit()
    
    new_token = _create_access_token({"sub": current_user.username}, session_id=current_sess.session_id)
    
    return {
        "status": "success",
        "message": "Đã thiết lập máy tính này là Thiết Bị Chính Chủ (Chuẩn nhất) của tài khoản!",
        "primary_session_id": current_sess.session_id,
        "token": new_token
    }

