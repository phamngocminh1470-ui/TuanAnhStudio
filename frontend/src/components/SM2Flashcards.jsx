import React, { useState } from 'react';
import { 
  Clock, BookOpen, Eye, EyeOff, Volume2, Sparkles, CheckCircle2, 
  RotateCw, ArrowRight, Activity, Zap, Layers, GraduationCap, Award, HelpCircle 
} from 'lucide-react';
import axios from 'axios';
import { useUserProgress } from '../hooks/useUserProgress';
import SyncStatusBadge from './SyncStatusBadge';

const API_BASE = '/api';

export default function SM2Flashcards({ selectedGrade, currentUser }) {
  const [ef, setEf] = useState(() => {
    const saved = localStorage.getItem('user_ef');
    return saved ? parseFloat(saved) : 2.52;
  });
  const [nextInterval, setNextInterval] = useState(() => {
    const saved = localStorage.getItem('user_next_interval');
    return saved ? parseInt(saved, 10) : 6;
  });
  const [repetitionCount, setRepetitionCount] = useState(2);
  const [vocabCount, setVocabCount] = useState(() => {
    const saved = localStorage.getItem('user_vocab_count');
    return saved ? parseInt(saved, 10) : 142;
  });

  // Pha 2: User progress sync
  const { syncStatus, lastSyncAt, saveToServer, isLoggedIn } = useUserProgress();

  // ACCURATE VOCABULARY BANK WITH HIGH-PRECISION IPA & VIETNAMESE PRONUNCIATION GUIDES
  const flashcardDataByGrade = {
    '6': [
      { id: 'FC6_1', word: 'Hobby', ipa: '/ˈhɒb.i/', reading: 'HÓ-bi', pos: 'Danh từ (n.)', meaning: 'Sở thích, hoạt động giải trí lúc rảnh rỗi', example: 'My favorite hobby is playing badminton with my brother.', exampleVi: 'Sở thích yêu thích của tôi là chơi cầu lông với anh tôi.' },
      { id: 'FC6_2', word: 'Friendly', ipa: '/ˈfrend.li/', reading: 'FRÉN-đli', pos: 'Tính từ (adj.)', meaning: 'Thân thiện, cởi mở, dễ mến', example: 'All the students in my class are very friendly.', exampleVi: 'Tất cả học sinh trong lớp tôi đều rất thân thiện.' },
      { id: 'FC6_3', word: 'Neighborhood', ipa: '/ˈneɪ.bə.hʊd/', reading: 'NÂY-bơ-hút', pos: 'Danh từ (n.)', meaning: 'Khu xóm, khu vực lân cận nhà ở', example: 'There is a beautiful park in our neighborhood.', exampleVi: 'Có một công viên rất đẹp trong khu xóm của chúng tôi.' },
      { id: 'FC6_4', word: 'Activity', ipa: '/ækˈtɪv.ə.ti/', reading: 'éc-TI-vơ-ti', pos: 'Danh từ (n.)', meaning: 'Hoạt động thể thao hoặc học tập', example: 'Outdoor activities keep students healthy and active.', exampleVi: 'Các hoạt động ngoài trời giúp học sinh khỏe mạnh.' },
      { id: 'FC6_5', word: 'Library', ipa: '/ˈlaɪ.brər.i/', reading: 'LAI-brơ-ri', pos: 'Danh từ (n.)', meaning: 'Thư viện sách', example: 'We study in the school library after class.', exampleVi: 'Chúng tôi học ở thư viện trường sau giờ học.' }
    ],
    '7': [
      { id: 'FC7_1', word: 'Community', ipa: '/kəˈmjuː.nə.ti/', reading: 'cơ-MIU-nơ-ti', pos: 'Danh từ (n.)', meaning: 'Cộng đồng, nhóm người sống chung một khu vực', example: 'Students joined the clean-up event for our community.', exampleVi: 'Học sinh tham gia sự kiện dọn dẹp cho cộng đồng.' },
      { id: 'FC7_2', word: 'Volunteer', ipa: '/ˌvɒl.ənˈtɪər/', reading: 'vo-lơn-TI-ơ', pos: 'Danh từ / Động từ', meaning: 'Tình nguyện viên, làm việc tự nguyện', example: 'She works as a volunteer at the local shelter.', exampleVi: 'Cô ấy làm tình nguyện viên tại trung tâm địa phương.' },
      { id: 'FC7_3', word: 'Traditional', ipa: '/trəˈdɪʃ.ən.əl/', reading: 'trơ-ĐI-shơn-nơ-l', pos: 'Tính từ (adj.)', meaning: 'Truyền thống, theo phong tục lâu đời', example: 'Tet is the most important traditional festival in Vietnam.', exampleVi: 'Tết là lễ hội truyền thống quan trọng nhất ở Việt Nam.' },
      { id: 'FC7_4', word: 'Environment', ipa: '/ɪnˈvaɪ.rən.mənt/', reading: 'in-VAI-rơn-mơn-t', pos: 'Danh từ (n.)', meaning: 'Môi trường sống xung quanh', example: 'Planting trees helps protect the natural environment.', exampleVi: 'Trồng cây giúp bảo vệ môi trường tự nhiên.' },
      { id: 'FC7_5', word: 'Healthy', ipa: '/ˈhel.θi/', reading: 'HEL-thi', pos: 'Tính từ (adj.)', meaning: 'Lành mạnh, tốt cho sức khỏe', example: 'Eating fresh fruit gives you a healthy lifestyle.', exampleVi: 'Ăn trái cây tươi mang lại lối sống lành mạnh.' }
    ],
    '8': [
      { id: 'FC8_1', word: 'Custom', ipa: '/ˈkʌs.təm/', reading: 'CẤT-stầm', pos: 'Danh từ (n.)', meaning: 'Tập quán, phong tục địa phương', example: 'Taking off shoes before entering a house is a common custom.', exampleVi: 'Cởi giày trước khi vào nhà là một phong tục phổ biến.' },
      { id: 'FC8_2', word: 'Heritage', ipa: '/ˈher.ɪ.tɪdʒ/', reading: 'HE-ri-tích', pos: 'Danh từ (n.)', meaning: 'Di sản văn hóa hoặc thiên nhiên', example: 'Ha Long Bay is recognized as a World Natural Heritage site.', exampleVi: 'Vịnh Hạ Long được công nhận là Di sản Thiên nhiên Thế giới.' },
      { id: 'FC8_3', word: 'Pollution', ipa: '/pəˈluː.ʃən/', reading: 'pơ-LÚ-shần', pos: 'Danh từ (n.)', meaning: 'Sự ô nhiễm (không khí, nước, đất)', example: 'Air pollution is a serious challenge in big cities.', exampleVi: 'Ô nhiễm không khí là thách thức nghiêm trọng ở thành phố.' },
      { id: 'FC8_4', word: 'Disaster', ipa: '/dɪˈzɑː.stər/', reading: 'đi-ZÁ-stơ', pos: 'Danh từ (n.)', meaning: 'Thảm họa thiên nhiên (bão, lũ)', example: 'Early warnings reduce the damage of natural disasters.', exampleVi: 'Cảnh báo sớm giúp giảm thiệt hại thảm họa thiên nhiên.' },
      { id: 'FC8_5', word: 'Communication', ipa: '/kəˌmjuː.nɪˈkeɪ.ʃən/', reading: 'cơ-miu-ni-KÂY-shần', pos: 'Danh từ (n.)', meaning: 'Sự giao tiếp, truyền thông tin', example: 'Good communication skills build strong friendships.', exampleVi: 'Kỹ năng giao tiếp tốt giúp xây dựng tình bạn bền chặt.' }
    ],
    '9': [
      { id: 'FC9_1', word: 'Bilingual', ipa: '/baɪˈlɪŋ.ɡwəl/', reading: 'bai-LIN-gu-ơ-l', pos: 'Tính từ (adj.)', meaning: 'Sử dụng thành thạo hai ngôn ngữ', example: 'Being bilingual opens up many career opportunities.', exampleVi: 'Thành thạo hai ngôn ngữ mở ra nhiều cơ hội nghề nghiệp.' },
      { id: 'FC9_2', word: 'Attraction', ipa: '/əˈtræk.ʃən/', reading: 'ơ-TRÉC-shần', pos: 'Danh từ (n.)', meaning: 'Điểm du lịch thu hút khách', example: 'The ancient town is a famous tourist attraction.', exampleVi: 'Khu phố cổ là điểm thu hút du khách nổi tiếng.' },
      { id: 'FC9_3', word: 'Craftsman', ipa: '/ˈkrɑːfts.mən/', reading: 'CRÁP-t-smơn', pos: 'Danh từ (n.)', meaning: 'Nghệ nhân, thợ thủ công lành nghề', example: 'The craftsman made a beautiful pottery vase by hand.', exampleVi: 'Nghệ nhân đã làm một bình gốm tuyệt đẹp bằng tay.' },
      { id: 'FC9_4', word: 'Preserve', ipa: '/prɪˈzɜːv/', reading: 'pri-ZƠ-v', pos: 'Động từ (v.)', meaning: 'Bảo tồn, giữ gìn tài nguyên hoặc di sản', example: 'Efforts are made to preserve local wildlife habitats.', exampleVi: 'Nhiều nỗ lực được thực hiện để bảo tồn môi trường sống hoang dã.' },
      { id: 'FC9_5', word: 'Destination', ipa: '/ˌdes.tɪˈneɪ.ʃən/', reading: 'đen-sti-NÂY-shần', pos: 'Danh từ (n.)', meaning: 'Điểm đến du lịch hoặc hành trình', example: 'Da Nang is a top holiday destination in Vietnam.', exampleVi: 'Đà Nẵng là điểm đến nghỉ dưỡng hàng đầu tại Việt Nam.' }
    ],
    '10': [
      { id: 'FC10_1', word: 'Perseverance', ipa: '/ˌpɜː.sɪˈvɪə.rəns/', reading: 'pơ-sơ-VI-ơ-rơn-s', pos: 'Danh từ (n.)', meaning: 'Tính kiên trì, sự nhẫn nại vượt qua mọi khó khăn', example: 'Perseverance is essential for scientific research success.', exampleVi: 'Sự kiên trì là yếu tố thiết yếu để thành công trong nghiên cứu khoa học.' },
      { id: 'FC10_2', word: 'Adaptive Learning', ipa: '/əˈdæp.tɪv ˈlɜː.nɪŋ/', reading: 'ơ-ĐÁP-tiiv LƠ-ning', pos: 'Danh từ ghép', meaning: 'Học tập thích ứng cá nhân hóa theo năng lực học sinh', example: 'Adaptive learning algorithms tailor educational content dynamically.', exampleVi: 'Thuật toán học tập thích ứng tùy biến nội dung giáo dục một cách linh hoạt.' },
      { id: 'FC10_3', word: 'Algorithm', ipa: '/ˈæl.ɡə.rɪ.ðəm/', reading: 'ÉL-gơ-ri-đơm', pos: 'Danh từ (n.)', meaning: 'Thuật toán, quy trình tính toán xử lý dữ liệu', example: 'The IRT algorithm estimates student ability score theta.', exampleVi: 'Thuật toán IRT ước lượng điểm số năng lực theta của học sinh.' },
      { id: 'FC10_4', word: 'Fluency', ipa: '/ˈfluː.ən.si/', reading: 'PHLU-ơn-si', pos: 'Danh từ (n.)', meaning: 'Sự trôi chảy, lưu loát tự nhiên trong giao tiếp', example: 'Daily practice improves English speaking fluency significantly.', exampleVi: 'Luyện tập hàng ngày cải thiện đáng kể sự trôi chảy khi nói tiếng Anh.' },
      { id: 'FC10_5', word: 'Sustainability', ipa: '/səˌsteɪ.nəˈbɪl.ə.ti/', reading: 'sơ-stây-nơ-BI-lơ-ti', pos: 'Danh từ (n.)', meaning: 'Sự phát triển bền vững bảo vệ môi trường', example: 'Renewable energy is key to environmental sustainability.', exampleVi: 'Năng lượng tái tạo là chìa khóa cho sự phát triển bền vững môi trường.' }
    ],
    '11': [
      { id: 'FC11_1', word: 'Biodiversity', ipa: '/ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/', reading: 'bai-ơ-đai-VƠ-sơ-ti', pos: 'Danh từ (n.)', meaning: 'Đa dạng sinh học trong tự nhiên', example: 'Protecting rainforests preserves global biodiversity.', exampleVi: 'Bảo vệ rừng nhiệt đới giúp giữ sự đa dạng sinh học.' },
      { id: 'FC11_2', word: 'Artificial Intelligence', ipa: '/ˌɑː.tɪˈfɪʃ.əl ɪnˈtel.ɪ.dʒəns/', reading: 'a-ti-PHI-shơn in-TE-li-giơn-s', pos: 'Danh từ (n.)', meaning: 'Trí tuệ nhân tạo (AI)', example: 'Artificial Intelligence transforms modern education models.', exampleVi: 'Trí tuệ nhân tạo đang biến đổi các mô hình giáo dục.' },
      { id: 'FC11_3', word: 'Global Warming', ipa: '/ˈɡləʊ.bəl ˈwɔː.mɪŋ/', reading: 'GƠ-lâu-bơn WO-ming', pos: 'Danh từ (n.)', meaning: 'Sự nóng lên toàn cầu', example: 'Reducing emissions helps slow down global warming.', exampleVi: 'Giảm khí thải giúp làm chậm sự nóng lên toàn cầu.' },
      { id: 'FC11_4', word: 'Infrastructure', ipa: '/ˈɪn.frəˌstrʌk.tʃər/', reading: 'IN-frơ-strắc-chơ', pos: 'Danh từ (n.)', meaning: 'Cơ sở hạ tầng (giao thông, điện nước)', example: 'Investing in green infrastructure benefits future cities.', exampleVi: 'Đầu tư vào cơ sở hạ tầng xanh mang lại lợi ích lâu dài.' },
      { id: 'FC11_5', word: 'Innovation', ipa: '/ˌɪn.əˈveɪ.ʃən/', reading: 'in-nơ-VÂY-shần', pos: 'Danh từ (n.)', meaning: 'Sự đổi mới, sáng tạo công nghệ', example: 'Technological innovation drives economic growth.', exampleVi: 'Đổi mới công nghệ thúc đẩy tăng trưởng kinh tế.' }
    ],
    '12': [
      { id: 'FC12_1', word: 'Interdisciplinary', ipa: '/ˌɪn.tə.dɪs.əˈplɪn.ər.i/', reading: 'in-tơ-đi-si-PLI-nơ-ri', pos: 'Tính từ (adj.)', meaning: 'Liên ngành, kết hợp nhiều lĩnh vực', example: 'Interdisciplinary research solves complex modern challenges.', exampleVi: 'Nghiên cứu liên ngành giải quyết thách thức hiện đại.' },
      { id: 'FC12_2', word: 'Socioeconomic', ipa: '/ˌsəʊ.si.əʊˌiː.kəˈnɒm.ɪk/', reading: 'sơ-si-ơ-i-cơ-NO-mic', pos: 'Tính từ (adj.)', meaning: 'Thuộc kinh tế - xã hội', example: 'Education improves individual socioeconomic status.', exampleVi: 'Giáo dục nâng cao vị thế kinh tế - xã hội.' },
      { id: 'FC12_3', word: 'Collaborative', ipa: '/kəˈlæb.ər.ə.tɪv/', reading: 'cơ-LA-bơ-rơ-tiiv', pos: 'Tính từ (adj.)', meaning: 'Mang tính hợp tác, làm việc nhóm', example: 'Collaborative learning enhances student critical thinking.', exampleVi: 'Học tập hợp tác nâng cao tư duy phản biện.' },
      { id: 'FC12_4', word: 'Comprehensive', ipa: '/ˌkɒm.prɪˈhen.sɪv/', reading: 'com-pri-HEN-siiv', pos: 'Tính từ (adj.)', meaning: 'Toàn diện, bao quát đầy đủ khía cạnh', example: 'The report offers a comprehensive analysis of the project.', exampleVi: 'Báo cáo đưa ra phân tích toàn diện về dự án.' },
      { id: 'FC12_5', word: 'Implementation', ipa: '/ˌɪm.plɪ.menˈteɪ.ʃən/', reading: 'im-pli-men-TÂY-shần', pos: 'Danh từ (n.)', meaning: 'Sự thực thi, triển khai áp dụng', example: 'Successful implementation requires careful project planning.', exampleVi: 'Triển khai thành công đòi hỏi sự lập kế hoạch tỉ mỉ.' }
    ]
  };

  const activeGradeCards = flashcardDataByGrade[selectedGrade] || flashcardDataByGrade['10'];

  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sm2Feedback, setSm2Feedback] = useState(null);

  const currentCard = activeGradeCards[cardIndex % activeGradeCards.length] || activeGradeCards[0];

  // SM-2 CARD RATING
  const handleSM2Rating = async (quality) => {
    try {
      const res = await axios.post(`${API_BASE}/spaced-repetition/next-review`, {
        quality: quality,
        current_repetition: repetitionCount,
        current_ef: ef,
        current_interval: nextInterval
      }).catch(() => null);

      let newInt = nextInterval;
      let newEfVal = ef;
      let newRepVal = repetitionCount;

      if (res && res.data) {
        newInt = res.data.next_interval_days;
        newEfVal = Number(res.data.new_ef.toFixed(2));
        newRepVal = res.data.new_repetition;
      } else {
        if (quality < 3) {
          newInt = 1;
          newRepVal = 0;
        } else {
          newEfVal = Math.max(1.3, Number((ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))).toFixed(2)));
          newRepVal += 1;
          newInt = newRepVal === 1 ? 1 : (newRepVal === 2 ? 6 : Math.ceil(nextInterval * newEfVal));
        }
      }

      setNextInterval(newInt);
      setEf(newEfVal);
      setRepetitionCount(newRepVal);

      // Tăng số từ đã học nếu nhớ tốt (quality >= 3)
      const newVocabCount = quality >= 3 ? vocabCount + 1 : vocabCount;
      setVocabCount(newVocabCount);

      // Lưu vào localStorage
      localStorage.setItem('user_ef', newEfVal.toString());
      localStorage.setItem('user_next_interval', newInt.toString());
      localStorage.setItem('user_vocab_count', newVocabCount.toString());

      // Pha 2: Lưu sm2_data lên server (silent, non-blocking)
      // Ghi đ để không bị mất tiến độ nhớ từ khi login lại
      if (isLoggedIn()) {
        saveToServer({
          sm2_data: {
            ef: newEfVal,
            next_interval: newInt,
            vocab_count: newVocabCount,
            repetition_count: newRepVal,
            last_reviewed_grade: selectedGrade,
            last_reviewed_at: new Date().toISOString(),
          },
          session_type: 'sm2',
          questions_answered: 1,
          correct_count: quality >= 3 ? 1 : 0,
          skill_focus: 'Vocabulary SM2',
        }).catch(err => {
          // Silent — không hiển thị lỗi cho học sinh
          console.warn('[SM2] Save error:', err?.message);
        });
      }

      setSm2Feedback(`Ghi nhận độ thuộc từ vựng thành công! Ôn lại sau ${newInt} ngày`);
      setTimeout(() => {
        setSm2Feedback(null);
        setIsFlipped(false);
        setCardIndex(prev => prev + 1);
      }, 1500);

    } catch (e) {
      console.error(e);
    }
  };

  // SPEAK TEXT TTS
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full space-y-10 pb-16 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="glass rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 border border-amber-400/40 flex items-center justify-center text-white shadow-xl shadow-amber-500/25 shrink-0">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-white font-outfit">Học từ vựng thông minh</h1>
              <span className="text-[10px] text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-extrabold">Ôn tập thông minh</span>
              {/* Pha 2: Sync Status Badge */}
              {isLoggedIn() && (
                <SyncStatusBadge status={syncStatus} lastSyncAt={lastSyncAt} />
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Hệ thống thẻ ghi nhớ thông minh tích hợp Phiên âm IPA chuẩn &amp; Hướng dẫn đọc chuẩn âm tiết Việt hóa cho Lớp {selectedGrade}
            </p>
          </div>
        </div>

        {/* School Branding Card Header */}
        <div className="flex items-center space-x-3 bg-gradient-to-r from-slate-950 to-indigo-950/80 border border-indigo-500/20 p-4 rounded-2xl shrink-0 shadow-lg">
          <GraduationCap className="w-8 h-8 text-amber-400 shrink-0" />
          <div>
            <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block">Dự án KHKT Học sinh</span>
            <span className="text-xs font-bold text-white block">TRƯỜNG THPT NGUYỄN KHUYẾN</span>
            <span className="text-[10px] text-gray-400 block font-semibold">Tỉnh Bà Rịa - Vũng Tàu</span>
          </div>
        </div>
      </div>

      {/* Grid Layout: Main Flashcard Left (8 cols) + Right Sidebar Stats (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Premium Interactive 3D Flashcard & Controls */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card rounded-3xl p-8 md:p-10 border border-white/10 space-y-8 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-sm font-extrabold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>Thẻ từ vựng Tiếng Anh Lớp {selectedGrade}</span>
              </span>

              <span className="text-xs font-extrabold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3.5 py-1.5 rounded-xl shadow-inner">
                Thẻ thứ {cardIndex + 1} / {activeGradeCards.length}
              </span>
            </div>

            {/* Premium WOW 3D Glassmorphic Flashcard Flip Container */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[320px] p-8 rounded-3xl bg-gradient-to-br from-[#0f1738] via-[#0b122c] to-[#060a1b] border border-amber-500/35 flex flex-col justify-between cursor-pointer hover:border-amber-400/70 transition-all duration-300 shadow-2xl relative group overflow-hidden"
            >
              {/* Top Card Info Bar */}
              <div className="flex justify-between items-center text-xs text-gray-400 z-10">
                <span className="font-extrabold text-amber-400 flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{currentCard.pos || 'Từ vựng trọng tâm'}</span>
                </span>
                <span className="text-gray-300 flex items-center gap-1.5 text-xs font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-full group-hover:text-amber-300 transition">
                  {isFlipped ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-indigo-400" />}
                  <span>{isFlipped ? 'Ẩn đáp án' : 'Lật mặt sau'}</span>
                </span>
              </div>

              {/* Front Side Card */}
              {!isFlipped ? (
                <div className="my-auto text-center space-y-5 py-6 z-10">
                  <h2 className="text-4xl md:text-5xl font-black text-white font-outfit tracking-wide drop-shadow-lg">
                    {currentCard.word}
                  </h2>

                  {/* Clean Standard IPA Phonetics Badge */}
                  <div className="flex items-center justify-center pt-1">
                    <div className="inline-flex items-center space-x-2.5 bg-amber-500/15 border border-amber-500/30 px-5 py-2.5 rounded-2xl shadow-lg">
                      <span className="text-xs text-amber-400 font-extrabold uppercase tracking-wider">PHIÊN ÂM IPA:</span>
                      <span className="text-lg font-bold text-amber-200 font-mono tracking-widest">{currentCard.ipa}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); speakText(currentCard.word); }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-200 text-xs font-extrabold transition cursor-pointer border border-amber-500/40 shadow-lg glow-btn-brand"
                    >
                      <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" /> Nghe giọng đọc phát âm chuẩn AI
                    </button>
                  </div>
                </div>
              ) : (
                /* Back Side Card */
                <div className="my-auto space-y-5 py-6 animate-fade-in text-left z-10">
                  <div>
                    <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block mb-1">Nghĩa tiếng Việt chuẩn:</span>
                    <p className="text-2xl md:text-3xl font-black text-white font-outfit drop-shadow">{currentCard.meaning}</p>
                  </div>
                  <div className="pt-3 border-t border-white/10 space-y-1.5">
                    <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block">Ví dụ câu Tiếng Anh:</span>
                    <p className="text-base text-amber-200 font-bold italic">"{currentCard.example}"</p>
                    <p className="text-xs text-gray-300 font-semibold pt-0.5">➔ Dịch: "{currentCard.exampleVi}"</p>
                  </div>
                </div>
              )}

              <div className="text-center text-xs text-gray-400 font-semibold pt-3 border-t border-white/5 z-10">
                {isFlipped ? '👇 Bấm vào nút bên dưới để chọn chất lượng ghi nhớ:' : '💡 Bấm vào giữa thẻ để xem nghĩa tiếng Việt &amp; ví dụ minh họa'}
              </div>
            </div>

            {/* SM-2 Rating Controls (0 to 5) */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-extrabold text-gray-300 uppercase tracking-wider block">
                Đánh giá chất lượng ghi nhớ từ vựng:
              </span>
              
              {sm2Feedback ? (
                <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-sm font-extrabold text-center animate-fade-in shadow-lg">
                  {sm2Feedback}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => handleSM2Rating(1)}
                    className="p-4 rounded-2xl bg-gradient-to-b from-rose-500/20 to-rose-600/30 hover:from-rose-500/30 hover:to-rose-600/40 border border-rose-500/40 text-rose-300 text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer shadow-md"
                  >
                    <span className="text-sm font-black">Chưa nhớ (1)</span>
                    <span className="text-[11px] text-rose-300 font-medium">Ôn lại sau 1 ngày</span>
                  </button>
                  <button
                    onClick={() => handleSM2Rating(3)}
                    className="p-4 rounded-2xl bg-gradient-to-b from-amber-500/20 to-orange-600/30 hover:from-amber-500/30 hover:to-orange-600/40 border border-amber-500/40 text-amber-300 text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer shadow-md"
                  >
                    <span className="text-sm font-black">Khó nhớ (3)</span>
                    <span className="text-[11px] text-amber-300 font-medium">Ôn lại sau 3 ngày</span>
                  </button>
                  <button
                    onClick={() => handleSM2Rating(4)}
                    className="p-4 rounded-2xl bg-gradient-to-b from-indigo-500/20 to-purple-600/30 hover:from-indigo-500/30 hover:to-purple-600/40 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer shadow-md"
                  >
                    <span className="text-sm font-black">Nhớ rõ (4)</span>
                    <span className="text-[11px] text-indigo-300 font-medium">Ôn lại sau 6 ngày</span>
                  </button>
                  <button
                    onClick={() => handleSM2Rating(5)}
                    className="p-4 rounded-2xl bg-gradient-to-b from-emerald-500/20 to-teal-600/30 hover:from-emerald-500/30 hover:to-teal-600/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer shadow-md"
                  >
                    <span className="text-sm font-black">Rất dễ (5)</span>
                    <span className="text-[11px] text-emerald-300 font-medium">Ôn lại sau 15 ngày</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Statistics & Word List Side Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: School Branding & Project Info */}
          <div className="glass-card rounded-3xl p-6 border border-indigo-500/20 space-y-3 bg-gradient-to-br from-[#0c1024] to-[#080b1a] relative overflow-hidden shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block">Đơn vị Nghiên cứu</span>
                <h4 className="text-sm font-black text-white">THPT NGUYỄN KHUYẾN</h4>
                <p className="text-[11px] text-gray-400">Bà Rịa - Vũng Tàu</p>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed pt-1 border-t border-white/5">
              Hệ thống thẻ ghi nhớ thông minh giúp học sinh học từ vựng hiệu quả dài hạn.
            </p>
          </div>

          {/* Card 2: Memory Progress Status */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4 shadow-xl">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Chỉ số Học tập Từ vựng</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <span className="text-gray-400 font-semibold">Lịch ôn tập tiếp theo:</span>
                <span className="font-black text-amber-400 text-sm">Sau {nextInterval} ngày</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <span className="text-gray-400 font-semibold">Độ bền ghi nhớ:</span>
                <span className="font-black text-indigo-400 text-sm">{Math.round((ef / 3.0) * 100)}%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <span className="text-gray-400 font-semibold">Số lần lặp từ:</span>
                <span className="font-black text-emerald-400 text-sm">{repetitionCount} lần</span>
              </div>
            </div>
          </div>

          {/* Card 3: Sample Word List in Grade */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-3 shadow-xl">
            <h4 className="font-extrabold text-sm text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Từ vựng Lớp {selectedGrade} ({activeGradeCards.length} từ)</span>
              </span>
            </h4>

            <div className="space-y-2">
              {activeGradeCards.map((card, idx) => (
                <div 
                  key={card.id}
                  onClick={() => { setCardIndex(idx); setIsFlipped(false); }}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer transition flex items-center justify-between ${
                    idx === cardIndex % activeGradeCards.length
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold shadow-md'
                      : 'bg-white/[0.02] border-white/5 text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-white block text-sm">{card.word}</span>
                    <span className="text-[10px] text-gray-400 font-medium block">{card.pos || 'Từ vựng'}</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {card.ipa}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
