import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, Zap, BookOpen, Headphones, Mic, PenLine, 
  Bot, Trophy, BrainCircuit, Database, HelpCircle, Activity,
  ChevronDown, LogIn, User, Sparkles, BookMarked, Layers, FileText,
  Flame, Award, CheckCircle2, ShieldCheck, Settings, LogOut
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

  const gradeLevels = [
    { id: '6', label: 'Lớp 6' },
    { id: '7', label: 'Lớp 7' },
    { id: '8', label: 'Lớp 8' },
    { id: '9', label: 'Lớp 9' },
    { id: '10', label: 'Lớp 10' },
    { id: '11', label: 'Lớp 11' },
    { id: '12', label: 'Lớp 12' }
  ];

  // Menu items config matching study.thptai.kr
  const kyThiItems = [
    { id: 'thpt', title: 'THPT 2027', desc: 'Chuẩn 10 môn THPT Quốc gia', badge: 'Chuẩn Mới', icon: Zap, action: () => { onNavigate('irt-test'); setOpenDropdown(null); } },
    { id: 'dgnl', title: 'ĐGNL & Đánh Giá Tư Duy', desc: 'HSA • TSA • V-ACT', badge: 'MAX', icon: Award, action: () => { onNavigate('irt-test'); setOpenDropdown(null); } },
    { id: 'hsa', title: 'HSA - ĐHQG HN', desc: 'Đề thi tư duy định lượng & định tính', icon: BookOpen, action: () => { onNavigate('reading'); setOpenDropdown(null); } },
    { id: 'tsa', title: 'TSA - Bách Khoa', desc: 'Đánh giá tư duy logic & giải quyết vấn đề', icon: BrainCircuit, action: () => { onNavigate('irt-test'); setOpenDropdown(null); } },
    { id: 'vact', title: 'V-ACT - ĐHQG HCM', desc: 'Cấu trúc đề chuẩn ĐHQG TP.HCM', icon: FileText, action: () => { onNavigate('reading'); setOpenDropdown(null); } },
    { id: 'sgk', title: 'Sách SGK Global Success', desc: 'Chương trình GDPT mới Lớp 10-11-12', badge: 'NEW', icon: BookMarked, action: () => { onNavigate('vocab-library'); setOpenDropdown(null); } },
    { id: 'ielts', title: 'IELTS / VSTEP Hub', desc: 'Luyện 4 kỹ năng chuẩn quốc tế', badge: 'NEW', icon: Trophy, action: () => { onNavigate('reading'); setOpenDropdown(null); } },
    { id: 'mock', title: 'Thi thử Thích ứng IRT', desc: 'Thi thử online tính điểm tự động', icon: Activity, action: () => { onNavigate('irt-test'); setOpenDropdown(null); } },
    { id: 'thcs', title: 'THCS - Lớp 6 đến 9', desc: 'Kiến thức nền tảng bậc THCS', icon: Layers, action: () => { onNavigate('reading'); setOpenDropdown(null); } }
  ];

  const giaSuItems = [
    { id: 'photo-solver', title: 'Chụp ảnh giải đề AI', desc: 'Tải ảnh bài tập & nhận lời giải từng bước', badge: 'MỚI', icon: Sparkles, action: () => { if (onOpenPhotoSolver) onOpenPhotoSolver(); setOpenDropdown(null); } },
    { id: 'chat-ai', title: 'Hỏi bài AI - Chat 1:1', desc: 'Gia sư AI 24/7 giải thích mọi thắc mắc', icon: Bot, action: () => { onNavigate('chat'); setOpenDropdown(null); } },
    { id: 'writing', title: 'Chấm bài luận & Đoạn văn AI', desc: 'Dàn ý, bài mẫu chuẩn 9-10 & sửa lỗi từng câu', badge: 'MỚI', icon: PenLine, action: () => { onNavigate('writing-practice'); setOpenDropdown(null); } }
  ];

  const congCuItems = [
    { id: 'irt-engine', title: 'Luyện đề thích ứng IRT', desc: 'Tự động chỉnh độ khó theo năng lực', icon: Zap, action: () => { onNavigate('irt-test'); setOpenDropdown(null); } },
    { id: 'sm2-vocab', title: 'Từ vựng Não bộ SM-2', desc: 'Thuật toán lặp lại ngắt quãng Spaced Repetition', icon: BrainCircuit, action: () => { onNavigate('sm2-flashcards'); setOpenDropdown(null); } },
    { id: 'reading-ai', title: 'Đọc thích ứng SGK', desc: 'Đoạn văn tự điều chỉnh theo sở thích & trình độ', icon: BookOpen, action: () => { onNavigate('reading'); setOpenDropdown(null); } },
    { id: 'listening-ai', title: 'Luyện nghe tương tác', desc: 'Audio bản ngữ tự sinh câu hỏi bắt từ khóa', icon: Headphones, action: () => { onNavigate('listening'); setOpenDropdown(null); } },
    { id: 'analytics', title: 'Báo cáo & Dự báo điểm', desc: 'Biểu đồ tăng trưởng theta & dự báo điểm thi', icon: Activity, action: () => { onNavigate('analytics'); setOpenDropdown(null); } },
    { id: 'vocab-lib', title: 'Học liệu & Từ vựng SGK', desc: 'Tra cứu từ vựng kèm phát âm IPA chuẩn', icon: BookMarked, action: () => { onNavigate('vocab-library'); setOpenDropdown(null); } },
    { id: 'item-bank', title: 'Ngân hàng câu hỏi Item Bank', desc: 'Kho câu hỏi chuẩn hóa phục vụ nghiên cứu', icon: Database, action: () => { onNavigate('item-bank'); setOpenDropdown(null); } }
  ];

  const congDongItems = [
    { id: 'guide', title: 'Hướng dẫn sử dụng', desc: 'Video & tài liệu chi tiết từng tính năng', icon: HelpCircle, action: () => { onNavigate('guide'); setOpenDropdown(null); } },
    { id: 'project', title: 'Giới thiệu Dự án KHKT', desc: 'Đề tài Nghiên cứu KHKT Quốc Gia', badge: 'KHKT', icon: GraduationCap, action: () => { onNavigate('guide'); setOpenDropdown(null); } },
    { id: 'ranking', title: 'Bảng xếp hạng Năng lực', desc: 'Thi đua bảng điểm thành thạo', icon: Award, action: () => { onNavigate('analytics'); setOpenDropdown(null); } }
  ];

  return (
    <header ref={navRef} className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070a14]/97 backdrop-blur-2xl">
      {/* Top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-5">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer text-left group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-300">
              <GraduationCap className="w-5 h-5" />
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-blue-500/0 to-indigo-500/20 group-hover:from-blue-500/20 group-hover:to-indigo-500/40 transition-all rounded-xl" />
            </div>
            <div>
              <span className="font-extrabold text-base text-white tracking-tight block font-outfit">
                AI ENGLISH <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">MENTOR</span>
              </span>
              <span className="text-[10px] text-amber-400 font-bold tracking-widest block uppercase">
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
                      ? 'text-white bg-white/08'
                      : 'text-slate-400 hover:text-white hover:bg-white/05'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                  <span>{label}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${openDropdown === id ? 'rotate-180 text-slate-300' : ''}`} />
                  {/* Active underline indicator */}
                  {openDropdown === id && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" />
                  )}
                </button>
              </div>
            ))}
          </nav>
        </div>

        {/* Right: Grade Switcher & Profile Badge */}
        <div className="flex items-center gap-2.5">
          {/* Grade Switcher */}
          <div className="hidden md:flex items-center bg-white/[0.035] border border-white/[0.07] p-1 rounded-xl gap-1 backdrop-blur-sm">
            {/* THPT / THCS toggle */}
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

            {/* Individual Grade Buttons */}
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

          {/* User Profile Badge */}
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] hover:border-white/[0.14] px-3 py-1.5 rounded-xl cursor-pointer transition-all duration-200"
              title="Xem hồ sơ cá nhân"
            >
              {/* Avatar */}
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500/40 to-teal-500/30 border border-emerald-500/30 flex items-center justify-center text-[10px] font-black text-emerald-300 shrink-0">
                {(currentUser.fullname || currentUser.username || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[11px] font-bold text-white truncate max-w-[100px]">
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
              className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đăng nhập / Đăng ký</span>
              <span className="sm:hidden">Đăng nhập</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── MEGA DROPDOWN PANELS ────────────────────────────────────────── */}
      {openDropdown && (
        <div className="border-t border-white/[0.06] bg-[#07090f]/98 backdrop-blur-3xl px-4 md:px-8 py-6 animate-fade-in" style={{ boxShadow: '0 24px 60px -12px rgba(0,0,0,0.6)' }}>
          <div className="max-w-[1600px] mx-auto">
            {/* Header info in panel */}
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
  );
}
