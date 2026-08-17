import React, { useState } from 'react';
import { 
  Sparkles, Zap, BookOpen, Headphones, Trophy, 
  ChevronDown, ChevronRight, Clock, Award, Compass, 
  BrainCircuit, FileText, CheckCircle2, Flame, ArrowRight,
  Target, GraduationCap, Layers, Bot, Mic, PenLine, Database,
  Download, Camera, Eye, Lock, RefreshCw
} from 'lucide-react';

export default function LearningHub({
  selectedGrade,
  onGradeChange,
  onNavigate,
  currentUser,
  serverStats,
  onOpenPhotoSolver
}) {
  // Accordion track state (0 = THPT 2027, 1 = DGNL, 2 = Foreign Language)
  const [openTrack, setOpenTrack] = useState(0);
  const isC3 = parseInt(selectedGrade) >= 10;

  // Dynamic tracks based on C3 (THPT) or C2 (THCS)
  const examTracks = isC3 ? [
    {
      id: 'thpt2027',
      num: '01',
      tag: 'KỲ THI TỐT NGHIỆP THPT QUỐC GIA',
      title: 'THPT 2027',
      desc: 'Mỗi môn • Quiz • AI riêng • Sách SGK Global Success & Friends Global Lớp 10-11-12',
      items: [
        {
          id: 'thpt-mock',
          title: 'Đề thi thử THPT Quốc Gia Chuẩn Cấu Trúc 2027',
          desc: '50 câu trắc nghiệm đa năng: Đọc điền, Đọc hiểu, Ngữ pháp, Viết lại câu',
          badge: 'Đề Chuẩn',
          badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
          count: '480 câu',
          action: () => onNavigate('irt-test'),
          icon: Zap
        },
        {
          id: 'reading-adaptive',
          title: 'Luyện đọc hiểu theo chủ đề SGK (Lớp 10 - 11 - 12)',
          desc: 'Đoạn văn thích ứng AI theo sở thích: Công nghệ, Môi trường, Văn hóa, Khoa học',
          badge: 'AI Adaptive',
          badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          count: '12 Units',
          action: () => onNavigate('reading'),
          icon: BookOpen
        },
        {
          id: 'listening-adaptive',
          title: 'Luyện nghe thích ứng & Ngữ điệu chuẩn bản xứ',
          desc: 'Bài nghe phân tầng độ khó, tự động sinh câu hỏi kiểm tra khả năng bắt từ khóa',
          badge: 'Interactive Audio',
          badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
          count: '36 Bài nghe',
          action: () => onNavigate('listening'),
          icon: Headphones
        },
        {
          id: 'vocab-sm2',
          title: 'Ghi nhớ từ vựng THPT siêu tốc (Thuật toán SM-2)',
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
      tagBadge: 'HỌC SINH BẮT BUỘC',
      desc: 'ĐHQG Hà Nội • ĐHQG-HCM • Bách Khoa HN • HNUE • HCMUE • Bộ Công an',
      items: [
        {
          id: 'dgnl-reading',
          title: 'Đọc hiểu suy luận & Phân tích ngữ cảnh phức tạp',
          desc: 'Dạng bài suy luận ý tác giả, tìm thông tin ngầm định, phân tích lập luận',
          badge: 'Vận dụng cao',
          badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
          count: '24 Chuyên đề',
          action: () => onNavigate('reading'),
          icon: FileText
        },
        {
          id: 'writing-logic',
          title: 'Luyện viết & Biến đổi cấu trúc câu học thuật',
          desc: 'Chữa lỗi ngữ pháp và gợi ý nâng cấp từ vựng C1/C2 bằng AI',
          badge: 'AI Chữa bài',
          badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
          count: 'Không giới hạn',
          action: () => onNavigate('writing-practice'),
          icon: PenLine
        },
        {
          id: 'chess-english',
          title: 'Đấu trí Cờ Vua Tiếng Anh (English Chess AI)',
          desc: 'Vừa chơi cờ vừa giải câu hỏi tư duy logic ngôn ngữ để giành lợi thế trên bàn cờ',
          badge: 'Gamification',
          badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          count: 'PvE AI Engine',
          action: () => onNavigate('chess'),
          icon: Trophy
        }
      ]
    },
    {
      id: 'ielts-skills',
      num: '03',
      tag: 'LUYỆN THI 4 KỸ NĂNG & LIVE AI MENTOR',
      title: 'IELTS & Kỹ Năng Ngôn Ngữ',
      desc: 'Listening • Reading • Writing • Speaking • LIVE AI Examiner',
      items: [
        {
          id: 'ielts-hub',
          title: 'Luyện 4 Kỹ Năng Toàn Diện',
          desc: 'Bài tập phân bậc KNLNNVN B1 - B2 - C1 chuẩn quốc tế',
          badge: 'IELTS Hub',
          badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
          count: '4 Kỹ năng',
          action: () => onNavigate('reading'),
          icon: BookOpen
        },
        {
          id: 'pronounce-ai',
          title: 'Chấm điểm phát âm & Nhận diện lỗi ngữ âm IPA',
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
          desc: 'Giải thích ngữ pháp sâu, giải đáp bài tập trên lớp, đóng vai tình huống giao tiếp',
          badge: 'Gemini / Groq LLM',
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
      title: 'Học Liệu & Ngân Hàng Câu Hỏi',
      desc: 'Item Bank chuẩn hóa 2PL IRT • Tra cứu từ vựng SGK • Báo cáo năng lực',
      items: [
        {
          id: 'item-bank',
          title: 'Ngân hàng học liệu & Cấu trúc câu hỏi nghiên cứu',
          desc: 'Tra cứu câu hỏi chuẩn hóa IRT theo độ khó b-parameter và độ phân biệt a-parameter',
          badge: 'KHKT Nghiên cứu',
          badgeColor: 'text-slate-300 bg-slate-500/10 border-slate-500/20',
          count: 'Dữ liệu chuẩn',
          action: () => onNavigate('item-bank'),
          icon: Database
        },
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
          id: 'analytics-rep',
          title: 'Báo Cáo Năng Lực & Dự Báo Điểm Thi',
          desc: 'Biểu đồ tăng trưởng theta và dự báo phổ điểm kỳ thi THPT',
          badge: 'Analytics',
          badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
          count: 'Thời gian thực',
          action: () => onNavigate('analytics'),
          icon: Award
        }
      ]
    }
  ] : [
    {
      id: 'thcs-vao10',
      num: '01',
      tag: 'KỲ THI TUYỂN SINH VÀO LỚP 10',
      title: 'Luyện Thi Tuyển Sinh Vào 10',
      desc: 'Ngữ pháp trọng điểm • Đề thi vào 10 các tỉnh thành • SGK Lớp 6, 7, 8, 9',
      items: [
        {
          id: 'thcs-mock',
          title: 'Đề Thi Thử Vào Lớp 10 Chuẩn Cấu Trúc',
          desc: 'Trắc nghiệm ngữ âm, từ vựng, đọc điền và viết lại câu chuẩn cấu trúc Sở GD&ĐT',
          badge: 'Đề Vào 10',
          badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
          count: '320 câu',
          action: () => onNavigate('irt-test'),
          icon: Zap
        },
        {
          id: 'thcs-reading',
          title: 'Luyện Đọc Hiểu Chủ Điểm SGK THCS',
          desc: 'Các chủ đề đời sống, học đường, gia đình và văn hóa gần gũi với lứa tuổi THCS',
          badge: 'SGK 6-9',
          badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          count: '16 Units',
          action: () => onNavigate('reading'),
          icon: BookOpen
        },
        {
          id: 'thcs-listening',
          title: 'Luyện Nghe Căn Bản Tương Tác',
          desc: 'Hội thoại thường ngày giọng Anh - Mỹ tốc độ vừa phải, dễ hiểu',
          badge: 'Audio THCS',
          badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
          count: '24 Bài nghe',
          action: () => onNavigate('listening'),
          icon: Headphones
        },
        {
          id: 'thcs-vocab',
          title: 'Từ Vựng Căn Bản Não Bộ (SM-2 A1-A2)',
          desc: '800 từ vựng cốt lõi thường xuất hiện trong đề thi tuyển sinh vào 10',
          badge: 'Trí Nhớ Dài Hạn',
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
      title: 'Bứt Phá Nền Tảng Ngữ Pháp & IPA',
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
    <div className="space-y-6 animate-fade-in pb-12 max-w-6xl mx-auto">
      {/* ─── 0. TOP CONTROLS BAR: [FREE] | [👁 C3] [📖 C2] | [🔄 Làm mới] ─── */}
      <div className="flex items-center justify-between px-1">
        {/* Left: FREE Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a1220] border border-white/10 text-slate-300 text-xs font-bold shadow-sm">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>FREE</span>
        </div>

        {/* Center: C3 vs C2 Segmented Pill Switcher (Matching screenshot exactly) */}
        <div className="flex items-center bg-[#0d1424] border border-white/10 p-1 rounded-2xl gap-1 shadow-lg shadow-black/40">
          <button
            onClick={() => onGradeChange && onGradeChange('12')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
              isC3
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>C3</span>
          </button>

          <button
            onClick={() => onGradeChange && onGradeChange('9')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
              !isC3
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>C2</span>
          </button>
        </div>

        {/* Right: Refresh button */}
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold transition cursor-pointer shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Làm mới •</span>
        </button>
      </div>

      {/* ─── 1. HERO BANNER WITH CIRCULAR COUNTDOWN (Matching Image 3) ─────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#101935] via-[#0d1428] to-[#090d18] border border-white/10 p-6 md:p-8">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Hero Text */}
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {isC3 ? 'KỲ THI THPT QG • 2027' : 'KỲ THI TUYỂN SINH VÀO LỚP 10 • THCS'}
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                100% Miễn Phí
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-outfit">
              {isC3 ? (
                <>Chinh phục <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">điểm 10</span> cùng AI Gia Sư riêng.</>
              ) : (
                <>Bứt phá <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">điểm 9+</span> vào lớp 10 cùng AI Gia Sư.</>
              )}
            </h1>

            <p className="text-xs md:text-sm text-slate-300 font-normal leading-relaxed">
              Chào <strong className="text-white">{currentUser?.fullname || currentUser?.username || 'Học sinh'}</strong>, AI Mentor đồng hành 24/7 — {isC3 ? 'chấm bài, giải đề, phân tích lỗi, dự đoán điểm thi THPT theo mô hình tâm trắc học IRT chuẩn mực.' : 'xây dựng nền tảng ngữ pháp, phát âm chuẩn 44 âm IPA, luyện đề thi thử vào lớp 10 theo chương trình GDPT 2018.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('chat')}
                className="btn-primary px-6 py-3 text-xs md:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-xl shadow-blue-500/20"
              >
                <Bot className="w-4 h-4" />
                <span>Hỏi AI Gia Sư ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenPhotoSolver}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs md:text-sm font-bold flex items-center gap-2 border border-white/10 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>📸 Chụp Ảnh Giải Đề AI</span>
              </button>
            </div>
          </div>

          {/* Right Hero: Circular Countdown Clock (Image 3) */}
          <div className="shrink-0 flex flex-col items-center justify-center p-6 rounded-3xl bg-[#080d1a]/80 border border-white/10 shadow-2xl relative">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Outer SVG Ring */}
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
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Countdown Info */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-white font-mono tracking-tight">{isC3 ? '312' : '284'}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">DAYS LEFT</span>
                <span className="text-[9px] font-mono text-purple-400 mt-0.5">{isC3 ? '25.06.2027' : '05.06.2027'}</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-3">
              {isC3 ? 'Đếm ngược THPT 2027' : 'Đếm ngược Vào Lớp 10'}
            </span>
          </div>
        </div>
      </div>

      {/* ─── 2. HỌC HÔM NAY: DAILY QUIZZES (Matching Image 3) ──────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest">
              HỌC HÔM NAY
            </span>
            <span className="text-[9px] font-mono text-slate-500">DAILY • 02 QUIZ</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Quiz Từ Vựng Hàng Ngày */}
          <div
            onClick={() => onNavigate('sm2-flashcards')}
            className="glass-card glass-card-hover p-5 border border-white/10 cursor-pointer space-y-3 relative group overflow-hidden bg-[#0d1424]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">
                TỪ VỰNG • LỚP {selectedGrade}
              </span>
              <span className="text-[10px] font-mono text-slate-500">SM-2 Spaced Repetition</span>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white group-hover:text-blue-300 transition">
                Quiz Từ Vựng &amp; Cụm Từ Hằng Ngày
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                10 thẻ từ vựng trọng tâm theo sách giáo khoa, ghi nhớ sâu theo thuật toán SuperMemo-2.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-white/5">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> ~5 - 8 phút
              </span>
              <span className="text-blue-400 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                Bắt đầu <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Card 2: Sprint Luyện Đề Thích Ứng */}
          <div
            onClick={() => onNavigate('irt-test')}
            className="glass-card glass-card-hover p-5 border border-white/10 cursor-pointer space-y-3 relative group overflow-hidden bg-[#0d1424]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ĐỀ THI NHANH • THPT 2027
              </span>
              <span className="text-[10px] font-mono text-slate-500">IRT Đổi Mới</span>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition">
                Sprint Luyện Đề Thích Ứng 10 Câu
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Đề thi tự động tăng giảm độ khó theo từng câu trả lời đúng/sai để xác định đúng điểm thực của bạn.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-white/5">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> ~10 phút
              </span>
              <span className="text-emerald-400 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                Bắt đầu <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. TWO ACTION BANNERS (Matching Image 3) ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Banner 1: Trung Tâm Học Tập */}
        <div
          onClick={() => onNavigate('vocab-library')}
          className="p-5 rounded-2xl bg-gradient-to-r from-pink-900/30 to-purple-900/20 border border-pink-500/20 hover:border-pink-500/40 transition cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block">
              TRUNG TÂM HỌC TẬP • LEARNING HUB
            </span>
            <h3 className="text-sm md:text-base font-extrabold text-white group-hover:text-pink-300 transition">
              Mở Trung Tâm Học Tập &amp; Sách SGK
            </h3>
            <p className="text-xs text-slate-400">
              THPT QG • HSA • TSA • V-ACT • Sách SGK — tất cả trong một.
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* Banner 2: Đề Thi Thật */}
        <div
          onClick={() => onNavigate('irt-test')}
          className="p-5 rounded-2xl bg-gradient-to-r from-amber-900/30 to-orange-900/20 border border-amber-500/20 hover:border-amber-500/40 transition cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              MỚI • ĐỀ THI THẬT
            </span>
            <h3 className="text-sm md:text-base font-extrabold text-white group-hover:text-amber-300 transition">
              Chinh Phục Đề Thi Thật (Bộ GD&amp;ĐT)
            </h3>
            <p className="text-xs text-slate-400">
              Đề thi thật THPTQG • HSA • TSA • V-ACT • Sư phạm — giải như gia sư 1:1.
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ─── 4. ĐƯỜNG ĐUA KỲ THI (EXAM TRACK ACCORDIONS) ────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white">Đường đua Kỳ thi &amp; Học liệu</h2>
            <p className="text-xs text-slate-400 mt-0.5">Chọn lộ trình ôn luyện chi tiết theo từng kỳ thi và mục tiêu điểm số</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">04 TRACKS • EXPANDABLE</span>
        </div>

        <div className="space-y-3">
          {examTracks.map((track, idx) => {
            const isOpen = openTrack === idx;
            return (
              <div 
                key={track.id}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen 
                    ? 'bg-[#101726] border-white/15 shadow-xl' 
                    : 'bg-[#0c1220]/70 border-white/5 hover:border-white/10'
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
                      <div className="text-[10px] font-bold text-blue-400 tracking-wider uppercase mb-0.5">
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
                          className="glass-card p-4.5 border border-white/5 hover:border-blue-500/40 hover:bg-[#141e33] transition-all cursor-pointer rounded-xl flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.badgeColor}`}>
                                {item.badge}
                              </span>
                              <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                            </div>

                            <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                              {item.desc}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-xs text-slate-400">
                            <span className="text-[11px] font-medium text-slate-400">{item.count}</span>
                            <span className="text-xs font-bold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition">
                              Vào học <ChevronRight className="w-3.5 h-3.5" />
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

      {/* ─── 4. EXTENDED SHOWCASE: HỆ SINH THÁI AI HỌC TẬP TOÀN DIỆN ──────── */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
              TOÀN BỘ TÍNH NĂNG &amp; HỌC LIỆU
            </span>
            <h2 className="text-xl font-extrabold text-white">Hệ Sinh Thái Công Cụ AI Thông Minh</h2>
          </div>
          <span className="text-xs text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            100% Miễn Phí
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Tool 1 */}
          <div 
            onClick={() => onNavigate('irt-test')}
            className="glass-card glass-card-hover p-5 border border-white/10 cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition">
                Luyện Đề Thích Ứng IRT (Item Response Theory)
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Đề thi tự động đo lường tham số năng lực $\theta$, bám sát cấu trúc Đổi mới GD&amp;ĐT (Part 1, 2, 3).
              </p>
            </div>
            <div className="text-xs font-bold text-blue-400 flex items-center gap-1 pt-2 border-t border-white/5">
              Luyện ngay <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tool 2 */}
          <div 
            onClick={() => onNavigate('sm2-flashcards')}
            className="glass-card glass-card-hover p-5 border border-white/10 cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                Học Từ Vựng Não Bộ SuperMemo-2
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Thuật toán Spaced Repetition tính toán đường cong quên lãng Ebbinghaus, nhắc lại từ vựng đúng thời điểm.
              </p>
            </div>
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1 pt-2 border-t border-white/5">
              Ôn từ vựng <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tool 3 */}
          <div 
            onClick={() => onNavigate('pronounce')}
            className="glass-card glass-card-hover p-5 border border-white/10 cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                Chấm Điểm Phát Âm Chuẩn IPA (Azure Speech AI)
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Phân tích sóng âm nhận diện chính xác từng âm tiết, phụ âm đuôi, trọng âm và độ mượt mà.
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 pt-2 border-t border-white/5">
              Luyện phát âm <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tool 4 */}
          <div 
            onClick={() => onNavigate('reading')}
            className="glass-card glass-card-hover p-5 border border-white/10 cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                Đọc Thích Ứng SGK (Adaptive Reading)
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Đoạn văn tự động điều chỉnh độ dài, độ khó từ vựng và chủ đề theo sở thích của từng học sinh.
              </p>
            </div>
            <div className="text-xs font-bold text-cyan-400 flex items-center gap-1 pt-2 border-t border-white/5">
              Vào đọc bài <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tool 5 */}
          <div 
            onClick={() => onNavigate('listening')}
            className="glass-card glass-card-hover p-5 border border-white/10 cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                Nghe Tương Tác Audio (Adaptive Listening)
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Bài nghe đa tốc độ giọng bản ngữ Anh - Mỹ kèm câu hỏi trắc nghiệm kiểm tra khả năng bắt từ khóa.
              </p>
            </div>
            <div className="text-xs font-bold text-purple-400 flex items-center gap-1 pt-2 border-t border-white/5">
              Luyện nghe ngay <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tool 6 */}
          <div 
            onClick={() => onNavigate('writing-practice')}
            className="glass-card glass-card-hover p-5 border border-white/10 cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center group-hover:scale-110 transition">
              <PenLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-pink-300 transition">
                Luyện Viết Câu &amp; Feedback Ngữ Pháp AI
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Nhập câu văn, AI chỉ ra lỗi sai ngữ pháp, cấu trúc câu chưa tự nhiên và gợi ý nâng cấp từ vựng C1.
              </p>
            </div>
            <div className="text-xs font-bold text-pink-400 flex items-center gap-1 pt-2 border-t border-white/5">
              Luyện viết câu <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tool 7 */}
          <div 
            onClick={() => onNavigate('chess')}
            className="glass-card glass-card-hover p-5 border border-white/10 cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                Cờ Vua Tiếng Anh AI (English Chess)
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Đấu trí chơi cờ với AI, trả lời đúng câu hỏi từ vựng/ngữ pháp để giành nước đi chiến lược.
              </p>
            </div>
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1 pt-2 border-t border-white/5">
              Chơi cờ ngay <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tool 8 */}
          <div 
            onClick={() => onNavigate('chat')}
            className="glass-card glass-card-hover p-5 border border-white/10 cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition">
                Gia Sư Hội Thoại AI 1:1 (LLM Tutor)
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Đóng vai tình huống thực tế, giải thích ngữ pháp chuyên sâu, giải đáp bài tập bất kỳ lúc nào.
              </p>
            </div>
            <div className="text-xs font-bold text-blue-400 flex items-center gap-1 pt-2 border-t border-white/5">
              Chat gia sư <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tool 9 */}
          <div 
            onClick={() => onNavigate('item-bank')}
            className="glass-card glass-card-hover p-5 border border-white/10 cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-500/10 border border-slate-500/20 text-slate-300 flex items-center justify-center group-hover:scale-110 transition">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-slate-200 transition">
                Ngân Hàng Câu Hỏi Nghiên Cứu (Item Bank)
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Quản lý kho câu hỏi chuẩn hóa IRT, độ phân biệt $a$, độ khó $b$ phục vụ nghiên cứu KHKT.
              </p>
            </div>
            <div className="text-xs font-bold text-slate-400 flex items-center gap-1 pt-2 border-t border-white/5">
              Tra cứu ngân hàng <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── 5. SCIENTIFIC METHODOLOGY FOUNDATION SECTION ────────────────── */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0f172a] to-[#0a0d14] border border-white/10 p-6 md:p-8 space-y-6">
        <div className="max-w-3xl space-y-2">
          <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
            NỀN TẢNG KHOA HỌC KỸ THUẬT QUỐC GIA
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white">
            Bộ Đôi Thuật Toán Cốt Lõi Định Hình Năng Lực Học Tập
          </h2>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            Hệ thống kết hợp mô hình đo lường tâm trắc học chuẩn quốc tế <strong>2PL IRT</strong> và thuật toán tối ưu trí nhớ <strong>SuperMemo-2</strong> để cá nhân hóa việc học đến từng giây.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#0a0f1d] border border-white/5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold font-mono">
                IRT
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Mô hình Item Response Theory (2PL)</h3>
                <span className="text-[11px] text-slate-500">Đo lường năng lực tiềm ẩn $\theta$</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Xác suất trả lời đúng P(&theta;) = 1 / [1 + exp(-D &middot; a(&theta; - b))]. Đề thi không cố định mà tự động điều chỉnh độ khó b khớp chính xác với năng lực thực &theta; của bạn.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a0f1d] border border-white/5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold font-mono">
                SM2
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Thuật toán SuperMemo-2 Spaced Repetition</h3>
                <span className="text-[11px] text-slate-500">Ghi nhớ từ vựng vào trí nhớ dài hạn</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tự động tính toán khoảng cách lặp lại I(n) = I(n-1) &times; EF dựa trên hệ số dễ nhớ EF và đánh giá chất lượng phản hồi từ 0-5 sao của học sinh.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 6. COMPARISON: AI ADAPTIVE VS TRADITIONAL LEARNING ───────────── */}
      <div className="space-y-4 pt-2">
        <h2 className="text-xl font-extrabold text-white">So Sánh Phương Pháp Học Tập</h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-white/10 bg-[#0d1424] text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="p-4">Tiêu Chí</th>
                <th className="p-4 text-slate-400">Cách Học Truyền Thống</th>
                <th className="p-4 text-emerald-400 font-bold bg-emerald-500/5">Học Với AI English Mentor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#0a0d14]">
              <tr>
                <td className="p-4 font-bold text-white">Lộ trình đề thi</td>
                <td className="p-4 text-slate-400">Đề chung cho cả lớp, quá dễ hoặc quá khó</td>
                <td className="p-4 text-emerald-300 font-semibold bg-emerald-500/5">Tự động thích ứng 1:1 theo năng lực IRT</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Ôn tập từ vựng</td>
                <td className="p-4 text-slate-400">Học vẹt danh sách dài, quên sau 3 ngày</td>
                <td className="p-4 text-emerald-300 font-semibold bg-emerald-500/5">Thuật toán SM-2 nhắc đúng thời điểm vàng</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Sửa lỗi phát âm</td>
                <td className="p-4 text-slate-400">Ít được giáo viên chỉnh sửa từng âm tiết</td>
                <td className="p-4 text-emerald-300 font-semibold bg-emerald-500/5">Azure Speech AI nhận diện chính xác từng âm IPA</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Chi phí &amp; Tiếp cận</td>
                <td className="p-4 text-slate-400">Tốn kém học thêm, giới hạn thời gian</td>
                <td className="p-4 text-emerald-300 font-semibold bg-emerald-500/5">100% Miễn phí, học 24/7 không giới hạn</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 8. HỆ THỐNG / SETTINGS QUICK ACCESS (Matching Image 3) ──────── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hệ thống &amp; Tiện ích</span>
          <span className="text-[10px] font-mono text-slate-500">04 SETTINGS</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div 
            onClick={() => alert("Ứng dụng AI English Mentor hoạt động trực tiếp trên trình duyệt máy tính, máy tính bảng và điện thoại mà không cần cài đặt phức tạp.")}
            className="p-4 rounded-xl bg-[#0c1220] border border-white/5 hover:border-white/15 transition cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-blue-300 transition">Cài đặt PWA</div>
              <div className="text-[10px] text-slate-400">Sử dụng web app offline</div>
            </div>
          </div>

          <div 
            onClick={onOpenPhotoSolver}
            className="p-4 rounded-xl bg-[#0c1220] border border-white/5 hover:border-blue-500/30 transition cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-blue-300 transition">Chụp ảnh giải đề AI</div>
              <div className="text-[10px] text-slate-400">Giải đề từng bước</div>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('guide')}
            className="p-4 rounded-xl bg-[#0c1220] border border-white/5 hover:border-cyan-500/30 transition cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition">Hướng dẫn sử dụng</div>
              <div className="text-[10px] text-slate-400">Video &amp; tài liệu chi tiết</div>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('item-bank')}
            className="p-4 rounded-xl bg-[#0c1220] border border-white/5 hover:border-purple-500/30 transition cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-purple-300 transition">Nghiên cứu KHKT</div>
              <div className="text-[10px] text-slate-400">Ngân hàng Item Bank IRT</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

