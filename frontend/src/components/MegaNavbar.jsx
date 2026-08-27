import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, Zap, BookOpen, Headphones, Mic, PenLine, 
  Bot, Trophy, BrainCircuit, Database, HelpCircle, Activity,
  ChevronDown, LogIn, User, Sparkles, BookMarked, Layers, FileText,
  Flame, Award, CheckCircle2, ShieldCheck, Settings, LogOut,
  Menu, X, LayoutDashboard, Clock, MessageSquare, Compass, ChevronRight,
  Shuffle, Users
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
  onOpenPhotoSolver
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
    { id: 'project', title: 'Giới thiệu Dự án KHKT', desc: 'Đề tài Nghiên cứu KHKT Quốc Gia', badge: 'KHKT', icon: GraduationCap, action: () => { onNavigate('guide'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } },
    ...(currentUser && currentUser.role === 'admin' ? [
      { id: 'admin', title: 'Bảng Quản trị & Giám sát KHKT', desc: 'Dành riêng cho Giáo viên & Quản trị viên', badge: 'ADMIN', icon: ShieldCheck, action: () => { onNavigate('admin'); setOpenDropdown(null); setIsMobileDrawerOpen(false); } }
    ] : [])
  ];

  return (
    <>
      <header ref={navRef} className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#070a14]/95 backdrop-blur-2xl">
        {/* Top accent line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer text-left group"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-300 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight block font-outfit">
                  AI ENGLISH <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">MENTOR</span>
                </span>
                <span className="text-[9px] sm:text-[10px] text-amber-400 font-bold tracking-widest block uppercase truncate max-w-[170px] sm:max-w-none">
                  THPT AI • Luyện Thi & ĐGNL 2027
                </span>
              </div>
            </button>

            {/* Desktop Mega Navigation Links */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {[
                { id: 'kythi', label: 'Kỳ thi', icon: GraduationCap, iconColor: 'text-blue-400' },
                { id: 'giasu', label: 'AI Gia Sư', icon: Sparkles, iconColor: 'text-emerald-400' },
                { id: 'congcu', label: 'Công cụ', icon: BrainCircuit, iconColor: 'text-purple-400' },
                { id: 'congdong', label: 'Hướng dẫn', icon: HelpCircle, iconColor: 'text-cyan-400' },
              ].map(({ id, label, icon: Icon, iconColor }) => (
                <div key={id} className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer relative ${
                      openDropdown === id
                        ? 'text-white bg-white/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/05'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                    <span>{label}</span>
                    <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${openDropdown === id ? 'rotate-180 text-slate-300' : ''}`} />
                    {openDropdown === id && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" />
                    )}
                  </button>
                </div>
              ))}

              {/* Nút Cổng Giáo Viên Trực Tiếp */}
              <button
                onClick={() => { onNavigate('teacher-portal'); setOpenDropdown(null); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ml-1.5 ${
                  activeTab === 'teacher-portal'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 ring-1 ring-amber-400/50'
                    : 'bg-gradient-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 text-amber-300 border border-amber-500/30 shadow-sm'
                }`}
              >
                <Shuffle className="w-3.5 h-3.5 text-amber-400" />
                <span>Cổng Giáo Viên</span>
                <span className="px-1.5 py-0.5 text-[9px] font-black rounded-md bg-amber-500 text-slate-950 uppercase tracking-tighter">Xáo Đề</span>
              </button>
            </nav>
          </div>

          {/* Right: Grade Switcher, Profile Badge & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Grade Switcher */}
            <div className="hidden md:flex items-center bg-white/[0.035] border border-white/[0.07] p-1 rounded-xl gap-1 backdrop-blur-sm">
              <div className="flex items-center bg-white/[0.04] rounded-lg p-0.5 gap-0.5 mr-1">
                <button
                  onClick={() => onGradeChange('12')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    parseInt(selectedGrade) >= 10
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  THPT
                </button>
                <button
                  onClick={() => onGradeChange('9')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    parseInt(selectedGrade) < 10
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  THCS
                </button>
              </div>

              {gradeLevels.map((lvl) => {
                const isSelected = selectedGrade === lvl.id;
                const isC3 = parseInt(lvl.id) >= 10;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => onGradeChange(lvl.id)}
                    className={`w-7 h-7 rounded-lg text-[11px] font-black transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? isC3
                          ? 'bg-emerald-500/25 text-emerald-300 ring-1 ring-emerald-500/50 shadow-sm'
                          : 'bg-blue-500/25 text-blue-300 ring-1 ring-blue-500/50 shadow-sm'
                        : 'text-slate-500 hover:text-slate-200 hover:bg-white/06'
                    }`}
                  >
                    {lvl.id}
                  </button>
                );
              })}
            </div>

            {/* Mobile Grade Quick Switcher Pill */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-bold text-slate-200 hover:bg-white/10 transition cursor-pointer"
            >
              <span className="text-emerald-400">Lớp {selectedGrade}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* User Profile Badge */}
            {currentUser ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] hover:border-white/[0.14] px-2.5 sm:px-3 py-1.5 rounded-xl cursor-pointer transition-all duration-200"
                title="Xem hồ sơ cá nhân"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500/40 to-teal-500/30 border border-emerald-500/30 flex items-center justify-center text-[10px] font-black text-emerald-300 shrink-0">
                  {(currentUser.fullname || currentUser.username || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[11px] font-bold text-white truncate max-w-[90px]">
                    {currentUser.fullname || currentUser.username}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-emerald-400 font-bold uppercase">Online</span>
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                id="navbar-login-btn"
                className="btn-primary px-3 sm:px-4 py-1.5 sm:py-2 text-xs flex items-center gap-1.5 cursor-pointer rounded-xl font-bold"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đăng nhập / Đăng ký</span>
                <span className="sm:hidden">Đăng nhập</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              title="Menu Điều Hướng"
            >
              {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ─── DESKTOP MEGA DROPDOWN PANELS ────────────────────────────────────────── */}
        {openDropdown && (
          <div className="hidden lg:block border-t border-white/[0.06] bg-[#07090f]/98 backdrop-blur-3xl px-4 md:px-8 py-6 animate-fade-in shadow-2xl">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {openDropdown === 'kythi' && '🎓 Hệ thống Kỳ thi & Sách Giáo Khoa (10+ Mục)'}
                    {openDropdown === 'giasu' && '✨ Hệ sinh thái AI Gia Sư & Luyện Kỹ Năng 1:1'}
                    {openDropdown === 'congcu' && '🧠 Trung tâm Công cụ & Thuật toán Học tập'}
                    {openDropdown === 'congdong' && '📖 Tài liệu Hướng dẫn & Giới thiệu Đề tài KHKT'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    100% MIỄN PHÍ
                  </span>
                </div>
                <button 
                  onClick={() => setOpenDropdown(null)} 
                  className="text-xs text-slate-400 hover:text-white cursor-pointer"
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
                        className="p-3.5 text-left rounded-xl bg-[#101728] hover:bg-[#162038] border border-white/5 hover:border-blue-500/40 transition cursor-pointer flex items-start gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 transition">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-white group-hover:text-blue-300 transition truncate">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
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
                        className="p-3.5 text-left rounded-xl bg-[#101728] hover:bg-[#162038] border border-white/5 hover:border-emerald-500/40 transition cursor-pointer flex items-start gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-110 transition">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition truncate">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
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
                        className="p-3.5 text-left rounded-xl bg-[#101728] hover:bg-[#162038] border border-white/5 hover:border-purple-500/40 transition cursor-pointer flex items-start gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-110 transition">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-white group-hover:text-purple-300 transition block truncate">
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
                        className="p-3.5 text-left rounded-xl bg-[#101728] hover:bg-[#162038] border border-white/5 hover:border-cyan-500/40 transition cursor-pointer flex items-start gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-110 transition">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition block truncate">
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
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md h-full bg-[#080d1a] border-l border-white/10 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#080d1a]/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white font-outfit">AI ENGLISH MENTOR</h3>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">KHKT Quốc Gia 2026</span>
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
              
              {/* Section 1: Grade Switcher Chips on Mobile */}
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

                {/* 3. Công cụ & Thuật toán học */}
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

                {/* 4. Hướng dẫn & Giám sát KHKT */}
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
