import json
import os

items = []

# ==========================================
# TASK TYPE 1: NOTICE FILL-IN (NOTC) - 8 items
# ==========================================

notice_1_text = """STUDY SKILLS WORKSHOP 2025

The Academic Support Centre is pleased to (1)___ a two-day Study Skills Workshop to be held on Saturday, 15th March and Sunday, 16th March from 9:00 a.m. to 4:00 p.m. in Room 201, Building B.

Topics covered:
• Effective note-taking strategies
• Time management techniques
• Exam preparation methods
• Memory improvement tips

Registration is (2)___. Please complete the online form at www.school.edu.vn/workshop by Friday, 13th March. Places are limited to 30 participants.

For more information, please contact Ms. Nguyen Lan at nguyenlan@school.edu.vn. Participants must bring their own stationery."""

items.append({
    "item_id": "NOTC_001",
    "task_type": "Notice Fill-in",
    "thpt_task": 1,
    "passage_id": "NOTC_P01",
    "passage": notice_1_text,
    "question": "[NOTC_P01 - Câu (1)] ...is pleased to ___ a two-day Study Skills Workshop...",
    "option_a": "announce",
    "option_b": "advertisement",
    "option_c": "announcement",
    "option_d": "advertising",
    "options": ["A. announce", "B. advertisement", "C. announcement", "D. advertising"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Cấu trúc 'is pleased to + V-bare' (rất hân hạnh được thông báo). 'Announce' là động từ nguyên mẫu phù hợp nhất. 'Advertisement' và 'announcement' là danh từ; 'advertising' là V-ing.",
    "topic": "School Events",
    "skill": "Word Form & Collocation",
    "question_type": "Notice Fill-in",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 1 — Đọc điền thông báo",
    "source": "Biên soạn từ nhiều tài liệu tham khảo (Đề minh họa Bộ GD&ĐT 2025; Đề thi thử THPT các Sở)",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.5,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "NOTC_002",
    "task_type": "Notice Fill-in",
    "thpt_task": 1,
    "passage_id": "NOTC_P01",
    "passage": notice_1_text,
    "question": "[NOTC_P01 - Câu (2)] Registration is ___.",
    "option_a": "requiring",
    "option_b": "required",
    "option_c": "requirement",
    "option_d": "require",
    "options": ["A. requiring", "B. required", "C. requirement", "D. require"],
    "correct_answer": "B",
    "correct": "B",
    "explanation": "Cấu trúc bị động 'be + V3/P2' (Registration is required = Việc đăng ký là bắt buộc). 'Requirement' là danh từ, 'requiring' là V-ing, 'require' là động từ nguyên mẫu.",
    "topic": "School Events",
    "skill": "Passive Voice / Word Form",
    "question_type": "Notice Fill-in",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 1 — Đọc điền thông báo",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.6,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "NOTC_003",
    "task_type": "Notice Fill-in",
    "thpt_task": 1,
    "passage_id": "NOTC_P01",
    "passage": notice_1_text,
    "question": "[NOTC_P01] What is the deadline for workshop registration?",
    "option_a": "15th March",
    "option_b": "16th March",
    "option_c": "13th March",
    "option_d": "9th March",
    "options": ["A. 15th March", "B. 16th March", "C. 13th March", "D. 9th March"],
    "correct_answer": "C",
    "correct": "C",
    "explanation": "Thông báo ghi rõ: 'complete the online form... by Friday, 13th March'. Học sinh đọc lướt chi tiết để tìm ngày hạn đăng ký (13/3) khác với ngày diễn ra sự kiện (15-16/3).",
    "topic": "School Events",
    "skill": "Locating Specific Information",
    "question_type": "Notice Fill-in",
    "cognitive_level": "Nhận biết",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 1 — Đọc điền thông báo",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.8,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "NOTC_004",
    "task_type": "Notice Fill-in",
    "thpt_task": 1,
    "passage_id": "NOTC_P01",
    "passage": notice_1_text,
    "question": "[NOTC_P01] According to the notice, what must participants bring with them?",
    "option_a": "Their own laptops",
    "option_b": "Their own stationery",
    "option_c": "Printed application forms",
    "option_d": "Textbooks for Building B",
    "options": ["A. Their own laptops", "B. Their own stationery", "C. Printed application forms", "D. Textbooks for Building B"],
    "correct_answer": "B",
    "correct": "B",
    "explanation": "Dòng cuối thông báo khẳng định: 'Participants must bring their own stationery.' (Thí sinh phải mang theo đồ dùng học tập cá nhân).",
    "topic": "School Events",
    "skill": "Locating Specific Information",
    "question_type": "Notice Fill-in",
    "cognitive_level": "Nhận biết",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 1 — Đọc điền thông báo",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.7,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

notice_2_text = """COMMUNITY YOUTH ART EXHIBITION

The Youth Cultural Association is proud to host the 2025 Community Youth Art Exhibition (3)___ local high school talent.

• Date: 10th – 12th April 2025
• Location: City Exhibition Centre, Main Gallery
• Admission: Free of charge for all visitors

Young artists aged 15 to 18 are invited to submit original artwork by 25th March. All selected pieces will be displayed and judged by a panel of professional artists.

Please visit www.youthart.org.vn to (4)___ your registration form and read the competition guidelines carefully."""

items.append({
    "item_id": "NOTC_005",
    "task_type": "Notice Fill-in",
    "thpt_task": 1,
    "passage_id": "NOTC_P02",
    "passage": notice_2_text,
    "question": "[NOTC_P02 - Câu (3)] ...Art Exhibition ___ local high school talent.",
    "option_a": "showcasing",
    "option_b": "showcased",
    "option_c": "showcase",
    "option_d": "showcases",
    "options": ["A. showcasing", "B. showcased", "C. showcase", "D. showcases"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Mệnh đề quan hệ rút gọn chủ động: 'Art Exhibition [which showcases]...' -> 'Art Exhibition showcasing...'. Dùng V-ing vì cuộc triển lãm tự thực hiện hành động trưng bày tài năng.",
    "topic": "Culture & Community",
    "skill": "Reduced Relative Clauses",
    "question_type": "Notice Fill-in",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 1 — Đọc điền thông báo",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.1,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "NOTC_006",
    "task_type": "Notice Fill-in",
    "thpt_task": 1,
    "passage_id": "NOTC_P02",
    "passage": notice_2_text,
    "question": "[NOTC_P02 - Câu (4)] ...visit www.youthart.org.vn to ___ your registration form...",
    "option_a": "download",
    "option_b": "downloading",
    "option_c": "downloaded",
    "option_d": "downloads",
    "options": ["A. download", "B. downloading", "C. downloaded", "D. downloads"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Cấu trúc 'to + V-bare' chỉ mục đích (to download = để tải về). 'Downloading', 'downloaded', 'downloads' không hợp ngữ pháp.",
    "topic": "Culture & Community",
    "skill": "Infinitive of Purpose",
    "question_type": "Notice Fill-in",
    "cognitive_level": "Nhận biết",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 1 — Đọc điền thông báo",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.6,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "NOTC_007",
    "task_type": "Notice Fill-in",
    "thpt_task": 1,
    "passage_id": "NOTC_P02",
    "passage": notice_2_text,
    "question": "[NOTC_P02] Who is eligible to submit artwork for the exhibition?",
    "option_a": "Professional artists of any age",
    "option_b": "High school teachers only",
    "option_c": "Young artists aged 15 to 18",
    "option_d": "Primary school students",
    "options": ["A. Professional artists of any age", "B. High school teachers only", "C. Young artists aged 15 to 18", "D. Primary school students"],
    "correct_answer": "C",
    "correct": "C",
    "explanation": "Văn bản ghi rõ: 'Young artists aged 15 to 18 are invited to submit original artwork'.",
    "topic": "Culture & Community",
    "skill": "Locating Specific Information",
    "question_type": "Notice Fill-in",
    "cognitive_level": "Nhận biết",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 1 — Đọc điền thông báo",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.7,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "NOTC_008",
    "task_type": "Notice Fill-in",
    "thpt_task": 1,
    "passage_id": "NOTC_P02",
    "passage": notice_2_text,
    "question": "[NOTC_P02] How much does it cost for visitors to attend the exhibition?",
    "option_a": "50,000 VND",
    "option_b": "Free of charge",
    "option_c": "100,000 VND for students",
    "option_d": "It varies depending on the gallery room",
    "options": ["A. 50,000 VND", "B. Free of charge", "C. 100,000 VND for students", "D. It varies depending on the gallery room"],
    "correct_answer": "B",
    "correct": "B",
    "explanation": "Thông báo ghi: 'Admission: Free of charge for all visitors' (Vào cửa miễn phí cho tất cả khách tham quan).",
    "topic": "Culture & Community",
    "skill": "Locating Specific Information",
    "question_type": "Notice Fill-in",
    "cognitive_level": "Nhận biết",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 1 — Đọc điền thông báo",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.8,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

# ==========================================
# TASK TYPE 2: LEAFLET FILL-IN (LEAF) - 8 items
# ==========================================

leaflet_1_text = """GREEN TEEN ENVIRONMENTAL CLUB — JOIN US TODAY!

Who are we?
We are a student-led organization at Nguyen Khuyen High School (5)___ to promoting environmental sustainability and climate awareness.

Our key activities:
• Weekly recycling drives and waste sorting workshops
• Tree-planting campaigns in local community parks
• Educational talks on renewable energy and plastic (6)___

Why join us?
• Gain valuable leadership and teamwork experience
• Receive an official certificate of community service
• Make a real (7)___ to your local environment

How to apply: Visit our booth during the Club Fair on 20th September, or email us at greenteen@school.edu.vn by 25th September."""

items.append({
    "item_id": "LEAF_001",
    "task_type": "Leaflet Fill-in",
    "thpt_task": 2,
    "passage_id": "LEAF_P01",
    "passage": leaflet_1_text,
    "question": "[LEAF_P01 - Câu (5)] ...a student-led organization ___ to promoting environmental sustainability...",
    "option_a": "dedicated",
    "option_b": "dedicating",
    "option_c": "dedication",
    "option_d": "dedicate",
    "options": ["A. dedicated", "B. dedicating", "C. dedication", "D. dedicate"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Cấu trúc 'dedicated to + V-ing/Noun' (cống hiến/tận tụy với). Rút gọn mệnh đề quan hệ dạng bị động: 'an organization [which is] dedicated to...'. 'Dedicating' là dạng chủ động không hợp nghĩa; 'dedication' là danh từ; 'dedicate' là động từ nguyên mẫu.",
    "topic": "Environment & Community",
    "skill": "Reduced Relative Clauses (Passive)",
    "question_type": "Leaflet Fill-in",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 2 — Đọc điền tờ rơi",
    "source": "Biên soạn từ nhiều tài liệu tham khảo (Đề minh họa Bộ GD&ĐT 2025; Đề thi thử THPT)",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.1,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "LEAF_002",
    "task_type": "Leaflet Fill-in",
    "thpt_task": 2,
    "passage_id": "LEAF_P01",
    "passage": leaflet_1_text,
    "question": "[LEAF_P01 - Câu (6)] ...talks on renewable energy and plastic ___.",
    "option_a": "reduce",
    "option_b": "reduction",
    "option_c": "reducing",
    "option_d": "reducible",
    "options": ["A. reduce", "B. reduction", "C. reducing", "D. reducible"],
    "correct_answer": "B",
    "correct": "B",
    "explanation": "Cần một danh từ để ghép thành cụm danh từ song song với 'renewable energy': 'plastic reduction' (sự cắt giảm rác thải nhựa). 'Reduce' là động từ, 'reducible' là tính từ.",
    "topic": "Environment & Community",
    "skill": "Word Form / Noun Compounds",
    "question_type": "Leaflet Fill-in",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 2 — Đọc điền tờ rơi",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.0,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "LEAF_003",
    "task_type": "Leaflet Fill-in",
    "thpt_task": 2,
    "passage_id": "LEAF_P01",
    "passage": leaflet_1_text,
    "question": "[LEAF_P01 - Câu (7)] Make a real ___ to your local environment.",
    "option_a": "difference",
    "option_b": "different",
    "option_c": "differently",
    "option_d": "differ",
    "options": ["A. difference", "B. different", "C. differently", "D. differ"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Collocation quen thuộc: 'make a difference to' (tạo nên sự thay đổi/khác biệt tích cực). Sau tính từ 'real' cần danh từ 'difference'. 'Different' là tính từ, 'differently' là trạng từ, 'differ' là động từ.",
    "topic": "Environment & Community",
    "skill": "Collocations / Word Form",
    "question_type": "Leaflet Fill-in",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 2 — Đọc điền tờ rơi",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.4,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "LEAF_004",
    "task_type": "Leaflet Fill-in",
    "thpt_task": 2,
    "passage_id": "LEAF_P01",
    "passage": leaflet_1_text,
    "question": "[LEAF_P01] What is one benefit of joining the Green Teen Environmental Club?",
    "option_a": "Free travel tickets to environmental conferences",
    "option_b": "An official certificate of community service",
    "option_c": "A monthly monetary stipend for members",
    "option_d": "Automatic admission to university environmental courses",
    "options": ["A. Free travel tickets to conferences", "B. An official certificate of community service", "C. A monthly monetary stipend", "D. Automatic university admission"],
    "correct_answer": "B",
    "correct": "B",
    "explanation": "Tờ rơi nêu rõ dưới phần 'Why join us?': 'Receive an official certificate of community service'.",
    "topic": "Environment & Community",
    "skill": "Locating Specific Information",
    "question_type": "Leaflet Fill-in",
    "cognitive_level": "Nhận biết",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 2 — Đọc điền tờ rơi",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.7,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

leaflet_2_text = """INTERNATIONAL STUDY ABROAD FAIR 2025

Are you considering pursuing higher education overseas? Do not miss out on the largest international education event of the year!

What to expect:
• Meet representatives from over 50 top universities across the UK, USA, Australia, and Canada
• Attend free seminars on scholarship application (8)___ and visa procedures
• Get one-on-one counseling on personal statement writing

Special feature:
Register before 5th October to receive a free IELTS practice test pack (9)___ 500,000 VND!

Event details:
• Date: Sunday, 12th October 2025 (8:30 a.m. – 4:30 p.m.)
• Venue: Grand Palace Convention Hall, Ho Chi Minh City
• Registration: Free online entry at www.studyabroadfair2025.vn"""

items.append({
    "item_id": "LEAF_005",
    "task_type": "Leaflet Fill-in",
    "thpt_task": 2,
    "passage_id": "LEAF_P02",
    "passage": leaflet_2_text,
    "question": "[LEAF_P02 - Câu (8)] ...seminars on scholarship application ___ and visa procedures.",
    "option_a": "strategies",
    "option_b": "strategically",
    "option_c": "strategic",
    "option_d": "strategist",
    "options": ["A. strategies", "B. strategically", "C. strategic", "D. strategist"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "'Scholarship application strategies' = chiến lược nộp hồ sơ học bổng. Cần danh từ số nhiều 'strategies' để kết hợp với 'scholarship application'. 'Strategic' là tính từ; 'strategically' là trạng từ; 'strategist' là danh từ chỉ người.",
    "topic": "Education & Global Study",
    "skill": "Word Form / Noun Compounds",
    "question_type": "Leaflet Fill-in",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 2 — Đọc điền tờ rơi",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.1,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "LEAF_006",
    "task_type": "Leaflet Fill-in",
    "thpt_task": 2,
    "passage_id": "LEAF_P02",
    "passage": leaflet_2_text,
    "question": "[LEAF_P02 - Câu (9)] ...receive a free IELTS practice test pack ___ 500,000 VND!",
    "option_a": "worth",
    "option_b": "worthy",
    "option_c": "worthwhile",
    "option_d": "worthless",
    "options": ["A. worth", "B. worthy", "C. worthwhile", "D. worthless"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Cấu trúc 'worth + [số tiền]' (trị giá...): 'a test pack worth 500,000 VND'. 'Worthy' = đáng kính/xứng đáng; 'worthwhile' = đáng giá (dành thời gian làm); 'worthless' = không có giá trị.",
    "topic": "Education & Global Study",
    "skill": "Vocabulary in Context / Adjectives",
    "question_type": "Leaflet Fill-in",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 2 — Đọc điền tờ rơi",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.2,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "LEAF_007",
    "task_type": "Leaflet Fill-in",
    "thpt_task": 2,
    "passage_id": "LEAF_P02",
    "passage": leaflet_2_text,
    "question": "[LEAF_P02] What must participants do to get a free IELTS practice test pack?",
    "option_a": "Pay an extra registration fee of 50,000 VND",
    "option_b": "Register before 5th October",
    "option_c": "Submit a full university personal statement",
    "option_d": "Attend all seminars during the event",
    "options": ["A. Pay an extra fee of 50,000 VND", "B. Register before 5th October", "C. Submit a personal statement", "D. Attend all seminars"],
    "correct_answer": "B",
    "correct": "B",
    "explanation": "Tờ rơi viết rõ dưới phần Special feature: 'Register before 5th October to receive a free IELTS practice test pack'.",
    "topic": "Education & Global Study",
    "skill": "Locating Specific Information",
    "question_type": "Leaflet Fill-in",
    "cognitive_level": "Nhận biết",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 2 — Đọc điền tờ rơi",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.6,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "LEAF_008",
    "task_type": "Leaflet Fill-in",
    "thpt_task": 2,
    "passage_id": "LEAF_P02",
    "passage": leaflet_2_text,
    "question": "[LEAF_P02] How can interested students enter the fair?",
    "option_a": "By buying tickets at the entrance door on the event day",
    "option_b": "By completing free online entry registration",
    "option_c": "By presenting a valid TOEFL certificate",
    "option_d": "By getting a written recommendation from their principal",
    "options": ["A. Buying tickets at the door", "B. Completing free online entry registration", "C. Presenting a TOEFL certificate", "D. Getting a principal's recommendation"],
    "correct_answer": "B",
    "correct": "B",
    "explanation": "Dòng cuối ghi: 'Registration: Free online entry at www.studyabroadfair2025.vn'.",
    "topic": "Education & Global Study",
    "skill": "Locating Specific Information",
    "question_type": "Leaflet Fill-in",
    "cognitive_level": "Nhận biết",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 2 — Đọc điền tờ rơi",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.7,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

# ==========================================
# TASK TYPE 3: ARRANGEMENT (ARNG) - 8 items
# ==========================================

items.append({
    "item_id": "ARNG_001",
    "task_type": "Sentence Arrangement",
    "thpt_task": 3,
    "passage_id": "ARNG_P01",
    "passage": "",
    "question": """Sắp xếp các câu sau (a–e) để tạo thành một đoạn văn lập luận hoàn chỉnh và mạch lạc:
(a) Therefore, it is essential that students learn to use digital tools as learning aids rather than allowing them to become sources of constant distraction.
(b) On the other hand, excessive smartphone use during study sessions can significantly reduce concentration and academic performance.
(c) Many high school students today rely heavily on technology for various aspects of their daily learning.
(d) On balance, a disciplined and mindful approach to technology is key to maximizing its educational benefits.
(e) For instance, educational applications provide instant access to reference materials, interactive practice, and real-time feedback.""",
    "option_a": "c – e – b – a – d",
    "option_b": "e – c – b – a – d",
    "option_c": "c – b – e – a – d",
    "option_d": "c – e – a – b – d",
    "options": ["A. c – e – b – a – d", "B. e – c – b – a – d", "C. c – b – e – a – d", "D. c – e – a – b – d"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Trình tự mạch lạc: (c) Mở đầu nêu thực trạng -> (e) Ví dụ minh họa mặt tích cực ('For instance') -> (b) Trình bày mặt trái ngược ('On the other hand') -> (a) Nêu giải pháp ('Therefore') -> (d) Kết luận tổng quan ('On balance').",
    "topic": "Technology & Education",
    "skill": "Paragraph Arrangement / Cohesive Devices",
    "question_type": "Sentence Arrangement",
    "cognitive_level": "Vận dụng",
    "difficulty_level": "Hard",
    "thpt_section": "Dạng bài 3 — Sắp xếp đoạn văn / hội thoại / lá thư",
    "source": "Biên soạn từ nhiều tài liệu tham khảo (Đề minh họa Bộ GD&ĐT 2025)",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 1.1,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "ARNG_002",
    "task_type": "Sentence Arrangement",
    "thpt_task": 3,
    "passage_id": "ARNG_P02",
    "passage": "",
    "question": """Sắp xếp các câu thoại (a–d) để tạo thành một cuộc hội thoại giao tiếp tự nhiên tại thư viện:
(a) Librarian: Of course! Our digital database includes Cambridge Practice Tests and online academic journals.
(b) Student: That sounds very helpful! How can I access them from home?
(c) Student: Excuse me, I heard the library has launched some new digital resources. Could you tell me more about them?
(d) Librarian: You just need to log in with your student ID and library password at our school portal.""",
    "option_a": "c – a – b – d",
    "option_b": "a – c – b – d",
    "option_c": "c – b – a – d",
    "option_d": "c – a – d – b",
    "options": ["A. c – a – b – d", "B. a – c – b – d", "C. c – b – a – d", "D. c – a – d – b"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Mạch hội thoại chuẩn: (c) Học sinh đặt câu hỏi mở đầu -> (a) Thủ thư giới thiệu các nguồn tài liệu -> (b) Học sinh hỏi tiếp về cách truy cập từ nhà -> (d) Thủ thư hướng dẫn chi tiết.",
    "topic": "School Life",
    "skill": "Dialogue Arrangement",
    "question_type": "Sentence Arrangement",
    "cognitive_level": "Vận dụng",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 3 — Sắp xếp đoạn văn / hội thoại / lá thư",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.5,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "ARNG_003",
    "task_type": "Sentence Arrangement",
    "thpt_task": 3,
    "passage_id": "ARNG_P03",
    "passage": "",
    "question": """Sắp xếp các câu (a–e) để tạo thành một lá thư điện tử (email) trang trọng gửi thầy cô giáo:
(a) First, I would like to express my gratitude for your inspiring English lessons throughout this academic year.
(b) Dear Mr. Williams,
(c) I am writing to ask if you could kindly give me some advice on selecting suitable preparation books for the upcoming THPT exam.
(d) Thank you very much for your time and guidance, and I look forward to hearing from you soon.
(e) Yours sincerely, Nguyen Van Nam""",
    "option_a": "b – a – c – d – e",
    "option_b": "b – c – a – d – e",
    "option_c": "a – b – c – d – e",
    "option_d": "b – a – d – c – e",
    "options": ["A. b – a – c – d – e", "B. b – c – a – d – e", "C. a – b – c – d – e", "D. b – a – d – c – e"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Cấu trúc email chuẩn: (b) Lời chào -> (a) Lời cảm ơn/mở đầu thân thiện -> (c) Nêu lý do chính viết thư -> (d) Lời cảm ơn kết thư & mong đợi phản hồi -> (e) Lời chào ký tên.",
    "topic": "School Life & Communication",
    "skill": "Letter/Email Arrangement",
    "question_type": "Sentence Arrangement",
    "cognitive_level": "Vận dụng",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 3 — Sắp xếp đoạn văn / hội thoại / lá thư",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.4,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "ARNG_004",
    "task_type": "Sentence Arrangement",
    "thpt_task": 3,
    "passage_id": "ARNG_P04",
    "passage": "",
    "question": """Sắp xếp các câu (a–d) để tạo thành một đoạn văn miêu tả quy trình giải quyết vấn đề rác thải nhựa:
(a) Next, local authorities should enforce strict regulations on single-use plastics in markets and supermarkets.
(b) Plastic pollution has become one of the most pressing environmental challenges in urban areas today.
(c) Finally, public campaigns must be organized to encourage residents to adopt eco-friendly alternatives such as cloth bags.
(d) To address this problem, the first step is to improve waste sorting systems at the household level.""",
    "option_a": "b – d – a – c",
    "option_b": "d – a – c – b",
    "option_c": "b – a – d – c",
    "option_d": "b – d – c – a",
    "options": ["A. b – d – a – c", "B. d – a – c – b", "C. b – a – d – c", "D. b – d – c – a"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Trình tự quy trình: (b) Nêu vấn đề -> (d) Bước đầu tiên ('the first step is...') -> (a) Bước tiếp theo ('Next...') -> (c) Bước cuối cùng ('Finally...'). Các từ nối 'first step', 'Next', 'Finally' định hướng thứ tự rất rõ ràng.",
    "topic": "Environment",
    "skill": "Process Paragraph Arrangement",
    "question_type": "Sentence Arrangement",
    "cognitive_level": "Vận dụng",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 3 — Sắp xếp đoạn văn / hội thoại / lá thư",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.3,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "ARNG_005",
    "task_type": "Sentence Arrangement",
    "thpt_task": 3,
    "passage_id": "ARNG_P05",
    "passage": "",
    "question": """Sắp xếp các câu (a–e) để tạo thành bài phát biểu ngắn chào mừng tân học sinh:
(a) In addition, our dedicated teachers are always ready to support you in both academic and personal growth.
(b) Welcome all new Grade 10 students to Nguyen Hue High School!
(c) In conclusion, work hard, stay curious, and make the most of your high school years.
(d) First of all, our school provides a modern learning environment equipped with state-of-the-art facilities.
(e) We are thrilled to accompany you on this exciting three-year journey.""",
    "option_a": "b – e – d – a – c",
    "option_b": "b – d – a – e – c",
    "option_c": "e – b – d – a – c",
    "option_d": "b – e – a – d – c",
    "options": ["A. b – e – d – a – c", "B. b – d – a – e – c", "C. e – b – d – a – c", "D. b – e – a – d – c"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Thứ tự phát biểu: (b) Lời chào đón -> (e) Bày tỏ niềm vui đồng hành -> (d) Điểm nổi bật 1 ('First of all') -> (a) Điểm bổ sung ('In addition') -> (c) Lời chúc/kết luận ('In conclusion').",
    "topic": "School Life",
    "skill": "Speech Structure Arrangement",
    "question_type": "Sentence Arrangement",
    "cognitive_level": "Vận dụng",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 3 — Sắp xếp đoạn văn / hội thoại / lá thư",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.4,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "ARNG_006",
    "task_type": "Sentence Arrangement",
    "thpt_task": 3,
    "passage_id": "ARNG_P06",
    "passage": "",
    "question": """Sắp xếp các câu (a–d) để tạo thành đoạn văn miêu tả lợi ích của thói quen đọc sách:
(a) Furthermore, studies show that regular reading improves vocabulary acquisition and analytical thinking skills naturally.
(b) Reading books offers numerous benefits for individuals of all ages.
(c) In summary, making reading a daily habit contributes significantly to long-term intellectual growth.
(d) Firstly, it provides an effective way to relieve stress after long hours of study or work.""",
    "option_a": "b – d – a – c",
    "option_b": "d – a – b – c",
    "option_c": "b – a – d – c",
    "option_d": "b – d – c – a",
    "options": ["A. b – d – a – c", "B. d – a – b – c", "C. b – a – d – c", "D. b – d – c – a"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "(b) Câu chủ đề tổng quan -> (d) Ý đầu tiên ('Firstly') -> (a) Ý tiếp theo ('Furthermore') -> (c) Tóm tắt kết luận ('In summary').",
    "topic": "Reading & Lifelong Learning",
    "skill": "Paragraph Arrangement",
    "question_type": "Sentence Arrangement",
    "cognitive_level": "Vận dụng",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 3 — Sắp xếp đoạn văn / hội thoại / lá thư",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.1,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "ARNG_007",
    "task_type": "Sentence Arrangement",
    "thpt_task": 3,
    "passage_id": "ARNG_P07",
    "passage": "",
    "question": """Sắp xếp các câu thoại (a–d) trong một buổi phỏng vấn xin việc bán thời gian:
(a) Candidate: Good morning, sir. I am applying for the part-time library assistant position.
(b) Interviewer: Good morning! Please take a seat. Could you briefly introduce your relevant experience?
(c) Interviewer: That sounds impressive. When would you be available to start?
(d) Candidate: I worked as a volunteer book sorter at my high school library for one year.""",
    "option_a": "a – b – d – c",
    "option_b": "b – a – d – c",
    "option_c": "a – d – b – c",
    "option_d": "a – b – c – d",
    "options": ["A. a – b – d – c", "B. b – a – d – c", "C. a – d – b – c", "D. a – b – c – d"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "(a) Thí sinh chào & nêu vị trí ứng tuyển -> (b) Người phỏng vấn chào & hỏi kinh nghiệm -> (d) Thí sinh trả lời về kinh nghiệm làm tình nguyện viên -> (c) Người phỏng vấn nhận xét & hỏi ngày bắt đầu.",
    "topic": "Work & Career",
    "skill": "Interview Dialogue Arrangement",
    "question_type": "Sentence Arrangement",
    "cognitive_level": "Vận dụng",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 3 — Sắp xếp đoạn văn / hội thoại / lá thư",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.2,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "ARNG_008",
    "task_type": "Sentence Arrangement",
    "thpt_task": 3,
    "passage_id": "ARNG_P08",
    "passage": "",
    "question": """Sắp xếp các câu (a–e) để tạo thành đoạn văn phân tích tầm quan trọng của việc học ngoại ngữ:
(a) As a result, individuals who speak more than one language often enjoy greater career advancement opportunities.
(b) Learning a foreign language opens up numerous personal and professional doors.
(c) In conclusion, multilingualism is an asset that enriches one's life both culturally and economically.
(d) For instance, multinational corporations actively seek candidates who can communicate effectively across cultural boundaries.
(e) Beyond career prospects, it also enhances memory resilience and cognitive flexibility.""",
    "option_a": "b – d – a – e – c",
    "option_b": "b – a – d – e – c",
    "option_c": "d – a – b – e – c",
    "option_d": "b – d – e – a – c",
    "options": ["A. b – d – a – e – c", "B. b – a – d – e – c", "C. d – a – b – e – c", "D. b – d – e – a – c"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "(b) Khái quát lợi ích -> (d) Ví dụ công ty đa quốc gia ('For instance') -> (a) Kết quả 'As a result' -> (e) Mở rộng sang lợi ích trí não ('Beyond career prospects') -> (c) Kết luận chung ('In conclusion').",
    "topic": "Global Education & Languages",
    "skill": "Argumentative Paragraph Arrangement",
    "question_type": "Sentence Arrangement",
    "cognitive_level": "Vận dụng",
    "difficulty_level": "Hard",
    "thpt_section": "Dạng bài 3 — Sắp xếp đoạn văn / hội thoại / lá thư",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 1.0,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

# ==========================================
# TASK TYPE 4: CLOZE TEST (CLOZ) - 10 items
# ==========================================

cloze_1_text = """Social media platforms have (10)___ transformed the way teenagers communicate and share information today. Many young people spend hours daily browsing online feeds, interacting with peers, and consuming digital content. While these platforms offer clear advantages, such as maintaining connections with long-distance friends, experts warn that excessive usage can lead to negative (11)___ on mental health.

Studies show that teenagers who spend over three hours a day on social media are more (12)___ to experience feelings of anxiety and social pressure. One major reason is the tendency to compare (13)___ to idealized online personas. Furthermore, screen exposure late at night can (14)___ sleep patterns, resulting in chronic fatigue during school hours."""

items.append({
    "item_id": "CLOZ_001",
    "task_type": "Cloze",
    "thpt_task": 4,
    "passage_id": "CLOZ_P01",
    "passage": cloze_1_text,
    "question": "[CLOZ_P01 - Câu (10)] Social media platforms have ___ transformed the way teenagers communicate...",
    "option_a": "fundamentally",
    "option_b": "fundamental",
    "option_c": "fundament",
    "option_d": "fundamentality",
    "options": ["A. fundamentally", "B. fundamental", "C. fundament", "D. fundamentality"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Cần một trạng từ 'fundamentally' (về bản chất/cơ bản) để bổ nghĩa cho động từ 'transformed'. 'Fundamental' là tính từ; 'fundament' là danh từ.",
    "topic": "Technology & Society",
    "skill": "Adverbs / Word Form",
    "question_type": "Cloze",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 4 — Đọc điền khuyết thông tin",
    "source": "Biên soạn từ nhiều tài liệu tham khảo (Đề minh họa Bộ GD&ĐT 2025)",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.2,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "CLOZ_002",
    "task_type": "Cloze",
    "thpt_task": 4,
    "passage_id": "CLOZ_P01",
    "passage": cloze_1_text,
    "question": "[CLOZ_P01 - Câu (11)] ...excessive usage can lead to negative ___ on mental health.",
    "option_a": "effects",
    "option_b": "affects",
    "option_c": "effective",
    "option_d": "effectively",
    "options": ["A. effects", "B. affects", "C. effective", "D. effectively"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Cụm danh từ: 'negative effects on' (những tác động tiêu cực tới). 'Effects' là danh từ số nhiều; 'affects' là động từ ngôi thứ 3 số ít (nhầm lẫn phổ biến effect/affect).",
    "topic": "Technology & Society",
    "skill": "Collocations / Commonly Confused Words",
    "question_type": "Cloze",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 4 — Đọc điền khuyết thông tin",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.1,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "CLOZ_003",
    "task_type": "Cloze",
    "thpt_task": 4,
    "passage_id": "CLOZ_P01",
    "passage": cloze_1_text,
    "question": "[CLOZ_P01 - Câu (12)] ...teenagers... are more ___ to experience feelings of anxiety...",
    "option_a": "likely",
    "option_b": "possible",
    "option_c": "probable",
    "option_d": "certainly",
    "options": ["A. likely", "B. possible", "C. probable", "D. certainly"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Cấu trúc: 'be more likely to + V' (có khả năng nhiều hơn là...). 'Possible' và 'probable' không dùng dạng so sánh với 'more ... to V' chỉ người.",
    "topic": "Technology & Society",
    "skill": "Fixed Adjectives / Comparison",
    "question_type": "Cloze",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 4 — Đọc điền khuyết thông tin",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.3,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "CLOZ_004",
    "task_type": "Cloze",
    "thpt_task": 4,
    "passage_id": "CLOZ_P01",
    "passage": cloze_1_text,
    "question": "[CLOZ_P01 - Câu (13)] ...the tendency to compare ___ to idealized online personas.",
    "option_a": "themselves",
    "option_b": "them",
    "option_c": "their",
    "option_d": "oneself",
    "options": ["A. themselves", "B. them", "C. their", "D. oneself"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Đại từ phản thân 'themselves' làm tân ngữ khi chủ ngữ thực hiện hành động là số nhiều 'teenagers' (compare themselves to... = tự so sánh bản thân họ với...).",
    "topic": "Technology & Society",
    "skill": "Reflexive Pronouns",
    "question_type": "Cloze",
    "cognitive_level": "Vận dụng",
    "difficulty_level": "Hard",
    "thpt_section": "Dạng bài 4 — Đọc điền khuyết thông tin",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.8,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "CLOZ_005",
    "task_type": "Cloze",
    "thpt_task": 4,
    "passage_id": "CLOZ_P01",
    "passage": cloze_1_text,
    "question": "[CLOZ_P01 - Câu (14)] ...screen exposure late at night can ___ sleep patterns...",
    "option_a": "disrupt",
    "option_b": "disruption",
    "option_c": "disruptive",
    "option_d": "disruptively",
    "options": ["A. disrupt", "B. disruption", "C. disruptive", "D. disruptively"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Sau động từ khuyết thiếu 'can' cần động từ nguyên mẫu 'disrupt' (gây rối loạn/gián đoạn). 'Disruption' là danh từ, 'disruptive' là tính từ.",
    "topic": "Technology & Society",
    "skill": "Modal Verbs / Word Form",
    "question_type": "Cloze",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 4 — Đọc điền khuyết thông tin",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.2,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

cloze_2_text = """Urban areas worldwide are facing increasing environmental challenges due to rapid population growth and industrialization. To build more sustainable cities, local governments are (15)___ green building standards and expanding public transportation networks.

Replacing fossil-fuel vehicles with electric buses and trams has already shown a (16)___ reduction in urban carbon emissions. (17)___, creating pedestrian zones in city centers encourages walking and improves local air quality. Urban planners emphasize that community (18)___ is essential for the long-term success of these environmental initiatives. When citizens actively participate in recycling programs and energy conservation, cities become cleaner and more (19)___ for future generations."""

items.append({
    "item_id": "CLOZ_006",
    "task_type": "Cloze",
    "thpt_task": 4,
    "passage_id": "CLOZ_P02",
    "passage": cloze_2_text,
    "question": "[CLOZ_P02 - Câu (15)] ...local governments are ___ green building standards...",
    "option_a": "adopting",
    "option_b": "adapting",
    "option_c": "adepting",
    "option_d": "adoptions",
    "options": ["A. adopting", "B. adapting", "C. adepting", "D. adoptions"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "'Adopt standards' = thông qua/áp dụng các tiêu chuẩn. Phân biệt với 'adapt' (thích nghi/sửa đổi cho phù hợp). 'Adoptions' là danh từ.",
    "topic": "Environment & Sustainability",
    "skill": "Commonly Confused Verbs",
    "question_type": "Cloze",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 4 — Đọc điền khuyết thông tin",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.4,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "CLOZ_007",
    "task_type": "Cloze",
    "thpt_task": 4,
    "passage_id": "CLOZ_P02",
    "passage": cloze_2_text,
    "question": "[CLOZ_P02 - Câu (16)] ...shown a ___ reduction in urban carbon emissions.",
    "option_a": "substantial",
    "option_b": "substance",
    "option_c": "substantially",
    "option_d": "substantiate",
    "options": ["A. substantial", "B. substance", "C. substantially", "D. substantiate"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Đứng trước danh từ 'reduction' cần tính từ 'substantial' (đáng kể/lớn). 'Substance' là danh từ, 'substantially' là trạng từ, 'substantiate' là động từ.",
    "topic": "Environment & Sustainability",
    "skill": "Word Form / Adjectives",
    "question_type": "Cloze",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 4 — Đọc điền khuyết thông tin",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.3,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "CLOZ_008",
    "task_type": "Cloze",
    "thpt_task": 4,
    "passage_id": "CLOZ_P02",
    "passage": cloze_2_text,
    "question": "[CLOZ_P02 - Câu (17)] (17)___, creating pedestrian zones in city centers encourages walking...",
    "option_a": "In addition",
    "option_b": "However",
    "option_c": "Therefore",
    "option_d": "In contrast",
    "options": ["A. In addition", "B. However", "C. Therefore", "D. In contrast"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Từ nối bổ sung ý tưởng cùng hướng tích cực: 'In addition' (Thêm vào đó). 'However' và 'In contrast' chỉ sự đối lập; 'Therefore' chỉ kết quả nguyên nhân.",
    "topic": "Environment & Sustainability",
    "skill": "Linking Words",
    "question_type": "Cloze",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 4 — Đọc điền khuyết thông tin",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.1,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "CLOZ_009",
    "task_type": "Cloze",
    "thpt_task": 4,
    "passage_id": "CLOZ_P02",
    "passage": cloze_2_text,
    "question": "[CLOZ_P02 - Câu (18)] ...community ___ is essential for the long-term success...",
    "option_a": "involvement",
    "option_b": "involve",
    "option_c": "involved",
    "option_d": "involvingly",
    "options": ["A. involvement", "B. involve", "C. involved", "D. involvingly"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Cụm danh từ: 'community involvement' (sự tham gia của cộng đồng). 'Involvement' là danh từ phù hợp làm chủ ngữ cho 'is essential'.",
    "topic": "Environment & Sustainability",
    "skill": "Word Form / Noun Compounds",
    "question_type": "Cloze",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 4 — Đọc điền khuyết thông tin",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.2,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "CLOZ_010",
    "task_type": "Cloze",
    "thpt_task": 4,
    "passage_id": "CLOZ_P02",
    "passage": cloze_2_text,
    "question": "[CLOZ_P02 - Câu (19)] ...cities become cleaner and more ___ for future generations.",
    "option_a": "livable",
    "option_b": "live",
    "option_c": "lively",
    "option_d": "aliveness",
    "options": ["A. livable", "B. live", "C. lively", "D. aliveness"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "Tính từ 'livable' (đáng sống) song song với 'cleaner' trong cấu trúc 'become cleaner and more livable'. 'Lively' = sinh động/nhộn nhịp không hợp nghĩa thành phố đáng sống.",
    "topic": "Environment & Sustainability",
    "skill": "Vocabulary in Context / Parallel Adjectives",
    "question_type": "Cloze",
    "cognitive_level": "Vận dụng",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 4 — Đọc điền khuyết thông tin",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.5,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

# ==========================================
# TASK TYPE 5: READING COMPREHENSION (READ) - 16 items
# ==========================================

read_1_text = """THE POWER OF REGULAR READING

In an age dominated by digital screens, the habit of reading physical books is facing new challenges. Yet research consistently shows that regular reading — whether fiction or non-fiction — offers remarkable cognitive and emotional benefits that extend far beyond simple entertainment.

Scientists have found that reading fiction, in particular, strengthens empathy. When readers immerse themselves in a story, they experience the world through the eyes of characters whose lives may be vastly different from their own. This mental exercise develops the capacity to understand and share the feelings of others, a skill that proves invaluable in real-world social interactions.

Reading also has measurable physical benefits for the human brain. Studies using functional neuroimaging have revealed that reading a novel activates parts of the brain associated with actually experiencing the events described. When we read about a character running, for example, the motor cortex — responsible for physical movement — shows increased neural activity. In this sense, reading is an active mental workout rather than a passive leisure activity.

Furthermore, habitual readers tend to possess broader vocabularies and superior analytical skills compared to non-readers. Exposure to varied sentence structures and rich vocabulary in literature fosters these abilities naturally without conscious effort. Researchers at a leading university discovered that reading complex literature promotes critical thinking skills in ways that simpler forms of media cannot replicate.

Perhaps most importantly for high school students, regular reading habit is strongly linked to academic success across all subjects, not just language arts. Enhanced concentration, expanded vocabulary, and stronger analytical reasoning translate directly into superior performance in science, mathematics, and social studies."""

items.append({
    "item_id": "READ_001",
    "task_type": "Reading Comprehension",
    "thpt_task": 5,
    "passage_id": "READ_P01",
    "passage": read_1_text,
    "question": "[READ_P01] What is the primary thesis of the passage?",
    "option_a": "Digital screens are completely replacing physical books among modern youth.",
    "option_b": "Regular reading provides multifaceted cognitive, emotional, and academic benefits.",
    "option_c": "Fiction is scientifically proven to be superior to non-fiction books.",
    "option_d": "High school students should spend less time on science and more on literature.",
    "options": ["A. Digital screens are replacing physical books.", "B. Regular reading provides multifaceted benefits.", "C. Fiction is superior to non-fiction books.", "D. Students should read more literature instead of science."],
    "correct_answer": "B",
    "correct": "B",
    "explanation": "Ý chính toàn bài: 'regular reading... offers remarkable cognitive and emotional benefits that extend far beyond simple entertainment.' Các đoạn tiếp theo lần lượt phân tích các lợi ích này.",
    "topic": "Reading & Lifelong Learning",
    "skill": "Main Idea",
    "question_type": "Reading Comprehension",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 5 — Đọc hiểu",
    "source": "Biên soạn từ nhiều tài liệu tham khảo (Đề minh họa Bộ GD&ĐT 2025)",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.3,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "READ_002",
    "task_type": "Reading Comprehension",
    "thpt_task": 5,
    "passage_id": "READ_P01",
    "passage": read_1_text,
    "question": "[READ_P01] According to paragraph 2, how does reading fiction enhance empathy?",
    "option_a": "By requiring readers to memorize complex character names and plotlines",
    "option_b": "By encouraging readers to discuss stories with their peers in book clubs",
    "option_c": "By allowing readers to experience life from characters' distinct perspectives",
    "option_d": "By teaching readers explicit moral lessons at the end of each chapter",
    "options": ["A. By memorizing complex character names", "B. By discussing stories in book clubs", "C. By allowing readers to experience life from characters' perspectives", "D. By teaching explicit moral lessons"],
    "correct_answer": "C",
    "correct": "C",
    "explanation": "Đoạn 2 ghi rõ: 'When readers immerse themselves in a story, they experience the world through the eyes of characters whose lives may be vastly different from their own.'",
    "topic": "Reading & Lifelong Learning",
    "skill": "Locating Specific Information",
    "question_type": "Reading Comprehension",
    "cognitive_level": "Nhận biết",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 5 — Đọc hiểu",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.4,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "READ_003",
    "task_type": "Reading Comprehension",
    "thpt_task": 5,
    "passage_id": "READ_P01",
    "passage": read_1_text,
    "question": "[READ_P01] The word 'immerse' in paragraph 2 is closest in meaning to ___.",
    "option_a": "involve deeply",
    "option_b": "examine quickly",
    "option_c": "doubt completely",
    "option_d": "describe briefly",
    "options": ["A. involve deeply", "B. examine quickly", "C. doubt completely", "D. describe briefly"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "'Immerse themselves in a story' = đắm mình / tham gia hoàn toàn vào câu chuyện -> 'involve deeply'.",
    "topic": "Reading & Lifelong Learning",
    "skill": "Vocabulary in Context",
    "question_type": "Reading Comprehension",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 5 — Đọc hiểu",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.2,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "READ_004",
    "task_type": "Reading Comprehension",
    "thpt_task": 5,
    "passage_id": "READ_P01",
    "passage": read_1_text,
    "question": "[READ_P01] What happens to the motor cortex when a person reads about a character running?",
    "option_a": "It slows down to conserve mental energy.",
    "option_b": "It shows heightened neural activity.",
    "option_c": "It sends physical signals that force the reader's legs to twitch.",
    "option_d": "It temporarily loses connection with language centers.",
    "options": ["A. It slows down to conserve mental energy.", "B. It shows heightened neural activity.", "C. It forces the reader's legs to twitch.", "D. It loses connection with language centers."],
    "correct_answer": "B",
    "correct": "B",
    "explanation": "Đoạn 3 ghi: 'When we read about a character running... the motor cortex... shows increased neural activity.'",
    "topic": "Reading & Lifelong Learning",
    "skill": "Locating Specific Information",
    "question_type": "Reading Comprehension",
    "cognitive_level": "Nhận biết",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 5 — Đọc hiểu",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.5,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "READ_005",
    "task_type": "Reading Comprehension",
    "thpt_task": 5,
    "passage_id": "READ_P01",
    "passage": read_1_text,
    "question": "[READ_P01] Which benefit of reading is NOT mentioned in the text?",
    "option_a": "Strengthened empathy for others",
    "option_b": "Expanded vocabulary and analytical thinking",
    "option_c": "Improved academic performance in mathematics",
    "option_d": "Enhanced physical vision and eyesight clarity",
    "options": ["A. Strengthened empathy", "B. Expanded vocabulary", "C. Improved math performance", "D. Enhanced physical vision and eyesight"],
    "correct_answer": "D",
    "correct": "D",
    "explanation": "Bài đọc đề cập đến Empathy (đoạn 2), Vocabulary (đoạn 4), Math performance (đoạn 5). Hoàn toàn KHÔNG nhắc tới 'enhanced physical vision and eyesight clarity' (thị lực mắt).",
    "topic": "Reading & Lifelong Learning",
    "skill": "Identifying Information NOT Stated",
    "question_type": "Reading Comprehension",
    "cognitive_level": "Vận dụng",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 5 — Đọc hiểu",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.4,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "READ_006",
    "task_type": "Reading Comprehension",
    "thpt_task": 5,
    "passage_id": "READ_P01",
    "passage": read_1_text,
    "question": "[READ_P01] The word 'fosters' in paragraph 4 is closest in meaning to ___.",
    "option_a": "encourages",
    "option_b": "prevents",
    "option_c": "neglects",
    "option_d": "restricts",
    "options": ["A. encourages", "B. prevents", "C. neglects", "D. restricts"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "'Fosters these abilities naturally' = nuôi dưỡng / thúc đẩy các khả năng này -> 'encourages'. các đáp án B, C, D mang nghĩa tiêu cực/cản trở.",
    "topic": "Reading & Lifelong Learning",
    "skill": "Vocabulary in Context",
    "question_type": "Reading Comprehension",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 5 — Đọc hiểu",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.3,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "READ_007",
    "task_type": "Reading Comprehension",
    "thpt_task": 5,
    "passage_id": "READ_P01",
    "passage": read_1_text,
    "question": "[READ_P01] What can be inferred from the final paragraph regarding academic performance?",
    "option_a": "Reading is only useful for students pursuing humanities majors.",
    "option_b": "Language skills acquired through reading positively impact STEM learning.",
    "option_c": "Mathematics and science do not require analytical reasoning skills.",
    "option_d": "Students should replace science homework with novel reading.",
    "options": ["A. Reading only helps humanities majors.", "B. Reading skills positively impact STEM learning.", "C. Math and science do not require analytical reasoning.", "D. Students should replace science homework with novels."],
    "correct_answer": "B",
    "correct": "B",
    "explanation": "Đoạn cuối khẳng định kỹ năng đọc giúp cải thiện kết quả môn Toán và Khoa học ('translate directly into superior performance in science, mathematics...'), chứng tỏ kỹ năng ngôn ngữ hỗ trợ tích cực cho các môn STEM.",
    "topic": "Reading & Lifelong Learning",
    "skill": "Inference",
    "question_type": "Reading Comprehension",
    "cognitive_level": "Vận dụng",
    "difficulty_level": "Hard",
    "thpt_section": "Dạng bài 5 — Đọc hiểu",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.9,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "READ_008",
    "task_type": "Reading Comprehension",
    "thpt_task": 5,
    "passage_id": "READ_P01",
    "passage": read_1_text,
    "question": "[READ_P01] Which best describes the author's tone toward physical reading?",
    "option_a": "Highly critical and doubtful",
    "option_b": "Strongly appreciative and evidence-based",
    "option_c": "Indifferent and neutral",
    "option_d": "Sarcastic and humorous",
    "options": ["A. Highly critical and doubtful", "B. Strongly appreciative and evidence-based", "C. Indifferent and neutral", "D. Sarcastic and humorous"],
    "correct_answer": "B",
    "correct": "B",
    "explanation": "Tác giả trích dẫn nhiều nghiên cứu khoa học để khẳng định lợi ích to lớn của việc đọc sách, thể hiện thái độ trân trọng và dựa trên bằng chứng khoa học ('evidence-based').",
    "topic": "Reading & Lifelong Learning",
    "skill": "Author's Tone & Attitude",
    "question_type": "Reading Comprehension",
    "cognitive_level": "Vận dụng",
    "difficulty_level": "Hard",
    "thpt_section": "Dạng bài 5 — Đọc hiểu",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 1.1,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

read_2_text = """THE IMPORTANCE OF URBAN GREEN SPACES

As metropolitan areas continue to expand globally, municipal authorities and public health experts are increasingly focusing on the critical role of urban green spaces. Parks, tree-lined avenues, rooftop gardens, and urban wetlands are no longer regarded as decorative luxuries; rather, they are recognized as essential infrastructure for sustainable community health.

A wealth of research links access to nature with enhanced mental well-being. Studies across several continents demonstrate that urban residents living near green spaces experience lower rates of psychological distress, anxiety, and depression. Remarkably, spending as little as twenty minutes outdoors in a natural setting has been shown to measurably decrease salivary cortisol levels, a primary physiological marker of stress.

Physical health benefits are equally substantial. Public parks provide accessible spaces for outdoor physical activity, including walking, jogging, cycling, and recreational sports. Data from European health surveys indicate that residents with convenient access to natural areas are significantly more likely to meet recommended weekly activity targets, thereby mitigating the risk of chronic conditions such as cardiovascular disease and type 2 diabetes.

Furthermore, green spaces foster social cohesion. Shared communal parks offer welcoming environments where neighbors interact, children play together, and cultural events take place. This social connectivity combats urban loneliness and isolation, issues that disproportionately affect elderly populations in modern cities.

Despite these documented advantages, rapid urbanization often leads to the conversion of green areas into commercial real estate. City planners face the delicate challenge of balancing economic development with the preservation of vital natural spaces."""

items.append({
    "item_id": "READ_009",
    "task_type": "Reading Comprehension",
    "thpt_task": 5,
    "passage_id": "READ_P02",
    "passage": read_2_text,
    "question": "[READ_P02] What is the main focus of the passage?",
    "option_a": "The financial costs of maintaining large city parks",
    "option_b": "The vital benefits of urban green spaces for health and community",
    "option_c": "The architectural history of European public gardens",
    "option_d": "The economic dominance of real estate over public planning",
    "options": ["A. Financial costs of city parks", "B. Vital benefits of urban green spaces", "C. Architectural history of European gardens", "D. Economic dominance of real estate"],
    "correct_answer": "B",
    "correct": "B",
    "explanation": "Toàn bài phân tích các lợi ích của không gian xanh đô thị đối với sức khỏe tinh thần, thể chất và gắn kết xã hội.",
    "topic": "Environment & Urban Health",
    "skill": "Main Idea",
    "question_type": "Reading Comprehension",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 5 — Đọc hiểu",
    "source": "Biên soạn từ nhiều tài liệu tham khảo (Đề minh họa Bộ GD&ĐT 2025)",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.3,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "READ_010",
    "task_type": "Reading Comprehension",
    "thpt_task": 5,
    "passage_id": "READ_P02",
    "passage": read_2_text,
    "question": "[READ_P02] Urban green spaces are currently recognized as ___.",
    "option_a": "optional decorative luxuries for wealthy districts",
    "option_b": "essential infrastructure for sustainable community health",
    "option_c": "temporary measure during urban expansion",
    "option_d": "expensive real estate investments",
    "options": ["A. optional decorative luxuries", "B. essential infrastructure for sustainable health", "C. temporary measures during expansion", "D. expensive real estate investments"],
    "correct_answer": "B",
    "correct": "B",
    "explanation": "Đoạn 1 ghi: 'they are recognized as essential infrastructure for sustainable community health.'",
    "topic": "Environment & Urban Health",
    "skill": "Locating Specific Information",
    "question_type": "Reading Comprehension",
    "cognitive_level": "Nhận biết",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 5 — Đọc hiểu",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.5,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "READ_011",
    "task_type": "Reading Comprehension",
    "thpt_task": 5,
    "passage_id": "READ_P02",
    "passage": read_2_text,
    "question": "[READ_P02] The word 'mitigating' in paragraph 3 is closest in meaning to ___.",
    "option_a": "reducing",
    "option_b": "increasing",
    "option_c": "ignoring",
    "option_d": "diagnosing",
    "options": ["A. reducing", "B. increasing", "C. ignoring", "D. diagnosing"],
    "correct_answer": "A",
    "correct": "A",
    "explanation": "'Mitigating the risk of chronic conditions' = giảm thiểu nguy cơ mắc bệnh mãn tính -> 'reducing'.",
    "topic": "Environment & Urban Health",
    "skill": "Vocabulary in Context",
    "question_type": "Reading Comprehension",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 5 — Đọc hiểu",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.3,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "READ_012",
    "task_type": "Reading Comprehension",
    "thpt_task": 5,
    "passage_id": "READ_P02",
    "passage": read_2_text,
    "question": "[READ_P02] According to paragraph 4, how do green spaces impact urban isolation?",
    "option_a": "They worsen isolation by separating residential neighborhoods.",
    "option_b": "They combat urban loneliness by offering spaces for social interaction.",
    "option_c": "They force elderly residents to relocate outside city centers.",
    "option_d": "They have no noticeable effect on social connectivity.",
    "options": ["A. They worsen isolation.", "B. They combat loneliness by offering spaces for interaction.", "C. They force elderly residents to relocate.", "D. They have no noticeable effect."],
    "correct_answer": "B",
    "correct": "B",
    "explanation": "Đoạn 4 nêu: 'This social connectivity combats urban loneliness and isolation...'.",
    "topic": "Environment & Urban Health",
    "skill": "Locating Specific Information",
    "question_type": "Reading Comprehension",
    "cognitive_level": "Nhận biết",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 5 — Đọc hiểu",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.4,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "READ_013",
    "task_type": "Reading Comprehension",
    "thpt_task": 5,
    "passage_id": "READ_P02",
    "passage": read_2_text,
    "question": "[READ_P02] What physiological change occurs after spending 20 minutes in nature?",
    "option_a": "A rise in heart rate",
    "option_b": "A decrease in salivary cortisol levels",
    "option_c": "An immediate increase in blood sugar",
    "option_d": "A reduction in oxygen intake",
    "options": ["A. A rise in heart rate", "B. A decrease in salivary cortisol levels", "C. An increase in blood sugar", "D. A reduction in oxygen intake"],
    "correct_answer": "B",
    "correct": "B",
    "explanation": "Đoạn 2 ghi: 'spending as little as twenty minutes outdoors... has been shown to measurably decrease salivary cortisol levels'.",
    "topic": "Environment & Urban Health",
    "skill": "Locating Specific Information",
    "question_type": "Reading Comprehension",
    "cognitive_level": "Nhận biết",
    "difficulty_level": "Easy",
    "thpt_section": "Dạng bài 5 — Đọc hiểu",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": -0.5,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "READ_014",
    "task_type": "Reading Comprehension",
    "thpt_task": 5,
    "passage_id": "READ_P02",
    "passage": read_2_text,
    "question": "[READ_P02] The phrase 'social cohesion' in paragraph 4 refers to ___.",
    "option_a": "competition between different urban neighborhood groups",
    "option_b": "the sense of unity, trust, and connection within a community",
    "option_c": "governmental regulations governing public gatherings",
    "option_d": "economic division between urban social classes",
    "options": ["A. competition between neighborhood groups", "B. sense of unity and connection in a community", "C. governmental regulations on public gatherings", "D. economic division between social classes"],
    "correct_answer": "B",
    "correct": "B",
    "explanation": "'Social cohesion' = sự gắn kết / đoàn kết xã hội -> 'sense of unity, trust, and connection within a community'.",
    "topic": "Environment & Urban Health",
    "skill": "Vocabulary in Context",
    "question_type": "Reading Comprehension",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 5 — Đọc hiểu",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.4,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "READ_015",
    "task_type": "Reading Comprehension",
    "thpt_task": 5,
    "passage_id": "READ_P02",
    "passage": read_2_text,
    "question": "[READ_P02] What dilemma do urban planners currently face according to the last paragraph?",
    "option_a": "Choosing between public buses or electric trains",
    "option_b": "Balancing economic expansion with green space preservation",
    "option_c": "Finding qualified architects for park restoration",
    "option_d": "Convincing residents to use public parks more often",
    "options": ["A. Choosing between buses or electric trains", "B. Balancing economic expansion with green space preservation", "C. Finding qualified architects for restoration", "D. Convincing residents to use parks more often"],
    "correct_answer": "B",
    "correct": "B",
    "explanation": "Đoạn cuối ghi: 'City planners face the delicate challenge of balancing economic development with the preservation of vital natural spaces.'",
    "topic": "Environment & Urban Health",
    "skill": "Locating Specific Information",
    "question_type": "Reading Comprehension",
    "cognitive_level": "Thông hiểu",
    "difficulty_level": "Medium",
    "thpt_section": "Dạng bài 5 — Đọc hiểu",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.2,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

items.append({
    "item_id": "READ_016",
    "task_type": "Reading Comprehension",
    "thpt_task": 5,
    "passage_id": "READ_P02",
    "passage": read_2_text,
    "question": "[READ_P02] What can be inferred about the future of green space planning?",
    "option_a": "Green spaces will eventually be replaced entirely by commercial buildings.",
    "option_b": "Proactive policy intervention is needed to protect parks amidst real estate pressure.",
    "option_c": "Health benefits of green spaces will decline over time.",
    "option_d": "Future cities will no longer require physical infrastructure.",
    "options": ["A. Green spaces will eventually be replaced completely.", "B. Proactive policy is needed to protect parks amidst real estate pressure.", "C. Health benefits will decline over time.", "D. Future cities will no longer require infrastructure."],
    "correct_answer": "B",
    "correct": "B",
    "explanation": "Vì có sự xung đột giữa phát triển kinh tế thương mại và bảo tồn không gian xanh ('delicate challenge'), suy ra cần chính sách quy hoạch tích cực để bảo vệ các công viên xanh.",
    "topic": "Environment & Urban Health",
    "skill": "Inference",
    "question_type": "Reading Comprehension",
    "cognitive_level": "Vận dụng",
    "difficulty_level": "Hard",
    "thpt_section": "Dạng bài 5 — Đọc hiểu",
    "source": "Biên soạn từ nhiều tài liệu tham khảo",
    "calibration_status": "PROVISIONAL",
    "discrimination": 1.0,
    "difficulty_parameter": 0.9,
    "guessing_parameter": 0.25,
    "sample_size": 0,
    "status": "Pending Review",
    "reviewer": "",
    "created_at": "2026-08-06T11:00:00Z",
    "updated_at": "2026-08-06T11:00:00Z"
})

for item in items:
    item['difficulty'] = item.get('difficulty_parameter', 0.0)
    item['guessing'] = item.get('guessing_parameter', 0.25)

bank_data = {
    "schema_version": "3.0",
    "last_updated": "2026-08-06",
    "description": "Ngân hàng câu hỏi chuẩn hóa phục vụ Luyện thi Tốt nghiệp THPT môn Tiếng Anh theo ma trận chuẩn Bộ GD&ĐT 2025 (40 câu, 50 phút). Biên soạn tự chủ 100% từ nhiều nguồn tài liệu tham khảo uy tín.",
    "thpt_2025_structure": {
        "total_questions": 40,
        "time_minutes": 50,
        "tasks": [
            { "task_id": 1, "name": "Đọc điền thông báo", "questions": 6 },
            { "task_id": 2, "name": "Đọc điền tờ rơi", "questions": 6 },
            { "task_id": 3, "name": "Sắp xếp câu / đoạn", "questions": 5 },
            { "task_id": 4, "name": "Đọc điền khuyết (Cloze)", "questions": 5 },
            { "task_id": 5, "name": "Đọc hiểu", "questions": 18 }
        ],
        "cognitive_distribution": {
            "Nhận biết": "22.5% (9 câu)",
            "Thông hiểu": "37.5% (15 câu)",
            "Vận dụng": "40% (16 câu)"
        }
    },
    "questions": items
}

output_path = r"C:\Users\TUANANH-STUDIOO\Documents\KHKT\backend\irt_item_bank.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(bank_data, f, ensure_ascii=False, indent=2)

print(f"Successfully generated {len(items)} THPT 2025 questions in {output_path}")
print(f"Successfully generated {len(items)} THPT 2025 questions in {output_path}")

output_path = r"C:\Users\TUANANH-STUDIOO\Documents\KHKT\backend\irt_item_bank.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(bank_benetat, f, ensure_ascii=False, indent=2)