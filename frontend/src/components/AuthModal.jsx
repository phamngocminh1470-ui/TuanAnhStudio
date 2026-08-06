import React, { useState } from 'react';
import { User, Lock, Mail, GraduationCap, X, CheckCircle2, ArrowRight, Eye, EyeOff, Target } from 'lucide-react';
import axios from 'axios';

const API = '/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({
    username: '', fullname: '', email: '', password: '',
    role: 'student', grade: '12', target_score: 7.0
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const setField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const clearMessages = () => { setErrorMsg(''); setSuccessMsg(''); };

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
        ? { username: form.username.trim().toLowerCase(), fullname: form.fullname.trim(), email: form.email.trim(), password: form.password, role: form.role, grade: form.grade, target_score: parseFloat(form.target_score) }
        : { username: form.username.trim().toLowerCase(), password: form.password };

      const res = await axios.post(endpoint, payload);
      const { token, user } = res.data;

      // Lưu JWT token và user info
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_session', JSON.stringify({ ...user, isLoggedIn: true, token }));

      // Set axios default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setSuccessMsg(mode === 'register' ? 'Đăng ký thành công! Chào mừng bạn.' : 'Đăng nhập thành công!');

      setTimeout(() => {
        onLoginSuccess({ ...user, isLoggedIn: true, token });
        onClose();
      }, 700);

    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setErrorMsg(detail);
      } else if (Array.isArray(detail)) {
        setErrorMsg(detail.map(d => d.msg).join(', '));
      } else {
        setErrorMsg('Kết nối tới server thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
        <button onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-black text-xl text-white font-outfit">
              {mode === 'register' ? 'Đăng ký Tài khoản' : 'Đăng nhập Hệ thống'}
            </h3>
            <p className="text-xs text-gray-400">AI English Mentor • KHKT Platform</p>
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fullname — only on register */}
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Họ và Tên *</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" />
                <input type="text" value={form.fullname} onChange={e => setField('fullname', e.target.value)}
                  placeholder="Nguyễn Văn A" autoFocus
                  className="w-full bg-[#070a16] border border-white/10 focus:border-indigo-500 outline-none rounded-2xl pl-11 pr-4 py-3 text-sm text-gray-200" />
              </div>
            </div>
          )}

          {/* Username */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Tên Đăng Nhập *</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" />
              <input type="text" value={form.username} onChange={e => setField('username', e.target.value)}
                placeholder={mode === 'register' ? "vd: nguyenvana2026" : "Tên đăng nhập"}
                autoFocus={mode === 'login'}
                className="w-full bg-[#070a16] border border-white/10 focus:border-indigo-500 outline-none rounded-2xl pl-11 pr-4 py-3 text-sm text-gray-200 lowercase" />
            </div>
          </div>

          {/* Email — only on register */}
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Email (tùy chọn)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" />
                <input type="email" value={form.email} onChange={e => setField('email', e.target.value)}
                  placeholder="email@truong.edu.vn"
                  className="w-full bg-[#070a16] border border-white/10 focus:border-indigo-500 outline-none rounded-2xl pl-11 pr-4 py-3 text-sm text-gray-200" />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Mật Khẩu *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" />
              <input type={showPassword ? 'text' : 'password'}
                value={form.password} onChange={e => setField('password', e.target.value)}
                placeholder={mode === 'register' ? "Tối thiểu 6 ký tự" : "••••••••"}
                className="w-full bg-[#070a16] border border-white/10 focus:border-indigo-500 outline-none rounded-2xl pl-11 pr-11 py-3 text-sm text-gray-200" />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-300 cursor-pointer">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Grade + Role + Target — only on register */}
          {mode === 'register' && (
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Lớp</label>
                <select value={form.grade} onChange={e => setField('grade', e.target.value)}
                  className="w-full bg-[#070a16] border border-white/10 focus:border-indigo-500 outline-none rounded-xl px-3 py-2.5 text-sm text-gray-200 cursor-pointer">
                  {['10','11','12'].map(g => <option key={g} value={g}>Lớp {g}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Vai trò</label>
                <select value={form.role} onChange={e => setField('role', e.target.value)}
                  className="w-full bg-[#070a16] border border-white/10 focus:border-indigo-500 outline-none rounded-xl px-3 py-2.5 text-sm text-gray-200 cursor-pointer">
                  <option value="student">Học sinh</option>
                  <option value="teacher">Giáo viên</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1"><Target className="w-3 h-3"/>Mục tiêu</label>
                <select value={form.target_score} onChange={e => setField('target_score', e.target.value)}
                  className="w-full bg-[#070a16] border border-white/10 focus:border-indigo-500 outline-none rounded-xl px-3 py-2.5 text-sm text-gray-200 cursor-pointer">
                  {[6,6.5,7,7.5,8,8.5,9,9.5,10].map(s => <option key={s} value={s}>{s} điểm</option>)}
                </select>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-4 mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'register' ? 'Đăng ký ngay' : 'Đăng nhập vào Hệ thống'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-gray-400 border-t border-white/10">
          {mode === 'register' ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
          <button onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); clearMessages(); }}
            className="text-indigo-400 font-extrabold underline hover:text-indigo-300 cursor-pointer">
            {mode === 'register' ? 'Đăng nhập ngay' : 'Đăng ký học sinh mới'}
          </button>
        </div>

        <p className="text-center text-[10px] text-gray-600">
          Quên mật khẩu? Liên hệ giáo viên quản lý hệ thống để được reset.
        </p>
      </div>
    </div>
  );
}
