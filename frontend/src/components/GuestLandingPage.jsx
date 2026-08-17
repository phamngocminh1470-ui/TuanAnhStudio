import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Sparkles, ArrowRight, Zap, BookOpen, 
  BrainCircuit, ShieldCheck, CheckCircle2, Award, Clock, 
  Layers, ChevronRight, Mic, Bot, FileText, Activity,
  Star, Users, TrendingUp, Target, Headphones, PenLine, Trophy
} from 'lucide-react';

// Animated counter hook
function useCountUp(end, duration = 1500, start = 0) {
  const [count, setCount] = useState(start);
  useEffect(() => {
    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Easing: ease-out
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
    <div className="text-center space-y-1 animate-fade-in">
      <div className={`text-3xl font-black font-mono tracking-tight ${color}`}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{label}</div>
    </div>
  );
}

const FEATURES = [
  {
    icon: Zap,
    title: 'Luyện đề thích ứng IRT',
    desc: 'AI tự điều chỉnh độ khó theo năng lực thực sự — không học dàn trải',
    color: 'text-amber-400',
    bg: 'from-amber-500/12 to-orange-500/8',
    border: 'border-amber-500/20',
    tab: 'irt-test'
  },
  {
    icon: BrainCircuit,
    title: 'Ghi nhớ từ vựng não bộ',
    desc: 'Thuật toán SuperMemo-2 nhắc lại đúng thời điểm trước khi quên',
    color: 'text-violet-400',
    bg: 'from-violet-500/12 to-purple-500/8',
    border: 'border-violet-500/20',
    tab: 'sm2-flashcards'
  },
  {
    icon: Mic,
    title: 'Chấm phát âm chuẩn IPA',
    desc: 'Azure Speech AI phân tích từng âm tiết với điểm số chính xác',
    color: 'text-emerald-400',
    bg: 'from-emerald-500/12 to-teal-500/8',
    border: 'border-emerald-500/20',
    tab: 'pronounce'
  },
  {
    icon: BookOpen,
    title: 'Đọc hiểu thích ứng AI',
    desc: 'Đoạn văn tự điều chỉnh theo sở thích và khối lớp của bạn',
    color: 'text-cyan-400',
    bg: 'from-cyan-500/12 to-blue-500/8',
    border: 'border-cyan-500/20',
    tab: 'reading'
  },
  {
    icon: Headphones,
    title: 'Luyện nghe tương tác',
    desc: 'Audio bản ngữ tự sinh câu hỏi bắt từ khóa theo thời gian thực',
    color: 'text-purple-400',
    bg: 'from-purple-500/12 to-indigo-500/8',
    border: 'border-purple-500/20',
    tab: 'listening'
  },
  {
    icon: Bot,
    title: 'Gia sư AI hội thoại 1:1',
    desc: 'Chat trực tiếp với AI mentor 24/7 — sửa lỗi ngữ pháp tức thì',
    color: 'text-blue-400',
    bg: 'from-blue-500/12 to-indigo-500/8',
    border: 'border-blue-500/20',
    tab: 'chat'
  }
];

const SOCIAL_PROOF = [
  { text: '"Tăng từ 6.5 lên 8.2 sau 3 tuần"', author: 'Nguyễn Minh Tuấn — Lớp 12 Hà Nội' },
  { text: '"Chấm phát âm chính xác hơn giáo viên"', author: 'Lê Thu Hà — Lớp 11 TP.HCM' },
  { text: '"AI gia sư giải thích rất dễ hiểu"', author: 'Trần Đức Anh — Lớp 9 Đà Nẵng' },
];

export default function GuestLandingPage({ onOpenAuth, onStartTrial, selectedGrade, onGradeChange }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % SOCIAL_PROOF.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-20 pb-20 max-w-6xl mx-auto px-4 animate-fade-in">

      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      <section className="relative pt-8 pb-4 text-center space-y-8 aurora-bg overflow-hidden">
        {/* Background blur orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px]" />
          <div className="absolute top-10 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
          <div className="absolute top-20 left-1/2 w-48 h-48 bg-violet-500/08 rounded-full blur-[60px]" />
        </div>

        {/* Live badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-950/70 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
          <span className="text-emerald-300 text-xs font-black tracking-wider uppercase">
            Nền tảng KHKT Quốc Gia • 100% Miễn Phí • Chuẩn GDPT 2027
          </span>
        </div>

        {/* Main headline */}
        <div className="space-y-4 relative z-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-4xl mx-auto font-outfit">
            Chinh phục{' '}
            <span className="text-gradient-animate">Tiếng Anh THPT</span>
            <br />
            bằng trí tuệ nhân tạo
          </h1>

          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Hệ thống AI đo lường năng lực theo mô hình{' '}
            <span className="text-white font-semibold">2PL IRT</span> và thuật toán{' '}
            <span className="text-white font-semibold">SuperMemo-2</span>.
            Không học dàn trải — chỉ tối ưu đúng lỗ hổng để bứt phá điểm số.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
          <button
            onClick={onOpenAuth}
            id="hero-cta-register"
            className="btn-hero px-8 py-4 flex items-center gap-2.5 cursor-pointer"
          >
            <Sparkles className="w-4.5 h-4.5" />
            <span>Bắt đầu miễn phí ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onStartTrial('irt-test')}
            id="hero-cta-trial"
            className="px-7 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold text-sm transition-all duration-250 flex items-center gap-2 cursor-pointer backdrop-blur-sm"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Luyện đề thử — không cần đăng nhập</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="relative z-10 pt-4 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          <StatCounter value={1250} label="Từ vựng THPT" suffix="+" color="text-emerald-400" />
          <StatCounter value={480} label="Câu hỏi IRT" suffix="+" color="text-blue-400" />
          <StatCounter value={100} label="Miễn phí" suffix="%" color="text-amber-400" />
        </div>

        {/* Floating preview card */}
        <div className="relative z-10 pt-6 flex justify-center">
          <div className="w-full max-w-md p-5 rounded-2xl bg-[#071018]/90 border border-white/08 shadow-2xl shadow-black/40 backdrop-blur-2xl animate-float">
            {/* Card header */}
            <div className="flex items-center justify-between border-b border-white/06 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">
                  NĂNG LỰC THỰC THỜ GIAN
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono bg-white/04 px-2 py-0.5 rounded">
                2PL-IRT · θ = 1.24
              </span>
            </div>

            {/* Skill bars */}
            {[
              { label: 'Ngữ pháp & Cú pháp', val: 78, color: 'bg-blue-500' },
              { label: 'Từ vựng học thuật', val: 65, color: 'bg-emerald-500' },
              { label: 'Đọc hiểu suy luận', val: 82, color: 'bg-violet-500' },
            ].map((skill, i) => (
              <div key={i} className="space-y-1.5 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-300 font-semibold">{skill.label}</span>
                  <span className="text-[11px] text-slate-400 font-mono">{skill.val}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/06 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${skill.color} transition-all duration-1000`}
                    style={{ width: `${skill.val}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Prediction */}
            <div className="mt-4 pt-3 border-t border-white/06 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-semibold">Dự báo điểm thi THPT</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-emerald-400 font-mono">8.6</span>
                <span className="text-slate-400 text-xs">/10</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SOCIAL PROOF TICKER
      ═══════════════════════════════════════════ */}
      <div className="flex items-center justify-center gap-6">
        <div className="flex -space-x-2">
          {['TM', 'LH', 'DA', 'NH', 'PQ'].map((initials, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 border-[#070a14] flex items-center justify-center text-[9px] font-black text-white"
              style={{ background: ['#3b82f6','#10b981','#8b5cf6','#f59e0b','#ef4444'][i] + '99' }}
            >
              {initials}
            </div>
          ))}
        </div>
        <div className="text-sm text-slate-300 transition-all duration-500 animate-fade-in" key={activeTestimonial}>
          <span className="text-white font-semibold italic">{SOCIAL_PROOF[activeTestimonial].text}</span>
          {' '}—{' '}
          <span className="text-slate-400 text-xs">{SOCIAL_PROOF[activeTestimonial].author}</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          TWO PATHS SECTION
      ═══════════════════════════════════════════ */}
      <section className="space-y-6">
        <div className="text-center space-y-3">
          <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block">
            PHÂN HỆ HỌC TẬP CHUẨN HÓA
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-outfit">
            Một học sinh,{' '}
            <span className="text-gradient-animate">hai đường vào.</span>
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Tối ưu hóa kiến thức riêng biệt cho từng bậc học theo khung chương trình GDPT 2018 của Bộ GD&ĐT.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* THPT Card */}
          <div 
            onClick={() => { onGradeChange('12'); onStartTrial('irt-test'); }}
            className="group relative p-8 rounded-3xl cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{
              background: 'linear-gradient(145deg, rgba(9,27,29,0.95) 0%, rgba(7,20,31,0.95) 60%, rgba(7,12,20,0.95) 100%)',
              border: '1px solid rgba(16,185,129,0.25)',
              boxShadow: '0 0 0 0 rgba(16,185,129,0)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 20px 50px -12px rgba(16,185,129,0.2), 0 0 0 1px rgba(16,185,129,0.3)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 0 0 rgba(16,185,129,0)'}
          >
            {/* Glow orb */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-emerald-500/12 rounded-full blur-3xl pointer-events-none -mr-14 -mt-14 group-hover:bg-emerald-500/18 transition-all duration-500" />
            
            {/* Top badge */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-black px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                THPT • CẤP 3 (LỚP 10 – 11 – 12)
              </span>
              <ChevronRight className="w-4 h-4 text-emerald-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>

            <div className="space-y-3 mb-6">
              <div className="text-5xl font-black text-emerald-400 font-mono tracking-tight">
                2 + 2{' '}
                <span className="text-lg text-slate-500 font-normal">| DGNL</span>
              </div>
              <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                Kỳ thi tốt nghiệp THPT & Đánh giá năng lực
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Chuẩn cấu trúc Đổi mới GD&ĐT 2027. Đề thi HSA ĐHQG Hà Nội, TSA Bách Khoa, V-ACT TP.HCM.
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-white/06">
              {[
                'SGK Global Success & Friends Global Lớp 10–12',
                'Kho 1,250+ từ vựng học thuật thuật toán SM-2',
                'Chấm phát âm chuẩn IPA qua Azure Speech AI'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="w-full py-3 px-4 rounded-xl bg-emerald-500/15 group-hover:bg-emerald-500/25 border border-emerald-500/25 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all">
                <span>Vào ôn luyện THPT Cấp 3</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* THCS Card */}
          <div 
            onClick={() => { onGradeChange('9'); onStartTrial('reading'); }}
            className="group relative p-8 rounded-3xl cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{
              background: 'linear-gradient(145deg, rgba(14,22,40,0.95) 0%, rgba(11,18,32,0.95) 60%, rgba(7,12,20,0.95) 100%)',
              border: '1px solid rgba(59,130,246,0.22)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 20px 50px -12px rgba(59,130,246,0.2), 0 0 0 1px rgba(59,130,246,0.28)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            {/* Glow orb */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-14 -mt-14 group-hover:bg-blue-500/16 transition-all duration-500" />
            
            {/* Top badge */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-black px-3 py-1.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                THCS • CẤP 2 (LỚP 6 – 7 – 8 – 9)
              </span>
              <ChevronRight className="w-4 h-4 text-blue-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>

            <div className="space-y-3 mb-6">
              <div className="text-5xl font-black text-blue-400 font-mono tracking-tight">
                VÀO 10{' '}
                <span className="text-lg text-slate-500 font-normal">| NỀN TẢNG</span>
              </div>
              <h3 className="text-xl font-extrabold text-white group-hover:text-blue-300 transition-colors">
                Thi Tuyển Sinh Vào Lớp 10 & Bứt Phá Nền Tảng
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ngữ pháp căn bản, từ vựng theo chủ điểm đời sống, luyện đọc hiểu theo SGK mới và chuẩn bị cho kỳ thi vào 10.
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-white/06">
              {[
                'Chương trình SGK Lớp 6–9 theo khung GDPT 2018',
                'Luyện nghe giọng chuẩn bản xứ tương tác',
                'Gia sư AI 1:1 giải thích bài tập nhẹ nhàng'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="w-full py-3 px-4 rounded-xl bg-blue-600/20 group-hover:bg-blue-600/30 border border-blue-500/25 text-blue-300 font-bold text-xs flex items-center justify-center gap-2 transition-all">
                <span>Vào ôn luyện THCS Cấp 2</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6 FEATURES GRID
      ═══════════════════════════════════════════ */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-blue-400 uppercase tracking-widest block">
            HỆ SINH THÁI AI TOÀN DIỆN
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-outfit">
            6 công cụ AI — một nền tảng
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <button
                key={i}
                onClick={() => onStartTrial(feat.tab)}
                className="group feature-card p-5 text-left cursor-pointer animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Top gradient stripe */}
                <div className={`absolute inset-x-0 top-0 h-0.5 rounded-t-xl bg-gradient-to-r ${feat.bg} opacity-60 group-hover:opacity-100 transition-opacity`} />
                
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feat.bg} border ${feat.border} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${feat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className={`text-sm font-bold text-white group-hover:${feat.color} transition-colors`}>
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>

                <div className={`mt-3 flex items-center gap-1 text-xs font-bold ${feat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                  <span>Thử ngay</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PHILOSOPHY QUOTE BLOCK
      ═══════════════════════════════════════════ */}
      <section className="relative p-8 md:p-12 rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(9,14,26,0.98), rgba(9,14,26,0.98))',
          border: '1px solid rgba(255,255,255,0.07)'
        }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/05 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/05 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 max-w-8 bg-emerald-500/40" />
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
              TRIẾT LÝ THÍCH ỨNG CÁ NHÂN HÓA
            </span>
          </div>
          <blockquote className="text-xl md:text-2xl font-bold text-white font-outfit leading-snug">
            "Chúng tôi không dạy nhanh hơn. AI đọc lỗ hổng và đo đường cong hiểu biết của từng em, rồi chỉ gửi lại bài em phải làm tiếp."
          </blockquote>
          <p className="text-sm text-slate-400 leading-relaxed">
            Thay vì phát hàng trăm câu hỏi giống nhau, mô hình{' '}
            <strong className="text-slate-200">Item Response Theory (2PL)</strong> liên tục cập nhật chỉ số năng lực θ, đưa ra câu hỏi khớp chính xác với vùng phát triển gần nhất (ZPD) của học sinh.
          </p>
        </div>

        <div className="relative mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/06">
          {[
            { title: 'Đề thật', desc: 'Bám sát cấu trúc đề thi chính thức của Bộ GD&ĐT và các ĐHQG' },
            { title: 'Giải thật', desc: 'Từng bước sư phạm rõ ràng, phân tích ngữ pháp, không lan man' },
            { title: 'Điểm thật', desc: 'Dự báo chính xác phổ điểm thi THPT theo toán học xác suất' },
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <span className="text-sm font-extrabold text-white block">{item.title}</span>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════ */}
      <section className="relative rounded-3xl overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(8,145,178,0.1) 50%, rgba(99,102,241,0.08) 100%)',
            border: '1px solid rgba(16,185,129,0.2)'
          }}
        />
        {/* Glowing orb */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-80 h-80 bg-emerald-500/08 rounded-full blur-[80px]" />
        </div>
        
        <div className="relative p-10 md:p-14 text-center space-y-5">
          <div className="inline-flex items-center gap-2 badge-live mb-2">
            Miễn phí 100%
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-white font-outfit">
            Bắt đầu hành trình bứt phá<br />
            <span className="text-gradient-animate">điểm số ngay hôm nay</span>
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Đăng ký tài khoản trong 10 giây để lưu lại toàn bộ lịch sử học tập, biểu đồ năng lực và tiến trình cá nhân.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenAuth}
              id="footer-cta-register"
              className="btn-hero px-8 py-4 inline-flex items-center gap-2.5 cursor-pointer"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Tạo tài khoản / Đăng nhập miễn phí</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onStartTrial('irt-test')}
              className="px-6 py-4 rounded-xl bg-white/05 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold text-sm transition-all cursor-pointer"
            >
              Thử không cần đăng nhập →
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 opacity-60">
            {[
              { icon: ShieldCheck, label: 'Bảo mật dữ liệu' },
              { icon: Award, label: 'Chuẩn Bộ GD&ĐT' },
              { icon: Star, label: 'Nghiên cứu KHKT' },
            ].map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div key={i} className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                  <Icon className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
