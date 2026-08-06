import math
import os
import json
import time
from typing import List, Dict, Tuple, Optional, Any

# =====================================================================
# THUẬT TOÁN 1: LÝ THUYẾT ỨNG ĐÁP CÂU HỎI (ITEM RESPONSE THEORY - IRT)
# =====================================================================

class IRTQuestion:
    def __init__(
        self, 
        item_id: str, 
        difficulty: float, 
        discrimination: float = 1.0, 
        guessing: float = 0.25,
        skill: str = "Tenses",
        topic: str = "Grammar",
        question_text: str = "",
        options: List[str] = None,
        correct: str = "",
        explanation: str = "",
        source: str = "Calibrated Bank",
        calibration_status: str = "CALIBRATED",
        sample_size: int = 100
    ):
        """
        Khởi tạo câu hỏi trong mô hình IRT 3PL và định dạng ngân hàng câu hỏi chuẩn KHKT.
        """
        self.item_id = item_id
        self.b = difficulty       # Tham số độ khó b
        self.a = discrimination   # Tham số độ phân biệt a
        self.c = guessing         # Tham số đoán mò c
        self.skill = skill
        self.topic = topic
        self.question_text = question_text
        self.options = options or []
        self.correct = correct
        self.explanation = explanation
        self.source = source
        self.calibration_status = calibration_status  # CALIBRATED, PROVISIONAL, UNCALIBRATED
        self.sample_size = sample_size

    # Để tương thích ngược với code cũ sử dụng difficulty thay vì b
    @property
    def difficulty(self) -> float:
        return self.b


# =====================================================================
# KHO CÂU HỎI ĐỊNH CHUẨN (CALIBRATED ITEM BANK)
# =====================================================================

class ItemBank:
    def __init__(self, file_path: Optional[str] = None):
        if file_path is None:
            file_path = os.path.join(os.path.dirname(__file__), "irt_item_bank.json")
        self.file_path = file_path
        self.questions: Dict[str, IRTQuestion] = {}
        self.load_bank()

    def load_bank(self):
        """Tải ngân hàng câu hỏi định chuẩn từ tệp JSON."""
        if not os.path.exists(self.file_path):
            self._create_default_bank()
        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                for q in data.get("questions", []):
                    self.questions[q["item_id"]] = IRTQuestion(
                        item_id=q["item_id"],
                        difficulty=q.get("difficulty_parameter", q.get("difficulty", 0.0)),
                        discrimination=q.get("discrimination", 1.0),
                        guessing=q.get("guessing_parameter", q.get("guessing", 0.25)),
                        skill=q.get("skill", "Tenses"),
                        topic=q.get("topic", "Grammar"),
                        question_text=q["question"],
                        options=q["options"],
                        correct=q["correct"],
                        explanation=q.get("explanation", ""),
                        source=q.get("source", "KHKT Bank"),
                        calibration_status=q.get("calibration_status", "CALIBRATED"),
                        sample_size=q.get("sample_size", 100)
                    )
        except Exception as e:
            print(f"Lỗi khi tải ngân hàng câu hỏi: {e}")

    def _create_default_bank(self):
        """Khởi tạo file item bank mặc định nếu chưa tồn tại."""
        default_data = {
            "questions": [
                {
                    "item_id": "IRT_Q_001",
                    "question": "She usually ________ to school by bicycle every morning.",
                    "options": ["A. goes", "B. go", "C. is going", "D. went"],
                    "correct": "A",
                    "explanation": "Dùng thì Hiện tại đơn với 'usually'. Chủ ngữ 'She' thêm '-s': goes.",
                    "skill": "Tenses",
                    "topic": "Grammar",
                    "difficulty": -1.2,
                    "discrimination": 1.1,
                    "guessing": 0.25,
                    "source": "Đề thi tốt nghiệp THPT",
                    "calibration_status": "CALIBRATED",
                    "sample_size": 150
                }
            ]
        }
        with open(self.file_path, "w", encoding="utf-8") as f:
            json.dump(default_data, f, ensure_ascii=False, indent=2)

    def get_all_questions(self, status_filter: Optional[List[str]] = None) -> List[IRTQuestion]:
        if status_filter is None:
            status_filter = ["CALIBRATED", "PROVISIONAL"]
        return [q for q in self.questions.values() if q.calibration_status in status_filter]


# =====================================================================
# ĐỒ THỊ TRI THỨC (KNOWLEDGE GRAPH) & PHỤ THUỘC KIẾN THỨC
# =====================================================================

class KnowledgeGraph:
    def __init__(self):
        # Định nghĩa các mối quan hệ tiên quyết (prerequisite relationship)
        # Nút A -> Nút B nghĩa là học sinh cần nắm được A trước khi học B
        self.dependencies: Dict[str, List[str]] = {
            "Passive Voice": ["Tenses"],
            "Conditionals": ["Tenses"],
            "Reported Speech": ["Tenses"],
            "Collocations": ["Vocabulary"],
            "Reading Comprehension": ["Vocabulary", "Tenses"]
        }

    def get_prerequisites(self, skill: str) -> List[str]:
        return self.dependencies.get(skill, [])

    def is_prerequisite_satisfied(self, skill: str, skill_mastery: Dict[str, float], threshold: float = 0.5) -> Tuple[bool, Optional[str]]:
        """
        Kiểm tra xem các kỹ năng tiên quyết của 'skill' đã đạt độ thành thạo tối thiểu chưa.
        """
        prereqs = self.get_prerequisites(skill)
        for prereq in prereqs:
            mastery = skill_mastery.get(prereq, 0.5)
            if mastery < threshold:
                return False, prereq
        return True, None


# =====================================================================
# THUẬT TOÁN ĐÁNH GIÁ NĂNG LỰC & CHỌN CÂU HỎI THÍCH ỨNG (IRT CAT)
# =====================================================================

class IRTEngine:
    @staticmethod
    def calculate_probability(theta: float, question: IRTQuestion) -> float:
        """Tính xác suất đúng (IRT 3PL)."""
        exponent = -question.a * (theta - question.b)
        exponent = max(-20.0, min(20.0, exponent))
        probability = question.c + (1.0 - question.c) / (1.0 + math.exp(exponent))
        return probability

    @staticmethod
    def calculate_information(theta: float, question: IRTQuestion) -> float:
        """Tính lượng thông tin Fisher."""
        p = IRTEngine.calculate_probability(theta, question)
        if p <= 0 or p >= 1.0 or question.c >= 1.0:
            return 0.0
        numerator = (question.a ** 2) * (1.0 - p) * ((p - question.c) ** 2)
        denominator = p * ((1.0 - question.c) ** 2)
        return numerator / denominator

    @staticmethod
    def estimate_ability_eap(history: List[Tuple[IRTQuestion, int]]) -> float:
        """
        Ước lượng theta bằng thuật toán EAP (Expected A Posteriori).
        Sử dụng 21 điểm nút Gauss-Hermite từ -3.0 đến 3.0.
        Prior: N(0, 1) chuẩn hóa.
        """
        if not history:
            return 0.0

        # 21 điểm nút từ -3.0 đến 3.0, step 0.3
        nodes = [x * 0.3 for x in range(-10, 11)]

        # Prior phân phối Gauss chuẩn N(0,1)
        prior_weights = [math.exp(-0.5 * (x ** 2)) / math.sqrt(2 * math.pi) for x in nodes]
        sum_prior = sum(prior_weights)
        prior_weights = [w / sum_prior for w in prior_weights]

        # Tính Likelihood cho mỗi điểm nút theta
        likelihoods = []
        for node in nodes:
            likelihood = 1.0
            for question, response in history:
                p = IRTEngine.calculate_probability(node, question)
                # Clamp xác suất để tránh log(0)
                p = max(1e-9, min(1.0 - 1e-9, p))
                likelihood *= p if response == 1 else (1.0 - p)
                # Tránh underflow bằng cách scale nếu quá nhỏ
                if likelihood < 1e-300:
                    likelihood = 1e-300
                    break
            likelihoods.append(likelihood)

        # Tính posterior và EAP
        posteriors = [likelihoods[i] * prior_weights[i] for i in range(len(nodes))]
        sum_posterior = sum(posteriors)

        if sum_posterior <= 0:
            return 0.0

        estimated_theta = sum(nodes[i] * (posteriors[i] / sum_posterior) for i in range(len(nodes)))
        return round(max(-3.0, min(3.0, estimated_theta)), 4)

    @staticmethod
    def select_next_question(
        theta: float, 
        pool: List[IRTQuestion], 
        excluded_ids: List[str]
    ) -> Optional[IRTQuestion]:
        """Tương thích ngược: Lựa chọn theo lượng thông tin Fisher lớn nhất."""
        best_question = None
        max_info = -1.0
        for question in pool:
            if question.item_id in excluded_ids:
                continue
            info = IRTEngine.calculate_information(theta, question)
            if info > max_info:
                max_info = info
                best_question = question
        return best_question


# =====================================================================
# HÀM TIỆN ÍCH TÍNH MASTERY (DÙNG CHUNG)
# =====================================================================

def compute_skill_mastery(
    history_items: List[Dict[str, Any]],
    item_bank: "ItemBank",
    initial_mastery: Optional[Dict[str, float]] = None
) -> Dict[str, float]:
    """
    Tính toán Skill Mastery từ danh sách lịch sử làm bài.
    Hàm này được tách ra để tái sử dụng ở nhiều endpoint.
    
    Args:
        history_items: List[{"itemId": str, "result": int (0|1)}]
        item_bank: ItemBank instance
        initial_mastery: Mastery khởi đầu, mặc định 0.5 cho mỗi kỹ năng
    
    Returns:
        Dict[skill_name, mastery_value] với giá trị trong [0.0, 1.0]
    """
    DEFAULT_SKILLS = {
        "Tenses": 0.5,
        "Passive Voice": 0.5,
        "Relative Clauses": 0.5,
        "Conditionals": 0.5,
        "Reported Speech": 0.5,
        "Vocabulary": 0.5,
        "Collocations": 0.5,
        "Pronunciation": 0.5,
        "Stress": 0.5
    }
    
    mastery = initial_mastery.copy() if initial_mastery else DEFAULT_SKILLS.copy()
    
    for h in history_items:
        item_id = h.get("itemId", "")
        result = int(h.get("result", 0))
        
        # Tìm skill từ item bank; nếu không tìm thấy thì bỏ qua (không fallback sang Tenses)
        if item_id not in item_bank.questions:
            continue
        
        skill = item_bank.questions[item_id].skill
        m_old = mastery.get(skill, 0.5)
        
        if result == 1:
            m_new = m_old + (1.0 - m_old) * 0.2
        else:
            m_new = m_old - m_old * 0.15
        
        # BUG-07 FIX: Clamp giá trị mastery trong [0.0, 1.0]
        mastery[skill] = max(0.0, min(1.0, m_new))
    
    return mastery


# =====================================================================
# BỘ CHỌN CÂU HỎI THÍCH ỨNG KHÁCH QUAN (ADAPTIVE QUESTION SELECTOR)
# =====================================================================

class AdaptiveQuestionSelector:
    def __init__(self, item_bank: ItemBank, knowledge_graph: KnowledgeGraph):
        self.item_bank = item_bank
        self.knowledge_graph = knowledge_graph

    def select_question(
        self,
        theta: float,
        irt_history: List[Dict[str, Any]],
        skill_mastery: Dict[str, float]
    ) -> Tuple[Optional[IRTQuestion], str]:
        """
        Chọn câu hỏi tiếp theo dựa trên:
        - Khoảng cách độ khó (IRT)
        - Độ thành thạo kỹ năng (Mastery)
        - Ràng buộc cây quan hệ tiên quyết (Knowledge Graph)
        - Tránh lặp lại câu hỏi đã trả lời
        """
        excluded_ids = {h["itemId"] for h in irt_history if "itemId" in h}
        candidate_pool = self.item_bank.get_all_questions()

        best_question = None
        best_score = -9999.0
        best_reason = "Không tìm thấy câu hỏi phù hợp."

        for q in candidate_pool:
            if q.item_id in excluded_ids:
                continue

            # 1. Ràng buộc đồ thị tri thức: Nếu kỹ năng tiên quyết chưa vững -> hạ điểm ưu tiên
            prereq_satisfied, weak_prereq = self.knowledge_graph.is_prerequisite_satisfied(
                q.skill, skill_mastery, threshold=0.45
            )
            prereq_penalty = 1.0 if prereq_satisfied else 0.1

            # 2. Thành phần IRT: Khoảng cách giữa năng lực theta và độ khó b
            diff_distance = abs(q.b - theta)
            irt_score = 1.0 / (1.0 + diff_distance)

            # 3. Thành phần Mastery: Ưu tiên củng cố kỹ năng có độ thành thạo yếu
            skill_mastery_val = skill_mastery.get(q.skill, 0.5)
            mastery_score = 1.0 - skill_mastery_val

            # Tính toán điểm tổng hợp (Deterministic Scoring Function)
            w_irt = 0.5
            w_mastery = 0.5
            total_score = (w_irt * irt_score + w_mastery * mastery_score) * prereq_penalty

            if total_score > best_score:
                best_score = total_score
                best_question = q

                # Tạo lý do giải thích thuật toán rõ ràng (Explainable Recommendation)
                if not prereq_satisfied:
                    best_reason = (
                        f"Đề xuất củng cố kỹ năng tiên quyết '{weak_prereq}' "
                        f"(Mastery: {_pct(skill_mastery.get(weak_prereq, 0.5))}%) "
                        f"trước khi học '{q.skill}'."
                    )
                elif skill_mastery_val < 0.55:
                    best_reason = (
                        f"Chọn câu '{q.skill}' vì độ thành thạo còn thấp "
                        f"({_pct(skill_mastery_val)}%). "
                        f"Độ khó: b={q.b:.2f}, năng lực hiện tại: θ={theta:.2f}."
                    )
                else:
                    best_reason = (
                        f"Chọn câu vừa sức (b={q.b:.2f}, θ={theta:.2f}) "
                        f"để đo lường chính xác năng lực kỹ năng '{q.skill}'."
                    )

        return best_question, best_reason


def _pct(val: float) -> int:
    """Chuyển giá trị float [0,1] sang phần trăm nguyên."""
    return max(0, min(100, int(round(val * 100))))

# Alias tương thích ngược
Math_round_pct = _pct


# =====================================================================
# BỘ CHẨN ĐOÁN LỖ HỔNG KIẾN THỨC (DIAGNOSTIC ENGINE)
# =====================================================================

class DiagnosticEngine:
    @staticmethod
    def diagnose_error(
        question: IRTQuestion,
        user_response: str,
        skill_mastery: Dict[str, float]
    ) -> Dict[str, Any]:
        """
        Chẩn đoán chi tiết lỗi sai khi học sinh trả lời không đúng.
        """
        # Xác định nhóm lỗi tự động (Rule-Based Classification)
        error_category = "GRAMMAR_STRUCTURE"
        if question.skill in ["Vocabulary", "Collocations"]:
            error_category = "VOCABULARY_GAP"
        elif question.skill in ["Pronunciation", "Stress"]:
            error_category = "PHONOLOGY_ERROR"
        elif question.skill == "Tenses":
            error_category = "TENSE_CONFUSION"

        # Tính toán mức độ tin cậy của chẩn đoán
        mastery = skill_mastery.get(question.skill, 0.5)
        # Mastery thấp + sai -> chẩn đoán chính xác cao (0.90)
        # Mastery cao + sai -> có thể là sơ suất, tin cậy thấp hơn (0.55)
        confidence = 0.95 - (mastery * 0.4)  # dao động từ 0.55 đến 0.95

        return {
            "skill": question.skill,
            "error_category": error_category,
            "confidence_score": round(confidence, 2),
            "relevance": (
                f"Học sinh gặp khó khăn với '{question.skill}'. "
                f"Độ thành thạo hiện tại: {_pct(mastery)}%."
            )
        }


# =====================================================================
# LEARNING PATH ENGINE (DETERMINISTIC - KHÔNG DÙNG LLM)
# =====================================================================

class LearningPathEngine:
    """
    Sinh kế hoạch học cá nhân hóa hoàn toàn deterministic.
    Dựa trên: Theta, Skill Mastery, Knowledge Graph, History.
    Không sử dụng Gemini hay bất kỳ LLM nào để ra quyết định.
    """

    SKILL_GOALS = {
        "Tenses": {"target_mastery": 0.75, "priority": 1},
        "Passive Voice": {"target_mastery": 0.70, "priority": 2},
        "Conditionals": {"target_mastery": 0.70, "priority": 2},
        "Relative Clauses": {"target_mastery": 0.65, "priority": 3},
        "Reported Speech": {"target_mastery": 0.65, "priority": 3},
        "Vocabulary": {"target_mastery": 0.70, "priority": 2},
        "Collocations": {"target_mastery": 0.60, "priority": 4},
        "Pronunciation": {"target_mastery": 0.65, "priority": 3},
        "Stress": {"target_mastery": 0.60, "priority": 4},
    }

    @staticmethod
    def generate_daily_plan(
        theta: float,
        skill_mastery: Dict[str, float],
        knowledge_graph: KnowledgeGraph,
        item_bank: ItemBank,
        history: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Tạo kế hoạch học trong ngày gồm 2–4 chủ đề ưu tiên.
        Mỗi chủ đề bao gồm: skill, reason, target_questions, est_minutes, current_mastery, goal_mastery.
        """
        plan = []
        done_ids = {h.get("itemId", "") for h in history}

        # Sắp xếp kỹ năng theo mức độ ưu tiên học
        skill_scores = []
        for skill, meta in LearningPathEngine.SKILL_GOALS.items():
            current = skill_mastery.get(skill, 0.5)
            gap = max(0.0, meta["target_mastery"] - current)

            # Kiểm tra prerequisite: nếu tiên quyết chưa vững thì ưu tiên tiên quyết trước
            prereq_ok, weak_prereq = knowledge_graph.is_prerequisite_satisfied(
                skill, skill_mastery, threshold=0.45
            )

            # Score ưu tiên: gap lớn + priority cao + tiên quyết đã đủ
            priority_weight = 1.0 / meta["priority"]
            prereq_boost = 1.5 if not prereq_ok and skill in [p for prereqs in knowledge_graph.dependencies.values() for p in prereqs] else 1.0
            score = gap * priority_weight * prereq_boost

            # Kiểm tra còn câu hỏi chưa làm trong bank không
            available = [
                q for q in item_bank.get_all_questions()
                if q.skill == skill and q.item_id not in done_ids
            ]

            if gap > 0.02 and len(available) > 0:
                skill_scores.append({
                    "skill": skill,
                    "score": score,
                    "current_mastery": current,
                    "goal_mastery": meta["target_mastery"],
                    "gap": gap,
                    "available_questions": len(available),
                    "prereq_ok": prereq_ok,
                    "weak_prereq": weak_prereq
                })

        # Sắp xếp theo score giảm dần
        skill_scores.sort(key=lambda x: x["score"], reverse=True)

        # Lấy top 3 kỹ năng cần học nhất
        for item in skill_scores[:3]:
            skill = item["skill"]
            current = item["current_mastery"]
            gap = item["gap"]
            
            # Số câu hỏi đề xuất dựa trên gap
            if gap > 0.25:
                num_questions = 6
            elif gap > 0.10:
                num_questions = 4
            else:
                num_questions = 2
            
            num_questions = min(num_questions, item["available_questions"])
            est_minutes = num_questions * 2  # ~2 phút/câu

            # Xây dựng lý do bằng dữ liệu thực
            if not item["prereq_ok"]:
                reason = (
                    f"Kỹ năng '{item['weak_prereq']}' (tiên quyết của '{skill}') "
                    f"chỉ đạt {_pct(skill_mastery.get(item['weak_prereq'], 0.5))}% — "
                    f"cần củng cố trước."
                )
            else:
                reason = (
                    f"Bạn đang đạt {_pct(current)}% thành thạo '{skill}', "
                    f"cần đạt {_pct(item['goal_mastery'])}% để sẵn sàng thi. "
                    f"Còn {item['available_questions']} câu hỏi chưa làm."
                )

            plan.append({
                "skill": skill,
                "reason": reason,
                "target_questions": num_questions,
                "est_minutes": est_minutes,
                "current_mastery_pct": _pct(current),
                "goal_mastery_pct": _pct(item["goal_mastery"]),
                "gap_pct": _pct(gap),
                "available_questions": item["available_questions"]
            })

        return plan


# =====================================================================
# THUẬT TOÁN 2: LẶP LẠI NGẮT QUÃNG TRỪU TƯỢNG (SPACED REPETITION ENGINE)
# =====================================================================

class SpacedRepetitionEngine:
    """Tương thích ngược: Duy trì giao diện gọi tĩnh."""
    @staticmethod
    def calculate_next_review(
        quality: int, 
        current_repetition: int, 
        current_ef: float, 
        current_interval: int
    ) -> Tuple[int, float, int]:
        # Mặc định sử dụng SM-2
        return SM2Engine.calculate(quality, current_repetition, current_ef, current_interval)


class SM2Engine:
    @staticmethod
    def calculate(
        quality: int, 
        repetition: int, 
        ef: float, 
        interval: int
    ) -> Tuple[int, float, int]:
        """
        Thuật toán SM-2 chuẩn.
        quality: 0-5 (0=hoàn toàn quên, 5=nhớ hoàn hảo)
        Trả về: (interval_ngày_tiếp, ef_mới, repetition_mới)
        """
        # BUG-08 FIX: Nếu chất lượng < 3, reset (dựa trên repetition cũ, KHÔNG phải mới)
        if quality < 3:
            # Reset về đầu nhưng giữ EF
            new_ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
            new_ef = max(1.3, new_ef)
            return 1, new_ef, 0

        # Cập nhật EF trước khi tính interval
        new_ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        new_ef = max(1.3, new_ef)

        new_repetition = repetition + 1

        # BUG-08 FIX: Dùng repetition CŨ (trước khi +1) để quyết định interval
        if repetition == 0:
            new_interval = 1
        elif repetition == 1:
            new_interval = 6
        else:
            new_interval = int(math.ceil(interval * new_ef))

        return new_interval, new_ef, new_repetition


class FSRSEngine:
    """
    Thuật toán FSRS (Free Spaced Repetition Scheduler) thế hệ mới.
    Dựa trên mô hình 3 thành phần trí nhớ: Retrievability (R), Stability (S), Difficulty (D).
    """
    @staticmethod
    def calculate(
        quality: int,         # Điểm phản hồi từ 0-5
        stability: float,     # Độ bền vững S
        difficulty: float,    # Độ khó D (từ 1.0 đến 10.0)
        days_since_last: int  # Số ngày trôi qua từ lần cuối ôn tập
    ) -> Tuple[int, float, float]:  # (interval_ngày, S_mới, D_mới)

        # Clamp stability đầu vào để tránh overflow trong exp()
        stability = max(0.1, min(3650.0, stability))
        difficulty = max(1.0, min(10.0, difficulty))

        # Chuyển chất lượng 0-5 về thang FSRS (1=Again, 2=Hard, 3=Good, 4=Easy)
        if quality < 2:
            rating = 1  # Again
        elif quality == 2:
            rating = 2  # Hard
        elif quality <= 4:
            rating = 3  # Good
        else:
            rating = 4  # Easy

        # 1. Hiệu chỉnh tham số độ khó D
        new_difficulty = difficulty + (rating - 3) * 0.5
        new_difficulty = max(1.0, min(10.0, new_difficulty))

        # 2. Tính xác suất ghi nhớ hiện tại R
        r = math.pow(1.0 + (days_since_last / (9.0 * stability)), -0.5)

        # 3. Cập nhật độ bền vững S
        if rating == 1:
            # Trả lời sai: Giảm mạnh S
            new_stability = max(0.2, 0.15 * stability)
        else:
            # BUG-09 FIX: Cap exponent để tránh overflow khi stability lớn
            capped_exp_s = min(20.0, 0.05 * stability)
            factor = 1.0 + 0.6 * math.pow(new_difficulty, -0.4) * math.exp(capped_exp_s) * (math.exp(0.2 * (1.0 - r)) - 1.0)
            new_stability = stability * factor
            new_stability = max(0.5, min(3650.0, new_stability))

        # 4. Tính chu kỳ ôn tập tiếp theo (nhắm R = 0.90)
        # Công thức: t = 9 * S * (R_target^(-2) - 1), R_target = 0.90
        next_interval = int(math.ceil(9.0 * new_stability * (math.pow(0.90, -2) - 1.0)))
        next_interval = max(1, min(365, next_interval))

        return next_interval, round(new_stability, 4), round(new_difficulty, 4)


# =====================================================================
# NHẬT KÝ THỰC NGHIỆM VÀ QUẢN LÝ THỬ NGHIỆM LÂM SÀNG
# =====================================================================

class ResearchLogger:
    def __init__(self, log_file: Optional[str] = None):
        if log_file is None:
            log_file = os.path.join(os.path.dirname(__file__), "research_experiment_logs.jsonl")
        self.log_file = log_file

    def log_session(self, log_entry: Dict[str, Any]):
        """Lưu trữ dữ liệu phản hồi học tập dưới dạng JSON Lines phục vụ nghiên cứu."""
        try:
            entry = {
                "student_id": log_entry.get("student_id", "anonymous_student"),
                "experiment_group": log_entry.get("experiment_group", "ADAPTIVE"),
                "repetition_engine": log_entry.get("repetition_engine", "SM2"),
                "question_id": log_entry["question_id"],
                "skill": log_entry["skill"],
                "correct": int(log_entry["correct"]),
                "response_time_ms": log_entry.get("response_time_ms", 0),
                "theta_before": round(float(log_entry["theta_before"]), 4),
                "theta_after": round(float(log_entry["theta_after"]), 4),
                "mastery_before": log_entry.get("mastery_before", {}),
                "mastery_after": log_entry.get("mastery_after", {}),
                "recommendation_reason": log_entry.get("recommendation_reason", ""),
                "timestamp": int(time.time())
            }
            with open(self.log_file, "a", encoding="utf-8") as f:
                f.write(json.dumps(entry, ensure_ascii=False) + "\n")
        except Exception as e:
            print(f"Lỗi lưu trữ nhật ký nghiên cứu: {e}")

    def read_all_logs(self) -> List[Dict[str, Any]]:
        """Đọc toàn bộ nhật ký nghiên cứu (dùng cho Teacher View)."""
        logs = []
        if not os.path.exists(self.log_file):
            return logs
        try:
            with open(self.log_file, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line:
                        logs.append(json.loads(line))
        except Exception as e:
            print(f"Lỗi đọc nhật ký nghiên cứu: {e}")
        return logs
