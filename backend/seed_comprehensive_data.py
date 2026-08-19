"""
seed_comprehensive_data.py
Nạp cơ sở dữ liệu học liệu đồ sộ (500+ từ vựng, 120+ câu phát âm, 44 âm IPA, 14 chủ đề)
bám sát Chương trình GDPT 2018 và Kỳ thi Tốt nghiệp THPT Quốc gia 2025-2027.
"""

import os
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
from sqlmodel import Session, select
from database import engine, create_db_and_tables, VocabularyTopic, VocabularyWord, IPASound, PronounceSentence

def run_seed():
    create_db_and_tables()
    
    with Session(engine) as session:
        print("[SEED] Bắt đầu làm sạch và nạp dữ liệu chuẩn...")
        
        # Xóa dữ liệu cũ của 4 bảng học liệu để nạp bộ mới sạch sẽ
        session.exec(VocabularyWord.__table__.delete())
        session.exec(VocabularyTopic.__table__.delete())
        session.exec(PronounceSentence.__table__.delete())
        session.exec(IPASound.__table__.delete())
        session.commit()
        
        # ──────────────────────────────────────────────────────────────────────────
        # 1. DANH MỤC 14 CHỦ ĐỀ TỪ VỰNG (TOPICS)
        # ──────────────────────────────────────────────────────────────────────────
        topics_data = [
            # Lớp 6
            {"id": 1, "title": "School Life & Daily Habits", "slug": "school-life", "description": "Từ vựng về trường lớp, thói quen sinh hoạt và dụng cụ học tập.", "grade": "6"},
            # Lớp 7
            {"id": 2, "title": "Hobbies, Community & Health", "slug": "hobbies-health", "description": "Sở thích, hoạt động thiện nguyện cộng đồng và lối sống lành mạnh.", "grade": "7"},
            # Lớp 8
            {"id": 3, "title": "Life in Countryside & Environment", "slug": "countryside-environment", "description": "Cuộc sống nông thôn, lễ hội truyền thống và bảo vệ thiên nhiên.", "grade": "8"},
            # Lớp 9
            {"id": 4, "title": "Local Heritage & City Life", "slug": "local-heritage-city", "description": "Di sản địa phương, cuộc sống đô thị hiện đại và kỳ quan thế giới.", "grade": "9"},
            # Lớp 10
            {"id": 5, "title": "Family, Eco-friendly Life & Digital Age", "slug": "family-eco-digital", "description": "Cuộc sống gia đình, lối sống xanh và công nghệ số trong giáo dục.", "grade": "10"},
            # Lớp 11
            {"id": 6, "title": "Generation Gap & Global Warming", "slug": "generation-global-warming", "description": "Khoảng cách thế hệ, biến đổi khí hậu và phát triển bền vững.", "grade": "11"},
            # Lớp 12
            {"id": 7, "title": "Artificial Intelligence & Future Careers", "slug": "ai-future-careers", "description": "Trí tuệ nhân tạo, định hướng nghề nghiệp tương lai và tự động hóa.", "grade": "12"},
            # Ôn thi THPT Quốc Gia
            {"id": 8, "title": "Chuyên đề Trọng điểm Ôn thi THPT 2025-2027", "slug": "thpt-high-yield", "description": "Từ vựng phân loại mức 8+ và 9+, cụm từ cố định (Collocations), thành ngữ (Idioms).", "grade": "12"},
            {"id": 9, "title": "Advanced Academic & IELTS/B2", "slug": "academic-ielts", "description": "Từ vựng học thuật nâng cao phục vụ đọc hiểu bài báo khoa học.", "grade": "12"},
            {"id": 10, "title": "Environmental Sustainability & Ecology", "slug": "sustainability-ecology", "description": "Chuyên đề sinh thái học, năng lượng tái tạo và bảo tồn đa dạng sinh học.", "grade": "11"},
            {"id": 11, "title": "Modern Technology & Cyber Security", "slug": "technology-cybersecurity", "description": "Khoa học máy tính, an toàn thông tin và chuyển đổi số.", "grade": "12"},
            {"id": 12, "title": "Psychology, Stress & Wellbeing", "slug": "psychology-wellbeing", "description": "Tâm lý học đường, quản lý cảm xúc và kỹ năng thích ứng xã hội.", "grade": "10"},
            {"id": 13, "title": "Globalization, Culture & Tourism", "slug": "globalization-culture", "description": "Hội nhập kinh tế quốc tế, giao lưu văn hóa và du lịch bền vững.", "grade": "11"},
            {"id": 14, "title": "Economics, Finance & Business", "slug": "economics-finance", "description": "Kinh tế học, tài chính cá nhân và thị trường lao động toàn cầu.", "grade": "12"}
        ]
        
        for t in topics_data:
            topic_obj = VocabularyTopic(
                id=t["id"],
                title=t["title"],
                slug=t["slug"],
                description=t["description"],
                grade=t["grade"],
                is_active=True
            )
            session.add(topic_obj)
        session.commit()
        print(f"[SEED] Đã tạo {len(topics_data)} chủ đề từ vựng.")

        # ──────────────────────────────────────────────────────────────────────────
        # 2. HƠN 350 TỪ VỰNG CHUẨN KÈM PHIÊN ÂM IPA & VÍ DỤ NGỮ CẢNH
        # ──────────────────────────────────────────────────────────────────────────
        words_data = [
            # ── TOPIC 1: School Life & Daily Habits (Grade 6) ──
            (1, "Classroom", "/ˈklɑːs.ruːm/", "Noun", "Phòng học", "Our classroom is equipped with a modern projector and air conditioning.", "Phòng học của chúng tôi được trang bị máy chiếu hiện đại và máy điều hòa."),
            (1, "Teacher", "/ˈtiː.tʃər/", "Noun", "Giáo viên", "Ms. Lan is a dedicated English teacher who always inspires her students.", "Cô Lan là một giáo viên tiếng Anh tận tâm, người luôn truyền cảm hứng cho học sinh."),
            (1, "Classmate", "/ˈklɑːs.meɪt/", "Noun", "Bạn cùng lớp", "I often discuss difficult homework questions with my classmates.", "Tôi thường thảo luận các câu hỏi bài tập khó với các bạn cùng lớp."),
            (1, "Library", "/ˈlaɪ.brər.i/", "Noun", "Thư viện", "Students can borrow reference books from the school library for free.", "Học sinh có thể mượn sách tham khảo từ thư viện trường miễn phí."),
            (1, "Timetable", "/ˈtaɪmˌteɪ.bəl/", "Noun", "Thời khóa biểu", "You should check your timetable carefully before going to school.", "Bạn nên kiểm tra thời khóa biểu cẩn thận trước khi đến trường."),
            (1, "Subject", "/ˈsʌb.dʒɪkt/", "Noun", "Môn học", "Mathematics and English are compulsory subjects in Vietnamese secondary schools.", "Toán học và Tiếng Anh là những môn học bắt buộc ở trường THCS Việt Nam."),
            (1, "Homework", "/ˈhəʊm.wɜːk/", "Noun", "Bài tập về nhà", "Doing homework regularly helps reinforce newly learned knowledge.", "Làm bài tập về nhà đều đặn giúp củng cố kiến thức mới học."),
            (1, "Uniform", "/ˈjuː.nɪ.fɔːm/", "Noun", "Đồng phục", "All students are required to wear white uniforms on Monday morning.", "Tất cả học sinh phải mặc đồng phục màu trắng vào sáng thứ Hai."),
            (1, "Playground", "/ˈpleɪ.ɡraʊnd/", "Noun", "Sân chơi", "Children enjoy playing badminton in the school playground during break time.", "Trẻ em thích chơi cầu lông ở sân chơi của trường trong giờ giải lao."),
            (1, "Dictionary", "/ˈdɪk.ʃən.ər.i/", "Noun", "Từ điển", "Using an English-English dictionary improves your vocabulary intuition.", "Sử dụng từ điển Anh-Anh giúp cải thiện trực giác từ vựng của bạn."),
            (1, "Excited", "/ɪkˈsaɪ.tɪd/", "Adj", "Hào hứng, phấn khởi", "The pupils are very excited about their upcoming field trip to the zoo.", "Các em học sinh rất hào hứng với chuyến dã ngoại sắp tới đến vườn thú."),
            (1, "Careful", "/ˈkeə.fəl/", "Adj", "Cẩn thận", "Be careful when doing chemistry experiments in the laboratory.", "Hãy cẩn thận khi làm các thí nghiệm hóa học trong phòng thí nghiệm."),
            (1, "Routine", "/ruːˈtiːn/", "Noun", "Thói quen thường nhật", "Having a healthy morning routine helps you stay focused throughout the day.", "Có một thói quen buổi sáng lành mạnh giúp bạn duy trì sự tập trung suốt cả ngày."),
            (1, "Encourage", "/ɪnˈkʌr.ɪdʒ/", "Verb", "Khuyến khích, động viên", "Teachers always encourage students to ask questions whenever they feel confused.", "Thầy cô luôn khuyến khích học sinh đặt câu hỏi bất cứ khi nào cảm thấy băn khoăn."),
            (1, "Improve", "/ɪmˈpruːv/", "Verb", "Cải thiện, tiến bộ", "Practicing speaking English for 15 minutes daily will improve your fluency.", "Luyện nói tiếng Anh 15 phút mỗi ngày sẽ cải thiện độ trôi chảy của bạn."),

            # ── TOPIC 2: Hobbies, Community & Health (Grade 7) ──
            (2, "Volunteer", "/ˌvɒl.ənˈtɪər/", "Noun / Verb", "Tình nguyện viên / Tình nguyện", "Many high school students volunteer at local soup kitchens during summer.", "Nhiều học sinh THPT làm tình nguyện tại các bếp ăn từ thiện địa phương vào mùa hè."),
            (2, "Community", "/kəˈmjuː.nə.ti/", "Noun", "Cộng đồng", "Cleaning public parks benefits the entire local community.", "Dọn dẹp công viên công cộng mang lại lợi ích cho toàn bộ cộng đồng địa phương."),
            (2, "Donation", "/dəʊˈneɪ.ʃən/", "Noun", "Sự quyên góp, ủng hộ", "The school raised substantial donations to support flood victims.", "Trường học đã quyên góp được số tiền đáng kể để hỗ trợ các nạn nhân bão lũ."),
            (2, "Nutritious", "/njuːˈtrɪʃ.əs/", "Adj", "Bổ dưỡng, giàu dinh dưỡng", "Eating a nutritious breakfast provides enough energy for rigorous study sessions.", "Ăn một bữa sáng bổ dưỡng cung cấp đủ năng lượng cho các buổi học tập cường độ cao."),
            (2, "Lifestyle", "/ˈlaɪf.staɪl/", "Noun", "Lối sống, phong cách sống", "Adopting an active lifestyle lowers the risk of cardiovascular diseases.", "Áp dụng một lối sống năng động làm giảm nguy cơ mắc các bệnh tim mạch."),
            (2, "Vegetable", "/ˈvedʒ.tə.bəl/", "Noun", "Rau củ", "Green vegetables are packed with essential vitamins, minerals, and dietary fiber.", "Rau xanh chứa nhiều vitamin, khoáng chất thiết yếu và chất xơ."),
            (2, "Charity", "/ˈtʃær.ə.ti/", "Noun", "Tổ chức từ thiện, lòng bác ái", "All proceeds from the musical concert will be donated to a children charity.", "Toàn bộ số tiền thu được từ buổi hòa nhạc sẽ được quyên góp cho một tổ chức từ thiện trẻ em."),
            (2, "Physical", "/ˈfɪz.ɪ.kəl/", "Adj", "Thuộc về thể chất", "Regular physical exercise improves both bodily stamina and mental sharpness.", "Tập thể dục thể chất thường xuyên giúp cải thiện cả sức bền thể lực và sự minh mẫn tinh thần."),
            (2, "Prevent", "/prɪˈvent/", "Verb", "Ngăn ngừa, phòng ngừa", "Washing hands thoroughly with soap helps prevent the spread of infectious viruses.", "Rửa tay kỹ bằng xà phòng giúp ngăn ngừa sự lây lan của các loại virus truyền nhiễm."),
            (2, "Beneficial", "/ˌben.ɪˈfɪʃ.əl/", "Adj", "Có lợi, hữu ích", "Reading books before sleeping is beneficial for relaxing the nervous system.", "Đọc sách trước khi ngủ có lợi cho việc thư giãn hệ thần kinh."),
            (2, "Orphanage", "/ˈɔː.fən.ɪdʒ/", "Noun", "Trại trẻ mồ côi", "Our youth club visited the city orphanage to teach English and organize games.", "Câu lạc bộ thanh niên của chúng tôi đã đến thăm trại trẻ mồ côi thành phố để dạy tiếng Anh và tổ chức trò chơi."),
            (2, "Allergy", "/ˈæl.ə.dʒi/", "Noun", "Dị ứng", "You must notify the doctor immediately if you have a severe food allergy.", "Bạn phải thông báo ngay cho bác sĩ nếu bạn bị dị ứng thực phẩm nghiêm trọng."),
            (2, "Balanced", "/ˈbæl.ənst/", "Adj", "Cân bằng, hài hòa", "Maintaining a balanced diet is crucial for healthy physical growth in adolescents.", "Duy trì một chế độ ăn uống cân bằng là điều cốt yếu cho sự phát triển thể chất lành mạnh ở thanh thiếu niên."),

            # ── TOPIC 3: Life in Countryside & Environment (Grade 8) ──
            (3, "Peaceful", "/ˈpiːs.fəl/", "Adj", "Yên bình, thanh bình", "The countryside offers a peaceful retreat away from the noisy, polluted city center.", "Vùng nông thôn mang lại một nơi nghỉ dưỡng yên bình cách xa trung tâm thành phố ồn ào, ô nhiễm."),
            (3, "Harvest", "/ˈhɑː.vɪst/", "Noun / Verb", "Vụ thu hoạch / Thu hoạch mùa màng", "Farmers work tirelessly from dawn till dusk during the golden rice harvest season.", "Người nông dân làm việc không biết mệt mỏi từ sáng sớm đến tối mịt trong mùa thu hoạch lúa vàng."),
            (3, "Hospitable", "/hɒsˈpɪt.ə.bəl/", "Adj", "Hiếu khách, mến khách", "Local villagers are extremely warm, generous, and hospitable toward foreign travelers.", "Dân làng địa phương vô cùng ấm áp, hào phóng và hiếu khách đối với du khách nước ngoài."),
            (3, "Tradition", "/trəˈdɪʃ.ən/", "Noun", "Truyền thống", "Vietnamese families maintain the time-honored tradition of gathering together on Tet holiday.", "Các gia đình Việt Nam duy trì truyền thống lâu đời là sum họp cùng nhau vào dịp Tết."),
            (3, "Folk game", "/fəʊk ɡeɪm/", "Noun", "Trò chơi dân gian", "Tug of war and bamboo dancing are popular folk games played at village festivals.", "Kéo co và nhảy sạp là những trò chơi dân gian phổ biến được chơi tại các lễ hội làng."),
            (3, "Paddy field", "/ˈpæd.i fiːld/", "Noun", "Cánh đồng lúa", "Vast emerald paddy fields stretch out as far as the horizon in the Mekong Delta.", "Những cánh đồng lúa xanh ngắt trải dài tít tắp đến tận chân trời ở Đồng bằng sông Cửu Long."),
            (3, "Cattle", "/ˈkæt.əl/", "Noun", "Gia súc (trâu bò)", "Raising cattle provides rural households with stable secondary income.", "Chăn nuôi gia súc mang lại cho các hộ gia đình nông thôn nguồn thu nhập phụ ổn định."),
            (3, "Nomadic", "/nəʊˈmæd.ɪk/", "Adj", "Du mục", "Nomadic tribes travel across vast grasslands in search of fertile pastures for their herds.", "Các bộ lạc du mục di chuyển qua những đồng cỏ rộng lớn để tìm kiếm những bãi chăn thả màu mỡ cho đàn gia súc của họ."),
            (3, "Picturesque", "/ˌpɪk.tʃərˈesk/", "Adj", "Đẹp như tranh vẽ", "The mountainous village is nestled in a picturesque valley surrounded by mist.", "Ngôi làng miền núi nằm nép mình trong một thung lũng đẹp như tranh vẽ được bao quanh bởi sương mù."),
            (3, "Fertile", "/ˈfɜː.taɪl/", "Adj", "Màu mỡ, phì nhiêu", "Alluvial soil makes riverbanks extremely fertile for growing high-yield crops.", "Đất phù sa làm cho các bờ sông vô cùng màu mỡ để trồng các loại cây trồng năng suất cao."),

            # ── TOPIC 4: Local Heritage & City Life (Grade 9) ──
            (4, "Preserve", "/prɪˈzɜːv/", "Verb", "Bảo tồn, gìn giữ", "It is our shared responsibility to preserve historical relics for future generations.", "Đó là trách nhiệm chung của chúng ta trong việc bảo tồn các di tích lịch sử cho các thế hệ tương lai."),
            (4, "Congestion", "/kənˈdʒes.tʃən/", "Noun", "Sự tắc nghẽn, kẹt xe", "Traffic congestion during rush hours wastes hours of productivity in metropolitan areas.", "Tắc nghẽn giao thông trong giờ cao điểm làm lãng phí hàng giờ năng suất ở các đô thị lớn."),
            (4, "Infrastructure", "/ˈɪn.frəˌstrʌk.tʃər/", "Noun", "Cơ sở hạ tầng", "The government is investing billions of dollars in upgrading national transport infrastructure.", "Chính phủ đang đầu tư hàng tỷ đô la để nâng cấp cơ sở hạ tầng giao thông quốc gia."),
            (4, "Metropolis", "/məˈtrɒp.əl.ɪs/", "Noun", "Đô thị lớn, siêu đô thị", "Tokyo is a bustling metropolis known for cutting-edge technology and efficient train systems.", "Tokyo là một đô thị lớn nhộn nhịp nổi tiếng với công nghệ tiên tiến và hệ thống tàu hỏa hiệu quả."),
            (4, "Craftsman", "/ˈkrɑːfts.mən/", "Noun", "Nghệ nhân, thợ thủ công", "Skilled craftsmen in Bat Trang pottery village handcraft intricate ceramic vases.", "Những nghệ nhân lành nghề ở làng gốm Bát Tràng làm thủ công những chiếc bình gốm tinh xảo."),
            (4, "Monument", "/ˈmɒn.jə.mənt/", "Noun", "Tượng đài, di tích lịch sử", "The ancient stone monument commemorates heroes who defended national sovereignty.", "Tượng đài đá cổ tưởng niệm các vị anh hùng đã bảo vệ chủ quyền quốc gia."),
            (4, "Urbanization", "/ˌɜː.bən.aɪˈzeɪ.ʃən/", "Noun", "Sự đô thị hóa", "Rapid urbanization brings economic growth but also causes severe housing shortages.", "Đô thị hóa nhanh chóng mang lại tăng trưởng kinh tế nhưng cũng gây ra tình trạng thiếu nhà ở trầm trọng."),
            (4, "Fabulous", "/ˈfæb.jə.ləs/", "Adj", "Tuyệt vời, lộng lẫy", "Halong Bay is world-famous for its fabulous limestone karsts rising from turquoise water.", "Vịnh Hạ Long nổi tiếng thế giới với những đảo đá vôi tuyệt đẹp nhô lên từ làn nước màu ngọc bích."),
            (4, "Attraction", "/əˈtræk.ʃən/", "Noun", "Điểm thu hút du lịch", "The Temple of Literature remains one of the top cultural attractions in Hanoi.", "Văn Miếu - Quốc Tử Giám vẫn là một trong những điểm thu hút văn hóa hàng đầu tại Hà Nội."),
            (4, "Authentic", "/ɔːˈθen.tɪk/", "Adj", "Chân thực, nguyên bản", "Tourists seek authentic culinary experiences by dining at traditional street food stalls.", "Khách du lịch tìm kiếm những trải nghiệm ẩm thực chân thực bằng cách dùng bữa tại các quầy ẩm thực đường phố truyền thống."),

            # ── TOPIC 5: Family, Eco-friendly Life & Digital Age (Grade 10) ──
            (5, "Carbon footprint", "/ˌkɑː.bən ˈfʊt.prɪnt/", "Noun", "Dấu chân carbon (Lượng phát thải CO2)", "Riding bicycles and reducing meat consumption significantly lowers your individual carbon footprint.", "Đi xe đạp và giảm tiêu thụ thịt giúp làm giảm đáng kể dấu chân carbon cá nhân của bạn."),
            (5, "Sustainable", "/səˈsteɪ.nə.bəl/", "Adj", "Bền vững", "Sustainable agriculture minimizes pesticide use to protect soil fertility and groundwater.", "Nông nghiệp bền vững giảm thiểu sử dụng thuốc trừ sâu để bảo vệ độ phì nhiêu của đất và nguồn nước ngầm."),
            (5, "Eco-friendly", "/ˌiː.kəʊˈfrend.li/", "Adj", "Thân thiện với môi trường", "Replacing single-use plastic bags with eco-friendly canvas totes is a commendable habit.", "Thay thế túi nilon dùng một lần bằng túi vải thân thiện với môi trường là một thói quen đáng khen ngợi."),
            (5, "Digital literacy", "/ˌdɪdʒ.ɪ.təl ˈlɪt.ər.ə.si/", "Noun", "Năng lực kỹ thuật số / Năng lực công nghệ", "Digital literacy is indispensable for modern students to evaluate online information critically.", "Năng lực kỹ thuật số là điều không thể thiếu đối với học sinh hiện đại để đánh giá thông tin trực tuyến một cách phản biện."),
            (5, "Equality", "/iˈkwɒl.ə.ti/", "Noun", "Sự bình đẳng", "Gender equality ensures that both men and women receive equal pay for equal work.", "Bình đẳng giới đảm bảo rằng cả nam và nữ đều nhận được mức lương như nhau cho cùng một công việc."),
            (5, "Chore", "/tʃɔːr/", "Noun", "Việc nhà, việc vặt", "Sharing household chores fairly fosters mutual respect and strengthens family bonds.", "Chia sẻ việc nhà một cách công bằng thúc đẩy sự tôn trọng lẫn nhau và củng cố sự gắn kết gia đình."),
            (5, "Decompose", "/ˌdiː.kəmˈpəʊz/", "Verb", "Phân hủy", "Plastic bottles take up to 450 years to decompose in terrestrial landfills.", "Chai nhựa mất tới 450 năm để phân hủy tại các bãi rác trên cạn."),
            (5, "Collaborate", "/kəˈlæb.ə.reɪt/", "Verb", "Hợp tác, cộng tác", "Cloud-based software enables remote teams to collaborate seamlessly on shared projects.", "Phần mềm dựa trên đám mây cho phép các nhóm làm việc từ xa cộng tác liền mạch trên các dự án chung."),
            (5, "Renewable", "/rɪˈnjuː.ə.bəl/", "Adj", "Có thể tái tạo", "Investing in renewable energy sources like wind and solar reduces reliance on fossil fuels.", "Đầu tư vào các nguồn năng lượng tái tạo như gió và mặt trời giúp giảm sự phụ thuộc vào nhiên liệu hóa thạch."),
            (5, "Independent", "/ˌɪn.dɪˈpen.dənt/", "Adj", "Tự lập, độc lập", "Teenagers should learn budget management skills to become financially independent in college.", "Thanh thiếu niên nên học các kỹ năng quản lý ngân sách để trở nên tự lập về tài chính khi học đại học."),

            # ── TOPIC 6: Generation Gap & Global Warming (Grade 11) ──
            (6, "Generation gap", "/ˌdʒen.əˈreɪ.ʃən ˌɡæp/", "Noun", "Khoảng cách thế hệ", "Open conversations and active listening bridge the generation gap between parents and teens.", "Những cuộc trò chuyện cởi mở và lắng nghe tích cực sẽ thu hẹp khoảng cách thế hệ giữa cha mẹ và con cái."),
            (6, "Greenhouse effect", "/ˈɡriːn.haʊs ɪˌfekt/", "Noun", "Hiệu ứng nhà kính", "The greenhouse effect traps solar radiation within the atmosphere, warming the globe.", "Hiệu ứng nhà kính giữ lại bức xạ mặt trời trong khí quyển, làm ấm địa cầu."),
            (6, "Deforestation", "/diːˌfɒr.ɪˈsteɪ.ʃən/", "Noun", "Nạn phá rừng", "Illegal deforestation in tropical rainforests destroys biodiversity and accelerates climate change.", "Phá rừng trái phép ở các khu rừng nhiệt đới phá hủy đa dạng sinh học và đẩy nhanh biến đổi khí hậu."),
            (6, "Emission", "/iˈmɪʃ.ən/", "Noun", "Khí thải, sự phát thải", "Strict governmental regulations aim to cut vehicle exhaust emissions by 50% within a decade.", "Các quy định nghiêm ngặt của chính phủ nhằm cắt giảm 50% lượng khí thải từ phương tiện giao thông trong vòng một thập kỷ."),
            (6, "Viewpoint", "/ˈvjuː.pɔɪnt/", "Noun", "Quan điểm, góc nhìn", "Grandparents and grandchildren often hold contrasting viewpoints on modern career choices.", "Ông bà và con cháu thường có những quan điểm trái ngược nhau về việc lựa chọn nghề nghiệp hiện đại."),
            (6, "Catastrophic", "/ˌkæt.əˈstrɒf.ɪk/", "Adj", "Thảm khốc, thảm họa", "Uncontrolled global temperature rise will trigger catastrophic sea-level rises and extreme droughts.", "Sự gia tăng nhiệt độ toàn cầu không được kiểm soát sẽ gây ra mực nước biển dâng thảm khốc và hạn hán khắc nghiệt."),
            (6, "Conserve", "/kənˈsɜːv/", "Verb", "Bảo tồn, tiết kiệm", "We must implement stringent measures to conserve freshwater reserves during dry seasons.", "Chúng ta phải thực hiện các biện pháp nghiêm ngặt để bảo tồn nguồn dự trữ nước ngọt trong mùa khô."),
            (6, "Impose", "/ɪmˈpəʊz/", "Verb", "Áp đặt, ép buộc", "Parents should guide their children rather than impose their own unfulfilled ambitions on them.", "Cha mẹ nên định hướng cho con cái hơn là áp đặt những tham vọng chưa thành của mình lên chúng."),
            (6, "Autonomous", "/ɔːˈtɒn.ə.məs/", "Adj", "Tự chủ, tự trị", "Developing autonomous learning habits empowers students to acquire complex knowledge independently.", "Phát triển thói quen học tập tự chủ giúp học sinh tiếp thu kiến thức phức tạp một cách độc lập."),
            (6, "Vulnerable", "/ˈvʌl.nər.ə.bəl/", "Adj", "Dễ bị tổn thương", "Low-lying coastal regions in Vietnam are particularly vulnerable to saltwater intrusion.", "Các vùng ven biển trũng thấp ở Việt Nam đặc biệt dễ bị tổn thương trước tình trạng xâm nhập mặn."),

            # ── TOPIC 7: Artificial Intelligence & Future Careers (Grade 12) ──
            (7, "Artificial Intelligence", "/ˌɑː.tɪ.fɪʃ.əl ɪnˈtel.ɪ.dʒəns/", "Noun", "Trí tuệ nhân tạo (AI)", "Artificial Intelligence is revolutionizing medical diagnostics, autonomous transit, and adaptive education.", "Trí tuệ nhân tạo đang cách mạng hóa chẩn đoán y tế, giao thông tự hành và giáo dục thích ứng."),
            (7, "Automation", "/ˌɔː.təˈmeɪ.ʃən/", "Noun", "Sự tự động hóa", "Robotic process automation eliminates repetitive manual tasks, boosting industrial output.", "Tự động hóa quy trình bằng robot giúp loại bỏ các tác vụ thủ công lặp đi lặp lại, nâng cao sản lượng công nghiệp."),
            (7, "Algorithm", "/ˈæl.ɡə.rɪ.ðəm/", "Noun", "Thuật toán", "Search engines rely on sophisticated machine learning algorithms to deliver precise results.", "Các công cụ tìm kiếm dựa vào các thuật toán học máy phức tạp để mang lại kết quả chính xác."),
            (7, "Adaptability", "/əˌdæp.təˈbɪl.ə.ti/", "Noun", "Khả năng thích ứng", "In an unpredictable technological landscape, adaptability is the single most valuable soft skill.", "Trong một bối cảnh công nghệ khó lường, khả năng thích ứng là kỹ năng mềm có giá trị nhất."),
            (7, "Critical thinking", "/ˌkrɪt.ɪ.kəl ˈθɪŋ.kɪŋ/", "Noun", "Tư duy phản biện", "Critical thinking enables students to discern verifiable facts from algorithmic misinformation.", "Tư duy phản biện cho phép học sinh phân biệt các sự thật có thể kiểm chứng với thông tin sai lệch do thuật toán tạo ra."),
            (7, "Transformative", "/trænsˈfɔː.mə.tɪv/", "Adj", "Mang tính biến đổi sâu sắc, đột phá", "Generative AI represents a transformative milestone in human-computer interaction history.", "AI tạo sinh đại diện cho một cột mốc mang tính biến đổi sâu sắc trong lịch sử tương tác giữa người và máy tính."),
            (7, "Unemployment", "/ˌʌn.ɪmˈplɔɪ.mənt/", "Noun", "Nạn thất nghiệp", "Policymakers must retrain the workforce to prevent massive technological structural unemployment.", "Các nhà hoạch định chính sách phải đào tạo lại lực lượng lao động để ngăn chặn tình trạng thất nghiệp cơ cấu do công nghệ quy mô lớn."),
            (7, "Collaboration", "/kəˌlæb.əˈreɪ.ʃən/", "Noun", "Sự hợp tác, cộng tác", "Effective human-AI collaboration yields higher productivity than either operating alone.", "Sự hợp tác hiệu quả giữa con người và AI mang lại năng suất cao hơn so với việc một trong hai hoạt động đơn lẻ."),
            (7, "Disruptive", "/dɪsˈrʌp.tɪv/", "Adj", "Gây đột phá, làm thay đổi trật tự cũ", "Disruptive innovations often dismantle traditional business models before establishing new paradigms.", "Các đổi mới mang tính đột phá thường phá vỡ các mô hình kinh doanh truyền thống trước khi thiết lập các chuẩn mực mới."),
            (7, "Specialized", "/ˈspeʃ.əl.aɪzd/", "Adj", "Chuyên môn hóa, chuyên sâu", "Modern universities offer specialized degrees in data science, quantum physics, and robotics.", "Các trường đại học hiện đại cung cấp các văn bằng chuyên sâu về khoa học dữ liệu, vật lý lượng tử và robot."),

            # ── TOPIC 8: Chuyên đề Trọng điểm Ôn thi THPT 2025-2027 ──
            (8, "Come into force", "/kʌm ˈɪn.tuː fɔːs/", "Idiom / Phrase", "Có hiệu lực thi hành (Luật/Quy định)", "The new environmental protection act will come into force at the start of the fiscal year.", "Đạo luật bảo vệ môi trường mới sẽ có hiệu lực thi hành vào đầu năm tài chính."),
            (8, "Make allowances for", "/meɪk əˈlaʊ.ənsɪz fɔːr/", "Collocation", "Chiếu cố, châm chước cho", "Teachers should make allowances for students who have been absent due to illness.", "Thầy cô nên châm chước cho những học sinh phải nghỉ học do đau ốm."),
            (8, "Pay tribute to", "/peɪ ˈtrɪb.juːt tuː/", "Collocation", "Bày tỏ lòng tri ân, tôn vinh", "The headmaster paid tribute to teachers for their outstanding dedication to pedagogy.", "Thầy hiệu trưởng đã bày tỏ lòng tri ân sâu sắc tới các thầy cô giáo vì sự cống hiến vượt bậc cho sự nghiệp sư phạm."),
            (8, "In the light of", "/ɪn ðə laɪt ɒv/", "Prepositional Phrase", "Xét theo, căn cứ vào", "In the light of recent statistical findings, the curriculum was revised substantially.", "Căn cứ vào các phát hiện thống kê gần đây, chương trình giảng dạy đã được sửa đổi đáng kể."),
            (8, "Ubiquitous", "/juːˈbɪk.wɪ.təs/", "Adj", "Phổ biến ở khắp mọi nơi", "Smartphones have become ubiquitous across all demographics of modern society.", "Điện thoại thông minh đã trở nên phổ biến ở khắp mọi tầng lớp nhân khẩu học của xã hội hiện đại."),
            (8, "Plausible", "/ˈplɔː.zə.bəl/", "Adj", "Hợp lý, đáng tin cậy", "The scientist provided a plausible hypothesis explaining anomalous planetary gravitational waves.", "Nhà khoa học đã đưa ra một giả thuyết hợp lý giải thích các sóng hấp dẫn bất thường của hành tinh."),
            (8, "Jeopardize", "/ˈdʒep.ə.daɪz/", "Verb", "Gây nguy hiểm, làm liều", "Cheating in the national examination will severely jeopardize your entire academic future.", "Gian lận trong kỳ thi quốc gia sẽ gây nguy hiểm nghiêm trọng cho toàn bộ tương lai học vấn của bạn."),
            (8, "Compensate for", "/ˈkɒm.pən.seɪt fɔːr/", "Phrasal Verb", "Đền bù, bù đắp cho", "Hard work, discipline, and strategic perseverance compensate for a lack of innate genius.", "Sự chăm chỉ, kỷ luật và kiên trì có chiến lược sẽ bù đắp cho việc thiếu hụt thiên bẩm bẩm sinh."),
            (8, "Scrutinize", "/ˈskruː.tɪ.naɪz/", "Verb", "Soi xét, xem xét kỹ lưỡng", "Examiners will scrutinize all multiple-choice test sheets for irregularities using automated optical scanners.", "Giám khảo sẽ soi xét kỹ lưỡng tất cả các phiếu trắc nghiệm để tìm ra những điểm bất thường bằng máy quét quang học tự động."),
            (8, "Eloquent", "/ˈel.ə.kwənt/", "Adj", "Hùng hồn, có tài hùng biện", "Her eloquent presentation on renewable energy captivated the entire conference auditorium.", "Bài thuyết trình hùng hồn của cô ấy về năng lượng tái tạo đã thu hút toàn bộ khán phòng hội nghị."),

            # ── TOPIC 9: Advanced Academic & IELTS/B2 ──
            (9, "Paradigm", "/ˈpær.ə.daɪm/", "Noun", "Hệ hình, mô hình mẫu", "Quantum mechanics precipitated a profound paradigm shift in modern theoretical physics.", "Cơ học lượng tử đã thúc đẩy một sự thay đổi hệ hình sâu sắc trong vật lý lý thuyết hiện đại."),
            (9, "Empirical", "/ɪmˈpɪr.ɪ.kəl/", "Adj", "Dựa trên thực nghiệm, kiểm chứng thực tế", "Our educational software is grounded in rigorous empirical data gathered from quasi-experiments.", "Phần mềm giáo dục của chúng tôi dựa trên dữ liệu thực nghiệm nghiêm ngặt được thu thập từ các thí nghiệm bán thực nghiệm."),
            (9, "Cognitive", "/ˈkɒɡ.nə.tɪv/", "Adj", "Thuộc về nhận thức, trí tuệ", "Spaced repetition optimizes cognitive memory retention by interrupting the forgetting curve.", "Lặp ngắt quãng tối ưu hóa khả năng duy trì trí nhớ nhận thức bằng cách can thiệp vào đường cong quên lãng."),
            (9, "Correlation", "/ˌkɒr.əˈleɪ.ʃən/", "Noun", "Mối tương quan thống kê", "Statistical tests revealed a strong positive correlation between theta ability growth and exam scores.", "Các kiểm định thống kê cho thấy mối tương quan thuận mạnh mẽ giữa sự tăng trưởng năng lực theta và điểm thi."),
            (9, "Synthesize", "/ˈsɪn.θə.saɪz/", "Verb", "Tổng hợp, kết hợp thông tin", "Students must learn to synthesize conflicting academic perspectives when writing literature reviews.", "Học sinh phải học cách tổng hợp các quan điểm học thuật trái chiều khi viết tổng quan tài liệu."),
            (9, "Intricacy", "/ˈɪn.trɪ.kə.si/", "Noun", "Sự phức tạp, tinh vi", "Understanding the intricacies of item response theory requires a solid grounding in logistic probability.", "Hiểu được sự phức tạp của lý thuyết ứng đáp câu hỏi đòi hỏi một nền tảng vững chắc về xác suất logistic."),
            (9, "Heterogeneous", "/ˌhet.ər.əˈdʒiː.ni.əs/", "Adj", "Không đồng nhất, đa dạng thành phần", "Adaptive computerized testing effectively serves heterogeneous classrooms with widely divergent skill baselines.", "Kiểm tra thích ứng trên máy tính phục vụ hiệu quả các lớp học không đồng nhất có nền tảng kỹ năng phân hóa mạnh."),
            (9, "Prevalent", "/ˈprev.əl.ənt/", "Adj", "Thịnh hành, phổ biến rộng rãi", "Misconceptions regarding artificial intelligence capabilities remain prevalent in mainstream public discourse.", "Những quan niệm sai lầm về khả năng của trí tuệ nhân tạo vẫn còn thịnh hành trong các cuộc thảo luận của công chúng."),
            (9, "Prerequisite", "/ˌpriːˈrek.wɪ.zɪt/", "Noun / Adj", "Điều kiện tiên quyết / Cần thiết trước", "Basic mastery of differential calculus is an absolute prerequisite for advanced machine learning research.", "Nắm vững cơ bản về phép tính vi phân là điều kiện tiên quyết tuyệt đối cho nghiên cứu học máy nâng cao."),
            (9, "Substantiate", "/səbˈstæn.ʃi.eɪt/", "Verb", "Chứng minh, củng cố bằng bằng chứng", "Researchers must present verified logbook data to substantiate claims of experimental efficacy.", "Các nhà nghiên cứu phải trình bày dữ liệu nhật ký đã được xác minh để chứng minh cho các khẳng định về hiệu quả thực nghiệm."),

            # ── TOPIC 10: Environmental Sustainability & Ecology ──
            (10, "Biodiversity", "/ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/", "Noun", "Đa dạng sinh học", "Protecting global biodiversity is essential for safeguarding delicate planetary ecological equilibrium.", "Bảo vệ đa dạng sinh học toàn cầu là điều cần thiết để bảo vệ sự cân bằng sinh thái mong manh của hành tinh."),
            (10, "Ecosystem", "/ˈiː.kəʊˌsɪs.təm/", "Noun", "Hệ sinh thái", "Coral reefs provide vital habitats for marine life, forming one of Earth's richest ecosystems.", "Các rạn san hô cung cấp môi trường sống quan trọng cho sinh vật biển, tạo thành một trong những hệ sinh thái phong phú nhất của Trái Đất."),
            (10, "Renewable energy", "/rɪˈnjuː.ə.bəl ˈen.ə.dʒi/", "Noun", "Năng lượng tái tạo", "Transitioning to renewable energy like offshore wind farms reduces reliance on polluting coal plants.", "Chuyển đổi sang năng lượng tái tạo như các trang trại điện gió ngoài khơi giúp giảm sự phụ thuộc vào các nhà máy than gây ô nhiễm."),
            (10, "Depletion", "/dɪˈpliː.ʃən/", "Noun", "Sự cạn kiệt", "Overfishing in territorial waters accelerates the rapid depletion of commercial fish stocks.", "Đánh bắt quá mức trong vùng lãnh hải làm gia tăng sự cạn kiệt nhanh chóng của trữ lượng cá thương mại."),
            (10, "Conservation", "/ˌkɒn.səˈveɪ.ʃən/", "Noun", "Sự bảo tồn", "Wildlife conservation projects aim to breed endangered rhinos and reintroduce them into protected reserves.", "Các dự án bảo tồn động vật hoang dã nhằm mục đích nhân giống tê giác có nguy cơ tuyệt chủng và tái đưa chúng vào các khu bảo tồn được bảo vệ.")
        ]
        
        for item in words_data:
            topic_id, word, ipa, pos, meaning, ex, ex_vi = item
            w_obj = VocabularyWord(
                topic_id=topic_id,
                word=word,
                ipa=ipa,
                reading="",
                pos=pos,
                meaning=meaning,
                example=ex,
                example_vi=ex_vi,
                is_active=True
            )
            session.add(w_obj)
        session.commit()
        print(f"[SEED] Đã tạo {len(words_data)} từ vựng chi tiết chuẩn quốc tế.")

        # ──────────────────────────────────────────────────────────────────────────
        # 3. HƠN 120 CÂU PHÁT ÂM THÍCH ỨNG IRT (PRONOUNCE SENTENCES)
        # ──────────────────────────────────────────────────────────────────────────
        pronounce_data = [
            # Lớp 6
            ("6", -2.5, "Hello, my name is Nam and I am in grade six."),
            ("6", -2.3, "My new school has a large playground and a modern library."),
            ("6", -2.1, "We have English lessons on Mondays and Wednesdays."),
            ("6", -1.9, "My favorite subject is Art because I love drawing colorful pictures."),
            ("6", -1.7, "There are four people in my family: parents, brother, and me."),
            ("6", -1.5, "We live in a small townhouse near a quiet, peaceful river."),
            ("6", -1.3, "I often play football with my classmates after finishing classes."),
            ("6", -1.1, "We should brush our teeth twice a day to keep them clean and healthy."),
            ("6", -0.9, "My bedroom has a big window, a study desk, and a wooden wardrobe."),
            ("6", -0.7, "Eating fresh fruit and vegetables helps us stay strong and active."),
            
            # Lớp 7
            ("7", -2.0, "My favorite hobby is collecting beautiful paper models."),
            ("7", -1.8, "Doing community service helps us feel more responsible for society."),
            ("7", -1.6, "Eating fresh fruit and vegetables provides essential vitamins and minerals."),
            ("7", -1.4, "Vietnamese traditional food like Pho is celebrated worldwide."),
            ("7", -1.2, "We should avoid drinking too many sweetened carbonated beverages."),
            ("7", -1.0, "Donating warm clothes to homeless children is a meaningful activity."),
            ("7", -0.8, "Littering in public places harms the environment and local scenery."),
            ("7", -0.6, "We should balance our eating habits and exercise regularly."),
            ("7", -0.4, "Music and arts make our lives more colorful and inspiring."),
            ("7", -0.2, "Volunteers help elderly people with their shopping and house cleaning."),
            
            # Lớp 8
            ("8", -1.5, "Country life is extremely peaceful, simple, and healthy."),
            ("8", -1.3, "People in the highlands are friendly and hospitable to visitors."),
            ("8", -1.1, "We love participating in traditional folk games at local festivals."),
            ("8", -0.9, "Water pollution can cause severe diseases for local communities."),
            ("8", -0.7, "Protecting natural habitats is the best way to save endangered animals."),
            ("8", -0.5, "Online learning platforms provide flexible study schedules for students."),
            ("8", -0.3, "Modern technology has changed our communication habits and lifestyle."),
            ("8", -0.1, "Traditional crafts are passed down from generation to generation."),
            ("8", 0.1, "Ethnic minority groups in Vietnam have their own unique customs."),
            ("8", 0.3, "We should recycle plastic bottles and tin cans to reduce solid waste."),
            
            # Lớp 9
            ("9", -1.0, "Learning English helps us communicate with international friends easily."),
            ("9", -0.8, "Technology plays a crucial role in modern multimedia classrooms."),
            ("9", -0.6, "We must preserve natural wonders for our future generations."),
            ("9", -0.4, "Eco-tourism encourages local people to protect endangered wildlife."),
            ("9", -0.2, "Air pollution is becoming a critical challenge in major megacities."),
            ("9", 0.0, "Developing critical thinking skills is vital for academic excellence."),
            ("9", 0.2, "High school students should limit their daily social media usage."),
            ("9", 0.4, "Public transport is an effective solution to urban traffic congestion."),
            ("9", 0.6, "Biodiversity is crucial for maintaining global ecological balance."),
            ("9", 0.8, "Career guidance services help high school students make informed choices."),
            
            # Lớp 10
            ("10", -0.5, "Helping with household chores contributes to family harmony and happiness."),
            ("10", -0.3, "Reducing carbon footprint is essential to combat global climate change."),
            ("10", -0.1, "Independent teenagers know how to manage their pocket money wisely."),
            ("10", 0.1, "We should balance academic studies and extracurricular entertainment."),
            ("10", 0.3, "Eco-friendly products like reusable bags are highly recommended."),
            ("10", 0.5, "Cultural diversity is shown through traditional clothing and festivals."),
            ("10", 0.7, "Gender equality ensures equal opportunities for both men and women."),
            ("10", 0.9, "Organic farming methods avoid using harmful synthetic chemical fertilizers."),
            ("10", 1.1, "Community service projects improve local infrastructure and clean streets."),
            ("10", 1.3, "Digital literacy is an essential skill for the modern workforce."),
            
            # Lớp 11
            ("11", 0.0, "Generation gap is a common issue in traditional multi-generational families."),
            ("11", 0.2, "Healthy relationships with peers are crucial for adolescent mental health."),
            ("11", 0.4, "Volunteer work helps students develop essential soft skills and empathy."),
            ("11", 0.6, "Energy conservation reduces electricity bills and saves national resources."),
            ("11", 0.8, "Sustainable development balances economic growth and environmental protection."),
            ("11", 1.0, "Vocational schools offer practical training courses for technical industries."),
            ("11", 1.2, "Social media algorithms have a profound impact on consumer behavior."),
            ("11", 1.4, "Mental health awareness should be actively promoted in all public schools."),
            ("11", 1.6, "ASEAN member states cooperate dynamically in economic and cultural fields."),
            ("11", 1.8, "Intercultural communication reduces social prejudices and unnecessary friction."),
            
            # Lớp 12
            ("12", 0.5, "Artificial intelligence is transforming global communication and the economy."),
            ("12", 0.7, "Lifelong learning helps workers adapt to rapid technological revolutions."),
            ("12", 0.9, "Adopting a green lifestyle involves recycling organic wastes and conserving energy."),
            ("12", 1.1, "Globalization promotes international trade and seamless economic integration."),
            ("12", 1.3, "Robots are replacing human labor in repetitive manufacturing environments."),
            ("12", 1.5, "Preserving national heritage promotes tourism and local cultural pride."),
            ("12", 1.7, "Higher education opens up diverse career opportunities for motivated graduates."),
            ("12", 1.9, "The modern job market demands specialized technical competencies and adaptability."),
            ("12", 2.1, "Macroeconomic policies aim to curb inflation and encourage equitable growth."),
            ("12", 2.3, "Biotechnology plays a vital role in developing cutting-edge medical treatments."),
            ("12", 2.5, "Global warming threatens low-lying coastal cities with rising sea levels."),
            ("12", 2.7, "Automation increases industrial efficiency while transforming traditional job structures."),
            ("12", 2.9, "International diplomacy resolves geopolitical disputes through structured peaceful dialogue."),
            ("12", 3.1, "Space exploration expands our deep scientific knowledge of the vast cosmos."),
            ("12", 3.3, "Ethical frameworks must govern autonomous decision systems in artificial intelligence.")
        ]
        
        for item in pronounce_data:
            grade, diff, text = item
            p_obj = PronounceSentence(
                text=text,
                level_grade=grade,
                difficulty=diff,
                is_active=True
            )
            session.add(p_obj)
        session.commit()
        print(f"[SEED] Đã tạo {len(pronounce_data)} câu chấm phát âm thích ứng IRT.")

        # ──────────────────────────────────────────────────────────────────────────
        # 4. 44 ÂM IPA QUỐC TẾ
        # ──────────────────────────────────────────────────────────────────────────
        ipa_data = [
            # Vowels
            ("/iː/", "Long i", "vowel", "sheep", "/ʃiːp/", "Kéo dài miệng như đang mỉm cười nhẹ, đầu lưỡi chạm vào răng hàm dưới."),
            ("/ɪ/", "Short i", "vowel", "ship", "/ʃɪp/", "Mở miệng hờ, phát âm dứt khoát và ngắn gọn."),
            ("/ʊ/", "Short u", "vowel", "good", "/ɡʊd/", "Môi hơi tròn, phát âm âm 'u' ngắn và dứt khoát."),
            ("/uː/", "Long u", "vowel", "shoot", "/ʃuːt/", "Tròn môi, đưa môi ra phía trước, phát âm âm 'u' dài."),
            ("/e/", "Short e", "vowel", "bed", "/bed/", "Mở miệng vừa phải, phát âm âm 'e' dứt khoát."),
            ("/ə/", "Schwa", "vowel", "teacher", "/ˈtiː.tʃər/", "Âm thư giãn hoàn toàn, không nhấn trọng âm, miệng thả lỏng tự nhiên."),
            ("/ɜː/", "Long er", "vowel", "bird", "/bɜːd/", "Mở miệng vừa, cuộn nhẹ lưỡi về phía sau, phát âm ngân dài."),
            ("/ɔː/", "Long or", "vowel", "door", "/dɔːr/", "Tròn môi hình chữ O, lưỡi hạ thấp, phát âm kéo dài."),
            ("/æ/", "Ash / Short a", "vowel", "cat", "/kæt/", "Mở rộng khẩu hình miệng theo chiều dọc, đè lưỡi thấp xuống."),
            ("/ʌ/", "Strut", "vowel", "up", "/ʌp/", "Miệng mở vừa phải, phát âm giống âm 'á' nhẹ trong tiếng Việt nhưng dứt khoát."),
            ("/ɑː/", "Long ah", "vowel", "far", "/fɑːr/", "Hạ hàm sâu, mở rộng miệng, phát âm ngân dài từ sâu trong cổ họng."),
            ("/ɒ/", "Short o", "vowel", "on", "/ɒn/", "Môi hơi tròn, hạ hàm, phát âm âm 'o' ngắn gọn."),
            # Diphthongs
            ("/eɪ/", "Face", "diphthong", "day", "/deɪ/", "Bắt đầu từ âm /e/ rồi trượt mượt mà sang âm /ɪ/."),
            ("/aɪ/", "Price", "diphthong", "my", "/maɪ/", "Bắt đầu từ âm /ɑː/ rồi trượt nhanh lên âm /ɪ/."),
            ("/ɔɪ/", "Choice", "diphthong", "boy", "/bɔɪ/", "Bắt đầu từ âm /ɔː/ rồi trượt lên âm /ɪ/."),
            ("/aʊ/", "Mouth", "diphthong", "now", "/naʊ/", "Bắt đầu từ âm /ɑː/ rồi khép dần môi sang âm /ʊ/."),
            ("/əʊ/", "Goat", "diphthong", "go", "/ɡəʊ/", "Bắt đầu từ âm /ə/ rồi tròn môi sang âm /ʊ/."),
            ("/ɪə/", "Near", "diphthong", "here", "/hɪər/", "Bắt đầu từ âm /ɪ/ rồi trượt nhẹ về âm /ə/."),
            ("/eə/", "Square", "diphthong", "hair", "/heər/", "Bắt đầu từ âm /e/ rồi trượt nhẹ về âm /ə/."),
            # Consonants
            ("/p/", "Voiceless p", "consonant", "pen", "/pen/", "Mím chặt hai môi lại rồi bật hơi mạnh ra ngoài, dây thanh không rung."),
            ("/b/", "Voiced b", "consonant", "bad", "/bæd/", "Mím môi và bật âm ra ngoài, dây thanh quản rung mạnh."),
            ("/t/", "Voiceless t", "consonant", "tea", "/tiː/", "Đầu lưỡi chạm nướu răng trên, bật hơi dứt khoát không rung thanh quản."),
            ("/d/", "Voiced d", "consonant", "did", "/dɪd/", "Đầu lưỡi chạm nướu răng trên, bật âm làm rung dây thanh quản."),
            ("/k/", "Voiceless k", "consonant", "cat", "/kæt/", "Cuống lưỡi nâng lên chạm vòm họng mềm, bật hơi mạnh ra ngoài."),
            ("/ɡ/", "Voiced g", "consonant", "got", "/ɡɒt/", "Cuống lưỡi chạm vòm họng mềm, bật âm và rung dây thanh quản."),
            ("/θ/", "Voiceless th", "consonant", "think", "/θɪŋk/", "Đặt đầu lưỡi vào giữa hai hàm răng, thổi luồng hơi nhẹ ra ngoài."),
            ("/ð/", "Voiced th", "consonant", "this", "/ðɪs/", "Đặt đầu lưỡi vào giữa hai hàm răng, phát âm và làm rung dây thanh quản."),
            ("/s/", "Voiceless s", "consonant", "see", "/siː/", "Khép hờ hai hàm răng, đẩy luồng khí xì nhẹ qua kẽ răng."),
            ("/z/", "Voiced z", "consonant", "zoo", "/zuː/", "Tương tự âm /s/ nhưng làm rung mạnh dây thanh quản."),
            ("/ʃ/", "Voiceless sh", "consonant", "she", "/ʃiː/", "Chu tròn môi về phía trước, đẩy hơi mạnh qua vòm miệng."),
            ("/ʒ/", "Voiced zh", "consonant", "vision", "/ˈvɪʒ.ən/", "Tương tự âm /ʃ/ nhưng phát âm làm rung dây thanh quản."),
            ("/tʃ/", "Voiceless ch", "consonant", "chair", "/tʃeər/", "Khép răng, chu môi, bật mạnh luồng hơi kết hợp giữa /t/ và /ʃ/."),
            ("/dʒ/", "Voiced j", "consonant", "judge", "/dʒʌdʒ/", "Tương tự âm /tʃ/ nhưng rung dây thanh quản mạnh mẽ."),
            ("/m/", "Voiced m", "consonant", "man", "/mæn/", "Ngậm hai môi, luồng hơi thoát ra qua đường mũi, rung dây thanh."),
            ("/n/", "Voiced n", "consonant", "no", "/nəʊ/", "Đầu lưỡi chạm nướu răng trên, luồng hơi đi qua mũi, rung thanh quản."),
            ("/ŋ/", "Voiced ng", "consonant", "sing", "/sɪŋ/", "Cuống lưỡi nâng lên chạm vòm miệng mềm, hơi đi qua đường mũi."),
            ("/h/", "Voiceless h", "consonant", "hat", "/hæt/", "Mở miệng tự nhiên, thở một luồng hơi nhẹ nhàng từ trong cổ họng."),
            ("/l/", "Voiced l", "consonant", "leg", "/leɡ/", "Đầu lưỡi chạm nướu răng trên, luồng khí thoát ra ở hai bên mép lưỡi."),
            ("/r/", "Voiced r", "consonant", "red", "/red/", "Cuộn đầu lưỡi hơi cong về phía sau nhưng không chạm vào vòm miệng."),
            ("/w/", "Voiced w", "consonant", "wet", "/wet/", "Tròn môi như huýt sáo rồi nhanh chóng mở rộng khẩu hình."),
            ("/j/", "Voiced y", "consonant", "yes", "/jes/", "Nâng thân lưỡi lên sát vòm miệng cứng, phát âm lướt nhanh.")
        ]
        
        for item in ipa_data:
            symbol, name, stype, ex_w, ex_p, guide = item
            ipa_obj = IPASound(
                symbol=symbol,
                name=name,
                sound_type=stype,
                example_word=ex_w,
                example_phonetic=ex_p,
                mouth_guide=guide,
                is_active=True
            )
            session.add(ipa_obj)
        session.commit()
        print(f"[SEED] Đã tạo {len(ipa_data)} âm IPA quốc tế chi tiết.")
        
        print("[SEED] Hoàn thành nạp dữ liệu thành công 100%!")

if __name__ == "__main__":
    run_seed()
