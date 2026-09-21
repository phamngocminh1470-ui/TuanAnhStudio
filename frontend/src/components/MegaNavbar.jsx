import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, Zap, BookOpen, Headphones, Mic, PenLine, 
  Bot, Trophy, BrainCircuit, Database, HelpCircle, Activity,
  ChevronDown, LogIn, User, Sparkles, BookMarked, Layers, FileText,
  Flame, Award, CheckCircle2, ShieldCheck, Settings, LogOut,
  Menu, X, LayoutDashboard, Clock, MessageSquare, Compass, ChevronRight,
  Shuffle, Users, Lock, Gift, Smartphone
} from 'lucide-react';

export default function MegaNavbar({
  activeTab,
  onNavigate,
  selectedGrade,
  onGradeChange,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onLogout,
  onOpenPhotoSolver,
  onOpenCanva,
  onOpenInstallModal
}) {
  const [openDropdown, setOpenDropdown] = useState(null); // 'kythi' | 'giasu' | 'congcu' | 'congdong' | null
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState('kythi'); // 'kythi' | 'giasu' | 'congcu' | 'congdong'
  const navRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileDrawerOpen]);

  const gradeLevels = [
    { id: '10', label: 'Khối 10' },
    { id: '11', label: 'Khối 11' },
    { id: '12', label: 'Khối 12' }
  ];

  // Menu items config
  const kyThiItems = [
    { id: 'official-repo', title: 'Kho Đề Thật • Lời Giải Thật', desc: 'Đề THPT 2026, Chuyên Hà Nội, ĐGNL HSA/TSA', badge: 'HOT', icon: FileText, action: () => { onNavigate('official-exams'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'thpt', title: 'Thi thử Thích ứng IRT', desc: 'Hệ thống tự chỉnh độ khó theo năng lực', badge: 'Chuẩn Mới', icon: Zap, action: () => { onNavigate('irt-test'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'dgnl', title: 'ĐGNL & Đánh Giá Tư Duy', desc: 'HSA • TSA ĐHQG & Bách Khoa', badge: 'MAX', icon: Award, action: () => { onNavigate('irt-test'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'hsa', title: 'HSA - ĐHQG HN', desc: 'Đề thi tư duy định lượng & định tính', icon: BookOpen, action: () => { onNavigate('reading'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'tsa', title: 'TSA - Bách Khoa', desc: 'Đánh giá tư duy logic & giải quyết vấn đề', icon: BrainCircuit, action: () => { onNavigate('irt-test'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'sgk', title: 'Sách SGK Global Success', desc: 'Chương trình GDPT mới Lớp 10-11-12', badge: 'NEW', icon: BookMarked, action: () => { onNavigate('vocab-library'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'thpt-chuan', title: 'Ôn Thi Tốt Nghiệp THPT', desc: 'Chuẩn 40 câu cấu trúc mới Bộ GD&ĐT', badge: 'CHUẨN', icon: Trophy, action: () => { onNavigate('official-exams'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
  ];

  const giaSuItems = [
    { id: 'speaking-exam', title: 'Phòng Thi Nói & Đối Thoại AI', desc: 'Vấn đáp GDPT 2018, Tranh luận Socratic & IELTS Band 8.5', badge: 'MỚI • HOT', icon: Mic, action: () => { onNavigate('speaking-exam'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'photo-solver', title: 'Chụp ảnh giải đề AI', desc: 'Tải ảnh bài tập & nhận lời giải từng bước', badge: 'MỚI', icon: Sparkles, action: () => { if (onOpenPhotoSolver) onOpenPhotoSolver(); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'teacher-hub', title: 'Cổng Giáo Viên • Xáo Đề & Quản Lý', desc: 'Xáo 1 đề thành 4 mã đề (101-104), quản lý lớp & giao topic tuần', badge: 'GV • HOT', icon: Shuffle, action: () => { onNavigate('teacher-portal'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'chat-ai', title: 'Hỏi bài AI - Socrates 1:1', desc: 'Gia sư AI gợi mở tư duy đàm thoại 24/7', icon: Bot, action: () => { onNavigate('chat'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'writing', title: 'Chấm bài luận & Đoạn văn AI', desc: 'Dàn ý, bài mẫu chuẩn 9-10 & sửa lỗi từng câu', badge: 'MỚI', icon: PenLine, action: () => { onNavigate('writing-practice'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'pronounce', title: 'Luyện phát âm chuẩn IPA', desc: 'Nhận diện sóng âm 44 âm quốc tế chuẩn xác', badge: 'AI', icon: Mic, action: () => { onNavigate('pronounce'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
  ];

  const congCuItems = [
    { id: 'teacher-hub-2', title: 'Xáo Đề Thi (101, 102, 103, 104)', desc: 'Tự động đảo câu hỏi, đảo đáp án & xuất bảng ma trận', badge: 'GV • HOT', icon: Shuffle, action: () => { onNavigate('teacher-portal'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'irt-engine', title: 'Luyện đề thích ứng IRT', desc: 'Tự động chỉnh độ khó theo năng lực', icon: Zap, action: () => { onNavigate('irt-test'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'sm2-vocab', title: 'Từ vựng Não bộ SM-2', desc: 'Thuật toán lặp lại ngắt quãng Spaced Repetition', icon: BrainCircuit, action: () => { onNavigate('sm2-flashcards'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'reading-ai', title: 'Đọc thích ứng SGK', desc: 'Đoạn văn tự điều chỉnh theo sở thích & trình độ', icon: BookOpen, action: () => { onNavigate('reading'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'listening-ai', title: 'Luyện nghe tương tác', desc: 'Audio bản ngữ tự sinh câu hỏi bắt từ khóa', icon: Headphones, action: () => { onNavigate('listening'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'analytics', title: 'Báo cáo & Dự báo điểm', desc: 'Biểu đồ tăng trưởng theta & dự báo điểm thi', icon: Activity, action: () => { onNavigate('analytics'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'vocab-lib', title: 'Học liệu & Từ vựng SGK', desc: 'Tra cứu từ vựng kèm phát âm IPA chuẩn', icon: BookMarked, action: () => { onNavigate('vocab-library'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'official-exams', title: 'Kho Đề Thi Chuẩn Hóa', desc: 'Đề thi trích nguồn chính thức từ các Sở GD&ĐT', badge: 'HOT', icon: FileText, action: () => { onNavigate('official-exams'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } }
  ];

  const congDongItems = [
    { id: 'teacher-hub-3', title: 'Cổng Giáo Viên & Quản Lý Lớp', desc: 'Tạo nhóm học sinh, giao bài tập & chấm câu AI', badge: 'HOT', icon: Users, action: () => { onNavigate('teacher-portal'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'guide', title: 'Hướng dẫn sử dụng', desc: 'Video & tài liệu chi tiết từng tính năng', icon: HelpCircle, action: () => { onNavigate('guide'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'project', title: 'Giới thiệu Dự án KHKT', desc: 'Đề tài Nghiên cứu KHKT TP.HCM 2026 - 2027', badge: 'KHKT', icon: GraduationCap, action: () => { onNavigate('guide'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    ...(currentUser && currentUser.role === 'admin' ? [
      { id: 'admin', title: 'Bảng Quản trị & Giám sát KHKT', desc: 'Dành riêng cho Giáo viên & Quản trị viên', badge: 'ADMIN', icon: ShieldCheck, action: () => { onNavigate('admin-panel'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } }
    ] : [])
  ];

  const giaoVienItems = [
    { id: 'teacher-shuffler', title: 'Xáo Đề Thi (101, 102, 103, 104)', desc: 'Tự động đảo câu hỏi & đáp án, xuất ma trận đề', badge: 'HOT', icon: Shuffle, action: () => { onNavigate('teacher-portal'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'teacher-classes', title: 'Quản Lý Lớp Học & Học Sinh', desc: 'Tạo mã lớp, phân quyền & theo dõi danh sách lớp', badge: 'GV', icon: Users, action: () => { onNavigate('teacher-portal'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'teacher-assignments', title: 'Tạo & Giao Bài Tập Tuần', desc: 'Giao đề thích ứng & kiểm tra định kỳ theo SGK mới', icon: BookOpen, action: () => { onNavigate('teacher-portal'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    { id: 'teacher-analytics', title: 'Báo Cáo Tiến Độ & Điểm Số', desc: 'Thống kê phổ điểm & chẩn đoán lỗ hổng của học sinh', icon: Activity, action: () => { onNavigate('teacher-portal'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
  ];

  return (
    <>
      <header ref={navRef} className="sticky top-0 z-40 border-b border-cyan-500/20 bg-[#0c122c]/90 backdrop-blur-2xl text-slate-100 shadow-[0_4px_30px_rgba(3,7,26,0.7)] transition-colors duration-200">
        {/* Top subtle hairline accent */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

        <div className="w-full px-4 sm:px-6 md:px-12 2xl:px-16 py-3 flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-3 cursor-pointer text-left group shrink-0"
            >
              <img 
                src="/navbar_logo_v3.png" 
                alt="Examora AI Logo" 
                className="h-9 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md" 
              />
              <div>
                <span className="font-extrabold text-xl sm:text-2xl text-3d-hero tracking-tight block font-outfit leading-none">
                  Examora <span className="text-3d-cyan">AI</span>
                </span>
                <span className="text-[10px] text-cyan-300/80 font-mono tracking-wider block uppercase truncate mt-1">
                  THPT AI • GDPT 2018
                </span>
              </div>
            </button>

            {/* Desktop Mega Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { id: 'kythi', label: 'Kỳ thi', icon: GraduationCap },
                { id: 'giasu', label: 'AI Gia Sư', icon: Sparkles },
                { id: 'congcu', label: 'Công cụ', icon: BrainCircuit },
                { id: 'congdong', label: 'Hướng dẫn', icon: HelpCircle },
              ].map(({ id, label, icon: Icon }) => (
                <div key={id} className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                      openDropdown === id
                        ? 'text-white bg-blue-900/70 border border-cyan-400/40 shadow-sm font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-blue-900/30'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{label}</span>
                    <ChevronDown className={`w-3 h-3 text-cyan-400/70 transition-transform duration-200 ${openDropdown === id ? 'rotate-180 text-cyan-300' : ''}`} />
                  </button>
                </div>
              ))}

              {/* Nút Cổng Giáo Viên Trực Tiếp */}
              <button
                onClick={() => { onNavigate('teacher-portal'); setOpenDropdown(null); }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 flex items-center gap-1.5 cursor-pointer ml-1.5 ${
                  activeTab === 'teacher-portal'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md font-bold'
                    : 'bg-blue-950/60 hover:bg-blue-900/80 text-cyan-200 hover:text-white border border-cyan-500/30'
                }`}
              >
                <Shuffle className="w-3 h-3 text-cyan-400" />
                <span>Cổng Giáo Viên</span>
                <span className="px-1.5 py-0.2 text-[9px] font-mono rounded-full bg-cyan-400/20 text-cyan-300 uppercase">Xáo Đề</span>
              </button>

              {/* Nút Admin Panel Trực Tiếp (Dành riêng cho Admin) */}
              {currentUser && currentUser.role === 'admin' && (
                <button
                  onClick={() => { onNavigate('admin-panel'); setOpenDropdown(null); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 flex items-center gap-1.5 cursor-pointer ml-1.5 ${
                    activeTab === 'admin-panel'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md font-bold'
                      : 'bg-amber-950/50 hover:bg-amber-900/70 text-amber-300 hover:text-white border border-amber-500/30'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Panel</span>
                </button>
              )}

              {/* Nút Nhận Canva Pro / Edu Miễn Phí */}
              <button
                onClick={() => { if (onOpenCanva) onOpenCanva(); setOpenDropdown(null); }}
                className="px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 flex items-center gap-1.5 cursor-pointer ml-1.5 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 text-purple-200 hover:text-white"
                title="Nhận bản quyền Canva Pro / Edu miễn phí"
              >
                <Gift className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Canva Pro</span>
              </button>
            </nav>
          </div>

          {/* Right: Grade Switcher, Profile Badge & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Grade Switcher */}
            {currentUser && currentUser.role === 'student' ? (
              <div 
                className="hidden md:flex items-center bg-[#121b44] border border-cyan-500/30 px-3 py-1.5 rounded-full gap-2 text-slate-100"
                title="Khối lớp được gắn cố định theo tài khoản của bạn"
              >
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-mono text-cyan-200">Khối Lớp {currentUser.grade || selectedGrade}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-mono flex items-center gap-0.5 border border-cyan-500/30">
                  <Lock className="w-2.5 h-2.5" /> CỐ ĐỊNH
                </span>
              </div>
            ) : (
              <div className="hidden md:flex items-center bg-[#121b44] border border-cyan-500/30 p-1 rounded-full gap-1">
                <div className="flex items-center bg-blue-950/60 rounded-full p-0.5 gap-0.5 mr-1">
                  <button
                    onClick={() => onGradeChange('12')}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                      parseInt(selectedGrade) >= 10
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    THPT
                  </button>
                  <button
                    onClick={() => onGradeChange('9')}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                      parseInt(selectedGrade) < 10
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    THCS
                  </button>
                </div>

                {gradeLevels.map((lvl) => {
                  const isSelected = selectedGrade === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => onGradeChange(lvl.id)}
                      className={`w-6 h-6 rounded-full text-[11px] font-mono transition-all duration-200 cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-sm'
                          : 'text-slate-400 hover:text-cyan-300'
                      }`}
                    >
                      {lvl.id}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Desktop Cài App Button */}
            <button
              onClick={onOpenInstallModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/35 text-emerald-300 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
              title="Cài đặt ứng dụng trên điện thoại Android / iOS"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cài App</span>
              <span className="text-[9px] px-1 rounded bg-emerald-400/20 text-emerald-200">PWA</span>
            </button>

            {/* Mobile Grade Quick Switcher Pill */}
            {currentUser && currentUser.role === 'student' ? (
              <div className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#121b44] border border-cyan-500/30 text-xs font-mono text-cyan-200">
                <Lock className="w-3 h-3 text-cyan-400" />
                <span>Lớp {currentUser.grade || selectedGrade}</span>
              </div>
            ) : (
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#121b44] border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:text-white transition cursor-pointer"
              >
                <span>Lớp {selectedGrade}</span>
                <ChevronDown className="w-3 h-3 text-cyan-400" />
              </button>
            )}

            {/* User Profile Badge or Login/Register Action */}
            {currentUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 bg-blue-950/60 hover:bg-blue-900/80 border border-cyan-500/30 px-2.5 sm:px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200"
                  title="Xem hồ sơ cá nhân"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm">
                    {(currentUser.fullname || currentUser.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-[11px] font-bold text-slate-100 truncate max-w-[90px]">
                      {currentUser.fullname || currentUser.username}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                      <span className="text-[9px] text-cyan-300 font-mono uppercase">
                        {currentUser.role === 'admin' ? 'Admin' : 'Học sinh'}
                      </span>
                    </div>
                  </div>
                </button>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="p-2 rounded-full bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 border border-rose-500/30 transition cursor-pointer"
                    title="Đăng xuất / Chuyển tài khoản khác"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth && onOpenAuth('login')}
                  id="navbar-login-btn"
                  className="btn-3d-secondary px-3.5 py-1.5 text-xs rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Đăng nhập</span>
                </button>
                <button
                  onClick={() => onOpenAuth && onOpenAuth('register')}
                  className="btn-3d-primary px-4 py-1.5 text-xs rounded-xl font-bold flex items-center gap-1 cursor-pointer shadow-md"
                >
                  <span>Đăng ký</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              title="Menu Điều Hướng"
            >
              {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ─── DESKTOP MEGA DROPDOWN PANELS ────────────────────────────────────────── */}
        {openDropdown && (
          <div className="hidden lg:block border-t border-cyan-500/20 bg-[#0c122c]/98 backdrop-blur-3xl px-4 md:px-8 py-6 animate-fade-in shadow-2xl text-slate-100">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
                    {openDropdown === 'kythi' && 'Hệ thống Kỳ thi & Sách Giáo Khoa (10+ Mục)'}
                    {openDropdown === 'giasu' && 'Hệ sinh thái AI Gia Sư & Luyện Kỹ Năng 1:1'}
                    {openDropdown === 'congcu' && 'Trung tâm Công cụ & Thuật toán Học tập'}
                    {openDropdown === 'congdong' && 'Tài liệu Hướng dẫn & Đề tài KHKT'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                    100% MIỄN PHÍ
                  </span>
                </div>
                <button 
                  onClick={() => setOpenDropdown(null)} 
                  className="text-xs font-mono text-slate-400 hover:text-cyan-300 cursor-pointer"
                >
                  Đóng ✕
                </button>
              </div>

              {/* Dropdown 1: Kỳ thi Grid */}
              {openDropdown === 'kythi' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {kyThiItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        className="p-3.5 text-left rounded-2xl bg-gradient-to-br from-[#141e48]/90 to-[#0f1738]/90 hover:from-[#1c2960] hover:to-[#142050] border border-cyan-500/20 hover:border-cyan-400/50 shadow-md hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition cursor-pointer flex items-start gap-3 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30 group-hover:scale-105 group-hover:bg-blue-600/30 transition">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition truncate">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Dropdown 2: AI Gia Sư Grid */}
              {openDropdown === 'giasu' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {giaSuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        className="p-3.5 text-left rounded-2xl bg-gradient-to-br from-[#141e48]/90 to-[#0f1738]/90 hover:from-[#1c2960] hover:to-[#142050] border border-cyan-500/20 hover:border-cyan-400/50 shadow-md hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition cursor-pointer flex items-start gap-3 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/30 group-hover:scale-105 group-hover:bg-purple-600/30 transition">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-100 group-hover:text-purple-300 transition truncate">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Dropdown 3: Công cụ học Grid */}
              {openDropdown === 'congcu' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {congCuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        className="p-3.5 text-left rounded-2xl bg-gradient-to-br from-[#141e48]/90 to-[#0f1738]/90 hover:from-[#1c2960] hover:to-[#142050] border border-cyan-500/20 hover:border-cyan-400/50 shadow-md hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition cursor-pointer flex items-start gap-3 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-500/30 group-hover:scale-105 group-hover:bg-cyan-600/30 transition">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition block truncate">
                            {item.title}
                          </span>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Dropdown 4: Cộng đồng / Hướng dẫn Grid */}
              {openDropdown === 'congdong' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {congDongItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        className="p-3.5 text-left rounded-2xl bg-gradient-to-br from-[#141e48]/90 to-[#0f1738]/90 hover:from-[#1c2960] hover:to-[#142050] border border-cyan-500/20 hover:border-cyan-400/50 shadow-md hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition cursor-pointer flex items-start gap-3 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30 group-hover:scale-105 group-hover:bg-amber-600/30 transition">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition block truncate">
                            {item.title}
                          </span>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ─── FULL-SCREEN MOBILE SLIDE-OUT DRAWER ────────────────────────────────── */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md h-full bg-[#0c122c] border-l border-cyan-500/20 flex flex-col justify-between shadow-2xl overflow-y-auto text-slate-100 animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-cyan-500/20 flex items-center justify-between sticky top-0 bg-[#0c122c]/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <img 
                  src="/navbar_logo_v3.png" 
                  alt="Examora AI Logo" 
                  className="h-9 w-auto object-contain" 
                />
                <div>
                  <h3 className="font-semibold text-base text-white font-outfit leading-tight">Examora AI</h3>
                  <span className="text-[11px] text-cyan-400 font-mono uppercase tracking-wider">THPT AI • GDPT 2018</span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-5 space-y-6 flex-1">
              
              {/* Mobile App Install Button */}
              <button
                onClick={() => {
                  if (onOpenInstallModal) onOpenInstallModal();
                  setIsMobileDrawerOpen(false);
                }}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-teal-950/60 border border-emerald-400/40 text-emerald-200 text-xs font-mono font-bold flex items-center justify-between cursor-pointer shadow-lg shadow-emerald-950/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-white text-xs font-bold font-sans">Cài App Điện Thoại</div>
                    <div className="text-[10px] text-emerald-300 font-normal">Hỗ trợ Android & iOS (PWA)</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] border border-emerald-400/30">
                  Cài Ngay ➔
                </span>
              </button>

              {/* Section 1: Grade Switcher Chips on Mobile */}
              {currentUser && currentUser.role === 'student' ? (
                <div className="rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Khối lớp học tập của bạn:</span>
                    <span className="text-emerald-400 font-black flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Lớp {currentUser.grade || selectedGrade}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Tài khoản học sinh được cố định theo Khối Lớp {currentUser.grade || selectedGrade} để đồng bộ lộ trình học tập và kho đề thi chuẩn.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Khối lớp học tập của bạn:</span>
                    <span className="text-emerald-400 font-extrabold">Lớp {selectedGrade}</span>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1.5">
                    {gradeLevels.map((lvl) => {
                      const isSelected = selectedGrade === lvl.id;
                      const isC3 = parseInt(lvl.id) >= 10;
                      return (
                        <button
                          key={lvl.id}
                          onClick={() => onGradeChange(lvl.id)}
                          className={`py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                            isSelected
                              ? isC3
                                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                                : 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {lvl.id}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section 2: Mobile Accordion Navigation */}
              <div className="space-y-3">
                {/* 1. Kỳ thi & Đề thi */}
                <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                  <button
                    onClick={() => setMobileAccordion(mobileAccordion === 'kythi' ? null : 'kythi')}
                    className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-white bg-white/[0.02] cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 text-blue-400">
                      <GraduationCap className="w-4 h-4" />
                      <span className="text-white text-sm font-bold">Kỳ thi & Đề thi THPT</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileAccordion === 'kythi' ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileAccordion === 'kythi' && (
                    <div className="p-3 pt-0 space-y-1.5 border-t border-white/5">
                      {kyThiItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={item.action}
                          className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left text-xs font-medium text-slate-300 hover:text-white transition flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <item.icon className="w-4 h-4 text-blue-400 shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. AI Gia Sư 1:1 */}
                <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                  <button
                    onClick={() => setMobileAccordion(mobileAccordion === 'giasu' ? null : 'giasu')}
                    className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-white bg-white/[0.02] cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-white text-sm font-bold">AI Gia Sư 1:1 & Chấm Điểm</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileAccordion === 'giasu' ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileAccordion === 'giasu' && (
                    <div className="p-3 pt-0 space-y-1.5 border-t border-white/5">
                      {giaSuItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={item.action}
                          className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left text-xs font-medium text-slate-300 hover:text-white transition flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <item.icon className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. DÀNH RIÊNG CHO GIÁO VIÊN & QUẢN LÝ LỚP (NỔI BẬT) */}
                <div className="rounded-2xl bg-amber-500/[0.05] border border-amber-500/30 overflow-hidden shadow-lg shadow-amber-500/5">
                  <button
                    onClick={() => setMobileAccordion(mobileAccordion === 'giaovien' ? null : 'giaovien')}
                    className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-white bg-amber-500/10 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 text-amber-400">
                      <Shuffle className="w-4 h-4" />
                      <span className="text-amber-200 text-sm font-extrabold">Cổng Giáo Viên & Quản Lý</span>
                    </div>
                    <span className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-300 border border-amber-400/40">DÀNH CHO GV</span>
                      <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform ${mobileAccordion === 'giaovien' ? 'rotate-180' : ''}`} />
                    </span>
                  </button>

                  {mobileAccordion === 'giaovien' && (
                    <div className="p-3 pt-0 space-y-1.5 border-t border-amber-500/20 bg-amber-950/30">
                      {giaoVienItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={item.action}
                          className="w-full p-2.5 rounded-xl hover:bg-amber-500/20 text-left text-xs font-medium text-amber-100 hover:text-white transition flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <item.icon className="w-4 h-4 text-amber-400 shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 border border-amber-500/40 shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Công cụ & Thuật toán học */}
                <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                  <button
                    onClick={() => setMobileAccordion(mobileAccordion === 'congcu' ? null : 'congcu')}
                    className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-white bg-white/[0.02] cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 text-purple-400">
                      <BrainCircuit className="w-4 h-4" />
                      <span className="text-white text-sm font-bold">Công Cụ Học Tập Thích Ứng</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileAccordion === 'congcu' ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileAccordion === 'congcu' && (
                    <div className="p-3 pt-0 space-y-1.5 border-t border-white/5">
                      {congCuItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={item.action}
                          className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left text-xs font-medium text-slate-300 hover:text-white transition flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <item.icon className="w-4 h-4 text-purple-400 shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 5. Hướng dẫn & Giám sát KHKT */}
                <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                  <button
                    onClick={() => setMobileAccordion(mobileAccordion === 'congdong' ? null : 'congdong')}
                    className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-white bg-white/[0.02] cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 text-cyan-400">
                      <HelpCircle className="w-4 h-4" />
                      <span className="text-white text-sm font-bold">Hướng Dẫn & Giám Sát KHKT</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileAccordion === 'congdong' ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileAccordion === 'congdong' && (
                    <div className="p-3 pt-0 space-y-1.5 border-t border-white/5">
                      {congDongItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={item.action}
                          className="w-full p-2.5 rounded-xl hover:bg-white/5 text-left text-xs font-medium text-slate-300 hover:text-white transition flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <item.icon className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Drawer Footer (User Actions) */}
            <div className="p-5 border-t border-white/10 bg-[#080d1a]/95 space-y-3">
              {/* Nút Nhận Canva Pro */}
              <button
                onClick={() => { if (onOpenCanva) onOpenCanva(); setIsMobileDrawerOpen(false); }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition cursor-pointer"
              >
                <Gift className="w-4 h-4 text-yellow-300" />
                <span>🎁 Nhận Canva Pro / Edu Miễn Phí</span>
              </button>

              {currentUser ? (
                <>
                  <button
                    onClick={() => { onOpenProfile(); setIsMobileDrawerOpen(false); }}
                    className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <User className="w-4 h-4 text-emerald-400" />
                    Hồ sơ: {currentUser.fullname || currentUser.username}
                  </button>
                  <button
                    onClick={() => { onLogout(); setIsMobileDrawerOpen(false); }}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất tài khoản
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { onOpenAuth(); setIsMobileDrawerOpen(false); }}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  Đăng nhập / Đăng ký tài khoản
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ─── FLOATING BOTTOM MOBILE NAVIGATION DOCK ────────────────────────────── */}
      <div className="lg:hidden fixed bottom-3 left-4 right-4 z-40 bg-[#0b0f1ef0] backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-1.5 flex items-center justify-around">
        {[
          { id: 'dashboard', label: 'Trang chủ', icon: LayoutDashboard },
          { id: 'irt-test', label: 'Luyện đề', icon: Zap },
          { id: 'chat', label: 'AI Gia Sư', icon: MessageSquare },
          { id: 'sm2-flashcards', label: 'Từ vựng', icon: Clock },
        ].map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition cursor-pointer ${
                isActive
                  ? 'text-blue-400 bg-blue-500/15 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400 scale-110' : 'text-slate-400'} transition`} />
              <span className="text-[10px] mt-1">{label}</span>
            </button>
          );
        })}

        {/* Mobile Menu Open Button */}
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
        >
          <Menu className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] mt-1 text-slate-300">Menu</span>
        </button>
      </div>
    </>
  );
}
