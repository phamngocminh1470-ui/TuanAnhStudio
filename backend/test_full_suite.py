"""
test_full_suite.py — Bo kiem thu toan dien AI English Mentor Backend
=====================================================================
Chay: python test_full_suite.py
Yeu cau: server dang chay o http://localhost:8000
"""
import sys
import json
import time
import urllib.request
import urllib.error
import urllib.parse

# Fix Windows console encoding
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

BASE = "http://localhost:8000"
PASS = 0
FAIL = 0
RESULTS = []

def req(method, path, body=None, headers=None, token=None, expected_status=200):
    url = BASE + path
    h = {"Content-Type": "application/json"}
    if headers:
        h.update(headers)
    if token:
        h["Authorization"] = f"Bearer {token}"
    data = json.dumps(body).encode() if body else None
    r = urllib.request.Request(url, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(r, timeout=10) as resp:
            status = resp.status
            ct = resp.headers.get("Content-Type", "")
            raw = resp.read()
            if "json" in ct:
                result = json.loads(raw)
            else:
                result = {"_raw_bytes": len(raw), "_content_type": ct}
            return status, result
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            result = json.loads(raw)
        except Exception:
            result = {"_raw": raw.decode(errors="replace")}
        return e.code, result
    except Exception as ex:
        return 0, {"_error": str(ex)}

def test(name, condition, detail=""):
    global PASS, FAIL
    status = "PASS" if condition else "FAIL"
    if condition:
        PASS += 1
    else:
        FAIL += 1
    icon = "[OK]" if condition else "[!!]"
    msg = f"  {icon} [{status}] {name}"
    if not condition and detail:
        msg += f"\n       → {detail}"
    print(msg)
    RESULTS.append({"name": name, "status": status, "detail": detail})

def section(title):
    print(f"\n" + "="*60)
    print(f"  {title}")
    print("="*60)

# ─── TEST RUNNER ──────────────────────────────────────────────────────────────

section("1. HEALTH & ROOT")
s, r = req("GET", "/")
test("GET / → 200", s == 200, str(r))
test("Root có field 'message'", "message" in r, str(r))

s, r = req("GET", "/api/health")
test("GET /api/health → 200", s == 200, str(r))
test("Health status == 'healthy'", r.get("status") == "healthy", str(r))

# ─── AUTH TESTS ───────────────────────────────────────────────────────────────
section("2. AUTH: REGISTER & LOGIN")

# Test register user mới
ts = int(time.time())
TEST_USER = f"testuser_{ts}"
TEST_PASS = "testpass123"

s, r = req("POST", "/api/auth/register", {
    "username": TEST_USER,
    "fullname": "Test Student",
    "password": TEST_PASS,
    "grade": "12",
    "role": "student"
})
test("POST /auth/register → 200", s == 200, str(r))
test("Register trả về token", "token" in r, str(r))
test("Register trả về user object", "user" in r, str(r))

# Lưu token
user_token = r.get("token", "")

# Test login
s, r = req("POST", "/api/auth/login", {"username": TEST_USER, "password": TEST_PASS})
test("POST /auth/login → 200", s == 200, str(r))
test("Login trả về token", "token" in r, str(r))
login_token = r.get("token", user_token)

# Test login sai mật khẩu
s, r = req("POST", "/api/auth/login", {"username": TEST_USER, "password": "wrongpass"})
test("Login sai mật khẩu → 401", s == 401, str(r))

# Test register trùng username
s, r = req("POST", "/api/auth/register", {"username": TEST_USER, "fullname": "Dup", "password": "pass123", "grade": "12"})
test("Register trùng username → 409", s == 409, str(r))

# Test đăng ký mật khẩu ngắn
s, r = req("POST", "/api/auth/register", {"username": "shortpass_u", "fullname": "A", "password": "abc", "grade": "12"})
test("Register mật khẩu ngắn → 400", s == 400, str(r))

section("3. AUTH: GET PROFILE & UPDATE")

s, r = req("GET", "/api/auth/me", token=login_token)
test("GET /auth/me → 200 (với token)", s == 200, str(r))
test("me trả về user.username đúng", r.get("user", {}).get("username") == TEST_USER, str(r))

s, r = req("GET", "/api/auth/me")  # Không có token
test("GET /auth/me không có token → None (200 hoặc 401)", s in (200, 401), str(r))

# ─── USER PROGRESS ────────────────────────────────────────────────────────────
section("4. USER PROGRESS: SAVE & LOAD")

s, r = req("GET", "/api/user/progress", token=login_token)
test("GET /user/progress → 200", s == 200, str(r))
test("Progress có field 'theta'", "progress" in r and "theta" in r.get("progress", {}), str(r))

# Save progress
s, r = req("POST", "/api/user/progress", {
    "theta": 0.75,
    "skill_mastery": {"Grammar": 0.6, "Vocabulary": 0.55},
    "irt_history": [{"itemId": "TEST_Q_001", "result": 1}],
    "session_type": "irt_test",
    "questions_answered": 1,
    "correct_count": 1,
    "skill_focus": "Grammar",
    "theta_before": 0.5
}, token=login_token)
test("POST /user/progress (save) → 200", s == 200, str(r))
test("Save trả về streak_days", "streak_days" in r, str(r))

# Load lại
s, r = req("GET", "/api/user/progress", token=login_token)
test("GET /user/progress sau save → theta == 0.75", r.get("progress", {}).get("theta") == 0.75, str(r))
test("GET /user/progress sau save → skill_mastery.Grammar >= 0.6",
     r.get("progress", {}).get("skill_mastery", {}).get("Grammar", 0) >= 0.6, str(r))

# Test không có token
s, r = req("GET", "/api/user/progress")
test("GET /user/progress không có token → 401", s == 401, str(r))

# Sessions
s, r = req("GET", "/api/user/sessions", token=login_token)
test("GET /user/sessions → 200", s == 200, str(r))
test("Sessions có field 'sessions'", "sessions" in r, str(r))

section("5. ADAPTIVE LEARNING ALGORITHMS")

# next-question
s, r = req("POST", "/api/adaptive/generate-question", {"grade": "12", "theta": 0.5, "history": []})
test("POST /adaptive/generate-question → 200", s == 200, str(r))
test("Generate question có status success hoặc completed", r.get("status") in ("success", "completed"), str(r))

# update-ability
s, r = req("POST", "/api/adaptive/update-ability", {
    "history": [{
        "question": {"item_id": "Q_001", "difficulty": 0.0, "discrimination": 1.0, "guessing": 0.2},
        "response": 1
    }],
    "student_id": TEST_USER,
    "experiment_group": "ADAPTIVE"
})
test("POST /adaptive/update-ability → 200", s == 200, str(r))
test("Update ability trả về new_theta", "new_theta" in r, str(r))

# Learning path
s, r = req("POST", "/api/adaptive/learning-path", {"theta": 0.5})
test("POST /adaptive/learning-path → 200", s == 200, str(r))

# Spaced repetition SM2
s, r = req("POST", "/api/spaced-repetition/next-review", {
    "quality": 4, "current_repetition": 1, "current_ef": 2.5, "current_interval": 1, "engine": "SM2"
})
test("POST /spaced-repetition/next-review (SM2) → 200", s == 200, str(r))
test("SM2 trả về next_interval_days", "next_interval_days" in r, str(r))

# FSRS
s, r = req("POST", "/api/spaced-repetition/next-review", {
    "quality": 4, "current_repetition": 1, "current_ef": 2.5, "current_interval": 1,
    "stability": 2.0, "difficulty": 3.0, "days_since_last": 1, "engine": "FSRS"
})
test("POST /spaced-repetition/next-review (FSRS) → 200", s == 200, str(r))

section("6. RESEARCH APIs")

s, r = req("GET", "/api/teacher/report")
test("GET /teacher/report → 200", s == 200, str(r))
test("Teacher report có status success", r.get("status") == "success", str(r))
test("Teacher report có total_sessions", "total_sessions" in r, str(r))

s, r = req("GET", "/api/research/theta-timeline")
test("GET /research/theta-timeline → 200", s == 200, str(r))
test("Theta-timeline có status success", r.get("status") == "success", str(r))
test("Theta-timeline có 'timeline' array", isinstance(r.get("timeline"), list), str(r))

# Export CSV
s, r = req("GET", "/api/research/export?format=csv")
test("GET /research/export (csv) → 200", s == 200, str(r))
test("Export CSV trả về bytes", "_raw_bytes" in r or s == 200, str(r))

# Export XLSX
s, r = req("GET", "/api/research/export?format=xlsx")
test("GET /research/export (xlsx) → 200", s == 200, str(r))

# Export với filter
s, r = req("GET", "/api/research/export?grade=12&experiment_group=ADAPTIVE&format=csv")
test("GET /research/export với filters → 200", s == 200, str(r))

# Export date filter
s, r = req("GET", "/api/research/export?start_date=2026-01-01&end_date=2026-12-31&format=csv")
test("GET /research/export với date filter → 200", s == 200, str(r))

section("7. ADMIN ENDPOINTS")

# Đăng ký admin test riêng
ADMIN_USER = f"admin_{ts}"
ADMIN_PASS = "adminpass123"
s, r = req("POST", "/api/auth/register", {
    "username": ADMIN_USER, "fullname": "Admin Test",
    "password": ADMIN_PASS, "grade": "12", "role": "admin"
})
admin_token = r.get("token", "")
test("Register admin user → có token", bool(admin_token), str(r))

# List users (admin only)
s, r = req("GET", "/api/auth/users", token=admin_token)
test("GET /auth/users (admin) → 200", s == 200, str(r))
test("List users trả về 'users' array", "users" in r, str(r))

# List users (student không có quyền)
s, r = req("GET", "/api/auth/users", token=login_token)
test("GET /auth/users (student) → 403", s == 403, str(r))

# Admin reset password
s, r = req("POST", "/api/auth/admin/reset-password", {
    "username": TEST_USER, "new_password": "newpass999"
}, token=admin_token)
test("POST /admin/reset-password → 200", s == 200, str(r))

# Admin reset password bởi student → 403
s, r = req("POST", "/api/auth/admin/reset-password", {
    "username": TEST_USER, "new_password": "newpass999"
}, token=login_token)
test("POST /admin/reset-password (student) → 403", s == 403, str(r))

# Admin reset progress
s, r = req("POST", f"/api/auth/admin/reset-progress/{TEST_USER}", token=admin_token)
test("POST /admin/reset-progress/{user} (admin) → 200", s == 200, str(r))

# Student reset progress bởi student → 403
s, r = req("POST", f"/api/auth/admin/reset-progress/{TEST_USER}", token=login_token)
test("POST /admin/reset-progress (student) → 403", s == 403, str(r))

# Verify progress đã reset về 0
s, r = req("GET", "/api/user/progress", token=login_token)
# Sau reset-password ta cần login lại
s2, r2 = req("POST", "/api/auth/login", {"username": TEST_USER, "password": "newpass999"})
new_token = r2.get("token", login_token)
s, r = req("GET", "/api/user/progress", token=new_token)
test("Progress sau admin reset → theta == 0.0", r.get("progress", {}).get("theta") == 0.0, str(r))

# Toggle active
s, r = req("PUT", f"/api/auth/users/{TEST_USER}/toggle-active", token=admin_token)
test("PUT /auth/users/{u}/toggle-active → 200", s == 200, str(r))

section("8. QUESTIONS & ITEM BANK")
s, r = req("GET", "/api/questions?grade=12")
test("GET /questions?grade=12 → 200", s == 200, str(r))
test("Questions trả về list", isinstance(r.get("questions"), list), str(r))

section("9. PREDICT SCORES")
s, r = req("POST", "/api/predict/scores", {"theta": 0.5, "ef": 2.5, "streak": 7, "pronounce_score": 75.0})
test("POST /predict/scores → 200", s == 200, str(r))
test("Predict trả về 'predictions'", "predictions" in r, str(r))

section("10. RESET PROGRESS (SELF)")
# Unlock TEST_USER truoc (bi lock o test 7 toggle-active)
req("PUT", f"/api/auth/users/{TEST_USER}/toggle-active", token=admin_token)

# Login lai sau khi mo khoa
s_rel, r_rel = req("POST", "/api/auth/login", {"username": TEST_USER, "password": "newpass999"})
final_token = r_rel.get("token", new_token)
test("Login lai sau unlock → 200", s_rel == 200, str(r_rel))

s, r = req("DELETE", "/api/user/progress/reset", token=final_token)
test("DELETE /user/progress/reset (self) → 200", s == 200, str(r))

# Verify reset
s, r = req("GET", "/api/user/progress", token=final_token)
test("Progress tu reset ve theta == 0.0", r.get("progress", {}).get("theta") == 0.0, str(r))
test("Progress tu reset ve history rong",
     len(r.get("progress", {}).get("irt_history", [])) == 0, str(r))

# ─── SUMMARY ──────────────────────────────────────────────────────────────────
total = PASS + FAIL
section("TỔNG KẾT KIỂM THỬ")
print(f"\n  Tong tests  : {total}")
print(f"  PASS        : {PASS}")
print(f"  FAIL        : {FAIL}")
print(f"  Ti le PASS  : {round(PASS/total*100, 1) if total else 0}%\n")

if FAIL > 0:
    print("  Các test FAIL:")
    for r_item in RESULTS:
        if r_item["status"] == "FAIL":
            print(f"    - {r_item['name']}")
            if r_item.get("detail"):
                print(f"      {r_item['detail'][:120]}")

sys.exit(0 if FAIL == 0 else 1)
