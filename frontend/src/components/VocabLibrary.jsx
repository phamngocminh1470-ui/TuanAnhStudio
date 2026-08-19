import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen, Search, Volume2, ChevronDown, ChevronUp,
  Globe, Tag, X, RefreshCw, BookMarked, GraduationCap,
  Layers, Sparkles, Filter, CheckCircle2, Bookmark,
  ArrowRight, Loader2, Zap, HelpCircle
} from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api';

function speakWord(text) {
  if (!window.speechSynthesis) return;
  const utter = new window.SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

// Hàm chuẩn hóa tiếng Việt bỏ dấu giúp tìm kiếm không dấu / có dấu đều trúng 100%
function removeVietnameseTones(str) {
  if (!str) return '';
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  return str.trim();
}

// ════════════════════════════════════════════════════════════════════════════════
// KHO TỪ ĐIỂN PHỔ THÔNG TOÀN DIỆN (OXFORD COMMON + SGK GDPT 6 ĐẾN 12 & THPT)
// ════════════════════════════════════════════════════════════════════════════════
const COMPREHENSIVE_VOCAB_DATA = [
  // ── KHỐI LỚP 6 ──
  {
    topicId: 'g6_u1',
    topicTitle: 'Lớp 6 - Unit 1 & 2: Trường Học & Gia Đình (School & Home)',
    grade: '6',
    category: 'school_life',
    categoryLabel: 'Trường học & Gia đình',
    description: 'Từ vựng thông dụng về đồ dùng học tập, phòng ốc và nếp sống sinh hoạt',
    words: [
      { id: 'w6_01', word: 'calculator', ipa: '/ˈkæl.kjə.leɪ.tər/', pos: 'Danh từ (n.)', meaning: 'máy tính cầm tay bỏ túi', example: 'I always bring my calculator to maths class.', example_vi: 'Tôi luôn mang máy tính cầm tay đến giờ học toán.' },
      { id: 'w6_02', word: 'compass', ipa: '/ˈkʌm.pəs/', pos: 'Danh từ (n.)', meaning: 'com-pa vẽ hình tròn', example: 'You need a compass to draw circles in geometry.', example_vi: 'Bạn cần com-pa để vẽ các hình tròn trong môn hình học.' },
      { id: 'w6_03', word: 'uniform', ipa: '/ˈjuː.nɪ.fɔːm/', pos: 'Danh từ (n.)', meaning: 'đồng phục học sinh', example: 'All students wear clean uniforms on Monday.', example_vi: 'Tất cả học sinh đều mặc đồng phục sạch đẹp vào thứ Hai.' },
      { id: 'w6_04', word: 'creative', ipa: '/kriˈeɪ.tɪv/', pos: 'Tính từ (adj.)', meaning: 'sáng tạo, có óc tưởng tượng', example: 'She is a creative student who loves painting.', example_vi: 'Cô ấy là một học sinh sáng tạo và rất thích vẽ tranh.' },
      { id: 'w6_05', word: 'balcony', ipa: '/ˈbæl.kə.ni/', pos: 'Danh từ (n.)', meaning: 'ban công ngôi nhà', example: 'Our apartment has a small balcony with pretty roses.', example_vi: 'Căn hộ của chúng tôi có một ban công nhỏ trồng hoa hồng xinh xắn.' },
      { id: 'w6_06', word: 'boarding school', ipa: '/ˈbɔː.dɪŋ ˌskuːl/', pos: 'Danh từ (n.)', meaning: 'trường nội trú', example: 'He stays at a boarding school and visits home on weekends.', example_vi: 'Cậu ấy ở trường nội trú và về thăm nhà vào cuối tuần.' },
      { id: 'w6_07', word: 'textbook', ipa: '/ˈtekst.bʊk/', pos: 'Danh từ (n.)', meaning: 'sách giáo khoa học tập', example: 'Please open your English textbook to page twenty.', example_vi: 'Xin mời các em mở sách giáo khoa tiếng Anh trang 20.' },
      { id: 'w6_08', word: 'neighborhood', ipa: '/ˈneɪ.bə.hʊd/', pos: 'Danh từ (n.)', meaning: 'khu phố, hàng xóm lân cận', example: 'There is a quiet library in our neighborhood.', example_vi: 'Có một thư viện yên tĩnh trong khu phố của chúng tôi.' },
      { id: 'w6_09', word: 'teacher', ipa: '/ˈtiː.tʃər/', pos: 'Danh từ (n.)', meaning: 'giáo viên, thầy cô giáo', example: 'Our English teacher is dedicated and enthusiastic.', example_vi: 'Giáo viên tiếng Anh của chúng tôi rất tận tâm và nhiệt huyết.' },
      { id: 'w6_10', word: 'classroom', ipa: '/ˈklɑːs.ruːm/', pos: 'Danh từ (n.)', meaning: 'phòng học, lớp học', example: 'Students clean the classroom after lessons.', example_vi: 'Học sinh dọn dẹp phòng học sau các tiết học.' }
    ]
  },
  {
    topicId: 'g6_u6',
    topicTitle: 'Lớp 6 - Unit 6 & 8: Lễ Hội Ngày Tết & Thể Thao (Tet & Sports)',
    grade: '6',
    category: 'culture_sports',
    categoryLabel: 'Lễ hội & Thể thao',
    description: 'Ngày Tết cổ truyền Việt Nam và các môn thể thao vận động thường ngày',
    words: [
      { id: 'w6_11', word: 'celebrate', ipa: '/ˈsel.ə.breɪt/', pos: 'Động từ (v.)', meaning: 'ăn mừng, kỷ niệm ngày lễ Tết', example: 'Families gather to celebrate the Lunar New Year.', example_vi: 'Các gia đình sum vầy để ăn mừng Tết Nguyên Đán.' },
      { id: 'w6_12', word: 'firework', ipa: '/ˈfaɪə.wɜːk/', pos: 'Danh từ (n.)', meaning: 'pháo hoa rực rỡ', example: 'We watch colorful fireworks on New Year Eve.', example_vi: 'Chúng tôi ngắm pháo hoa rực rỡ sắc màu vào đêm Giao thừa.' },
      { id: 'w6_13', word: 'equipment', ipa: '/ɪˈkwɪp.mənt/', pos: 'Danh từ (n.)', meaning: 'dụng cụ, trang thiết bị tập luyện', example: 'Wear protective equipment when skateboarding.', example_vi: 'Hãy đeo dụng cụ bảo hộ khi trượt ván.' },
      { id: 'w6_14', word: 'marathon', ipa: '/ˈmær.ə.θən/', pos: 'Danh từ (n.)', meaning: 'cuộc chạy đường trường ma-ra-tông', example: 'Thousands ran in the annual charity marathon.', example_vi: 'Hàng ngàn người đã chạy trong cuộc thi marathon từ thiện hàng năm.' },
      { id: 'w6_15', word: 'gymnasium', ipa: '/dʒɪmˈneɪ.zi.əm/', pos: 'Danh từ (n.)', meaning: 'phòng tập thể chất trong nhà', example: 'We play badminton inside the school gymnasium.', example_vi: 'Chúng tôi chơi cầu lông bên trong nhà thể chất của trường.' },
      { id: 'w6_16', word: 'badminton', ipa: '/ˈbæd.mɪn.tən/', pos: 'Danh từ (n.)', meaning: 'môn cầu lông', example: 'Badminton improves hand-eye coordination.', example_vi: 'Môn cầu lông giúp cải thiện phản xạ tay mắt.' }
    ]
  },

  // ── KHỐI LỚP 7 ──
  {
    topicId: 'g7_u1',
    topicTitle: 'Lớp 7 - Unit 1 & 2: Sở Thích & Lối Sống Khỏe (Hobbies & Health)',
    grade: '7',
    category: 'health_sports',
    categoryLabel: 'Sức khỏe & Sở thích',
    description: 'Sở thích lành mạnh, chế độ ăn uống và chăm sóc sức khỏe thể chất',
    words: [
      { id: 'w7_01', word: 'hobby', ipa: '/ˈhɒb.i/', pos: 'Danh từ (n.)', meaning: 'sở thích lúc rảnh rỗi', example: 'Gardening is my mother favorite weekend hobby.', example_vi: 'Làm vườn là sở thích cuối tuần yêu thích của mẹ tôi.' },
      { id: 'w7_02', word: 'cardiology', ipa: '/ˌkɑː.diˈɒl.ə.dʒi/', pos: 'Danh từ (n.)', meaning: 'tim mạch học, sức khỏe tim', example: 'Cardio exercises strengthen your heart muscle.', example_vi: 'Các bài tập cardio giúp tăng cường cơ tim của bạn.' },
      { id: 'w7_03', word: 'sunburn', ipa: '/ˈsʌn.bɜːn/', pos: 'Danh từ (n.)', meaning: 'sự cháy nắng, sạm da do nắng', example: 'Apply sunscreen to avoid severe sunburn at the beach.', example_vi: 'Hãy bôi kem chống nắng để tránh bị cháy nắng nghiêm trọng ở bãi biển.' },
      { id: 'w7_04', word: 'vegetarian', ipa: '/ˌvedʒ.ɪˈteə.ri.ən/', pos: 'Danh từ (n.)', meaning: 'người ăn chay thanh tịnh', example: 'A vegetarian diet focuses on vegetables and tofu.', example_vi: 'Chế độ ăn chay tập trung vào rau củ quả và đậu phụ.' },
      { id: 'w7_05', word: 'dimple', ipa: '/ˈdɪm.pəl/', pos: 'Danh từ (n.)', meaning: 'má lúm đồng tiền', example: 'She shows lovely dimples when she smiles happily.', example_vi: 'Cô ấy để lộ má lúm đồng tiền đáng yêu khi cười vui vẻ.' },
      { id: 'w7_06', word: 'nutrition', ipa: '/njuːˈtrɪʃ.ən/', pos: 'Danh từ (n.)', meaning: 'dinh dưỡng, chế độ ăn uống', example: 'Good nutrition gives students sustained energy.', example_vi: 'Dinh dưỡng tốt mang lại cho học sinh nguồn năng lượng bền bỉ.' }
    ]
  },
  {
    topicId: 'g7_u3',
    topicTitle: 'Lớp 7 - Unit 3 & 7: Hoạt Động Thiện Nguyện & Giao Thông (Community & Traffic)',
    grade: '7',
    category: 'community_skills',
    categoryLabel: 'Cộng đồng & Giao thông',
    description: 'Hoạt động thiện nguyện vì xã hội và văn hóa an toàn giao thông',
    words: [
      { id: 'w7_07', word: 'volunteer', ipa: '/ˌvɒl.ənˈtɪər/', pos: 'Động từ (v.) / Danh từ (n.)', meaning: 'tình nguyện viên, làm từ thiện', example: 'Teens volunteer to teach English to orphans.', example_vi: 'Thanh thiếu niên tình nguyện dạy tiếng Anh cho trẻ mồ côi.' },
      { id: 'w7_08', word: 'donate', ipa: '/dəʊˈneɪt/', pos: 'Động từ (v.)', meaning: 'quyên góp, ủng hộ tiền/đồ dùng', example: 'We donate warm clothes and notebooks to poor schools.', example_vi: 'Chúng tôi quyên góp quần áo ấm và vở viết cho các trường khó khăn.' },
      { id: 'w7_09', word: 'pedestrian', ipa: '/pəˈdes.tri.ən/', pos: 'Danh từ (n.)', meaning: 'người đi bộ qua đường', example: 'Pedestrians should always cross at zebra crossings.', example_vi: 'Người đi bộ nên luôn sang đường tại vạch kẻ ngựa vằn.' },
      { id: 'w7_10', word: 'congestion', ipa: '/kənˈdʒes.tʃən/', pos: 'Danh từ (n.)', meaning: 'sự ùn tắc giao thông, kẹt xe', example: 'Heavy congestion delays commuters every morning.', example_vi: 'Ùn tắc nghiêm trọng làm chậm trễ người đi làm mỗi buổi sáng.' },
      { id: 'w7_11', word: 'helmet', ipa: '/ˈhel.mɪt/', pos: 'Danh từ (n.)', meaning: 'mũ bảo hiểm an toàn', example: 'Always fasten your helmet securely before riding a motorbike.', example_vi: 'Luôn cài quai mũ bảo hiểm chắc chắn trước khi đi xe máy.' }
    ]
  },

  // ── KHỐI LỚP 8 ──
  {
    topicId: 'g8_u1',
    topicTitle: 'Lớp 8 - Unit 1 & 2: Cuộc Sống Nông Thôn & Giải Trí (Leisure & Countryside)',
    grade: '8',
    category: 'life_countryside',
    categoryLabel: 'Đời sống nông thôn',
    description: 'Giải trí thanh bình và nét văn hóa mộc mạc làng quê',
    words: [
      { id: 'w8_01', word: 'origami', ipa: '/ˌɒr.ɪˈɡɑː.mi/', pos: 'Danh từ (n.)', meaning: 'nghệ thuật gấp giấy Nhật Bản', example: 'He folds complex animals using origami paper.', example_vi: 'Cậu ấy gấp những con thú phức tạp bằng giấy origami.' },
      { id: 'w8_02', word: 'nomadic', ipa: '/nəʊˈmæd.ɪk/', pos: 'Tính từ (adj.)', meaning: 'du mục, chăn thả nay đây mai đó', example: 'Nomadic herders travel across vast grassy plains.', example_vi: 'Những người chăn gia súc du mục di chuyển qua những đồng cỏ bao la.' },
      { id: 'w8_03', word: 'pasture', ipa: '/ˈpɑːs.tʃər/', pos: 'Danh từ (n.)', meaning: 'đồng cỏ xanh chăn thả gia súc', example: 'Horses graze freely on the open green pasture.', example_vi: 'Những chú ngựa gặm cỏ tự do trên đồng cỏ xanh mướt.' },
      { id: 'w8_04', word: 'harvest', ipa: '/ˈhɑː.vɪst/', pos: 'Danh từ (n.) / Động từ (v.)', meaning: 'mùa thu hoạch, gặt hái lúa vụ', example: 'Farmers celebrate a bountiful autumn harvest.', example_vi: 'Người nông dân ăn mừng một mùa thu hoạch bội thu.' },
      { id: 'w8_05', word: 'generous', ipa: '/ˈdʒen.ər.əs/', pos: 'Tính từ (adj.)', meaning: 'hào phóng, cởi mở rộng lượng', example: 'Villagers are known for their generous hospitality.', example_vi: 'Người dân làng nổi tiếng với lòng hiếu khách hào phóng.' }
    ]
  },
  {
    topicId: 'g8_u7',
    topicTitle: 'Lớp 8 - Unit 7 & 8: Ô Nhiễm Môi Trường & Quốc Gia Nói Tiếng Anh (Pollution & World)',
    grade: '8',
    category: 'environment_global',
    categoryLabel: 'Môi trường & Toàn cầu',
    description: 'Các dạng ô nhiễm và văn hóa các quốc gia nói tiếng Anh',
    words: [
      { id: 'w8_06', word: 'pollutant', ipa: '/pəˈluː.tənt/', pos: 'Danh từ (n.)', meaning: 'chất thải độc hại gây ô nhiễm', example: 'Chemical pollutants poison freshwater streams.', example_vi: 'Các chất ô nhiễm hóa học đầu độc những dòng suối nước ngọt.' },
      { id: 'w8_07', word: 'aquatic', ipa: '/əˈkwæt.ɪk/', pos: 'Tính từ (adj.)', meaning: 'thuộc về thủy sinh, dưới nước', example: 'Oil spills endanger diverse aquatic organisms.', example_vi: 'Các vụ tràn dầu đe dọa nhiều sinh vật thủy sinh đa dạng.' },
      { id: 'w8_08', word: 'monument', ipa: '/ˈmɒn.jə.mənt/', pos: 'Danh từ (n.)', meaning: 'đài tưởng niệm, tượng đài lịch sử', example: 'Big Ben is an iconic historical monument in London.', example_vi: 'Tháp đồng hồ Big Ben là một tượng đài lịch sử mang tính biểu tượng ở London.' },
      { id: 'w8_09', word: 'bilingual', ipa: '/baɪˈlɪŋ.ɡwəl/', pos: 'Tính từ (adj.)', meaning: 'sử dụng song ngữ, hai thứ tiếng', example: 'Being bilingual gives students international career advantages.', example_vi: 'Thành thạo song ngữ mang lại cho học sinh nhiều lợi thế nghề nghiệp quốc tế.' },
      { id: 'w8_10', word: 'contamination', ipa: '/kənˌtæm.ɪˈneɪ.ʃən/', pos: 'Danh từ (n.)', meaning: 'sự nhiễm độc, nhiễm bẩn', example: 'Soil contamination harms crop yields.', example_vi: 'Sự nhiễm độc đất gây tổn hại đến năng suất cây trồng.' }
    ]
  },

  // ── KHỐI LỚP 9 ──
  {
    topicId: 'g9_u1',
    topicTitle: 'Lớp 9 - Unit 1 & 2: Làng Nghề Thủ Công & Nhịp Sống Đô Thị (Crafts & City Life)',
    grade: '9',
    category: 'culture_city',
    categoryLabel: 'Làng nghề & Đô thị',
    description: 'Nghề thủ công truyền thống và nhịp sống đô thị hiện đại',
    words: [
      { id: 'w9_01', word: 'artisan', ipa: '/ˌɑː.tɪˈzæn/', pos: 'Danh từ (n.)', meaning: 'nghệ nhân thủ công lành nghề', example: 'Village artisans preserve ceramic pottery skills.', example_vi: 'Các nghệ nhân trong làng gìn giữ kỹ nghệ làm đồ gốm sứ.' },
      { id: 'w9_02', word: 'handicraft', ipa: '/ˈhæn.dɪ.krɑːft/', pos: 'Danh từ (n.)', meaning: 'sản phẩm thủ công mỹ nghệ', example: 'Vietnamese handicrafts are exported to over 50 countries.', example_vi: 'Hàng thủ công mỹ nghệ Việt Nam được xuất khẩu tới hơn 50 quốc gia.' },
      { id: 'w9_03', word: 'metropolis', ipa: '/məˈtrɒp.əl.ɪs/', pos: 'Danh từ (n.)', meaning: 'đại đô thị sầm uất', example: 'Ho Chi Minh City is a dynamic economic metropolis.', example_vi: 'Thành phố Hồ Chí Minh là một đại đô thị kinh tế năng động.' },
      { id: 'w9_04', word: 'multicultural', ipa: '/ˌmʌl.tiˈkʌl.tʃər.əl/', pos: 'Tính từ (adj.)', meaning: 'đa văn hóa, đa sắc tộc', example: 'Living in a multicultural society fosters empathy.', example_vi: 'Sống trong một xã hội đa văn hóa nuôi dưỡng lòng thấu cảm.' },
      { id: 'w9_05', word: 'amenity', ipa: '/əˈmiː.nə.ti/', pos: 'Danh từ (n.)', meaning: 'tiện nghi đô thị công cộng', example: 'The new residential area features modern sports amenities.', example_vi: 'Khu dân cư mới sở hữu các tiện nghi thể thao hiện đại.' }
    ]
  },
  {
    topicId: 'g9_u3',
    topicTitle: 'Lớp 9 - Unit 3 & 4: Áp Lực Học Đường & Ký Ức Quá Khứ (Teen Stress & Past)',
    grade: '9',
    category: 'teen_psychology',
    categoryLabel: 'Tâm lý học đường',
    description: 'Vượt qua áp lực học tập và ký ức lịch sử thế hệ trước',
    words: [
      { id: 'w9_06', word: 'counselor', ipa: '/ˈkaʊn.səl.ər/', pos: 'Danh từ (n.)', meaning: 'chuyên viên tư vấn tâm lý học đường', example: 'Talk to your school counselor when feeling stressed.', example_vi: 'Hãy trò chuyện với chuyên viên tư vấn học đường khi bạn cảm thấy căng thẳng.' },
      { id: 'w9_07', word: 'frustrated', ipa: '/frʌsˈtreɪ.tɪd/', pos: 'Tính từ (adj.)', meaning: 'bực bội, nản lòng trước khó khăn', example: 'Stay calm and avoid getting frustrated with errors.', example_vi: 'Hãy giữ bình tĩnh và tránh nản lòng trước những lỗi sai.' },
      { id: 'w9_08', word: 'resilience', ipa: '/rɪˈzɪl.jəns/', pos: 'Danh từ (n.)', meaning: 'sự kiên cường, sức bật tinh thần', example: 'Building mental resilience helps teens overcome exams.', example_vi: 'Xây dựng sức bật tinh thần giúp học sinh vượt qua các kỳ thi.' },
      { id: 'w9_09', word: 'illiterate', ipa: '/ɪˈlɪt.ər.ət/', pos: 'Tính từ (adj.)', meaning: 'mù chữ, không biết đọc viết', example: 'Free literacy classes helped illiterate villagers learn to read.', example_vi: 'Các lớp học xóa mù chữ miễn phí đã giúp người dân làng biết đọc.' },
      { id: 'w9_10', word: 'preservation', ipa: '/ˌprez.əˈveɪ.ʃən/', pos: 'Danh từ (n.)', meaning: 'sự bảo tồn di sản', example: 'The preservation of historical monuments is essential.', example_vi: 'Bảo tồn các di tích lịch sử là điều vô cùng cần thiết.' }
    ]
  },

  // ── KHỐI LỚP 10 ──
  {
    topicId: 'g10_u1',
    topicTitle: 'Lớp 10 - Unit 1 & 2: Đời Sống Gia Đình & Sống Xanh (Family & Eco-Life)',
    grade: '10',
    category: 'family_environment',
    categoryLabel: 'Gia đình & Sống xanh',
    description: 'Trách nhiệm gia đình và lối sống xanh bảo vệ môi trường',
    words: [
      { id: 'w10_01', word: 'breadwinner', ipa: '/ˈbredˌwɪn.ər/', pos: 'Danh từ (n.)', meaning: 'trụ cột kinh tế gia đình', example: 'Both parents work hard as equal breadwinners.', example_vi: 'Cả bố và mẹ đều làm việc chăm chỉ như những trụ cột kinh tế bình đẳng.' },
      { id: 'w10_02', word: 'homemaker', ipa: '/ˈhəʊmˌmeɪ.kər/', pos: 'Danh từ (n.)', meaning: 'người nội trợ quán xuyến gia đình', example: 'Being a skilled homemaker creates a cozy home environment.', example_vi: 'Trở thành người nội trợ khéo léo tạo nên không gian ấm cúng cho gia đình.' },
      { id: 'w10_03', word: 'eco-friendly', ipa: '/ˌiː.kəʊˈfrend.li/', pos: 'Tính từ (adj.)', meaning: 'thân thiện với môi trường sinh thái', example: 'Use eco-friendly bamboo utensils instead of plastic.', example_vi: 'Hãy sử dụng dụng cụ ăn bằng tre thân thiện môi trường thay cho đồ nhựa.' },
      { id: 'w10_04', word: 'carbon footprint', ipa: '/ˌkɑː.bən ˈfʊt.prɪnt/', pos: 'Danh từ (n.)', meaning: 'dấu chân phát thải khí carbon', example: 'Walking to school reduces your household carbon footprint.', example_vi: 'Đi bộ đến trường giúp giảm dấu chân phát thải carbon của gia đình bạn.' },
      { id: 'w10_05', word: 'sustainable', ipa: '/səˈsteɪ.nə.bəl/', pos: 'Tính từ (adj.)', meaning: 'bền vững, duy trì lâu dài', example: 'Sustainable development balances economic growth and nature.', example_vi: 'Phát triển bền vững cân bằng giữa tăng trưởng kinh tế và tự nhiên.' },
      { id: 'w10_06', word: 'appliances', ipa: '/əˈplaɪ.ən.sɪz/', pos: 'Danh từ (n.)', meaning: 'thiết bị điện gia dụng', example: 'Energy-efficient appliances save electricity.', example_vi: 'Các thiết bị gia dụng tiết kiệm năng lượng giúp giảm tiền điện.' }
    ]
  },
  {
    topicId: 'g10_u5',
    topicTitle: 'Lớp 10 - Unit 5 & 8: Kỷ Nguyên Số & Phát Minh Hiện Đại (Digital Age & Inventions)',
    grade: '10',
    category: 'tech_ai',
    categoryLabel: 'Công nghệ & Đổi mới',
    description: 'Kỷ nguyên số, phát minh hiện đại và ứng dụng trí tuệ nhân tạo',
    words: [
      { id: 'w10_07', word: 'artificial intelligence', ipa: '/ˌɑː.tɪ.fɪʃ.əl ɪnˈtel.ɪ.dʒəns/', pos: 'Danh từ (n.)', meaning: 'trí tuệ nhân tạo (AI)', example: 'Artificial intelligence tailors lesson plans to individual learners.', example_vi: 'Trí tuệ nhân tạo thiết kế bài học phù hợp với từng người học cá nhân.' },
      { id: 'w10_08', word: 'ubiquitous', ipa: '/juːˈbɪk.wɪ.təs/', pos: 'Tính từ (adj.)', meaning: 'phổ biến khắp nơi, đâu đâu cũng có', example: 'Wireless internet has become ubiquitous in modern cafes.', example_vi: 'Mạng internet không dây đã trở nên phổ biến ở khắp mọi quán cà phê hiện đại.' },
      { id: 'w10_09', word: 'breakthrough', ipa: '/ˈbreɪk.θruː/', pos: 'Danh từ (n.)', meaning: 'bước đột phá công nghệ quan trọng', example: 'Vaccine technology achieved a major medical breakthrough.', example_vi: 'Công nghệ vắc-xin đã đạt được một bước đột phá y học lớn.' },
      { id: 'w10_10', word: 'autonomous', ipa: '/ɔːˈtɒn.ə.məs/', pos: 'Tính từ (adj.)', meaning: 'tự hành, tự chủ độc lập', example: 'Autonomous delivery drones navigate city skies efficiently.', example_vi: 'Máy bay không người lái tự hành giao hàng di chuyển trên bầu trời thành phố hiệu quả.' },
      { id: 'w10_11', word: 'algorithm', ipa: '/ˈæl.ɡə.rɪ.ðəm/', pos: 'Danh từ (n.)', meaning: 'thuật toán xử lý máy tính', example: 'Adaptive algorithms match questions to student ability levels.', example_vi: 'Các thuật toán thích ứng ghép câu hỏi phù hợp với trình độ năng lực học sinh.' }
    ]
  },

  // ── KHỐI LỚP 11 ──
  {
    topicId: 'g11_u1',
    topicTitle: 'Lớp 11 - Unit 1 & 2: Sức Khỏe Lâu Dài & Khoảng Cách Thế Hệ (Healthy Life & Generation)',
    grade: '11',
    category: 'health_society',
    categoryLabel: 'Sức khỏe & Xã hội',
    description: 'Sống thọ khỏe mạnh và thu hẹp khoảng cách tư tưởng giữa các thế hệ',
    words: [
      { id: 'w11_01', word: 'longevity', ipa: '/lɒnˈdʒev.ə.ti/', pos: 'Danh từ (n.)', meaning: 'sự trường thọ, sống lâu', example: 'Healthy nutrition habits promote human longevity.', example_vi: 'Thói quen dinh dưỡng lành mạnh giúp thúc đẩy sự trường thọ của con người.' },
      { id: 'w11_02', word: 'antibiotic', ipa: '/ˌæn.ti.baɪˈɒt.ɪk/', pos: 'Danh từ (n.)', meaning: 'thuốc kháng sinh đặc trị', example: 'Never overuse antibiotics without a doctor prescription.', example_vi: 'Không bao giờ được lạm dụng kháng sinh mà không có đơn thuốc của bác sĩ.' },
      { id: 'w11_03', word: 'generation gap', ipa: '/ˌdʒen.əˈreɪ.ʃən ˌɡæp/', pos: 'Danh từ (n.)', meaning: 'khoảng cách thế hệ tư tưởng', example: 'Empathy bridges the generation gap within families.', example_vi: 'Lòng thấu cảm giúp thu hẹp khoảng cách thế hệ trong các gia đình.' },
      { id: 'w11_04', word: 'viewpoint', ipa: '/ˈvjuː.pɔɪnt/', pos: 'Danh từ (n.)', meaning: 'quan điểm, góc nhìn tư tưởng', example: 'Respecting differing viewpoints leads to harmony.', example_vi: 'Tôn trọng những quan điểm khác biệt dẫn tới sự hòa hợp.' },
      { id: 'w11_05', word: 'conflict', ipa: '/ˈkɒn.flɪkt/', pos: 'Danh từ (n.)', meaning: 'xung đột, mâu thuẫn bất đồng', example: 'Calm conversation resolves family conflicts quickly.', example_vi: 'Trò chuyện điềm tĩnh giải quyết mâu thuẫn gia đình nhanh chóng.' }
    ]
  },
  {
    topicId: 'g11_u3',
    topicTitle: 'Lớp 11 - Unit 3 & 5: Đô Thị Tương Lai & Khí Hậu Toàn Cầu (Smart Cities & Climate)',
    grade: '11',
    category: 'tech_environment',
    categoryLabel: 'Đô thị tương lai & Khí hậu',
    description: 'Thành phố thông minh và các giải pháp giảm thiểu nóng lên toàn cầu',
    words: [
      { id: 'w11_06', word: 'infrastructure', ipa: '/ˈɪn.frəˌstrʌk.tʃər/', pos: 'Danh từ (n.)', meaning: 'cơ sở hạ tầng kỹ thuật đô thị', example: 'Smart cities invest in modern public transit infrastructure.', example_vi: 'Các thành phố thông minh đầu tư vào cơ sở hạ tầng giao thông công cộng hiện đại.' },
      { id: 'w11_07', word: 'renewable', ipa: '/rɪˈnjuː.ə.bəl/', pos: 'Tính từ (adj.)', meaning: 'có thể tái tạo vô tận (năng lượng)', example: 'Solar power is an abundant renewable energy source.', example_vi: 'Năng lượng mặt trời là một nguồn năng lượng tái tạo dồi dào.' },
      { id: 'w11_08', word: 'greenhouse effect', ipa: '/ˈɡriːn.haʊs ɪˌfekt/', pos: 'Danh từ (n.)', meaning: 'hiệu ứng nhà kính', example: 'Excess carbon emissions amplify the greenhouse effect.', example_vi: 'Lượng phát thải carbon dư thừa làm gia tăng hiệu ứng nhà kính.' },
      { id: 'w11_09', word: 'deforestation', ipa: '/diːˌfɒr.ɪˈsteɪ.ʃən/', pos: 'Danh từ (n.)', meaning: 'nạn chặt phá rừng bừa bãi', example: 'Deforestation destroys the natural habitats of wildlife.', example_vi: 'Nạn phá rừng phá hủy môi trường sống tự nhiên của động vật hoang dã.' },
      { id: 'w11_10', word: 'catastrophic', ipa: '/ˌkæt.əˈstrɒf.ɪk/', pos: 'Tính từ (adj.)', meaning: 'thảm khốc, gây tai họa lớn', example: 'Rising sea levels threaten catastrophic flooding in coastal deltas.', example_vi: 'Mực nước biển dâng đe dọa gây ngập lụt thảm khốc tại các đồng bằng ven biển.' }
    ]
  },

  // ── KHỐI LỚP 12 ──
  {
    topicId: 'g12_u1',
    topicTitle: 'Lớp 12 - Unit 1 & 2: Câu Chuyện Thành Công & Đa Văn Hóa (Life Stories & Culture)',
    grade: '12',
    category: 'culture_inspirational',
    categoryLabel: 'Truyền cảm hứng & Văn hóa',
    description: 'Gương danh nhân vượt khó và giao lưu văn hóa quốc tế',
    words: [
      { id: 'w12_01', word: 'perseverance', ipa: '/ˌpɜː.sɪˈvɪə.rəns/', pos: 'Danh từ (n.)', meaning: 'sự kiên trì, bền chí vượt khó', example: 'Her outstanding exam results reflect years of perseverance.', example_vi: 'Kết quả thi xuất sắc của cô ấy phản ánh nhiều năm trời kiên trì bền bỉ.' },
      { id: 'w12_02', word: 'heritage', ipa: '/ˈher.ɪ.tɪdʒ/', pos: 'Danh từ (n.)', meaning: 'di sản văn hóa vật thể và phi vật thể', example: 'Ha Long Bay is a renowned World Natural Heritage site.', example_vi: 'Vịnh Hạ Long là di sản thiên nhiên thế giới nổi tiếng.' },
      { id: 'w12_03', word: 'assimilation', ipa: '/əˌsɪm.ɪˈleɪ.ʃən/', pos: 'Danh từ (n.)', meaning: 'sự đồng hóa văn hóa', example: 'Cultural preservation protects native languages from assimilation.', example_vi: 'Bảo tồn văn hóa giúp bảo vệ tiếng nói bản địa khỏi nguy cơ bị đồng hóa.' },
      { id: 'w12_04', word: 'biography', ipa: '/baɪˈɒɡ.rə.fi/', pos: 'Danh từ (n.)', meaning: 'tiểu sử, truyện danh nhân', example: 'He wrote an insightful biography of Albert Einstein.', example_vi: 'Ông ấy đã viết một cuốn tiểu sử sâu sắc về Albert Einstein.' },
      { id: 'w12_05', word: 'distinguished', ipa: '/dɪˈstɪŋ.ɡwɪʃt/', pos: 'Tính từ (adj.)', meaning: 'lỗi lạc, xuất chúng', example: 'He received an award for his distinguished scientific career.', example_vi: 'Ông nhận được giải thưởng cho sự nghiệp khoa học xuất chúng của mình.' }
    ]
  },
  {
    topicId: 'g12_u3',
    topicTitle: 'Lớp 12 - Unit 3 & 5: Sống Xanh Bền Vững & Nghề Nghiệp AI (Green Living & AI Careers)',
    grade: '12',
    category: 'tech_career',
    categoryLabel: 'Nghề nghiệp & Sống xanh',
    description: 'Bảo tồn sinh thái và định hướng việc làm tương lai',
    words: [
      { id: 'w12_06', word: 'biodegradable', ipa: '/ˌbaɪ.əʊ.dɪˈɡreɪ.də.bəl/', pos: 'Tính từ (adj.)', meaning: 'tự phân hủy sinh học trong tự nhiên', example: 'Biodegradable packaging breaks down cleanly without toxins.', example_vi: 'Bao bì tự phân hủy sinh học tự tiêu biến sạch sẽ không để lại độc tố.' },
      { id: 'w12_07', word: 'preservation', ipa: '/ˌprez.əˈveɪ.ʃən/', pos: 'Danh từ (n.)', meaning: 'sự bảo tồn, gìn giữ thiên nhiên', example: 'Rainforest preservation is vital for planetary oxygen balance.', example_vi: 'Bảo tồn rừng nhiệt đới là điều sống còn cho cân bằng oxy của hành tinh.' },
      { id: 'w12_08', word: 'competency', ipa: '/ˈkɒm.pɪ.tən.si/', pos: 'Danh từ (n.)', meaning: 'năng lực thực tế, kỹ năng làm việc', example: 'Analytical competency is highly sought after by employers.', example_vi: 'Năng lực phân tích được các nhà tuyển dụng tìm kiếm rất nhiều.' },
      { id: 'w12_09', word: 'transformative', ipa: '/trænsˈfɔː.mə.tɪv/', pos: 'Tính từ (adj.)', meaning: 'mang tính cách mạng, biến đổi sâu rộng', example: 'Generative AI represents a transformative technological wave.', example_vi: 'AI tạo sinh đại diện cho một làn sóng công nghệ mang tính cách mạng sâu rộng.' },
      { id: 'w12_10', word: 'collaborate', ipa: '/kəˈlæb.ə.reɪt/', pos: 'Động từ (v.)', meaning: 'hợp tác, làm việc nhóm', example: 'Cross-functional teams collaborate on innovative solutions.', example_vi: 'Các đội ngũ liên chuyên môn hợp tác cùng nhau để tạo ra các giải pháp đổi mới.' }
    ]
  },

  // ── CHUYÊN ĐỀ ÔN THI THPT QUỐC GIA ──
  {
    topicId: 'thpt_colloc',
    topicTitle: 'Chuyên Đề THPT - Cụm Từ Cố Định (Collocations Điểm 8+ & 9+)',
    grade: 'THPT',
    category: 'exam_mastery',
    categoryLabel: 'Chuyên đề THPT Quốc Gia',
    description: 'Các cụm từ cố định xuất hiện nhiều nhất trong đề thi tốt nghiệp THPT',
    words: [
      { id: 'wt_01', word: 'make a difference', ipa: '/meɪk ə ˈdɪf.ər.əns/', pos: 'Cụm động từ (colloc.)', meaning: 'tạo nên sự khác biệt, có tác động tích cực', example: 'Small daily actions can make a huge difference in environmental protection.', example_vi: 'Những hành động nhỏ hàng ngày có thể tạo nên sự khác biệt lớn trong bảo vệ môi trường.' },
      { id: 'wt_02', word: 'pay attention to', ipa: '/peɪ əˈten.ʃən tuː/', pos: 'Cụm động từ (colloc.)', meaning: 'chú ý, tập trung cao độ vào điều gì', example: 'Pay close attention to word forms in English sentence transformation.', example_vi: 'Hãy chú ý kỹ đến dạng từ trong các bài tập viết lại câu tiếng Anh.' },
      { id: 'wt_03', word: 'take advantage of', ipa: '/teɪk ədˈvɑːn.tɪdʒ ɒv/', pos: 'Cụm động từ (colloc.)', meaning: 'tận dụng triệt để thời cơ / tài liệu', example: 'Take advantage of adaptive testing to identify knowledge gaps.', example_vi: 'Hãy tận dụng bài thi thích ứng để phát hiện những lỗ hổng kiến thức.' },
      { id: 'wt_04', word: 'bear in mind', ipa: '/beər ɪn maɪnd/', pos: 'Thành ngữ (idiom)', meaning: 'ghi nhớ kỹ điều quan trọng trong đầu', example: 'Always bear in mind that consistency is the key to vocabulary mastery.', example_vi: 'Hãy luôn ghi nhớ rằng sự kiên trì là chìa khóa để làm chủ từ vựng.' },
      { id: 'wt_05', word: 'come to a conclusion', ipa: '/kʌm tuː ə kənˈkluː.ʒən/', pos: 'Cụm động từ (colloc.)', meaning: 'đi đến kết luận cuối cùng sau khi phân tích', example: 'The researchers came to a firm conclusion after extensive trials.', example_vi: 'Các nhà nghiên cứu đã đi đến kết luận vững chắc sau nhiều thử nghiệm sâu rộng.' },
      { id: 'wt_06', word: 'catch sight of', ipa: '/kætʃ saɪt ɒv/', pos: 'Cụm động từ (colloc.)', meaning: 'thoáng nhìn thấy, bắt gặp ánh mắt', example: 'I caught sight of my old friend in the crowded airport.', example_vi: 'Tôi thoáng nhìn thấy người bạn cũ trong sân bay đông đúc.' }
    ]
  },
  {
    topicId: 'thpt_phrasal',
    topicTitle: 'Chuyên Đề THPT - Phrasal Verbs & Thành Ngữ Phân Hóa',
    grade: 'THPT',
    category: 'exam_mastery',
    categoryLabel: 'Chuyên đề THPT Quốc Gia',
    description: 'Cụm động từ và thành ngữ ăn trọn điểm câu hỏi phân hóa',
    words: [
      { id: 'wt_07', word: 'carry out', ipa: '/ˈkær.i aʊt/', pos: 'Cụm động từ (phr. v.)', meaning: 'tiến hành, thực hiện (nghiên cứu, nhiệm vụ)', example: 'The science team carried out rigorous tests in the laboratory.', example_vi: 'Đội ngũ khoa học đã tiến hành các thử nghiệm nghiêm ngặt trong phòng thí nghiệm.' },
      { id: 'wt_08', word: 'call off', ipa: '/kɔːl ɒf/', pos: 'Cụm động từ (phr. v.)', meaning: 'hủy bỏ sự kiện đã lên lịch', example: 'The outdoor sports tournament was called off due to heavy rain.', example_vi: 'Giải thi đấu thể thao ngoài trời đã bị hủy bỏ do mưa lớn.' },
      { id: 'wt_09', word: 'put up with', ipa: '/pʊt ʌp wɪð/', pos: 'Cụm động từ (phr. v.)', meaning: 'chịu đựng, nhẫn nhịn điều phiền toái', example: 'He refused to put up with disrespectful behavior in the classroom.', example_vi: 'Thầy từ chối chịu đựng những hành vi thiếu tôn trọng trong lớp học.' },
      { id: 'wt_10', word: 'burn the midnight oil', ipa: '/bɜːn ðə ˈmɪd.naɪt ɔɪl/', pos: 'Thành ngữ (idiom)', meaning: 'thức khuya miệt mài học tập ôn thi', example: 'She burned the midnight oil studying for the national high school exam.', example_vi: 'Cô ấy thức khuya miệt mài ôn thi cho kỳ thi tốt nghiệp THPT quốc gia.' },
      { id: 'wt_11', word: 'hit the books', ipa: '/hɪt ðə bʊks/', pos: 'Thành ngữ (idiom)', meaning: 'bắt đầu học tập nghiêm túc', example: 'It is high time we hit the books and reviewed grammar rules.', example_vi: 'Đã đến lúc chúng ta tập trung học tập nghiêm túc và ôn lại các quy tắc ngữ pháp.' },
      { id: 'wt_12', word: 'look down on', ipa: '/lʊk daʊn ɒn/', pos: 'Cụm động từ (phr. v.)', meaning: 'xem thường, coi nhẹ ai đó', example: 'Never look down on others based on their background.', example_vi: 'Đừng bao giờ coi thường người khác dựa vào hoàn cảnh của họ.' }
    ]
  }
];

const THEMATIC_TOPICS_CONFIG = [
  { key: 'all', label: 'Tất cả chủ đề', icon: Layers },
  { key: 'tech_ai', label: '🤖 Trí tuệ nhân tạo & Kỷ nguyên số', icon: Sparkles },
  { key: 'environment_global', label: '🌱 Môi trường & Sống xanh', icon: Globe },
  { key: 'health_sports', label: '🍎 Sức khỏe & Thể thao', icon: BookOpen },
  { key: 'culture_city', label: '🏛️ Văn hóa, Ẩm thực & Đô thị', icon: Tag },
  { key: 'family_environment', label: '👨‍👩‍👧 Gia đình & Khoảng cách thế hệ', icon: BookMarked },
  { key: 'teen_psychology', label: '💡 Kỹ năng sống & Tâm lý học đường', icon: GraduationCap },
  { key: 'exam_mastery', label: '🏆 Collocations & Idioms THPT QG', icon: Bookmark }
];

const GRADES_CONFIG = [
  { id: 'all', label: 'Tất cả các lớp' },
  { id: '6', label: 'Lớp 6' },
  { id: '7', label: 'Lớp 7' },
  { id: '8', label: 'Lớp 8' },
  { id: '9', label: 'Lớp 9' },
  { id: '10', label: 'Lớp 10' },
  { id: '11', label: 'Lớp 11' },
  { id: '12', label: 'Lớp 12' },
  { id: 'THPT', label: '🎯 Ôn thi THPT QG' }
];

function WordCard({ word }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
        expanded
          ? 'bg-indigo-950/40 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
          : 'bg-white/[0.02] border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.04]'
      }`}
      onClick={() => setExpanded(v => !v)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="shrink-0 mt-0.5">
            <button
              onClick={e => { e.stopPropagation(); speakWord(word.word); }}
              className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/25 active:scale-95 transition"
              title="Nhấn để nghe phát âm từ vựng"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-extrabold text-white font-outfit">{word.word}</span>
              {word.pos && (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                  {word.pos}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {word.ipa && <span className="text-xs font-mono text-indigo-400 font-bold">{word.ipa}</span>}
            </div>
            <p className="text-xs text-slate-200 mt-1 font-semibold leading-snug">{word.meaning}</p>
          </div>
        </div>
        <div className="shrink-0 text-gray-500 mt-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/5 space-y-3 text-xs animate-fade-in">
          {word.example && (
            <div className="p-3.5 rounded-xl bg-[#080d1a] border border-white/10">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Ví dụ ngữ cảnh (Context):</p>
              <p className="text-slate-200 italic leading-relaxed">"{word.example}"</p>
              {word.example_vi && (
                <p className="text-indigo-300 mt-1 leading-relaxed font-medium">({word.example_vi})</p>
              )}
            </div>
          )}
          <button
            onClick={e => { e.stopPropagation(); speakWord(word.example || word.word); }}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold transition cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" /> Nghe phát âm cả câu ví dụ
          </button>
        </div>
      )}
    </div>
  );
}

export default function VocabLibrary({ selectedGrade }) {
  const [viewMode, setViewMode] = useState('by_grade'); // 'by_grade' | 'by_topic'
  const [selectedGradeFilter, setSelectedGradeFilter] = useState(selectedGrade || 'all');
  const [selectedThematicTopic, setSelectedThematicTopic] = useState('all');
  const [activeTopicId, setActiveTopicId] = useState(COMPREHENSIVE_VOCAB_DATA[0].topicId);
  const [searchQuery, setSearchQuery] = useState('');

  // AI Live Dictionary Lookup States
  const [aiLookupResult, setAiLookupResult] = useState(null);
  const [isLookingUpAi, setIsLookingUpAi] = useState(false);

  // Danh sách topics được lọc theo Chế độ hiện tại
  const visibleTopics = useMemo(() => {
    if (viewMode === 'by_grade') {
      if (selectedGradeFilter === 'all') return COMPREHENSIVE_VOCAB_DATA;
      return COMPREHENSIVE_VOCAB_DATA.filter(t => String(t.grade).toUpperCase() === String(selectedGradeFilter).toUpperCase());
    } else {
      if (selectedThematicTopic === 'all') return COMPREHENSIVE_VOCAB_DATA;
      return COMPREHENSIVE_VOCAB_DATA.filter(t => t.category === selectedThematicTopic);
    }
  }, [viewMode, selectedGradeFilter, selectedThematicTopic]);

  // Tự động chọn topic đầu tiên khi chuyển bộ lọc
  useEffect(() => {
    if (visibleTopics.length > 0) {
      if (!visibleTopics.some(t => t.topicId === activeTopicId)) {
        setActiveTopicId(visibleTopics[0].topicId);
      }
    }
  }, [visibleTopics, activeTopicId]);

  // Toàn bộ từ vựng phẳng phục vụ tìm kiếm
  const allFlatWords = useMemo(() => {
    const words = [];
    COMPREHENSIVE_VOCAB_DATA.forEach(t => {
      t.words.forEach(w => {
        words.push({ ...w, topicTitle: t.topicTitle, grade: t.grade });
      });
    });
    return words;
  }, []);

  // Kết quả tìm kiếm thời gian thực thông minh (Khớp cả tiếng Việt có dấu, không dấu, tiếng Anh và câu ví dụ)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const qRaw = searchQuery.toLowerCase().trim();
    const qNorm = removeVietnameseTones(qRaw);

    return allFlatWords.filter(w => {
      const wordEn = (w.word || '').toLowerCase();
      const meaningRaw = (w.meaning || '').toLowerCase();
      const meaningNorm = removeVietnameseTones(meaningRaw);
      const ipa = (w.ipa || '').toLowerCase();
      const exEn = (w.example || '').toLowerCase();
      const exViRaw = (w.example_vi || '').toLowerCase();
      const exViNorm = removeVietnameseTones(exViRaw);

      return (
        wordEn.includes(qRaw) ||
        meaningRaw.includes(qRaw) ||
        meaningNorm.includes(qNorm) ||
        ipa.includes(qRaw) ||
        exEn.includes(qRaw) ||
        exViRaw.includes(qRaw) ||
        exViNorm.includes(qNorm)
      );
    });
  }, [searchQuery, allFlatWords]);

  const isSearchMode = searchQuery.trim().length > 0;
  const activeTopicData = COMPREHENSIVE_VOCAB_DATA.find(t => t.topicId === activeTopicId) || visibleTopics[0];

  // Hàm tra cứu từ điển thông minh AI
  const handleLiveAiLookup = async (wordToQuery) => {
    const term = wordToQuery || searchQuery.trim();
    if (!term) return;
    setIsLookingUpAi(true);
    setAiLookupResult(null);

    try {
      const savedGemini = localStorage.getItem('api_gemini') || localStorage.getItem('gemini_api_key') || '';
      const res = await axios.post(
        `${API_BASE}/dictionary/lookup`,
        { word: term, grade: selectedGrade || '12' },
        { headers: savedGemini ? { 'X-Gemini-Key': savedGemini } : {} }
      );

      if (res.data && res.data.data) {
        setAiLookupResult(res.data.data);
      }
    } catch (err) {
      console.warn('Lỗi tra từ điển AI:', err.message);
      // Fallback
      setAiLookupResult({
        word: term,
        ipa: `/${term.toLowerCase()}/`,
        pos: 'Từ vựng tiếng Anh',
        meaning: `Nghĩa tra cứu của từ '${term}'`,
        example: `Students should practice using '${term}' in natural context.`,
        example_vi: `Học sinh nên rèn luyện cách sử dụng từ '${term}' trong ngữ cảnh tự nhiên.`
      });
    } finally {
      setIsLookingUpAi(false);
    }
  };

  return (
    <div className="space-y-6 w-full pb-16 animate-fade-in max-w-[1600px] mx-auto">
      {/* ─── 1. HERO HEADER ─────────────────────────────────────────────────── */}
      <div className="glass rounded-3xl p-7 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-r from-slate-950 via-[#0b0c1e] to-indigo-950/80">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 shrink-0">
              <BookMarked className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white font-outfit">
                Kho Học Liệu &amp; Từ Điển Tiếng Anh Phổ Thông
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Tìm kiếm <strong>Tiếng Anh &harr; Tiếng Việt</strong> tức thì — Toàn bộ từ vựng <strong>Lớp 6 đến 12 &amp; Ôn Thi THPT Quốc Gia</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-xs text-gray-300 font-bold bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
              <span className="text-indigo-400 font-black text-sm">{allFlatWords.length}+</span> từ vựng phổ thông
            </div>
            <div className="text-xs text-gray-300 font-bold bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
              <span className="text-cyan-400 font-black text-sm">{COMPREHENSIVE_VOCAB_DATA.length}</span> chủ đề bài học
            </div>
            <div className="text-xs text-emerald-300 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tìm kiếm Song ngữ tức thì</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. HAI CHẾ ĐỘ XEM CHÍNH (THEO KHỐI LỚP vs THEO CHỦ ĐỀ) ─────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Toggle Mode Buttons */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0c1222] border border-white/10 w-fit">
          <button
            onClick={() => setViewMode('by_grade')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'by_grade'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-indigo-300" />
            <span>1. Theo Khối Lớp (Lớp 6 - 12 &amp; THPT)</span>
          </button>

          <button
            onClick={() => setViewMode('by_topic')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'by_topic'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4 text-cyan-300" />
            <span>2. Theo Chuyên Đề (Topics)</span>
          </button>
        </div>

        {/* Global Instant Search Bar */}
        <div className="relative flex-1 max-w-xl flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setAiLookupResult(null); }}
              onKeyDown={e => { if (e.key === 'Enter') handleLiveAiLookup(); }}
              placeholder="Gõ tiếng Việt (VD: môi trường, thầy cô, sáng tạo) hoặc tiếng Anh để tìm ngay..."
              className="w-full pl-10 pr-10 py-3 bg-[#0d1424] border border-white/10 rounded-2xl text-xs md:text-sm text-white placeholder-gray-400 outline-none focus:border-indigo-500 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setAiLookupResult(null); }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => handleLiveAiLookup()}
            disabled={!searchQuery.trim() || isLookingUpAi}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 disabled:opacity-40 cursor-pointer shadow-lg shadow-indigo-600/20"
            title="Tra cứu từ điển tiếng Anh bằng AI"
          >
            {isLookingUpAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
            <span>Tra Từ Điển</span>
          </button>
        </div>
      </div>

      {/* ─── 3. SUB-FILTER THEO MODE ĐÃ CHỌN ──────────────────────────────── */}
      {!isSearchMode && (
        <div className="p-3.5 rounded-2xl bg-[#0d1424] border border-white/5 space-y-2">
          {viewMode === 'by_grade' ? (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-xs font-bold text-gray-400 shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-indigo-400" /> Chọn Khối Lớp:
              </span>
              {GRADES_CONFIG.map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGradeFilter(g.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                    selectedGradeFilter === g.id
                      ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/50 shadow'
                      : 'bg-white/5 text-gray-400 border-transparent hover:text-white hover:bg-white/10'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-xs font-bold text-gray-400 shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-cyan-400" /> Chọn Chuyên Đề:
              </span>
              {THEMATIC_TOPICS_CONFIG.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedThematicTopic(cat.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                    selectedThematicTopic === cat.key
                      ? 'bg-cyan-600/30 text-cyan-200 border-cyan-500/50 shadow'
                      : 'bg-white/5 text-gray-400 border-transparent hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── 4. HIỂN THỊ KẾT QUẢ TÌM KIẾM HOẶC TRA CỨU TỪ ĐIỂN TỨC THÌ ─────── */}
      {isSearchMode ? (
        <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-5 bg-[#0d1424]">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-400" />
              <h3 className="font-extrabold text-sm text-white font-outfit">
                Kết quả tìm kiếm cho: <span className="text-indigo-400">"{searchQuery}"</span>
                <span className="text-gray-400 font-normal ml-2">({searchResults.length} từ khớp tức thì)</span>
              </h3>
            </div>

            <button
              onClick={() => handleLiveAiLookup()}
              disabled={isLookingUpAi}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 text-xs font-bold flex items-center gap-1.5 border border-indigo-500/20 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Tra cứu sâu hơn bằng Từ Điển AI</span>
            </button>
          </div>

          {/* AI Dictionary Lookup Card if present */}
          {aiLookupResult && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 shadow-xl space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Kết quả tra từ điển AI
                </span>
                <span className="text-xs text-indigo-300 font-mono font-bold">{aiLookupResult.ipa}</span>
              </div>
              <WordCard word={aiLookupResult} />
            </div>
          )}

          {/* Local instant bilingual search results */}
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {searchResults.map(w => <WordCard key={w.id} word={w} />)}
            </div>
          ) : !aiLookupResult && (
            <div className="text-center py-12 space-y-3">
              <p className="text-gray-400 text-sm font-bold">Chưa tìm thấy từ khớp trực tiếp trong kho nhanh.</p>
              <button
                onClick={() => handleLiveAiLookup()}
                disabled={isLookingUpAi}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer shadow flex items-center gap-2 mx-auto"
              >
                {isLookingUpAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                <span>Tra từ điển mở rộng từ "{searchQuery}"</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ─── 5. GRID 2 CỘT: CỘT TRÁI CHỦ ĐỀ & CỘT PHẢI DANH SÁCH TỪ VỰNG ─── */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Cột Trái: Danh sách Topics */}
          <div className="glass-card rounded-3xl p-4 border border-white/10 space-y-2 lg:col-span-1 h-fit max-h-[75vh] overflow-y-auto bg-[#0d1424]">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 mb-2">
              <Tag className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-extrabold text-gray-300 uppercase tracking-wider">
                Chủ Đề ({visibleTopics.length})
              </span>
            </div>

            {visibleTopics.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs font-bold">
                Không có chủ đề phù hợp trong bộ lọc này.
              </div>
            ) : (
              visibleTopics.map(t => {
                const isActive = activeTopicId === t.topicId;
                return (
                  <button
                    key={t.topicId}
                    onClick={() => setActiveTopicId(t.topicId)}
                    className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition cursor-pointer flex flex-col gap-1 border ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-200 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                        : 'bg-[#101728] text-gray-400 border-white/5 hover:text-white hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                          isActive
                            ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                            : 'bg-white/5 text-gray-400'
                        }`}
                      >
                        {t.grade === 'THPT' ? 'THPT QG' : `Lớp ${t.grade}`}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {t.words.length} từ
                      </span>
                    </div>
                    <span className="leading-snug text-white font-semibold line-clamp-2 mt-0.5">{t.topicTitle}</span>
                  </button>
                );
              })
            )}
          </div>

          {/* Cột Phải: Danh Sách Từ Vựng Chi Tiết của Topic */}
          <div className="lg:col-span-3 space-y-5">
            {activeTopicData && (
              <div className="glass-card rounded-3xl p-5 border border-white/10 bg-[#0d1424]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-lg uppercase">
                        {activeTopicData.grade === 'THPT' ? 'Ôn Thi THPT Quốc Gia' : `Khối Lớp ${activeTopicData.grade}`}
                      </span>
                      <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-lg">
                        {activeTopicData.categoryLabel}
                      </span>
                    </div>
                    <h2 className="text-lg md:text-xl font-extrabold text-white font-outfit mt-2">{activeTopicData.topicTitle}</h2>
                    {activeTopicData.description && (
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{activeTopicData.description}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0 bg-[#080d1a] border border-white/5 px-4 py-2 rounded-2xl">
                    <div className="text-xl font-black text-indigo-400">{activeTopicData.words.length}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Từ vựng</div>
                  </div>
                </div>
              </div>
            )}

            {activeTopicData && activeTopicData.words.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {activeTopicData.words.map(w => (
                  <WordCard key={w.id} word={w} />
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-12 border border-white/10 flex flex-col items-center justify-center gap-3 text-center bg-[#0d1424]">
                <BookOpen className="w-10 h-10 text-gray-600" />
                <p className="text-gray-400 text-sm font-bold">Chưa có từ vựng nào trong chủ đề này.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
