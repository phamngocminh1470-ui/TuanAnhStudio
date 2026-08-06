import React, { useState, useEffect } from 'react';
import {
  User, Mail, Lock, Target, GraduationCap, X, CheckCircle2,
  AlertCircle, Save, RefreshCw, Eye, EyeOff, RotateCcw, TrendingUp
} from 'lucide-react';
import axios from 'axios';

const API = '/api';

// Danh sách avatar seeds dùng cho DiceBear Avatars (không cần upload file)
const AVATAR_STYLES = [
  'adventurer', 'avataaars', 'bottts', 'croodles', 'fun-emoji',
  'icons', 'lorelei', 'micah', 'miniavs', 'personas'
];

const AvatarPreview = ({ seed, style = 'initials' }) => {
  // Hiển thị avatar dạng initials đơn giản (không cần internet)
  const initials = (seed || 'U').substring(0, 2).toUpperCase();
  const colors = ['4F46E5', '7C3AED', 'DB2777', '059669', 'D97706', '0284C7', 'DC2626'];
  const colorIdx = seed ? seed.charCodeAt(0) % colors.length : 0;
  const bg = colors[colorIdx];
  return (
    <div
      className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl"
      style={{ backgroundColor: `#${bg}` }}
    >
      {initials}
    </div>
  );
};

export default function UserProfileModal({ isOpen, onClose, currentUser, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password' | 'progress'
  const [profileForm, setProfileForm] = useState({
    fullname: '', email: '', grade: '12', target_score: 7.0, avatar_seed: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '', new_password: '', confirm_password: ''
  });
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [progress, setProgress] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen || !currentUser) return;
    setProfileForm({
      fullname: currentUser.fullname || '',
      email: currentUser.email || '',
      grade: currentUser.grade || '12',
      target_score: currentUser.target_score || 7.0,
      avatar_seed: currentUser.avatar_seed || currentUser.username || '',
    });
    clearMessages();
    if (activeTab === 'progress') fetchProgress();
  }, [isOpen, currentUser]);

  useEffect(() => {
    if (isOpen && activeTab === 'progress') fetchProgress();
  }, [activeTab]);

  const clearMessages = () => { setSuccessMsg(''); setErrorMsg(''); };
  const setFieldProfile = (k, v) => setProfileForm(p => ({ ...p, [k]: v }));
  const setFieldPassword = (k, v) => setPasswordForm(p => ({ ...p, [k]: v }));

  const fetchProgress = async () => {
    setLoadingProgress(true);
    try {
      const [progRes, sessRes] = await Promise.all([
        axios.get(`${API}/user/progress`),
        axios.get(`${API}/user/sessions?limit=10`)
      ]);
      setProgress(progRes.data.progress);
      setSessions(sessRes.data.sessions || []);
    } catch (e) {
      setProgress(null);
    } finally {
      setLoadingProgress(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!profileForm.fullname.trim()) { setErrorMsg('Họ và tên không được để trống.'); return; }
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
      setSuccessMsg('Cập nhật hồ sơ thành công!');
      onProfileUpdate(updatedUser);
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Lỗi cập nhật hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!passwordForm.current_password || !passwordForm.new_password) {
      setErrorMsg('Vui lòng điền đầy đủ mật khẩu.'); return;
    }
    if (passwordForm.new_password.length < 6) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự.'); return;
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setErrorMsg('Mật khẩu mới và xác nhận không khớp.'); return;
    }
    setLoading(true);
    try {
      await axios.put(`${API}/auth/password`, {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      setSuccessMsg('Đổi mật khẩu thành công!');
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Lỗi đổi mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetProgress = async () => {
    if (!window.confirm('Reset toàn bộ tiến độ học tập? Lịch sử phiên học được giữ nguyên cho nghiên cứu. Không thể hoàn tác.')) return;
    try {
      await axios.delete(`${API}/user/progress/reset`);
      setSuccessMsg('Đã reset tiến độ học tập về ban đầu.');
      fetchProgress();
    } catch (err) {
      setErrorMsg('Lỗi reset tiến độ.');
    }
  };

  if (!isOpen || !currentUser) return null;

  const TABS = [
    { id: 'profile', label: 'Hồ sơ' },
    { id: 'password', label: 'Mật khẩu' },
    { id: 'progress', label: 'Tiến độ học' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0d1117] border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-[#0d1117] border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <AvatarPreview seed={profileForm.avatar_seed || currentUser.username} />
            <div>
              <div className="font-black text-white">{currentUser.fullname || currentUser.username}</div>
              <div className="text-xs text-indigo-400 font-bold capitalize">{currentUser.role} • Lớp {currentUser.grade}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-white/10 px-6 gap-1 bg-[#0d1117] sticky top-[89px] z-10">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); clearMessages(); }}
              className={`px-4 py-3 text-sm font-bold border-b-2 transition cursor-pointer ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-5">
          {/* Alerts */}
          {successMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />{successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />{errorMsg}
            </div>
          )}

          {/* ── TAB: PROFILE ── */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar seed selection */}
              <div>
                <label className="text-xs font-extrabold text-gray-400 mb-2 block">Avatar (seed văn bản)</label>
                <div className="flex items-center gap-3">
                  <AvatarPreview seed={profileForm.avatar_seed || currentUser.username} />
                  <input value={profileForm.avatar_seed}
                    onChange={e => setFieldProfile('avatar_seed', e.target.value)}
                    placeholder="Nhập bất kỳ chữ gì để thay avatar..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none" />
                </div>
                <p className="text-[11px] text-gray-600 mt-1">Màu avatar thay đổi theo chữ bạn nhập.</p>
              </div>

              {/* Fullname */}
              <div>
                <label className="text-xs font-extrabold text-gray-400 mb-1 block">Họ và Tên *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input value={profileForm.fullname} onChange={e => setFieldProfile('fullname', e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-extrabold text-gray-400 mb-1 block">Email (tùy chọn)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input type="email" value={profileForm.email} onChange={e => setFieldProfile('email', e.target.value)}
                    placeholder="email@truong.edu.vn"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none" />
                </div>
              </div>

              {/* Grade + Target */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-gray-400 mb-1 block flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" /> Khối lớp
                  </label>
                  <select value={profileForm.grade} onChange={e => setFieldProfile('grade', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-200 outline-none cursor-pointer">
                    {['10','11','12'].map(g => <option key={g} value={g}>Lớp {g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-extrabold text-gray-400 mb-1 block flex items-center gap-1">
                    <Target className="w-3 h-3" /> Mục tiêu THPT
                  </label>
                  <select value={profileForm.target_score} onChange={e => setFieldProfile('target_score', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-200 outline-none cursor-pointer">
                    {[6,6.5,7,7.5,8,8.5,9,9.5,10].map(s => <option key={s} value={s}>{s} điểm</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm transition disabled:opacity-50 cursor-pointer shadow-lg">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Lưu hồ sơ
              </button>
            </form>
          )}

          {/* ── TAB: PASSWORD ── */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              {[
                { label: 'Mật khẩu hiện tại', key: 'current_password', show: showCurrentPwd, toggle: () => setShowCurrentPwd(v => !v) },
                { label: 'Mật khẩu mới (≥ 6 ký tự)', key: 'new_password', show: showNewPwd, toggle: () => setShowNewPwd(v => !v) },
                { label: 'Xác nhận mật khẩu mới', key: 'confirm_password', show: showNewPwd, toggle: () => setShowNewPwd(v => !v) },
              ].map(({ label, key, show, toggle }) => (
                <div key={key}>
                  <label className="text-xs font-extrabold text-gray-400 mb-1 block">{label}</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                    <input type={show ? 'text' : 'password'}
                      value={passwordForm[key]} onChange={e => setFieldPassword(key, e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none" />
                    <button type="button" onClick={toggle} className="absolute right-3 top-3 text-gray-500 cursor-pointer">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-sm transition disabled:opacity-50 cursor-pointer">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Đổi mật khẩu
              </button>
              <p className="text-center text-xs text-gray-600">
                Nếu quên mật khẩu cũ, vui lòng liên hệ giáo viên quản lý để được reset.
              </p>
            </form>
          )}

          {/* ── TAB: PROGRESS ── */}
          {activeTab === 'progress' && (
            <div className="space-y-5">
              {loadingProgress ? (
                <div className="text-center animate-pulse text-gray-500 py-8">Đang tải tiến độ...</div>
              ) : progress ? (
                <>
                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Năng lực Theta (IRT)', value: progress.theta?.toFixed(3), unit: '', color: 'text-indigo-400' },
                      { label: 'Độ chính xác', value: progress.accuracy, unit: '%', color: 'text-emerald-400' },
                      { label: 'Số buổi học', value: progress.total_sessions, unit: ' buổi', color: 'text-white' },
                      { label: 'Câu đã làm', value: progress.total_questions, unit: ' câu', color: 'text-white' },
                      { label: 'Streak', value: progress.streak_days, unit: ' ngày 🔥', color: 'text-amber-400' },
                      { label: 'Câu đúng', value: progress.total_correct, unit: ' câu', color: 'text-emerald-400' },
                    ].map((s, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <div className="text-[10px] text-gray-500 font-bold">{s.label}</div>
                        <div className={`text-xl font-black ${s.color}`}>{s.value}{s.unit}</div>
                      </div>
                    ))}
                  </div>

                  {/* Skill mastery breakdown */}
                  {progress.skill_mastery && Object.keys(progress.skill_mastery).length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-extrabold text-gray-400 uppercase">Độ thành thạo kỹ năng</h4>
                      {Object.entries(progress.skill_mastery).map(([skill, mastery]) => (
                        <div key={skill} className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 w-32 truncate">{skill}</span>
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                              style={{ width: `${Math.min(100, Math.round(mastery * 100))}%` }} />
                          </div>
                          <span className="text-xs font-bold text-white w-10 text-right">{Math.round(mastery * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recent sessions */}
                  {sessions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-extrabold text-gray-400 uppercase">10 phiên học gần nhất</h4>
                      {sessions.map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5 text-xs">
                          <div>
                            <span className="font-bold text-gray-300">{s.session_type}</span>
                            {s.skill_focus && <span className="text-gray-500"> • {s.skill_focus}</span>}
                          </div>
                          <div className="flex items-center gap-3 text-gray-500">
                            <span>{s.questions_answered} câu</span>
                            <span className={s.accuracy >= 70 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{s.accuracy}%</span>
                            {s.theta_change >= 0 ? (
                              <span className="text-indigo-400">+{s.theta_change} θ</span>
                            ) : (
                              <span className="text-rose-400">{s.theta_change} θ</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reset button */}
                  <div className="pt-2 border-t border-white/10">
                    <button onClick={handleResetProgress}
                      className="flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 transition cursor-pointer font-bold">
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset toàn bộ tiến độ học tập về ban đầu
                    </button>
                    <p className="text-[10px] text-gray-600 mt-1">Lịch sử phiên học được giữ nguyên cho nghiên cứu KHKT.</p>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>Chưa có dữ liệu tiến độ. Hãy bắt đầu học!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
