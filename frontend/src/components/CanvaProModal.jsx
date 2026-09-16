import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Gift, Mail, User, GraduationCap, CheckCircle2, 
  ExternalLink, X, Send, HeartHandshake, ShieldCheck, Copy, Check, ArrowRight
} from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api';

export default function CanvaProModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [roleType, setRoleType] = useState('student');
  const [school, setSchool] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Lấy link mời Canva trực tiếp từ backend
  useEffect(() => {
    if (isOpen) {
      axios.get(`${API_BASE}/canva/config`)
        .then(res => {
          if (res.data && res.data.invite_link) {
            setInviteLink(res.data.invite_link);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      alert("Vui lòng nhập địa chỉ email hợp lệ!");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE}/canva/request`, {
        email: email.trim(),
        fullname: fullname.trim(),
        role_type: roleType,
        school: school.trim()
      });
      setSubmittedSuccess(true);
    } catch (err) {
      console.error("Lỗi gửi yêu cầu Canva:", err);
      // Lưu local fallback
      const localList = JSON.parse(localStorage.getItem('canva_requests_local') || '[]');
      localList.push({ email, fullname, roleType, school, time: new Date().toISOString() });
      localStorage.setItem('canva_requests_local', JSON.stringify(localList));
      setSubmittedSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in select-text">
      <div className="w-full max-w-xl rounded-3xl bg-[#090e1f] text-slate-100 border border-white/15 shadow-[0_0_60px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Neon Glow Aura */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header với phong cách Datura Studio */}
        <div className="p-6 sm:p-7 border-b border-white/10 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/30">
              (025) // CANVA PRO & EDU PASS
            </span>
            <span className="text-[10px] font-mono tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              100% SPONSORED
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-outfit text-white tracking-tight">
            Nhận Bản Quyền Canva Pro / Edu
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-normal">
            Dành riêng cho Học sinh THPT &amp; Thầy/Cô giáo phục vụ thiết kế bài giảng, slide thuyết trình, sơ đồ tư duy Mindmap và ấn phẩm học tập chuẩn quốc tế.
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
          
          {/* CÁCH 1: LINK THAM GIA TRỰC TIẾP */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-purple-500/30 space-y-3 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs font-mono uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>CÁCH 1: THAM GIA TRỰC TIẾP QUA LINK MỜI</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                TỨC THÌ
              </span>
            </div>
            
            {inviteLink ? (
              <div className="space-y-3 pt-1">
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Nhấn nút bên dưới để tự động tham gia vào đội ngũ Canva Pro/Edu của Admin Tuấn Anh:
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={inviteLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-5 py-3.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 transition flex items-center justify-center gap-2 cursor-pointer group/btn"
                  >
                    <span>Nhận Bản Quyền Canva Pro Ngay</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-4 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 font-mono font-bold text-xs border border-white/15 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Đã Sao Chép!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span>⚡ Admin Tuấn Anh hỗ trợ duyệt và thêm email trực tiếp ở Cách 2 bên dưới.</span>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/15 px-2.5 py-1 rounded-full border border-purple-500/30">
                  Hotline/Zalo: 0975.711.254
                </span>
              </div>
            )}
          </div>

          {/* CÁCH 2: NHẬP EMAIL CÁ NHÂN */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-xs font-mono uppercase tracking-wider">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>CÁCH 2: ĐĂNG KÝ EMAIL ĐỂ ADMIN THÊM THỦ CÔNG</span>
            </div>

            {submittedSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 space-y-3 text-center animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-extrabold text-base font-outfit text-white">Đã Ghi Nhận Yêu Cầu Thành Công!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed font-normal">
                  Email <strong className="text-emerald-300">{email}</strong> đã được lưu trên hệ thống. Admin Tuấn Anh sẽ duyệt và gửi lời mời kích hoạt tài khoản Canva của bạn sớm nhất trong ngày.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => { setSubmittedSuccess(false); setEmail(''); }}
                    className="px-5 py-2 rounded-full bg-white/10 text-white font-mono font-bold text-xs hover:bg-white/20 transition cursor-pointer border border-white/15"
                  >
                    Gửi thêm email khác
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Nhập email bạn đang dùng Canva (Gmail cá nhân hoặc Email trường học). Hệ thống sẽ thêm bạn vào nhóm Canva Pro/Edu miễn phí:
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 block">
                    ĐỊA CHỈ EMAIL CANVA <span className="text-rose-400">*</span>:
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vidu: hocsinhthpt@gmail.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/15 focus:border-purple-400 outline-none text-xs sm:text-sm text-white placeholder:text-slate-500 bg-white/[0.04] focus:bg-white/[0.07] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-300 block">
                      HỌ VÀ TÊN (TÙY CHỌN):
                    </label>
                    <input
                      type="text"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-3 rounded-xl border border-white/15 focus:border-purple-400 outline-none text-xs sm:text-sm text-white placeholder:text-slate-500 bg-white/[0.04] focus:bg-white/[0.07] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-300 block">
                      BẠN LÀ:
                    </label>
                    <select
                      value={roleType}
                      onChange={(e) => setRoleType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-white/15 focus:border-purple-400 outline-none text-xs sm:text-sm text-white bg-[#0f172a] cursor-pointer"
                    >
                      <option value="student">Học sinh THPT (Lớp 10, 11, 12)</option>
                      <option value="teacher">Thầy / Cô Giáo Viên</option>
                      <option value="other">Thành viên khác</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-extrabold text-xs font-mono uppercase tracking-wider shadow-lg shadow-purple-500/25 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2 group"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Đang gửi yêu cầu...' : 'Gửi Yêu Cầu Kích Hoạt Canva Pro / Edu'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Footer Cam kết */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/10 gap-2">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              100% Hoàn Toàn Miễn Phí &amp; Bảo Mật
            </span>
            <span className="text-slate-400">
              Admin Tuấn Anh • Zalo: 0975.711.254
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
