import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Sparkles, ArrowRight, Zap, BookOpen, 
  BrainCircuit, ShieldCheck, CheckCircle2, Award, Clock, 
  Layers, ChevronRight, Mic, Bot, FileText, Activity,
  Star, Users, TrendingUp, Target, Headphones, PenLine, Compass, Check, HelpCircle, Search
} from 'lucide-react';
import { OFFICIAL_EXAM_LIST } from './OfficialExamRepository';

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

function StatCounter({ value, label, suffix = '', prefix = '', color = 'text-emerald-400' }) {
  const count = useCountUp(value, 1400);
  return (
    <div className="text-center space-y-1 p-5 rounded-2xl bg-white/[0.02] border border-white/5 shadow-lg">
      <div className={`text-3xl md:text-4xl font-black font-outfit tracking-tight ${color}`}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{label}</div>
    </div>
  );
}

const CORE_MODULES = [
  {
    icon: Zap,
    title: 'Đánh Giá Năng Lực Thích Ứng (IRT CAT)',
    desc: 'Thuật toán 3PL IRT tự động tính toán năng lực Theta và điều chỉnh độ khó từng câu hỏi theo thời gian thực.',
    badge: 'Mô hình Đo lường 2025',
    color: 'text-amber-400',
    bg: 'from-amber-500/10 to-orange-500/5',
    border: 'border-amber-500/20',
    tab: 'irt-test'
  },
  {
    icon: BrainCircuit,
    title: 'Ghi Nhớ Từ Vựng Não Bộ (SM-2 Spaced Repetition)',
    desc: 'Tính toán đường cong quên lãng Ebbinghaus để đưa từ vựng quay lại đúng thời điểm vàng trước khi phai mờ trí nhớ.',
    badge: 'Trí nhớ dài hạn',
    color: 'text-purple-400',
    bg: 'from-purple-500/10 to-indigo-500/5',
    border: 'border-purple-500/20',
    tab: 'sm2-flashcards'
  },
  {
    icon: PenLine,
    title: 'Chấm Bài Luận & Đoạn Văn AI 4 Tiêu Chí',
    desc: 'Cung cấp dàn ý gợi ý, từ vựng Band 8-9, bài viết mẫu chuẩn 9-10 và chấm điểm chi tiết từng câu văn theo chuẩn GDPT.',
    badge: 'Chấm thi chuẩn Bộ',
    color: 'text-pink-400',
    bg: 'from-pink-500/10 to-rose-500/5',
    border: 'border-pink-500/20',
    tab: 'writing-practice'
  },
  {
    icon: Mic,
    title: 'Chấm Phát Âm Chuẩn Quốc Tế IPA',
    desc: 'Sử dụng AI nhận diện sóng âm đối chiếu 44 âm IPA, chấm điểm độ lưu loát và chỉ ra từ phát âm sai để sửa.',
    badge: 'Azure Speech AI',
    color: 'text-emerald-400',
    bg: 'from-emerald-500/10 to-teal-500/5',
    border: 'border-emerald-500/20',
    tab: 'pronounce'
  },
  {
    icon: Compass,
    title: 'Socrates AI Tutor - Gia Sư Gợi Mở Tư Duy',
    desc: 'Gia sư 1:1 áp dụng phương pháp Socratic đặt câu hỏi dẫn dắt từng bước để học sinh tự tìm ra đáp án.',
    badge: 'Socratic Method',
    color: 'text-blue-400',
    bg: 'from-blue-500/10 to-cyan-500/5',
    border: 'border-blue-500/20',
    tab: 'chat'
  },
  {
    icon: BookOpen,
    title: 'Luyện Đọc & Nghe Thích Ứng Theo Sở Thích',
    desc: 'Tự động tạo văn bản đọc hiểu và audio đàm thoại theo chủ đề bạn quan tâm (công nghệ, du lịch, thể thao...).',
    badge: 'Cá nhân hóa 100%',
    color: 'text-cyan-400',
    bg: 'from-cyan-500/10 to-blue-500/5',
    border: 'border-cyan-500/20',
    tab: 'reading'
  }
];

export default function GuestLandingPage({ onOpenAuth, onStartTrial, selectedGrade, onGradeChange }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const gradeList = [
    { id: '10', label: 'Khối Lớp 10' },
    { id: '11', label: 'Khối Lớp 11' },
    { id: '12', label: 'Khối Lớp 12' }
  ];

  const filteredExams = OFFICIAL_EXAM_LIST.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="space-y-24 w-full pb-24 max-w-[1600px] mx-auto px-4 md:px-8 animate-fade-in">

      {/* ═══════════════════════════════════════════
          SECTION 01: HERO SHOWCASE (ULTRA-WIDE)
      ═══════════════════════════════════════════ */}
      <section className="relative pt-8 pb-4 text-center space-y-8 overflow-hidden">
        
        {/* Background glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-10 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
        </div>

        {/* Tag */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 shadow-xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase">
            01 • ĐỀ TÀI KHKT QUỐC GIA • NỀN TẢNG ÔN THI THPT THÍCH ỨNG AI
          </span>
        </div>

        {/* Clean Strong Headline */}
        <div className="space-y-4 relative z-10 max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08] font-outfit">
            Học đúng trọng tâm. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Bứt phá điểm 9+ Tiếng Anh THPT.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Ứng dụng mô hình toán học <span className="text-white font-bold">3PL IRT</span> và thuật toán <span className="text-white font-bold">Spaced Repetition SM-2</span>. 
            Tự động chẩn đoán chính xác lỗ hổng ngữ pháp, cá nhân hóa lộ trình học và dự báo điểm thi THPT Quốc gia theo thời gian thực.
          </p>
        </div>

        {/* Grade Selector Pills */}
        <div className="flex items-center justify-center gap-3 relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Khối lớp của bạn:</span>
          <div className="flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
            {gradeList.map((g) => (
              <button
                key={g.id}
                onClick={() => onGradeChange(g.id)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedGrade === g.id
                    ? 'bg-white text-black font-extrabold shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
          <button
            onClick={onOpenAuth}
            className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm transition cursor-pointer shadow-xl shadow-emerald-500/25 flex items-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Đăng Ký Tài Khoản Miễn Phí</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onStartTrial('irt-test')}
            className="px-7 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white font-bold text-sm transition flex items-center gap-2 cursor-pointer backdrop-blur-md"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Luyện Đề Thử — Không Cần Đăng Nhập</span>
          </button>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 relative z-10">
          <StatCounter value={1250} label="Từ vựng THPT" suffix="+" color="text-cyan-400" />
          <StatCounter value={500} label="Câu hỏi định chuẩn IRT" suffix="+" color="text-purple-400" />
          <StatCounter value={51} label="Tiết kiệm thời gian" suffix="%" color="text-emerald-400" />
          <StatCounter value={100} label="Hoàn toàn Miễn phí" suffix="%" color="text-amber-400" />
        </div>

      </section>

      {/* ═══════════════════════════════════════════
          SECTION 02: KHO ĐỀ TIÊU CHUẨN (EXACT MATCH SCREENSHOT)
      ═══════════════════════════════════════════ */}
      <section className="space-y-8 pt-4">
        
        {/* Section Header */}
        <div className="border-b border-white/10 pb-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono font-bold text-emerald-400 tracking-widest uppercase">
              02 • KHO ĐỀ TIÊU CHUẨN
            </span>
            <span className="h-3 w-[1px] bg-white/20" />
            <span className="text-xs text-slate-400 font-medium">Bám sát cấu trúc đề thi chính thức Bộ GD&ĐT 2026</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight font-outfit">
              Đề thật, lời giải thật.
            </h2>

            {/* Category Filter */}
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-white text-black font-extrabold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Minimalist Exam List matching screenshot */}
        <div className="divide-y divide-white/10 border-y border-white/10">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              onClick={() => onStartTrial('irt-test')}
              className="py-5 px-3 md:px-6 hover:bg-white/[0.03] transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 min-w-0 flex-1">
                <span className="text-xs font-mono font-medium text-slate-500 shrink-0">
                  {exam.date}
                </span>

                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border shrink-0 w-fit ${exam.typeColor}`}>
                  {exam.type}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm md:text-base font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 truncate font-normal">
                    {exam.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 justify-between md:justify-end">
                <div className="text-right hidden lg:block">
                  <span className="text-[11px] text-slate-500 block">{exam.questionsCount} câu • {exam.time} phút</span>
                  <span className="text-xs text-emerald-400 font-bold font-mono">Điểm TB: {exam.avgScore}</span>
                </div>

                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-white/30 group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ═══════════════════════════════════════════
          SECTION 03: HỆ SINH THÁI AI ĐỘT PHÁ
      ═══════════════════════════════════════════ */}
      <section className="space-y-8">
        <div className="border-b border-white/10 pb-6 space-y-2">
          <span className="text-[11px] font-mono font-bold text-cyan-400 tracking-widest uppercase">
            03 • HỆ THỐNG CÔNG CỤ HỌC TẬP
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white font-outfit">
            Mọi Công Cụ Cá Nhân Hóa 1:1
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_MODULES.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div
                key={idx}
                onClick={() => onStartTrial(mod.tab)}
                className={`glass-card glass-card-hover rounded-3xl p-7 border ${mod.border} space-y-4 cursor-pointer group shadow-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b ${mod.bg}`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className={`w-6 h-6 ${mod.color}`} />
                  </div>
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border bg-white/5 ${mod.color} border-white/10`}>
                    {mod.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-extrabold text-white font-outfit group-hover:text-cyan-300 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-white transition-colors border-t border-white/5">
                  <span>Trải nghiệm tính năng</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 04: CTA BANNER
      ═══════════════════════════════════════════ */}
      <section className="p-8 md:p-12 rounded-3xl border border-white/10 text-center space-y-6 bg-[#080d1a] shadow-2xl">
        <div className="max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl md:text-4xl font-black text-white font-outfit">
            Sẵn sàng bứt phá điểm số Tiếng Anh THPT?
          </h2>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            Hệ thống hoàn toàn phi lợi nhuận phục vụ học sinh cả nước chuẩn bị cho kỳ thi tốt nghiệp THPT Quốc gia.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenAuth}
            className="px-8 py-4 rounded-2xl bg-white text-black hover:bg-slate-200 font-black text-sm transition cursor-pointer shadow-xl flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Tạo Tài Khoản Học Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
