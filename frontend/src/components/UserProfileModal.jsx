import React, { useState, useEffect } from 'react';
import {
  User, Mail, Lock, Target, GraduationCap, X, CheckCircle2,
  AlertCircle, Save, RefreshCw, Eye, EyeOff, RotateCcw,
  TrendingUp, Calendar, Clock, MessageSquare, Brain, ChevronRight,
  Sparkles, Flame, Award, Bell
} from 'lucide-react';
import axios from 'axios';

const API = '/api';

export default function UserProfileModal({ isOpen, onClose, currentUser, onProfileUpdate }) {
  const [profileForm, setProfileForm] = useState({
    fullname: '', email: '', grade: '12', target_score: 7.0, avatar_seed: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '', new_password: '', confirm_password: ''
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  
  const [streakDays, setStreakDays] = useState(0);
  const [checkedDays, setCheckedDays] = useState([]); // [0..6] (0 = T2, 6 = CN)
  const [isCheckedToday, setIsCheckedToday] = useState(false);
  const [points, setPoints] = useState(0);
  const [showMemoryDetails, setShowMemoryDetails] = useState(false);

  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const DAYS_OF_WEEK = [
    { label: 'T2', dayIdx: 1 },
    { label: 'T3', dayIdx: 2 },
    { label: 'T4', dayIdx: 3 },
    { label: 'T5', dayIdx: 4 },
    { label: 'T6', dayIdx: 5 },
    { label: 'T7', dayIdx: 6 },
    { label: 'CN', dayIdx: 0 },
  ];

  // Tính thứ hiện tại (0 = CN, 1 = T2, ..., 6 = T7)
  const todayDayIdx = new Date().getDay();
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!isOpen) return;

    // Load form
    setProfileForm({
      fullname: currentUser?.fullname || currentUser?.username || 'Minh Phamngoc',
      email: currentUser?.email || '',
      grade: currentUser?.grade || '12',
      target_score: currentUser?.target_score || 7.0,
      avatar_seed: currentUser?.avatar_seed || currentUser?.fullname || '',
    });

    // Khôi phục trạng thái điểm danh từ localStorage
    const savedCheckinDate = localStorage.getItem('last_checkin_date');
    const savedStreak = parseInt(localStorage.getItem('checkin_streak') || '0', 10);
    const savedPoints = parseInt(localStorage.getItem('user_points') || '0', 10);
    const savedHistory = JSON.parse(localStorage.getItem('checkin_history') || '[]');

    setStreakDays(savedStreak);
    setPoints(savedPoints);
    setCheckedDays(savedHistory);

    if (savedCheckinDate === todayStr) {
      setIsCheckedToday(true);
    } else {
      setIsCheckedToday(false);
    }

    clearMessages();
  }, [isOpen, currentUser]);

  const clearMessages = () => { setSuccessMsg(''); setErrorMsg(''); };
  const setFieldProfile = (k, v) => setProfileForm(p => ({ ...p, [k]: v }));
  const setFieldPassword = (k, v) => setPasswordForm(p => ({ ...p, [k]: v }));

  // Xử lý điểm danh
  const handleCheckIn = () => {
    if (isCheckedToday) return;

    setCheckingIn(true);
    setTimeout(() => {
      const newStreak = streakDays + 1;
      const newPoints = points + 50;
      const newHistory = Array.from(new Set([...checkedDays, todayDayIdx]));

      setStreakDays(newStreak);
      setPoints(newPoints);
      setCheckedDays(newHistory);
      setIsCheckedToday(true);

      localStorage.setItem('last_checkin_date', todayStr);
      localStorage.setItem('checkin_streak', newStreak.toString());
      localStorage.setItem('user_points', newPoints.toString());
      localStorage.setItem('checkin_history', JSON.stringify(newHistory));

      setSuccessMsg('🎉 Điểm danh thành công! Bạn nhận được +50 điểm và duy trì Streak!');
      setCheckingIn(false);
    }, 400);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!profileForm.fullname.trim()) { setErrorMsg('Biệt danh không được để trống.'); return; }
    setLoading(true);
    try {
      const res = await axios.put(`${API}/auth/profile`, {
        fullname: profileForm.fullname.trim(),
        email: profileForm.email.trim(),
        grade: profileForm.grade,
        target_score: parseFloat(profileForm.target_score),
        avatar_seed: profileForm.avatar_seed || profileForm.fullname,
      });
      const updatedUser = { ...currentUser, ...res.data.user, isLoggedIn: true };
      localStorage.setItem('user_session', JSON.stringify(updatedUser));
      setSuccessMsg('Đã lưu thay đổi hồ sơ thành công!');
      if (onProfileUpdate) onProfileUpdate(updatedUser);
    } catch (err) {
      // Fallback local update
      const updatedUser = {
        ...currentUser,
        fullname: profileForm.fullname.trim(),
        grade: profileForm.grade,
        target_score: parseFloat(profileForm.target_score),
      };
      localStorage.setItem('user_session', JSON.stringify(updatedUser));
      setSuccessMsg('Đã lưu thông tin hồ sơ của bạn!');
      if (onProfileUpdate) onProfileUpdate(updatedUser);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b0f19] border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto custom-scrollbar relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: Title and Subtitle */}
        <div className="pt-8 pb-4 text-center px-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Hồ sơ của tôi</h2>
          <p className="text-sm text-slate-400 font-medium mt-1">Quản lý thông tin cá nhân</p>
        </div>

        {/* Alerts */}
        <div className="px-6 md:px-8">
          {successMsg && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs md:text-sm font-bold my-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />{successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs md:text-sm font-bold my-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />{errorMsg}
            </div>
          )}
        </div>

        <div className="px-6 md:px-8 pb-8 space-y-4">

          {/* ════ CARD 1: ĐIỂM DANH (ATTENDANCE & STREAK) ════ */}
          <div className="rounded-2xl bg-[#111726]/90 border border-white/10 p-5 md:p-6 shadow-xl transition">
            <div className="flex items-center gap-2 text-sm md:text-base font-bold text-emerald-400 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-white">Điểm danh</span>
              <span className="text-slate-500 font-medium">·</span>
              <span className="text-slate-300 font-bold">Streak: {streakDays} ngày</span>
              {streakDays > 0 && <span className="text-base">🔥</span>}
            </div>

            {/* Days of week pills */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {DAYS_OF_WEEK.map(({ label, dayIdx }) => {
                const isToday = todayDayIdx === dayIdx;
                const isChecked = checkedDays.includes(dayIdx);

                return (
                  <div
                    key={label}
                    className={`py-2.5 rounded-xl text-center font-bold text-xs md:text-sm transition flex flex-col items-center justify-center gap-1 ${
                      isChecked
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : isToday
                        ? 'bg-white/10 text-white border border-blue-500/50'
                        : 'bg-white/[0.03] text-slate-500 border border-white/5'
                    }`}
                  >
                    <span>{label}</span>
                    {isChecked && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                  </div>
                );
              })}
            </div>

            {/* Checkin action button */}
            <button
              onClick={handleCheckIn}
              disabled={isCheckedToday || checkingIn}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 transition duration-200 shadow-lg cursor-pointer ${
                isCheckedToday
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 cursor-default'
                  : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/25 active:scale-[0.99]'
              }`}
            >
              {isCheckedToday ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Đã điểm danh hôm nay (+50 điểm)
                </>
              ) : checkingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Đang ghi nhận...
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  Điểm danh ngay (+50 điểm)
                </>
              )}
            </button>
          </div>

          {/* ════ CARD 2: HỘP THƯ CỦA TÔI (INBOX) ════ */}
          <div className="rounded-2xl bg-[#111726]/90 border border-white/10 p-5 md:p-6 shadow-xl">
            <div className="flex items-center gap-2.5 text-sm md:text-base font-bold text-blue-400 mb-4">
              <MessageSquare className="w-4 h-4" />
              <span className="text-white">Hộp thư của tôi</span>
            </div>

            <div className="py-8 flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 mb-3">
                <MessageSquare className="w-6 h-6 opacity-40" />
              </div>
              <p className="text-sm font-semibold text-slate-300">Chưa có tin nhắn nào.</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Bạn có thể báo lỗi câu hỏi/lời giải từ màn hình làm bài!
              </p>
            </div>
          </div>

          {/* ════ CARD 3: BỘ NHỚ HỌC TẬP CỦA TÔI (AI MEMORY) ════ */}
          <div className="rounded-2xl bg-[#111726]/90 border border-white/10 p-5 md:p-6 shadow-xl transition">
            <div
              onClick={() => setShowMemoryDetails(v => !v)}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-bold text-white group-hover:text-blue-400 transition">
                    Bộ nhớ học tập của tôi
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Xem những gì AI đã học về bạn để cá nhân hoá phản hồi · <span className="text-blue-400 underline font-medium">Tìm hiểu</span>
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-slate-500 group-hover:text-white transition duration-200 ${showMemoryDetails ? 'rotate-90' : ''}`} />
            </div>

            {/* Collapsible Memory Details */}
            {showMemoryDetails && (
              <div className="mt-4 pt-4 border-t border-white/5 space-y-3 animate-in fade-in">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-slate-500 font-bold block mb-1">Năng lực ước lượng (IRT)</span>
                    <span className="text-sm font-extrabold text-indigo-400">θ = +0.62 (Khá Giỏi)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-slate-500 font-bold block mb-1">Độ chính xác trung bình</span>
                    <span className="text-sm font-extrabold text-emerald-400">82.5%</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300 leading-relaxed">
                  💡 <strong>Ghi chú từ Socrates AI:</strong> Học sinh nắm rất chắc kiến thức về <em>Thì hiện tại hoàn thành</em> và <em>Động từ To Be</em>. Đang trong lộ trình rèn luyện nâng cao về <em>Đảo ngữ</em> và <em>Mệnh đề phân từ</em>.
                </div>
              </div>
            )}
          </div>

          {/* ════ CARD 4: CHỈNH SỬA HỒ SƠ (EDIT PROFILE) ════ */}
          <div className="rounded-2xl bg-[#111726]/90 border border-white/10 p-5 md:p-6 shadow-xl">
            <div className="flex items-center gap-2.5 text-sm md:text-base font-bold text-slate-200 mb-4">
              <User className="w-4 h-4 text-blue-400" />
              <span className="text-white">Chỉnh sửa hồ sơ</span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Biệt danh (Full name / Display name) */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">Biệt danh</label>
                <input
                  type="text"
                  value={profileForm.fullname}
                  onChange={e => setFieldProfile('fullname', e.target.value)}
                  placeholder="Nhập tên hiển thị..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-medium"
                />
                <p className="text-[11px] text-slate-500 mt-1.5">Tên này sẽ hiển thị trên bảng xếp hạng</p>
              </div>

              {/* Khối lớp & Điểm mục tiêu */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1.5 block">Khối lớp</label>
                  <select
                    value={profileForm.grade}
                    onChange={e => setFieldProfile('grade', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="6" className="bg-[#0b0f19]">Lớp 6</option>
                    <option value="7" className="bg-[#0b0f19]">Lớp 7</option>
                    <option value="8" className="bg-[#0b0f19]">Lớp 8</option>
                    <option value="9" className="bg-[#0b0f19]">Lớp 9</option>
                    <option value="10" className="bg-[#0b0f19]">Lớp 10</option>
                    <option value="11" className="bg-[#0b0f19]">Lớp 11</option>
                    <option value="12" className="bg-[#0b0f19]">Lớp 12</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1.5 block">Mục tiêu THPT</label>
                  <select
                    value={profileForm.target_score}
                    onChange={e => setFieldProfile('target_score', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(s => (
                      <option key={s} value={s} className="bg-[#0b0f19]">{s} điểm</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Save Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/20 active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Lưu thay đổi
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

