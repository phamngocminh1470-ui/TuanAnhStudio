import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck, Users, Key, RefreshCw, Cpu,
  Download, Lock, Unlock, KeyRound, TrendingUp, FileSpreadsheet, Filter,
  Search, RotateCcw, AlertTriangle, Calendar,
  Info, FileText, Zap
} from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api';

// ─── Mini helper: lấy màu gradient cho theta value
function thetaColor(theta) {
  if (theta >= 1.5) return 'text-emerald-400';
  if (theta >= 0.5) return 'text-indigo-400';
  if (theta >= -0.5) return 'text-amber-400';
  return 'text-rose-400';
}

// ─── SVG Line Chart component (dữ liệu thực từ theta-timeline API)
function ThetaLineChart({ timeline, loading }) {
  const W = 560, H = 200, PAD_L = 48, PAD_R = 20, PAD_T = 16, PAD_B = 28;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  const allValues = timeline.flatMap(d => [d.avg_theta_adaptive, d.avg_theta_control].filter(v => v !== null));
  const minV = allValues.length ? Math.min(-0.5, Math.min(...allValues) - 0.2) : -1;
  const maxV = allValues.length ? Math.max(1.0, Math.max(...allValues) + 0.2) : 2;

  const toX = (i) => PAD_L + (i / Math.max(timeline.length - 1, 1)) * chartW;
  const toY = (v) => PAD_T + chartH - ((v - minV) / (maxV - minV)) * chartH;

  const lineAdaptive = timeline
    .map((d, i) => d.avg_theta_adaptive !== null ? `${toX(i)},${toY(d.avg_theta_adaptive)}` : null)
    .filter(Boolean).join(' ');
  const lineControl = timeline
    .map((d, i) => d.avg_theta_control !== null ? `${toX(i)},${toY(d.avg_theta_control)}` : null)
    .filter(Boolean).join(' ');

  const yTicks = [minV, (minV + maxV) / 2, maxV].map(v => ({ v: v.toFixed(1), y: toY(v) }));

  if (loading) return (
    <div className="w-full h-52 flex items-center justify-center text-gray-500 text-xs animate-pulse font-bold">
      Đang tải dữ liệu biểu đồ...
    </div>
  );

  if (!timeline.length) return (
    <div className="w-full h-52 flex flex-col items-center justify-center gap-2">
      <Info className="w-8 h-8 text-gray-600" />
      <p className="text-gray-500 text-xs font-bold text-center">
        Chưa có dữ liệu thực tế.<br />
        <span className="text-gray-600">Biểu đồ sẽ cập nhật khi học sinh bắt đầu luyện tập.</span>
      </p>
      {/* Fallback minh họa */}
      <svg className="w-full opacity-20 mt-2" viewBox={`0 0 ${W} ${H}`}>
        <polyline points="48,184 160,160 272,120 384,80 568,45" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="4" />
        <polyline points="48,184 160,178 272,165 384,155 568,140" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4" />
      </svg>
    </div>
  );

  return (
    <svg className="w-full" viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="ad-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="co-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f43f5e" /><stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map(({ v, y }) => (
        <g key={v}>
          <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />
          <text x={PAD_L - 6} y={y + 4} fill="rgba(255,255,255,0.35)" fontSize="9" textAnchor="end">{v}</text>
        </g>
      ))}

      {/* Adaptive line */}
      {lineAdaptive && (
        <polyline points={lineAdaptive} fill="none" stroke="url(#ad-grad)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      )}
      {/* Control line */}
      {lineControl && (
        <polyline points={lineControl} fill="none" stroke="url(#co-grad)" strokeWidth="2.5" strokeDasharray="5,3" strokeLinejoin="round" strokeLinecap="round" />
      )}

      {/* X-axis date labels (max 5) */}
      {timeline.filter((_, i) => i === 0 || i === timeline.length - 1 || (timeline.length > 4 && i === Math.floor(timeline.length / 2))).map((d, idx, arr) => {
        const origIdx = timeline.indexOf(d);
        return (
          <text key={d.date} x={toX(origIdx)} y={H - 4} fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle">
            {d.date.slice(5)} {/* MM-DD */}
          </text>
        );
      })}

      {/* Endpoint dots */}
      {timeline.length > 0 && timeline[timeline.length - 1].avg_theta_adaptive !== null && (
        <circle cx={toX(timeline.length - 1)} cy={toY(timeline[timeline.length - 1].avg_theta_adaptive)} r="4.5" fill="#a855f7" stroke="#fff" strokeWidth="1.5" />
      )}
      {timeline.length > 0 && timeline[timeline.length - 1].avg_theta_control !== null && (
        <circle cx={toX(timeline.length - 1)} cy={toY(timeline[timeline.length - 1].avg_theta_control)} r="3.5" fill="#ec4899" stroke="#fff" strokeWidth="1" />
      )}
    </svg>
  );
}

// ─── Confirm dialog nhỏ
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass rounded-2xl p-6 border border-amber-500/30 max-w-sm w-full shadow-2xl mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-white">Xác nhận thao tác</h3>
        </div>
        <p className="text-xs text-gray-300 mb-5 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white font-bold transition">
            Hủy
          </button>
          <button onClick={onConfirm} className="flex-1 py-2 text-xs rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold transition">
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component
export default function AdminPanel({ keys, onSaveKeys }) {
  const [adminTab, setAdminTab] = useState('dashboard');

  // ── Data states
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [researchReport, setResearchReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [thetaTimeline, setThetaTimeline] = useState([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  // ── Export filter states
  const [filterGrade, setFilterGrade] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [exportLoading, setExportLoading] = useState(false);

  // ── Student management states
  const [studentSearch, setStudentSearch] = useState('');
  const [resetPassUser, setResetPassUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [confirmReset, setConfirmReset] = useState(null); // username to reset progress

  // ── Data loaders ──────────────────────────────────────────────────────────

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const res = await axios.get(`${API_BASE}/auth/users`);
      if (res.data?.status === 'success') setStudents(res.data.users);
    } catch (err) {
      console.warn('Lỗi fetch danh sách học sinh:', err.message);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchResearchReport = async () => {
    setLoadingReport(true);
    try {
      const res = await axios.get(`${API_BASE}/teacher/report`);
      if (res.data?.status === 'success') setResearchReport(res.data);
    } catch (err) {
      console.warn('Lỗi fetch báo cáo thực nghiệm:', err.message);
    } finally {
      setLoadingReport(false);
    }
  };

  const fetchThetaTimeline = async () => {
    setLoadingTimeline(true);
    try {
      const res = await axios.get(`${API_BASE}/research/theta-timeline`);
      if (res.data?.status === 'success') setThetaTimeline(res.data.timeline || []);
    } catch (err) {
      console.warn('Lỗi fetch theta timeline:', err.message);
    } finally {
      setLoadingTimeline(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchResearchReport();
    fetchThetaTimeline();
  }, []);

  // ── Computed stats ────────────────────────────────────────────────────────

  const avgThetaAdaptive = useMemo(() => {
    const pts = researchReport?.students?.filter(s => s.experiment_group === 'ADAPTIVE');
    if (!pts?.length) return null;
    return (pts.reduce((a, s) => a + s.latest_theta, 0) / pts.length).toFixed(3);
  }, [researchReport]);

  const avgThetaControl = useMemo(() => {
    const pts = researchReport?.students?.filter(s => s.experiment_group === 'CONTROL');
    if (!pts?.length) return null;
    return (pts.reduce((a, s) => a + s.latest_theta, 0) / pts.length).toFixed(3);
  }, [researchReport]);

  const latestDate = useMemo(() => {
    if (!thetaTimeline.length) return null;
    return thetaTimeline[thetaTimeline.length - 1]?.date;
  }, [thetaTimeline]);

  // Map student_id → latest_theta từ researchReport
  const studentThetaMap = useMemo(() => {
    const map = {};
    researchReport?.students?.forEach(s => { map[s.student_id] = s.latest_theta; });
    return map;
  }, [researchReport]);

  const filteredStudents = useMemo(() => {
    if (!studentSearch) return students;
    const q = studentSearch.toLowerCase();
    return students.filter(s => s.fullname.toLowerCase().includes(q) || s.username.toLowerCase().includes(q));
  }, [students, studentSearch]);

  // ── Action handlers ───────────────────────────────────────────────────────

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetPassUser || newPassword.length < 6) {
      setResetMessage('Mật khẩu mới phải có tối thiểu 6 ký tự!');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/auth/admin/reset-password`, {
        username: resetPassUser,
        new_password: newPassword
      });
      if (res.data?.status === 'success') {
        setResetMessage(`✅ Đã đổi mật khẩu cho '${resetPassUser}'!`);
        setNewPassword('');
        setTimeout(() => setResetPassUser(null), 2000);
      }
    } catch (err) {
      setResetMessage(err.response?.data?.detail || 'Lỗi khi reset mật khẩu.');
    }
  };

  const handleToggleUserActive = async (username) => {
    try {
      await axios.put(`${API_BASE}/auth/users/${username}/toggle-active`);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.detail || 'Không thể thực hiện thao tác.');
    }
  };

  const handleResetProgress = async (username) => {
    try {
      await axios.post(`${API_BASE}/auth/admin/reset-progress/${username}`);
      setConfirmReset(null);
      fetchResearchReport();
      alert(`✅ Đã reset tiến độ học tập của '${username}'.`);
    } catch (err) {
      alert(err.response?.data?.detail || 'Lỗi khi reset tiến độ.');
      setConfirmReset(null);
    }
  };

  // Build export URL với filters
  const buildExportUrl = (fmt = 'csv') => {
    const params = new URLSearchParams();
    if (filterGrade) params.set('grade', filterGrade);
    if (filterGroup) params.set('experiment_group', filterGroup);
    if (filterStartDate) params.set('start_date', filterStartDate);
    if (filterEndDate) params.set('end_date', filterEndDate);
    params.set('format', fmt);
    return `${API_BASE}/research/export?${params.toString()}`;
  };

  const handleExport = (fmt = 'csv') => {
    const link = document.createElement('a');
    link.href = buildExportUrl(fmt);
    link.setAttribute('download', `research_export.${fmt}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Tab definitions ───────────────────────────────────────────────────────

  const tabs = [
    { id: 'dashboard', icon: TrendingUp, label: 'Tổng quan & Tiến trình (θ)' },
    { id: 'users',     icon: Users,     label: `Quản lý Học sinh (${students.length})` },
    { id: 'export',    icon: Download,  label: 'Xuất dữ liệu KHKT' },
    { id: 'system',    icon: Cpu,       label: 'API Keys & Hệ thống' },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full space-y-6 pb-16 animate-fade-in max-w-[1600px] mx-auto">

      {/* ── HEADER ── */}
      <div className="glass rounded-3xl p-7 border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden bg-gradient-to-r from-slate-950 via-[#0b0c1e] to-indigo-950/80">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-rose-500/20 shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-black text-white font-outfit">Bảng Quản trị &amp; Giám sát Thực nghiệm</h1>
              <span className="text-[10px] text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2.5 py-0.5 rounded-full font-extrabold tracking-wider">ADMIN PANEL</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Dành riêng cho Giáo viên hướng dẫn &amp; Học sinh NCKH · Dữ liệu thực nghiệm KHKT</p>
          </div>
        </div>
        <div className="flex items-center gap-3 relative z-10 flex-wrap">
          <button
            onClick={() => handleExport('xlsx')}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg transition cursor-pointer flex items-center gap-2 shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất Excel (.xlsx)</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs shadow-lg transition cursor-pointer flex items-center gap-2 shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>Xuất CSV (SPSS/R)</span>
          </button>
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div className="flex items-center bg-[#070b18] border border-white/10 p-1.5 rounded-2xl gap-1.5 overflow-x-auto">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setAdminTab(id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 shrink-0 ${
              adminTab === id ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TAB 1: DASHBOARD & TIẾN TRÌNH
      ══════════════════════════════════════════════════════════════ */}
      {adminTab === 'dashboard' && (
        <div className="space-y-6">

          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total students */}
            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Học sinh đăng ký</span>
              <div className="text-3xl font-black text-white font-outfit">{students.length}</div>
              <p className="text-[10px] text-gray-500">Tài khoản trong DB</p>
            </div>

            {/* Total sessions */}
            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Phiên thực nghiệm</span>
              <div className="text-3xl font-black text-indigo-400 font-outfit">
                {loadingReport ? '...' : (researchReport?.total_sessions ?? 0)}
              </div>
              <p className="text-[10px] text-gray-500">Lượt luyện tập được ghi log</p>
            </div>

            {/* Avg theta ADAPTIVE */}
            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">θ TB · Nhóm Thích ứng</span>
              <div className={`text-3xl font-black font-outfit ${avgThetaAdaptive ? 'text-emerald-400' : 'text-gray-600'}`}>
                {loadingReport ? '...' : (avgThetaAdaptive ?? 'N/A')}
              </div>
              <p className="text-[10px] text-gray-500">IRT EAP trung bình (Adaptive)</p>
            </div>

            {/* Avg theta CONTROL */}
            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">θ TB · Nhóm Đối chứng</span>
              <div className={`text-3xl font-black font-outfit ${avgThetaControl ? 'text-rose-400' : 'text-gray-600'}`}>
                {loadingReport ? '...' : (avgThetaControl ?? 'N/A')}
              </div>
              <p className="text-[10px] text-gray-500">IRT EAP trung bình (Control)</p>
            </div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Theta timeline chart */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">Tiến trình Theta (θ) Trung bình theo Ngày</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {thetaTimeline.length > 0
                      ? `${thetaTimeline.length} ngày có dữ liệu · Gần nhất: ${latestDate}`
                      : 'Biểu đồ cập nhật thời gian thực từ research_experiment_logs.jsonl'}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[10px]">
                  <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full" /> Nhóm Thích ứng
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <span className="w-2 h-2 bg-rose-500 rounded-full border border-rose-400" style={{borderStyle:'dashed'}} /> Nhóm Đối chứng
                  </span>
                  <button onClick={fetchThetaTimeline} className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition" title="Làm mới">
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="w-full">
                <ThetaLineChart timeline={thetaTimeline} loading={loadingTimeline} />
              </div>
            </div>

            {/* Skill accuracy */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <div>
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">Hiệu suất theo Kỹ năng</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Tỷ lệ trả lời đúng từ dữ liệu thực nghiệm</p>
              </div>
              <div className="space-y-3.5 pt-1">
                {researchReport?.skill_accuracy && Object.keys(researchReport.skill_accuracy).length > 0 ? (
                  Object.entries(researchReport.skill_accuracy)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 8)
                    .map(([skill, accuracy]) => (
                      <div key={skill} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-gray-300 truncate max-w-[60%]">{skill}</span>
                          <span className={`font-black ${accuracy >= 70 ? 'text-emerald-400' : accuracy >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>{accuracy}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${accuracy >= 70 ? 'bg-emerald-500' : accuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${accuracy}%` }}
                          />
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center text-gray-500 font-bold text-xs py-10">
                    Chưa có đủ dữ liệu.<br />
                    <span className="text-gray-600">Học sinh cần hoàn thành thêm bài tập.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 2: QUẢN LÝ TÀI KHOẢN HỌC SINH
      ══════════════════════════════════════════════════════════════ */}
      {adminTab === 'users' && (
        <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-5">
          {/* Header + search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="font-extrabold text-lg text-white font-outfit">Danh sách Học sinh &amp; Tiến trình</h3>
              <p className="text-xs text-gray-400">Quản lý tài khoản · Reset tiến độ · Đổi mật khẩu · Khóa/Mở tài khoản</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                <input
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  placeholder="Tìm học sinh..."
                  className="pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-300 outline-none focus:border-indigo-500 w-44"
                />
              </div>
              <button onClick={fetchStudents} className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reset password inline form */}
          {resetPassUser && (
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 animate-fade-in space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4" />
                  Đổi mật khẩu cho: <strong className="text-white font-mono">{resetPassUser}</strong>
                </span>
                <button onClick={() => { setResetPassUser(null); setResetMessage(''); }} className="text-xs text-gray-400 hover:text-white font-bold">Đóng ✕</button>
              </div>
              <form onSubmit={handleResetPassword} className="flex flex-wrap gap-3 items-center">
                <input
                  type="password"
                  placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="bg-[#070a16] border border-white/10 rounded-xl px-4 py-2 text-xs text-gray-200 outline-none focus:border-indigo-500 min-w-[220px]"
                />
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition">
                  Xác nhận
                </button>
                {resetMessage && <span className={`text-[11px] font-bold ${resetMessage.startsWith('✅') ? 'text-emerald-400' : 'text-amber-400'}`}>{resetMessage}</span>}
              </form>
            </div>
          )}

          {/* Students Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/5">
            {loadingStudents ? (
              <div className="text-center py-12 text-gray-500 animate-pulse font-bold text-sm">Đang tải danh sách học sinh...</div>
            ) : filteredStudents.length > 0 ? (
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-white/5 text-gray-400 font-extrabold uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-3">Học sinh</th>
                    <th className="p-3">Username</th>
                    <th className="p-3">Lớp</th>
                    <th className="p-3 text-center">Vai trò</th>
                    <th className="p-3 text-center">θ hiện tại</th>
                    <th className="p-3 text-center">Trạng thái</th>
                    <th className="p-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredStudents.map(u => {
                    const theta = studentThetaMap[u.username?.toLowerCase()];
                    return (
                      <tr key={u.id} className="hover:bg-white/[0.025] transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-500/20 text-indigo-300 flex items-center justify-center font-black text-xs shrink-0">
                              {(u.fullname || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-white block">{u.fullname}</span>
                              <span className="text-[10px] text-gray-500">Mục tiêu: {u.target_score} điểm</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-gray-400 text-[11px]">{u.username}</td>
                        <td className="p-3">Lớp {u.grade}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : u.role === 'teacher' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-700 text-gray-400'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {theta !== undefined ? (
                            <span className={`font-mono font-black text-sm ${thetaColor(theta)}`}>{theta.toFixed(3)}</span>
                          ) : (
                            <span className="text-gray-600 text-[10px]">—</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${u.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                            {u.is_active ? 'HOẠT ĐỘNG' : 'ĐÃ KHÓA'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Đổi mật khẩu */}
                            <button
                              onClick={() => { setResetPassUser(u.username); setResetMessage(''); }}
                              className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-400 transition cursor-pointer"
                              title="Đổi mật khẩu nhanh"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>
                            {/* Reset tiến độ */}
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => setConfirmReset(u.username)}
                                className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 text-amber-400 transition cursor-pointer"
                                title="Reset tiến độ học tập"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {/* Khóa / Mở khóa */}
                            <button
                              onClick={() => handleToggleUserActive(u.username)}
                              disabled={u.username === 'admin'}
                              className={`p-1.5 rounded-lg transition cursor-pointer disabled:opacity-30 ${u.is_active ? 'bg-rose-500/10 hover:bg-rose-500/25 text-rose-400' : 'bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400'}`}
                              title={u.is_active ? 'Khóa tài khoản' : 'Kích hoạt lại'}
                            >
                              {u.is_active ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-500 font-bold text-sm">
                {studentSearch ? `Không tìm thấy học sinh phù hợp với "${studentSearch}".` : 'Chưa có tài khoản học sinh nào trong hệ thống.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 3: XUẤT DỮ LIỆU KHKT
      ══════════════════════════════════════════════════════════════ */}
      {adminTab === 'export' && (
        <div className="space-y-6">
          {/* Filter panel */}
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white font-outfit">Bộ lọc Xuất dữ liệu Thực nghiệm</h3>
                <p className="text-xs text-gray-400">Lọc theo lớp, nhóm, khoảng thời gian trước khi tải về</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Grade filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Khối lớp</label>
                <select
                  value={filterGrade}
                  onChange={e => setFilterGrade(e.target.value)}
                  className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-gray-300 outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="">Tất cả khối (10, 11, 12)</option>
                  <option value="10">Lớp 10</option>
                  <option value="11">Lớp 11</option>
                  <option value="12">Lớp 12</option>
                </select>
              </div>

              {/* Group filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Nhóm thực nghiệm</label>
                <select
                  value={filterGroup}
                  onChange={e => setFilterGroup(e.target.value)}
                  className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-gray-300 outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="">Tất cả nhóm</option>
                  <option value="ADAPTIVE">Nhóm Thích ứng (ADAPTIVE)</option>
                  <option value="CONTROL">Nhóm Đối chứng (CONTROL)</option>
                </select>
              </div>

              {/* Start date */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Từ ngày
                </label>
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={e => setFilterStartDate(e.target.value)}
                  className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-gray-300 outline-none focus:border-indigo-500 cursor-pointer"
                />
              </div>

              {/* End date */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Đến ngày
                </label>
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={e => setFilterEndDate(e.target.value)}
                  className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-gray-300 outline-none focus:border-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Active filter summary */}
            {(filterGrade || filterGroup || filterStartDate || filterEndDate) && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] text-gray-500 font-bold">Lọc đang áp dụng:</span>
                {filterGrade && <span className="bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Lớp {filterGrade}</span>}
                {filterGroup && <span className="bg-purple-500/15 border border-purple-500/25 text-purple-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">{filterGroup}</span>}
                {filterStartDate && <span className="bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Từ {filterStartDate}</span>}
                {filterEndDate && <span className="bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Đến {filterEndDate}</span>}
                <button onClick={() => { setFilterGrade(''); setFilterGroup(''); setFilterStartDate(''); setFilterEndDate(''); }} className="text-[10px] text-rose-400 hover:text-rose-300 font-bold ml-1">
                  Xóa tất cả
                </button>
              </div>
            )}
          </div>

          {/* Download buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Excel card */}
            <div className="glass-card rounded-3xl p-7 border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 to-teal-950/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-lg">File Excel (.xlsx)</h4>
                  <p className="text-[11px] text-emerald-400/70">Mở trực tiếp bằng Microsoft Excel, Google Sheets</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Xuất toàn bộ session log với header được định dạng, màu sắc phân biệt, cột tự động điều chỉnh độ rộng. Phù hợp cho báo cáo và trình bày trước giám khảo.
              </p>
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/15 text-[10px] text-emerald-400/80">
                <strong className="block mb-1">Cột dữ liệu:</strong>
                student_id · fullname · grade · experiment_group · repetition_engine · question_id · skill · correct · theta_before · theta_after · timestamp
              </div>
              <button
                onClick={() => handleExport('xlsx')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Tải file Excel (.xlsx)
              </button>
            </div>

            {/* CSV card */}
            <div className="glass-card rounded-3xl p-7 border border-indigo-500/20 bg-gradient-to-br from-indigo-950/30 to-violet-950/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-lg">File CSV (UTF-8 BOM)</h4>
                  <p className="text-[11px] text-indigo-400/70">Phân tích định lượng bằng SPSS, R, Python, Stata</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Xuất dữ liệu thô dạng CSV mã hóa UTF-8 có BOM — tương thích hoàn toàn với SPSS, R (read.csv), Python (pandas), Stata để phân tích T-test, ANOVA, hồi quy.
              </p>
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/15 text-[10px] text-indigo-400/80">
                <strong className="block mb-1">Dùng trong SPSS:</strong>
                File → Import Data → CSV · Encoding: UTF-8 · Separator: comma · Decimal: period
              </div>
              <button
                onClick={() => handleExport('csv')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/20 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Tải file CSV (SPSS/R)
              </button>
            </div>
          </div>

          {/* Info note */}
          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex gap-3">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-gray-300 leading-relaxed space-y-1">
              <p><strong className="text-amber-300">Lưu ý nghiên cứu:</strong> Dữ liệu xuất phản ánh chính xác log thực nghiệm từ file <code className="bg-white/5 px-1 rounded">research_experiment_logs.jsonl</code>. Thông tin fullname và grade được map từ SQLite database tại thời điểm xuất.</p>
              <p>Biến <code className="bg-white/5 px-1 rounded">experiment_group</code> nhận giá trị <strong className="text-indigo-300">ADAPTIVE</strong> (nhóm thực nghiệm dùng hệ thống AI thích ứng) hoặc <strong className="text-rose-300">CONTROL</strong> (nhóm đối chứng). Dùng biến này làm nhân tố phân nhóm trong T-test độc lập.</p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 4: API KEYS & SYSTEM
      ══════════════════════════════════════════════════════════════ */}
      {adminTab === 'system' && (
        <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-2xl text-white font-outfit">Trạng thái API Keys &amp; Hệ thống</h2>
              <p className="text-xs text-gray-400 mt-0.5">Kiểm tra kết nối các mô hình AI đang hoạt động</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { label: 'Google Gemini AI', sub: 'Gemini 1.5 Flash / 2.0', key: keys?.gemini, icon: Zap, color: 'amber' },
              { label: 'Groq Cloud Whisper', sub: 'Whisper Large v3 Turbo', key: keys?.groq, icon: Cpu, color: 'blue' },
              { label: 'Azure Cognitive', sub: 'Speech & Pronunciation', key: keys?.azure, icon: Activity, color: 'purple' },
            ].map(({ label, sub, key: hasKey, icon: Icon, color }) => (
              <div key={label} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase block">{label}</span>
                    <span className="text-sm font-bold text-white mt-0.5">{sub}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${hasKey ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                    {hasKey ? '✓ CẤU HÌNH' : '✗ CHƯA NHẬP'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/15 text-xs text-gray-300 leading-relaxed space-y-2">
            <h4 className="font-extrabold text-indigo-400 uppercase text-[10px] tracking-wider">💡 Hướng dẫn cho nhà nghiên cứu KHKT</h4>
            <p>Học sinh / Giáo viên nhập khóa API cá nhân thông qua tab <strong>Cấu hình</strong> ở menu chính. Khóa API được lưu trực tiếp trong trình duyệt (localStorage), <strong>không gửi lên server</strong> — đảm bảo bảo mật và riêng tư cao nhất.</p>
            <p>Để hệ thống hoạt động đầy đủ: cần ít nhất <strong className="text-amber-300">Gemini API Key</strong> cho AI chat + adaptive questions, và <strong className="text-blue-300">Groq API Key</strong> cho Speech-to-Text.</p>
          </div>
        </div>
      )}

      {/* ── Confirm reset progress dialog ── */}
      {confirmReset && (
        <ConfirmDialog
          message={`Bạn có chắc muốn RESET toàn bộ tiến độ học tập (theta, skill mastery, lịch sử câu hỏi) của tài khoản "${confirmReset}"?\n\n⚠️ Lịch sử phiên học (session logs) sẽ được giữ nguyên để phục vụ nghiên cứu KHKT. Thao tác này không thể hoàn tác.`}
          onConfirm={() => handleResetProgress(confirmReset)}
          onCancel={() => setConfirmReset(null)}
        />
      )}
    </div>
  );
}
