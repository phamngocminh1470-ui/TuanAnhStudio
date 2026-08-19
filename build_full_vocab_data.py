"""
build_full_vocab_data.py
Sinh ra kho từ vựng khổng lồ (hơn 500+ từ vựng phong phú song ngữ Anh-Việt, IPA, câu ví dụ)
và nạp đồng thời vào:
1. frontend/src/components/vocabData.js
2. backend/ai_english_mentor.db (SQLite)
"""

import os
import json
import sqlite3

DATA = [
  # ═══════════════════════════ KHỐI LỚP 6 ═══════════════════════════
  {
    "topicId": "g6_u1",
    "topicTitle": "Lớp 6 - Unit 1 & 2: Trường Học & Ngôi Nhà (School & Home)",
    "grade": "6",
    "category": "school_life",
    "categoryLabel": "Trường học & Gia đình",
    "description": "Từ vựng thông dụng về đồ dùng học tập, phòng ốc và nếp sống sinh hoạt",
    "words": [
      ("calculator", "/ˈkæl.kjə.leɪ.tər/", "Danh từ (n.)", "máy tính cầm tay bỏ túi", "I always bring my calculator to maths class.", "Tôi luôn mang máy tính cầm tay đến giờ học toán."),
      ("compass", "/ˈkʌm.pəs/", "Danh từ (n.)", "com-pa vẽ hình tròn", "You need a compass to draw circles in geometry.", "Bạn cần com-pa để vẽ các hình tròn trong môn hình học."),
      ("uniform", "/ˈjuː.nɪ.fɔːm/", "Danh từ (n.)", "đồng phục học sinh", "All students wear clean uniforms on Monday.", "Tất cả học sinh đều mặc đồng phục sạch đẹp vào thứ Hai."),
      ("creative", "/kriˈeɪ.tɪv/", "Tính từ (adj.)", "sáng tạo, có óc tưởng tượng", "She is a creative student who loves painting.", "Cô ấy là một học sinh sáng tạo và rất thích vẽ tranh."),
      ("balcony", "/ˈbæl.kə.ni/", "Danh từ (n.)", "ban công ngôi nhà", "Our apartment has a small balcony with pretty roses.", "Căn hộ của chúng tôi có một ban công nhỏ trồng hoa hồng xinh xắn."),
      ("boarding school", "/ˈbɔː.dɪŋ ˌskuːl/", "Danh từ (n.)", "trường nội trú", "He stays at a boarding school and visits home on weekends.", "Cậu ấy ở trường nội trú và về thăm nhà vào cuối tuần."),
      ("textbook", "/ˈtekst.bʊk/", "Danh từ (n.)", "sách giáo khoa học tập", "Please open your English textbook to page twenty.", "Xin mời các em mở sách giáo khoa tiếng Anh trang 20."),
      ("neighborhood", "/ˈneɪ.bə.hʊd/", "Danh từ (n.)", "khu phố, hàng xóm lân cận", "There is a quiet library in our neighborhood.", "Có một thư viện yên tĩnh trong khu phố của chúng tôi."),
      ("teacher", "/ˈtiː.tʃər/", "Danh từ (n.)", "giáo viên, thầy cô giáo", "Our English teacher is dedicated and enthusiastic.", "Giáo viên tiếng Anh của chúng tôi rất tận tâm và nhiệt huyết."),
      ("classroom", "/ˈklɑːs.ruːm/", "Danh từ (n.)", "phòng học, lớp học", "Students clean the classroom after lessons.", "Học sinh dọn dẹp phòng học sau các tiết học."),
      ("principal", "/ˈprɪn.sə.pəl/", "Danh từ (n.)", "hiệu trưởng nhà trường", "The school principal gave a warm welcome speech.", "Thầy hiệu trưởng đã có bài phát biểu chào mừng nồng nhiệt."),
      ("classmate", "/ˈklɑːs.meɪt/", "Danh từ (n.)", "bạn cùng lớp", "My classmates are always friendly and helpful.", "Các bạn cùng lớp của tôi luôn thân thiện và giúp đỡ lẫn nhau."),
      ("backpack", "/ˈbæk.pæk/", "Danh từ (n.)", "ba lô đi học", "He carries a heavy backpack full of books.", "Cậu ấy đeo một chiếc ba lô nặng đầy sách vở."),
      ("wardrobe", "/ˈwɔː.drəʊb/", "Danh từ (n.)", "tủ đựng quần áo", "She neatly hangs her dresses inside the wardrobe.", "Cô ấy treo những chiếc váy gọn gàng bên trong tủ quần áo."),
      ("microwave", "/ˈmaɪ.krə.weɪv/", "Danh từ (n.)", "lò vi sóng hâm nóng thức ăn", "Heat the leftover soup in the microwave.", "Hãy hâm nóng bát súp thừa trong lò vi sóng.")
    ]
  },
  {
    "topicId": "g6_u3",
    "topicTitle": "Lớp 6 - Unit 3 & 4: Bạn Bè & Khu Dân Cư (Friends & Neighborhood)",
    "grade": "6",
    "category": "school_life",
    "categoryLabel": "Bạn bè & Đời sống",
    "description": "Mô tả tính cách bạn bè và các địa điểm tiện ích quanh nơi ở",
    "words": [
      ("confident", "/ˈkɒn.fɪ.dənt/", "Tính từ (adj.)", "tự tin, bạo dạn", "She is confident when speaking in front of the class.", "Cô ấy rất tự tin khi phát biểu trước cả lớp."),
      ("patient", "/ˈpeɪ.ʃənt/", "Tính từ (adj.)", "kiên nhẫn, nhẫn nại", "A good teacher is always patient with slow learners.", "Một giáo viên giỏi luôn kiên nhẫn với những học sinh tiếp thu chậm."),
      ("curious", "/ˈkjʊə.ri.əs/", "Tính từ (adj.)", "tò mò, ham học hỏi", "Children are naturally curious about nature.", "Trẻ em vốn có tính tò mò tự nhiên về thế giới tự nhiên."),
      ("hard-working", "/ˌhɑːdˈwɜː.kɪŋ/", "Tính từ (adj.)", "chăm chỉ, siêng năng", "Hard-working students achieve high test scores.", "Những học sinh chăm chỉ sẽ đạt được điểm số cao trong bài thi."),
      ("pharmacy", "/ˈfɑː.mə.si/", "Danh từ (n.)", "hiệu thuốc tây", "You can buy medicine at the corner pharmacy.", "Bạn có thể mua thuốc tại hiệu thuốc ở góc phố."),
      ("bakery", "/ˈbeɪ.kər.i/", "Danh từ (n.)", "tiệm bánh mì, bánh ngọt", "The fresh smell from the bakery attracts morning customers.", "Mùi thơm tươi mới từ tiệm bánh thu hút khách mua buổi sáng."),
      ("peaceful", "/ˈpiːs.fəl/", "Tính từ (adj.)", "yên bình, thanh thản", "I love the peaceful atmosphere of the countryside.", "Tôi yêu bầu không khí yên bình của vùng nông thôn."),
      ("crowded", "/ˈkraʊ.dɪd/", "Tính từ (adj.)", "đông đúc, chen chúc", "The central market is crowded on weekend mornings.", "Chợ trung tâm rất đông đúc vào các buổi sáng cuối tuần."),
      ("historical", "/hɪˈstɒr.ɪ.kəl/", "Tính từ (adj.)", "thuộc về lịch sử, cổ kính", "Hue is famous for its historical royal citadels.", "Huế nổi tiếng với những tòa thành hoàng gia lịch sử cổ kính."),
      ("convenient", "/kənˈviː.ni.ənt/", "Tính từ (adj.)", "thuận tiện, tiện lợi", "Living near a supermarket is extremely convenient.", "Sống gần siêu thị là điều vô cùng tiện lợi.")
    ]
  },
  {
    "topicId": "g6_u6",
    "topicTitle": "Lớp 6 - Unit 6 & 8: Lễ Hội Ngày Tết & Thể Thao (Tet & Sports)",
    "grade": "6",
    "category": "culture_sports",
    "categoryLabel": "Lễ hội & Thể thao",
    "description": "Ngày Tết cổ truyền Việt Nam và các môn thể thao vận động thường ngày",
    "words": [
      ("celebrate", "/ˈsel.ə.breɪt/", "Động từ (v.)", "ăn mừng, kỷ niệm ngày lễ Tết", "Families gather to celebrate the Lunar New Year.", "Các gia đình sum vầy để ăn mừng Tết Nguyên Đán."),
      ("firework", "/ˈfaɪə.wɜːk/", "Danh từ (n.)", "pháo hoa rực rỡ", "We watch colorful fireworks on New Year Eve.", "Chúng tôi ngắm pháo hoa rực rỡ sắc màu vào đêm Giao thừa."),
      ("equipment", "/ɪˈkwɪp.mənt/", "Danh từ (n.)", "dụng cụ, trang thiết bị tập luyện", "Wear protective equipment when skateboarding.", "Hãy đeo dụng cụ bảo hộ khi trượt ván."),
      ("marathon", "/ˈmær.ə.θən/", "Danh từ (n.)", "cuộc chạy đường trường ma-ra-tông", "Thousands ran in the annual charity marathon.", "Hàng ngàn người đã chạy trong cuộc thi marathon từ thiện hàng năm."),
      ("gymnasium", "/dʒɪmˈneɪ.zi.əm/", "Danh từ (n.)", "phòng tập thể chất trong nhà", "We play badminton inside the school gymnasium.", "Chúng tôi chơi cầu lông bên trong nhà thể chất của trường."),
      ("badminton", "/ˈbæd.mɪn.tən/", "Danh từ (n.)", "môn cầu lông", "Badminton improves hand-eye coordination.", "Môn cầu lông giúp cải thiện phản xạ tay mắt."),
      ("tournament", "/ˈtʊə.nə.mənt/", "Danh từ (n.)", "giải đấu thể thao", "Our football team won the district tournament.", "Đội bóng đá của chúng tôi đã vô địch giải đấu cấp quận."),
      ("champion", "/ˈtʃæm.pi.ən/", "Danh từ (n.)", "nhà vô địch, quán quân", "The young athlete trained tirelessly to become champion.", "Vận động viên trẻ đã tập luyện không ngừng nghỉ để trở thành nhà vô địch."),
      ("lucky money", "/ˈlʌk.i ˌmʌn.i/", "Danh từ (n.)", "tiền mừng tuổi, tiền lì xì", "Children receive lucky money inside red envelopes.", "Trẻ em nhận được tiền lì xì bên trong những bao bao lì xì đỏ."),
      ("decorate", "/ˈdek.ə.reɪt/", "Động từ (v.)", "trang hoàng, trang trí", "We decorate our living room with yellow apricot blossoms.", "Chúng tôi trang trí phòng khách bằng những cành hoa mai vàng.")
    ]
  },

  # ═══════════════════════════ KHỐI LỚP 7 ═══════════════════════════
  {
    "topicId": "g7_u1",
    "topicTitle": "Lớp 7 - Unit 1 & 2: Sở Thích & Lối Sống Lành Mạnh (Hobbies & Health)",
    "grade": "7",
    "category": "health_sports",
    "categoryLabel": "Sức khỏe & Sở thích",
    "description": "Sở thích lành mạnh, chế độ ăn uống và chăm sóc sức khỏe thể chất",
    "words": [
      ("hobby", "/ˈhɒb.i/", "Danh từ (n.)", "sở thích lúc rảnh rỗi", "Gardening is my mother favorite weekend hobby.", "Làm vườn là sở thích cuối tuần yêu thích của mẹ tôi."),
      ("cardiology", "/ˌkɑː.diˈɒl.ə.dʒi/", "Danh từ (n.)", "tim mạch học, sức khỏe tim", "Cardio exercises strengthen your heart muscle.", "Các bài tập cardio giúp tăng cường cơ tim của bạn."),
      ("sunburn", "/ˈsʌn.bɜːn/", "Danh từ (n.)", "sự cháy nắng, sạm da do nắng", "Apply sunscreen to avoid severe sunburn at the beach.", "Hãy bôi kem chống nắng để tránh bị cháy nắng nghiêm trọng ở bãi biển."),
      ("vegetarian", "/ˌvedʒ.ɪˈteə.ri.ən/", "Danh từ (n.)", "người ăn chay thanh tịnh", "A vegetarian diet focuses on vegetables and tofu.", "Chế độ ăn chay tập trung vào rau củ quả và đậu phụ."),
      ("dimple", "/ˈdɪm.pəl/", "Danh từ (n.)", "má lúm đồng tiền", "She shows lovely dimples when she smiles happily.", "Cô ấy để lộ má lúm đồng tiền đáng yêu khi cười vui vẻ."),
      ("nutrition", "/njuːˈtrɪʃ.ən/", "Danh từ (n.)", "dinh dưỡng, chế độ ăn uống", "Good nutrition gives students sustained energy.", "Dinh dưỡng tốt mang lại cho học sinh nguồn năng lượng bền bỉ."),
      ("allergy", "/ˈæl.ə.dʒi/", "Danh từ (n.)", "chứng dị ứng thức ăn/thời tiết", "He developed an allergy to seafood.", "Cậu ấy bị dị ứng với các món hải sản."),
      ("acne", "/ˈæk.ni/", "Danh từ (n.)", "mụn trứng cá tuổi dậy thì", "Washing your face twice daily helps prevent acne.", "Rửa mặt hai lần mỗi ngày giúp ngăn ngừa mụn trứng cá."),
      ("calorie", "/ˈkæl.ər.i/", "Danh từ (n.)", "calo năng lượng thực phẩm", "Jogging burns roughly three hundred calories per hour.", "Chạy bộ đốt cháy khoảng 300 calo mỗi giờ."),
      ("balanced diet", "/ˌbæl.ənst ˈdaɪ.ət/", "Cụm danh từ (n. phr.)", "chế độ ăn uống cân bằng dinh dưỡng", "A balanced diet consists of grains, proteins and greens.", "Một chế độ ăn uống cân bằng bao gồm ngũ cốc, chất đạm và rau xanh.")
    ]
  },
  {
    "topicId": "g7_u3",
    "topicTitle": "Lớp 7 - Unit 3 & 7: Hoạt Động Thiện Nguyện & Giao Thông (Community & Traffic)",
    "grade": "7",
    "category": "community_skills",
    "categoryLabel": "Cộng đồng & Giao thông",
    "description": "Hoạt động thiện nguyện vì xã hội và văn hóa an toàn giao thông",
    "words": [
      ("volunteer", "/ˌvɒl.ənˈtɪər/", "Động từ (v.) / Danh từ (n.)", "tình nguyện viên, làm từ thiện", "Teens volunteer to teach English to orphans.", "Thanh thiếu niên tình nguyện dạy tiếng Anh cho trẻ mồ côi."),
      ("donate", "/dəʊˈneɪt/", "Động từ (v.)", "quyên góp, ủng hộ tiền/đồ dùng", "We donate warm clothes and notebooks to poor schools.", "Chúng tôi quyên góp quần áo ấm và vở viết cho các trường khó khăn."),
      ("pedestrian", "/pəˈdes.tri.ən/", "Danh từ (n.)", "người đi bộ qua đường", "Pedestrians should always cross at zebra crossings.", "Người đi bộ nên luôn sang đường tại vạch kẻ ngựa vằn."),
      ("congestion", "/kənˈdʒes.tʃən/", "Danh từ (n.)", "sự ùn tắc giao thông, kẹt xe", "Heavy congestion delays commuters every morning.", "Ùn tắc nghiêm trọng làm chậm trễ người đi làm mỗi buổi sáng."),
      ("helmet", "/ˈhel.mɪt/", "Danh từ (n.)", "mũ bảo hiểm an toàn", "Always fasten your helmet securely before riding a motorbike.", "Luôn cài quai mũ bảo hiểm chắc chắn trước khi đi xe máy."),
      ("orphanage", "/ˈɔː.fən.ɪdʒ/", "Danh từ (n.)", "trại trẻ mồ côi", "Volunteers organize weekend art workshops at the local orphanage.", "Các tình nguyện viên tổ chức lớp học vẽ cuối tuần tại trại trẻ mồ côi."),
      ("seatbelt", "/ˈsiːtˌbelt/", "Danh từ (n.)", "dây đai an toàn trên xe", "Fasten your seatbelt whenever riding inside an automobile.", "Hãy thắt dây an toàn bất cứ khi nào bạn ngồi trên xe ô tô."),
      ("reckless", "/ˈrek.ləs/", "Tính từ (adj.)", "bất cẩn, liều lĩnh nguy hiểm", "Reckless driving poses life-threatening dangers.", "Lái xe liều lĩnh gây ra những hiểm họa đe dọa đến tính mạng."),
      ("pavement", "/ˈpeɪv.mənt/", "Danh từ (n.)", "vỉa hè cho người đi bộ", "Do not park motorbikes on the pedestrian pavement.", "Không được đỗ xe máy trên vỉa hè dành cho người đi bộ."),
      ("roundabout", "/ˈraʊnd.ə.baʊt/", "Danh từ (n.)", "vòng xuyến giao thông, bùng binh", "Slow down and yield when entering a traffic roundabout.", "Hãy giảm tốc độ và nhường đường khi đi vào vòng xuyến giao thông.")
    ]
  },

  # ═══════════════════════════ KHỐI LỚP 8 ═══════════════════════════
  {
    "topicId": "g8_u1",
    "topicTitle": "Lớp 8 - Unit 1 & 2: Cuộc Sống Nông Thôn & Giải Trí (Leisure & Countryside)",
    "grade": "8",
    "category": "life_countryside",
    "categoryLabel": "Đời sống nông thôn",
    "description": "Giải trí thanh bình và nét văn hóa mộc mạc làng quê",
    "words": [
      ("origami", "/ˌɒr.ɪˈɡɑː.mi/", "Danh từ (n.)", "nghệ thuật gấp giấy Nhật Bản", "He folds complex animals using origami paper.", "Cậu ấy gấp những con thú phức tạp bằng giấy origami."),
      ("nomadic", "/nəʊˈmæd.ɪk/", "Tính từ (adj.)", "du mục, chăn thả nay đây mai đó", "Nomadic herders travel across vast grassy plains.", "Những người chăn gia súc du mục di chuyển qua những đồng cỏ bao la."),
      ("pasture", "/ˈpɑːs.tʃər/", "Danh từ (n.)", "đồng cỏ xanh chăn thả gia súc", "Horses graze freely on the open green pasture.", "Những chú ngựa gặm cỏ tự do trên đồng cỏ xanh mướt."),
      ("harvest", "/ˈhɑː.vɪst/", "Danh từ (n.) / Động từ (v.)", "mùa thu hoạch, gặt hái lúa vụ", "Farmers celebrate a bountiful autumn harvest.", "Người nông dân ăn mừng một mùa thu hoạch bội thu."),
      ("generous", "/ˈdʒen.ər.əs/", "Tính từ (adj.)", "hào phóng, cởi mở rộng lượng", "Villagers are known for their generous hospitality.", "Người dân làng nổi tiếng với lòng hiếu khách hào phóng."),
      ("picturesque", "/ˌpɪk.tʃərˈesk/", "Tính từ (adj.)", "đẹp như tranh vẽ", "The small village is surrounded by picturesque mountains.", "Ngôi làng nhỏ được bao quanh bởi những ngọn núi đẹp như tranh vẽ."),
      ("cultivate", "/ˈkʌl.tɪ.veɪt/", "Động từ (v.)", "canh tác, trồng trọt hoa màu", "Farmers cultivate rice and vegetables in fertile soil.", "Nông dân canh tác lúa và hoa màu trên mảnh đất màu mỡ."),
      ("tranquil", "/ˈtræŋ.kwɪl/", "Tính từ (adj.)", "yên ả, thanh bình tĩnh lặng", "The lake offers a tranquil retreat from bustling city noise.", "Hồ nước mang lại một chốn nghỉ dưỡng yên ả tránh xa tiếng ồn ào thành thị."),
      ("buffalo", "/ˈbʌf.ə.ləʊ/", "Danh từ (n.)", "con trâu nước kéo cày", "Water buffaloes have long assisted Vietnamese rice farmers.", "Con trâu nước từ lâu đã là người bạn hỗ trợ đắc lực cho người nông dân trồng lúa."),
      ("hospitable", "/hɒsˈpɪt.ə.bəl/", "Tính từ (adj.)", "hiếu khách, mến khách", "Local inhabitants are remarkably warm and hospitable.", "Người dân địa phương vô cùng ấm áp và hiếu khách.")
    ]
  },
  {
    "topicId": "g8_u7",
    "topicTitle": "Lớp 8 - Unit 7 & 8: Ô Nhiễm Môi Trường & Khoa Học (Pollution & Science)",
    "grade": "8",
    "category": "environment_global",
    "categoryLabel": "Môi trường & Khoa học",
    "description": "Các dạng ô nhiễm sinh thái và khám phá khoa học vũ trụ",
    "words": [
      ("pollutant", "/pəˈluː.tənt/", "Danh từ (n.)", "chất thải độc hại gây ô nhiễm", "Chemical pollutants poison freshwater streams.", "Các chất ô nhiễm hóa học đầu độc những dòng suối nước ngọt."),
      ("aquatic", "/əˈkwæt.ɪk/", "Tính từ (adj.)", "thuộc về thủy sinh, dưới nước", "Oil spills endanger diverse aquatic organisms.", "Các vụ tràn dầu đe dọa nhiều sinh vật thủy sinh đa dạng."),
      ("monument", "/ˈmɒn.jə.mənt/", "Danh từ (n.)", "đài tưởng niệm, tượng đài lịch sử", "Big Ben is an iconic historical monument in London.", "Tháp đồng hồ Big Ben là một tượng đài lịch sử mang tính biểu tượng ở London."),
      ("bilingual", "/baɪˈlɪŋ.ɡwəl/", "Tính từ (adj.)", "sử dụng song ngữ, hai thứ tiếng", "Being bilingual gives students international career advantages.", "Thành thạo song ngữ mang lại cho học sinh nhiều lợi thế nghề nghiệp quốc tế."),
      ("contamination", "/kənˌtæm.ɪˈneɪ.ʃən/", "Danh từ (n.)", "sự nhiễm độc, nhiễm bẩn", "Soil contamination harms crop yields.", "Sự nhiễm độc đất gây tổn hại đến năng suất cây trồng."),
      ("acid rain", "/ˌæs.ɪd ˈreɪn/", "Danh từ (n.)", "mưa axit gây hại cây trồng", "Acid rain damages forests and historic stone buildings.", "Mưa axit tàn phá các khu rừng và những tòa nhà đá cổ kính."),
      ("deforestation", "/diːˌfɒr.ɪˈsteɪ.ʃən/", "Danh từ (n.)", "nạn chặt phá rừng bừa bãi", "Deforestation accelerates the pace of global warming.", "Nạn phá rừng làm đẩy nhanh tốc độ nóng lên toàn cầu."),
      ("ecosystem", "/ˈiː.kəʊˌsɪs.təm/", "Danh từ (n.)", "hệ sinh thái tự nhiên", "Coral reefs represent a fragile marine ecosystem.", "Rạn san hô đại diện cho một hệ sinh thái biển vô cùng mỏng manh."),
      ("radioactive", "/ˌreɪ.di.əʊˈæk.tɪv/", "Tính từ (adj.)", "phóng xạ nguy hiểm", "Radioactive waste requires safe underground containment.", "Rác thải phóng xạ đòi hỏi việc lưu trữ an toàn sâu trong lòng đất."),
      ("biodiversity", "/ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/", "Danh từ (n.)", "sự đa dạng sinh học", "Preserving biodiversity maintains ecological equilibrium.", "Bảo tồn đa dạng sinh học giúp duy trì trạng thái cân bằng sinh thái.")
    ]
  },

  # ═══════════════════════════ KHỐI LỚP 9 ═══════════════════════════
  {
    "topicId": "g9_u1",
    "topicTitle": "Lớp 9 - Unit 1 & 2: Làng Nghề Thủ Công & Nhịp Sống Đô Thị (Crafts & City Life)",
    "grade": "9",
    "category": "culture_city",
    "categoryLabel": "Làng nghề & Đô thị",
    "description": "Nghề thủ công truyền thống và nhịp sống đô thị hiện đại",
    "words": [
      ("artisan", "/ˌɑː.tɪˈzæn/", "Danh từ (n.)", "nghệ nhân thủ công lành nghề", "Village artisans preserve ceramic pottery skills.", "Các nghệ nhân trong làng gìn giữ kỹ nghệ làm đồ gốm sứ."),
      ("handicraft", "/ˈhæn.dɪ.krɑːft/", "Danh từ (n.)", "sản phẩm thủ công mỹ nghệ", "Vietnamese handicrafts are exported to over 50 countries.", "Hàng thủ công mỹ nghệ Việt Nam được xuất khẩu tới hơn 50 quốc gia."),
      ("metropolis", "/məˈtrɒp.əl.ɪs/", "Danh từ (n.)", "đại đô thị sầm uất", "Ho Chi Minh City is a dynamic economic metropolis.", "Thành phố Hồ Chí Minh là một đại đô thị kinh tế năng động."),
      ("multicultural", "/ˌmʌl.tiˈkʌl.tʃər.əl/", "Tính từ (adj.)", "đa văn hóa, đa sắc tộc", "Living in a multicultural society fosters empathy.", "Sống trong một xã hội đa văn hóa nuôi dưỡng lòng thấu cảm."),
      ("amenity", "/əˈmiː.nə.ti/", "Danh từ (n.)", "tiện nghi đô thị công cộng", "The new residential area features modern sports amenities.", "Khu dân cư mới sở hữu các tiện nghi thể thao hiện đại."),
      ("conical hat", "/ˌkɒn.ɪ.kəl ˈhæt/", "Danh từ (n.)", "nón lá truyền thống Việt Nam", "The traditional conical hat shields farmers from sunlight.", "Chiếc nón lá truyền thống che mát cho người nông dân dưới ánh nắng."),
      ("lacquerware", "/ˈlæk.ə.weər/", "Danh từ (n.)", "đồ sơn mài mỹ nghệ", "Skilled craftsmen polish lacquerware to a brilliant shine.", "Những thợ thủ công khéo léo đánh bóng đồ sơn mài đạt độ sáng bóng rực rỡ."),
      ("urban sprawl", "/ˌɜː.bən ˈsprɔːl/", "Danh từ (n.)", "sự đô thị hóa tự phát, lan rộng đô thị", "Rapid urban sprawl consumes surrounding agricultural land.", "Sự mở rộng đô thị quá nhanh lấn chiếm đất nông nghiệp xung quanh."),
      ("cosmopolitan", "/ˌkɒz.məˈpɒl.ɪ.tən/", "Tính từ (adj.)", "mang tầm vóc quốc tế, đa sắc tộc", "London is a cosmopolitan center with people from everywhere.", "London là một trung tâm quốc tế quy tụ mọi người từ khắp nơi trên thế giới."),
      ("revitalize", "/riːˈvaɪ.təl.aɪz/", "Động từ (v.)", "tái sinh, phục hưng phát triển", "The municipality aims to revitalize rundown heritage streets.", "Chính quyền thành phố hướng tới việc phục hưng những con phố di sản xuống cấp.")
    ]
  },
  {
    "topicId": "g9_u3",
    "topicTitle": "Lớp 9 - Unit 3 & 4: Áp Lực Học Đường & Ký Ức Lịch Sử (Teen Stress & Past)",
    "grade": "9",
    "category": "teen_psychology",
    "categoryLabel": "Tâm lý học đường",
    "description": "Vượt qua áp lực học tập và ký ức lịch sử thế hệ trước",
    "words": [
      ("counselor", "/ˈkaʊn.səl.ər/", "Danh từ (n.)", "chuyên viên tư vấn tâm lý học đường", "Talk to your school counselor when feeling stressed.", "Hãy trò chuyện với chuyên viên tư vấn học đường khi bạn cảm thấy căng thẳng."),
      ("frustrated", "/frʌsˈtreɪ.tɪd/", "Tính từ (adj.)", "bực bội, nản lòng trước khó khăn", "Stay calm and avoid getting frustrated with errors.", "Hãy giữ bình tĩnh và tránh nản lòng trước những lỗi sai."),
      ("resilience", "/rɪˈzɪl.jəns/", "Danh từ (n.)", "sự kiên cường, sức bật tinh thần", "Building mental resilience helps teens overcome exams.", "Xây dựng sức bật tinh thần giúp học sinh vượt qua các kỳ thi."),
      ("illiterate", "/ɪˈlɪt.ər.ət/", "Tính từ (adj.)", "mù chữ, không biết đọc viết", "Free literacy classes helped illiterate villagers learn to read.", "Các lớp học xóa mù chữ miễn phí đã giúp người dân làng biết đọc."),
      ("preservation", "/ˌprez.əˈveɪ.ʃən/", "Danh từ (n.)", "sự bảo tồn di sản", "The preservation of historical monuments is essential.", "Bảo tồn các di tích lịch sử là điều vô cùng cần thiết."),
      ("overwhelmed", "/ˌəʊ.vəˈwelmd/", "Tính từ (adj.)", "bị choáng ngợp, quá tải áp lực", "Break large homework tasks down if feeling overwhelmed.", "Hãy chia nhỏ bài tập về nhà nếu bạn đang cảm thấy quá tải."),
      ("self-discipline", "/ˌselfˈdɪs.ə.plɪn/", "Danh từ (n.)", "tinh thần tự giác kỷ luật", "Self-discipline is fundamental to academic excellence.", "Tính tự kỷ luật là nền tảng của sự xuất sắc trong học tập."),
      ("thatched cottage", "/ˌθætʃt ˈkɒt.ɪdʒ/", "Danh từ (n.)", "ngôi nhà tranh mái lá xưa", "Generations lived simply inside small thatched cottages.", "Nhiều thế hệ xưa từng sinh sống mộc mạc trong những căn nhà tranh mái lá."),
      ("hardship", "/ˈhɑːd.ʃɪp/", "Danh từ (n.)", "gian khổ, thử thách chông gai", "Overcoming past hardships forged strong character.", "Vượt qua những gian khổ quá khứ đã tôi rèn nên tính cách kiên cường."),
      ("time management", "/ˈtaɪm ˌmæn.ɪdʒ.mənt/", "Danh từ (n.)", "kỹ năng quản lý thời gian", "Effective time management reduces exam anxiety.", "Quản lý thời gian hiệu quả giúp xua tan cảm giác lo âu thi cử.")
    ]
  },

  # ═══════════════════════════ KHỐI LỚP 10 ═══════════════════════════
  {
    "topicId": "g10_u1",
    "topicTitle": "Lớp 10 - Unit 1 & 2: Đời Sống Gia Đình & Sống Xanh (Family & Eco-Life)",
    "grade": "10",
    "category": "family_environment",
    "categoryLabel": "Gia đình & Sống xanh",
    "description": "Trách nhiệm gia đình và lối sống xanh bảo vệ môi trường",
    "words": [
      ("breadwinner", "/ˈbredˌwɪn.ər/", "Danh từ (n.)", "trụ cột kinh tế gia đình", "Both parents work hard as equal breadwinners.", "Cả bố và mẹ đều làm việc chăm chỉ như những trụ cột kinh tế bình đẳng."),
      ("homemaker", "/ˈhəʊmˌmeɪ.kər/", "Danh từ (n.)", "người nội trợ quán xuyến gia đình", "Being a skilled homemaker creates a cozy home environment.", "Trở thành người nội trợ khéo léo tạo nên không gian ấm cúng cho gia đình."),
      ("eco-friendly", "/ˌiː.kəʊˈfrend.li/", "Tính từ (adj.)", "thân thiện với môi trường sinh thái", "Use eco-friendly bamboo utensils instead of plastic.", "Hãy sử dụng dụng cụ ăn bằng tre thân thiện môi trường thay cho đồ nhựa."),
      ("carbon footprint", "/ˌkɑː.bən ˈfʊt.prɪnt/", "Danh từ (n.)", "dấu chân phát thải khí carbon", "Walking to school reduces your household carbon footprint.", "Đi bộ đến trường giúp giảm dấu chân phát thải carbon của gia đình bạn."),
      ("sustainable", "/səˈsteɪ.nə.bəl/", "Tính từ (adj.)", "bền vững, duy trì lâu dài", "Sustainable development balances economic growth and nature.", "Phát triển bền vững cân bằng giữa tăng trưởng kinh tế và tự nhiên."),
      ("appliances", "/əˈplaɪ.ən.sɪz/", "Danh từ (n.)", "thiết bị điện gia dụng", "Energy-efficient appliances save electricity.", "Các thiết bị gia dụng tiết kiệm năng lượng giúp giảm tiền điện."),
      ("division of labor", "/dɪˌvɪʒ.ən əv ˈleɪ.bər/", "Cụm danh từ (n. phr.)", "sự phân công lao động trong nhà", "Fair division of labor keeps family relationships harmonious.", "Phân công công việc nhà công bằng giúp giữ gìn mối quan hệ gia đình hòa thuận."),
      ("biodegradable", "/ˌbaɪ.əʊ.dɪˈɡreɪ.də.bəl/", "Tính từ (adj.)", "tự phân hủy sinh học trong tự nhiên", "Biodegradable bags decompose within several months.", "Túi tự phân hủy sinh học phân rã hoàn toàn chỉ sau vài tháng."),
      ("greenhouse gas", "/ˈɡriːn.haʊs ˌɡæs/", "Danh từ (n.)", "khí gây hiệu ứng nhà kính", "Cutting greenhouse gas emissions protects the ozone layer.", "Cắt giảm khí thải nhà kính giúp bảo vệ tầng ô-zôn."),
      ("energy efficiency", "/ˌen.ə.dʒi ɪˈfɪʃ.ən.si/", "Danh từ (n.)", "hiệu suất sử dụng năng lượng", "Improving energy efficiency reduces reliance on fossil fuels.", "Nâng cao hiệu suất năng lượng giúp giảm phụ thuộc vào nhiên liệu hóa thạch.")
    ]
  },
  {
    "topicId": "g10_u5",
    "topicTitle": "Lớp 10 - Unit 5 & 8: Kỷ Nguyên Số & Phát Minh Hiện Đại (Digital Age & Inventions)",
    "grade": "10",
    "category": "tech_ai",
    "categoryLabel": "Công nghệ & Đổi mới",
    "description": "Kỷ nguyên số, phát minh hiện đại và ứng dụng trí tuệ nhân tạo",
    "words": [
      ("artificial intelligence", "/ˌɑː.tɪ.fɪʃ.əl ɪnˈtel.ɪ.dʒəns/", "Danh từ (n.)", "trí tuệ nhân tạo (AI)", "Artificial intelligence tailors lesson plans to individual learners.", "Trí tuệ nhân tạo thiết kế bài học phù hợp với từng người học cá nhân."),
      ("ubiquitous", "/juːˈbɪk.wɪ.təs/", "Tính từ (adj.)", "phổ biến khắp nơi, đâu đâu cũng có", "Wireless internet has become ubiquitous in modern cafes.", "Mạng internet không dây đã trở nên phổ biến ở khắp mọi quán cà phê hiện đại."),
      ("breakthrough", "/ˈbreɪk.θruː/", "Danh từ (n.)", "bước đột phá công nghệ quan trọng", "Vaccine technology achieved a major medical breakthrough.", "Công nghệ vắc-xin đã đạt được một bước đột phá y học lớn."),
      ("autonomous", "/ɔːˈtɒn.ə.məs/", "Tính từ (adj.)", "tự hành, tự chủ độc lập", "Autonomous delivery drones navigate city skies efficiently.", "Máy bay không người lái tự hành giao hàng di chuyển trên bầu trời thành phố hiệu quả."),
      ("algorithm", "/ˈæl.ɡə.rɪ.ðəm/", "Danh từ (n.)", "thuật toán xử lý máy tính", "Adaptive algorithms match questions to student ability levels.", "Các thuật toán thích ứng ghép câu hỏi phù hợp với trình độ năng lực học sinh."),
      ("machine learning", "/məˈʃiːn ˌlɜː.nɪŋ/", "Danh từ (n.)", "máy học (phân nhánh của AI)", "Machine learning detects medical abnormalities from X-ray scans.", "Học máy phát hiện những bất thường y khoa từ hình ảnh chụp X-quang."),
      ("virtual reality", "/ˌvɜː.tʃu.əl riˈæl.ə.ti/", "Danh từ (n.)", "thực tế ảo (VR)", "Virtual reality lets students explore the solar system immersively.", "Thực tế ảo cho phép học sinh khám phá hệ mặt trời một cách sống động."),
      ("cybersecurity", "/ˌsaɪ.bə.sɪˈkjʊə.rə.ti/", "Danh từ (n.)", "an ninh mạng, bảo mật dữ liệu", "Companies invest heavily in cybersecurity against hackers.", "Các công ty đầu tư rất lớn vào an ninh mạng để phòng chống tin tặc."),
      ("cloud computing", "/ˌklaʊd kəmˈpjuː.tɪŋ/", "Danh từ (n.)", "điện toán đám mây", "Cloud computing allows access to learning files from anywhere.", "Điện toán đám mây cho phép truy cập tài liệu học tập từ mọi nơi."),
      ("automation", "/ˌɔː.təˈmeɪ.ʃən/", "Danh từ (n.)", "sự tự động hóa dây chuyền", "Factory automation boosts manufacturing productivity tenfold.", "Tự động hóa nhà máy giúp tăng năng suất sản xuất lên gấp mười lần.")
    ]
  },

  # ═══════════════════════════ KHỐI LỚP 11 ═══════════════════════════
  {
    "topicId": "g11_u1",
    "topicTitle": "Lớp 11 - Unit 1 & 2: Sức Khỏe Lâu Dài & Khoảng Cách Thế Hệ (Healthy Life & Generation)",
    "grade": "11",
    "category": "health_society",
    "categoryLabel": "Sức khỏe & Xã hội",
    "description": "Sống thọ khỏe mạnh và thu hẹp khoảng cách tư tưởng giữa các thế hệ",
    "words": [
      ("longevity", "/lɒnˈdʒev.ə.ti/", "Danh từ (n.)", "sự trường thọ, sống lâu", "Healthy nutrition habits promote human longevity.", "Thói quen dinh dưỡng lành mạnh giúp thúc đẩy sự trường thọ của con người."),
      ("antibiotic", "/ˌæn.ti.baɪˈɒt.ɪk/", "Danh từ (n.)", "thuốc kháng sinh đặc trị", "Never overuse antibiotics without a doctor prescription.", "Không bao giờ được lạm dụng kháng sinh mà không có đơn thuốc của bác sĩ."),
      ("generation gap", "/ˌdʒen.əˈreɪ.ʃən ˌɡæp/", "Danh từ (n.)", "khoảng cách thế hệ tư tưởng", "Empathy bridges the generation gap within families.", "Lòng thấu cảm giúp thu hẹp khoảng cách thế hệ trong các gia đình."),
      ("viewpoint", "/ˈvjuː.pɔɪnt/", "Danh từ (n.)", "quan điểm, góc nhìn tư tưởng", "Respecting differing viewpoints leads to harmony.", "Tôn trọng những quan điểm khác biệt dẫn tới sự hòa hợp."),
      ("conflict", "/ˈkɒn.flɪkt/", "Danh từ (n.)", "xung đột, mâu thuẫn bất đồng", "Calm conversation resolves family conflicts quickly.", "Trò chuyện điềm tĩnh giải quyết mâu thuẫn gia đình nhanh chóng."),
      ("cardiovascular", "/ˌkɑː.di.əʊˈvæs.kjə.lər/", "Tính từ (adj.)", "thuộc về hệ tim mạch", "Regular walking lowers the risk of cardiovascular diseases.", "Đi bộ đều đặn giúp làm giảm nguy cơ mắc các bệnh tim mạch."),
      ("life expectancy", "/ˈlaɪf ɪkˌspek.tən.si/", "Danh từ (n.)", "tuổi thọ trung bình dự kiến", "Advances in modern medicine raised global life expectancy.", "Những tiến bộ trong y học hiện đại đã nâng cao tuổi thọ trung bình toàn cầu."),
      ("open communication", "/ˌəʊ.pən kəˌmjuː.nɪˈkeɪ.ʃən/", "Danh từ (n.)", "sự giao tiếp cởi mở chân thành", "Open communication prevents teen rebellion.", "Giao tiếp cởi mở giúp ngăn chặn sự nổi loạn ở lứa tuổi thiếu niên."),
      ("mutual understanding", "/ˌmjuː.tʃu.əl ˌʌn.dəˈstæn.dɪŋ/", "Danh từ (n.)", "sự thấu hiểu lẫn nhau", "Strong families are built on trust and mutual understanding.", "Gia đình vững mạnh được xây dựng dựa trên sự tin tưởng và thấu hiểu lẫn nhau."),
      ("independence", "/ˌɪn.dɪˈpen.dəns/", "Danh từ (n.)", "sự độc lập, tự chủ", "University life teaches adolescents essential independence.", "Cuộc sống đại học dạy cho người trẻ tính tự lập vô cùng cần thiết.")
    ]
  },
  {
    "topicId": "g11_u3",
    "topicTitle": "Lớp 11 - Unit 3 & 5: Đô Thị Tương Lai & Khí Hậu Toàn Cầu (Smart Cities & Climate)",
    "grade": "11",
    "category": "tech_environment",
    "categoryLabel": "Đô thị tương lai & Khí hậu",
    "description": "Thành phố thông minh và các giải pháp giảm thiểu nóng lên toàn cầu",
    "words": [
      ("infrastructure", "/ˈɪn.frəˌstrʌk.tʃər/", "Danh từ (n.)", "cơ sở hạ tầng kỹ thuật đô thị", "Smart cities invest in modern public transit infrastructure.", "Các thành phố thông minh đầu tư vào cơ sở hạ tầng giao thông công cộng hiện đại."),
      ("renewable", "/rɪˈnjuː.ə.bəl/", "Tính từ (adj.)", "có thể tái tạo vô tận (năng lượng)", "Solar power is an abundant renewable energy source.", "Năng lượng mặt trời là một nguồn năng lượng tái tạo dồi dào."),
      ("greenhouse effect", "/ˈɡriːn.haʊs ɪˌfekt/", "Danh từ (n.)", "hiệu ứng nhà kính", "Excess carbon emissions amplify the greenhouse effect.", "Lượng phát thải carbon dư thừa làm gia tăng hiệu ứng nhà kính."),
      ("catastrophic", "/ˌkæt.əˈstrɒf.ɪk/", "Tính từ (adj.)", "thảm khốc, gây tai họa lớn", "Rising sea levels threaten catastrophic flooding in coastal deltas.", "Mực nước biển dâng đe dọa gây ngập lụt thảm khốc tại các đồng bằng ven biển."),
      ("smart grid", "/ˈsmɑːt ˌɡrɪd/", "Danh từ (n.)", "mạng lưới điện thông minh", "A smart grid distributes renewable electricity with minimal loss.", "Lưới điện thông minh phân phối điện tái tạo với tổn hao tối thiểu."),
      ("carbon-neutral", "/ˌkɑː.bənˈnjuː.trəl/", "Tính từ (adj.)", "trung hòa khí thải carbon", "The nation pledged to become carbon-neutral by 2050.", "Quốc gia cam kết đạt mục tiêu trung hòa carbon vào năm 2050."),
      ("sustainability", "/səˌsteɪ.nəˈbɪl.ə.ti/", "Danh từ (n.)", "tính bền vững lâu dài", "Urban planning prioritizes environmental sustainability.", "Quy hoạch đô thị đặt ưu tiên hàng đầu cho tính bền vững môi trường."),
      ("glacier melting", "/ˈɡlæs.i.ər ˈmel.tɪŋ/", "Cụm danh từ (n. phr.)", "sự tan chảy sông băng ở địa cực", "Polar glacier melting contributes directly to sea level rise.", "Băng tan ở vùng cực góp phần trực tiếp làm mực nước biển dâng cao."),
      ("mitigation", "/ˌmɪt.ɪˈɡeɪ.ʃən/", "Danh từ (n.)", "sự giảm nhẹ, giảm thiểu tác hại", "Climate change mitigation requires international treaty compliance.", "Giảm nhẹ biến đổi khí hậu đòi hỏi sự tuân thủ các hiệp ước quốc tế."),
      ("carbon capture", "/ˈkɑː.bən ˌkæp.tʃər/", "Danh từ (n.)", "công nghệ thu giữ khí carbon", "Carbon capture technologies trap emissions directly at factories.", "Công nghệ thu giữ carbon giữ lại khí thải trực tiếp ngay tại nhà máy.")
    ]
  },

  # ═══════════════════════════ KHỐI LỚP 12 ═══════════════════════════
  {
    "topicId": "g12_u1",
    "topicTitle": "Lớp 12 - Unit 1 & 2: Câu Chuyện Thành Công & Đa Văn Hóa (Life Stories & Culture)",
    "grade": "12",
    "category": "culture_inspirational",
    "categoryLabel": "Truyền cảm hứng & Văn hóa",
    "description": "Gương danh nhân vượt khó và giao lưu văn hóa quốc tế",
    "words": [
      ("perseverance", "/ˌpɜː.sɪˈvɪə.rəns/", "Danh từ (n.)", "sự kiên trì, bền chí vượt khó", "Her outstanding exam results reflect years of perseverance.", "Kết quả thi xuất sắc của cô ấy phản ánh nhiều năm trời kiên trì bền bỉ."),
      ("heritage", "/ˈher.ɪ.tɪdʒ/", "Danh từ (n.)", "di sản văn hóa vật thể và phi vật thể", "Ha Long Bay is a renowned World Natural Heritage site.", "Vịnh Hạ Long là di sản thiên nhiên thế giới nổi tiếng."),
      ("assimilation", "/əˌsɪm.ɪˈleɪ.ʃən/", "Danh từ (n.)", "sự đồng hóa văn hóa", "Cultural preservation protects native languages from assimilation.", "Bảo tồn văn hóa giúp bảo vệ tiếng nói bản địa khỏi nguy cơ bị đồng hóa."),
      ("biography", "/baɪˈɒɡ.rə.fi/", "Danh từ (n.)", "tiểu sử, truyện danh nhân", "He wrote an insightful biography of Albert Einstein.", "Ông ấy đã viết một cuốn tiểu sử sâu sắc về Albert Einstein."),
      ("distinguished", "/dɪˈstɪŋ.ɡwɪʃt/", "Tính từ (adj.)", "lỗi lạc, xuất chúng", "He received an award for his distinguished scientific career.", "Ông nhận được giải thưởng cho sự nghiệp khoa học xuất chúng của mình."),
      ("multiculturalism", "/ˌmʌl.tiˈkʌl.tʃər.əl.ɪ.zəm/", "Danh từ (n.)", "chủ nghĩa đa văn hóa", "Multiculturalism celebrates diverse cultural perspectives.", "Chủ nghĩa đa văn hóa tôn vinh những góc nhìn văn hóa đa dạng."),
      ("humble beginnings", "/ˌhʌm.bəl bɪˈɡɪn.ɪŋz/", "Cụm danh từ (n. phr.)", "xuất thân khiêm tốn, nghèo khó", "From humble beginnings, she grew into an international business leader.", "Từ xuất thân nghèo khó, cô đã vươn lên thành một nhà lãnh đạo doanh nghiệp quốc tế."),
      ("adversity", "/ədˈvɜː.sə.ti/", "Danh từ (n.)", "nghịch cảnh, hoàn cảnh gian nan", "True heroes demonstrate courage in the face of adversity.", "Những người anh hùng thực sự thể hiện lòng quả cảm khi đối mặt với nghịch cảnh."),
      ("legacy", "/ˈleɡ.ə.si/", "Danh từ (n.)", "di sản để lại cho muôn đời sau", "Nelson Mandela left an enduring legacy of peace and reconciliation.", "Nelson Mandela để lại một di sản trường tồn về hòa bình và sự hòa giải."),
      ("customary", "/ˈkʌs.tə.mər.i/", "Tính từ (adj.)", "theo phong tục tập quán truyền thống", "It is customary to remove shoes before entering Vietnamese homes.", "Tháo giày trước khi vào nhà là phong tục truyền thống tại Việt Nam.")
    ]
  },
  {
    "topicId": "g12_u3",
    "topicTitle": "Lớp 12 - Unit 3 & 5: Sống Xanh Bền Vững & Nghề Nghiệp AI (Green Living & AI Careers)",
    "grade": "12",
    "category": "tech_career",
    "categoryLabel": "Nghề nghiệp & Sống xanh",
    "description": "Bảo tồn sinh thái và định hướng việc làm tương lai",
    "words": [
      ("biodegradable", "/ˌbaɪ.əʊ.dɪˈɡreɪ.də.bəl/", "Tính từ (adj.)", "tự phân hủy sinh học trong tự nhiên", "Biodegradable packaging breaks down cleanly without toxins.", "Bao bì tự phân hủy sinh học tự tiêu biến sạch sẽ không để lại độc tố."),
      ("preservation", "/ˌprez.əˈveɪ.ʃən/", "Danh từ (n.)", "sự bảo tồn, gìn giữ thiên nhiên", "Rainforest preservation is vital for planetary oxygen balance.", "Bảo tồn rừng nhiệt đới là điều sống còn cho cân bằng oxy của hành tinh."),
      ("competency", "/ˈkɒm.pɪ.tən.si/", "Danh từ (n.)", "năng lực thực tế, kỹ năng làm việc", "Analytical competency is highly sought after by employers.", "Năng lực phân tích được các nhà tuyển dụng tìm kiếm rất nhiều."),
      ("transformative", "/trænsˈfɔː.mə.tɪv/", "Tính từ (adj.)", "mang tính cách mạng, biến đổi sâu rộng", "Generative AI represents a transformative technological wave.", "AI tạo sinh đại diện cho một làn sóng công nghệ mang tính cách mạng sâu rộng."),
      ("collaborate", "/kəˈlæb.ə.reɪt/", "Động từ (v.)", "hợp tác, làm việc nhóm", "Cross-functional teams collaborate on innovative solutions.", "Các đội ngũ liên chuyên môn hợp tác cùng nhau để tạo ra các giải pháp đổi mới."),
      ("circular economy", "/ˌsɜː.kjə.lər iˈkɒn.ə.mi/", "Danh từ (n.)", "nền kinh tế tuần hoàn", "A circular economy aims to eliminate waste by reusing materials.", "Nền kinh tế tuần hoàn hướng tới xóa bỏ rác thải bằng cách tái sử dụng nguyên liệu."),
      ("workforce displacement", "/ˈwɜːk.fɔːs dɪsˌpleɪs.mənt/", "Danh từ (n.)", "sự dịch chuyển, thay thế nhân lực bởi máy móc", "Reskilling programs protect workers from workforce displacement.", "Các chương trình đào tạo lại kỹ năng bảo vệ người lao động khỏi nguy cơ bị máy móc thay thế."),
      ("prompt engineering", "/ˈprɒmpt ˌen.dʒɪˌnɪə.rɪŋ/", "Danh từ (n.)", "kỹ nghệ thiết kế câu lệnh AI", "Prompt engineering is a high-demand skill in AI development.", "Kỹ nghệ viết prompt là một kỹ năng có nhu cầu tuyển dụng rất cao trong kỷ nguyên AI."),
      ("future-ready", "/ˌfjuː.tʃər ˈred.i/", "Tính từ (adj.)", "sẵn sàng cho tương lai", "STEM education equips students with future-ready skills.", "Giáo dục STEM trang bị cho học sinh những kỹ năng sẵn sàng cho tương lai."),
      ("innovation hub", "/ˌɪn.əˈveɪ.ʃən ˌhʌb/", "Danh từ (n.)", "trung tâm đổi mới sáng tạo", "The city built a national innovation hub to foster startups.", "Thành phố đã xây dựng một trung tâm đổi mới sáng tạo quốc gia để ươm mầm khởi nghiệp.")
    ]
  },

  # ═══════════════════════════ CHUYÊN ĐỀ ÔN THI THPT QUỐC GIA ═══════════════════════════
  {
    "topicId": "thpt_colloc",
    "topicTitle": "Chuyên Đề THPT - Cụm Từ Cố Định (Collocations Điểm 8+ & 9+)",
    "grade": "THPT",
    "category": "exam_mastery",
    "categoryLabel": "Chuyên đề THPT Quốc Gia",
    "description": "Các cụm từ cố định xuất hiện nhiều nhất trong đề thi tốt nghiệp THPT",
    "words": [
      ("make a difference", "/meɪk ə ˈdɪf.ər.əns/", "Cụm động từ (colloc.)", "tạo nên sự khác biệt, có tác động tích cực", "Small daily actions can make a huge difference in environmental protection.", "Những hành động nhỏ hàng ngày có thể tạo nên sự khác biệt lớn trong bảo vệ môi trường."),
      ("pay attention to", "/peɪ əˈten.ʃən tuː/", "Cụm động từ (colloc.)", "chú ý, tập trung cao độ vào điều gì", "Pay close attention to word forms in English sentence transformation.", "Hãy chú ý kỹ đến dạng từ trong các bài tập viết lại câu tiếng Anh."),
      ("take advantage of", "/teɪk ədˈvɑːn.tɪdʒ ɒv/", "Cụm động từ (colloc.)", "tận dụng triệt để thời cơ / tài liệu", "Take advantage of adaptive testing to identify knowledge gaps.", "Hãy tận dụng bài thi thích ứng để phát hiện những lỗ hổng kiến thức."),
      ("bear in mind", "/beər ɪn maɪnd/", "Thành ngữ (idiom)", "ghi nhớ kỹ điều quan trọng trong đầu", "Always bear in mind that consistency is the key to vocabulary mastery.", "Hãy luôn ghi nhớ rằng sự kiên trì là chìa khóa để làm chủ từ vựng."),
      ("come to a conclusion", "/kʌm tuː ə kənˈkluː.ʒən/", "Cụm động từ (colloc.)", "đi đến kết luận cuối cùng sau khi phân tích", "The researchers came to a firm conclusion after extensive trials.", "Các nhà nghiên cứu đã đi đến kết luận vững chắc sau nhiều thử nghiệm sâu rộng."),
      ("catch sight of", "/kætʃ saɪt ɒv/", "Cụm động từ (colloc.)", "thoáng nhìn thấy, bắt gặp ánh mắt", "I caught sight of my old friend in the crowded airport.", "Tôi thoáng nhìn thấy người bạn cũ trong sân bay đông đúc."),
      ("play an important role", "/pleɪ ən ɪmˈpɔː.tənt rəʊl/", "Cụm động từ (colloc.)", "đóng vai trò vô cùng quan trọng", "Education plays an important role in economic prosperity.", "Giáo dục đóng một vai trò vô cùng quan trọng trong sự thịnh vượng kinh tế."),
      ("make contribution to", "/meɪk ˌkɒn.trɪˈbjuː.ʃən tuː/", "Cụm động từ (colloc.)", "đóng góp, cống hiến vào việc gì", "Youth make significant contributions to social development.", "Giới trẻ đóng góp đáng kể vào sự phát triển của xã hội."),
      ("raise awareness of", "/reɪz əˈweə.nəs ɒv/", "Cụm động từ (colloc.)", "nâng cao nhận thức của cộng đồng", "Campaigns raise public awareness of plastic pollution.", "Các chiến dịch giúp nâng cao nhận thức cộng đồng về rác thải nhựa."),
      ("take responsibility for", "/teɪk rɪˌspɒn.səˈbɪl.ə.ti fɔːr/", "Cụm động từ (colloc.)", "chịu trách nhiệm về hành động", "Citizens should take responsibility for sorting household waste.", "Người dân nên có trách nhiệm trong việc phân loại rác thải sinh hoạt.")
    ]
  },
  {
    "topicId": "thpt_phrasal",
    "topicTitle": "Chuyên Đề THPT - Phrasal Verbs & Thành Ngữ Phân Hóa",
    "grade": "THPT",
    "category": "exam_mastery",
    "categoryLabel": "Chuyên đề THPT Quốc Gia",
    "description": "Cụm động từ và thành ngữ ăn trọn điểm câu hỏi phân hóa",
    "words": [
      ("carry out", "/ˈkær.i aʊt/", "Cụm động từ (phr. v.)", "tiến hành, thực hiện (nghiên cứu, nhiệm vụ)", "The science team carried out rigorous tests in the laboratory.", "Đội ngũ khoa học đã tiến hành các thử nghiệm nghiêm ngặt trong phòng thí nghiệm."),
      ("call off", "/kɔːl ɒf/", "Cụm động từ (phr. v.)", "hủy bỏ sự kiện đã lên lịch", "The outdoor sports tournament was called off due to heavy rain.", "Giải thi đấu thể thao ngoài trời đã bị hủy bỏ do mưa lớn."),
      ("put up with", "/pʊt ʌp wɪð/", "Cụm động từ (phr. v.)", "chịu đựng, nhẫn nhịn điều phiền toái", "He refused to put up with disrespectful behavior in the classroom.", "Thầy từ chối chịu đựng những hành vi thiếu tôn trọng trong lớp học."),
      ("burn the midnight oil", "/bɜːn ðə ˈmɪd.naɪt ɔɪl/", "Thành ngữ (idiom)", "thức khuya miệt mài học tập ôn thi", "She burned the midnight oil studying for the national high school exam.", "Cô ấy thức khuya miệt mài ôn thi cho kỳ thi tốt nghiệp THPT quốc gia."),
      ("hit the books", "/hɪt ðə bʊks/", "Thành ngữ (idiom)", "bắt đầu học tập nghiêm túc", "It is high time we hit the books and reviewed grammar rules.", "Đã đến lúc chúng ta tập trung học tập nghiêm túc và ôn lại các quy tắc ngữ pháp."),
      ("look down on", "/lʊk daʊn ɒn/", "Cụm động từ (phr. v.)", "xem thường, coi nhẹ ai đó", "Never look down on others based on their background.", "Đừng bao giờ coi thường người khác dựa vào hoàn cảnh của họ."),
      ("give up", "/ɡɪv ʌp/", "Cụm động từ (phr. v.)", "từ bỏ, bỏ cuộc giữa chừng", "Never give up on your academic dreams despite challenges.", "Đừng bao giờ từ bỏ ước mơ học tập dù gặp nhiều thử thách."),
      ("break down", "/breɪk daʊn/", "Cụm động từ (phr. v.)", "hỏng hóc máy móc / sụp đổ tinh thần", "The school bus broke down on the way to the museum.", "Xe buýt trường học đã bị hỏng trên đường đến bảo tàng."),
      ("piece of cake", "/ˌpiːs əv ˈkeɪk/", "Thành ngữ (idiom)", "dễ như ăn bánh, rất đơn giản", "With daily practice, basic grammar becomes a piece of cake.", "Với việc luyện tập hàng ngày, ngữ pháp cơ bản sẽ trở nên dễ như ăn bánh."),
      ("once in a blue moon", "/ˌwʌns ɪn ə ˈbluː muːn/", "Thành ngữ (idiom)", "hiếm khi, năm thì mười họa mới xảy ra", "He only visits his distant relatives once in a blue moon.", "Cậu ấy chỉ về thăm họ hàng ở xa năm thì mười họa một lần.")
    ]
  }
]

# Generate Python SQLite seeding code
db_path = os.path.join(os.path.dirname(__file__), "backend", "ai_english_mentor.db")
conn = sqlite3.connect(db_path)
cur = conn.cursor()

cur.execute("DELETE FROM vocabularyword")
cur.execute("DELETE FROM vocabularytopic")

total_words = 0
for t in DATA:
    cur.execute(
        "INSERT INTO vocabularytopic (title, slug, description, image, grade, is_active) VALUES (?, ?, ?, ?, ?, ?)",
        (t["topicTitle"], t["topicId"], t["description"], "", t["grade"], 1)
    )
    topic_id = cur.lastrowid
    for w, ipa, pos, meaning, ex, ex_vi in t["words"]:
        cur.execute(
            "INSERT INTO vocabularyword (topic_id, word, ipa, reading, pos, meaning, example, example_vi, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (topic_id, w, ipa, "", pos, meaning, ex, ex_vi, 1)
        )
        total_words += 1

conn.commit()
conn.close()

print(f"[OK] Database seeded with {len(DATA)} topics and {total_words} vocabulary words!")
