import os
import sys
from sqlmodel import Session, select, create_engine

# Đảm bảo in ra màn hình console Windows không bị lỗi font Unicode
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

# Thiết lập sys path để import được các module từ backend
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import VocabularyTopic, VocabularyWord, IPASound, PronounceSentence, engine, create_db_and_tables

def seed_sample_data():
    print("[Seed] Khởi tạo các bảng và kiểm tra dữ liệu mẫu...")
    create_db_and_tables()

    with Session(engine) as session:
        # Xóa dữ liệu cũ để tránh trùng lặp và làm mới toàn bộ
        print("[Seed] Đang làm sạch dữ liệu cũ...")
        session.exec(VocabularyWord.__table__.delete())
        session.exec(VocabularyTopic.__table__.delete())
        session.exec(IPASound.__table__.delete())
        session.exec(PronounceSentence.__table__.delete())
        session.commit()

        # 1. Seed Vocabulary Topics từ lớp 6 tới lớp 12
        print("[Seed] Đang thêm chủ đề từ vựng mẫu từ lớp 6 đến lớp 12...")
        t6 = VocabularyTopic(
            title="School Life", slug="school-life",
            description="Từ vựng cơ bản về học tập và cuộc sống học đường",
            image="", grade="6", is_active=True
        )
        t7 = VocabularyTopic(
            title="Hobbies & Games", slug="hobbies-games",
            description="Sở thích và các hoạt động giải trí lành mạnh",
            image="", grade="7", is_active=True
        )
        t8 = VocabularyTopic(
            title="Life in the Countryside", slug="life-countryside",
            description="Đời sống và phong cảnh tự nhiên ở vùng nông thôn",
            image="", grade="8", is_active=True
        )
        t9 = VocabularyTopic(
            title="Local Environment", slug="local-environment",
            description="Môi trường sống xung quanh và các hoạt động bảo vệ địa phương",
            image="", grade="9", is_active=True
        )
        t10 = VocabularyTopic(
            title="Technology & Society", slug="technology-society",
            description="Từ vựng về Công nghệ và Xã hội thời đại số",
            image="", grade="10", is_active=True
        )
        t11 = VocabularyTopic(
            title="Sustainability & Environment", slug="sustainability-environment",
            description="Từ vựng về Phát triển bền vững và Bảo vệ môi trường",
            image="", grade="11", is_active=True
        )
        t12 = VocabularyTopic(
            title="Artificial Intelligence", slug="artificial-intelligence",
            description="Trí tuệ nhân tạo và Tác động đối với giáo dục toàn cầu",
            image="", grade="12", is_active=True
        )

        session.add(t6)
        session.add(t7)
        session.add(t8)
        session.add(t9)
        session.add(t10)
        session.add(t11)
        session.add(t12)
        session.commit()
        
        session.refresh(t6)
        session.refresh(t7)
        session.refresh(t8)
        session.refresh(t9)
        session.refresh(t10)
        session.refresh(t11)
        session.refresh(t12)
        
        # 2. Seed Vocabulary Words
        print("[Seed] Đang thêm từ vựng mẫu...")
        words = [
            # Grade 6
            VocabularyWord(
                topic_id=t6.id, word="Teacher", ipa="/ˈtiː.tʃər/",
                reading="TI-chơ", pos="Danh từ (n.)",
                meaning="Giáo viên, thầy cô giáo giảng dạy trên lớp",
                example="My English teacher is very kind and patient.",
                example_vi="Giáo viên tiếng Anh của tôi rất tốt bụng và kiên nhẫn.",
                is_active=True
            ),
            VocabularyWord(
                topic_id=t6.id, word="Classroom", ipa="/ˈklɑːs.ruːm/",
                reading="KLÁ-s-rum", pos="Danh từ (n.)",
                meaning="Phòng học, không gian học tập chung",
                example="Our classroom is clean, bright and has a smart board.",
                example_vi="Lớp học của chúng tôi sạch sẽ, sáng sủa và có bảng thông minh.",
                is_active=True
            ),
            # Grade 7
            VocabularyWord(
                topic_id=t7.id, word="Hobby", ipa="/ˈhɒb.i/",
                reading="HÓ-bi", pos="Danh từ (n.)",
                meaning="Sở thích cá nhân được làm vào lúc rảnh rỗi",
                example="My favorite hobby is building paper models.",
                example_vi="Sở thích yêu thích của tôi là làm mô hình giấy.",
                is_active=True
            ),
            # Grade 8
            VocabularyWord(
                topic_id=t8.id, word="Countryside", ipa="/ˈkʌn.tri.saɪd/",
                reading="KĂN-tri-sai-d", pos="Danh từ (n.)",
                meaning="Vùng nông thôn, làng quê yên bình",
                example="I love breathing the fresh air in the countryside.",
                example_vi="Tôi thích hít thở không khí trong lành ở vùng nông thôn.",
                is_active=True
            ),
            # Grade 9
            VocabularyWord(
                topic_id=t9.id, word="Environment", ipa="/ɪnˈvaɪ.rən.mənt/",
                reading="in-VAI-rơn-mơnt", pos="Danh từ (n.)",
                meaning="Môi trường sống tự nhiên xung quanh chúng ta",
                example="We must protect the local environment from plastic waste.",
                example_vi="Chúng ta phải bảo vệ môi trường địa phương khỏi rác thải nhựa.",
                is_active=True
            ),
            VocabularyWord(
                topic_id=t9.id, word="Pollute", ipa="/pəˈluːt/",
                reading="pơ-LUT", pos="Động từ (v.)",
                meaning="Làm ô nhiễm hoặc nhiễm độc nguồn nước, không khí",
                example="Factory chemical waste can seriously pollute rivers.",
                example_vi="Chất thải hóa học từ nhà máy có thể làm ô nhiễm nghiêm trọng các con sông.",
                is_active=True
            ),
            # Grade 10
            VocabularyWord(
                topic_id=t10.id, word="Algorithm", ipa="/ˈæl.ɡə.rɪ.ðəm/",
                reading="ÉL-gơ-ri-đơm", pos="Danh từ (n.)",
                meaning="Thuật toán, quy trình xử lý dữ liệu của máy tính",
                example="The adaptive testing system uses a complex algorithm.",
                example_vi="Hệ thống đánh giá thích ứng sử dụng một thuật toán phức tạp.",
                is_active=True
            ),
            VocabularyWord(
                topic_id=t10.id, word="Device", ipa="/dɪˈvaɪs/",
                reading="đi-VAI-s", pos="Danh từ (n.)",
                meaning="Thiết bị điện tử hoặc cơ khí",
                example="Smartphones are essential electronic devices for students.",
                example_vi="Điện thoại thông minh là thiết bị điện tử thiết yếu cho học sinh.",
                is_active=True
            ),
            # Grade 11
            VocabularyWord(
                topic_id=t11.id, word="Sustainability", ipa="/səˌsteɪ.nəˈbɪl.ə.ti/",
                reading="sơ-STÂY-nơ-BI-li-ti", pos="Danh từ (n.)",
                meaning="Sự bền vững, bảo vệ tài nguyên lâu dài",
                example="Renewable energy is key to environmental sustainability.",
                example_vi="Năng lượng tái tạo là chìa khóa cho sự bền vững của môi trường.",
                is_active=True
            ),
            VocabularyWord(
                topic_id=t11.id, word="Ecosystem", ipa="/ˈiː.kəʊˌsɪs.təm/",
                reading="I-câu-sít-tơm", pos="Danh từ (n.)",
                meaning="Hệ sinh thái gồm sinh vật và môi trường sống",
                example="Forest fires destroy the natural ecosystem.",
                example_vi="Cháy rừng tàn phá hệ sinh thái tự nhiên.",
                is_active=True
            ),
            # Grade 12
            VocabularyWord(
                topic_id=t12.id, word="Automation", ipa="/ˌɔː.təˈmeɪ.ʃən/",
                reading="O-tơ-mây-shơn", pos="Danh từ (n.)",
                meaning="Sự tự động hóa, điều khiển tự động thay con người",
                example="Industrial automation increases manufacturing speed.",
                example_vi="Tự động hóa công nghiệp làm tăng tốc độ sản xuất.",
                is_active=True
            ),
            VocabularyWord(
                topic_id=t12.id, word="Interdisciplinary", ipa="/ˌɪn.tə.dɪs.ɪˈplɪn.ər.i/",
                reading="in-tơ-đít-si-PLIN-ơ-ri", pos="Tính từ (adj.)",
                meaning="Liên ngành, liên kết giữa nhiều môn học khác nhau",
                example="This interdisciplinary project addresses complex modern challenges.",
                example_vi="Dự án liên ngành giải quyết các thách thức hiện đại phức tạp.",
                is_active=True
            )
        ]
        for w in words:
            session.add(w)

        # 3. Seed IPA Sounds
        print("[Seed] Đang thêm âm IPA mẫu...")
        sounds = [
            IPASound(
                symbol="/iː/", name="i dài", sound_type="vowel",
                example_word="sheep", example_phonetic="/ʃiːp/",
                mouth_guide="Môi mở rộng như đang cười, lưỡi nâng cao hướng ra trước. Phát âm kéo dài.",
                is_active=True
            ),
            IPASound(
                symbol="/ɪ/", name="i ngắn", sound_type="vowel",
                example_word="ship", example_phonetic="/ʃɪp/",
                mouth_guide="Môi hé mở tự nhiên, khoảng cách môi hẹp hơn. Phát âm dứt khoát.",
                is_active=True
            ),
            IPASound(
                symbol="/p/", name="p", sound_type="consonant",
                example_word="pen", example_phonetic="/pen/",
                mouth_guide="Mím chặt hai môi lại để ngăn luồng hơi, sau đó bật mạnh môi ra thoát khí.",
                is_active=True
            ),
            IPASound(
                symbol="/b/", name="b", sound_type="consonant",
                example_word="book", example_phonetic="/bʊk/",
                mouth_guide="Giống âm /p/ nhưng làm rung dây thanh quản ở cổ họng khi phát ra.",
                is_active=True
            )
        ]
        for s in sounds:
            session.add(s)

        # 4. Seed Pronounce Sentences
        print("[Seed] Đang thêm câu phát âm thích ứng mẫu...")
        sentences = [
            PronounceSentence(
                text="Hello, my name is Nam and I am in grade six.",
                level_grade="6", difficulty=-2.5, is_active=True
            ),
            PronounceSentence(
                text="My favorite hobby is collecting beautiful paper models.",
                level_grade="7", difficulty=-2.0, is_active=True
            ),
            PronounceSentence(
                text="Modern technology has changed our communication habits and lifestyle.",
                level_grade="8", difficulty=-0.3, is_active=True
            ),
            PronounceSentence(
                text="Learning English helps us communicate with foreign friends easily.",
                level_grade="9", difficulty=-1.0, is_active=True
            ),
            PronounceSentence(
                text="Reducing carbon footprint is essential to fight climate change.",
                level_grade="10", difficulty=-0.3, is_active=True
            ),
            PronounceSentence(
                text="Sustainable development models balance growth and environmental protection.",
                level_grade="11", difficulty=0.8, is_active=True
            ),
            PronounceSentence(
                text="Artificial intelligence is transforming global communication and economy.",
                level_grade="12", difficulty=0.5, is_active=True
            )
        ]
        for s in sentences:
            session.add(s)

        session.commit()
        print("[Seed] Hoàn tất nạp dữ liệu mẫu thành công!")

if __name__ == "__main__":
    seed_sample_data()
