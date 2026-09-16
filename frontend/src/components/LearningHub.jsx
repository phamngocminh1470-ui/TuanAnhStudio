import React, { useState, useMemo } from 'react';
import DaturaSkillsSection from './DaturaSkillsSection';
import { 
  Sparkles, Zap, BookOpen, Headphones, Trophy, 
  ChevronRight, Clock, Award, Compass, 
  BrainCircuit, FileText, CheckCircle2, Flame, ArrowRight,
  Target, GraduationCap, Layers, Bot, Mic, PenLine, Database,
  Download, Camera, Eye, Lock, RefreshCw, BarChart3, Star, Check, Shuffle,
  TrendingUp, HelpCircle, Volume2, ShieldCheck, Sparkle
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
  const [activeSkillCategory, setActiveSkillCategory] = useState('all');

  // Tính toán số ngày đếm ngược chính xác
  const countdownDays = useMemo(() => {
    const targetDate = isC3 ? new Date('2027-06-25') : new Date('2027-06-05');
    const today = new Date();
    const diffTime = targetDate - today;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }, [isC3]);

  return (
    <div className="w-full space-y-10 sm:space-y-14 animate-fade-in pb-28 select-text">
      
      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO BANNER: EXPANSIVE 3D SAPPHIRE HERO WITH RADIANT GLOW
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="card-3d-sapphire p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-[0_16px_40px_rgba(3,7,26,0.7)] border border-cyan-500/20 text-slate-100">
        
        {/* Expansive Ambient Atmosphere - Êm dịu, lan tỏa tự nhiên, không chói */}
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/12 via-cyan-500/10 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute -bottom-20 -right-20 w-[550px] h-[550px] bg-gradient-to-bl from-purple-600/10 via-indigo-500/08 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left Column: Hero Typography & Actions */}
          <div className="space-y-4 sm:space-y-5 text-left w-full xl:max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="text-[11px] font-mono px-3.5 py-1 rounded-full bg-blue-950/70 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isC3 ? 'KỲ THI THPT QG • 2027' : 'KỲ THI TUYỂN SINH 10 • THCS'}</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-300 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                100% MIỄN PHÍ
              </span>
              <span className="text-[11px] font-mono text-cyan-300/80 px-3 py-1 rounded-full bg-blue-950/60 border border-cyan-500/30 hidden sm:inline-flex">
                IRT 2PL ADAPTIVE
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight font-outfit">
              {isC3 ? (
                <>
                  <span className="text-3d-hero block">Chinh phục điểm 9+ THPT</span>
                  <span className="text-3d-cyan inline-block mt-1">cùng AI Gia Sư riêng 24/7</span>
                </>
              ) : (
                <>
                  <span className="text-3d-hero block">Bứt phá điểm 9+ vào 10</span>
                  <span className="text-3d-cyan inline-block mt-1">cùng AI Gia Sư</span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
              Chào <span className="text-cyan-300 font-bold">{currentUser?.fullname || currentUser?.username || 'Học sinh'}</span>, AI Mentor đồng hành 24/7 theo phương pháp <span className="text-cyan-200 font-semibold">gợi mở Socrates</span> — không mớm đáp án, giúp em tự tư duy, phân tích bẫy đề thi và đo lường chính xác năng lực thực tế.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 w-full">
              <button
                onClick={() => onNavigate('chat')}
                className="btn-3d-primary px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
              >
                <Bot className="w-4 h-4 text-cyan-200" />
                <span>Hỏi AI Gia Sư Socratic 1:1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onOpenPhotoSolver}
                className="btn-3d-secondary px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Chụp Ảnh Giải Đề AI</span>
              </button>

              <button
                onClick={() => onNavigate('irt-test')}
                className="px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl bg-gradient-to-b from-indigo-900/80 to-[#121a44] text-cyan-200 hover:text-white border border-cyan-500/30 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
              >
                <Zap className="w-4 h-4 text-cyan-300" />
                <span>Luyện Đề Thích Ứng (10 Câu)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Countdown HUD */}
          <div className="shrink-0 w-full xl:w-auto flex flex-col sm:flex-row xl:flex-col items-center justify-center gap-4 p-6 sm:p-7 rounded-3xl bg-[#131d47] border border-cyan-500/25 shadow-lg relative text-slate-100">
            {/* Circular Countdown Ring */}
            <div className="flex items-center gap-5">
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-blue-950/70"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="264"
                    strokeDashoffset={isC3 ? "75" : "90"}
                    strokeLinecap="round"
                    className="text-cyan-400"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-extrabold text-cyan-300 font-mono tracking-tight">{countdownDays}</span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">NGÀY CÒN LẠI</span>
                  <span className="text-[10px] font-mono text-cyan-300 mt-0.5">{isC3 ? '25.06.2027' : '05.06.2027'}</span>
                </div>
              </div>

              {/* Text label next to ring */}
              <div className="text-left space-y-1">
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wider block font-outfit">
                  {isC3 ? 'Đếm Ngược THPT 2027' : 'Đếm Ngược Vào 10'}
                </span>
                <p className="text-xs text-slate-400 leading-tight max-w-[150px] font-normal">
                  Kỳ thi chuẩn hóa theo cấu trúc GDPT 2018
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  <span>Đồng bộ tiến độ</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar inside HUD */}
            <div className="w-full grid grid-cols-3 gap-2 pt-3 sm:pt-4 border-t border-cyan-500/20 text-center">
              <div className="p-2 rounded-xl bg-[#10193e] border border-cyan-500/25 shadow-xs">
                <div className="text-xs font-mono text-cyan-300 font-bold">+0.85</div>
                <div className="text-[9px] text-slate-400 font-mono">Năng lực θ</div>
              </div>
              <div className="p-2 rounded-xl bg-[#10193e] border border-cyan-500/25 shadow-xs">
                <div className="text-xs font-mono text-amber-300 font-bold">🔥 7 Ngày</div>
                <div className="text-[9px] text-slate-400 font-mono">Chuỗi học</div>
              </div>
              <div className="p-2 rounded-xl bg-[#10193e] border border-cyan-500/25 shadow-xs">
                <div className="text-xs font-mono text-emerald-300 font-bold">8.4 / 10</div>
                <div className="text-[9px] text-slate-400 font-mono">Dự báo điểm</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          2. 4 TRỤ CỘT LUYỆN THI THÍCH ỨNG AI (3D SAPPHIRE CARDS)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4 sm:space-y-5 text-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-outfit">4 Trụ Cột Luyện Thi Thích Ứng AI</h2>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-950/80 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider font-bold">
                CORE PEDAGOGY
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-normal">
              Ứng dụng khoa học nhận thức và mô hình tâm trắc học để tối đa hóa hiệu suất học tập
            </p>
          </div>
          <span className="text-xs text-cyan-400 font-mono hidden sm:block">
            CHẠM ĐỂ BẮT ĐẦU
          </span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          
          {/* Card 1: Luyện Đề Thích Ứng IRT */}
          <div
            onClick={() => onNavigate('irt-test')}
            className="p-6 rounded-3xl border border-cyan-500/25 hover:border-cyan-400/60 bg-gradient-to-br from-[#121c48]/90 to-[#0c1334]/90 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:scale-[1.02] cursor-pointer space-y-4 relative group overflow-hidden transition-all duration-300 flex flex-col justify-between text-slate-100 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider font-bold">
                  (01) // 2PL IRT
                </span>
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-blue-600 group-hover:text-white transition">
                  <Zap className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition font-outfit">
                  Luyện Đề Thích Ứng 10 Câu
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-normal">
                  Tự động tăng giảm độ khó theo từng câu trả lời để xác định chính xác chỉ số năng lực thực tế.
                </p>
              </div>

              <div className="space-y-1 pt-1 text-xs text-slate-300 font-normal">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Đổi độ khó theo năng lực thực</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Dự báo điểm số THPT chuẩn xác</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-cyan-500/20 font-mono">
              <span>~10 phút làm bài</span>
              <span className="text-cyan-300 group-hover:translate-x-1 transition flex items-center gap-1 font-bold">
                Luyện ngay <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Trí Nhớ Từ Vựng Não Bộ SM-2 */}
          <div
            onClick={() => onNavigate('sm2-flashcards')}
            className="p-6 rounded-3xl border border-purple-500/25 hover:border-purple-400/60 bg-gradient-to-br from-[#1b1240]/90 to-[#100b28]/90 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] hover:scale-[1.02] cursor-pointer space-y-4 relative group overflow-hidden transition-all duration-300 flex flex-col justify-between text-slate-100 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider font-bold">
                  (02) // SM-2
                </span>
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition">
                  <BrainCircuit className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-purple-300 transition font-outfit">
                  Trí Nhớ Từ Vựng Não Bộ
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-normal">
                  Ghi nhớ sâu từ vựng SGK Mới theo quy luật nhắc lại ngắt quãng, đưa từ vựng vào bộ nhớ dài hạn.
                </p>
              </div>

              <div className="space-y-1 pt-1 text-xs text-slate-300 font-normal">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Chu kỳ quên lãng Ebbinghaus</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Flashcard kèm Audio &amp; Ví dụ</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-purple-500/20 font-mono">
              <span>~5-8 phút/ngày</span>
              <span className="text-purple-300 group-hover:translate-x-1 transition flex items-center gap-1 font-bold">
                Học từ <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 3: Socrates AI Mentor 1:1 */}
          <div
            onClick={() => onNavigate('chat')}
            className="p-6 rounded-3xl border border-indigo-500/25 hover:border-indigo-400/60 bg-gradient-to-br from-[#131b46]/90 to-[#0c1232]/90 hover:shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:scale-[1.02] cursor-pointer space-y-4 relative group overflow-hidden transition-all duration-300 flex flex-col justify-between text-slate-100 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider font-bold">
                  (03) // SOCRATES AI
                </span>
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white transition">
                  <Bot className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition font-outfit">
                  Gia Sư Socratic 1:1
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-normal">
                  Gợi mở tư duy từng bước, không mớm đáp án. Hướng dẫn giải đề chi tiết và bóc tách bẫy ngữ pháp 24/7.
                </p>
              </div>

              <div className="space-y-1 pt-1 text-xs text-slate-300 font-normal">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Dẫn dắt tự sửa lỗi sai</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Chẩn đoán bẫy Collocation THPT</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-cyan-500/20 font-mono">
              <span>Sẵn sàng 24/7</span>
              <span className="text-indigo-300 group-hover:translate-x-1 transition flex items-center gap-1 font-bold">
                Hỏi đáp <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 4: Chấm Phát Âm IPA */}
          <div
            onClick={() => onNavigate('pronounce')}
            className="p-6 rounded-3xl border border-emerald-500/25 hover:border-emerald-400/60 bg-gradient-to-br from-[#0e2438]/90 to-[#081524]/90 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:scale-[1.02] cursor-pointer space-y-4 relative group overflow-hidden transition-all duration-300 flex flex-col justify-between text-slate-100 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider font-bold">
                  (04) // 44 IPA
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <Mic className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition font-outfit">
                  Chấm Phát Âm Chuẩn IPA
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-normal">
                  Phân tích sóng âm chuẩn xác từng nguyên âm, phụ âm cuối, trọng âm và ngữ điệu câu theo bảng 44 âm quốc tế.
                </p>
              </div>

              <div className="space-y-1 pt-1 text-xs text-slate-300 font-normal">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Bảng 44 âm IPA trực quan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Chấm điểm phát âm tức thì</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-cyan-500/20 font-mono">
              <span>~5 phút luyện âm</span>
              <span className="text-emerald-300 group-hover:translate-x-1 transition flex items-center gap-1 font-bold">
                Luyện âm <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          3. HỆ SINH THÁI KỸ NĂNG THEO PHONG CÁCH DATURA CREATIVE STUDIO
      ══════════════════════════════════════════════════════════════════════ */}
      <DaturaSkillsSection 
        onNavigate={onNavigate} 
        onOpenPhotoSolver={onOpenPhotoSolver} 
      />

      {/* ══════════════════════════════════════════════════════════════════════
          4. LỘ TRÌNH 4 BƯỚC BỨT PHÁ ĐIỂM SỐ (ROYAL SAPPHIRE ROADMAP)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl bg-[#10193e]/90 border border-cyan-500/25 p-6 sm:p-8 md:p-10 shadow-2xl space-y-6 text-slate-100 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 font-outfit flex items-center gap-2 text-3d-hero">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Quy Trình Học Tập Thích Ứng Cá Nhân Hóa (4 Bước Chuẩn Khoa Học)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-normal">
              Phương pháp sư phạm giúp học sinh từ mức 5-6 điểm bứt phá đạt 8.5 - 10 điểm trong kỳ thi chính thức
            </p>
          </div>
          <button
            onClick={() => onNavigate('guide')}
            className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition cursor-pointer self-start md:self-auto"
          >
            <span>Tài liệu nghiên cứu KHKT</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#0a0f24] border border-cyan-500/20 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs">
              <span className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-[10px]">1</span>
              <span>CHẨN ĐOÁN THÍCH ỨNG</span>
            </div>
            <h4 className="text-sm font-bold text-slate-100">Làm 10 Câu Đề IRT</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Hệ thống xác định chính xác tham số năng lực θ và chỉ ra điểm yếu cần khắc phục.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0a0f24] border border-cyan-500/20 space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-mono text-xs">
              <span className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold text-[10px]">2</span>
              <span>GHI NHỚ NÃO BỘ</span>
            </div>
            <h4 className="text-sm font-bold text-slate-100">Luyện Từ Vựng SM-2</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Lặp lại ngắt quãng từ vựng then chốt và bẫy cụm từ trước khi giải đề thật.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0a0f24] border border-cyan-500/20 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-mono text-xs">
              <span className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white flex items-center justify-center font-bold text-[10px]">3</span>
              <span>GỢI MỞ SOCRATES</span>
            </div>
            <h4 className="text-sm font-bold text-slate-100">Hỏi Bài Gia Sư 1:1</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Gia sư AI dẫn dắt em phân tích các phương án gây nhiễu, hiểu bản chất cấu trúc.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0a0f24] border border-cyan-500/20 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-mono text-xs">
              <span className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-[10px]">4</span>
              <span>THỰC CHIẾN ĐỀ THẬT</span>
            </div>
            <h4 className="text-sm font-bold text-slate-100">Thi Thử 63 Tỉnh Thành</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Làm quen với áp lực thời gian, căn giờ chuẩn 50 phút và theo dõi sự tăng trưởng điểm số.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
