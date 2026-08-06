import json
import os

def generate_level_questions():
    # Ngân hàng câu hỏi Tiếng Anh tổng quát phân theo Trình độ kỹ năng (CEFR: A1, A2, B1, B2, C1) 
    # và Khối lớp (6 - 12) phù hợp cho học sinh luyện tập giao tiếp và chấm phát âm thực tế.
    
    questions_by_level = {
        "A1": [
            {"id": 1001, "text": "Hello, my name is Alex and I am happy to meet you.", "level": "Trình độ A1 - Cơ bản", "difficulty": -2.5},
            {"id": 1002, "text": "Where are you from and what is your favorite food?", "level": "Trình độ A1 - Giao tiếp", "difficulty": -2.4},
            {"id": 1003, "text": "I live in a peaceful town with my family.", "level": "Trình độ A1 - Đời sống", "difficulty": -2.3},
            {"id": 1004, "text": "What time do you usually wake up in the morning?", "level": "Trình độ A1 - Thói quen", "difficulty": -2.2},
            {"id": 1005, "text": "My mother is a doctor and my father is a teacher.", "level": "Trình độ A1 - Gia đình", "difficulty": -2.1},
            {"id": 1006, "text": "Can you please tell me how to get to the nearest bus stop?", "level": "Trình độ A1 - Hỏi đường", "difficulty": -2.0},
            {"id": 1007, "text": "I like listening to music when I have free time.", "level": "Trình độ A1 - Sở thích", "difficulty": -1.9},
            {"id": 1008, "text": "How much does this pair of shoes cost?", "level": "Trình độ A1 - Mua sắm", "difficulty": -1.8},
            {"id": 1009, "text": "Today the weather is very nice and warm.", "level": "Trình độ A1 - Thời tiết", "difficulty": -1.7},
            {"id": 1010, "text": "Would you like a cup of hot tea or coffee?", "level": "Trình độ A1 - Giao tiếp", "difficulty": -1.6},
            {"id": 1011, "text": "I have two dogs and a small white cat at home.", "level": "Trình độ A1 - Thú cưng", "difficulty": -1.5},
            {"id": 1012, "text": "My favorite school subject is English because it is useful.", "level": "Trình độ A1 - Học tập", "difficulty": -1.4},
            {"id": 1013, "text": "What are your plans for this coming weekend?", "level": "Trình độ A1 - Cuối tuần", "difficulty": -1.3},
            {"id": 1014, "text": "Excuse me, where is the main library located?", "level": "Trình độ A1 - Hỏi đường", "difficulty": -1.2},
            {"id": 1015, "text": "We should eat fresh fruits to stay healthy.", "level": "Trình độ A1 - Sức khỏe", "difficulty": -1.1},
            {"id": 1016, "text": "She enjoys reading books before going to sleep.", "level": "Trình độ A1 - Sở thích", "difficulty": -1.0},
            {"id": 1017, "text": "Do you enjoy playing sports like football or tennis?", "level": "Trình độ A1 - Thể thao", "difficulty": -0.9},
            {"id": 1018, "text": "I usually go to school by bicycle every morning.", "level": "Trình độ A1 - Đi lại", "difficulty": -0.8},
            {"id": 1019, "text": "Please turn off the lights when you leave the room.", "level": "Trình độ A1 - Đời sống", "difficulty": -0.7},
            {"id": 1020, "text": "Learning new words every day is a great habit.", "level": "Trình độ A1 - Học tập", "difficulty": -0.6}
        ],
        "A2": [
            {"id": 2001, "text": "I am planning to visit my grandparents during the next vacation.", "level": "Trình độ A2 - Du lịch", "difficulty": -0.5},
            {"id": 2002, "text": "Could you please speak a little slower so I can understand better?", "level": "Trình độ A2 - Giao tiếp", "difficulty": -0.4},
            {"id": 2003, "text": "Doing outdoor exercise is good for both your physical and mental health.", "level": "Trình độ A2 - Sức khỏe", "difficulty": -0.3},
            {"id": 2004, "text": "In my opinion, learning English online gives students more flexibility.", "level": "Trình độ A2 - Ý kiến", "difficulty": -0.2},
            {"id": 2005, "text": "Many students enjoy joining social clubs to make new friends.", "level": "Trình độ A2 - Trường học", "difficulty": -0.1},
            {"id": 2006, "text": "Environmental pollution is a serious problem in modern cities.", "level": "Trình độ A2 - Môi trường", "difficulty": 0.0},
            {"id": 2007, "text": "We decided to stay home because it was raining heavily outside.", "level": "Trình độ A2 - Giao tiếp", "difficulty": 0.1},
            {"id": 2008, "text": "Technology has changed the way people communicate with each other.", "level": "Trình độ A2 - Công nghệ", "difficulty": 0.2},
            {"id": 2009, "text": "What is the most memorable experience you have ever had?", "level": "Trình độ A2 - Kỷ niệm", "difficulty": 0.3},
            {"id": 2010, "text": "Recycling plastic waste helps protect marine life and nature.", "level": "Trình độ A2 - Môi trường", "difficulty": 0.4},
            {"id": 2011, "text": "He has been practicing speaking English for over two years.", "level": "Trình độ A2 - Học tập", "difficulty": 0.5},
            {"id": 2012, "text": "Public transport is much cheaper and more convenient than private cars.", "level": "Trình độ A2 - Đi lại", "difficulty": 0.6},
            {"id": 2013, "text": "Volunteering is a great way to support poor people in your city.", "level": "Trình độ A2 - Xã hội", "difficulty": 0.7},
            {"id": 2014, "text": "She hopes to improve her pronunciation skills by using AI software.", "level": "Trình độ A2 - Phát âm", "difficulty": 0.8},
            {"id": 2015, "text": "Eating balanced meals regularly prevents many common diseases.", "level": "Trình độ A2 - Sức khỏe", "difficulty": 0.9},
            {"id": 2016, "text": "Our class is going on a field trip to the national museum next week.", "level": "Trình độ A2 - Dã ngoại", "difficulty": 0.95},
            {"id": 2017, "text": "Learning a new language opens up wonderful opportunities for travel.", "level": "Trình độ A2 - Ngoại ngữ", "difficulty": 0.98},
            {"id": 2018, "text": "They spent the whole afternoon playing board games together at home.", "level": "Trình độ A2 - Giải trí", "difficulty": 1.0}
        ],
        "B1": [
            {"id": 3001, "text": "Developing good critical thinking skills is essential for student success.", "level": "Trình độ B1 - Kỹ năng", "difficulty": 1.0},
            {"id": 3002, "text": "Renewable energy sources like solar and wind power are sustainable solutions.", "level": "Trình độ B1 - Môi trường", "difficulty": 1.1},
            {"id": 3003, "text": "Social media can have both positive and negative impacts on teenagers.", "level": "Trình độ B1 - Xã hội", "difficulty": 1.2},
            {"id": 3004, "text": "Participating in group discussions helps improve confidence and teamwork.", "level": "Trình độ B1 - Kỹ năng", "difficulty": 1.3},
            {"id": 3005, "text": "Cultural diversity makes our global society much richer and more vibrant.", "level": "Trình độ B1 - Văn hóa", "difficulty": 1.4},
            {"id": 3006, "text": "Independent learning encourages students to explore topics deeply.", "level": "Trình độ B1 - Giáo dục", "difficulty": 1.5},
            {"id": 3007, "text": "Managing time effectively reduces academic pressure during examination periods.", "level": "Trình độ B1 - Học tập", "difficulty": 1.6},
            {"id": 3008, "text": "Global warming poses significant threats to coastal cities worldwide.", "level": "Trình độ B1 - Khí hậu", "difficulty": 1.7},
            {"id": 3009, "text": "Career guidance programs help young people choose suitable career paths.", "level": "Trình độ B1 - Hướng nghiệp", "difficulty": 1.8},
            {"id": 3010, "text": "Preserving historical monuments fosters national pride among citizens.", "level": "Trình độ B1 - Di sản", "difficulty": 1.9},
            {"id": 3011, "text": "Online learning platforms provide flexible study schedules for high school students.", "level": "Trình độ B1 - Học online", "difficulty": 1.92},
            {"id": 3012, "text": "Modern technology has transformed our daily communication habits completely.", "level": "Trình độ B1 - Công nghệ", "difficulty": 1.95},
            {"id": 3013, "text": "Building a healthy routine requires discipline and clear daily objectives.", "level": "Trình độ B1 - Thói quen", "difficulty": 1.98},
            {"id": 3014, "text": "Team sports teach students valuable lessons about collaboration and leadership.", "level": "Trình độ B1 - Thể thao", "difficulty": 2.0},
            {"id": 3015, "text": "Understanding different perspectives is crucial for resolving interpersonal conflicts.", "level": "Trình độ B1 - Giao tiếp", "difficulty": 2.05}
        ],
        "B2": [
            {"id": 4001, "text": "Artificial intelligence is revolutionizing communication, healthcare, and finance.", "level": "Trình độ B2 - Công nghệ", "difficulty": 2.0},
            {"id": 4002, "text": "Globalization promotes economic integration but challenges local cultural identities.", "level": "Trình độ B2 - Kinh tế", "difficulty": 2.1},
            {"id": 4003, "text": "Sustainable development models aim to balance growth with environmental protection.", "level": "Trình độ B2 - Phát triển", "difficulty": 2.2},
            {"id": 4004, "text": "Automation increases productivity while introducing new challenges to the job market.", "level": "Trình độ B2 - Việc làm", "difficulty": 2.3},
            {"id": 4005, "text": "Lifelong learning is crucial for professionals adapting to rapid technological shifts.", "level": "Trình độ B2 - Học tập", "difficulty": 2.4},
            {"id": 4006, "text": "Effective intercultural communication minimizes prejudices in international teams.", "level": "Trình độ B2 - Giao tiếp", "difficulty": 2.5},
            {"id": 4007, "text": "Digital transformation enables institutions to deliver seamless remote services.", "level": "Trình độ B2 - Chuyển đổi số", "difficulty": 2.6},
            {"id": 4008, "text": "Promoting mental health awareness in education reduces student burnout.", "level": "Trình độ B2 - Tâm lý", "difficulty": 2.7},
            {"id": 4009, "text": "Macroeconomic stability encourages foreign investments and fosters long-term prosperity.", "level": "Trình độ B2 - Tài chính", "difficulty": 2.72},
            {"id": 4010, "text": "Biotechnology research plays a vital role in discovering innovative medical treatments.", "level": "Trình độ B2 - Y học", "difficulty": 2.75},
            {"id": 4011, "text": "Environmental conservation demands immediate collective efforts from communities globally.", "level": "Trình độ B2 - Khí hậu", "difficulty": 2.78},
            {"id": 4012, "text": "Ethical considerations must guide the rapid implementation of automated decision systems.", "level": "Trình độ B2 - Đạo đức AI", "difficulty": 2.8},
            {"id": 4013, "text": "Space exploration expands our deep understanding of the cosmos and technological boundaries.", "level": "Trình độ B2 - Vũ trụ", "difficulty": 2.82},
            {"id": 4014, "text": "Urbanization drives architectural innovation while putting pressure on municipal infrastructure.", "level": "Trình độ B2 - Đô thị", "difficulty": 2.85},
            {"id": 4015, "text": "Fostering creative problem-solving skills empowers youth to navigate complex future challenges.", "level": "Trình độ B2 - Tương lai", "difficulty": 2.88}
        ],
        "C1": [
            {"id": 5001, "text": "Addressing global climate change requires unprecedented international diplomatic cooperation.", "level": "Trình độ C1 - Ngoại giao", "difficulty": 2.8},
            {"id": 5002, "text": "Generative artificial intelligence models synthesize complex unstructured data efficiently.", "level": "Trình độ C1 - Khoa học AI", "difficulty": 2.9},
            {"id": 5003, "text": "Interdisciplinary research yields innovative breakthroughs for sustainable agriculture.", "level": "Trình độ C1 - Nghiên cứu", "difficulty": 3.0},
            {"id": 5004, "text": "Implementing rigorous macroeconomic policies stabilizes currency fluctuations effectively.", "level": "Trình độ C1 - Tài chính", "difficulty": 3.1},
            {"id": 5005, "text": "Biotechnology advancements offer profound solutions for hereditary medical conditions.", "level": "Trình độ C1 - Y học", "difficulty": 3.2},
            {"id": 5006, "text": "Quantum computing paradigms promise to solve previously intractable computational problems.", "level": "Trình độ C1 - Lượng tử", "difficulty": 3.22},
            {"id": 5007, "text": "Multilateral international agreements establish governance frameworks for planetary ecosystem preservation.", "level": "Trình độ C1 - Thỏa thuận", "difficulty": 3.24},
            {"id": 5008, "text": "Epistemological inquiry into artificial cognitive architectures redefines our understanding of intelligence.", "level": "Trình độ C1 - Triết học AI", "difficulty": 3.26},
            {"id": 5009, "text": "Socioeconomic disparity mitigation requires comprehensive fiscal reforms and educational equity initiatives.", "level": "Trình độ C1 - Xã hội", "difficulty": 3.28},
            {"id": 5010, "text": "Neuroplasticity mechanisms underlie the extraordinary cognitive adaptability demonstrated throughout human adulthood.", "level": "Trình độ C1 - Não bộ", "difficulty": 3.3},
            {"id": 5011, "text": "Sustainable architectural design integrates passive solar engineering and carbon-neutral construction materials.", "level": "Trình độ C1 - Kiến trúc", "difficulty": 3.32},
            {"id": 5012, "text": "Algorithmic transparency in financial markets prevents systemic risk and guarantees equitable trading.", "level": "Trình độ C1 - Tài chính", "difficulty": 3.34},
            {"id": 5013, "text": "Linguistic diversity preservation safeguards irreplaceable cultural heritage and indigenous ecological wisdom.", "level": "Trình độ C1 - Ngôn ngữ", "difficulty": 3.35},
            {"id": 5014, "text": "Autonomous navigational systems leverage sensor fusion and deep neural networks for real-time decision-making.", "level": "Trình độ C1 - Tự hành", "difficulty": 3.38},
            {"id": 5015, "text": "Diplomatic conflict resolution demands nuanced intercultural negotiation and mutual strategic concessions.", "level": "Trình độ C1 - Hòa bình", "difficulty": 3.4}
        ]
    }

    # Ánh xạ tương đương sang Khối Lớp 6 - 12 để hỗ trợ cả 2 chế độ chọn
    questions_by_level["6"] = questions_by_level["A1"]
    questions_by_level["7"] = questions_by_level["A1"]
    questions_by_level["8"] = questions_by_level["A2"]
    questions_by_level["9"] = questions_by_level["B1"]
    questions_by_level["10"] = questions_by_level["B1"]
    questions_by_level["11"] = questions_by_level["B2"]
    questions_by_level["12"] = questions_by_level["C1"]

    output_path = os.path.join(os.path.dirname(__file__), "questions.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(questions_by_level, f, ensure_ascii=False, indent=2)
    print("Done creating questions.json for CEFR A1-C1 and Grades 6-12!")

if __name__ == "__main__":
    generate_level_questions()
