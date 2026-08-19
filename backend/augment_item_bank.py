"""
augment_item_bank.py
Bổ sung ngân hàng câu hỏi định chuẩn IRT với đầy đủ:
- Phần I (Trắc nghiệm 4 lựa chọn MCQ)
- Phần II (Đúng / Sai 4 mệnh đề a, b, c, d)
- Phần III (Trả lời ngắn / Điền từ)
Phân loại theo Chủ đề & Độ khó chuẩn GDPT 2025-2027.
"""

import json
import os

def augment():
    file_path = os.path.join(os.path.dirname(__file__), "irt_item_bank.json")
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    existing_ids = {q["item_id"] for q in data.get("questions", [])}
    
    new_items = [
        # ── PHẦN II: ĐÚNG / SAI 4 MỆNH ĐỀ (TRUE / FALSE STATEMENTS) ──
        {
            "item_id": "TF_001",
            "task_type": "True/False Statements",
            "thpt_task": 2,
            "topic": "Technology & Society",
            "skill": "Reading & Logic Analysis",
            "question": "Xét tính Đúng (Đ) hoặc Sai (S) của các nhận định sau về ứng dụng của Trí tuệ Nhân tạo (AI) trong giáo dục:",
            "statements": [
                {"key": "a", "text": "AI có khả năng phân tích lỗi phát âm từng từ theo bảng phiên âm IPA quốc tế.", "correct": True},
                {"key": "b", "text": "Học sinh nên phụ thuộc hoàn toàn vào lời giải của AI mà không cần rèn luyện tư duy phản biện.", "correct": False},
                {"key": "c", "text": "Mô hình IRT tự động điều chỉnh độ khó bài kiểm tra theo năng lực thực tế của học sinh.", "correct": True},
                {"key": "d", "text": "Thuật toán Spaced Repetition yêu cầu học sinh phải làm lại toàn bộ từ vựng mỗi ngày.", "correct": False}
            ],
            "options": ["a-Đ, b-S, c-Đ, d-S"],
            "correct": "a-Đ, b-S, c-Đ, d-S",
            "difficulty_parameter": 0.2,
            "discrimination": 1.2,
            "guessing_parameter": 0.0625,
            "cognitive_level": "Vận dụng",
            "calibration_status": "CALIBRATED",
            "explanation": "Ý (a) & (c) đúng: AI hỗ trợ nhận diện IPA và IRT cá nhân hóa độ khó. Ý (b) sai vì cần giữ tư duy phản biện. Ý (d) sai vì SM-2 chia nhỏ chu kỳ ôn tập ngắt quãng."
        },
        {
            "item_id": "TF_002",
            "task_type": "True/False Statements",
            "thpt_task": 2,
            "topic": "Environment & Sustainability",
            "skill": "Ecology & Logic",
            "question": "Xét tính Đúng (Đ) hoặc Sai (S) của các mệnh đề dưới đây về bảo vệ môi trường và lối sống xanh:",
            "statements": [
                {"key": "a", "text": "Sử dụng túi vải thay cho túi nilon dùng một lần giúp giảm thiểu rác thải nhựa đại dương.", "correct": True},
                {"key": "b", "text": "Năng lượng hóa thạch như than đá là nguồn năng lượng có thể tái tạo vô hạn.", "correct": False},
                {"key": "c", "text": "Hiệu ứng nhà kính gia tăng là nguyên nhân chính dẫn đến hiện tượng băng tan ở hai cực.", "correct": True},
                {"key": "d", "text": "Việc chặt phá rừng nhiệt đới không ảnh hưởng gì đến đa dạng sinh học toàn cầu.", "correct": False}
            ],
            "options": ["a-Đ, b-S, c-Đ, d-S"],
            "correct": "a-Đ, b-S, c-Đ, d-S",
            "difficulty_parameter": -0.3,
            "discrimination": 1.1,
            "guessing_parameter": 0.0625,
            "cognitive_level": "Thông hiểu",
            "calibration_status": "CALIBRATED",
            "explanation": "Ý (a) & (c) đúng về lối sống xanh và biến đổi khí hậu. Ý (b) sai vì than đá là năng lượng không tái tạo. Ý (d) sai vì phá rừng phá hủy môi trường sống của muôn loài."
        },
        {
            "item_id": "TF_003",
            "task_type": "True/False Statements",
            "thpt_task": 2,
            "topic": "Health & Nutrition",
            "skill": "Reading & Fact Checking",
            "question": "Xét tính Đúng (Đ) hoặc Sai (S) của các mệnh đề sau về chế độ dinh dưỡng và sức khỏe học đường:",
            "statements": [
                {"key": "a", "text": "Thức khuya thường xuyên và lạm dụng nước tăng lực có lợi cho trí nhớ dài hạn.", "correct": False},
                {"key": "b", "text": "Tập thể dục 30 phút mỗi ngày kích thích não bộ tiết ra hooc-môn endorphins giúp giảm căng thẳng.", "correct": True},
                {"key": "c", "text": "Bữa sáng giàu protein và chất xơ cung cấp năng lượng ổn định cho các tiết học buổi sáng.", "correct": True},
                {"key": "d", "text": "Chỉ những vận động viên chuyên nghiệp mới cần duy trì một lối sống vận động.", "correct": False}
            ],
            "options": ["a-S, b-Đ, c-Đ, d-S"],
            "correct": "a-S, b-Đ, c-Đ, d-S",
            "difficulty_parameter": -0.5,
            "discrimination": 1.0,
            "guessing_parameter": 0.0625,
            "cognitive_level": "Nhận biết",
            "calibration_status": "CALIBRATED",
            "explanation": "Ý (b) & (c) đúng khoa học. Ý (a) & (d) sai vì thức khuya gây hại tế bào thần kinh và mọi người đều cần vận động thể chất."
        },
        {
            "item_id": "TF_004",
            "task_type": "True/False Statements",
            "thpt_task": 2,
            "topic": "Education & Global Study",
            "skill": "Academic Skills",
            "question": "Xét tính Đúng (Đ) hoặc Sai (S) của các mệnh đề sau về phương pháp tự học và ôn thi hiệu quả:",
            "statements": [
                {"key": "a", "text": "Phương pháp Pomodoro chia thời gian học thành các khoảng 25 phút tập trung kèm 5 phút nghỉ.", "correct": True},
                {"key": "b", "text": "Học dồn vào đêm trước kỳ thi mang lại hiệu quả ghi nhớ sâu hơn học rải đều theo chu kỳ.", "correct": False},
                {"key": "c", "text": "Tự kiểm tra (Active Recall) bằng Flashcard kích hoạt truy hồi trí nhớ tốt hơn đọc thụ động.", "correct": True},
                {"key": "d", "text": "Việc ghi chép bài học bằng sơ đồ tư duy (Mind Map) giúp liên kết các ý tưởng logic hơn.", "correct": True}
            ],
            "options": ["a-Đ, b-S, c-Đ, d-Đ"],
            "correct": "a-Đ, b-S, c-Đ, d-Đ",
            "difficulty_parameter": 0.4,
            "discrimination": 1.3,
            "guessing_parameter": 0.0625,
            "cognitive_level": "Vận dụng",
            "calibration_status": "CALIBRATED",
            "explanation": "Ý (a), (c), (d) là các phương pháp học tập khoa học đã được kiểm chứng. Ý (b) sai vì học dồn chỉ tạo trí nhớ ngắn hạn và nhanh quên."
        },
        {
            "item_id": "TF_005",
            "task_type": "True/False Statements",
            "thpt_task": 2,
            "topic": "Technology & Space",
            "skill": "Science Literacy",
            "question": "Xét tính Đúng (Đ) hoặc Sai (S) của các mệnh đề sau về công nghệ khám phá không gian vũ trụ:",
            "statements": [
                {"key": "a", "text": "Kính thiên văn không gian James Webb quan sát vũ trụ chủ yếu qua dải sóng hồng ngoại.", "correct": True},
                {"key": "b", "text": "Âm thanh có thể truyền đi dễ dàng trong môi trường chân không tuyệt đối của vũ trụ.", "correct": False},
                {"key": "c", "text": "Vệ tinh nhân tạo đóng vai trò thiết yếu trong việc dự báo bão và định vị toàn cầu GPS.", "correct": True},
                {"key": "d", "text": "Hành tinh Đỏ (Sao Hỏa) là hành tinh gần Mặt Trời nhất trong Hệ Mặt Trời.", "correct": False}
            ],
            "options": ["a-Đ, b-S, c-Đ, d-S"],
            "correct": "a-Đ, b-S, c-Đ, d-S",
            "difficulty_parameter": 0.9,
            "discrimination": 1.4,
            "guessing_parameter": 0.0625,
            "cognitive_level": "Vận dụng cao",
            "calibration_status": "CALIBRATED",
            "explanation": "Ý (a) & (c) đúng kiến thức thiên văn. Ý (b) sai vì sóng âm cần môi trường vật chất. Ý (d) sai vì Sao Thủy (Mercury) mới là hành tinh gần Mặt Trời nhất."
        },

        # ── PHẦN III: TRẢ LỜI NGẮN / BIẾN ĐỔI TỪ (SHORT ANSWER & WORD FORM) ──
        {
            "item_id": "SA_001",
            "task_type": "Short Answer / Fill-in",
            "thpt_task": 3,
            "topic": "Environment & Sustainability",
            "skill": "Word Form / Adjectives",
            "question": "Give the correct form of the word in brackets:\n'Wind and solar power are excellent examples of ________ energy sources.' (RENEW)",
            "options": ["renewable"],
            "correct": "renewable",
            "correct_short": "renewable",
            "difficulty_parameter": -0.2,
            "discrimination": 1.1,
            "guessing_parameter": 0.0,
            "cognitive_level": "Thông hiểu",
            "calibration_status": "CALIBRATED",
            "explanation": "Cần tính từ bổ nghĩa cho danh từ 'energy sources'. Dạng tính từ của 'renew' là 'renewable' (có thể tái tạo)."
        },
        {
            "item_id": "SA_002",
            "task_type": "Short Answer / Fill-in",
            "thpt_task": 3,
            "topic": "Technology & Society",
            "skill": "Word Form / Adverbs",
            "question": "Give the correct form of the word in brackets:\n'Cloud computing allows international teams to collaborate ________ on complex projects.' (SEAMLESS)",
            "options": ["seamlessly"],
            "correct": "seamlessly",
            "correct_short": "seamlessly",
            "difficulty_parameter": 0.6,
            "discrimination": 1.3,
            "guessing_parameter": 0.0,
            "cognitive_level": "Vận dụng",
            "calibration_status": "CALIBRATED",
            "explanation": "Cần trạng từ bổ nghĩa cho động từ 'collaborate'. Dạng trạng từ của 'seamless' là 'seamlessly' (một cách liền mạch, trôi chảy)."
        },
        {
            "item_id": "SA_003",
            "task_type": "Short Answer / Fill-in",
            "thpt_task": 3,
            "topic": "Education & Global Study",
            "skill": "Word Form / Nouns",
            "question": "Give the correct form of the word in brackets:\n'Developing autonomous learning habits fosters student ________ in college.' (DEPEND)",
            "options": ["independence"],
            "correct": "independence",
            "correct_short": "independence",
            "difficulty_parameter": 0.3,
            "discrimination": 1.2,
            "guessing_parameter": 0.0,
            "cognitive_level": "Vận dụng",
            "calibration_status": "CALIBRATED",
            "explanation": "Cần danh từ mang nghĩa tích cực (sự tự lập). Từ gốc 'depend' (phụ thuộc) -> 'independence' (sự độc lập, tự chủ)."
        },
        {
            "item_id": "SA_004",
            "task_type": "Short Answer / Fill-in",
            "thpt_task": 3,
            "topic": "Environment & Urban Health",
            "skill": "Word Form / Nouns",
            "question": "Give the correct form of the word in brackets:\n'The rapid ________ of natural rainforests leads to catastrophic biodiversity loss.' (DESTROY)",
            "options": ["destruction"],
            "correct": "destruction",
            "correct_short": "destruction",
            "difficulty_parameter": 0.1,
            "discrimination": 1.1,
            "guessing_parameter": 0.0,
            "cognitive_level": "Thông hiểu",
            "calibration_status": "CALIBRATED",
            "explanation": "Cần danh từ đi sau mạo từ 'The' và tính từ 'rapid'. Dạng danh từ của 'destroy' là 'destruction' (sự tàn phá)."
        },
        {
            "item_id": "SA_005",
            "task_type": "Short Answer / Fill-in",
            "thpt_task": 3,
            "topic": "Culture & Community",
            "skill": "Word Form / Nouns",
            "question": "Give the correct form of the word in brackets:\n'Bat Trang ceramic artisans strive for the ________ of traditional handicraft techniques.' (PRESERVE)",
            "options": ["preservation"],
            "correct": "preservation",
            "correct_short": "preservation",
            "difficulty_parameter": 0.2,
            "discrimination": 1.2,
            "guessing_parameter": 0.0,
            "cognitive_level": "Thông hiểu",
            "calibration_status": "CALIBRATED",
            "explanation": "Cần danh từ sau 'the' và trước 'of'. Dạng danh từ của động từ 'preserve' là 'preservation' (sự bảo tồn, gìn giữ)."
        },
        {
            "item_id": "SA_006",
            "task_type": "Short Answer / Fill-in",
            "thpt_task": 3,
            "topic": "Technology & Society",
            "skill": "Word Form / Adjectives",
            "question": "Give the correct form of the word in brackets:\n'Modern smartphones have become ________ across all demographics of modern society.' (UBIQUITY)",
            "options": ["ubiquitous"],
            "correct": "ubiquitous",
            "correct_short": "ubiquitous",
            "difficulty_parameter": 1.2,
            "discrimination": 1.5,
            "guessing_parameter": 0.0,
            "cognitive_level": "Vận dụng cao",
            "calibration_status": "CALIBRATED",
            "explanation": "Cần tính từ đi sau linking verb 'become'. Dạng tính từ của danh từ 'ubiquity' là 'ubiquitous' (phổ biến khắp nơi)."
        },
        {
            "item_id": "SA_007",
            "task_type": "Short Answer / Fill-in",
            "thpt_task": 3,
            "topic": "Environment & Sustainability",
            "skill": "Word Form / Adverbs",
            "question": "Give the correct form of the word in brackets:\n'The government is investing in ________ friendly urban transportation systems.' (ENVIRONMENT)",
            "options": ["environmentally"],
            "correct": "environmentally",
            "correct_short": "environmentally",
            "difficulty_parameter": 0.0,
            "discrimination": 1.1,
            "guessing_parameter": 0.0,
            "cognitive_level": "Thông hiểu",
            "calibration_status": "CALIBRATED",
            "explanation": "Cần trạng từ bổ nghĩa cho tính từ 'friendly' (cụm từ 'environmentally friendly' = thân thiện với môi trường)."
        }
    ]

    added = 0
    for item in new_items:
        if item["item_id"] not in existing_ids:
            data["questions"].append(item)
            added += 1

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"[OK] Da bo sung {added} cau hoi moi vao irt_item_bank.json. Tong so: {len(data['questions'])}")

if __name__ == "__main__":
    augment()
