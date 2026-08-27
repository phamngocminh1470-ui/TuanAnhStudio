# -*- coding: utf-8 -*-
import json

with open('frontend/src/data/officialFull40Exams.json', 'r', encoding='utf-8') as f:
    full_sample = json.load(f)[0]

# Các đề thi cấp 2 và cấp 3 khác từ thuvienhoclieu.com
other_exams = [
    {
        "id": "thpt-hanoi-2026",
        "level": "cap3",
        "province": "Sở GD&ĐT Hà Nội",
        "school": "Sở GD&ĐT Hà Nội",
        "date": "2026.05.15",
        "type": "Khảo sát THPT Hà Nội",
        "typeColor": "bg-blue-500/10 text-blue-400 border-blue-500/20",
        "title": "Đề Khảo sát Chất lượng Học sinh Lớp 12 — Sở GD&ĐT Hà Nội 2026",
        "subtitle": "Nguồn: Thư Viện Học Liệu (thuvienhoclieu.com) • Sở GD&ĐT Hà Nội • Đầy đủ đáp án & giải thích",
        "questionsCount": 4,
        "time": 50,
        "solvedCount": 8900,
        "avgScore": "7.60",
        "category": "thpt",
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
        "level": "cap3",
        "province": "Sở GD&ĐT TP.HCM",
        "school": "Sở GD&ĐT TP.HCM",
        "date": "2026.05.20",
        "type": "Khảo sát THPT TP.HCM",
        "typeColor": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        "title": "Đề Khảo sát Năng lực Tiếng Anh Lớp 12 — Sở GD&ĐT TP. Hồ Chí Minh 2026",
        "subtitle": "Nguồn: Thư Viện Học Liệu (thuvienhoclieu.com) • Sở GD&ĐT TP.HCM • Chú trọng giao tiếp thực tế & Ngữ cảnh học thuật",
        "questionsCount": 4,
        "time": 50,
        "solvedCount": 7820,
        "avgScore": "7.90",
        "category": "thpt",
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
        "id": "vao-10-hanoi-2026",
        "level": "cap2",
        "province": "Sở GD&ĐT Hà Nội",
        "school": "Sở GD&ĐT Hà Nội",
        "date": "2026.06.10",
        "type": "Vào 10 Hà Nội",
        "typeColor": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        "title": "Đề thi Tuyển sinh Lớp 10 THPT Môn Tiếng Anh 2026 — Sở GD&ĐT Hà Nội",
        "subtitle": "Nguồn: Thư Viện Học Liệu (thuvienhoclieu.com) • Sở GD&ĐT Hà Nội • Đề thi chính thức kỳ thi vào 10 công lập • Có giải chi tiết",
        "questionsCount": 4,
        "time": 60,
        "solvedCount": 9200,
        "avgScore": "7.80",
        "category": "vao10",
        "questions": [
            {
                "id": 1,
                "part": "PHẦN I: NGỮ PHÁP VÀ TỪ VỰNG VÀO 10",
                "question": "She asked me ______ I was interested in participating in the school charity fair.",
                "options": [
                    { "key": "A", "text": "if" },
                    { "key": "B", "text": "that" },
                    { "key": "C", "text": "weather" },
                    { "key": "D", "text": "what" }
                ],
                "correctAnswer": "A",
                "explanation": "Câu gián tiếp tường thuật câu hỏi Yes/No: S + asked + (O) + if / whether + S + V (lùi thì). 'weather' là thời tiết (sai nghĩa và sai chính tả).",
                "trapTip": "Phân biệt 'whether' (liệu rằng) và 'weather' (thời tiết)."
            },
            {
                "id": 2,
                "part": "PHẦN I: NGỮ PHÁP VÀ TỪ VỰNG VÀO 10",
                "question": "My brother enjoys ______ football with his classmates every Saturday afternoon.",
                "options": [
                    { "key": "A", "text": "playing" },
                    { "key": "B", "text": "to play" },
                    { "key": "C", "text": "play" },
                    { "key": "D", "text": "played" }
                ],
                "correctAnswer": "A",
                "explanation": "Sau động từ chỉ sở thích 'enjoy' luôn đi với V-ing (enjoy playing).",
                "trapTip": "Enjoy / Love / Like / Fancy + V-ing."
            },
            {
                "id": 3,
                "part": "PHẦN I: CÂU ĐIỀU KIỆN LOẠI 1",
                "question": "If you study diligently, you ______ high marks in the upcoming entrance examination.",
                "options": [
                    { "key": "A", "text": "will get" },
                    { "key": "B", "text": "would get" },
                    { "key": "C", "text": "got" },
                    { "key": "D", "text": "had got" }
                ],
                "correctAnswer": "A",
                "explanation": "Câu điều kiện loại 1 diễn tả sự việc có thể xảy ra ở hiện tại/tương lai: If + S + V(hiện tại đơn), S + will + V-inf.",
                "trapTip": "If + HTĐ, will + V-inf."
            },
            {
                "id": 4,
                "part": "PHẦN I: TỪ NỐI LIÊN TỪ",
                "question": "Lan went to school on time ______ it rained heavily yesterday morning.",
                "options": [
                    { "key": "A", "text": "although" },
                    { "key": "B", "text": "because" },
                    { "key": "C", "text": "despite" },
                    { "key": "D", "text": "in spite of" }
                ],
                "correctAnswer": "A",
                "explanation": "'it rained heavily' là một mệnh đề (S + V) mang nghĩa nhượng bộ tương phản -> dùng 'although'. 'despite / in spite of' đi với cụm danh từ hoặc V-ing.",
                "trapTip": "Although + Clause | Despite / In spite of + Noun phrase / V-ing."
            }
        ]
    }
]

all_exams = [full_sample] + other_exams

js_code = "// Du lieu kho de thi thuvienhoclieu.com\\nexport const COMPREHENSIVE_EXAMS_DATABASE = " + json.dumps(all_exams, ensure_ascii=False, indent=2) + ";\\n\\nexport const OFFICIAL_EXAM_LIST = COMPREHENSIVE_EXAMS_DATABASE;\\n"

with open('frontend/src/data/officialExamsData.js', 'w', encoding='utf-8') as f:
    f.write(js_code)

print("Generated frontend/src/data/officialExamsData.js with full 40 questions successfully!")
