import React, { useState } from 'react';
import { 
  Sparkles, Zap, BookOpen, Headphones, Trophy, 
  ChevronDown, ChevronRight, Clock, Award, Compass, 
  BrainCircuit, FileText, CheckCircle2, Flame, ArrowRight,
  Target, GraduationCap, Layers, Bot, Mic, PenLine, Database,
  Download, Camera, Eye, Lock, RefreshCw, BarChart3
} from 'lucide-react';

export default function LearningHub({
  selectedGrade,
  onGradeChange,
  onNavigate,
  currentUser,
  serverStats,
  onOpenPhotoSolver
}) {
  const [openTrack, setOpenTrack] = useState(0);
  const isC3 = parseInt(selectedGrade) >= 10;

  // Dynamic tracks based on C3 (THPT) or C2 (THCS)
  const examTracks = isC3 ? [
    {
      id: 'thpt2027',
      num: '01',
      tag: 'KỲ THI TỐT NGHIỆP THPT QUỐC GIA',
      title: 'Đề Thi & Học Liệu Chuẩn THPT 2027',
      desc: 'Mỗi môn • Quiz • AI riêng • Sách SGK Global Success & Friends Global Lớp 10-11-12',
      items: [
        {
          id: 'thpt-mock',
          title: 'Đề thi thử THPT Quốc Gia Chuẩn Cấu Trúc',
          desc: '50 câu trắc nghiệm đa năng: Đọc điền, Đọc hiểu, Ngữ pháp, Viết lại câu',
          badge: 'Đề Chuẩn Bộ GD',
          badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
          count: '480 câu',
          action: () => onNavigate('official-exams'),
          icon: FileText
        },
        {
          id: 'reading-adaptive',
          title: 'Luyện đọc hiểu theo chủ đề SGK Mới',
          desc: 'Đoạn văn thích ứng AI theo sở thích: Công nghệ, Môi trường, Văn hóa, Khoa học',
          badge: 'AI Adaptive',
          badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          count: '12 Units',
          action: () => onNavigate('reading'),
          icon: BookOpen
        },
        {
          id: 'listening-adaptive',
          title: 'Luyện nghe thích ứng & Ngữ điệu bản xứ',
          desc: 'Bài nghe phân tầng độ khó, tự động sinh câu hỏi kiểm tra khả năng bắt từ khóa',
          badge: 'Interactive Audio',
          badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
          count: '36 Bài nghe',
          action: () => onNavigate('listening'),
          icon: Headphones
        },
        {
          id: 'vocab-sm2',
          title: 'Ghi nhớ từ vựng THPT siêu tốc (SM-2)',
          desc: 'Spaced Repetition tự động nhắc lại từ vựng đúng thời điểm trước khi quên',
          badge: 'Khoa học Não bộ',
          badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          count: '1,250 Từ',
          action: () => onNavigate('sm2-flashcards'),
          icon: BrainCircuit
        }
      ]
    },
    {
      id: 'dgnl',
      num: '02',
      tag: 'HSA • V-ACT • TSA • SƯ PHẠM • CÔNG AN',
      title: 'ĐGNL & Đánh Giá Tư Duy',
      desc: 'ĐHQG Hà Nội • ĐHQG-HCM • Bách Khoa HN • HNUE • HCMUE • Bộ Công an',
      items: [
        {
          id: 'dgnl-reading',
          title: 'Đọc hiểu suy luận & Phân tích ngữ cảnh',
          desc: 'Dạng bài suy luận ý tác giả, tìm thông tin ngầm định, phân tích lập luận',
          badge: 'Vận dụng cao',
          badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
          count: '24 Chuyên đề',
          action: () => onNavigate('reading'),
          icon: FileText
        },
        {
          id: 'writing-logic',
          title: 'Luyện viết & Biến đổi cấu trúc câu',
          desc: 'Chữa lỗi ngữ pháp và gợi ý nâng cấp từ vựng C1/C2 bằng AI',
          badge: 'AI Chữa bài',
          badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
          count: 'Không giới hạn',
          action: () => onNavigate('writing-practice'),
          icon: PenLine
        },
        {
          id: 'socrates-ai',
          title: 'Socrates AI Tutor - Gia sư gợi mở',
          desc: 'Hướng dẫn giải chi tiết từng bước, gợi mở phương pháp suy luận',
          badge: 'Socratic Method',
          badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          count: '24/7 Tương tác',
          action: () => onNavigate('chat'),
          icon: Sparkles
        }
      ]
    },
    {
      id: 'ielts-skills',
      num: '03',
      tag: 'LUYỆN THI 4 KỸ NĂNG & CHUẨN QUỐC TẾ',
      title: 'IELTS & Kỹ Năng Ngôn Ngữ Toàn Diện',
      desc: 'Listening • Reading • Writing • Speaking • LIVE AI Examiner',
      items: [
        {
          id: 'ielts-hub',
          title: 'Luyện 4 Kỹ Năng Chuẩn KNLNNVN',
          desc: 'Bài tập phân bậc B1 - B2 - C1 theo khung năng lực quốc tế',
          badge: 'IELTS Hub',
          badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
          count: '4 Kỹ năng',
          action: () => onNavigate('reading'),
          icon: BookOpen
        },
        {
          id: 'pronounce-ai',
          title: 'Chấm điểm phát âm & Nhận diện lỗi IPA',
          desc: 'Phân tích sóng âm nhận diện chính xác từng phụ âm cuối, nguyên âm đôi, trọng âm',
          badge: 'Azure Speech AI',
          badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          count: '44 Âm IPA + Câu',
          action: () => onNavigate('pronounce'),
          icon: Mic
        },
        {
          id: 'chat-mentor',
          title: 'Hội thoại trực tiếp với Gia sư AI 1:1',
          desc: 'Giải thích ngữ pháp sâu, giải đáp bài tập trên lớp 24/7',
          badge: 'Gemini / Groq',
          badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
          count: '24/7 Sẵn sàng',
          action: () => onNavigate('chat'),
          icon: Bot
        }
      ]
    },
    {
      id: 'tools-more',
      num: '04',
      tag: 'TIỆN ÍCH & HỌC LIỆU NGHIÊN CỨU',
      title: 'Kho Từ Vựng & Báo Cáo Năng Lực',
      desc: 'Tra cứu từ vựng SGK Mới • Báo cáo năng lực tâm trắc học IRT',
      items: [
        {
          id: 'vocab-lib',
          title: 'Kho Từ Vựng Toàn Diện Theo Sách SGK',
          desc: 'Học từ vựng theo Unit SGK Lớp 10, 11, 12 kèm phát âm mẫu và ví dụ',
          badge: 'SGK Mới',
          badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          count: '1,500+ Từ vựng',
          action: () => onNavigate('vocab-library'),
          icon: BookOpen
        },
        {
          id: 'official-exams-repo',
          title: 'Kho Đề Chuẩn Hóa Đa Tỉnh Thành',
          desc: 'Bộ đề thi chính thức Hà Nội, TP.HCM, Nghệ An, Nam Định có đáp án chi tiết',
          badge: 'Đề Các Tỉnh',
          badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
          count: 'Đề chuẩn',
          action: () => onNavigate('official-exams'),
          icon: FileText
        },
        {
          id: 'analytics-rep',
          title: 'Báo Cáo Năng Lực & Dự Báo Điểm',
          desc: 'Bản đồ Radar phân tích điểm mạnh, điểm yếu và xuất báo cáo học tập PDF',
          badge: 'Báo Cáo Năng Lực',
          badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
          count: 'Phân tích sâu',
          action: () => onNavigate('analytics'),
          icon: BarChart3
        }
      ]
    }
  ] : [
    {
      id: 'thcs-grade9',
      num: '01',
      tag: 'TUYỂN SINH VÀO LỚP 10 • THCS',
      title: 'Lộ Trình Bứt Phá Điểm 9+ Tuyển Sinh Vào 10',
      desc: 'Kho đề tuyển sinh 63 tỉnh thành • Ngữ pháp trọng tâm • 800 từ vựng cốt lõi',
      items: [
        {
          id: 'thcs-official-exams',
          title: 'Kho Đề Thi Vào 10 Các Tỉnh Thành',
          desc: 'Đề thi chính thức Hà Nội, TP.HCM, Đà Nẵng, Nghệ An có giải thích chi tiết',
          badge: 'Đề Tuyển Sinh',
          badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
          count: '63 Tỉnh Thành',
          action: () => onNavigate('official-exams'),
          icon: FileText
        },
        {
          id: 'thcs-test',
          title: 'Thi Thử Vào 10 Thích Ứng AI',
          desc: '40 câu trắc nghiệm chuẩn cấu trúc tuyển sinh THPT công lập',
          badge: 'Đề Thi Thử',
          badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          count: '40 Câu/đề',
          action: () => onNavigate('irt-test'),
          icon: Zap
        },
        {
          id: 'thcs-vocab',
          title: 'Từ Vựng Căn Bản Não Bộ (SM-2 A1-A2)',
          desc: '800 từ vựng cốt lõi thường xuất hiện trong đề thi tuyển sinh vào 10',
          badge: 'Trí Nhớ Não Bộ',
          badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          count: '800 Từ',
          action: () => onNavigate('sm2-flashcards'),
          icon: BrainCircuit
        }
      ]
    },
    {
      id: 'thcs-grammar',
      num: '02',
      tag: 'NỀN TẢNG NGỮ ÂM IPA & NGỮ PHÁP',
      title: 'Bứt Phá Nền Tảng Ngữ Pháp & IPA Cấp 2',
      desc: '12 thì cơ bản • Mệnh đề quan hệ • Câu điều kiện • Phát âm chuẩn 44 âm',
      items: [
        {
          id: 'ipa-practice',
          title: 'Luyện Phát Âm Chuẩn 44 Âm IPA',
          desc: 'Azure Speech AI chấm điểm phát âm từng nguyên âm, phụ âm và trọng âm từ',
          badge: 'Azure Speech',
          badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          count: '44 Âm IPA',
          action: () => onNavigate('pronounce'),
          icon: Mic
        },
        {
          id: 'sentence-write',
          title: 'Luyện Viết Lại Câu & Sửa Lỗi Ngữ Pháp',
          desc: 'Dạng bài viết lại câu không đổi nghĩa xuất hiện trong 100% đề thi vào 10',
          badge: 'AI Chữa bài',
          badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
          count: 'Không giới hạn',
          action: () => onNavigate('writing-practice'),
          icon: PenLine
        },
        {
          id: 'chat-tutor-thcs',
          title: 'Gia Sư AI Giải Bài Tập Về Nhà 1:1',
          desc: 'Hỏi đáp ngữ pháp bài học trên lớp nhẹ nhàng, dễ hiểu cho học sinh cấp 2',
          badge: 'AI Gia Sư',
          badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
          count: '24/7 Sẵn sàng',
          action: () => onNavigate('chat'),
          icon: Bot
        }
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-6xl mx-auto">
      
      {/* ─── 1. HERO BANNER WITH LUXURY GLASSMORPHISM & COUNTDOWN ─────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0e1630] via-[#0a0f22] to-[#060914] border border-white/10 p-8 md:p-10 shadow-2xl">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Hero Text */}
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-black px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 uppercase tracking-wider shadow-sm">
                {isC3 ? 'KỲ THI THPT QG • 2027' : 'KỲ THI TUYỂN SINH VÀO LỚP 10 • THCS'}
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                100% Miễn Phí
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-outfit">
              {isC3 ? (
                <>Chinh phục <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">điểm 10</span> cùng AI Gia Sư riêng.</>
              ) : (
                <>Bứt phá <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">điểm 9+</span> vào lớp 10 cùng AI Gia Sư.</>
              )}
            </h1>

            <p className="text-xs md:text-sm text-slate-300 font-normal leading-relaxed">
              Chào <strong className="text-white font-bold">{currentUser?.fullname || currentUser?.username || 'Học sinh'}</strong>, AI Mentor đồng hành 24/7 — {isC3 ? 'chấm bài, giải đề, phân tích lỗi và dự đoán điểm thi THPT theo mô hình tâm trắc học IRT chuẩn mực.' : 'xây dựng nền tảng ngữ pháp, phát âm chuẩn 44 âm IPA và luyện đề thi thử vào lớp 10.'}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => onNavigate('chat')}
                className="btn-primary px-6 py-3.5 text-xs md:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-xl shadow-blue-500/25"
              >
                <Bot className="w-4 h-4" />
                <span>Hỏi AI Gia Sư ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenPhotoSolver}
                className="px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs md:text-sm font-bold flex items-center gap-2 border border-white/10 transition cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>📸 Chụp Ảnh Giải Đề AI</span>
              </button>
            </div>
          </div>

          {/* Right Hero: Circular Countdown Clock */}
          <div className="shrink-0 flex flex-col items-center justify-center p-6 rounded-3xl bg-[#080d1a]/90 border border-white/10 shadow-2xl relative">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-white/5"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="url(#gradient-ring)"
                  strokeWidth="6"
                  strokeDasharray="264"
                  strokeDashoffset={isC3 ? "75" : "90"}
                  strokeLinecap="round"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="gradient-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-white font-mono tracking-tight">{isC3 ? '312' : '284'}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">DAYS LEFT</span>
                <span className="text-[9px] font-mono text-cyan-400 mt-0.5">{isC3 ? '25.06.2027' : '05.06.2027'}</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-3">
              {isC3 ? 'Đếm ngược THPT 2027' : 'Đếm ngược Vào Lớp 10'}
            </span>
          </div>
        </div>
      </div>

      {/* ─── 2. 4 TRỤ CỘT HỌC TẬP THÍCH ỨNG (AI CORE PILLARS GRID) ─────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-white">Trụ cột Luyện thi Thích ứng AI</h2>
            <p className="text-xs text-slate-400 mt-0.5">Chọn chế độ học thông minh được cá nhân hóa theo tiến độ của bạn</p>
          </div>
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">4 MODULES • TỰ ĐỘNG THÍCH ỨNG</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Luyện đề thích ứng */}
          <div
            onClick={() => onNavigate('irt-test')}
            className="glass-card glass-card-hover p-5 border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl cursor-pointer space-y-3 relative group overflow-hidden bg-[#0c1222]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                THUẬT TOÁN IRT
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-extrabold text-white group-hover:text-emerald-300 transition">
                Luyện Đề Thích Ứng 10 Câu
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Tự động tăng giảm độ khó theo từng câu để xác định đúng năng lực thực.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-white/5">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ~10 phút</span>
              <span className="text-emerald-400 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                Luyện ngay <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Card 2: Từ vựng não bộ SM-2 */}
          <div
            onClick={() => onNavigate('sm2-flashcards')}
            className="glass-card glass-card-hover p-5 border border-amber-500/20 hover:border-amber-500/40 rounded-2xl cursor-pointer space-y-3 relative group overflow-hidden bg-[#0c1222]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                SUPERMEMO-2
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
                <BrainCircuit className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-extrabold text-white group-hover:text-amber-300 transition">
                Trí Nhớ Từ Vựng Não Bộ
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Ghi nhớ sâu từ vựng SGK Mới theo quy luật nhắc lại ngắt quãng.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-white/5">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ~5-8 phút</span>
              <span className="text-amber-400 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                Học từ <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Card 3: Socrates AI Tutor */}
          <div
            onClick={() => onNavigate('chat')}
            className="glass-card glass-card-hover p-5 border border-blue-500/20 hover:border-blue-500/40 rounded-2xl cursor-pointer space-y-3 relative group overflow-hidden bg-[#0c1222]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                GIA SƯ 1:1
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
                <Bot className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-extrabold text-white group-hover:text-blue-300 transition">
                Gia Sư Socratic 1:1
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Gợi mở tư duy từng bước, giải đáp thắc mắc và chỉ ra bẫy đề thi 24/7.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-white/5">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 24/7</span>
              <span className="text-blue-400 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                Hỏi đáp <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Card 4: Chấm phát âm IPA */}
          <div
            onClick={() => onNavigate('pronounce')}
            className="glass-card glass-card-hover p-5 border border-cyan-500/20 hover:border-cyan-500/40 rounded-2xl cursor-pointer space-y-3 relative group overflow-hidden bg-[#0c1222]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AZURE SPEECH AI
              </span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                <Mic className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-extrabold text-white group-hover:text-cyan-300 transition">
                Chấm Phát Âm Chuẩn IPA
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Phân tích sóng âm chuẩn xác từng nguyên âm, phụ âm và ngữ điệu câu.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-white/5">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ~5 phút</span>
              <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                Luyện âm <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. ĐƯỜNG ĐUA KỲ THI (EXAM TRACK ACCORDIONS) ────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-white">Đường đua Kỳ thi &amp; Học liệu</h2>
            <p className="text-xs text-slate-400 mt-0.5">Chọn lộ trình ôn luyện chi tiết theo từng kỳ thi và mục tiêu điểm số</p>
          </div>
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">{examTracks.length} TRACKS • EXPANDABLE</span>
        </div>

        <div className="space-y-3.5">
          {examTracks.map((track, idx) => {
            const isOpen = openTrack === idx;
            return (
              <div 
                key={track.id}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen 
                    ? 'bg-[#0f172a] border-white/15 shadow-xl' 
                    : 'bg-[#0b1020]/70 border-white/5 hover:border-white/10'
                }`}
              >
                {/* Header Track Bar */}
                <button
                  onClick={() => setOpenTrack(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono font-black text-sm text-slate-300 shrink-0">
                      {track.num}
                    </span>
                    <div>
                      <div className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase mb-0.5">
                        {track.tag}
                      </div>
                      <h3 className="text-base font-bold text-white">
                        {track.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                        {track.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-xs text-slate-400 hidden md:block">
                      {track.items.length} Học phần
                    </span>
                    <div className={`p-1.5 rounded-lg bg-white/5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Accordion Body Items */}
                {isOpen && (
                  <div className="p-5 pt-0 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-2 animate-fade-in">
                    {track.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          onClick={item.action}
                          className="glass-card p-4.5 border border-white/5 hover:border-cyan-500/40 hover:bg-[#131c33] transition-all cursor-pointer rounded-xl flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.badgeColor}`}>
                                {item.badge}
                              </span>
                              <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                            </div>

                            <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                              {item.desc}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-xs text-slate-500">
                            <span>{item.count}</span>
                            <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                              Mở học phần <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
