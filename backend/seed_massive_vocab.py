"""
seed_massive_vocab.py
Nạp kho học liệu từ vựng đồ sộ theo chuẩn 2 hướng:
1. Theo Khối lớp (Lớp 6, 7, 8, 9, 10, 11, 12, Ôn thi THPT Quốc Gia, IELTS/Academic)
2. Theo Chủ đề chuyên sâu (AI, Môi trường, Sức khỏe, Văn hóa, Khoa học, Collocations, v.v.)
"""

import os
import json
import sqlite3
from database import DB_PATH, create_db_and_tables

def seed():
    create_db_and_tables()
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Xóa sạch bảng cũ để nạp mới toàn bộ
    cur.execute("DELETE FROM vocabularyword")
    cur.execute("DELETE FROM vocabularytopic")

    TOPICS_DATA = [
        # ════════════ KHỐI LỚP 6 ════════════
        {
            "title": "Lớp 6 - Unit 1 & 2: My New School & Home",
            "slug": "grade-6-school-home",
            "description": "Từ vựng về trường lớp mới, bạn bè và các phòng, đồ vật trong gia đình",
            "grade": "6",
            "words": [
                ("calculator", "/ˈkæl.kjə.leɪ.tər/", "Danh từ (n.)", "máy tính cầm tay", "I use a calculator in maths class.", "Tôi dùng máy tính cầm tay trong giờ toán."),
                ("compass", "/ˈkʌm.pəs/", "Danh từ (n.)", "com-pa (vẽ hình tròn)", "Do you have a compass for geometry?", "Bạn có com-pa để học hình học không?"),
                ("uniform", "/ˈjuː.nɪ.fɔːm/", "Danh từ (n.)", "đồng phục học sinh", "Students must wear school uniforms on Mondays.", "Học sinh phải mặc đồng phục vào thứ Hai."),
                ("creative", "/kriˈeɪ.tɪv/", "Tính từ (adj.)", "sáng tạo, có óc tưởng tượng", "She is a creative student in art class.", "Cô ấy là một học sinh sáng tạo trong giờ mỹ thuật."),
                ("balcony", "/ˈbæl.kə.ni/", "Danh từ (n.)", "ban công ngôi nhà", "There are many pretty flowers on the balcony.", "Có rất nhiều hoa đẹp ở ban công."),
                ("apartment", "/əˈpɑːt.mənt/", "Danh từ (n.)", "căn hộ chung cư", "My family lives in a modern apartment.", "Gia đình tôi sống trong một căn hộ hiện đại.")
            ]
        },
        {
            "title": "Lớp 6 - Unit 6 & 8: Our Tet Holiday & Sports",
            "slug": "grade-6-tet-sports",
            "description": "Lễ hội ngày Tết truyền thống và các môn thể thao vận động",
            "grade": "6",
            "words": [
                ("celebrate", "/ˈsel.ə.breɪt/", "Động từ (v.)", "kỷ niệm, ăn mừng", "We celebrate Tet with our grandparents.", "Chúng tôi ăn mừng Tết cùng ông bà."),
                ("firework", "/ˈfaɪə.wɜːk/", "Danh từ (n.)", "pháo hoa", "We watch fireworks on New Year's Eve.", "Chúng tôi xem pháo hoa vào đêm Giao thừa."),
                ("marathon", "/ˈmær.ə.θən/", "Danh từ (n.)", "cuộc chạy ma-ra-tông", "Thousands ran in the city marathon.", "Hàng ngàn người đã chạy trong giải ma-ra-tông thành phố."),
                ("equipment", "/ɪˈkwɪp.mənt/", "Danh từ (n.)", "dụng cụ, trang thiết bị", "You need protective equipment to skateboard.", "Bạn cần dụng cụ bảo hộ khi trượt ván."),
                ("gymnasium", "/dʒɪmˈneɪ.zi.əm/", "Danh từ (n.)", "phòng tập thể dục thể thao", "We play badminton in the gymnasium.", "Chúng tôi chơi cầu lông trong nhà thể chất.")
            ]
        },

        # ════════════ KHỐI LỚP 7 ════════════
        {
            "title": "Lớp 7 - Unit 1 & 2: Hobbies & Healthy Living",
            "slug": "grade-7-hobbies-health",
            "description": "Sở thích cá nhân, rèn luyện thể chất và lối sống lành mạnh",
            "grade": "7",
            "words": [
                ("hobby", "/ˈhɒb.i/", "Danh từ (n.)", "sở thích lúc rảnh rỗi", "My favorite hobby is collecting stamps.", "Sở thích yêu thích của tôi là sưu tầm tem."),
                ("cardiology", "/ˌkɑː.diˈɒl.ə.dʒi/", "Danh từ (n.)", "tim mạch học, sức khỏe tim", "Cardio exercise improves heart health.", "Bài tập cardio tăng cường sức khỏe tim mạch."),
                ("sunburn", "/ˈsʌn.bɜːn/", "Danh từ (n.)", "sự cháy nắng, sạm da", "Wear sunscreen to prevent painful sunburn.", "Hãy thoa kem chống nắng để tránh bị cháy nắng đau rát."),
                ("vegetarian", "/ˌvedʒ.ɪˈteə.ri.ən/", "Danh từ (n.)", "người ăn chay", "A vegetarian diet is rich in vegetables.", "Chế độ ăn chay rất giàu rau củ quả."),
                ("dimple", "/ˈdɪm.pəl/", "Danh từ (n.)", "lúm đồng tiền", "She has lovely dimples when she smiles.", "Cô ấy có lúm đồng tiền rất đáng yêu khi cười.")
            ]
        },
        {
            "title": "Lớp 7 - Unit 3 & 7: Community Service & Traffic",
            "slug": "grade-7-community-traffic",
            "description": "Hoạt động thiện nguyện vì cộng đồng và luật an toàn giao thông",
            "grade": "7",
            "words": [
                ("volunteer", "/ˌvɒl.ənˈtɪər/", "Động từ (v.) / Danh từ (n.)", "tình nguyện viên, làm tình nguyện", "Students volunteer to clean the neighborhood park.", "Học sinh tình nguyện dọn dẹp công viên khu phố."),
                ("donate", "/dəʊˈneɪt/", "Động từ (v.)", "quyên góp, ủng hộ", "We donate warm clothes to children in mountainous areas.", "Chúng tôi quyên góp quần áo ấm cho trẻ em vùng cao."),
                ("pedestrian", "/pəˈdes.tri.ən/", "Danh từ (n.)", "người đi bộ trên đường", "Pedestrians should use the zebra crossing.", "Người đi bộ nên sử dụng vạch kẻ đường dành cho người đi bộ."),
                ("congestion", "/kənˈdʒes.tʃən/", "Danh từ (n.)", "sự ùn tắc giao thông", "Traffic congestion happens during rush hours.", "Ùn tắc giao thông thường xảy ra trong giờ cao điểm."),
                ("helmet", "/ˈhel.mɪt/", "Danh từ (n.)", "mũ bảo hiểm", "Always fasten your helmet securely before riding.", "Luôn cài quai mũ bảo hiểm chắc chắn trước khi đi xe.")
            ]
        },

        # ════════════ KHỐI LỚP 8 ════════════
        {
            "title": "Lớp 8 - Unit 1 & 2: Leisure Time & Life in the Countryside",
            "slug": "grade-8-leisure-countryside",
            "description": "Thời gian giải trí, cuộc sống thanh bình vùng nông thôn",
            "grade": "8",
            "words": [
                ("origami", "/ˌɒr.ɪˈɡɑː.mi/", "Danh từ (n.)", "nghệ thuật gấp giấy Nhật Bản", "He learned origami from his Japanese friend.", "Cậu ấy học gấp giấy origami từ người bạn Nhật."),
                ("nomadic", "/nəʊˈmæd.ɪk/", "Tính từ (adj.)", "du mục, nay đây mai đó", "Nomadic families live in traditional circular yurts.", "Các gia đình du mục sống trong các căn lều tròn truyền thống."),
                ("pasture", "/ˈpɑːs.tʃər/", "Danh từ (n.)", "đồng cỏ chăn thả gia súc", "Cattle graze peacefully on the green pasture.", "Gia súc gặm cỏ thanh bình trên đồng cỏ xanh."),
                ("harvest", "/ˈhɑː.vɪst/", "Danh từ (n.) / Động từ (v.)", "mùa vụ thu hoạch, gặt hái", "Farmers work hard during the summer rice harvest.", "Nông dân làm việc chăm chỉ trong vụ thu hoạch lúa hè."),
                ("generous", "/ˈdʒen.ər.əs/", "Tính từ (adj.)", "hào phóng, rộng lượng", "Villagers are known for their generous hospitality.", "Người dân làng nổi tiếng với lòng hiếu khách hào phóng.")
            ]
        },
        {
            "title": "Lớp 8 - Unit 7 & 8: Environmental Pollution & English Speaking World",
            "slug": "grade-8-pollution-english-world",
            "description": "Ô nhiễm môi trường và văn hóa các quốc gia nói tiếng Anh",
            "grade": "8",
            "words": [
                ("pollutant", "/pəˈluː.tənt/", "Danh từ (n.)", "chất gây ô nhiễm", "Factory smoke releases toxic pollutants into the air.", "Khói nhà máy thải các chất ô nhiễm độc hại vào không khí."),
                ("aquatic", "/əˈkwæt.ɪk/", "Tính từ (adj.)", "thuộc về môi trường nước, thủy sinh", "Plastic debris harms aquatic animals severely.", "Mảnh vụn nhựa gây hại nghiêm trọng cho động vật thủy sinh."),
                ("monument", "/ˈmɒn.jə.mənt/", "Danh từ (n.)", "đài tưởng niệm, tượng đài", "The Statue of Liberty is a famous monument in New York.", "Tượng Nữ thần Tự do là một tượng đài nổi tiếng tại New York."),
                ("native", "/ˈneɪ.tɪv/", "Tính từ (adj.)", "bản địa, tự nhiên", "Kangaroos are native to Australia.", "Chuột túi là loài bản địa của nước Úc."),
                ("bilingual", "/baɪˈlɪŋ.ɡwəl/", "Tính từ (adj.)", "nói được hai thứ tiếng", "Being bilingual opens up diverse international opportunities.", "Nói được song ngữ mở ra nhiều cơ hội quốc tế đa dạng.")
            ]
        },

        # ════════════ KHỐI LỚP 9 ════════════
        {
            "title": "Lớp 9 - Unit 1 & 2: Local Environment & City Life",
            "slug": "grade-9-environment-city",
            "description": "Làng nghề truyền thống, văn hóa thủ công và cuộc sống đô thị",
            "grade": "9",
            "words": [
                ("artisan", "/ˌɑː.tɪˈzæn/", "Danh từ (n.)", "nghệ nhân, thợ thủ công lành nghề", "Skilled artisans shape ceramic pots meticulously.", "Các nghệ nhân lành nghề tạo hình đồ gốm một cách tỉ mỉ."),
                ("handicraft", "/ˈhæn.dɪ.krɑːft/", "Danh từ (n.)", "đồ thủ công mỹ nghệ", "Foreign tourists admire local Vietnamese handicrafts.", "Khách du lịch nước ngoài chiêm ngưỡng đồ thủ công mỹ nghệ Việt Nam."),
                ("metropolis", "/məˈtrɒp.əl.ɪs/", "Danh từ (n.)", "đại đô thị, thành phố sầm uất", "Tokyo is a bustling modern metropolis.", "Tokyo là một đại đô thị hiện đại và nhộn nhịp."),
                ("multicultural", "/ˌmʌl.tiˈkʌl.tʃər.əl/", "Tính từ (adj.)", "đa văn hóa", "Living in a multicultural city broadens your horizons.", "Sống trong một thành phố đa văn hóa giúp mở rộng tầm nhìn của bạn."),
                ("amenity", "/əˈmiː.nə.ti/", "Danh từ (n.)", "tiện nghi công cộng", "The neighborhood has excellent recreational amenities.", "Khu dân cư có các tiện nghi giải trí tuyệt vời.")
            ]
        },
        {
            "title": "Lớp 9 - Unit 3 & 4: Teen Stress & Life in the Past",
            "slug": "grade-9-stress-past",
            "description": "Quản lý áp lực học đường và ký ức lịch sử thế hệ đi trước",
            "grade": "9",
            "words": [
                ("counselor", "/ˈkaʊn.səl.ər/", "Danh từ (n.)", "chuyên viên tư vấn tâm lý", "The school counselor helps students manage exam anxiety.", "Chuyên viên tư vấn học đường giúp học sinh kiểm soát lo âu thi cử."),
                ("frustrated", "/frʌsˈtreɪ.tɪd/", "Tính từ (adj.)", "nản lòng, bực bội", "Do not feel frustrated when facing difficult math problems.", "Đừng cảm thấy nản lòng khi gặp các bài toán khó."),
                ("illiterate", "/ɪˈlɪt.ər.ət/", "Tính từ (adj.)", "mù chữ, không biết đọc viết", "Illiteracy rates dropped significantly thanks to education.", "Tỷ lệ mù chữ đã giảm đáng kể nhờ vào giáo dục."),
                ("generation", "/ˌdʒen.əˈreɪ.ʃən/", "Danh từ (n.)", "thế hệ", "Older generations preserve traditional values.", "Các thế hệ đi trước gìn giữ những giá trị truyền thống."),
                ("resilience", "/rɪˈzɪl.jəns/", "Danh từ (n.)", "sự kiên cường, sức bật tinh thần", "Emotional resilience is essential for adolescent well-being.", "Sức bật tinh thần là điều cốt yếu đối với sự phát triển của lứa tuổi thiếu niên.")
            ]
        },

        # ════════════ KHỐI LỚP 10 ════════════
        {
            "title": "Lớp 10 - Unit 1 & 2: Family Life & Eco-friendly Living",
            "slug": "grade-10-family-eco",
            "description": "Gắn kết gia đình, lối sống xanh và bảo vệ sinh thái",
            "grade": "10",
            "words": [
                ("breadwinner", "/ˈbredˌwɪn.ər/", "Danh từ (n.)", "trụ cột kinh tế gia đình", "Both parents share the role of the family breadwinner.", "Cả bố và mẹ cùng san sẻ vai trò trụ cột kinh tế gia đình."),
                ("homemaker", "/ˈhəʊmˌmeɪ.kər/", "Danh từ (n.)", "người nội trợ quán xuyến gia đình", "Being a homemaker involves managing household chores efficiently.", "Làm người nội trợ đòi hỏi việc quán xuyến công việc nhà hiệu quả."),
                ("eco-friendly", "/ˌiː.kəʊˈfrend.li/", "Tính từ (adj.)", "thân thiện với môi trường sinh thái", "We choose eco-friendly packaging made from cassava starch.", "Chúng tôi chọn bao bì thân thiện với môi trường làm từ tinh bột sắn."),
                ("carbon footprint", "/ˌkɑː.bən ˈfʊt.prɪnt/", "Danh từ (n.)", "dấu chân phát thải carbon", "Cycling to school reduces your individual carbon footprint.", "Đi xe đạp đến trường giúp giảm dấu chân carbon cá nhân của bạn."),
                ("sustainable", "/səˈsteɪ.nə.bəl/", "Tính từ (adj.)", "bền vững, lâu dài", "Sustainable agriculture protects topsoil and groundwater.", "Nông nghiệp bền vững bảo vệ lớp đất mặt và nguồn nước ngầm.")
            ]
        },
        {
            "title": "Lớp 10 - Unit 5 & 8: Digital Age & Modern Inventions",
            "slug": "grade-10-digital-inventions",
            "description": "Thời đại kỹ thuật số, phát minh công nghệ và trí tuệ nhân tạo",
            "grade": "10",
            "words": [
                ("artificial intelligence", "/ˌɑː.tɪ.fɪʃ.əl ɪnˈtel.ɪ.dʒəns/", "Danh từ (n.)", "trí tuệ nhân tạo (AI)", "Artificial intelligence revolutionizes medical diagnosis.", "Trí tuệ nhân tạo cách mạng hóa việc chẩn đoán y khoa."),
                ("ubiquitous", "/juːˈbɪk.wɪ.təs/", "Tính từ (adj.)", "phổ biến khắp nơi, có mặt ở mọi nơi", "Smartphones have become ubiquitous in modern society.", "Điện thoại thông minh đã trở nên phổ biến khắp mọi nơi trong xã hội hiện đại."),
                ("breakthrough", "/ˈbreɪk.θruː/", "Danh từ (n.)", "bước đột phá công nghệ", "Quantum computing represents a major scientific breakthrough.", "Máy tính lượng tử đại diện cho một bước đột phá khoa học lớn."),
                ("autonomous", "/ɔːˈtɒn.ə.məs/", "Tính từ (adj.)", "tự hành, tự chủ độc lập", "Autonomous vehicles navigate urban streets safely.", "Xe tự hành di chuyển trên các tuyến phố đô thị một cách an toàn."),
                ("innovative", "/ˈɪn.ə.və.tɪv/", "Tính từ (adj.)", "sáng tạo, đổi mới", "The startup introduced an innovative educational app.", "Công ty khởi nghiệp đã giới thiệu một ứng dụng giáo dục đổi mới sáng tạo.")
            ]
        },

        # ════════════ KHỐI LỚP 11 ════════════
        {
            "title": "Lớp 11 - Unit 1 & 2: Healthy Life & Generation Gap",
            "slug": "grade-11-health-generation",
            "description": "Sống thọ khỏe mạnh và thấu hiểu khoảng cách thế hệ",
            "grade": "11",
            "words": [
                ("longevity", "/lɒnˈdʒev.ə.ti/", "Danh từ (n.)", "sự trường thọ, tuổi thọ cao", "A Mediterranean diet is associated with human longevity.", "Chế độ ăn Địa Trung Hải gắn liền với sự trường thọ của con người."),
                ("antibiotic", "/ˌæn.ti.baɪˈɒt.ɪk/", "Danh từ (n.)", "thuốc kháng sinh", "Doctors prescribe antibiotics only for bacterial infections.", "Bác sĩ chỉ kê đơn kháng sinh cho các bệnh nhiễm khuẩn."),
                ("generation gap", "/ˌdʒen.əˈreɪ.ʃən ˌɡæp/", "Danh từ (n.)", "khoảng cách thế hệ tư tưởng", "Open communication bridges the generation gap between parents and teens.", "Giao tiếp cởi mở giúp thu hẹp khoảng cách thế hệ giữa cha mẹ và con cái."),
                ("viewpoint", "/ˈvjuː.pɔɪnt/", "Danh từ (n.)", "quan điểm, góc nhìn", "We must respect differing viewpoints during discussions.", "Chúng ta cần tôn trọng những quan điểm khác biệt trong các cuộc thảo luận."),
                ("conflict", "/ˈkɒn.flɪkt/", "Danh từ (n.)", "xung đột, mâu thuẫn", "Constructive dialogue resolves family conflicts peacefully.", "Đối thoại mang tính xây dựng giải quyết xung đột gia đình một cách êm đẹp.")
            ]
        },
        {
            "title": "Lớp 11 - Unit 3 & 5: Smart Cities & Global Warming",
            "slug": "grade-11-smart-cities-climate",
            "description": "Thành phố thông minh tương lai và biến đổi khí hậu toàn cầu",
            "grade": "11",
            "words": [
                ("infrastructure", "/ˈɪn.frəˌstrʌk.tʃər/", "Danh từ (n.)", "cơ sở hạ tầng đô thị", "High-speed rail is vital infrastructure for economic growth.", "Đường sắt cao tốc là cơ sở hạ tầng thiết yếu cho tăng trưởng kinh tế."),
                ("renewable", "/rɪˈnjuː.ə.bəl/", "Tính từ (adj.)", "có thể tái tạo vô hạn", "Solar and wind are primary renewable energy sources.", "Năng lượng mặt trời và gió là các nguồn năng lượng tái tạo chủ đạo."),
                ("greenhouse effect", "/ˈɡriːn.haʊs ɪˌfekt/", "Danh từ (n.)", "hiệu ứng nhà kính", "The greenhouse effect traps solar heat in the atmosphere.", "Hiệu ứng nhà kính giữ nhiệt lượng mặt trời trong khí quyển."),
                ("deforestation", "/diːˌfɒr.ɪˈsteɪ.ʃən/", "Danh từ (n.)", "nạn phá rừng, chặt cây rừng", "Deforestation accelerates global carbon emissions drastically.", "Nạn phá rừng làm gia tăng lượng khí thải carbon toàn cầu một cách chóng mặt."),
                ("catastrophic", "/ˌkæt.əˈstrɒf.ɪk/", "Tính từ (adj.)", "thảm khốc, tai họa nghiêm trọng", "Rising sea levels could cause catastrophic coastal flooding.", "Mực nước biển dâng cao có thể gây ra lũ lụt ven biển thảm khốc.")
            ]
        },

        # ════════════ KHỐI LỚP 12 ════════════
        {
            "title": "Lớp 12 - Unit 1 & 2: Life Stories & Multicultural World",
            "slug": "grade-12-life-stories-culture",
            "description": "Câu chuyện danh nhân truyền cảm hứng và thế giới đa văn hóa",
            "grade": "12",
            "words": [
                ("biography", "/baɪˈɒɡ.rə.fi/", "Danh từ (n.)", "tiểu sử, truyện danh nhân", "He authored an inspiring biography of Uncle Ho.", "Ông đã chắp bút cuốn tiểu sử truyền cảm hứng về Bác Hồ."),
                ("perseverance", "/ˌpɜː.sɪˈvɪə.rəns/", "Danh từ (n.)", "sự kiên trì, bền bỉ vượt khó", "Her academic success was achieved through sheer perseverance.", "Thành công học tập của cô đạt được nhờ vào sự kiên trì tuyệt đối."),
                ("heritage", "/ˈher.ɪ.tɪdʒ/", "Danh từ (n.)", "di sản văn hóa truyền thống", "Hoi An ancient town is a UNESCO World Heritage site.", "Phố cổ Hội An là di sản thế giới được UNESCO công nhận."),
                ("customary", "/ˈkʌs.tə.mər.i/", "Tính từ (adj.)", "theo phong tục tập quán", "It is customary to remove shoes before entering Vietnamese homes.", "Tháo giày trước khi vào nhà là phong tục truyền thống tại Việt Nam."),
                ("assimilation", "/əˌsɪm.ɪˈleɪ.ʃən/", "Danh từ (n.)", "sự đồng hóa văn hóa", "Cultural diversity values integration over forced assimilation.", "Đa dạng văn hóa coi trọng sự hội nhập hơn là đồng hóa gượng ép.")
            ]
        },
        {
            "title": "Lớp 12 - Unit 3 & 5: Green Living & AI Careers",
            "slug": "grade-12-green-ai-careers",
            "description": "Sống xanh bền vững và định hướng nghề nghiệp thời đại AI",
            "grade": "12",
            "words": [
                ("biodegradable", "/ˌbaɪ.əʊ.dɪˈɡreɪ.də.bəl/", "Tính từ (adj.)", "tự phân hủy sinh học", "Biodegradable straws break down naturally in soil.", "Ống hút phân hủy sinh học tự phân rã tự nhiên trong đất."),
                ("preservation", "/ˌprez.əˈveɪ.ʃən/", "Danh từ (n.)", "sự bảo tồn, gìn giữ", "Wildlife preservation sanctuaries protect endangered species.", "Các khu bảo tồn động vật hoang dã bảo vệ các loài có nguy cơ tuyệt chủng."),
                ("competency", "/ˈkɒm.pɪ.tən.si/", "Danh từ (n.)", "năng lực thực tế, năng lực nghề nghiệp", "Digital competency is mandatory for the twenty-first century workforce.", "Năng lực kỹ thuật số là bắt buộc đối với lực lượng lao động thế kỷ 21."),
                ("collaborate", "/kəˈlæb.ə.reɪt/", "Động từ (v.)", "hợp tác, làm việc nhóm", "Students collaborate effectively on multidisciplinary STEM projects.", "Học sinh hợp tác hiệu quả trong các dự án STEM liên môn."),
                ("transformative", "/trænsˈfɔː.mə.tɪv/", "Tính từ (adj.)", "mang tính biến đổi sâu sắc", "AI education brings transformative improvements to learning pathways.", "Giáo dục AI mang lại những cải tiến mang tính biến đổi sâu sắc cho lộ trình học tập.")
            ]
        },

        # ════════════ CHUYÊN ĐỀ ÔN THI THPT QUỐC GIA ════════════
        {
            "title": "Chuyên Đề THPT - Collocations Trọng Điểm Điểm 8+ & 9+",
            "slug": "thpt-collocations-mastery",
            "description": "Các cụm từ cố định xuất hiện với tần suất cao nhất trong đề thi tốt nghiệp THPT",
            "grade": "12",
            "words": [
                ("make a difference", "/meɪk ə ˈdɪf.ər.əns/", "Cụm động từ (colloc.)", "tạo nên sự khác biệt, có tác động tích cực", "Volunteering helps you make a difference in your community.", "Hoạt động tình nguyện giúp bạn tạo nên sự khác biệt trong cộng đồng."),
                ("pay attention to", "/peɪ əˈten.ʃən tuː/", "Cụm động từ (colloc.)", "chú ý, tập trung vào điều gì", "Students must pay attention to grammatical agreement.", "Học sinh cần chú ý đến sự hòa hợp ngữ pháp."),
                ("take advantage of", "/teɪk ədˈvɑːn.tɪdʒ ɒv/", "Cụm động từ (colloc.)", "tận dụng, khai thác cơ hội", "You should take advantage of the digital learning resources.", "Bạn nên tận dụng các nguồn tài liệu học tập kỹ thuật số."),
                ("bear in mind", "/beər ɪn maɪnd/", "Cụm thành ngữ (idiom)", "ghi nhớ kỹ trong đầu", "Bear in mind that practice makes perfect.", "Hãy ghi nhớ rằng luyện tập tạo nên sự hoàn hảo."),
                ("come to a conclusion", "/kʌm tuː ə kənˈkluː.ʒən/", "Cụm động từ (colloc.)", "đi đến kết luận cuối cùng", "After careful analysis, the committee came to a conclusion.", "Sau khi phân tích kỹ lưỡng, hội đồng đã đi đến kết luận.")
            ]
        },
        {
            "title": "Chuyên Đề THPT - Phrasal Verbs & Thành Ngữ Thường Gặp",
            "slug": "thpt-phrasal-verbs-idioms",
            "description": "Các cụm động từ đa nghĩa và thành ngữ ăn điểm câu hỏi phân hóa",
            "grade": "12",
            "words": [
                ("carry out", "/ˈkær.i aʊt/", "Cụm động từ (phr. v.)", "tiến hành, thực hiện (nghiên cứu, kế hoạch)", "Scientists carry out rigorous experiments on new vaccines.", "Các nhà khoa học tiến hành những thí nghiệm nghiêm ngặt về vắc-xin mới."),
                ("call off", "/kɔːl ɒf/", "Cụm động từ (phr. v.)", "hủy bỏ (cuộc họp, sự kiện)", "The outdoor ceremony was called off due to heavy downpours.", "Buổi lễ ngoài trời đã bị hủy bỏ do mưa lớn xối xả."),
                ("put up with", "/pʊt ʌp wɪð/", "Cụm động từ (phr. v.)", "chịu đựng, nhẫn nhịn", "He cannot put up with the loud noise from construction sites.", "Anh ấy không thể chịu đựng được tiếng ồn lớn từ các công trường xây dựng."),
                ("burn the midnight oil", "/bɜːn ðə ˈmɪd.naɪt ɔɪl/", "Thành ngữ (idiom)", "thức khuya học bài, miệt mài làm việc", "She burned the midnight oil studying for the national exam.", "Cô ấy thức khuya miệt mài học bài chuẩn bị cho kỳ thi quốc gia."),
                ("hit the books", "/hɪt ðə bʊks/", "Thành ngữ (idiom)", "bắt đầu học tập chăm chỉ", "It is time to hit the books and prepare for midterms.", "Đã đến lúc tập trung học bài nghiêm túc để chuẩn bị cho kỳ thi giữa kỳ.")
            ]
        }
    ]

    total_words = 0
    for topic_data in TOPICS_DATA:
        cur.execute(
            "INSERT INTO vocabularytopic (title, slug, description, image, grade, is_active) VALUES (?, ?, ?, ?, ?, ?)",
            (topic_data["title"], topic_data["slug"], topic_data["description"], "", topic_data["grade"], 1)
        )
        topic_id = cur.lastrowid

        for w, ipa, pos, meaning, ex, ex_vi in topic_data["words"]:
            cur.execute(
                "INSERT INTO vocabularyword (topic_id, word, ipa, reading, pos, meaning, example, example_vi, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (topic_id, w, ipa, "", pos, meaning, ex, ex_vi, 1)
            )
            total_words += 1

    conn.commit()
    conn.close()
    print(f"[OK] Da nap thanh cong {len(TOPICS_DATA)} chu de va {total_words} tu vung vao Database!")

if __name__ == "__main__":
    seed()
