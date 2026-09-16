import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Zap, BookOpen, BrainCircuit, ShieldCheck, 
  CheckCircle2, Award, Clock, Layers, ChevronRight, Mic, Bot, 
  FileText, Activity, Star, Users, TrendingUp, Target, Headphones, 
  PenLine, Compass, Check, HelpCircle, Search, Flame, ChevronDown, 
  CheckCheck, BarChart3, MessageSquare, Play, Volume2, MoveRight, 
  Sliders, Eye, Shuffle, ExternalLink, RefreshCw, Sparkle, UserPlus, LogIn,
  Sparkles, Terminal, Code2, GraduationCap, Cpu, Smartphone, Download, Apple
} from 'lucide-react';
import { OFFICIAL_EXAM_LIST } from '../data/officialExamsData';
import MobileInstallModal from './MobileInstallModal';

// Hook đếm số mượt mà (Smooth Eased Counter)
function useCountUp(end, duration = 1400, start = 0) {
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

// Cột thống kê chuẩn Studio (Datura Statistics Column - Royal Sapphire Theme)
function DaturaStatCol({ index, value, suffix = '', label, desc }) {
  const count = useCountUp(value, 1500);
  return (
    <div className="flex flex-col border-t border-cyan-500/20 pt-6 sm:pt-8 transition-colors duration-300 hover:border-cyan-400/50 group">
      <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-cyan-400/80 uppercase mb-3">
        <span>{index}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
      </div>
      <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-outfit text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-cyan-300 to-blue-400 tracking-tight tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs sm:text-sm font-bold text-slate-200 mt-2 tracking-wide">
        {label}
      </div>
      {desc && (
        <p className="text-[12px] text-slate-400 font-normal mt-1 leading-relaxed">
          {desc}
        </p>
      )}
    </div>
  );
}

export default function GuestLandingPage({ onOpenAuth, onStartTrial, selectedGrade, onGradeChange }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState(0);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // State cho các Simulator tương tác trực tiếp trên Bento
  const [simTheta, setSimTheta] = useState(1.4);
  const [simIpaTesting, setSimIpaTesting] = useState(false);
  const [simIpaScore, setSimIpaScore] = useState(94);
  const [simCardFlipped, setSimCardFlipped] = useState(false);
  const [simShuffled, setSimShuffled] = useState(false);

  const gradeList = [
    { id: '10', label: 'Khối 10' },
    { id: '11', label: 'Khối 11' },
    { id: '12', label: 'Khối 12' }
  ];

  const filteredExams = OFFICIAL_EXAM_LIST.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  }).slice(0, 6);

  const faqs = [
    {
      q: 'Hệ thống Examora AI có hoàn toàn miễn phí không?',
      a: 'Hoàn toàn miễn phí 100%! Đây là công trình đề tài nghiên cứu Khoa học Kỹ thuật (KHKT) được phát triển phi lợi nhuận nhằm hỗ trợ học sinh cả nước tiếp cận nền tảng học tập thích ứng cá nhân hóa chất lượng cao.'
    },
    {
      q: 'Mô hình thích ứng IRT (Item Response Theory) hoạt động như thế nào?',
      a: 'Khác với các bài kiểm tra truyền thống (ai cũng làm đề giống nhau), mô hình 2PL IRT sẽ tự động tính toán năng lực hiện tại (Theta θ) của bạn. Nếu bạn trả lời đúng, hệ thống sẽ tăng độ khó câu tiếp theo; nếu trả lời sai, hệ thống sẽ đưa ra câu hỏi cơ bản để chẩn đoán chính xác lỗ hổng kiến thức.'
    },
    {
      q: 'Tại sao cần đăng ký tài khoản với tên đăng nhập và mật khẩu?',
      a: 'Khi đăng ký tài khoản cá nhân, toàn bộ dữ liệu chỉ số năng lực Theta (θ), tiến độ ghi nhớ từ vựng SM-2, lịch sử luyện đề và huy hiệu của bạn sẽ được lưu trữ vĩnh viễn trên máy chủ, giúp bạn học tiếp trên điện thoại hoặc máy tính bất kỳ lúc nào.'
    },
    {
      q: 'Hệ thống có bám sát chương trình Giáo dục Phổ thông mới (GDPT 2018) không?',
      a: 'Toàn bộ ngân hàng câu hỏi, từ vựng theo Unit và các đề thi đều được biên soạn bám sát cấu trúc đề thi tốt nghiệp THPT đổi mới của Bộ Giáo dục & Đào tạo.'
    }
  ];

  return (
    <div className="w-full bg-[#0c122c] text-slate-100 transition-colors duration-300 select-text">
      
      {/* Expansive Edge-to-Edge Container */}
      <div className="w-full px-4 sm:px-6 md:px-12 2xl:px-16 space-y-24 md:space-y-32 pt-6 pb-20">

        {/* ═══════════════════════════════════════════════════════════
            SECTION 01: HERO SECTION (BENTO TECH AESTHETIC - NO 3D SPHERE)
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative pt-8 sm:pt-14 md:pt-20 pb-6 flex flex-col items-center text-center">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] lg:w-[1200px] h-[500px] bg-gradient-to-tr from-blue-600/10 via-cyan-500/08 to-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

          {/* Top System Identification Pill Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-[11px] font-mono tracking-widest text-cyan-300 uppercase shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <span className="text-cyan-200 font-bold">(025)</span>
              <span>// EXAMORA AI LABS • VIETNAM</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-mono tracking-wider text-emerald-300 uppercase shadow-[0_0_12px_rgba(16,185,129,0.1)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot shadow-[0_0_8px_#10b981]" />
              <span>SYSTEM ACTIVE • GDPT 2018 THÍCH ỨNG</span>
            </div>
          </div>

          {/* Main Editorial Headline */}
          <div className="max-w-5xl mx-auto space-y-6 sm:space-y-7">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-extrabold tracking-[-0.03em] leading-[1.08] font-outfit">
              <span>Khảo Thí Tiếng Anh Thích Ứng.</span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-400 to-indigo-400 drop-shadow-[0_2px_15px_rgba(56,189,248,0.25)]">
                Đột Phá Bằng Trí Tuệ Nhân Tạo.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
              Nền tảng Gia sư & Khảo thí AI kết hợp mô hình đo lường toán học <span className="text-cyan-300 font-semibold">2PL IRT</span>, 
              thuật toán ghi nhớ não bộ <span className="text-indigo-300 font-semibold">Spaced Repetition SM-2</span> và chuẩn ngữ âm <span className="text-amber-300 font-semibold">44 Âm IPA</span>.
            </p>
          </div>

          {/* Grade Selector */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6 sm:pt-7">
            <span className="text-[11px] font-mono text-cyan-400/80 uppercase tracking-widest">KHỐI LỚP:</span>
            <div className="flex items-center p-1 rounded-full bg-[#10193e] border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-black/40">
              {gradeList.map((g) => (
                <button
                  key={g.id}
                  onClick={() => onGradeChange(g.id)}
                  className={`px-5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedGrade === g.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 pt-8 sm:pt-9 z-10">
            <button
              onClick={() => onOpenAuth && onOpenAuth('register')}
              className="btn-3d-primary px-8 sm:px-9 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold flex items-center gap-2.5 cursor-pointer group shadow-xl shadow-cyan-950/50"
            >
              <UserPlus className="w-4 h-4 text-cyan-200" />
              <span>Đăng Ký Tài Khoản (Miễn Phí)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onOpenAuth && onOpenAuth('login')}
              className="btn-3d-secondary px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-cyan-400" />
              <span>Đăng Nhập</span>
            </button>

            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold flex items-center gap-2 cursor-pointer bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/35 hover:to-teal-600/35 border border-emerald-400/40 text-emerald-300 transition-all shadow-lg shadow-emerald-950/30 group"
            >
              <Smartphone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Cài App Điện Thoại</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                PWA
              </span>
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              REPLACEMENT FOR 3D SPHERE: MACOS TECH CODE ENGINE MOCKUP WINDOW
          ═══════════════════════════════════════════════════════════ */}
          <div className="w-full max-w-4xl mx-auto mt-12 sm:mt-16 text-left">
            <div className="mockup-window">
              {/* Window Header */}
              <div className="window-header justify-between">
                <div className="flex items-center gap-2">
                  <span className="window-dot dot-red" />
                  <span className="window-dot dot-yellow" />
                  <span className="window-dot dot-green" />
                  <span className="ml-3 font-mono text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    examora-adaptive-engine.ts
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                  <span className="hidden sm:inline-block text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/40">TypeScript 5.0</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    LIVE ENGINE
                  </span>
                </div>
              </div>

              {/* Code Body */}
              <div className="p-5 sm:p-7 font-mono text-xs sm:text-sm leading-relaxed bg-[#080d22]/90 text-slate-300 overflow-x-auto">
                <div className="text-slate-500 italic mb-2">
                  {'// Thuật toán đo lường năng lực học sinh theo Mô hình 2PL Item Response Theory'}
                </div>
                <div>
                  <span className="text-purple-400">import</span> &#123; <span className="text-sky-300">calculateItemInformation</span>, <span className="text-sky-300">estimateThetaMLE</span> &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">'@examora/psychometrics'</span>;
                </div>
                <div className="mt-2">
                  <span className="text-purple-400">export function</span> <span className="text-yellow-300">selectNextAdaptiveItem</span>(
                  <br />
                  &nbsp;&nbsp;<span className="text-slate-200">studentTheta</span>: <span className="text-cyan-400">number</span>,
                  <br />
                  &nbsp;&nbsp;<span className="text-slate-200">itemBank</span>: <span className="text-cyan-400">QuestionItem[]</span>
                  <br />
                  ): <span className="text-cyan-400">QuestionItem</span> &#123;
                </div>
                <div className="pl-6 space-y-1 text-slate-400">
                  <div><span className="text-slate-500">{'// Xác suất làm đúng: P(θ) = 1 / (1 + exp(-1.7 * a * (θ - b)))'}</span></div>
                  <div>
                    <span className="text-purple-400">const</span> <span className="text-sky-300">rankedItems</span> = itemBank.<span className="text-yellow-300">map</span>(q =&gt; (&#123;
                  </div>
                  <div className="pl-6">
                    ...q,
                    <br />
                    <span className="text-slate-300">infoScore</span>: <span className="text-yellow-300">calculateItemInformation</span>(studentTheta, q.<span className="text-cyan-300">discrimination_a</span>, q.<span className="text-cyan-300">difficulty_b</span>)
                  </div>
                  <div>&#125;));</div>
                  <div className="text-emerald-400 font-semibold pt-1">
                    <span className="text-purple-400">return</span> rankedItems.<span className="text-yellow-300">sort</span>((x, y) =&gt; y.infoScore - x.infoScore)[<span className="text-orange-400">0</span>]; <span className="text-slate-500">{'// Cực đại hóa lượng thông tin'}</span>
                  </div>
                </div>
                <div className="mt-1">&#125;</div>

                {/* Telemetry output box */}
                <div className="mt-4 pt-4 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs bg-[#050816]/70 p-3 rounded-xl border border-cyan-900/40">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">● NĂNG LỰC HIỆN TẠI (θ):</span>
                    <span className="text-emerald-300 font-bold">+1.42 (Khá Giỏi • Chuẩn 9+)</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                    <span>ĐỘ CHUẨN XÁC: <strong className="text-cyan-300">99.4%</strong></span>
                    <span>ĐỘ TRỄ: <strong className="text-cyan-300">38ms</strong></span>
                    <span>BỘ NHỚ: <strong className="text-purple-300">SM-2 Active</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 02: STATISTICS MATRIX (ROLLING NUMBERS)
        ═══════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <DaturaStatCol
            index="(01)"
            value={1250}
            suffix="+"
            label="Từ Vựng SGK Cốt Lõi"
            desc="Tích hợp phiên âm 44 IPA, bản dịch ngữ cảnh và bài tập phản xạ."
          />
          <DaturaStatCol
            index="(02)"
            value={500}
            suffix="+"
            label="Câu Hỏi Định Chuẩn IRT"
            desc="Định dạng cấu trúc Đổi mới 2025 theo chuẩn khung năng lực Bộ GD&ĐT."
          />
          <DaturaStatCol
            index="(03)"
            value={51}
            suffix="%"
            label="Tiết Kiệm Thời Gian Ôn Luyện"
            desc="Tập trung chính xác vào vùng kiến thức khuyết thiếu thay vì giải đề tràn lan."
          />
          <DaturaStatCol
            index="(04)"
            value={100}
            suffix="%"
            label="Hoàn Toàn Phi Lợi Nhuận"
            desc="Đề tài nghiên cứu Khoa học Kỹ thuật phục vụ học sinh cả nước."
          />
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 03: GIANT EDITORIAL MARQUEE TICKER
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden border-y border-cyan-500/20 py-6 sm:py-8 -mx-4 sm:-mx-6 md:-mx-12 2xl:-mx-16 bg-[#10193e]/50 backdrop-blur-md">
          <div className="animate-datura-marquee flex items-center gap-12 sm:gap-16 whitespace-nowrap text-3xl sm:text-5xl md:text-6xl font-bold font-outfit text-cyan-400/35 tracking-tighter uppercase select-none">
            <span className="flex items-center gap-4">
              <span>AI-POWERED ENGLISH</span>
              <span className="text-cyan-500/30">/</span>
              <span>2PL IRT ADAPTIVE ENGINE</span>
              <span className="text-cyan-500/30">/</span>
              <span>44 IPA ACOUSTIC RADAR</span>
              <span className="text-cyan-500/30">/</span>
              <span>SOCRATES PEDAGOGICAL AI</span>
              <span className="text-cyan-500/30">/</span>
              <span>SPACED REPETITION SM-2</span>
              <span className="text-cyan-500/30">/</span>
              <span>TEACHER EXAM STUDIO 4.0</span>
              <span className="text-cyan-500/30">/</span>
            </span>
            <span className="flex items-center gap-4">
              <span>AI-POWERED ENGLISH</span>
              <span className="text-cyan-500/30">/</span>
              <span>2PL IRT ADAPTIVE ENGINE</span>
              <span className="text-cyan-500/30">/</span>
              <span>44 IPA ACOUSTIC RADAR</span>
              <span className="text-cyan-500/30">/</span>
              <span>SOCRATES PEDAGOGICAL AI</span>
              <span className="text-cyan-500/30">/</span>
              <span>SPACED REPETITION SM-2</span>
              <span className="text-cyan-500/30">/</span>
              <span>TEACHER EXAM STUDIO 4.0</span>
              <span className="text-cyan-500/30">/</span>
            </span>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 04: BENTO GRID 2.0 (INTERACTIVE CAPABILITIES MATRIX)
        ═══════════════════════════════════════════════════════════ */}
        <section className="space-y-10">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-cyan-500/20 pb-8">
            <div className="space-y-3">
              <div className="text-[11px] font-mono tracking-widest text-cyan-400/80 uppercase">
                // SYSTEM ARCHITECTURE & BENTO MATRIX
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight font-outfit">
                <span className="text-slate-100">6 Trụ Cột Đột Phá</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
                  Được Tích Hợp Đồng Bộ.
                </span>
              </h2>
            </div>
            <p className="text-slate-300 text-sm sm:text-base max-w-md leading-relaxed font-normal">
              Trải nghiệm tương tác trực tiếp từng công nghệ lõi ngay trên các thẻ Bento bên dưới.
            </p>
          </div>

          {/* BENTO GRID CONTAINER */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* ── CARD 1: 2PL IRT (SPAN 8 COLS) ── */}
            <div className="md:col-span-12 lg:col-span-8 bento-card flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 font-bold uppercase">
                    <Zap className="w-3.5 h-3.5" />
                    <span>01 • THUẬT TOÁN ĐO LƯỜNG TOÁN HỌC</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Item Response Theory</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-outfit text-slate-100">
                  Mô Hình Đo Lường Thích Ứng 2PL IRT
                </h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-2xl">
                  Đo lường chính xác năng lực Theta (θ) sau từng câu trả lời. Hệ thống tự động chọn câu hỏi có lượng thông tin Fisher cực đại, tối ưu hóa điểm số kỳ thi THPT.
                </p>
              </div>

              {/* Live Interactive Slider & Curve */}
              <div className="p-5 rounded-2xl bg-[#080d22]/90 border border-cyan-500/25 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">KÉO THANH TRƯỢT NĂNG LỰC (THETA θ):</span>
                  <span className="text-cyan-300 font-extrabold text-base bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/40">
                    θ = {simTheta > 0 ? `+${simTheta.toFixed(2)}` : simTheta.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={simTheta}
                  onChange={(e) => setSimTheta(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-[#0c122c] rounded-lg"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>-3.0 (Cơ bản)</span>
                  <span>0.0 (Trung bình)</span>
                  <span className="text-cyan-300 font-semibold">+3.0 (Chuyên sâu 9+)</span>
                </div>

                {/* S-Curve Graph */}
                <div className="pt-2">
                  <div className="text-[11px] font-mono text-slate-400 flex justify-between mb-2">
                    <span>XÁC SUẤT LÀM ĐÚNG THEO ĐỘ KHÓ CÂU HỎI</span>
                    <span className="text-cyan-400 font-bold">P(θ) = 1 / (1 + e^-1.7a(θ-b))</span>
                  </div>
                  <div className="h-24 flex items-end justify-between gap-1.5 pt-2 px-2 border-b border-l border-cyan-500/30">
                    {[-3, -2, -1, 0, 1, 2, 3].map((val, idx) => {
                      const prob = 1 / (1 + Math.exp(-1.5 * (val - simTheta)));
                      const heightPercent = Math.max(12, Math.min(100, Math.round(prob * 100)));
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            style={{ height: `${heightPercent}%` }} 
                            className="w-full bg-gradient-to-t from-blue-600 via-cyan-500 to-cyan-300 rounded-t transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                          />
                          <span className="text-[10px] font-mono text-slate-400">{val > 0 ? `+${val}` : val}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── CARD 2: RADAR 44 IPA (SPAN 4 COLS) ── */}
            <div className="md:col-span-12 lg:col-span-4 bento-card flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-[11px] font-mono text-indigo-300 font-bold uppercase">
                    <Mic className="w-3.5 h-3.5" />
                    <span>02 • SPEECH RADAR</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold font-outfit text-slate-100">
                  Radar Phân Tích 44 Âm IPA
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Bóc tách sóng âm mili-giây, bắt lỗi phát âm phụ âm cuối (/s/, /t/, /ed/) và độ chuẩn ngữ điệu.
                </p>
              </div>

              {/* Interactive Speech Visualizer */}
              <div className="p-4 rounded-2xl bg-[#080d22]/90 border border-cyan-500/25 space-y-4 text-center">
                <div className="flex justify-center items-center gap-1.5 h-12">
                  {[40, 70, 95, 60, 85, 100, 75, 45, 90, 65, 80, 50].map((h, i) => (
                    <span 
                      key={i} 
                      style={{ height: simIpaTesting ? `${Math.floor(Math.random() * 80 + 20)}%` : `${h * 0.45}%` }}
                      className="w-1.5 bg-gradient-to-t from-cyan-500 to-indigo-400 rounded-full transition-all duration-150"
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-[#0c122c] border border-cyan-500/20">
                    <div className="text-lg font-bold font-outfit text-cyan-300">{simIpaScore}%</div>
                    <div className="text-[10px] font-mono text-slate-400">ĐỘ CHUẨN XÁC</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0c122c] border border-cyan-500/20">
                    <div className="text-lg font-bold font-outfit text-emerald-400">44/44</div>
                    <div className="text-[10px] font-mono text-slate-400">BẢNG ÂM IPA</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSimIpaTesting(true);
                    setTimeout(() => {
                      setSimIpaTesting(false);
                      setSimIpaScore(Math.floor(Math.random() * 5 + 94));
                    }, 1000);
                  }}
                  className="w-full py-2.5 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{simIpaTesting ? 'Đang phân tích phổ sóng...' : 'Bấm Thử Nghiệm Ngữ Âm'}</span>
                </button>
              </div>
            </div>

            {/* ── CARD 3: SM-2 FLASHCARDS (SPAN 4 COLS) ── */}
            <div className="md:col-span-12 lg:col-span-4 bento-card flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-300 font-bold uppercase">
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>03 • SIÊU TRÍ NHỚ</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Spaced Repetition</span>
                </div>
                <h3 className="text-2xl font-bold font-outfit text-slate-100">
                  Chu Kỳ Não Bộ SM-2
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Tính toán đường cong quên lãng Ebbinghaus, tự động kích hoạt ôn tập đúng thời điểm vàng để ghi nhớ vĩnh viễn.
                </p>
              </div>

              {/* Interactive 3D Flip Card */}
              <div 
                onClick={() => setSimCardFlipped(!simCardFlipped)}
                className="p-5 rounded-2xl bg-[#080d22]/90 border border-cyan-500/25 hover:border-cyan-400/60 transition-all duration-300 cursor-pointer text-center space-y-2 group shadow-inner"
              >
                <div className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-wider">
                  {simCardFlipped ? 'MẶT SAU (CHẠM ĐỂ LẬT LẠI)' : 'CHẠM VÀO THẺ ĐỂ LẬT MẶT'}
                </div>
                {!simCardFlipped ? (
                  <div className="py-2">
                    <div className="text-2xl font-extrabold font-outfit text-white group-hover:text-cyan-300 transition-colors">
                      Sustainable
                    </div>
                    <div className="text-xs font-mono text-cyan-400 mt-1">/səˈsteɪnəbl/ (adj)</div>
                  </div>
                ) : (
                  <div className="py-2 animate-fade-in">
                    <div className="text-base font-bold text-amber-300">
                      Bền vững, có thể duy trì lâu dài
                    </div>
                    <div className="text-[11px] text-slate-300 italic mt-1">
                      "Sustainable development is vital for our future."
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t border-cyan-500/20 text-[11px] font-mono text-slate-400 flex justify-between">
                  <span>Khoảng cách ôn tiếp theo:</span>
                  <span className="text-emerald-400 font-bold">4 ngày tới</span>
                </div>
              </div>
            </div>

            {/* ── CARD 4: SOCRATES AI (SPAN 4 COLS) ── */}
            <div className="md:col-span-12 lg:col-span-4 bento-card flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[11px] font-mono text-purple-300 font-bold uppercase">
                    <Bot className="w-3.5 h-3.5" />
                    <span>04 • GIA SƯ PHẢN BIỆN</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold font-outfit text-slate-100">
                  Gia Sư Gợi Mở Socrates 1:1
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Đàm thoại dẫn dắt tư duy phản biện, không mớm đáp án thô. Giúp học sinh tự thấu hiểu bản chất ngữ pháp.
                </p>
              </div>

              {/* Chat Dialogue Snippet */}
              <div className="p-4 rounded-2xl bg-[#080d22]/90 border border-cyan-500/25 space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-mono text-[9px] shrink-0 font-bold">
                    HS
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#142050] text-slate-200 leading-relaxed font-normal">
                    Sao câu này không chọn "economic" mà lại là "economical" ạ?
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center font-mono text-[9px] shrink-0 font-bold">
                    AI
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0c122c] border border-cyan-500/30 text-slate-200 leading-relaxed space-y-1 font-normal">
                    Em hãy xem: xe này <em>"uses very little fuel"</em>. Là nói về <strong className="text-cyan-300">thuộc kinh tế</strong> hay <strong className="text-amber-300">tiết kiệm chi phí</strong>?
                  </div>
                </div>
              </div>
            </div>

            {/* ── CARD 5: TEACHER EXAM STUDIO (SPAN 4 COLS) ── */}
            <div className="md:col-span-12 lg:col-span-4 bento-card flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 font-bold uppercase">
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>05 • CỔNG GIÁO VIÊN</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold font-outfit text-slate-100">
                  Xáo Đề 4-8 Mã Trong 1 Giây
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Dán đề gốc, hệ thống tự động đảo câu hỏi & đáp án, xuất file Word và ma trận đối chiếu đáp án tức thời.
                </p>
              </div>

              {/* Live Shuffler Matrix */}
              <div className="p-4 rounded-2xl bg-[#080d22]/90 border border-cyan-500/25 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">ĐỀ GỐC (50 CÂU THPT):</span>
                  <button
                    onClick={() => setSimShuffled(!simShuffled)}
                    className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-[10px] font-mono transition-all flex items-center gap-1 cursor-pointer shadow-md"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>{simShuffled ? 'Đã Xáo Đề' : 'Bấm Xáo Đề'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {['MÃ 101', 'MÃ 102', 'MÃ 103', 'MÃ 104'].map((code, idx) => (
                    <div 
                      key={idx} 
                      className={`p-2 rounded-lg border text-center transition-all ${
                        simShuffled 
                          ? 'bg-[#142050] border-cyan-400 text-cyan-200 font-bold shadow-sm' 
                          : 'bg-[#0c122c] border-white/10 text-slate-500'
                      }`}
                    >
                      <div className="text-[11px] font-mono">{code}</div>
                    </div>
                  ))}
                </div>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Sẵn sàng xuất file Word & Ma trận</span>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 05: KHKT RESEARCH PROFILE & AUTHOR SHOWCASE (BENTO CARD)
        ═══════════════════════════════════════════════════════════ */}
        <section className="bento-card p-8 sm:p-12 md:p-14 space-y-8 border-cyan-500/30 bg-[#10193e]/90 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 border-b border-cyan-500/20 pb-8">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 font-bold uppercase">
                <GraduationCap className="w-4 h-4" />
                <span>HỒ SƠ ĐỀ TÀI NGHIÊN CỨU KHOA HỌC KỸ THUẬT</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">
                Nghiên Cứu & Xây Dựng Hệ Thống Gia Sư Khảo Thí Tiếng Anh Thích Ứng AI Dành Cho Học Sinh THPT
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Đề tài xuất phát từ trăn trở thực tiễn: Học sinh THPT thường ôn thi tràn lan không trọng tâm, thiếu công cụ đo lường chính xác và phản hồi cá nhân hóa. Bằng việc kết hợp mô hình tâm trắc học 2PL IRT và AI tạo sinh, hệ thống giúp tiết kiệm hơn 50% thời gian ôn luyện.
              </p>
            </div>

            <div className="shrink-0 p-6 rounded-2xl bg-[#080d22] border border-cyan-500/30 text-center min-w-[230px] space-y-2.5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/30">
                <ShieldCheck className="w-6 h-6 text-cyan-200" />
              </div>
              <div className="text-base font-bold text-white font-outfit">EXAMORA LABS</div>
              <div className="text-xs font-mono text-cyan-300">Mã Đề Tài: KHKT-AI-2026</div>
              <div className="text-[11px] text-emerald-400 font-mono">Dự Án Nghiên Cứu Phi Lợi Nhuận</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="space-y-1.5">
              <div className="text-xs font-mono text-cyan-400/80 uppercase">ĐỐI TƯỢNG HƯỚNG TỚI</div>
              <div className="font-bold text-slate-100">Học sinh THPT Khối 10, 11, 12</div>
              <div className="text-xs text-slate-400">Ôn thi tốt nghiệp & Đánh giá năng lực</div>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-mono text-cyan-400/80 uppercase">TIÊU CHUẨN ĐỊNH HƯỚNG</div>
              <div className="font-bold text-slate-100">Chương trình GDPT 2018</div>
              <div className="text-xs text-slate-400">Ma trận cấu trúc đề thi đổi mới</div>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-mono text-cyan-400/80 uppercase">ĐA NỀN TẢNG (PWA APP)</div>
              <div className="font-bold text-slate-100">Web & Ứng Dụng Mobile</div>
              <button 
                onClick={() => setIsInstallModalOpen(true)}
                className="text-xs text-cyan-300 hover:text-cyan-200 cursor-pointer flex items-center gap-1 font-mono tracking-wider pt-0.5"
              >
                <span>Cài đặt Android & iOS ➔</span>
              </button>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-mono text-cyan-400/80 uppercase">TÍNH PHI THƯƠNG MẠI</div>
              <div className="font-bold text-emerald-400">Miễn Phí 100% Phục Vụ Cộng Đồng</div>
              <div className="text-xs text-slate-400">Không thu phí dưới mọi hình thức</div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 06: OFFICIAL EXAM REPOSITORY
        ═══════════════════════════════════════════════════════════ */}
        <section className="space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-cyan-500/20 pb-8">
            <div className="space-y-2">
              <div className="text-[11px] font-mono tracking-widest text-cyan-400/80 uppercase">
                // OFFICIAL EXAM REPOSITORY
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-outfit text-slate-100">
                Kho Đề Thi Chuẩn Hóa THPT.
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'Toàn Bộ Đề Thi' },
                { id: 'thpt', label: 'Tốt Nghiệp THPT' },
                { id: 'dgnl', label: 'ĐGNL ĐHQG' },
                { id: 'hk2', label: 'Đề Học Kỳ' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-md shadow-cyan-500/30'
                      : 'bg-[#10193e] text-slate-400 hover:text-white border border-cyan-500/20'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Exams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className="p-6 rounded-2xl bg-[#10193e]/80 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 flex flex-col justify-between space-y-6 group shadow-md hover:shadow-cyan-500/15"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                      {exam.category === 'thpt' ? 'THPT QUỐC GIA' : exam.category === 'dgnl' ? 'ĐÁNH GIÁ NĂNG LỰC' : 'ĐỀ MINH HỌA'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{exam.year || '2025-2026'}</span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed font-normal">
                      {exam.description || 'Đề thi chuẩn cấu trúc ma trận đổi mới bám sát cấu trúc của Bộ GD&ĐT.'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-cyan-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-cyan-400" /> 50 phút</span>
                    <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-cyan-400" /> 50 câu</span>
                  </div>
                  <button
                    onClick={() => onOpenAuth && onOpenAuth('register')}
                    className="px-4 py-1.5 rounded-full bg-cyan-500/10 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:text-white text-cyan-300 font-bold text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer border border-cyan-500/30"
                  >
                    <span>Làm Ngay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 07: INTERACTIVE FAQ ACCORDION
        ═══════════════════════════════════════════════════════════ */}
        <section className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="text-[11px] font-mono tracking-widest text-cyan-400/80 uppercase">
              // FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100 font-outfit">
              Giải Đáp Thắc Mắc Thường Gặp
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="p-6 rounded-2xl bg-[#10193e]/80 border border-cyan-500/20 hover:border-cyan-400/50 transition-all cursor-pointer space-y-3 shadow-md"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-sm sm:text-base font-bold text-slate-100 font-outfit">
                      {faq.q}
                    </h4>
                    <span className={`w-6 h-6 rounded-full border border-cyan-500/30 flex items-center justify-center text-xs font-mono transition-transform duration-300 ${
                      isOpen ? 'rotate-45 text-cyan-300 border-cyan-400 bg-cyan-500/20' : 'text-slate-400'
                    }`}>
                      +
                    </span>
                  </div>
                  {isOpen && (
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal pt-2 border-t border-cyan-500/20 animate-fade-in">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 08: FOOTER
      ═══════════════════════════════════════════════════════════ */}
      <footer className="bg-[#080d22] text-slate-300 pt-16 sm:pt-24 space-y-16 border-t border-cyan-500/20">
        
        {/* Giant Running Footer Marquee */}
        <div className="overflow-hidden border-b border-cyan-500/20 pb-8 sm:pb-12 px-4 sm:px-6 md:px-12">
          <div className="animate-datura-marquee flex items-center gap-12 whitespace-nowrap text-4xl sm:text-7xl md:text-8xl font-bold font-outfit text-cyan-400/20 tracking-tighter uppercase select-none">
            <span>WHAT MATTERS TO YOUR SCORE. LET'S REACH 9+ THPT TOGETHER.</span>
            <span>WHAT MATTERS TO YOUR SCORE. LET'S REACH 9+ THPT TOGETHER.</span>
          </div>
        </div>

        {/* 4-Column Minimal Studio Grid */}
        <div className="w-full px-4 sm:px-6 md:px-12 2xl:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 text-sm">
          
          <div className="space-y-4">
            <div className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
              <span>EXAMORA AI®</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-normal">
              Đề tài Nghiên cứu Khoa học Kỹ thuật (KHKT) cấp Quốc gia ứng dụng Trí tuệ nhân tạo và Mô hình Toán học thích ứng cho học sinh THPT.
            </p>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span>SERVER STATUS: 99.9% ACTIVE</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[11px] font-mono text-cyan-400/80 uppercase tracking-wider">TÍNH NĂNG CHÍNH</div>
            <ul className="space-y-2 text-xs text-slate-400 font-normal">
              <li><button onClick={() => onOpenAuth && onOpenAuth('register')} className="hover:text-cyan-300 transition-colors cursor-pointer">Luyện đề thích ứng 2PL IRT</button></li>
              <li><button onClick={() => onOpenAuth && onOpenAuth('register')} className="hover:text-cyan-300 transition-colors cursor-pointer">Chấm phát âm 44 Âm IPA</button></li>
              <li><button onClick={() => onOpenAuth && onOpenAuth('register')} className="hover:text-cyan-300 transition-colors cursor-pointer">Gia sư gợi mở Socrates AI</button></li>
              <li><button onClick={() => onOpenAuth && onOpenAuth('register')} className="hover:text-cyan-300 transition-colors cursor-pointer">Thẻ nhớ não bộ SM-2</button></li>
              <li><button onClick={() => onOpenAuth && onOpenAuth('register')} className="hover:text-cyan-300 transition-colors cursor-pointer">Cổng Giáo viên & Xáo đề</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-[11px] font-mono text-cyan-400/80 uppercase tracking-wider">TÀI NGUYÊN & CÀI ĐẶT</div>
            <ul className="space-y-2 text-xs text-slate-400 font-normal">
              <li><button onClick={() => setIsInstallModalOpen(true)} className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1.5"><span>📲 Cài Đặt App Mobile (Android/iOS)</span></button></li>
              <li><button onClick={() => onOpenAuth && onOpenAuth('register')} className="hover:text-cyan-300 transition-colors cursor-pointer">Đề thi THPT Quốc gia 2025</button></li>
              <li><button onClick={() => onOpenAuth && onOpenAuth('register')} className="hover:text-cyan-300 transition-colors cursor-pointer">Kho từ vựng Global Success</button></li>
              <li><button onClick={() => onOpenAuth && onOpenAuth('register')} className="hover:text-cyan-300 transition-colors cursor-pointer">Sổ tay hướng dẫn sử dụng AI</button></li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="text-[11px] font-mono text-cyan-400/80 uppercase tracking-wider">BẮT ĐẦU NGAY</div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Đăng ký tài khoản miễn phí bằng tên đăng nhập và mật khẩu hoặc cài đặt App về điện thoại.
            </p>
            <div className="space-y-2.5">
              <button
                onClick={() => onOpenAuth && onOpenAuth('register')}
                className="btn-3d-primary w-full py-3 rounded-full font-bold text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                Đăng Ký Tài Khoản Miễn Phí
              </button>
              <button
                onClick={() => setIsInstallModalOpen(true)}
                className="w-full py-2.5 rounded-full font-bold text-xs font-mono uppercase tracking-wider cursor-pointer bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 flex items-center justify-center gap-2 transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cài App Mobile (Android / iOS)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="w-full px-4 sm:px-6 md:px-12 2xl:px-16 flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-slate-400 border-t border-cyan-500/20 pt-8 pb-12 gap-4">
          <p>© 2026 EXAMORA AI RESEARCH TEAM. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <span>HO CHI MINH CITY, VIETNAM</span>
            <span>GDPT 2018 STANDARD</span>
          </div>
        </div>

      </footer>

      {/* MOBILE APP INSTALL MODAL */}
      <MobileInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

    </div>
  );
}
