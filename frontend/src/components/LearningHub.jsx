import React, { useState } from 'react';
import { 
  Sparkles, Zap, BookOpen, Headphones, Trophy, 
  ChevronRight, Clock, Award, Compass, 
  BrainCircuit, FileText, CheckCircle2, Flame, ArrowRight,
  Target, GraduationCap, Layers, Bot, Mic, PenLine, Database,
  Download, Camera, Eye, Lock, RefreshCw, BarChart3, Star, Check, Shuffle
} from 'lucide-react';

export default function LearningHub({
  selectedGrade,
  onGradeChange,
  onNavigate,
  currentUser,
  serverStats,
  onOpenPhotoSolver
}) {
  const isC3 = parseInt(selectedGrade) >= 10;
  const [activeCategory, setActiveCategory] = useState(isC3 ? 'thpt' : 'thcs');

  // Categories & their curated cards
  const categories = isC3 ? [
    {
      id: 'thpt',
      name: '🎓 THPT Quốc Gia 2027',
      desc: 'Bộ đề thi chuẩn cấu trúc Bộ GD&ĐT & Sách giáo khoa Lớp 10-11-12',
      cards: [
        {
          id: 'official-exams',
          title: 'Kho Đề Chuẩn Hóa Đa Tỉnh Thành',
          desc: 'Bộ đề thi chính thức Hà Nội, TP.HCM, Nghệ An, Nam Định có lời giải chi tiết và mẹo tránh bẫy.',
          badge: 'Đề Thi Thật',
          badgeColor: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
          meta: '50 Câu / Đề • Có đáp án chi tiết',
          action: () => onNavigate('official-exams'),
          icon: FileText,
          bgGradient: 'from-[#0e1a38] via-[#0b1328] to-[#070b18]',
          borderColor: 'border-blue-500/30 hover:border-blue-400',
          iconColor: 'text-blue-400 bg-blue-500/20 shadow-blue-500/20'
        },
        {
          id: 'adaptive-reading',
          title: 'Đọc Hiểu Thích Ứng Chủ Đề SGK Mới',
          desc: 'Bài đọc AI phân tầng theo sở thích: Công nghệ, Môi trường, Văn hóa, Khoa học theo chương trình GDPT 2018.',
          badge: 'AI Adaptive',
          badgeColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
          meta: '12 Units SGK • Tự động đổi độ khó',
          action: () => onNavigate('reading'),
          icon: BookOpen,
          bgGradient: 'from-[#0a2326] via-[#09171c] to-[#060e12]',
          borderColor: 'border-emerald-500/30 hover:border-emerald-400',
          iconColor: 'text-emerald-400 bg-emerald-500/20 shadow-emerald-500/20'
        },
        {
          id: 'adaptive-listening',
          title: 'Luyện Nghe Thích Ứng & Ngữ Điệu Bản Xứ',
          desc: 'Luyện nghe phân tầng độ khó, tự động sinh câu hỏi kiểm tra khả năng bắt từ khóa và phản xạ âm thanh.',
          badge: 'Interactive Audio',
          badgeColor: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
          meta: '36 Bài nghe • Tốc độ linh hoạt',
          action: () => onNavigate('listening'),
          icon: Headphones,
          bgGradient: 'from-[#201036] via-[#140b24] to-[#0a0614]',
          borderColor: 'border-purple-500/30 hover:border-purple-400',
          iconColor: 'text-purple-400 bg-purple-500/20 shadow-purple-500/20'
        },
        {
          id: 'sm2-vocab',
          title: 'Siêu Trí Nhớ Từ Vựng Não Bộ (SM-2)',
          desc: 'Thuật toán Spaced Repetition tính toán chính xác chu kỳ quên lãng để nhắc lại từ vựng đúng thời điểm vàng.',
          badge: 'Khoa học Não bộ',
          badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
          meta: '1,500+ Từ vựng • 100% Nhớ sâu',
          action: () => onNavigate('sm2-flashcards'),
          icon: BrainCircuit,
          bgGradient: 'from-[#281a0c] via-[#1c1208] to-[#0f0904]',
          borderColor: 'border-amber-500/30 hover:border-amber-400',
          iconColor: 'text-amber-400 bg-amber-500/20 shadow-amber-500/20'
        }
      ]
    },
    {
      id: 'dgnl',
      name: '🚀 ĐGNL & Tư Duy (HSA / TSA)',
      desc: 'Luyện đề thi ĐHQG Hà Nội, ĐHQG-HCM, Bách Khoa, Sư phạm & Bộ Công an',
      cards: [
        {
          id: 'dgnl-reading',
          title: 'Đọc Hiểu Suy Luận & Phân Tích Lập Luận',
          desc: 'Chuyên đề giải mã các câu hỏi suy luận ý tác giả, tìm thông tin ngầm định và phân tích phản đề học thuật.',
          badge: 'HSA • TSA ĐHQG',
          badgeColor: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
          meta: '24 Chuyên đề • Đạt 850+ Điểm',
          action: () => onNavigate('reading'),
          icon: Target,
          bgGradient: 'from-[#280c14] via-[#1c080e] to-[#0f0408]',
          borderColor: 'border-rose-500/30 hover:border-rose-400',
          iconColor: 'text-rose-400 bg-rose-500/20 shadow-rose-500/20'
        },
        {
          id: 'writing-academic',
          title: 'Luyện Viết & Biến Đổi Cấu Trúc Câu',
          desc: 'Viết luận và viết lại câu học thuật, AI chấm 4 tiêu chí và gợi ý nâng cấp từ vựng Band 8.0+ tức thì.',
          badge: 'AI Chữa bài 4 tiêu chí',
          badgeColor: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
          meta: 'Sửa lỗi tức thì • Không giới hạn',
          action: () => onNavigate('writing-practice'),
          icon: PenLine,
          bgGradient: 'from-[#092230] via-[#061722] to-[#030c12]',
          borderColor: 'border-cyan-500/30 hover:border-cyan-400',
          iconColor: 'text-cyan-400 bg-cyan-500/20 shadow-cyan-500/20'
        },
        {
          id: 'socrates-mentor',
          title: 'Socrates AI Mentor - Gia Sư Gợi Mở 1:1',
          desc: 'Hướng dẫn giải chi tiết từng bước, gợi mở phương pháp suy luận thay vì đưa đáp án thô 24/7.',
          badge: 'Socratic Method',
          badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
          meta: '24/7 Sẵn sàng • Chẩn đoán bẫy',
          action: () => onNavigate('chat'),
          icon: Bot,
          bgGradient: 'from-[#261d08] via-[#1a1305] to-[#0d0902]',
          borderColor: 'border-amber-500/30 hover:border-amber-400',
          iconColor: 'text-amber-400 bg-amber-500/20 shadow-amber-500/20'
        },
        {
          id: 'teacher-hub-card',
          title: 'Cổng Giáo Viên • Xáo Đề 101-104 & Quản Lý Lớp',
          desc: 'Tự động đảo câu hỏi và đáp án từ đề gốc thành 4-8 mã đề kèm bảng ma trận đáp án, quản lý nhóm lớp và thử thách từ vựng tuần.',
          badge: 'Dành Cho Giáo Viên',
          badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
          meta: 'Xáo 2-8 Mã đề • Quản lý lớp',
          action: () => onNavigate('teacher-portal'),
          icon: Shuffle,
          bgGradient: 'from-[#281a0c] via-[#1c1208] to-[#0f0904]',
          borderColor: 'border-amber-500/30 hover:border-amber-400',
          iconColor: 'text-amber-400 bg-amber-500/20 shadow-amber-500/20'
        },
        {
          id: 'analytics-irt',
          title: 'Báo Cáo Năng Lực & Dự Báo Điểm Thi',
          desc: 'Bản đồ Radar phân tích điểm mạnh, điểm yếu theo 2PL IRT và xuất báo cáo học tập PDF hoàn chỉnh.',
          badge: 'Báo cáo năng lực',
          badgeColor: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
          meta: 'Xuất PDF • Phân tích chuyên sâu',
          action: () => onNavigate('analytics'),
          icon: BarChart3,
          bgGradient: 'from-[#141238] via-[#0d0c24] to-[#070614]',
          borderColor: 'border-indigo-500/30 hover:border-indigo-400',
          iconColor: 'text-indigo-400 bg-indigo-500/20 shadow-indigo-500/20'
        }
      ]
    },
    {
      id: 'skills',
      name: '🎯 4 Kỹ Năng Tiếng Anh THPT Chuẩn GDPT 2018',
      desc: 'Nghe • Đọc • Viết • Nói bám sát cấu trúc thi Tốt nghiệp THPT & SGK Mới',
      cards: [
        {
          id: 'pronounce-speech',
          title: 'Chấm Điểm Phát Âm Chuẩn 44 Âm IPA',
          desc: 'Azure Speech AI phân tích sóng âm nhận diện chính xác từng phụ âm cuối, nguyên âm đôi và trọng âm câu.',
          badge: 'Azure Speech AI',
          badgeColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
          meta: '44 Âm IPA • Chấm điểm chi tiết',
          action: () => onNavigate('pronounce'),
          icon: Mic,
          bgGradient: 'from-[#08261e] via-[#051a14] to-[#020d0a]',
          borderColor: 'border-emerald-500/30 hover:border-emerald-400',
          iconColor: 'text-emerald-400 bg-emerald-500/20 shadow-emerald-500/20'
        },
        {
          id: 'vocab-sgk-library',
          title: 'Kho Từ Vựng Toàn Diện Theo Sách SGK',
          desc: 'Tra cứu và học từ vựng theo Unit SGK Global Success & Friends Global Lớp 10, 11, 12 kèm audio mẫu.',
          badge: 'Học liệu SGK Mới',
          badgeColor: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
          meta: '1,500+ Từ • Kèm ví dụ & IPA',
          action: () => onNavigate('vocab-library'),
          icon: BookOpen,
          bgGradient: 'from-[#092230] via-[#061722] to-[#030c12]',
          borderColor: 'border-cyan-500/30 hover:border-cyan-400',
          iconColor: 'text-cyan-400 bg-cyan-500/20 shadow-cyan-500/20'
        },
        {
          id: 'irt-fast-sprint',
          title: 'Sprint Luyện Đề Nhanh 10 Câu (IRT)',
          desc: 'Bài test nhanh 10 phút tự động tính toán năng lực theta và xác định chính xác điểm số mục tiêu của bạn.',
          badge: 'Đánh Giá Nhanh',
          badgeColor: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
          meta: '~10 Phút • Nhận xét năng lực',
          action: () => onNavigate('irt-test'),
          icon: Zap,
          bgGradient: 'from-[#0e1a38] via-[#0b1328] to-[#070b18]',
          borderColor: 'border-blue-500/30 hover:border-blue-400',
          iconColor: 'text-blue-400 bg-blue-500/20 shadow-blue-500/20'
        },
        {
          id: 'chat-ai-companion',
          title: 'Hội Thoại 1:1 Cùng Trợ Lý Tiếng Anh AI',
          desc: 'Luyện tập giao tiếp, giải thích ngữ pháp sâu và đồng hành giải đáp mọi bài tập trên lớp 24/7.',
          badge: 'Gemini 1.5 Flash',
          badgeColor: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
          meta: 'Trò chuyện 24/7 • Không giới hạn',
          action: () => onNavigate('chat'),
          icon: Sparkles,
          bgGradient: 'from-[#201036] via-[#140b24] to-[#0a0614]',
          borderColor: 'border-purple-500/30 hover:border-purple-400',
          iconColor: 'text-purple-400 bg-purple-500/20 shadow-purple-500/20'
        }
      ]
    }
  ] : [
    {
      id: 'thcs',
      name: '🎯 Tuyển Sinh Vào Lớp 10',
      desc: 'Lộ trình bứt phá điểm 9+ kỳ thi tuyển sinh THPT công lập',
      cards: [
        {
          id: 'thcs-official-exams',
          title: 'Kho Đề Tuyển Sinh Vào 10 Các Tỉnh',
          desc: 'Bộ đề thi chính thức Hà Nội, TP.HCM, Đà Nẵng, Nghệ An có giải thích chi tiết và bảng từ vựng then chốt.',
          badge: 'Đề 63 Tỉnh Thành',
          badgeColor: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
          meta: 'Đầy đủ cấu trúc • Lời giải chi tiết',
          action: () => onNavigate('official-exams'),
          icon: FileText,
          bgGradient: 'from-[#0e1a38] via-[#0b1328] to-[#070b18]',
          borderColor: 'border-blue-500/30 hover:border-blue-400',
          iconColor: 'text-blue-400 bg-blue-500/20 shadow-blue-500/20'
        },
        {
          id: 'thcs-irt-test',
          title: 'Thi Thử Vào 10 Thích Ứng AI',
          desc: '40 câu trắc nghiệm chuẩn cấu trúc tuyển sinh THPT công lập, tự động điều chỉnh theo năng lực học sinh.',
          badge: 'Chuẩn Cấu Trúc',
          badgeColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
          meta: '40 Câu / Đề • Dự báo điểm',
          action: () => onNavigate('irt-test'),
          icon: Zap,
          bgGradient: 'from-[#0a2326] via-[#09171c] to-[#060e12]',
          borderColor: 'border-emerald-500/30 hover:border-emerald-400',
          iconColor: 'text-emerald-400 bg-emerald-500/20 shadow-emerald-500/20'
        },
        {
          id: 'thcs-vocab-sm2',
          title: 'Từ Vựng Não Bộ Tuyển Sinh Vào 10',
          desc: '800 từ vựng cốt lõi thường xuất hiện trong đề thi vào 10, ghi nhớ sâu theo thuật toán SuperMemo-2.',
          badge: 'Trí Nhớ Não Bộ',
          badgeColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
          meta: '800 Từ • Ghi nhớ dài hạn',
          action: () => onNavigate('sm2-flashcards'),
          icon: BrainCircuit,
          bgGradient: 'from-[#281a0c] via-[#1c1208] to-[#0f0904]',
          borderColor: 'border-amber-500/30 hover:border-amber-400',
          iconColor: 'text-amber-400 bg-amber-500/20 shadow-amber-500/20'
        },
        {
          id: 'thcs-ipa-speech',
          title: 'Luyện Phát Âm Chuẩn 44 Âm IPA Cấp 2',
          desc: 'Azure Speech AI chấm điểm phát âm từng nguyên âm, phụ âm và câu giao tiếp cơ bản.',
          badge: 'Azure Speech',
          badgeColor: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
          meta: '44 Âm IPA • Tự tin phát âm',
          action: () => onNavigate('pronounce'),
          icon: Mic,
          bgGradient: 'from-[#201036] via-[#140b24] to-[#0a0614]',
          borderColor: 'border-purple-500/30 hover:border-purple-400',
          iconColor: 'text-purple-400 bg-purple-500/20 shadow-purple-500/20'
        }
      ]
    }
  ];

  const currentCategoryObj = categories.find(c => c.id === activeCategory) || categories[0];

  return (
    <div className="space-y-10 animate-fade-in pb-16 max-w-6xl mx-auto">
      
      {/* ─── 1. HERO BANNER WITH LUXURY GLASSMORPHISM & COUNTDOWN ─────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#101b38] via-[#0c142b] to-[#070c1a] border border-indigo-500/30 p-8 md:p-10 shadow-2xl">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Hero Text */}
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-black px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40 uppercase tracking-wider shadow-sm">
                {isC3 ? 'KỲ THI THPT QG • 2027' : 'KỲ THI TUYỂN SINH VÀO LỚP 10 • THCS'}
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30">
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
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs md:text-sm font-black flex items-center gap-2 cursor-pointer shadow-xl shadow-blue-500/30 transition-all hover:scale-105"
              >
                <Bot className="w-4 h-4" />
                <span>Hỏi AI Gia Sư ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenPhotoSolver}
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-100 text-xs md:text-sm font-bold flex items-center gap-2 border border-white/15 transition cursor-pointer shadow-lg hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>📸 Chụp Ảnh Giải Đề AI</span>
              </button>
            </div>
          </div>

          {/* Right Hero: Circular Countdown Clock */}
          <div className="shrink-0 flex flex-col items-center justify-center p-6 rounded-3xl bg-[#090e1c]/90 border border-indigo-500/30 shadow-2xl relative">
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

      {/* ─── 2. TRỤ CỘT LUYỆN THI THÍCH ỨNG (AI CORE PILLARS GRID) ─────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-white">4 Trụ Cột Luyện Thi Thích Ứng AI</h2>
            <p className="text-xs text-slate-400 mt-0.5">Học tập thông minh theo mô hình tâm trắc học và khoa học nhận thức</p>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold">CORE MODULES</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Luyện đề thích ứng */}
          <div
            onClick={() => onNavigate('irt-test')}
            className="p-6 rounded-3xl border border-emerald-500/30 hover:border-emerald-400 bg-gradient-to-br from-[#0a2326] via-[#09171c] to-[#060e12] cursor-pointer space-y-4 relative group overflow-hidden shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                THUẬT TOÁN IRT
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition shadow-lg shadow-emerald-500/20">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition font-outfit">
                Luyện Đề Thích Ứng 10 Câu
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Tự động tăng giảm độ khó theo từng câu để xác định đúng năng lực thực.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/10">
              <span className="flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5" /> ~10 phút</span>
              <span className="text-emerald-400 font-black group-hover:translate-x-1 transition flex items-center gap-1">
                Luyện ngay <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Từ vựng não bộ SM-2 */}
          <div
            onClick={() => onNavigate('sm2-flashcards')}
            className="p-6 rounded-3xl border border-amber-500/30 hover:border-amber-400 bg-gradient-to-br from-[#281a0c] via-[#1c1208] to-[#0f0904] cursor-pointer space-y-4 relative group overflow-hidden shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                SUPERMEMO-2
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition shadow-lg shadow-amber-500/20">
                <BrainCircuit className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-black text-white group-hover:text-amber-300 transition font-outfit">
                Trí Nhớ Từ Vựng Não Bộ
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Ghi nhớ sâu từ vựng SGK Mới theo quy luật nhắc lại ngắt quãng.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/10">
              <span className="flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5" /> ~5-8 phút</span>
              <span className="text-amber-400 font-black group-hover:translate-x-1 transition flex items-center gap-1">
                Học từ <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 3: Socrates AI Tutor */}
          <div
            onClick={() => onNavigate('chat')}
            className="p-6 rounded-3xl border border-blue-500/30 hover:border-blue-400 bg-gradient-to-br from-[#0e1a38] via-[#0b1328] to-[#070b18] cursor-pointer space-y-4 relative group overflow-hidden shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                GIA SƯ 1:1
              </span>
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition shadow-lg shadow-blue-500/20">
                <Bot className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-black text-white group-hover:text-blue-300 transition font-outfit">
                Gia Sư Socratic 1:1
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Gợi mở tư duy từng bước, giải đáp thắc mắc và chỉ ra bẫy đề thi 24/7.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/10">
              <span className="flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5" /> 24/7</span>
              <span className="text-blue-400 font-black group-hover:translate-x-1 transition flex items-center gap-1">
                Hỏi đáp <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 4: Chấm phát âm IPA */}
          <div
            onClick={() => onNavigate('pronounce')}
            className="p-6 rounded-3xl border border-cyan-500/30 hover:border-cyan-400 bg-gradient-to-br from-[#092230] via-[#061722] to-[#030c12] cursor-pointer space-y-4 relative group overflow-hidden shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                AZURE SPEECH AI
              </span>
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition shadow-lg shadow-cyan-500/20">
                <Mic className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-black text-white group-hover:text-cyan-300 transition font-outfit">
                Chấm Phát Âm Chuẩn IPA
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Phân tích sóng âm chuẩn xác từng nguyên âm, phụ âm và ngữ điệu câu.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/10">
              <span className="flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5" /> ~5 phút</span>
              <span className="text-cyan-400 font-black group-hover:translate-x-1 transition flex items-center gap-1">
                Luyện âm <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. KHO HỌC LIỆU & ĐỀ THI TINH TUYỂN (TABBED SHOWCASE) ──────────── */}
      <div className="space-y-6 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-white">Kho Học Liệu &amp; Đề Thi Tinh Tuyển</h2>
            <p className="text-xs text-slate-400 mt-0.5">Chọn chuyên đề ôn luyện chi tiết theo từng mục tiêu điểm số</p>
          </div>

          {/* Category Tabs Switcher */}
          {categories.length > 1 && (
            <div className="flex items-center bg-[#070b16] border border-slate-700/60 p-1.5 rounded-2xl gap-2 overflow-x-auto no-scrollbar shadow-2xl">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2x2 Balanced Deck Grid for Selected Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {currentCategoryObj.cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={card.action}
                className={`p-7 rounded-3xl border ${card.borderColor} bg-gradient-to-br ${card.bgGradient} transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:scale-[1.01] hover:shadow-2xl shadow-xl`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black px-3.5 py-1 rounded-full border shadow-sm ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center group-hover:scale-110 transition shadow-lg ${card.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base md:text-lg font-black text-white group-hover:text-cyan-300 transition font-outfit">
                      {card.title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed font-normal">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 text-xs">
                  <span className="text-slate-400 font-medium">{card.meta}</span>
                  <span className="text-cyan-400 font-bold group-hover:translate-x-1.5 transition-transform flex items-center gap-1.5">
                    <span>Mở học phần</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
