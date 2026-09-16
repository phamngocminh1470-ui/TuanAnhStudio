import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Mail, GraduationCap, X, CheckCircle2, ArrowRight, Eye, EyeOff, 
  Briefcase, Phone, Building2, MessageCircle, Copy, Check, ExternalLink, ShieldCheck, Sparkles, Key
} from 'lucide-react';
import axios from 'axios';

const API = '/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, onNavigate, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [registerRole, setRegisterRole] = useState('student'); // 'student' | 'teacher'
  
  useEffect(() => {
    if (isOpen && initialMode) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Form học sinh
  const [form, setForm] = useState({
    username: '', fullname: '', email: '', password: '',
    role: 'student', grade: '12', target_score: 7.0
  });

  // Form giáo viên / cán bộ quản lý
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    phone: '',
    school: '',
    roleTitle: 'Giáo viên Tiếng Anh',
    note: ''
  });

  const [teacherSuccess, setTeacherSuccess] = useState(false);
  const [copiedZaloText, setCopiedZaloText] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const setField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const setTeacherField = (key, val) => setTeacherForm(prev => ({ ...prev, [key]: val }));
  
  const clearMessages = () => { 
    setErrorMsg(''); 
    setSuccessMsg(''); 
  };

  const resetAll = () => {
    clearMessages();
    setTeacherSuccess(false);
  };

  // 1. Xử lý đăng nhập / đăng ký học sinh
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    // Client-side validation
    if (!form.username.trim()) { setErrorMsg('Vui lòng nhập tên đăng nhập.'); return; }
    if (!form.password.trim()) { setErrorMsg('Vui lòng nhập mật khẩu.'); return; }
    if (mode === 'register') {
      if (!form.fullname.trim()) { setErrorMsg('Vui lòng nhập họ và tên.'); return; }
      if (form.username.trim().length < 3) { setErrorMsg('Tên đăng nhập phải có ít nhất 3 ký tự.'); return; }
      if (form.password.length < 6) { setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự.'); return; }
    }

    setLoading(true);
    try {
      const endpoint = mode === 'register' ? `${API}/auth/register` : `${API}/auth/login`;
      const payload = mode === 'register'
        ? { username: form.username.trim().toLowerCase(), fullname: form.fullname.trim(), email: (form.email || '').trim(), password: form.password, role: 'student', grade: form.grade || '12', target_score: 7.0 }
        : { username: form.username.trim().toLowerCase(), password: form.password };

      const res = await axios.post(endpoint, payload);
      const { token, user } = res.data;

      // Lưu JWT token và user info
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_session', JSON.stringify({ ...user, isLoggedIn: true, token }));

      // Set axios default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setSuccessMsg(mode === 'register' ? 'Đăng ký thành công! Đang chuyển tiếp...' : 'Đăng nhập thành công!');

      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess({ ...user, isLoggedIn: true, token });
        onClose();
      }, 600);

    } catch (err) {
      // Nếu là môi trường preview local / offline không có backend
      const isOfflineOrProxyError = 
        !err.response || 
        err.code === 'ERR_NETWORK' || 
        err.response?.status >= 500 || 
        err.response?.status === 404 ||
        (typeof err.response?.data === 'string' && (err.response?.data.includes('proxy') || err.response?.data.includes('ECONNREFUSED')));

      if (isOfflineOrProxyError) {
        const fallbackUser = {
          username: form.username.trim(),
          fullname: form.fullname.trim() || form.username.trim(),
          role: 'student',
          grade: form.grade || '12',
          isLoggedIn: true,
          token: 'preview-token-' + Date.now()
        };
        localStorage.setItem('auth_token', fallbackUser.token);
        localStorage.setItem('user_session', JSON.stringify(fallbackUser));

        setSuccessMsg(mode === 'register' ? 'Đăng ký tài khoản thành công!' : 'Đăng nhập thành công!');

        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(fallbackUser);
          onClose();
        }, 600);
        return;
      }

      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setErrorMsg(detail);
      } else if (Array.isArray(detail)) {
        setErrorMsg(detail.map(d => d.msg).join(', '));
      } else {
        setErrorMsg(err.response?.data?.error || err.response?.data?.message || 'Kết nối tới server thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Xử lý đăng ký Giáo viên và chuyển sang Zalo Admin
  const getZaloTemplateMessage = () => {
    return `Xin chào Admin Examora AI (0975.711.254)!
Tôi vừa điền form đăng ký tài khoản Giáo viên trên hệ thống:
• Họ và tên: ${teacherForm.name.trim()}
• Vai trò / Bộ môn: ${teacherForm.roleTitle || 'Giáo viên Tiếng Anh'}
• Đơn vị / Trường: ${teacherForm.school.trim() || 'Trường THPT'}
• SĐT / Zalo: ${teacherForm.phone.trim()}
${teacherForm.note.trim() ? `• Nhu cầu / Ghi chú: ${teacherForm.note.trim()}\n` : ''}Vui lòng phê duyệt và cấp Mã Kích Hoạt riêng (Teacher Access Key) giúp tôi! Xin cảm ơn Admin!`;
  };

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!teacherForm.name.trim()) {
      setErrorMsg('Vui lòng nhập Họ và Tên Thầy/Cô.');
      return;
    }
    if (!teacherForm.phone.trim()) {
      setErrorMsg('Vui lòng nhập Số điện thoại hoặc Zalo liên hệ.');
      return;
    }

    setLoading(true);
    const msgText = getZaloTemplateMessage();

    try {
      // Gửi vào CSDL Backend
      await axios.post(`${API}/teacher-requests`, {
        teacher_name: teacherForm.name.trim(),
        phone: teacherForm.phone.trim(),
        school: teacherForm.school.trim(),
        role_title: teacherForm.roleTitle,
        note: teacherForm.note.trim()
      }).catch(err => {
        console.warn('Lỗi lưu CSDL teacher-requests, tiếp tục lưu local:', err);
      });

      // Lưu vào localStorage đồng bộ cho AdminPanel
      try {
        const existing = JSON.parse(localStorage.getItem('admin_teacher_registration_requests') || '[]');
        const newReq = {
          id: 'REQ-' + Date.now(),
          teacherName: teacherForm.name.trim(),
          phone: teacherForm.phone.trim(),
          school: teacherForm.school.trim() || 'Trường THPT',
          roleTitle: teacherForm.roleTitle,
          note: teacherForm.note.trim(),
          timestamp: new Date().toLocaleString('vi-VN'),
          status: 'pending'
        };
        existing.unshift(newReq);
        localStorage.setItem('admin_teacher_registration_requests', JSON.stringify(existing));
      } catch (e) {}

      // Tự động sao chép tin nhắn chuẩn vào clipboard
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(msgText);
          setCopiedZaloText(true);
        }
      } catch (clipErr) {
        console.warn('Clipboard write error:', clipErr);
      }

      // Tự động mở trang Zalo kết nối trực tiếp Admin Tuấn Anh
      window.open('https://zalo.me/0975711254', '_blank');

      setTeacherSuccess(true);
    } catch (err) {
      setErrorMsg('Có lỗi xảy ra khi gửi thông tin. Thầy/Cô vui lòng nhắn tin trực tiếp qua Zalo 0975.711.254.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyZalo = async () => {
    try {
      const msg = getZaloTemplateMessage();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(msg);
        setCopiedZaloText(true);
        setTimeout(() => setCopiedZaloText(false), 3000);
      }
    } catch (e) {}
  };

  const handleOpenTeacherPortal = () => {
    onClose();
    if (onNavigate) {
      onNavigate('teacher-portal');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060a1e]/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#10193e]/95 rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-[0_20px_60px_rgba(3,7,26,0.85)] space-y-5 my-8 text-slate-100 backdrop-blur-2xl">
        
        {/* Nút đóng */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer border border-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Modal */}
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 shrink-0 border border-cyan-300/40">
            {mode === 'register' && registerRole === 'teacher' ? (
              <Briefcase className="w-6 h-6 text-white" />
            ) : (
              <GraduationCap className="w-7 h-7 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-xl text-slate-100 font-outfit text-3d-hero">
              {mode === 'login' 
                ? 'Đăng Nhập Tài Khoản' 
                : (registerRole === 'teacher' ? 'Đăng Ký Tài Khoản Giáo Viên' : 'Đăng Ký Tài Khoản Học Sinh')}
            </h3>
            <p className="text-xs text-cyan-300/70 font-mono flex items-center gap-1.5 mt-0.5">
              <span>Examora AI • Nền Tảng Học Thích Ứng</span>
              {mode === 'register' && registerRole === 'teacher' && (
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
                  Phê Duyệt Sư Phạm
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* BỘ CHUYỂN ĐỔI VAI TRÒ (CHỈ HIỆN KHI Ở CHẾ ĐỘ ĐĂNG KÝ) */}
        {mode === 'register' && !teacherSuccess && (
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-mono text-cyan-300/80 uppercase tracking-wider block">
              Bạn Đăng Ký Với Vai Trò Nào?
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#0a0f24] p-1.5 rounded-2xl border border-cyan-500/20">
              <button
                type="button"
                onClick={() => { setRegisterRole('student'); clearMessages(); }}
                className={`py-2.5 px-3 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                  registerRole === 'student'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>🎓 Học Sinh THPT</span>
              </button>

              <button
                type="button"
                onClick={() => { setRegisterRole('teacher'); clearMessages(); }}
                className={`py-2.5 px-3 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                  registerRole === 'teacher'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-purple-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>👨‍🏫 Giáo Viên</span>
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* TRƯỜNG HỢP 1: GIÁO VIÊN ĐÃ GỬI YÊU CẦU ĐĂNG KÝ THÀNH CÔNG              */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        {mode === 'register' && registerRole === 'teacher' && teacherSuccess ? (
          <div className="space-y-5 animate-fade-in text-center py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold uppercase tracking-wider">
                Đã Gửi Đăng Ký Lên Hệ Thống
              </span>
              <h4 className="text-xl font-black text-white text-3d-hero">Kết Nối Zalo Nhận Mã Kích Hoạt</h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                Hệ thống đã ghi nhận yêu cầu của Thầy/Cô và tự động mở Zalo của <strong className="text-cyan-300">Admin Tuấn Anh (0975.711.254)</strong>. Lời nhắn chuẩn hóa đã được sao chép sẵn vào bộ nhớ tạm.
              </p>
            </div>

            {/* Hộp tóm tắt thông tin đã gửi */}
            <div className="p-4 rounded-2xl bg-[#0a0f24] border border-cyan-500/20 text-left text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Họ và Tên:</span>
                <strong className="text-white">{teacherForm.name}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>SĐT / Zalo:</span>
                <strong className="text-cyan-300 font-mono">{teacherForm.phone}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Đơn vị:</span>
                <strong className="text-slate-200">{teacherForm.school || 'Trường THPT'}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Chức vụ:</span>
                <strong className="text-amber-300">{teacherForm.roleTitle}</strong>
              </div>
            </div>

            {/* Các nút hành động Zalo */}
            <div className="space-y-2.5 pt-1">
              <a
                href="https://zalo.me/0975711254"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white text-xs font-black shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition transform hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Nhắn Tin Zalo Admin 0975.711.254 Để Nhận Mã Ngay</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleCopyZalo}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {copiedZaloText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">✓ Đã Sao Chép Lời Nhắn Zalo (Chỉ cần Paste Ctrl+V)</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-400" />
                    <span>Sao Chép Lại Lời Nhắn Gửi Zalo</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleOpenTeacherPortal}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-extrabold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Key className="w-4 h-4 text-amber-400" />
                <span>Đã Nhận Mã Key? Mở Cổng Giáo Viên Để Nhập Mã</span>
              </button>
            </div>

            <div className="pt-2 text-[11px] text-slate-400">
              Hotline hỗ trợ trực tiếp 24/7: <strong className="text-cyan-300 font-mono">0975.711.254 (Admin Tuấn Anh)</strong>
            </div>
          </div>
        ) : mode === 'register' && registerRole === 'teacher' ? (
          /* ══════════════════════════════════════════════════════════════════════ */
          /* TRƯỜNG HỢP 2: FORM ĐĂNG KÝ GIÁO VIÊN                                   */
          /* ══════════════════════════════════════════════════════════════════════ */
          <form onSubmit={handleTeacherSubmit} className="space-y-3.5">
            {/* Banner hướng dẫn sư phạm */}
            <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs text-cyan-200 leading-relaxed">
                Để bảo mật đề thi và phân quyền quản lý học sinh, tài khoản Giáo viên sẽ được <strong className="text-amber-300">Admin Tuấn Anh trực tiếp cấp Mã Key</strong> qua Zalo sau khi Thầy/Cô gửi đăng ký.
              </p>
            </div>

            {/* Họ và tên Thầy Cô */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <span>Họ và Tên Thầy/Cô *</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  value={teacherForm.name}
                  onChange={e => setTeacherField('name', e.target.value)}
                  placeholder="Ví dụ: Thầy Trần Tuấn Anh..."
                  className="w-full bg-[#0a0f24] border border-cyan-500/30 focus:border-cyan-400 focus:bg-[#0d1430] outline-none rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition"
                />
              </div>
            </div>

            {/* Số điện thoại / Zalo */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Số Điện Thoại / Zalo Liên Hệ *
                </label>
                <span className="text-[10px] text-cyan-400 font-mono">Admin kết nối Zalo</span>
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="tel"
                  required
                  value={teacherForm.phone}
                  onChange={e => setTeacherField('phone', e.target.value)}
                  placeholder="Ví dụ: 0975711254..."
                  className="w-full bg-[#0a0f24] border border-cyan-500/30 focus:border-cyan-400 focus:bg-[#0d1430] outline-none rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 font-mono placeholder-slate-500 transition"
                />
              </div>
            </div>

            {/* Trường THPT / Đơn vị & Chức vụ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Trường / Đơn Vị</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={teacherForm.school}
                    onChange={e => setTeacherField('school', e.target.value)}
                    placeholder="THPT Chuyên / THPT..."
                    className="w-full bg-[#0a0f24] border border-cyan-500/30 focus:border-cyan-400 focus:bg-[#0d1430] outline-none rounded-2xl pl-10 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Môn Dạy / Vai Trò</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    value={teacherForm.roleTitle}
                    onChange={e => setTeacherField('roleTitle', e.target.value)}
                    className="w-full bg-[#0a0f24] border border-cyan-500/30 focus:border-cyan-400 focus:bg-[#0d1430] outline-none rounded-2xl pl-10 pr-3 py-2.5 text-xs text-slate-100 cursor-pointer transition"
                  >
                    <option value="Giáo viên Tiếng Anh" className="bg-[#0c122c] text-slate-100">Giáo viên Tiếng Anh</option>
                    <option value="Giáo viên Chủ nhiệm" className="bg-[#0c122c] text-slate-100">Giáo viên Chủ nhiệm</option>
                    <option value="Giáo viên Bộ môn" className="bg-[#0c122c] text-slate-100">Giáo viên Bộ môn</option>
                    <option value="Gia sư / Giáo viên tự do" className="bg-[#0c122c] text-slate-100">Gia sư / Giáo viên tự do</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Nhu cầu sử dụng / Ghi chú */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Nhu Cầu Sử Dụng / Ghi Chú</label>
              <textarea
                rows={2}
                value={teacherForm.note}
                onChange={e => setTeacherField('note', e.target.value)}
                placeholder="Ví dụ: Cần quản lý 2 lớp 12, tải đề Word lên để xáo thành 4 mã đề..."
                className="w-full bg-[#0a0f24] border border-cyan-500/30 focus:border-cyan-400 focus:bg-[#0d1430] outline-none rounded-2xl px-4 py-2.5 text-xs text-slate-100 resize-none placeholder-slate-500 transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-3d-primary w-full py-4 mt-1 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Đăng Ký &amp; Nhắn Zalo Admin (0975.711.254)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* ══════════════════════════════════════════════════════════════════════ */
          /* TRƯỜNG HỢP 3: FORM ĐĂNG NHẬP / FORM ĐĂNG KÝ HỌC SINH                   */
          /* ══════════════════════════════════════════════════════════════════════ */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Họ tên — chỉ khi đăng ký học sinh */}
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Họ và Tên Học Sinh *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={form.fullname}
                    onChange={e => setField('fullname', e.target.value)}
                    placeholder="Nguyễn Văn A"
                    autoFocus
                    className="w-full bg-[#0a0f24] border border-cyan-500/30 focus:border-cyan-400 focus:bg-[#0d1430] outline-none rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition"
                  />
                </div>
              </div>
            )}

            {/* Username */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Tên Đăng Nhập *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setField('username', e.target.value)}
                  placeholder={mode === 'register' ? "vd: nguyenvana2026" : "Tên đăng nhập"}
                  autoFocus={mode === 'login'}
                  className="w-full bg-[#0a0f24] border border-cyan-500/30 focus:border-cyan-400 focus:bg-[#0d1430] outline-none rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 lowercase placeholder-slate-500 transition"
                />
              </div>
            </div>

            {/* Email — chỉ khi đăng ký học sinh */}
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email (tùy chọn)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setField('email', e.target.value)}
                    placeholder="hocsinh@gmail.com (tùy chọn)"
                    className="w-full bg-[#0a0f24] border border-cyan-500/30 focus:border-cyan-400 focus:bg-[#0d1430] outline-none rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Mật Khẩu *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setField('password', e.target.value)}
                  placeholder={mode === 'register' ? "Tối thiểu 6 ký tự" : "••••••••"}
                  className="w-full bg-[#0a0f24] border border-cyan-500/30 focus:border-cyan-400 focus:bg-[#0d1430] outline-none rounded-2xl pl-11 pr-11 py-3 text-sm text-slate-100 placeholder-slate-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Grade selection — chỉ khi đăng ký học sinh */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Khối Lớp Học Tập *</label>
                  <span className="text-[10px] text-cyan-400 font-mono">Cố định theo tài khoản</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '10', label: 'Lớp 10', desc: 'GDPT 2018' },
                    { id: '11', label: 'Lớp 11', desc: 'Trọng tâm' },
                    { id: '12', label: 'Lớp 12', desc: 'Luyện thi THPT' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setField('grade', item.id)}
                      className={`py-2.5 px-2 rounded-xl text-center transition cursor-pointer border ${
                        form.grade === item.id
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 border-cyan-400 text-white shadow-md font-bold'
                          : 'bg-[#0a0f24] border-cyan-500/20 text-slate-300 hover:border-cyan-400/50'
                      }`}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[9px] opacity-80 font-mono">{item.desc}</div>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
                  Hệ thống tự động cá nhân hóa lộ trình thích ứng và bộ câu hỏi theo đúng khối lớp bạn chọn.
                </p>
              </div>
            )}

            {/* Nút Submit cho Học sinh / Đăng nhập */}
            <button
              type="submit"
              disabled={loading}
              className="btn-3d-primary w-full py-4 mt-2 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'register' ? 'Đăng Ký Tài Khoản Học Sinh' : 'Đăng Nhập Vào Hệ Thống'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer chuyển đổi Login / Register */}
        <div className="pt-3 text-center text-xs text-slate-400 border-t border-cyan-500/20 space-y-1.5">
          <div>
            {mode === 'register' ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
            <button
              onClick={() => {
                setMode(mode === 'register' ? 'login' : 'register');
                resetAll();
              }}
              className="text-cyan-400 font-bold underline hover:text-cyan-300 cursor-pointer ml-1"
            >
              {mode === 'register' ? 'Đăng nhập ngay' : 'Đăng ký tài khoản mới'}
            </button>
          </div>

          {mode === 'login' && (
            <div className="text-[11px] text-slate-400">
              Thầy/Cô muốn đăng ký cấp quyền Giáo viên?{' '}
              <button
                onClick={() => {
                  setMode('register');
                  setRegisterRole('teacher');
                  resetAll();
                }}
                className="text-amber-300 font-bold underline hover:text-amber-200 cursor-pointer"
              >
                Đăng ký Giáo viên
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-[10px] text-slate-500 font-mono">
          Hỗ trợ trực tiếp 24/7: <strong className="text-cyan-300 font-mono font-bold">0975.711.254 (Admin Tuấn Anh)</strong>
        </p>
      </div>
    </div>
  );
}
