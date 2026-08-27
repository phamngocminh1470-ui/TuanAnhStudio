import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Sparkles, ArrowRight, Zap, BookOpen, 
  BrainCircuit, ShieldCheck, CheckCircle2, Award, Clock, 
  Layers, ChevronRight, Mic, Bot, FileText, Activity,
  Star, Users, TrendingUp, Target, Headphones, PenLine, Compass, Check, HelpCircle, 
  Search, Flame, ChevronDown, CheckCheck, BarChart3, MessageSquare, Play, Sparkle
} from 'lucide-react';
import { OFFICIAL_EXAM_LIST } from '../data/officialExamsData';
import InteractiveMarqueeBanner from './InteractiveMarqueeBanner';

function useCountUp(end, duration = 1500, start = 0) {
  const [count, setCount] = useState(start);
  useEffect(() => {
    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * (end - start) + start));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, start]);
  return count;
}

function StatCounter({ value, label, suffix = '', prefix = '', color = 'text-emerald-400', desc }) {
  const count = useCountUp(value, 1400);
  return (
    <div className="text-center space-y-2 p-6 rounded-3xl bg-[#090e21]/70 border border-white/10 shadow-xl backdrop-blur-xl hover:border-white/20 transition-all group">
      <div className={`text-3xl md:text-5xl font-black font-outfit tracking-tight ${color} group-hover:scale-105 transition-transform`}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs text-white font-extrabold uppercase tracking-wider">{label}</div>
      {desc && <p className="text-[11px] text-gray-400 font-medium leading-tight">{desc}</p>}
    </div>
  );
}

export default function GuestLandingPage({ onOpenAuth, onStartTrial, selectedGrade, onGradeChange }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activePreviewTab, setActivePreviewTab] = useState('irt');
  const [openFaq, setOpenFaq] = useState(null);

  const gradeList = [
    { id: '10', label: 'Khối Lớp 10' },
    { id: '11', label: 'Khối Lớp 11' },
    { id: '12', label: 'Khối Lớp 12' }
  ];

  const filteredExams = OFFICIAL_EXAM_LIST.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  }).slice(0, 6); // Giới hạn 6 đề tiêu biểu để thoáng đẹp, có nút xem thêm

  const previewTabs = [
    {
      id: 'irt',
      label: '⚡ Luyện Đề Thích Ứng IRT',
      badge: 'Thuật toán 2PL IRT',
      title: 'Tự động tăng giảm độ khó theo năng lực thực tế',
      desc: 'Mô hình Toán học Đo lường Giáo dục 2PL IRT tự động ước lượng năng lực Theta (θ) sau từng câu trả lời. Học sinh làm đúng câu dễ sẽ được nâng lên câu phân hóa cao, làm sai sẽ được đưa về củng cố kiến thức nền tảng.',
      features: [
        'Độ khó câu hỏi tăng giảm theo thời gian thực',
        'Phân tích chi tiết từng bẫy câu hỏi trong đề thi',
        'Bám sát chuẩn định dạng cấu trúc Đổi mới 2025 của Bộ GD&ĐT'
      ],
      mockupBg: 'from-blue-600/20 to-indigo-600/10',
      tabAction: 'irt-test'
    },
    {
      id: 'socrates',
      label: '🤖 Gia Sư Gợi Mở Socrates',
      badge: 'Socratic AI Tutor',
      title: 'Đàm thoại 1:1, gợi mở tư duy thay vì mớm đáp án',
      desc: 'Áp dụng phương pháp sư phạm Socrates danh tiếng: Trợ lý AI không đưa ra lời giải thô mà đặt câu hỏi gợi mở từng bước, giúp học sinh tự phát hiện lỗ hổng ngữ pháp và rèn luyện tư duy phản biện.',
      features: [
        'Hỏi đáp 24/7 không giới hạn mọi bài tập tiếng Anh',
        'Giải thích cặn kẽ ngữ pháp, từ vựng và mẹo làm bài',
        'Chẩn đoán chính xác nguyên nhân dẫn đến chọn sai đáp án'
      ],
      mockupBg: 'from-amber-600/20 to-orange-600/10',
      tabAction: 'chat'
    },
    {
      id: 'ipa',
      label: '🎙️ Radar Phát Âm 44 Âm IPA',
      badge: 'Speech Recognition AI',
      desc: 'Phân tích sóng âm micro, bóc tách chính xác từng phụ âm cuối (/s/, /t/, /d/), nguyên âm và ngữ điệu câu với độ chuẩn xác cao.',
      features: [
        'Bôi màu trực quan: Xanh (chuẩn xác) - Đỏ (cần sửa)',
        'Hướng dẫn khẩu hình miệng và vị trí đặt lưỡi cho 44 âm quốc tế',
        'Luyện đọc câu giao tiếp tự nhiên chuẩn người bản xứ'
      ],
      mockupBg: 'from-emerald-600/20 to-teal-600/10',
      tabAction: 'pronounce'
    },
    {
      id: 'sm2',
      label: '🧠 Thẻ Não Bộ SM-2',
      badge: 'Spaced Repetition',
      desc: 'Thuật toán SuperMemo-2 tính toán chính xác chu kỳ quên lãng của não bộ để nhắc ôn lại từ vựng đúng thời điểm vàng trước khi bị quên.',
      features: [
        'Ghi nhớ dài hạn hơn 1.250+ từ vựng SGK cốt lõi',
        'Đầy đủ phiên âm IPA, dịch nghĩa và câu ví dụ ngữ cảnh',
        'Tự động tăng chu kỳ ngắt quãng với các từ đã thuộc nhuần nhuyễn'
      ],
      mockupBg: 'from-purple-600/20 to-violet-600/10',
      tabAction: 'sm2-flashcards'
    },
    {
      id: 'teacher',
      label: '📑 Cổng Giáo Viên & Xáo Đề',
      badge: 'Teacher Hub 4.0',
      title: 'Tự động xáo đề thi 101-104 & Quản lý lớp học thông minh',
      desc: 'Giáo viên chỉ cần dán 1 đề gốc, hệ thống tự động đảo ngẫu nhiên câu hỏi và đáp án để tạo ra 2, 4, 6 hoặc 8 mã đề riêng biệt kèm Bảng ma trận đáp án tổng hợp đối chiếu tức thì.',
      features: [
        'Xáo đề thi trắc nghiệm tạo 4 mã đề (101, 102, 103, 104) trong 1 giây',
        'Tạo mã lớp học (Class Code) để học sinh tự đăng ký và nộp bài',
        'Tạo thử thách từ vựng tuần theo Topic kết hợp AI chấm điểm ngữ pháp'
      ],
      mockupBg: 'from-amber-600/20 to-orange-600/10',
      tabAction: 'teacher-portal'
    }
  ];

  const currentPreview = previewTabs.find(t => t.id === activePreviewTab) || previewTabs[0];

  const faqs = [
    {
      q: 'Hệ thống AI English Mentor có hoàn toàn miễn phí không?',
      a: 'Hoàn toàn miễn phí 100%! Đây là công trình đề tài nghiên cứu Khoa học Kỹ thuật (KHKT) được phát triển phi lợi nhuận nhằm hỗ trợ học sinh cả nước tiếp cận nền tảng học tập thích ứng cá nhân hóa chất lượng cao.'
    },
    {
      q: 'Mô hình thích ứng IRT (Item Response Theory) hoạt động như thế nào?',
      a: 'Khác với các bài kiểm tra truyền thống (ai cũng làm đề giống nhau), mô hình 2PL IRT sẽ tự động tính toán năng lực hiện tại của bạn. Nếu bạn trả lời đúng, hệ thống sẽ tăng độ khó câu tiếp theo; nếu trả lời sai, hệ thống sẽ đưa ra câu hỏi cơ bản để chẩn đoán chính xác lỗ hổng kiến thức.'
    },
    {
      q: 'Tôi có thể sử dụng hệ thống trên điện thoại di động được không?',
      a: 'Hệ thống được tối ưu hóa hiển thị responsive 100% trên điện thoại thông minh, máy tính bảng và máy tính để bàn. Bạn có thể luyện tập mọi lúc mọi nơi chỉ cần có kết nối Internet.'
    },
    {
      q: 'Hệ thống có bám sát chương trình Giáo dục Phổ thông mới (GDPT 2018) không?',
      a: 'Toàn bộ ngân hàng câu hỏi, từ vựng theo Unit và các đề thi đều được biên soạn bám sát cấu trúc đề thi tốt nghiệp THPT đổi mới của Bộ Giáo dục & Đào tạo.'
    }
  ];

  return (
    <div className="w-full pb-32 max-w-[1500px] mx-auto px-4 sm:px-6 md:px-10 space-y-28 md:space-y-36 animate-fade-in">

      {/* ═══════════════════════════════════════════
          SECTION 01: HERO SHOWCASE (THOÁNG ĐÃNG, ẤN TƯỢNG)
      ═══════════════════════════════════════════ */}
      <section className="relative pt-12 md:pt-20 pb-8 text-center space-y-10 overflow-hidden">
        
        {/* Glowing Aurora Ambience */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] pointer-events-none -z-10">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px]" />
          <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
        </div>

        {/* National Science Fair Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/[0.04] border border-white/15 shadow-2xl backdrop-blur-xl hover:border-emerald-500/40 transition-colors">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
          <span className="text-emerald-300 text-xs md:text-sm font-mono font-extrabold tracking-wider uppercase">
            ĐỀ TÀI KHOA HỌC KỸ THUẬT QUỐC GIA • NỀN TẢNG GIA SƯ AI THÍCH ỨNG THPT
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-6 max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.08] font-outfit">
            Học đúng trọng tâm. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
              Bứt phá điểm 9+ Tiếng Anh THPT.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Ứng dụng mô hình toán học <strong className="text-white">2PL IRT</strong> và thuật toán <strong className="text-white">Spaced Repetition SM-2</strong>. 
            Tự động chẩn đoán chính xác lỗ hổng kiến thức và cá nhân hóa lộ trình học tập theo thời gian thực.
          </p>
        </div>

        {/* Grade Selector */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Khối lớp của bạn:</span>
          <div className="flex items-center p-1.5 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xl">
            {gradeList.map((g) => (
              <button
                key={g.id}
                onClick={() => onGradeChange(g.id)}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  selectedGrade === g.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-5 pt-4">
          <button
            onClick={onOpenAuth}
            className="px-9 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-sm md:text-base transition-all cursor-pointer shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-black" />
            <span>Bắt Đầu Học Ngay (Miễn Phí)</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => onStartTrial('irt-test')}
            className="px-8 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 hover:border-white/30 text-white font-extrabold text-sm md:text-base transition-all flex items-center gap-2.5 cursor-pointer backdrop-blur-xl hover:scale-105"
          >
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Luyện Đề Thử — Không Cần Đăng Nhập</span>
          </button>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto pt-8">
          <StatCounter value={1250} label="Từ vựng SGK" suffix="+" color="text-cyan-400" desc="Đầy đủ IPA, nghĩa & câu ví dụ" />
          <StatCounter value={500} label="Câu hỏi định chuẩn IRT" suffix="+" color="text-purple-400" desc="Cấu trúc Đổi mới 2025" />
          <StatCounter value={51} label="Tiết kiệm thời gian" suffix="%" color="text-emerald-400" desc="Nhờ tập trung đúng điểm yếu" />
          <StatCounter value={100} label="Hoàn toàn Miễn phí" suffix="%" color="text-amber-400" desc="Phục vụ học sinh cả nước" />
        </div>

      </section>

      {/* DẢI BĂNG CHUYỀN CHẠY NGANG VÔ TẬN */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-mono font-bold text-indigo-400 tracking-widest uppercase">
            HỆ SINH THÁI TÍNH NĂNG AI CHUYỂN ĐỘNG
          </span>
          <h2 className="text-lg md:text-xl font-bold text-white">Chạm vào tính năng bất kỳ để khám phá ngay</h2>
        </div>
        <InteractiveMarqueeBanner 
          onNavigate={(tab) => onStartTrial ? onStartTrial(tab) : (onOpenAuth && onOpenAuth())} 
          onOpenPhotoSolver={() => onOpenAuth ? onOpenAuth() : null} 
        />
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 02: INTERACTIVE PRODUCT SIMULATOR (MÔ PHỎNG TƯƠNG TÁC)
      ═══════════════════════════════════════════ */}
      <section className="space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            02 • TRẢI NGHIỆM TƯƠNG TÁC SỐNG ĐỘNG
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-outfit tracking-tight">
            Khám phá 4 Kỹ năng AI Đột phá
          </h2>
          <p className="text-sm md:text-base text-gray-400">
            Trải nghiệm cách công nghệ AI giúp bạn bứt phá năng lực tiếng Anh nhanh gấp 3 lần phương pháp truyền thống.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {previewTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePreviewTab(tab.id)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer border ${
                activePreviewTab === tab.id
                  ? 'bg-white text-black border-white shadow-xl shadow-white/10 scale-105'
                  : 'bg-[#090e21]/80 text-gray-400 border-white/10 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Display Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/15 shadow-2xl bg-gradient-to-br from-[#0c1228] to-[#060a17] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {currentPreview.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-outfit leading-snug">
                {currentPreview.title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {currentPreview.desc}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {currentPreview.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => onStartTrial(currentPreview.tabAction)}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-indigo-600/30 flex items-center gap-2 hover:scale-105"
              >
                <span>Trải nghiệm ngay tính năng này</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Mockup Panel */}
          <div className="lg:col-span-6 rounded-2xl bg-[#070b19] border border-white/10 p-5 sm:p-7 shadow-inner space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-gray-400 ml-2 font-bold">Live AI Engine Simulation</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ACTIVE 60FPS
              </span>
            </div>

            {/* Visual simulation content */}
            {activePreviewTab === 'irt' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-bold">Năng lực Theta ước lượng:</span>
                    <span className="text-emerald-400 font-black font-mono">θ = +1.45 (Khá Giỏi)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 w-[78%] rounded-full" />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
                  ⚡ <strong>Hệ thống tự động:</strong> Bạn vừa trả lời đúng câu phân hóa cao về Mệnh đề quan hệ rút gọn. Câu tiếp theo sẽ được nâng độ khó lên mức Vận dụng cao!
                </div>
              </div>
            )}

            {activePreviewTab === 'socrates' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-blue-600/20 text-blue-200 border border-blue-500/30">
                  👤 <strong>Học sinh:</strong> Tại sao câu này chọn 'had gone' mà không chọn 'went' vậy ạ?
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-200 border border-emerald-500/30">
                  🤖 <strong>Gia sư Socrates:</strong> Em hãy nhìn vào mốc thời gian <em>'before she arrived'</em>. Hành động đi diễn ra trước hay sau khi cô ấy đến nơi nào?
                </div>
              </div>
            )}

            {activePreviewTab === 'ipa' && (
              <div className="space-y-4 text-center py-2">
                <div className="text-2xl font-black text-white font-outfit">
                  "She speaks English <span className="text-emerald-400">flawlessly</span>."
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs border border-emerald-500/30">/ˈflɔː.ləs.li/</span>
                  <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-bold">Độ chuẩn: 98%</span>
                </div>
                <div className="text-[11px] text-gray-400">Âm đuôi /s/ và nguyên âm /ɔː/ được phát âm rất rõ ràng!</div>
              </div>
            )}

            {activePreviewTab === 'sm2' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-black text-white">perseverance</div>
                    <div className="text-xs text-gray-400">sự kiên trì, bền bỉ vượt khó</div>
                  </div>
                  <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                    Ôn lại sau 6 ngày
                  </span>
                </div>
                <div className="text-[11px] text-gray-400 text-center">Đã lưu vào bộ nhớ dài hạn qua 4 chu kỳ lặp lại ngắt quãng</div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 03: LỘ TRÌNH 3 BƯỚC BỨT PHÁ (HOW IT WORKS)
      ═══════════════════════════════════════════ */}
      <section className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            03 • LỘ TRÌNH HỌC TẬP THÔNG MINH
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-outfit tracking-tight">
            3 Bước Chinh Phục Điểm 9+ THPT
          </h2>
          <p className="text-sm md:text-base text-gray-400">
            Phương pháp học tập khoa học loại bỏ hoàn toàn việc học vẹt và luyện đề lan man.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-5 relative group hover:border-blue-500/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30">
              01
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white font-outfit">Chẩn Đoán Năng Lực Ban Đầu</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Làm bài kiểm tra thích ứng ngắn 10-15 phút. Thuật toán IRT tự động vẽ bản đồ năng lực từng chuyên đề: Thì, Câu bị động, Đọc hiểu, Từ vựng.
              </p>
            </div>
            <div className="text-xs font-bold text-blue-400">✓ Xác định chính xác điểm yếu</div>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-5 relative group hover:border-emerald-500/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/30">
              02
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white font-outfit">Luyện Tập Cá Nhân Hóa</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Hệ thống tập trung 100% thời gian vào các phần bạn còn yếu. Gia sư Socrates đồng hành giải thích từng câu hỏi đến khi bạn hiểu sâu.
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-400">✓ Tiết kiệm 50% thời gian ôn luyện</div>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-5 relative group hover:border-purple-500/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-500/30">
              03
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white font-outfit">Bứt Phá Điểm Thi THPT</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Thực chiến với kho đề thi chính thức từ các Sở GD. Tự tin bước vào phòng thi THPT Quốc gia với nền tảng kiến thức vững chắc.
              </p>
            </div>
            <div className="text-xs font-bold text-purple-400">✓ Đạt mục tiêu điểm 9+ mong muốn</div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 04: KHO ĐỀ TIÊU CHUẨN THOÁNG ĐẸP (GRID THẺ 3D)
      ═══════════════════════════════════════════ */}
      <section className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase">
              04 • KHO ĐỀ CHUẨN HÓA BỘ GD&amp;ĐT
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white font-outfit">
              Đề thi thật, Lời giải thật
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">Tuyển tập đề thi chính thức bám sát cấu trúc đề thi đổi mới 2025-2027.</p>
          </div>

          {/* Filter Categories */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'thpt', label: 'Đề THPT' },
              { id: 'chuyen', label: 'Trường Chuyên' },
              { id: 'dgnl', label: 'ĐGNL (HSA/TSA)' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 border ${
                  selectedCategory === cat.id
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Thẻ Đề Thi 3D Thoáng Đãng (Không bị dày đặc chữ) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              onClick={() => onStartTrial('official-exams')}
              className="glass-card rounded-3xl p-6 border border-white/10 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer group shadow-xl flex flex-col justify-between space-y-4 hover:-translate-y-1 bg-gradient-to-b from-[#0a0f24] to-[#060a18]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${exam.typeColor}`}>
                    {exam.type}
                  </span>
                  <span className="text-[11px] font-mono text-gray-500">{exam.date}</span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
                  {exam.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2">{exam.subtitle}</p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                <div className="text-gray-400 font-medium">
                  <span>{exam.questionsCount} câu • {exam.time} phút</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-extrabold group-hover:translate-x-1 transition-transform">
                  <span>Vào thi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => onStartTrial('official-exams')}
            className="px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Xem toàn bộ kho đề thi tuyển chọn</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 05: SO SÁNH TRUYỀN THỐNG VS HỆ THỐNG AI
      ═══════════════════════════════════════════ */}
      <section className="space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold text-purple-400 tracking-widest uppercase px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
            05 • ĐỘT PHÁ CÔNG NGHỆ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-outfit tracking-tight">
            Tại Sao Chọn AI English Mentor?
          </h2>
          <p className="text-sm md:text-base text-gray-400">
            So sánh trực quan giữa phương pháp học truyền thống và hệ sinh thái học tập thích ứng thông minh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Traditional */}
          <div className="p-8 rounded-3xl bg-rose-950/10 border border-rose-500/20 space-y-5">
            <h3 className="text-lg font-bold text-rose-400 font-outfit flex items-center gap-2">
              <span>✕</span> Phương Pháp Truyền Thống
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Luyện đề cố định cào bằng, làm câu quá dễ gây chán hoặc quá khó gây nản.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Học thuộc từ vựng thụ động, quên sạch 80% sau 3 ngày không ôn luyện.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Làm bài sai chỉ xem đáp án A/B/C/D mà không biết vì sao sai và cách khắc phục.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Không có người sửa phát âm và chấm bài viết luận chi tiết từng câu.</span>
              </li>
            </ul>
          </div>

          {/* AI English Mentor */}
          <div className="p-8 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 space-y-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-lg font-bold text-emerald-400 font-outfit flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" /> Hệ Thống AI English Mentor
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-200">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Thích ứng 2PL IRT:</strong> Tự động điều chỉnh độ khó đúng tầm năng lực.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Não bộ SM-2:</strong> Nhắc ôn từ vựng đúng thời điểm vàng để nhớ vĩnh viễn.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Gia sư Socrates 1:1:</strong> Gợi mở tư duy, giải thích sâu từng bẫy câu hỏi.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Speech &amp; Writing AI:</strong> Chấm 44 âm IPA và sửa lỗi viết từng câu chi tiết.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 06: FAQ CÂU HỎI THƯỜNG GẶP
      ═══════════════════════════════════════════ */}
      <section className="space-y-10 max-w-4xl mx-auto">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-amber-400 tracking-widest uppercase px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            06 • GIẢI ĐÁP THẮC MẮC
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-outfit">
            Câu Hỏi Thường Gặp
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="p-6 rounded-2xl bg-[#090e21]/80 border border-white/10 hover:border-white/20 transition-all cursor-pointer select-none space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-white">{faq.q}</h3>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openFaq === idx ? 'rotate-180 text-emerald-400' : ''}`} />
              </div>
              {openFaq === idx && (
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-2 border-t border-white/5 animate-fade-in">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 07: BOTTOM CTA BANNER
      ═══════════════════════════════════════════ */}
      <section className="p-10 md:p-16 rounded-3xl border border-white/15 text-center space-y-8 bg-gradient-to-tr from-[#0b132e] via-[#0e1b3d] to-[#080e22] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-emerald-500/10 to-purple-600/10 blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit tracking-tight leading-tight">
            Sẵn sàng bứt phá điểm số Tiếng Anh THPT?
          </h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Gia nhập cùng hàng ngàn học sinh cả nước đang trải nghiệm phương pháp học tập thích ứng thông minh hoàn toàn miễn phí.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 relative z-10 pt-2">
          <button
            onClick={onOpenAuth}
            className="px-9 py-4 rounded-2xl bg-white text-black hover:bg-slate-200 font-black text-sm md:text-base transition-all cursor-pointer shadow-xl hover:scale-105 flex items-center gap-2.5"
          >
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Tạo Tài Khoản &amp; Bắt Đầu Ngay</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

    </div>
  );
}
