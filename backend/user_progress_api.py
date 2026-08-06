"""
user_progress_api.py — User Learning Progress API
==================================================
Lưu và tải tiến độ học tập của từng user theo tài khoản.
Phục vụ:
  - Dashboard hiển thị dữ liệu thật
  - Adaptive Engine nhận trạng thái theta/mastery đúng
  - Nghiên cứu KHKT ghi log phiên học

Endpoints:
  GET  /api/user/progress           - Tải toàn bộ tiến độ học tập
  POST /api/user/progress           - Lưu tiến độ sau phiên học
  GET  /api/user/sessions           - Xem lịch sử các phiên học (Research log)
  POST /api/user/session/log        - Ghi nhật ký một phiên học

Nguyên tắc:
  - Nếu user chưa đăng nhập: các endpoints này KHÔNG bị gọi (frontend fallback localStorage)
  - Toàn bộ thuật toán IRT/FSRS/SM-2 GIỮ NGUYÊN — chỉ thêm lớp lưu trữ
"""

import json
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select

from database import (
    User, UserProgress, LearningSession,
    get_session, get_or_create_user_progress, update_streak, _now_iso, _today
)
from auth_api import require_current_user

router = APIRouter()


# ─── PYDANTIC MODELS ─────────────────────────────────────────────────────────

class ProgressSaveRequest(BaseModel):
    """Payload gửi lên sau mỗi phiên học (từ IRTTestEngine, SM2, v.v.)"""
    theta: Optional[float] = None
    skill_mastery: Optional[Dict[str, float]] = None
    irt_history: Optional[List[Dict[str, Any]]] = None
    sm2_data: Optional[Dict[str, Any]] = None
    # Session summary
    session_type: str = "irt_test"
    theta_before: Optional[float] = None
    questions_answered: int = 0
    correct_count: int = 0
    skill_focus: str = ""
    session_data: Optional[Dict[str, Any]] = None


class SessionLogRequest(BaseModel):
    """Ghi nhật ký phiên học (phục vụ nghiên cứu KHKT)"""
    session_type: str = "irt_test"
    theta_before: float = 0.0
    theta_after: float = 0.0
    questions_answered: int = 0
    correct_count: int = 0
    skill_focus: str = ""
    session_data: Optional[Dict[str, Any]] = None


# ─── ENDPOINTS ────────────────────────────────────────────────────────────────

@router.get("/user/progress")
async def get_user_progress(
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_session)
):
    """
    Tải toàn bộ tiến độ học tập của user đang đăng nhập.
    Frontend dùng để đồng bộ state sau khi login.
    """
    progress = get_or_create_user_progress(current_user.id, db)
    
    # Parse JSON fields
    try:
        skill_mastery = json.loads(progress.skill_mastery_json) if progress.skill_mastery_json else {}
    except json.JSONDecodeError:
        skill_mastery = {}
    
    try:
        irt_history = json.loads(progress.irt_history_json) if progress.irt_history_json else []
    except json.JSONDecodeError:
        irt_history = []
    
    try:
        sm2_data = json.loads(progress.sm2_data_json) if progress.sm2_data_json else {}
    except json.JSONDecodeError:
        sm2_data = {}
    
    return {
        "status": "success",
        "progress": {
            "theta": progress.theta,
            "skill_mastery": skill_mastery,
            "irt_history": irt_history,
            "sm2_data": sm2_data,
            "streak_days": progress.streak_days,
            "last_active_date": progress.last_active_date,
            "total_sessions": progress.total_sessions,
            "total_questions": progress.total_questions,
            "total_correct": progress.total_correct,
            "accuracy": round(progress.total_correct / max(1, progress.total_questions) * 100, 1),
            "updated_at": progress.updated_at,
        }
    }


@router.post("/user/progress")
async def save_user_progress(
    request: ProgressSaveRequest,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_session)
):
    """
    Lưu tiến độ học tập sau mỗi phiên học.
    Chỉ cập nhật các field được gửi lên (partial update).
    Tự động:
      - Cập nhật streak_days
      - Ghi LearningSession vào log nghiên cứu
      - Cập nhật total_sessions, total_questions, total_correct
    """
    progress = get_or_create_user_progress(current_user.id, db)
    
    # Partial update — chỉ cập nhật field nào được gửi lên
    if request.theta is not None:
        theta_before = progress.theta
        progress.theta = request.theta
    else:
        theta_before = progress.theta
    
    if request.skill_mastery is not None:
        # Merge với existing mastery (không xóa kỹ năng cũ chưa được gửi)
        existing = {}
        try:
            existing = json.loads(progress.skill_mastery_json) if progress.skill_mastery_json else {}
        except json.JSONDecodeError:
            pass
        existing.update(request.skill_mastery)
        progress.skill_mastery_json = json.dumps(existing, ensure_ascii=False)
    
    if request.irt_history is not None:
        # Append history mới, không xóa lịch sử cũ
        existing_history = []
        try:
            existing_history = json.loads(progress.irt_history_json) if progress.irt_history_json else []
        except json.JSONDecodeError:
            pass
        # Chỉ thêm các item chưa có (tránh duplicate)
        existing_ids = {h.get("itemId", "") for h in existing_history}
        new_items = [h for h in request.irt_history if h.get("itemId", "") not in existing_ids]
        existing_history.extend(new_items)
        progress.irt_history_json = json.dumps(existing_history, ensure_ascii=False)
    
    if request.sm2_data is not None:
        progress.sm2_data_json = json.dumps(request.sm2_data, ensure_ascii=False)
    
    # Cập nhật stats
    if request.questions_answered > 0:
        progress.total_sessions += 1
        progress.total_questions += request.questions_answered
        progress.total_correct += request.correct_count
    
    # Cập nhật streak
    progress = update_streak(progress)
    progress.updated_at = _now_iso()
    
    db.add(progress)
    
    # Ghi LearningSession log (phục vụ nghiên cứu KHKT)
    if request.questions_answered > 0:
        session_log = LearningSession(
            user_id=current_user.id,
            session_type=request.session_type,
            theta_before=request.theta_before if request.theta_before is not None else theta_before,
            theta_after=request.theta if request.theta is not None else theta_before,
            questions_answered=request.questions_answered,
            correct_count=request.correct_count,
            skill_focus=request.skill_focus,
            session_data_json=json.dumps(request.session_data or {}, ensure_ascii=False),
            created_at=_now_iso()
        )
        db.add(session_log)
    
    db.commit()
    db.refresh(progress)
    
    return {
        "status": "success",
        "message": "Đã lưu tiến độ học tập.",
        "streak_days": progress.streak_days,
        "total_sessions": progress.total_sessions,
    }


@router.get("/user/sessions")
async def get_user_sessions(
    limit: int = 20,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_session)
):
    """
    Xem lịch sử các phiên học của user.
    Phục vụ dashboard "Lịch sử học tập" và nghiên cứu KHKT.
    """
    sessions = db.exec(
        select(LearningSession)
        .where(LearningSession.user_id == current_user.id)
        .order_by(LearningSession.created_at.desc())
        .limit(limit)
    ).all()
    
    return {
        "status": "success",
        "total": len(sessions),
        "sessions": [
            {
                "id": s.id,
                "session_type": s.session_type,
                "theta_before": s.theta_before,
                "theta_after": s.theta_after,
                "theta_change": round(s.theta_after - s.theta_before, 3),
                "questions_answered": s.questions_answered,
                "correct_count": s.correct_count,
                "accuracy": round(s.correct_count / max(1, s.questions_answered) * 100, 1),
                "skill_focus": s.skill_focus,
                "created_at": s.created_at,
            }
            for s in sessions
        ]
    }


@router.delete("/user/progress/reset")
async def reset_user_progress(
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_session)
):
    """
    Reset tiến độ học tập về trạng thái ban đầu.
    Dùng khi học sinh muốn bắt đầu lại từ đầu.
    LearningSession logs được GIỮ NGUYÊN (không xóa — phục vụ nghiên cứu).
    """
    progress = get_or_create_user_progress(current_user.id, db)
    
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
        "message": "Đã reset toàn bộ tiến độ học tập. Lịch sử phiên học được giữ nguyên cho nghiên cứu."
    }
