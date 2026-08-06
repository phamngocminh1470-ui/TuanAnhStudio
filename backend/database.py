"""
database.py — SQLite Database Schema & Init
============================================
Sử dụng SQLModel (FastAPI-native ORM) với SQLite.
Không cần cài server riêng. Toàn bộ dữ liệu lưu trong file `ai_english_mentor.db`.

Tables:
  - User            : Tài khoản người dùng
  - UserProgress    : Trạng thái học tập hiện tại (theta, mastery, history)
  - LearningSession : Log từng phiên học (phục vụ nghiên cứu KHKT)
"""

import json
import os
from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, Session, SQLModel, create_engine, select

# ─── Đường dẫn database file ────────────────────────────────────────────────
DB_PATH = os.path.join(os.path.dirname(__file__), "ai_english_mentor.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

# ─── ENGINE ─────────────────────────────────────────────────────────────────
engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})


# ─── MODELS ─────────────────────────────────────────────────────────────────

class User(SQLModel, table=True):
    """
    Bảng tài khoản người dùng.
    Mật khẩu được hash bằng bcrypt — KHÔNG bao giờ lưu plaintext.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True, max_length=50)
    fullname: str = Field(default="", max_length=100)
    email: str = Field(default="", max_length=150)
    hashed_password: str
    role: str = Field(default="student")        # "student", "teacher", "admin"
    grade: str = Field(default="12")            # "10", "11", "12"
    target_score: float = Field(default=7.0)   # Mục tiêu điểm THPT (0-10)
    avatar_seed: str = Field(default="")        # Seed cho DiceBear avatar
    is_active: bool = Field(default=True)
    created_at: str = Field(default="")
    updated_at: str = Field(default="")


class UserProgress(SQLModel, table=True):
    """
    Bảng trạng thái học tập hiện tại của từng user.
    Mỗi user có đúng một dòng — cập nhật sau mỗi phiên học.
    Đây là nguồn dữ liệu chính cho Dashboard và Adaptive Engine.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", unique=True, index=True)
    # IRT Adaptive Learning state
    theta: float = Field(default=0.0)
    skill_mastery_json: str = Field(default="{}")   # JSON: {"Tenses": 0.65, ...}
    irt_history_json: str = Field(default="[]")     # JSON: [{"itemId": ..., "result": ...}, ...]
    # SM-2 Spaced Repetition state
    sm2_data_json: str = Field(default="{}")
    # Activity tracking
    streak_days: int = Field(default=0)
    last_active_date: str = Field(default="")       # ISO date string "2026-08-06"
    total_sessions: int = Field(default=0)
    total_questions: int = Field(default=0)
    total_correct: int = Field(default=0)
    # Timestamps
    updated_at: str = Field(default="")


class LearningSession(SQLModel, table=True):
    """
    Bảng nhật ký từng phiên học.
    Phục vụ nghiên cứu KHKT — không xóa dữ liệu sau thực nghiệm.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    session_type: str = Field(default="irt_test")  # "irt_test", "sm2", "reading", "listening"
    theta_before: float = Field(default=0.0)
    theta_after: float = Field(default=0.0)
    questions_answered: int = Field(default=0)
    correct_count: int = Field(default=0)
    skill_focus: str = Field(default="")           # Kỹ năng trọng tâm buổi học
    session_data_json: str = Field(default="{}")   # Full session data (JSON)
    created_at: str = Field(default="")


# ─── HELPER FUNCTIONS ───────────────────────────────────────────────────────

def get_session():
    """Dependency cho FastAPI — tạo DB session, tự đóng sau request."""
    with Session(engine) as session:
        yield session


def _now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _today() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def create_db_and_tables():
    """Tạo toàn bộ bảng nếu chưa tồn tại. Gọi một lần khi khởi động app."""
    SQLModel.metadata.create_all(engine)
    print("[DB] SQLite database initialized:", DB_PATH)


def get_or_create_user_progress(user_id: int, session: Session) -> UserProgress:
    """Lấy UserProgress của user, tạo mới nếu chưa có."""
    progress = session.exec(
        select(UserProgress).where(UserProgress.user_id == user_id)
    ).first()
    if not progress:
        progress = UserProgress(
            user_id=user_id,
            updated_at=_now_iso()
        )
        session.add(progress)
        session.commit()
        session.refresh(progress)
    return progress


def update_streak(progress: UserProgress) -> UserProgress:
    """
    Cập nhật streak_days khi user học.
    Streak tăng nếu ngày hôm nay chưa được ghi nhận.
    Streak reset về 1 nếu bỏ qua ngày hôm qua.
    """
    today = _today()
    if not progress.last_active_date:
        progress.streak_days = 1
        progress.last_active_date = today
        return progress
    
    from datetime import date, timedelta
    last = date.fromisoformat(progress.last_active_date)
    today_date = date.fromisoformat(today)
    delta = (today_date - last).days
    
    if delta == 0:
        pass  # Đã học hôm nay, không thay đổi streak
    elif delta == 1:
        progress.streak_days += 1  # Ngày liên tiếp
        progress.last_active_date = today
    else:
        progress.streak_days = 1   # Bỏ ngày → reset
        progress.last_active_date = today
    
    return progress
