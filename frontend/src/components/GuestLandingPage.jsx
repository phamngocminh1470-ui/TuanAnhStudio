import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Sparkles, ArrowRight, Zap, BookOpen, 
  BrainCircuit, ShieldCheck, CheckCircle2, Award, Clock, 
  Layers, ChevronRight, Mic, Bot, FileText, Activity,
  Star, Users, TrendingUp, Target, Headphones, PenLine, Compass, Check, HelpCircle
} from 'lucide-react';

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
    <div className="text-center space-y-1 p-4 rounded-2xl bg-white/[0.02] border border-white/5 shadow-lg">
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

const COMPARISON_ROWS = [
  {
    feature: 'Phương pháp phân phối câu hỏi',
    traditional: 'Đề cố định 40-50 câu dàn trải (quá dễ hoặc quá khó)',
    adaptive: 'Thích ứng động IRT theo năng lực thực tế sau từng câu'
  },
  {
    feature: 'Học và ghi nhớ từ vựng',
    traditional: 'Học thuộc danh sách dài rồi quên sau 1-2 tuần',
    adaptive: 'Thuật toán lặp ngắt quãng SM-2 nhắc nhở đúng chu kỳ'
  },
  {
    feature: 'Chấm bài viết luận & đoạn văn',
    traditional: 'Phải chờ giáo viên chấm hàng tuần, nhận xét chung chung',
    adaptive: 'AI chấm 4 tiêu chí tức thì, sửa chi tiết từng câu + bài mẫu 9-10'
  },
  {
    feature: 'Luyện phát âm & Ngữ âm',
    traditional: 'Khó tự nhận biết lỗi phát âm khi tự học một mình',
    adaptive: 'AI chấm từng phụ âm, nguyên âm và tô màu trực quan'
  },
  {
    feature: 'Thời gian hoàn thành bài kiểm tra',
    traditional: 'Mất 50 - 60 phút / đề',
    adaptive: 'Chỉ mất 15 - 20 phút (Tiết kiệm 51% thời gian học)'
  }
];

export default function GuestLandingPage({ onOpenAuth, onStartTrial, selectedGrade, onGradeChange }) {
  const gradeList = [
    { id: '10', label: 'Khối Lớp 10' },
    { id: '11', label: 'Khối Lớp 11' },
    { id: '12', label: 'Khối Lớp 12' }
  ];

  return (
    <div className="space-y-20 w-full pb-20 max-w-[1600px] mx-auto px-4 md:px-8 animate-fade-in">

      {/* ═══════════════════════════════════════════
          HERO SECTION (ULTRA-WIDE)
      ═══════════════════════════════════════════ */}
      <section className="relative pt-6 pb-8 text-center space-y-8 overflow-hidden">
        
        {/* Background glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-emerald-500/08 rounded-full blur-[80px]" />
        </div>

        {/* Live KHKT Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-blue-950/80 to-purple-950/80 border border-blue-500/30 shadow-xl shadow-blue-500/10 backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-md shadow-cyan-400/50" />
          <span className="text-cyan-300 text-xs font-black tracking-wider uppercase">
            Đề Tài Nghiên Cứu KHKT Quốc Gia • Hệ Thống Ôn Thi THPT Thích Ứng AI
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-5 relative z-10 max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.12] font-outfit">
            Nền Tảng Ôn Thi Tiếng Anh THPT <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Thích Ứng AI &amp; Cá Nhân Hóa Toàn Diện
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Ứng dụng mô hình toán học <span className="text-white font-bold">3PL IRT</span> và thuật toán <span className="text-white font-bold">Spaced Repetition SM-2</span>. 
            Tự động chẩn đoán chính xác lỗ hổng ngữ pháp, tối ưu hóa thời gian luyện tập và bứt phá điểm số thi tốt nghiệp THPT.
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedGrade === g.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
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
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-extrabold text-sm transition cursor-pointer shadow-xl shadow-blue-600/30 flex items-center gap-2.5 glow-btn-brand"
          >
            <Sparkles className="w-4.5 h-4.5 text-cyan-300" />
            <span>Đăng Ký Tài Khoản Miễn Phí</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onStartTrial('irt-test')}
            className="px-7 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white font-bold text-sm transition flex items-center gap-2 cursor-pointer backdrop-blur-md shadow-lg"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Trải Nghiệm Thử — Không Cần Đăng Nhập</span>
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
          CORE ECOSYSTEM SHOWCASE (WIDE GRID)
      ═══════════════════════════════════════════ */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest block">
            HỆ SINH THÁI TÍNH NĂNG ĐỘT PHÁ
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white font-outfit">
            Mọi Công Cụ Bạn Cần Để Đạt Điểm 9+ Tiếng Anh
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Tích hợp toàn diện 4 kỹ năng ngôn ngữ bám sát cấu trúc đề thi Tốt nghiệp THPT mới nhất.
          </p>
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
                  <span>Trải nghiệm ngay</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          COMPARISON TABLE: AI ADAPTIVE VS TRADITIONAL
      ═══════════════════════════════════════════ */}
      <section className="glass rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl space-y-8 bg-gradient-to-b from-[#080d1e] to-[#050814]">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest block">
            SO SÁNH HIỆU QUẢ THỰC NGHIỆM
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white font-outfit">
            Học Thích Ứng AI Vượt Trội Như Thế Nào?
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-4 px-4 font-extrabold uppercase text-[11px]">Tiêu chí so sánh</th>
                <th className="py-4 px-4 font-extrabold uppercase text-[11px] text-red-400">Phương pháp truyền thống</th>
                <th className="py-4 px-4 font-extrabold uppercase text-[11px] text-cyan-300">AI English Mentor (Đề tài KHKT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {COMPARISON_ROWS.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-bold text-white max-w-xs">{row.feature}</td>
                  <td className="py-4 px-4 text-slate-400 leading-relaxed">{row.traditional}</td>
                  <td className="py-4 px-4 text-cyan-200 font-semibold leading-relaxed bg-cyan-950/10 rounded-xl">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      {row.adaptive}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BOTTOM CALL TO ACTION BANNER
      ═══════════════════════════════════════════ */}
      <section className="glass rounded-3xl p-8 md:p-12 border border-blue-500/30 shadow-2xl relative overflow-hidden bg-gradient-to-r from-blue-950/60 via-indigo-950/50 to-purple-950/60 text-center space-y-6">
        <div className="max-w-3xl mx-auto space-y-3 relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white font-outfit">
            Sẵn Sàng Bứt Phá Điểm Số Tiếng Anh THPT Ngay Hôm Nay?
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Hàng trăm học sinh đã tham gia thử nghiệm và tăng trung bình +2.4 điểm sau 4 tuần ôn tập thích ứng.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
          <button
            onClick={onOpenAuth}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-extrabold text-sm transition cursor-pointer shadow-xl shadow-blue-600/30 flex items-center gap-2.5 glow-btn-brand"
          >
            <Sparkles className="w-4.5 h-4.5 text-cyan-300" />
            <span>Tạo Tài Khoản Học Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
