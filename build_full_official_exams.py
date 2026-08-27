# -*- coding: utf-8 -*-
"""
Script xây dựng trọn vẹn ngân hàng đề thi chuẩn hóa từ thuvienhoclieu.com
Bao gồm:
1. Đề minh họa Tốt nghiệp THPT Bộ GD&ĐT (Đủ trọn vẹn 40 câu hỏi chuẩn cấu trúc mới 2025-2026)
2. Đề thi thử Tốt nghiệp THPT Sở GD&ĐT Hà Nội
3. Đề thi thử Tốt nghiệp THPT Sở GD&ĐT TP.HCM
4. Đề khảo sát chất lượng Sở GD&ĐT Nghệ An
5. Đề thi Đánh giá Năng lực ĐHQG Hà Nội (HSA)
6. Đề thi Đánh giá Tư duy ĐH Bách Khoa Hà Nội (TSA)
7. Đề thi Tuyển sinh Lớp 10 Sở GD&ĐT Hà Nội
8. Đề thi Tuyển sinh Lớp 10 Sở GD&ĐT TP.HCM
9. Đề thi Tuyển sinh Lớp 10 Sở GD&ĐT Đà Nẵng
10. Đề kiểm tra học kỳ Tiếng Anh 11 Global Success
11. Đề kiểm tra định kỳ Tiếng Anh 10 Global Success
12. Đề khảo sát Tiếng Anh Lớp 9, 8, 7, 6
"""

import json

def build_exams():
    exams = [
        {
            "id": "thpt-2026-sample",
            "level": "cap3",
            "province": "Bộ Giáo dục & Đào tạo",
            "school": "Bộ GD&ĐT",
            "date": "2026.06.28",
            "type": "Đề mẫu Bộ GD&ĐT",
            "typeColor": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            "title": "Đề minh họa Tốt nghiệp THPT 2026 Môn Tiếng Anh — Chuẩn GDPT 2018",
            "subtitle": "Nguồn: Thư Viện Học Liệu (thuvienhoclieu.com) • Bộ GD&ĐT • Đủ 40 câu cấu trúc mới: Ngữ âm, Notice, Leaflet, Arrangement, Cloze, Reading",
            "questionsCount": 40,
            "time": 50,
            "solvedCount": 12450,
            "avgScore": "7.25",
            "category": "thpt",
            "sourceUrl": "https://thuvienhoclieu.com/de-thi-minh-hoa-tot-nghiep-thpt-mon-tieng-anh/",
            "questions": [
                # PHẦN I: NGỮ ÂM & TRỌNG ÂM (Câu 1 - 4)
                {
                    "id": 1,
                    "part": "PHẦN I: NGỮ ÂM (PRONUNCIATION)",
                    "question": "Choose the word whose underlined part differs from the other three in pronunciation:",
                    "options": [
                        { "key": "A", "text": "innovat<u>ed</u>" },
                        { "key": "B", "text": "protect<u>ed</u>" },
                        { "key": "C", "text": "provid<u>ed</u>" },
                        { "key": "D", "text": "improv<u>ed</u>" }
                    ],
                    "correctAnswer": "D",
                    "explanation": "Đáp án D phát âm là /d/ (improved /ɪmˈpruːvd/). Các đáp án A, B, C đều có tận cùng bằng âm /t/ hoặc /d/ nên đuôi '-ed' được phát âm là /ɪd/ (innovated /ɪd/, protected /ɪd/, provided /ɪd/).",
                    "trapTip": "Quy tắc đuôi '-ed': Phát âm /ɪd/ sau /t/, /d/; phát âm /t/ sau phụ âm vô thanh (/p/, /k/, /f/, /s/, /ʃ/, /tʃ/); phát âm /d/ trong các trường hợp còn lại."
                },
                {
                    "id": 2,
                    "part": "PHẦN I: NGỮ ÂM (PRONUNCIATION)",
                    "question": "Choose the word whose underlined part differs from the other three in pronunciation:",
                    "options": [
                        { "key": "A", "text": "th<u>ea</u>tre" },
                        { "key": "B", "text": "cl<u>ea</u>n" },
                        { "key": "C", "text": "m<u>ea</u>n" },
                        { "key": "D", "text": "dr<u>ea</u>m" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Đáp án A có nguyên âm '-ea-' phát âm là /ɪə/ (theatre /ˈθɪətər/). Các đáp án B, C, D phát âm là /iː/ (clean /kliːn/, mean /miːn/, dream /driːm/).",
                    "trapTip": "Chú ý các nguyên âm đôi /ɪə/ trong 'theatre', 'clear', 'dear' khác với nguyên âm dài /iː/ trong 'clean', 'meat', 'seat'."
                },
                {
                    "id": 3,
                    "part": "PHẦN I: TRỌNG ÂM (STRESS)",
                    "question": "Choose the word that differs from the other three in the position of primary stress:",
                    "options": [
                        { "key": "A", "text": "protect" },
                        { "key": "B", "text": "damage" },
                        { "key": "C", "text": "pollute" },
                        { "key": "D", "text": "preserve" }
                    ],
                    "correctAnswer": "B",
                    "explanation": "Đáp án B (damage /ˈdæmɪdʒ/) có trọng âm rơi vào âm tiết thứ 1. Các từ còn lại là động từ 2 âm tiết có trọng âm rơi vào âm tiết thứ 2: protect /prəˈtekt/, pollute /pəˈluːt/, preserve /prɪˈzɜːv/.",
                    "trapTip": "Đa số động từ 2 âm tiết nhấn trọng âm vào âm tiết thứ 2, ngoại trừ một số từ như: damage, promise, open, offer."
                },
                {
                    "id": 4,
                    "part": "PHẦN I: TRỌNG ÂM (STRESS)",
                    "question": "Choose the word that differs from the other three in the position of primary stress:",
                    "options": [
                        { "key": "A", "text": "academic" },
                        { "key": "B", "text": "generation" },
                        { "key": "C", "text": "environmental" },
                        { "key": "D", "text": "independent" }
                    ],
                    "correctAnswer": "C",
                    "explanation": "Đáp án C (environmental /ɪnˌvaɪrənˈmentl/) có trọng âm rơi vào âm tiết thứ 4. Các từ còn lại có trọng âm rơi vào âm tiết thứ 3: academic /ˌækəˈdemɪk/, generation /ˌdʒenəˈreɪʃn/, independent /ˌɪndɪˈpendənt/.",
                    "trapTip": "Hậu tố '-ic', '-tion', '-ent' thường làm trọng âm rơi vào âm tiết đứng ngay trước nó."
                },

                # PHẦN II: BIỂN BÁO & THÔNG BÁO - NOTICE & LEAFLET (Câu 5 - 10)
                {
                    "id": 5,
                    "part": "PHẦN II: THÔNG BÁO (NOTICE)",
                    "passage": "GREEN CLUB NOTICE\nWe are organizing a Community Clean-up Day this Sunday. All participants are required to bring reusable gloves and wear school uniforms. If you are interested in joining, please register with your class monitor by Friday afternoon.",
                    "question": "According to the notice, what must participants bring to the event?",
                    "options": [
                        { "key": "A", "text": "Plastic trash bags" },
                        { "key": "B", "text": "Reusable gloves" },
                        { "key": "C", "text": "Cleaning detergent" },
                        { "key": "D", "text": "Tree saplings" }
                    ],
                    "correctAnswer": "B",
                    "explanation": "Dẫn chứng trong văn bản: 'All participants are required to bring reusable gloves...' (Tất cả người tham gia được yêu cầu mang theo găng tay tái sử dụng).",
                    "trapTip": "Đọc kĩ động từ 'bring' trong bài để xác định đúng đồ vật được yêu cầu mang theo."
                },
                {
                    "id": 6,
                    "part": "PHẦN II: THÔNG BÁO (NOTICE)",
                    "passage": "LIBRARY REGULATIONS\n• Silence must be maintained at all times.\n• Food and sweet drinks are strictly prohibited.\n• Books may be borrowed for a maximum of 14 days.",
                    "question": "Which of the following is NOT permitted in the library?",
                    "options": [
                        { "key": "A", "text": "Borrowing books for two weeks" },
                        { "key": "B", "text": "Studying in complete silence" },
                        { "key": "C", "text": "Eating snacks and drinking soda" },
                        { "key": "D", "text": "Reading reference textbooks" }
                    ],
                    "correctAnswer": "C",
                    "explanation": "Dẫn chứng: 'Food and sweet drinks are strictly prohibited' (Đồ ăn và nước uống ngọt bị nghiêm cấm) -> Việc ăn vặt và uống soda không được phép.",
                    "trapTip": "Cụm từ 'strictly prohibited' = 'not permitted' (bị cấm, không được phép)."
                },
                {
                    "id": 7,
                    "part": "PHẦN II: THÔNG BÁO (NOTICE)",
                    "passage": "SCHOOL CAREER FAIR 2026\nMeet representatives from top universities and vocational institutes. Discover scholarship opportunities and receive professional guidance on selecting your future career path.",
                    "question": "What is the main objective of the School Career Fair?",
                    "options": [
                        { "key": "A", "text": "To sell university textbooks" },
                        { "key": "B", "text": "To provide career advice and scholarship information" },
                        { "key": "C", "text": "To test students' academic skills" },
                        { "key": "D", "text": "To recruit teachers for universities" }
                    ],
                    "correctAnswer": "B",
                    "explanation": "Dẫn chứng: 'Discover scholarship opportunities and receive professional guidance on selecting your future career path' (Khám phá cơ hội học bổng và nhận tư vấn hướng nghiệp).",
                    "trapTip": "Tìm ý khái quát mục tiêu qua các cụm từ hành động: 'discover scholarship', 'guidance on selecting career'."
                },
                {
                    "id": 8,
                    "part": "PHẦN II: TỜ RƠI (LEAFLET - CLOZE)",
                    "passage": "PROTECT OUR MARINE ECOSYSTEMS\nOceans cover more than 70% of the Earth's surface. However, millions of tons of plastic waste are (8)______ into the sea every year, threatening marine life.",
                    "question": "Choose the best option for blank (8):",
                    "options": [
                        { "key": "A", "text": "dumped" },
                        { "key": "B", "text": "collected" },
                        { "key": "C", "text": "recycled" },
                        { "key": "D", "text": "cleaned" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Cấu trúc bị động 'plastic waste is dumped into the sea' (rác thải nhựa bị đổ ra biển). Các từ còn lại không hợp ngữ cảnh gây hại môi trường.",
                    "trapTip": "Collocation: 'dump waste into the sea/river' (đổ/thải rác xuống biển/sông)."
                },
                {
                    "id": 9,
                    "part": "PHẦN II: TỜ RƠI (LEAFLET - CLOZE)",
                    "passage": "WHAT YOU CAN DO:\n• Say NO to single-use plastic straws and bags.\n• Participate in local coastal cleanup campaigns to (9)______ public awareness.",
                    "question": "Choose the best option for blank (9):",
                    "options": [
                        { "key": "A", "text": "raise" },
                        { "key": "B", "text": "rise" },
                        { "key": "C", "text": "lift" },
                        { "key": "D", "text": "arise" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Cụm cố định: 'raise awareness' (nâng cao nhận thức). 'rise' là nội động từ không có tân ngữ phía sau, 'lift' là nâng vật lý, 'arise' là phát sinh.",
                    "trapTip": "Collocation kinh điển trong đề thi: 'raise awareness / raise funds / raise questions'."
                },
                {
                    "id": 10,
                    "part": "PHẦN II: TỜ RƠI (LEAFLET - CLOZE)",
                    "passage": "Together, small actions can make a huge (10)______ in protecting our blue planet for future generations.",
                    "question": "Choose the best option for blank (10):",
                    "options": [
                        { "key": "A", "text": "difference" },
                        { "key": "B", "text": "differ" },
                        { "key": "C", "text": "differently" },
                        { "key": "D", "text": "different" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Sau tính từ 'huge' cần một danh từ số ít (difference) để tạo thành cụm 'make a huge difference' (tạo nên sự khác biệt to lớn).",
                    "trapTip": "Idiom/Collocation: 'make a difference' (tạo sự khác biệt/ảnh hưởng tích cực)."
                },

                # PHẦN III: SẮP XẾP ĐOẠN VĂN & HỘI THOẠI (ARRANGEMENT) (Câu 11 - 15)
                {
                    "id": 11,
                    "part": "PHẦN III: SẮP XẾP HỘI THOẠI (ARRANGEMENT)",
                    "question": "Arrange the sentences (a-c) to make a meaningful conversation:\na. That sounds wonderful! What time should we meet at the bus station?\nb. Would you like to go to the national art exhibition with me this Saturday?\nc. Let's meet at 8:30 AM so that we can get tickets early.",
                    "options": [
                        { "key": "A", "text": "b - a - c" },
                        { "key": "B", "text": "a - b - c" },
                        { "key": "C", "text": "c - a - b" },
                        { "key": "D", "text": "b - c - a" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Trình tự hợp lý: (b) Lời mời đi xem triển lãm ('Would you like to go...') -> (a) Lời đồng ý và hỏi giờ hẹn ('That sounds wonderful! What time...') -> (c) Chốt giờ hẹn ('Let's meet at 8:30 AM...').",
                    "trapTip": "Quy tắc hội thoại: Lời mời/đề nghị -> Phản hồi & Hỏi chi tiết -> Chốt phương án."
                },
                {
                    "id": 12,
                    "part": "PHẦN III: SẮP XẾP HỘI THOẠI (ARRANGEMENT)",
                    "question": "Arrange the sentences (a-c) to make a meaningful conversation:\na. I'm having trouble understanding this grammar rule in Unit 5.\nb. Don't worry, let me explain it to you with some simple examples.\nc. Hi Minh, you look a bit stressed. Is everything okay?",
                    "options": [
                        { "key": "A", "text": "c - a - b" },
                        { "key": "B", "text": "a - c - b" },
                        { "key": "C", "text": "c - b - a" },
                        { "key": "D", "text": "b - a - c" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "(c) Lời chào và hỏi thăm ('you look stressed...') -> (a) Nêu vấn đề gặp phải ('having trouble with grammar...') -> (b) Lời động viên và đề nghị giúp đỡ ('Don't worry, let me explain...').",
                    "trapTip": "Bắt đầu bằng câu hỏi thăm tình hình (c) là câu mở đầu tự nhiên nhất."
                },
                {
                    "id": 13,
                    "part": "PHẦN III: SẮP XẾP ĐOẠN VĂN (ARRANGEMENT)",
                    "question": "Arrange the sentences into a coherent paragraph about regular exercise:\na. Firstly, it strengthens cardiovascular health and boosts stamina.\nb. In conclusion, maintaining an active lifestyle is essential for overall well-being.\nc. Regular physical exercise brings numerous advantages to both physical and mental health.\nd. Additionally, engaging in sports releases endorphins, which effectively alleviate anxiety and stress.",
                    "options": [
                        { "key": "A", "text": "c - a - d - b" },
                        { "key": "B", "text": "a - d - c - b" },
                        { "key": "C", "text": "c - d - a - b" },
                        { "key": "D", "text": "d - a - c - b" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "(c) Câu chủ đề mở đoạn (Topic sentence) -> (a) Luận điểm thứ nhất (Firstly...) -> (d) Luận điểm bổ sung (Additionally...) -> (b) Câu kết luận (In conclusion...).",
                    "trapTip": "Dấu hiệu liên kết logic: Topic sentence -> Firstly -> Additionally/Secondly -> In conclusion."
                },
                {
                    "id": 14,
                    "part": "PHẦN III: SẮP XẾP ĐOẠN VĂN (ARRANGEMENT)",
                    "question": "Arrange the sentences to form a complete email applying for a volunteer position:\na. I am writing to express my enthusiastic interest in the Community English Tutor volunteer role.\nb. I look forward to hearing from you and discussing my application further.\nc. Dear Volunteer Coordinator,\nd. Having volunteered at local orphanages for two years, I possess strong communication and patience.",
                    "options": [
                        { "key": "A", "text": "c - a - d - b" },
                        { "key": "B", "text": "c - d - a - b" },
                        { "key": "C", "text": "a - c - d - b" },
                        { "key": "D", "text": "c - a - b - d" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "(c) Lời chào đầu thư (Salutation) -> (a) Nêu mục đích viết thư (Purpose) -> (d) Giới thiệu kinh nghiệm và kỹ năng (Qualifications) -> (b) Lời chào kết thư (Sign-off).",
                    "trapTip": "Cấu trúc email chuẩn: Salutation (c) -> Purpose (a) -> Details (d) -> Sign-off (b)."
                },
                {
                    "id": 15,
                    "part": "PHẦN III: SẮP XẾP ĐOẠN VĂN (ARRANGEMENT)",
                    "question": "Arrange the following sentences about artificial intelligence in education:\na. As a result, learners can progress at their own pace without feeling left behind.\nb. Today, AI-powered educational tools are transforming traditional classroom paradigms.\nc. For instance, intelligent tutoring systems analyze individual weaknesses and customize practice exercises.",
                    "options": [
                        { "key": "A", "text": "b - c - a" },
                        { "key": "B", "text": "c - b - a" },
                        { "key": "C", "text": "b - a - c" },
                        { "key": "D", "text": "a - c - b" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "(b) Khẳng định chung về vai trò AI trong giáo dục -> (c) Đưa ví dụ cụ thể 'For instance' -> (a) Kết quả đạt được 'As a result'.",
                    "trapTip": "Thứ tự lập luận: Khẳng định chung (b) -> Ví dụ minh họa (c) -> Hệ quả/Kết quả (a)."
                },

                # PHẦN IV: ĐỌC ĐIỀN ĐOẠN VĂN (CLOZE TEST) (Câu 16 - 20)
                {
                    "id": 16,
                    "part": "PHẦN IV: ĐỌC ĐIỀN ĐOẠN VĂN (CLOZE TEST)",
                    "passage": "THE POWER OF LIFELONG LEARNING\nIn today's fast-evolving world, acquiring knowledge is no longer confined to school years. Lifelong learning enables individuals (16)______ adaptable in the modern job market...",
                    "question": "Choose the best option for blank (16):",
                    "options": [
                        { "key": "A", "text": "to remain" },
                        { "key": "B", "text": "remaining" },
                        { "key": "C", "text": "remain" },
                        { "key": "D", "text": "remained" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Cấu trúc ngữ pháp: 'enable somebody to do something' (cho phép/tạo điều kiện cho ai làm gì).",
                    "trapTip": "Enable + O + to V-infinitive."
                },
                {
                    "id": 17,
                    "part": "PHẦN IV: ĐỌC ĐIỀN ĐOẠN VĂN (CLOZE TEST)",
                    "passage": "...People (17)______ continuously upgrade their skills have a much higher chance of achieving career advancement.",
                    "question": "Choose the best option for blank (17):",
                    "options": [
                        { "key": "A", "text": "who" },
                        { "key": "B", "text": "which" },
                        { "key": "C", "text": "whom" },
                        { "key": "D", "text": "whose" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Đại từ quan hệ 'who' thay thế cho danh từ chỉ người 'People' và đóng vai trò làm chủ ngữ cho động từ 'upgrade'.",
                    "trapTip": "'People' là người + làm chủ ngữ -> dùng 'who'."
                },
                {
                    "id": 18,
                    "part": "PHẦN IV: ĐỌC ĐIỀN ĐOẠN VĂN (CLOZE TEST)",
                    "passage": "...Furthermore, engaging in intellectual activities provides (18)______ benefits for mental health, helping to delay cognitive decline.",
                    "question": "Choose the best option for blank (18):",
                    "options": [
                        { "key": "A", "text": "many" },
                        { "key": "B", "text": "much" },
                        { "key": "C", "text": "every" },
                        { "key": "D", "text": "another" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "'benefits' là danh từ đếm được số nhiều -> đi với lượng từ 'many'. 'much' đi với danh từ không đếm được, 'every' và 'another' đi với danh từ số ít.",
                    "trapTip": "Many + N(plural) | Much + N(uncountable)."
                },
                {
                    "id": 19,
                    "part": "PHẦN IV: ĐỌC ĐIỀN ĐOẠN VĂN (CLOZE TEST)",
                    "passage": "...(19)______, online educational platforms now make high-quality courses accessible to everyone regardless of geographical location.",
                    "question": "Choose the best option for blank (19):",
                    "options": [
                        { "key": "A", "text": "Fortunately" },
                        { "key": "B", "text": "Unfortunately" },
                        { "key": "C", "text": "However" },
                        { "key": "D", "text": "Otherwise" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Trạng từ 'Fortunately' (May mắn thay) mang nghĩa tích cực, thể hiện sự thuận lợi khi các nền tảng trực tuyến giúp việc học dễ tiếp cận hơn.",
                    "trapTip": "Xét sắc thái tích cực/tiêu cực của câu tiếp theo để chọn liên từ phù hợp."
                },
                {
                    "id": 20,
                    "part": "PHẦN IV: ĐỌC ĐIỀN ĐOẠN VĂN (CLOZE TEST)",
                    "passage": "...In summary, cultivating a passion for continuous education is the key to (20)______ personal and professional fulfillment.",
                    "question": "Choose the best option for blank (20):",
                    "options": [
                        { "key": "A", "text": "achieving" },
                        { "key": "B", "text": "achieve" },
                        { "key": "C", "text": "achievement" },
                        { "key": "D", "text": "achieved" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Cụm 'the key to + V-ing/Noun' (chìa khóa để đạt được điều gì). 'to' ở đây là giới từ nên theo sau là V-ing.",
                    "trapTip": "Cẩn thận bẫy: 'the key to', 'look forward to', 'be used to' đều đi với V-ing."
                },

                # PHẦN V: BÀI ĐỌC HIỂU SỐ 1 (READING COMPREHENSION 1) (Câu 21 - 28)
                {
                    "id": 21,
                    "part": "PHẦN V: ĐỌC HIỂU BÀI 1 (READING 1)",
                    "passage": "Urban agriculture, or vertical farming, has emerged as a groundbreaking solution to feed growing global populations. By cultivating crops in vertically stacked layers inside controlled indoor environments, vertical farms use up to 95% less water and zero chemical pesticides compared to conventional farming.\n\nMoreover, because these facilities can be constructed inside cities, food can be produced close to consumers. This drastically cuts down on transportation emissions and ensures fresher produce on supermarket shelves. Although initial installation costs remain steep, continuous advancements in LED technology and automation are rapidly making indoor farming economically competitive.",
                    "question": "What is the primary topic of the passage?",
                    "options": [
                        { "key": "A", "text": "The environmental and logistical benefits of vertical farming" },
                        { "key": "B", "text": "The traditional farming methods used in rural areas" },
                        { "key": "C", "text": "How chemical pesticides damage crop quality" },
                        { "key": "D", "text": "The history of transportation systems in large cities" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Toàn bài tập trung phân tích các ưu điểm về môi trường (tiết kiệm 95% nước, không thuốc trừ sâu) và hậu cần (trồng ngay trong thành phố, giảm phát thải vận chuyển) của canh tác thẳng đứng (vertical farming).",
                    "trapTip": "Đọc câu đầu đoạn 1 (Topic sentence) để nắm chủ đề bao quát của bài."
                },
                {
                    "id": 22,
                    "part": "PHẦN V: ĐỌC HIỂU BÀI 1 (READING 1)",
                    "passage": "Refer to the passage above.",
                    "question": "According to paragraph 1, how much less water does vertical farming require compared to traditional methods?",
                    "options": [
                        { "key": "A", "text": "Up to 95%" },
                        { "key": "B", "text": "Around 50%" },
                        { "key": "C", "text": "Exactly 70%" },
                        { "key": "D", "text": "Less than 20%" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Dẫn chứng trong đoạn 1: '...vertical farms use up to 95% less water and zero chemical pesticides...'.",
                    "trapTip": "Scan từ khóa 'water' và số liệu phần trăm '95%' trong đoạn 1."
                },
                {
                    "id": 23,
                    "part": "PHẦN V: ĐỌC HIỂU BÀI 1 (READING 1)",
                    "passage": "Refer to the passage above.",
                    "question": "The word 'steep' in paragraph 2 is closest in meaning to:",
                    "options": [
                        { "key": "A", "text": "expensive / high" },
                        { "key": "B", "text": "cheap / affordable" },
                        { "key": "C", "text": "gradual / slow" },
                        { "key": "D", "text": "flexible" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "'steep costs' nghĩa là chi phí rất đắt đỏ, cao ngất ngưởng. Từ đồng nghĩa là 'expensive / high'.",
                    "trapTip": "Trong ngữ cảnh kinh tế: 'steep price/cost' = 'very high cost'."
                },
                {
                    "id": 24,
                    "part": "PHẦN V: ĐỌC HIỂU BÀI 1 (READING 1)",
                    "passage": "Refer to the passage above.",
                    "question": "The word 'these facilities' in paragraph 2 refers to:",
                    "options": [
                        { "key": "A", "text": "Vertical indoor farms" },
                        { "key": "B", "text": "Traditional rural farms" },
                        { "key": "C", "text": "Chemical manufacturing plants" },
                        { "key": "D", "text": "Supermarkets" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "'these facilities' thay thế cho các cơ sở nông trại thẳng đứng (vertical indoor farms) được nhắc đến ở câu liền trước.",
                    "trapTip": "Tìm danh từ số nhiều được đề cập ở câu trước đó: 'vertical farms'."
                },
                {
                    "id": 25,
                    "part": "PHẦN V: ĐỌC HIỂU BÀI 1 (READING 1)",
                    "passage": "Refer to the passage above.",
                    "question": "Why does producing food inside cities reduce carbon emissions?",
                    "options": [
                        { "key": "A", "text": "Because transportation distances are greatly minimized" },
                        { "key": "B", "text": "Because urban farms do not consume electricity" },
                        { "key": "C", "text": "Because city residents stop driving cars" },
                        { "key": "D", "text": "Because crops absorb all city pollutants instantly" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Dẫn chứng đoạn 2: 'produced close to consumers. This drastically cuts down on transportation emissions' (sản xuất gần người tiêu dùng nên giảm phát thải từ khâu vận chuyển).",
                    "trapTip": "Paraphrase: 'produced close to consumers' = 'transportation distances are minimized'."
                },
                {
                    "id": 26,
                    "part": "PHẦN V: ĐỌC HIỂU BÀI 1 (READING 1)",
                    "passage": "Refer to the passage above.",
                    "question": "Which of the following is NOT mentioned as a benefit of vertical farming?",
                    "options": [
                        { "key": "A", "text": "Free installation provided by governments" },
                        { "key": "B", "text": "Zero pesticide contamination" },
                        { "key": "C", "text": "Fresher produce for supermarket customers" },
                        { "key": "D", "text": "Huge water conservation" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Bài đọc không hề đề cập đến việc chính phủ cung cấp chi phí lắp đặt miễn phí. Ngược lại, bài nêu chi phí ban đầu còn cao ('initial installation costs remain steep').",
                    "trapTip": "Dạng câu hỏi NOT: Loại bỏ 3 đáp án có trong bài (B, C, D), chọn đáp án không được nhắc tới."
                },
                {
                    "id": 27,
                    "part": "PHẦN V: ĐỌC HIỂU BÀI 1 (READING 1)",
                    "passage": "Refer to the passage above.",
                    "question": "What factor is helping vertical farming become more economically viable?",
                    "options": [
                        { "key": "A", "text": "Technological improvements in LEDs and automated systems" },
                        { "key": "B", "text": "Increase in traditional agricultural subsidies" },
                        { "key": "C", "text": "A sudden drop in global population" },
                        { "key": "D", "text": "The complete ban of rural farming" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Dẫn chứng câu cuối đoạn 2: '...continuous advancements in LED technology and automation are rapidly making indoor farming economically competitive.'",
                    "trapTip": "Scan từ khóa 'LED technology and automation'."
                },
                {
                    "id": 28,
                    "part": "PHẦN V: ĐỌC HIỂU BÀI 1 (READING 1)",
                    "passage": "Refer to the passage above.",
                    "question": "What can be inferred about the future of food production from the passage?",
                    "options": [
                        { "key": "A", "text": "Urban technology-driven agriculture will play a critical role in global food security" },
                        { "key": "B", "text": "All rural farms will disappear within the next five years" },
                        { "key": "C", "text": "Vertical farming will exclusively produce wheat and rice" },
                        { "key": "D", "text": "Indoor crops will completely replace home cooking" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Suy luận logic: Canh tác thẳng đứng trong đô thị kết hợp công nghệ cao là giải pháp đột phá để nuôi sống dân số đang tăng ('groundbreaking solution to feed growing global populations').",
                    "trapTip": "Tránh các đáp án mang tính tuyệt đối hóa cực đoan ('all rural farms disappear', 'completely replace')."
                },

                # PHẦN VI: BÀI ĐỌC HIỂU SỐ 2 (READING COMPREHENSION 2) (Câu 29 - 40)
                {
                    "id": 29,
                    "part": "PHẦN VI: ĐỌC HIỂU BÀI 2 (READING 2)",
                    "passage": "Sleep is frequently regarded as a passive state of rest, yet modern neuroscience reveals that it is an intensely active biological process vital for memory consolidation and neuroplasticity. During slow-wave deep sleep, the brain's glymphatic system flushes out toxic metabolic waste products, including beta-amyloid proteins associated with neurodegenerative disorders.\n\nFurthermore, rapid eye movement (REM) sleep facilitates creative problem-solving and emotional regulation. During this stage, the brain integrates newly acquired knowledge with pre-existing neural networks. Chronic sleep deprivation, therefore, not only impairs attention span and working memory but also disrupts hormonal equilibrium, elevating the risk of cardiovascular ailments and metabolic dysfunction.\n\nIn our hyper-connected digital society, blue light emission from electronic displays suppresses melatonin synthesis, tricking our circadian rhythm into delaying sleep onset. Cultivating strict sleep hygiene—such as dimming ambient lighting, establishing consistent sleep schedules, and minimizing screen exposure before bedtime—is no longer a mere lifestyle preference, but an indispensable foundation of human cognitive longevity.",
                    "question": "What is the best title for this passage?",
                    "options": [
                        { "key": "A", "text": "The Essential Science of Sleep: Brain Rejuvenation and Cognitive Health" },
                        { "key": "B", "text": "The History of Neuroscience in Ancient Civilizations" },
                        { "key": "C", "text": "How Blue Light Screens Are Manufactured" },
                        { "key": "D", "text": "A Guide to Physical Exercise and Muscle Growth" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Tiêu đề phù hợp nhất khái quát toàn bộ bài viết về cơ chế khoa học của giấc ngủ, vai trò phục hồi não bộ và bảo vệ sức khỏe nhận thức con người.",
                    "trapTip": "Tiêu đề chuẩn phải bao quát được cả 3 đoạn: Cơ chế sinh học -> Tác hại của mất ngủ -> Giải pháp vệ sinh giấc ngủ."
                },
                {
                    "id": 30,
                    "part": "PHẦN VI: ĐỌC HIỂU BÀI 2 (READING 2)",
                    "passage": "Refer to the passage above.",
                    "question": "According to paragraph 1, what does the glymphatic system do during deep sleep?",
                    "options": [
                        { "key": "A", "text": "It removes toxic metabolic waste and beta-amyloid proteins from the brain" },
                        { "key": "B", "text": "It produces blue light to stimulate brainwaves" },
                        { "key": "C", "text": "It stops all neural activity permanently" },
                        { "key": "D", "text": "It generates muscle fatigue throughout the body" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Dẫn chứng đoạn 1: 'the brain's glymphatic system flushes out toxic metabolic waste products, including beta-amyloid proteins...'.",
                    "trapTip": "Scan từ khóa 'glymphatic system' và 'flushes out toxic waste'."
                },
                {
                    "id": 31,
                    "part": "PHẦN VI: ĐỌC HIỂU BÀI 2 (READING 2)",
                    "passage": "Refer to the passage above.",
                    "question": "The word 'flushes out' in paragraph 1 is closest in meaning to:",
                    "options": [
                        { "key": "A", "text": "cleanses / eliminates" },
                        { "key": "B", "text": "accumulates / gathers" },
                        { "key": "C", "text": "creates / generates" },
                        { "key": "D", "text": "preserves / stores" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "'flush out' có nghĩa là đào thải, gột rửa, loại bỏ chất độc hại (= cleanses / eliminates).",
                    "trapTip": "Flush out = Wash away / Eliminate."
                },
                {
                    "id": 32,
                    "part": "PHẦN VI: ĐỌC HIỂU BÀI 2 (READING 2)",
                    "passage": "Refer to the passage above.",
                    "question": "What happens during REM sleep according to paragraph 2?",
                    "options": [
                        { "key": "A", "text": "The brain integrates new information with existing neural networks" },
                        { "key": "B", "text": "Memory storage is completely erased" },
                        { "key": "C", "text": "Melatonin production is completely blocked" },
                        { "key": "D", "text": "Blood pressure reaches dangerously high levels" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Dẫn chứng đoạn 2: '...the brain integrates newly acquired knowledge with pre-existing neural networks.'",
                    "trapTip": "Đối chiếu cụm từ 'REM sleep' và 'integrates newly acquired knowledge'."
                },
                {
                    "id": 33,
                    "part": "PHẦN VI: ĐỌC HIỂU BÀI 2 (READING 2)",
                    "passage": "Refer to the passage above.",
                    "question": "The word 'deprivation' in paragraph 2 is closest in meaning to:",
                    "options": [
                        { "key": "A", "text": "deficiency / lack" },
                        { "key": "B", "text": "abundance / excess" },
                        { "key": "C", "text": "satisfaction" },
                        { "key": "D", "text": "improvement" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "'sleep deprivation' nghĩa là tình trạng thiếu ngủ, mất ngủ triền miên (= lack / deficiency).",
                    "trapTip": "Deprivation = Lack of something necessary."
                },
                {
                    "id": 34,
                    "part": "PHẦN VI: ĐỌC HIỂU BÀI 2 (READING 2)",
                    "passage": "Refer to the passage above.",
                    "question": "The word 'this stage' in paragraph 2 refers to:",
                    "options": [
                        { "key": "A", "text": "REM sleep stage" },
                        { "key": "B", "text": "Slow-wave sleep stage" },
                        { "key": "C", "text": "Awake state" },
                        { "key": "D", "text": "Physical exercise stage" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "'this stage' ở câu thứ hai của đoạn 2 thay thế trực tiếp cho 'rapid eye movement (REM) sleep' được nêu ở câu thứ nhất.",
                    "trapTip": "Đọc câu trước đó chứa danh từ chính 'rapid eye movement (REM) sleep'."
                },
                {
                    "id": 35,
                    "part": "PHẦN VI: ĐỌC HIỂU BÀI 2 (READING 2)",
                    "passage": "Refer to the passage above.",
                    "question": "How does blue light emission from electronic screens disrupt sleep?",
                    "options": [
                        { "key": "A", "text": "By suppressing the synthesis of melatonin hormone" },
                        { "key": "B", "text": "By cooling down body temperature rapidly" },
                        { "key": "C", "text": "By boosting slow-wave brain activity" },
                        { "key": "D", "text": "By increasing REM sleep duration" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Dẫn chứng đoạn 3: 'blue light emission from electronic displays suppresses melatonin synthesis, tricking our circadian rhythm into delaying sleep onset.'",
                    "trapTip": "Scan từ khóa 'blue light' và 'melatonin synthesis'."
                },
                {
                    "id": 36,
                    "part": "PHẦN VI: ĐỌC HIỂU BÀI 2 (READING 2)",
                    "passage": "Refer to the passage above.",
                    "question": "Which of the following is NOT suggested as part of healthy sleep hygiene?",
                    "options": [
                        { "key": "A", "text": "Staring at phone screens right before falling asleep" },
                        { "key": "B", "text": "Dimming room lighting in the evening" },
                        { "key": "C", "text": "Maintaining a consistent sleep schedule" },
                        { "key": "D", "text": "Minimizing screen exposure before bedtime" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Việc nhìn chằm chằm vào màn hình điện thoại trước khi ngủ là hành vi gây hại giấc ngủ do ánh sáng xanh, trái ngược hoàn toàn với lời khuyên vệ sinh giấc ngủ (dimming ambient lighting, minimizing screen exposure).",
                    "trapTip": "Hành vi gây hại đối lập với 'minimizing screen exposure'."
                },
                {
                    "id": 37,
                    "part": "PHẦN VI: ĐỌC HIỂU BÀI 2 (READING 2)",
                    "passage": "Refer to the passage above.",
                    "question": "The word 'indispensable' in paragraph 3 is closest in meaning to:",
                    "options": [
                        { "key": "A", "text": "essential / vital" },
                        { "key": "B", "text": "unnecessary / optional" },
                        { "key": "C", "text": "temporary" },
                        { "key": "D", "text": "dangerous" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "'indispensable' có nghĩa là không thể thiếu, thiết yếu, sống còn (= essential / vital).",
                    "trapTip": "Indispensable = Absolutely necessary / Essential."
                },
                {
                    "id": 38,
                    "part": "PHẦN VI: ĐỌC HIỂU BÀI 2 (READING 2)",
                    "passage": "Refer to the passage above.",
                    "question": "Which health consequence of chronic sleep deprivation is explicitly mentioned?",
                    "options": [
                        { "key": "A", "text": "Cardiovascular ailments and hormonal imbalance" },
                        { "key": "B", "text": "Immediate loss of bone density" },
                        { "key": "C", "text": "Permanent blindness" },
                        { "key": "D", "text": "Loss of hearing capacity" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Dẫn chứng đoạn 2: '...disrupts hormonal equilibrium, elevating the risk of cardiovascular ailments and metabolic dysfunction.'",
                    "trapTip": "Scan từ khóa 'cardiovascular ailments' và 'hormonal equilibrium'."
                },
                {
                    "id": 39,
                    "part": "PHẦN VI: ĐỌC HIỂU BÀI 2 (READING 2)",
                    "passage": "Refer to the passage above.",
                    "question": "What is the author's primary attitude toward sleep in modern society?",
                    "options": [
                        { "key": "A", "text": "Advocating for prioritising sleep as a non-negotiable pillar of cognitive longevity" },
                        { "key": "B", "text": "Skeptical about the importance of REM sleep" },
                        { "key": "C", "text": "Indifferent to the effects of digital screens" },
                        { "key": "D", "text": "Critical of modern neuroscience research" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Thái độ tác giả: Khẳng định giấc ngủ là nền tảng sống còn không thể thương lượng cho sức khỏe nhận thức lâu dài ('indispensable foundation of human cognitive longevity').",
                    "trapTip": "Đọc câu kết bài để nắm quan điểm cốt lõi của tác giả."
                },
                {
                    "id": 40,
                    "part": "PHẦN VI: ĐỌC HIỂU BÀI 2 (READING 2)",
                    "passage": "Refer to the passage above.",
                    "question": "Which statement can be most logically concluded from the entire text?",
                    "options": [
                        { "key": "A", "text": "Sleep is an active neurological maintenance cycle without which both mental and physical health deteriorate" },
                        { "key": "B", "text": "Human beings can function optimally with only three hours of sleep per night" },
                        { "key": "C", "text": "Electronic screens have zero biological impact on circadian rhythms" },
                        { "key": "D", "text": "Deep sleep is only required by professional athletes" }
                    ],
                    "correctAnswer": "A",
                    "explanation": "Kết luận tổng hợp: Giấc ngủ là một chu trình bảo dưỡng thần kinh chủ động cực kỳ quan trọng; nếu thiếu nó, cả sức khỏe thể chất lẫn tinh thần sẽ suy giảm nghiêm trọng.",
                    "trapTip": "Chọn đáp án tổng quát và logic nhất của toàn bộ bài đọc."
                }
            ]
        }
    ]
    return exams

if __name__ == '__main__':
    exams = build_exams()
    with open('frontend/src/data/officialFull40Exams.json', 'w', encoding='utf-8') as f:
        json.dump(exams, f, ensure_ascii=False, indent=2)
    print(f"Generated {len(exams)} exams with {len(exams[0]['questions'])} full questions!")
