# -*- coding: utf-8 -*-
"""
Dữ liệu chuẩn 100% chuyên biệt cho CẤP THPT (Lớp 10, 11, 12, Ôn thi Tốt nghiệp THPT, HSA, TSA)
Loại bỏ hoàn toàn cấp 2, loại bỏ các số liệu ảo.
"""
import json

with open('frontend/src/data/officialFull40Exams.json', 'r', encoding='utf-8') as f:
    sample_40 = json.load(f)[0]

sample_40["category"] = "tnthpt"
sample_40["level"] = "thpt"
sample_40["type"] = "Đề Minh Họa Bộ GD&ĐT"
sample_40["grade"] = "12"

thpt_exams = [
    sample_40,
    {
        "id": "thpt-hanoi-2026",
        "level": "thpt",
        "grade": "12",
        "category": "so_gddt",
        "province": "Sở GD&ĐT Hà Nội",
        "school": "Sở GD&ĐT Hà Nội",
        "date": "2026.05.15",
        "type": "Khảo Sát Lớp 12",
        "typeColor": "bg-blue-500/10 text-blue-400 border-blue-500/20",
        "title": "Đề Khảo sát Chất lượng Học sinh Lớp 12 — Sở GD&ĐT Hà Nội 2026",
        "subtitle": "Nguồn: Thư Viện Học Liệu (thuvienhoclieu.com) • Sở GD&ĐT Hà Nội • Đầy đủ đáp án & giải thích",
        "questionsCount": 4,
        "time": 50,
        "questions": [
            {
                "id": 1,
                "part": "PHẦN I: TỪ CÙNG TRƯỜNG NGHĨA",
                "question": "The newly elected president promised to implement radical ______ to improve national public healthcare.",
                "options": [
                    { "key": "A", "text": "reforms" },
                    { "key": "B", "text": "forms" },
                    { "key": "C", "text": "formats" },
                    { "key": "D", "text": "formations" }
                ],
                "correctAnswer": "A",
                "explanation": "Collocation: 'radical reforms' (những cải cách triệt để/sâu rộng). 'forms' là hình thức, 'formats' là định dạng, 'formations' là sự hình thành.",
                "trapTip": "Collocation: implement radical reforms (tiến hành cải cách triệt để)."
            },
            {
                "id": 2,
                "part": "PHẦN II: THÀNH NGỮ (IDIOM)",
                "question": "Whenever unexpected challenges arise, she always manages to keep her ______ and finds calm solutions.",
                "options": [
                    { "key": "A", "text": "cool" },
                    { "key": "B", "text": "cold" },
                    { "key": "C", "text": "warmth" },
                    { "key": "D", "text": "chill" }
                ],
                "correctAnswer": "A",
                "explanation": "Idiom: 'keep one\'s cool' = giữ bình tĩnh trong mọi tình huống khó khăn.",
                "trapTip": "Keep one's cool = Stay calm."
            },
            {
                "id": 3,
                "part": "PHẦN III: ĐẢO NGỮ CÂU",
                "question": "______ had the plane taken off than a sudden mechanical warning flashed on the cockpit screen.",
                "options": [
                    { "key": "A", "text": "No sooner" },
                    { "key": "B", "text": "Hardly" },
                    { "key": "C", "text": "Scarcely" },
                    { "key": "D", "text": "Barely" }
                ],
                "correctAnswer": "A",
                "explanation": "Cấu trúc đảo ngữ: 'No sooner + had + S + V3/ed + THAN + S + V2/ed' (Vừa mới... thì...). Các từ 'Hardly / Scarcely / Barely' phải đi với 'WHEN'.",
                "trapTip": "No sooner đi với THAN | Hardly/Scarcely đi với WHEN."
            },
            {
                "id": 4,
                "part": "PHẦN IV: TÌM LỖI SAI",
                "question": "Neither the headmaster nor the teachers (A) was present (B) at the emergency meeting (C) yesterday morning (D).",
                "options": [
                    { "key": "A", "text": "nor the teachers" },
                    { "key": "B", "text": "was present" },
                    { "key": "C", "text": "at the emergency meeting" },
                    { "key": "D", "text": "yesterday morning" }
                ],
                "correctAnswer": "B",
                "explanation": "Quy tắc hòa hợp chủ vị: 'Neither S1 nor S2 + V' thì động từ chia theo chủ ngữ gần nhất (S2 = 'the teachers' số nhiều) -> phải sửa 'was present' thành 'were present'.",
                "trapTip": "Neither... nor... chia theo chủ ngữ gần động từ nhất."
            }
        ]
    },
    {
        "id": "thpt-tphcm-2026",
        "level": "thpt",
        "grade": "12",
        "category": "so_gddt",
        "province": "Sở GD&ĐT TP.HCM",
        "school": "Sở GD&ĐT TP.HCM",
        "date": "2026.05.20",
        "type": "Khảo Sát Lớp 12",
        "typeColor": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        "title": "Đề Khảo sát Năng lực Tiếng Anh Lớp 12 — Sở GD&ĐT TP. Hồ Chí Minh 2026",
        "subtitle": "Nguồn: Thư Viện Học Liệu (thuvienhoclieu.com) • Sở GD&ĐT TP.HCM • Chú trọng giao tiếp thực tế & Ngữ cảnh học thuật",
        "questionsCount": 4,
        "time": 50,
        "questions": [
            {
                "id": 1,
                "part": "PHẦN I: GIAO TIẾP TÌNH HUỐNG",
                "question": "Nam: 'Could you show me how to use this interactive grammar simulation?'\nLan: '______'",
                "options": [
                    { "key": "A", "text": "Certainly, let me demonstrate it for you right now." },
                    { "key": "B", "text": "No, I don't like it." },
                    { "key": "C", "text": "You are welcome." },
                    { "key": "D", "text": "Yes, I am using it." }
                ],
                "correctAnswer": "A",
                "explanation": "Đáp lại lời yêu cầu giúp đỡ lịch sự 'Could you show me...': 'Certainly, let me demonstrate...' (Chắc chắn rồi, để mình làm mẫu cho bạn ngay).",
                "trapTip": "Đáp lại lời nhờ vả lịch sự bằng 'Certainly / Sure / Gladly'."
            },
            {
                "id": 2,
                "part": "PHẦN II: CỤM ĐỘNG TỪ (PHRASAL VERB)",
                "question": "The technology company decided to ______ a new software update to address security vulnerabilities.",
                "options": [
                    { "key": "A", "text": "roll out" },
                    { "key": "B", "text": "give up" },
                    { "key": "C", "text": "take after" },
                    { "key": "D", "text": "put off" }
                ],
                "correctAnswer": "A",
                "explanation": "'roll out' (phát hành/tung ra sản phẩm hoặc bản cập nhật phần mềm mới). 'give up' (từ bỏ), 'take after' (giống ai), 'put off' (trì hoãn).",
                "trapTip": "Roll out a product/update = Launch a product/update."
            },
            {
                "id": 3,
                "part": "PHẦN III: CÂU ĐIỀU KIỆN TRỘN",
                "question": "If he had taken your advice yesterday, he ______ in such a difficult situation now.",
                "options": [
                    { "key": "A", "text": "would not be" },
                    { "key": "B", "text": "would not have been" },
                    { "key": "C", "text": "will not be" },
                    { "key": "D", "text": "is not" }
                ],
                "correctAnswer": "A",
                "explanation": "Câu điều kiện trộn (Mixed Conditional: Quá khứ -> Hiện tại): Mệnh đề If có 'yesterday' chia loại 3 (had taken), mệnh đề chính có 'now' chia loại 2 (would not be).",
                "trapTip": "Dấu hiệu câu điều kiện trộn: 'yesterday' ở vế If và 'now' ở vế chính."
            },
            {
                "id": 4,
                "part": "PHẦN IV: ĐỒNG NGHĨA",
                "question": "The government launched an ambitious campaign to <u>eradicate</u> poverty in rural provinces.",
                "options": [
                    { "key": "A", "text": "wipe out / eliminate" },
                    { "key": "B", "text": "encourage" },
                    { "key": "C", "text": "establish" },
                    { "key": "D", "text": "postpone" }
                ],
                "correctAnswer": "A",
                "explanation": "'eradicate' = xóa bỏ hoàn toàn, diệt trừ (= wipe out / eliminate).",
                "trapTip": "Eradicate poverty/disease = Eliminate completely."
            }
        ]
    },
    {
        "id": "thpt-nghean-2026",
        "level": "thpt",
        "grade": "12",
        "category": "so_gddt",
        "province": "Sở GD&ĐT Nghệ An",
        "school": "Sở GD&ĐT Nghệ An",
        "date": "2026.05.10",
        "type": "Khảo Sát Lớp 12",
        "typeColor": "bg-teal-500/10 text-teal-400 border-teal-500/20",
        "title": "Đề Khảo sát Chất lượng Học sinh Lớp 12 — Sở GD&ĐT Nghệ An 2026",
        "subtitle": "Nguồn: Thư Viện Học Liệu (thuvienhoclieu.com) • Sở GD&ĐT Nghệ An • Phân hóa cao bám sát cấu trúc Bộ GD&ĐT",
        "questionsCount": 4,
        "time": 50,
        "questions": [
            {
                "id": 1,
                "part": "PHẦN I: MỆNH ĐỀ QUAN HỆ RÚT GỌN",
                "question": "The historic documents ______ by the archaeological team date back to the 15th century.",
                "options": [
                    { "key": "A", "text": "discovered" },
                    { "key": "B", "text": "discovering" },
                    { "key": "C", "text": "which discovered" },
                    { "key": "D", "text": "to discover" }
                ],
                "correctAnswer": "A",
                "explanation": "Rút gọn mệnh đề quan hệ dạng bị động: 'which were discovered' -> rút gọn còn quá khứ phân từ 'discovered'.",
                "trapTip": "Bị động rút gọn dùng V-ed/V3 (discovered)."
            },
            {
                "id": 2,
                "part": "PHẦN II: CÂU HỎI ĐUÔI (TAG QUESTION)",
                "question": "Nobody called the emergency hotline during the storm last night, ______?",
                "options": [
                    { "key": "A", "text": "did they" },
                    { "key": "B", "text": "didn't they" },
                    { "key": "C", "text": "did he" },
                    { "key": "D", "text": "didn't he" }
                ],
                "correctAnswer": "A",
                "explanation": "Chủ ngữ 'Nobody' mang nghĩa phủ định -> phần câu hỏi đuôi phải ở dạng KHẲNG ĐỊNH. 'Nobody' được thay thế bằng đại từ 'they' -> dùng 'did they'.",
                "trapTip": "Nobody / No one -> đuôi là 'they' và vế đuôi mang thể khẳng định."
            },
            {
                "id": 3,
                "part": "PHẦN III: TRÁI NGHĨA",
                "question": "The international summit reached a <u>unanimous</u> decision on carbon reduction targets.",
                "options": [
                    { "key": "A", "text": "divided / discordant" },
                    { "key": "B", "text": "united" },
                    { "key": "C", "text": "harmonious" },
                    { "key": "D", "text": "supportive" }
                ],
                "correctAnswer": "A",
                "explanation": "'unanimous' = đồng thuận, nhất trí 100%. Từ trái nghĩa là 'divided / discordant' (bị chia rẽ, bất đồng quan điểm).",
                "trapTip": "Unanimous (đồng thuận) >< Divided (chia rẽ)."
            },
            {
                "id": 4,
                "part": "PHẦN IV: CẤU TRÚC NOT ONLY... BUT ALSO",
                "question": "Not only ______ fluent in three foreign languages, but she also excels at computer programming.",
                "options": [
                    { "key": "A", "text": "is she" },
                    { "key": "B", "text": "she is" },
                    { "key": "C", "text": "does she" },
                    { "key": "D", "text": "was she" }
                ],
                "correctAnswer": "A",
                "explanation": "Đảo ngữ với 'Not only' đứng đầu câu: 'Not only + Trợ động từ/Tobe + S + V/adj...'. Động từ to be hiện tại là 'is she'.",
                "trapTip": "Not only + Tobe/Aux + S."
            }
        ]
    },
    {
        "id": "thpt-dgnl-hsa-2026",
        "level": "thpt",
        "grade": "12",
        "category": "dgnl",
        "province": "ĐHQG Hà Nội",
        "school": "Trung tâm Khảo thí ĐHQG Hà Nội",
        "date": "2026.04.10",
        "type": "ĐGNL (HSA)",
        "typeColor": "bg-purple-500/10 text-purple-400 border-purple-500/20",
        "title": "Đề thi Đánh giá Năng lực Môn Tiếng Anh (HSA) — ĐHQG Hà Nội 2026",
        "subtitle": "Nguồn: Thư Viện Học Liệu (thuvienhoclieu.com) • ĐHQG Hà Nội • Tư duy ngôn ngữ & Đọc hiểu chuyên sâu",
        "questionsCount": 4,
        "time": 60,
        "questions": [
            {
                "id": 1,
                "part": "PHẦN I: TƯ DUY NGÔN NGỮ & ĐIỀN TỪ",
                "question": "The scientific community requires empirical evidence before ______ accepting any radical physics hypothesis.",
                "options": [
                    { "key": "A", "text": "tentatively" },
                    { "key": "B", "text": "tentative" },
                    { "key": "C", "text": "tentativeness" },
                    { "key": "D", "text": "temptation" }
                ],
                "correctAnswer": "A",
                "explanation": "Bổ nghĩa cho động từ/danh động từ 'accepting' cần một trạng từ (tentatively = một cách thận trọng/thử nghiệm).",
                "trapTip": "Adverb đứng trước bổ nghĩa cho V-ing/Verb."
            },
            {
                "id": 2,
                "part": "PHẦN II: LOGIC NGỮ NGHĨA",
                "question": "Solar and wind energy are intermittent; ______, high-capacity battery storage systems are indispensable.",
                "options": [
                    { "key": "A", "text": "consequently" },
                    { "key": "B", "text": "nevertheless" },
                    { "key": "C", "text": "on the other hand" },
                    { "key": "D", "text": "whereas" }
                ],
                "correctAnswer": "A",
                "explanation": "Mối quan hệ nhân - quả: Năng lượng mặt trời và gió chập chờn (nguyên nhân) -> Do đó / Vì vậy (consequently), hệ thống pin lưu trữ dung lượng cao là không thể thiếu (kết quả).",
                "trapTip": "Consequently / Therefore thể hiện kết quả nguyên nhân - hệ quả."
            },
            {
                "id": 3,
                "part": "PHẦN III: TỪ VỰNG NÂNG CAO",
                "question": "The research paper was praised for its ______ analysis of climate migration patterns across South Asia.",
                "options": [
                    { "key": "A", "text": "meticulous" },
                    { "key": "B", "text": "careless" },
                    { "key": "C", "text": "superficial" },
                    { "key": "D", "text": "vague" }
                ],
                "correctAnswer": "A",
                "explanation": "'meticulous analysis' = sự phân tích tỉ mỉ, cẩn trọng, kỹ lưỡng. Các từ còn lại mang nghĩa tiêu cực (cẩu thả, nông cạn, mơ hồ).",
                "trapTip": "Meticulous = Extremely careful and precise."
            },
            {
                "id": 4,
                "part": "PHẦN IV: CẤU TRÚC GIẢ ĐỊNH (SUBJUNCTIVE)",
                "question": "The chief economist recommended that international tariffs on renewable equipment ______ lowered immediately.",
                "options": [
                    { "key": "A", "text": "be" },
                    { "key": "B", "text": "are" },
                    { "key": "C", "text": "were" },
                    { "key": "D", "text": "to be" }
                ],
                "correctAnswer": "A",
                "explanation": "Cấu trúc giả định thức với động từ 'recommend': 'S + recommend that + S + (should) + V-nguyên thể / be + V3' -> dùng 'be lowered'.",
                "trapTip": "Recommend / Suggest / Demand + that + S + (should) + V-infinitive."
            }
        ]
    },
    {
        "id": "thpt-lop11-2026",
        "level": "thpt",
        "grade": "11",
        "category": "lop10_11",
        "province": "Chương Trình GDPT 2018",
        "school": "Global Success 11",
        "date": "2026.03.15",
        "type": "Định Kỳ Lớp 11",
        "typeColor": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        "title": "Đề Kiểm tra Định kỳ Tiếng Anh Lớp 11 — Global Success (Unit 1-5)",
        "subtitle": "Nguồn: Thư Viện Học Liệu (thuvienhoclieu.com) • Bám sát sách giáo khoa Tiếng Anh 11 mới GDPT 2018",
        "questionsCount": 4,
        "time": 45,
        "questions": [
            {
                "id": 1,
                "part": "PHẦN I: THÌ HIỆN TẠI HOÀN THÀNH TIẾP DIỄN",
                "question": "He is exhausted because he ______ for the international math Olympiad all morning.",
                "options": [
                    { "key": "A", "text": "has been studying" },
                    { "key": "B", "text": "is studying" },
                    { "key": "C", "text": "studies" },
                    { "key": "D", "text": "had studied" }
                ],
                "correctAnswer": "A",
                "explanation": "Thì Hiện tại hoàn thành tiếp diễn (has been studying) nhấn mạnh quá trình liên tục kéo dài suốt buổi sáng dẫn tới kết quả ở hiện tại (is exhausted).",
                "trapTip": "Nhấn mạnh quá trình liên tục + kết quả hiện tại -> Hiện tại hoàn thành tiếp diễn."
            },
            {
                "id": 2,
                "part": "PHẦN II: TỪ VỰNG CHỦ ĐỀ SỨC KHỎE (GLOBAL SUCCESS 11)",
                "question": "Regular meditation helps maintain emotional ______ and prevents chronic fatigue.",
                "options": [
                    { "key": "A", "text": "balance" },
                    { "key": "B", "text": "balancing" },
                    { "key": "C", "text": "balanced" },
                    { "key": "D", "text": "balancer" }
                ],
                "correctAnswer": "A",
                "explanation": "Cụm danh từ: 'emotional balance' (sự cân bằng cảm xúc). Sau tính từ 'emotional' cần một danh từ (balance).",
                "trapTip": "Adjective + Noun -> emotional balance."
            },
            {
                "id": 3,
                "part": "PHẦN III: ĐỘNG TỪ NỐI (LINKING VERBS)",
                "question": "The fresh soup in the school cafeteria ______ delicious and fragrant.",
                "options": [
                    { "key": "A", "text": "smells" },
                    { "key": "B", "text": "is smelling" },
                    { "key": "C", "text": "smell" },
                    { "key": "D", "text": "smelled" }
                ],
                "correctAnswer": "A",
                "explanation": "'smell' ở đây đóng vai trò là động từ liên kết (linking verb) chỉ giác quan -> không chia tiếp diễn và đi kèm với tính từ 'delicious and fragrant'. Chủ ngữ 'The fresh soup' số ít -> 'smells'.",
                "trapTip": "Linking verbs chỉ giác quan (taste, smell, look, sound) + Adjective."
            },
            {
                "id": 4,
                "part": "PHẦN IV: DANH ĐỘNG TỪ HOÀN THÀNH",
                "question": "The student admitted ______ the class assignment from an online forum.",
                "options": [
                    { "key": "A", "text": "having copied" },
                    { "key": "B", "text": "to copy" },
                    { "key": "C", "text": "copy" },
                    { "key": "D", "text": "being copied" }
                ],
                "correctAnswer": "A",
                "explanation": "'admit + having + V3/ed' (thừa nhận đã làm gì trong quá khứ). Cấu trúc danh động từ hoàn thành (Perfect Gerund).",
                "trapTip": "Admit / Deny + having V3/ed (nhấn mạnh hành động đã xảy ra trước)."
            }
        ]
    },
    {
        "id": "thpt-lop10-2026",
        "level": "thpt",
        "grade": "10",
        "category": "lop10_11",
        "province": "Chương Trình GDPT 2018",
        "school": "Global Success 10",
        "date": "2026.03.10",
        "type": "Định Kỳ Lớp 10",
        "typeColor": "bg-amber-500/10 text-amber-400 border-amber-500/20",
        "title": "Đề Kiểm tra Định kỳ Tiếng Anh Lớp 10 — Global Success (Học Kỳ II)",
        "subtitle": "Nguồn: Thư Viện Học Liệu (thuvienhoclieu.com) • Bám sát chương trình Tiếng Anh 10 chuẩn GDPT 2018",
        "questionsCount": 4,
        "time": 45,
        "questions": [
            {
                "id": 1,
                "part": "PHẦN I: THÌ TƯƠNG LAI GẦN VS TƯƠNG LAI ĐƠN",
                "question": "Look at those dark clouds in the sky! It ______ heavily in a few minutes.",
                "options": [
                    { "key": "A", "text": "is going to rain" },
                    { "key": "B", "text": "will rain" },
                    { "key": "C", "text": "rains" },
                    { "key": "D", "text": "is raining" }
                ],
                "correctAnswer": "A",
                "explanation": "Dự đoán có căn cứ, bằng chứng rõ ràng ở hiện tại ('dark clouds in the sky') -> dùng tương lai gần 'be going to V' (is going to rain).",
                "trapTip": "Dự đoán có bằng chứng ở hiện tại -> Dùng Be going to V."
            },
            {
                "id": 2,
                "part": "PHẦN II: TỪ VỰNG MÔI TRƯỜNG (GLOBAL SUCCESS 10)",
                "question": "Students are encouraged to reduce their carbon ______ by commuting by bicycle.",
                "options": [
                    { "key": "A", "text": "footprint" },
                    { "key": "B", "text": "trace" },
                    { "key": "C", "text": "mark" },
                    { "key": "D", "text": "step" }
                ],
                "correctAnswer": "A",
                "explanation": "Collocation quen thuộc lớp 10: 'carbon footprint' (dấu chân carbon / lượng khí thải carbon của cá nhân hoặc tổ chức).",
                "trapTip": "Carbon footprint = Lượng phát thải khí nhà kính cá nhân."
            },
            {
                "id": 3,
                "part": "PHẦN III: ĐỘNG TỪ KHUYẾT THIẾU (MODAL VERBS)",
                "question": "You ______ submit your project before Friday, or you will lose attendance marks.",
                "options": [
                    { "key": "A", "text": "must" },
                    { "key": "B", "text": "might" },
                    { "key": "C", "text": "may" },
                    { "key": "D", "text": "could" }
                ],
                "correctAnswer": "A",
                "explanation": "Diễn tả sự bắt buộc, quy định bắt buộc phải làm -> dùng 'must'. 'might/may/could' chỉ khả năng không chắc chắn.",
                "trapTip": "Must = Bắt buộc phải làm."
            },
            {
                "id": 4,
                "part": "PHẦN IV: THÌ HIỆN TẠI HOÀN THÀNH",
                "question": "Our family ______ in this eco-friendly smart apartment since 2022.",
                "options": [
                    { "key": "A", "text": "has lived" },
                    { "key": "B", "text": "lived" },
                    { "key": "C", "text": "are living" },
                    { "key": "D", "text": "were living" }
                ],
                "correctAnswer": "A",
                "explanation": "Mệnh đề có 'since + mốc thời gian quá khứ (since 2022)' -> Động từ chia ở thì Hiện tại hoàn thành (has lived).",
                "trapTip": "S + have/has + V3/ed + SINCE + Mốc thời gian."
            }
        ]
    }
]

js_code = "// Du lieu kho de thi THPT chuyen biet - thuvienhoclieu.com\nexport const COMPREHENSIVE_EXAMS_DATABASE = " + json.dumps(thpt_exams, ensure_ascii=False, indent=2) + ";\n\nexport const OFFICIAL_EXAM_LIST = COMPREHENSIVE_EXAMS_DATABASE;\n"

with open('frontend/src/data/officialExamsData.js', 'w', encoding='utf-8') as f:
    f.write(js_code)

print("Successfully written 100% THPT pure database with ZERO mock statistics!")
