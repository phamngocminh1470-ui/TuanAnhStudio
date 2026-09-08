import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck, Users, Key, RefreshCw, Cpu,
  Download, Lock, Unlock, KeyRound, TrendingUp, FileSpreadsheet, Filter,
  Search, RotateCcw, AlertTriangle, Calendar,
  Info, FileText, Zap, Mic, BookOpen, Plus, Trash2, Edit, Sparkles, Check, Globe,
  Copy, MessageSquare, Send,
  Laptop, ShieldAlert, Monitor, LogOut, CheckCircle2, Shield,
  Eye, EyeOff, ExternalLink, Brain, Bot, CheckCircle, XCircle, Flame, Sliders, Save
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
export default function AdminPanel({ keys, onSaveKeys, onOpenAuth }) {
  const [adminTab, setAdminTab] = useState('dashboard');

  // ── Data states
  const [students, setStudents] = useState([]);

  // ── Bảo Mật & Quản Lý Thiết Bị Đăng Nhập ──────────────────────────
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [sessionActionLoading, setSessionActionLoading] = useState(false);
  const [kickingSessionId, setKickingSessionId] = useState(null);
  const [securityMessage, setSecurityMessage] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [primarySessionId, setPrimarySessionId] = useState(null);
  const [currentIp, setCurrentIp] = useState('');
  const [currentDeviceName, setCurrentDeviceName] = useState('');

  // ── Cấu hình Siêu Mô Hình AI (Frontier AI Models Hub) ──────────
  const [aiKeysForm, setAiKeysForm] = useState({
    gemini: keys?.gemini || localStorage.getItem('api_gemini') || '',
    openai: keys?.openai || localStorage.getItem('api_openai') || '',
    claude: keys?.claude || localStorage.getItem('api_claude') || '',
    deepseek: keys?.deepseek || localStorage.getItem('api_deepseek') || '',
    openrouter: keys?.openrouter || localStorage.getItem('api_openrouter') || '',
    groq: keys?.groq || localStorage.getItem('api_groq') || '',
    azure: keys?.azure || localStorage.getItem('api_azure') || ''
  });

  const [aiKeyVisibility, setAiKeyVisibility] = useState({});
  const [testingModel, setTestingModel] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [defaultBrain, setDefaultBrain] = useState(() => localStorage.getItem('default_ai_engine') || 'auto');
  const [saveAiStatus, setSaveAiStatus] = useState(null);
  const [isSavingAi, setIsSavingAi] = useState(false);

  useEffect(() => {
    if (keys) {
      setAiKeysForm(prev => ({
        ...prev,
        gemini: keys.gemini || prev.gemini,
        openai: keys.openai || prev.openai,
        claude: keys.claude || prev.claude,
        deepseek: keys.deepseek || prev.deepseek,
        openrouter: keys.openrouter || prev.openrouter,
        groq: keys.groq || prev.groq,
        azure: keys.azure || prev.azure
      }));
    }
  }, [keys]);

  const toggleKeyVisibility = (provider) => {
    setAiKeyVisibility(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleTestAiKey = async (provider) => {
    let keyVal = aiKeysForm[provider];
    if (!keyVal || !keyVal.trim()) {
      if (provider === 'azure') {
        keyVal = 'embedded';
      } else {
        setTestResults(prev => ({
          ...prev,
          [provider]: { status: 'error', message: 'Chưa có khóa API. Vui lòng nhập key để kiểm tra.' }
        }));
        return;
      }
    }

    setTestingModel(provider);
    setTestResults(prev => ({ ...prev, [provider]: { status: 'loading' } }));
    try {
      const res = await axios.post(`${API_BASE}/ai/test-key`, {
        provider: provider,
        key: keyVal.trim()
      });
      setTestResults(prev => ({
        ...prev,
        [provider]: res.data
      }));
    } catch (err) {
      const errMsg = err.response?.data?.detail || err.response?.data?.message || err.message;
      setTestResults(prev => ({
        ...prev,
        [provider]: { status: 'error', message: errMsg }
      }));
    } finally {
      setTestingModel(null);
    }
  };

  const handleSaveAllAiConfig = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSavingAi(true);
    setSaveAiStatus(null);
    try {
      localStorage.setItem('api_gemini', aiKeysForm.gemini || '');
      localStorage.setItem('api_openai', aiKeysForm.openai || '');
      localStorage.setItem('api_claude', aiKeysForm.claude || '');
      localStorage.setItem('api_deepseek', aiKeysForm.deepseek || '');
      localStorage.setItem('api_openrouter', aiKeysForm.openrouter || '');
      localStorage.setItem('api_groq', aiKeysForm.groq || '');
      localStorage.setItem('api_azure', aiKeysForm.azure || '');
      localStorage.setItem('default_ai_engine', defaultBrain);

      if (onSaveKeys) {
        await onSaveKeys({ ...aiKeysForm, default_engine: defaultBrain });
      } else {
        await axios.post(`${API_BASE}/save-keys`, {
          ...aiKeysForm,
          default_engine: defaultBrain
        });
      }

      setSaveAiStatus({
        type: 'success',
        message: 'Đã lưu toàn bộ cấu hình API Keys & Mô hình AI thành công vào trình duyệt và đồng bộ lên máy chủ VPS!'
      });
    } catch (err) {
      setSaveAiStatus({
        type: 'error',
        message: `Lỗi lưu cấu hình: ${err.message}`
      });
    } finally {
      setIsSavingAi(false);
      setTimeout(() => setSaveAiStatus(null), 5000);
    }
  };
  
  // ── Quản lý & Sinh mã Key cho Giáo Viên ──────────────────────────────
  const [teacherKeys, setTeacherKeys] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_teacher_license_keys');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 'k-1', key: 'GV-THPT-2026', teacherName: 'Cô Thùy Trang', school: 'THPT Hướng Dẫn KHKT', phone: '0975711254', subject: 'Tiếng Anh THPT', date: '2026-08-27', status: 'active', note: 'Mã VIP Toàn Quyền' },
      { id: 'k-2', key: 'VIP-TEACHER', teacherName: 'Admin Tuấn Anh', school: 'Ban Quản Trị Hệ Thống', phone: '0975711254', subject: 'Admin / Tiếng Anh THPT', date: '2026-08-27', status: 'active', note: 'Mã Quản Trị Hệ Thống' },
      { id: 'k-3', key: 'GV-HANOI-12', teacherName: 'Thầy Nguyễn Văn Nam', school: 'THPT Chu Văn An (Hà Nội)', phone: '0912345678', subject: 'Tiếng Anh 12', date: '2026-08-26', status: 'active', note: 'Giáo viên thử nghiệm' }
    ];
  });

  const [newKeyTeacherName, setNewKeyTeacherName] = useState('');
  const [newKeySchool, setNewKeySchool] = useState('');
  const [newKeyPhone, setNewKeyPhone] = useState('');
  const [newKeySubject, setNewKeySubject] = useState('Tiếng Anh THPT (Lớp 10, 11, 12)');
  const [newKeyCustomCode, setNewKeyCustomCode] = useState('');
  const [newKeyNote, setNewKeyNote] = useState('');
  const [newKeyDuration, setNewKeyDuration] = useState('12th'); // '1th' | '3th' | '6th' | '12th' | 'lifetime'
  const [teacherKeySearch, setTeacherKeySearch] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  const [copiedZaloMsg, setCopiedZaloMsg] = useState(false);

  // Danh sách các Thầy/Cô gửi form đăng ký xin cấp mã key
  const [teacherRequests, setTeacherRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_teacher_registration_requests');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Lưu danh sách key vào localStorage mỗi khi thay đổi
  useEffect(() => {
    try {
      localStorage.setItem('admin_teacher_license_keys', JSON.stringify(teacherKeys));
    } catch (e) {}
  }, [teacherKeys]);

  useEffect(() => {
    try {
      localStorage.setItem('admin_teacher_registration_requests', JSON.stringify(teacherRequests));
    } catch (e) {}
  }, [teacherRequests]);

  // Hàm tự động sinh mã ngẫu nhiên cho giáo viên
  const handleAutoGenerateCode = () => {
    let prefix = 'GV';
    if (newKeyTeacherName.trim()) {
      const cleanName = newKeyTeacherName.trim().split(' ').pop().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
      if (cleanName) prefix = `GV-${cleanName}`;
    }
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setNewKeyCustomCode(`${prefix}-${randomNum}`);
  };

  // Phê duyệt yêu cầu đăng ký của giáo viên
  const handleApproveTeacherRequest = (req) => {
    setNewKeyTeacherName(req.teacherName);
    setNewKeySchool(req.school || '');
    setNewKeyPhone(req.phone || '');
    setNewKeyNote(`Duyệt yêu cầu từ form (${req.phone})`);
    
    let prefix = 'GV';
    if (req.teacherName) {
      const cleanName = req.teacherName.trim().split(' ').pop().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
      if (cleanName) prefix = `GV-${cleanName}`;
    }
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setNewKeyCustomCode(`${prefix}-${randomNum}`);

    setTeacherRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'approved' } : r));
    alert(`✓ Đã điền thông tin Thầy/Cô ${req.teacherName} vào Form bên dưới. Bạn kiểm tra lại và bấm nút 'Xác Nhận Thêm & Kích Hoạt Key Này' để hoàn tất!`);
  };

  const handleDeleteTeacherRequest = async (reqId) => {
    const ok = window.appConfirm
      ? await window.appConfirm("Xóa yêu cầu đăng ký này khỏi danh sách?", "Xóa Yêu Cầu Đăng Ký", { type: 'warning', confirmText: 'Xóa Yêu Cầu' })
      : window.confirm("Xóa yêu cầu đăng ký này khỏi danh sách?");
    if (ok) {
      setTeacherRequests(prev => prev.filter(r => r.id !== reqId));
    }
  };

  // Hàm thêm key mới
  const handleAddTeacherKey = (e) => {
    e.preventDefault();
    const finalCode = (newKeyCustomCode.trim() || `GV-${Math.floor(100000 + Math.random() * 900000)}`).toUpperCase();
    
    // Kiểm tra trùng
    if (teacherKeys.some(k => k.key.toUpperCase() === finalCode)) {
      alert(`Mã key "${finalCode}" đã tồn tại! Vui lòng chọn mã khác.`);
      return;
    }

    let expiryDate = 'lifetime';
    const now = new Date();
    if (newKeyDuration === '1th') {
      now.setDate(now.getDate() + 30);
      expiryDate = now.toISOString().split('T')[0];
    } else if (newKeyDuration === '3th') {
      now.setDate(now.getDate() + 90);
      expiryDate = now.toISOString().split('T')[0];
    } else if (newKeyDuration === '6th') {
      now.setDate(now.getDate() + 180);
      expiryDate = now.toISOString().split('T')[0];
    } else if (newKeyDuration === '12th') {
      now.setDate(now.getDate() + 365);
      expiryDate = now.toISOString().split('T')[0];
    }

    const newKeyObj = {
      id: `k-${Date.now()}`,
      key: finalCode,
      teacherName: newKeyTeacherName.trim() || 'Giáo viên THPT',
      school: newKeySchool.trim() || 'Trường THPT',
      phone: newKeyPhone.trim() || 'Chưa cập nhật',
      subject: newKeySubject,
      date: new Date().toISOString().split('T')[0],
      duration: newKeyDuration,
      expiryDate: expiryDate,
      status: 'active',
      note: newKeyNote.trim() || 'Cấp bởi Admin'
    };

    setTeacherKeys([newKeyObj, ...teacherKeys]);
    setNewKeyTeacherName('');
    setNewKeySchool('');
    setNewKeyPhone('');
    setNewKeyCustomCode('');
    setNewKeyNote('');
    alert(`✓ Đã tạo và kích hoạt mã "${finalCode}" cho ${newKeyObj.teacherName} thành công (Thời hạn: ${newKeyDuration === 'lifetime' ? 'Trọn đời' : newKeyDuration})!`);
  };

  // Hàm xóa key
  const handleDeleteTeacherKey = async (keyId) => {
    const ok = window.appConfirm
      ? await window.appConfirm("Bạn có chắc chắn muốn xóa mã Key này không? Giáo viên dùng mã này sẽ bị thu hồi quyền truy cập.", "Thu Hồi Mã Key", { type: 'error', confirmText: 'Xóa & Thu Hồi' })
      : window.confirm("Bạn có chắc chắn muốn xóa mã Key này không? Giáo viên dùng mã này sẽ bị thu hồi quyền truy cập.");
    if (ok) {
      setTeacherKeys(prev => prev.filter(k => k.id !== keyId));
    }
  };

  // Hàm khóa/mở khóa key
  const handleToggleKeyStatus = (keyId) => {
    setTeacherKeys(prev => prev.map(k => {
      if (k.id === keyId) {
        return { ...k, status: k.status === 'active' ? 'locked' : 'active' };
      }
      return k;
    }));
  };

  // Hàm copy lời nhắn Zalo chuẩn để gửi cho giáo viên
  const handleCopyZaloMessage = (keyObj) => {
    const durationLabel = keyObj.expiryDate === 'lifetime' || !keyObj.expiryDate
      ? 'Trọn Đời (Vô hạn)'
      : `Hạn Sử Dụng đến ${keyObj.expiryDate} (Dùng thử)`;
      
    const msg = `Dạ em gửi Thầy/Cô ${keyObj.teacherName} (${keyObj.school}) Mã Kích Hoạt Quyền Giáo Viên trên hệ thống:\n\n🔑 MÃ KÍCH HOẠT: ${keyObj.key}\n⏳ THỜI HẠN SỬ DỤNG: ${durationLabel}\n🌐 ĐỊA CHỈ TRUY CẬP: https://examoraai.com\n\nThầy/Cô vào mục 'Cổng Giáo Viên' dán mã trên để mở khóa toàn bộ không gian quản lý lớp học, xáo đề thi và giao bài tập cho học sinh nhé ạ!`;
    navigator.clipboard.writeText(msg);
    setCopiedZaloMsg(true);
    setTimeout(() => setCopiedZaloMsg(false), 2500);
  };

  const handleCopySingleKey = (keyStr, keyId) => {
    navigator.clipboard.writeText(keyStr);
    setCopiedKeyId(keyId);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

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

  // --- Content Tab states ---
  const [contentSubTab, setContentSubTab] = useState('topics'); // 'topics', 'words', 'ai-gen', 'ipa', 'sentences'
  
  // Topics states
  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [editingTopic, setEditingTopic] = useState({ title: '', slug: '', description: '', image: '', grade: '10', is_active: true });
  const [showTopicModal, setShowTopicModal] = useState(false);

  // Words states
  const [words, setWords] = useState([]);
  const [loadingWords, setLoadingWords] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [editingWord, setEditingWord] = useState({ topic_id: 0, word: '', ipa: '', reading: '', pos: '', meaning: '', example: '', example_vi: '', is_active: true });
  const [showWordModal, setShowWordModal] = useState(false);

  // AI Gen states
  const [aiWordInput, setAiWordInput] = useState('');
  const [aiGradeInput, setAiGradeInput] = useState('10');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null); // generated metadata
  const [aiTargetTopicId, setAiTargetTopicId] = useState('');

  // IPA states
  const [ipaSounds, setIpaSounds] = useState([]);
  const [loadingIpa, setLoadingIpa] = useState(false);
  const [editingIpa, setEditingIpa] = useState({ symbol: '', name: '', sound_type: 'vowel', example_word: '', example_phonetic: '', mouth_guide: '', is_active: true });
  const [showIpaModal, setShowIpaModal] = useState(false);

  // Sentences states
  const [sentences, setSentences] = useState([]);
  const [loadingSentences, setLoadingSentences] = useState(false);
  const [sentenceGradeFilter, setSentenceGradeFilter] = useState('');
  const [editingSentence, setEditingSentence] = useState({ text: '', level_grade: '10', difficulty: 0.0, is_active: true });
  const [showSentenceModal, setShowSentenceModal] = useState(false);

  const fetchTopics = async () => {
    setLoadingTopics(true);
    try {
      const res = await axios.get(`${API_BASE}/content/vocab/topics`);
      if (res.data?.status === 'success') {
        setTopics(res.data.data || []);
      }
    } catch (err) {
      console.warn('Lỗi tải chủ đề từ vựng:', err.message);
    } finally {
      setLoadingTopics(false);
    }
  };

  const fetchWords = async (topicId) => {
    setLoadingWords(true);
    try {
      const url = topicId ? `${API_BASE}/content/vocab/words?topic_id=${topicId}` : `${API_BASE}/content/vocab/words`;
      const res = await axios.get(url);
      if (res.data?.status === 'success') {
        setWords(res.data.data || []);
      }
    } catch (err) {
      console.warn('Lỗi tải từ vựng:', err.message);
    } finally {
      setLoadingWords(false);
    }
  };

  const fetchIpaSounds = async () => {
    setLoadingIpa(true);
    try {
      const res = await axios.get(`${API_BASE}/content/ipa/sounds`);
      if (res.data?.status === 'success') {
        setIpaSounds(res.data.data || []);
      }
    } catch (err) {
      console.warn('Lỗi tải âm IPA:', err.message);
    } finally {
      setLoadingIpa(false);
    }
  };

  const fetchSentences = async () => {
    setLoadingSentences(true);
    try {
      const url = sentenceGradeFilter ? `${API_BASE}/content/pronounce/sentences?grade=${sentenceGradeFilter}` : `${API_BASE}/content/pronounce/sentences`;
      const res = await axios.get(url);
      if (res.data?.status === 'success') {
        setSentences(res.data.data || []);
      }
    } catch (err) {
      console.warn('Lỗi tải câu phát âm:', err.message);
    } finally {
      setLoadingSentences(false);
    }
  };

  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setSecurityMessage({
          type: 'error',
          text: 'Phiên đăng nhập cũ đã hết hạn (do đã kích phiên trước đó). Vui lòng bấm "Đăng nhập lại" bên dưới.',
          needLogin: true
        });
        return;
      }
      const res = await axios.get(`${API_BASE}/auth/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.status === 'success') {
        setSessions(res.data.sessions || []);
        setCurrentSessionId(res.data.current_session_id);
        setPrimarySessionId(res.data.primary_session_id);
        setCurrentIp(res.data.current_ip || '');
        setCurrentDeviceName(res.data.current_device || '');
        setSecurityMessage(null);
      }
    } catch (err) {
      console.warn('Lỗi fetch sessions:', err.message);
      if (err.response?.status === 401) {
        setSecurityMessage({
          type: 'error',
          text: 'Phiên đăng nhập đã hết hạn hoặc bị kích. Vui lòng bấm "Đăng nhập lại" để tiếp tục quản lý.',
          needLogin: true
        });
      }
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchResearchReport();
    fetchThetaTimeline();
    fetchTopics();
    fetchIpaSounds();
    fetchSentences();
    fetchSessions();
  }, [sentenceGradeFilter]);

  useEffect(() => {
    if (adminTab === 'security') {
      fetchSessions();
    }
  }, [adminTab]);

  // Vocab CRUD Handlers
  const handleSaveTopic = async (e) => {
    e.preventDefault();
    try {
      if (editingTopic.id) {
        await axios.put(`${API_BASE}/content/vocab/topics/${editingTopic.id}`, editingTopic);
        alert('✅ Cập nhật chủ đề thành công!');
      } else {
        await axios.post(`${API_BASE}/content/vocab/topics`, editingTopic);
        alert('✅ Tạo chủ đề thành công!');
      }
      setShowTopicModal(false);
      fetchTopics();
    } catch (err) {
      alert(err.response?.data?.detail || 'Lỗi khi lưu chủ đề.');
    }
  };

  const handleDeleteTopic = async (id) => {
    const ok = window.appConfirm
      ? await window.appConfirm('Bạn có chắc chắn muốn xóa chủ đề này? Tất cả các từ thuộc chủ đề này cũng sẽ bị xóa.', 'Xóa Chủ Đề Từ Vựng', { type: 'error', confirmText: 'Xóa Chủ Đề' })
      : confirm('Bạn có chắc chắn muốn xóa chủ đề này? Tất cả các từ thuộc chủ đề này cũng sẽ bị xóa.');
    if (!ok) return;
    try {
      await axios.delete(`${API_BASE}/content/vocab/topics/${id}`);
      alert('✅ Đã xóa chủ đề thành công.');
      fetchTopics();
      if (selectedTopicId === String(id)) {
        setSelectedTopicId('');
        setWords([]);
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Lỗi khi xóa chủ đề.');
    }
  };

  const handleSaveWord = async (e) => {
    e.preventDefault();
    try {
      if (editingWord.id) {
        await axios.put(`${API_BASE}/content/vocab/words/${editingWord.id}`, editingWord);
        alert('✅ Cập nhật từ vựng thành công!');
      } else {
        await axios.post(`${API_BASE}/content/vocab/words`, editingWord);
        alert('✅ Thêm từ vựng thành công!');
      }
      setShowWordModal(false);
      fetchWords(selectedTopicId || editingWord.topic_id);
    } catch (err) {
      alert(err.response?.data?.detail || 'Lỗi khi lưu từ vựng.');
    }
  };

  const handleDeleteWord = async (id) => {
    const ok = window.appConfirm
      ? await window.appConfirm('Bạn có chắc chắn muốn xóa từ vựng này không?', 'Xóa Từ Vựng', { type: 'error', confirmText: 'Xóa Từ' })
      : confirm('Bạn có chắc chắn muốn xóa từ vựng này?');
    if (!ok) return;
    try {
      await axios.delete(`${API_BASE}/content/vocab/words/${id}`);
      alert('✅ Đã xóa từ vựng thành công.');
      fetchWords(selectedTopicId);
    } catch (err) {
      alert(err.response?.data?.detail || 'Lỗi khi xóa từ vựng.');
    }
  };

  // IPA CRUD Handlers
  const handleSaveIpa = async (e) => {
    e.preventDefault();
    try {
      if (editingIpa.id) {
        await axios.put(`${API_BASE}/content/ipa/sounds/${editingIpa.id}`, editingIpa);
        alert('✅ Cập nhật âm IPA thành công!');
      } else {
        await axios.post(`${API_BASE}/content/ipa/sounds`, editingIpa);
        alert('✅ Thêm âm IPA thành công!');
      }
      setShowIpaModal(false);
      fetchIpaSounds();
    } catch (err) {
      alert(err.response?.data?.detail || 'Lỗi khi lưu âm IPA.');
    }
  };

  const handleDeleteIpa = async (id) => {
    const ok = window.appConfirm
      ? await window.appConfirm('Bạn có chắc chắn muốn xóa âm IPA này không?', 'Xóa Âm IPA', { type: 'error', confirmText: 'Xóa Âm' })
      : confirm('Bạn có chắc chắn muốn xóa âm IPA này?');
    if (!ok) return;
    try {
      await axios.delete(`${API_BASE}/content/ipa/sounds/${id}`);
      alert('✅ Đã xóa âm IPA thành công.');
      fetchIpaSounds();
    } catch (err) {
      alert(err.response?.data?.detail || 'Lỗi khi xóa âm IPA.');
    }
  };

  // Sentence CRUD Handlers
  const handleSaveSentence = async (e) => {
    e.preventDefault();
    try {
      if (editingSentence.id) {
        await axios.put(`${API_BASE}/content/pronounce/sentences/${editingSentence.id}`, editingSentence);
        alert('✅ Cập nhật câu phát âm thành công!');
      } else {
        await axios.post(`${API_BASE}/content/pronounce/sentences`, editingSentence);
        alert('✅ Thêm câu phát âm thành công!');
      }
      setShowSentenceModal(false);
      fetchSentences();
    } catch (err) {
      alert(err.response?.data?.detail || 'Lỗi khi lưu câu phát âm.');
    }
  };

  const handleDeleteSentence = async (id) => {
    const ok = window.appConfirm
      ? await window.appConfirm('Bạn có chắc chắn muốn xóa câu phát âm này không?', 'Xóa Câu Phát Âm', { type: 'error', confirmText: 'Xóa Câu' })
      : confirm('Bạn có chắc chắn muốn xóa câu phát âm này?');
    if (!ok) return;
    try {
      await axios.delete(`${API_BASE}/content/pronounce/sentences/${id}`);
      alert('✅ Đã xóa câu phát âm thành công.');
      fetchSentences();
    } catch (err) {
      alert(err.response?.data?.detail || 'Lỗi khi xóa câu phát âm.');
    }
  };

  // AI Gen Handlers
  const handleAIGenerateWord = async () => {
    if (!aiWordInput.trim()) {
      alert('Vui lòng nhập từ tiếng Anh cần soạn thảo!');
      return;
    }
    setAiLoading(true);
    setAiResult(null);
    try {
      const headers = {};
      if (keys?.gemini) headers['x-gemini-key'] = keys.gemini;
      const res = await axios.post(`${API_BASE}/content/ai-generate-word-metadata`, {
        word: aiWordInput.trim(),
        grade: aiGradeInput
      }, { headers });
      if (res.data?.status === 'success') {
        setAiResult(res.data.metadata);
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Lỗi gọi AI để soạn từ. Hãy chắc chắn bạn đã cấu hình Gemini Key.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveAIGeneratedWord = async () => {
    if (!aiTargetTopicId) {
      alert('Vui lòng chọn chủ đề để lưu từ vựng!');
      return;
    }
    try {
      await axios.post(`${API_BASE}/content/vocab/words`, {
        topic_id: parseInt(aiTargetTopicId, 10),
        word: aiWordInput.trim(),
        ipa: aiResult.ipa,
        reading: aiResult.reading,
        pos: aiResult.pos,
        meaning: aiResult.meaning,
        example: aiResult.example,
        example_vi: aiResult.example_vi,
        is_active: true
      });
      alert(`✅ Đã lưu từ "${aiWordInput.trim()}" thành công!`);
      setAiWordInput('');
      setAiResult(null);
      if (selectedTopicId === aiTargetTopicId) {
        fetchWords(selectedTopicId);
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Lỗi khi lưu từ vựng.');
    }
  };

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

  const handleToggleStudentGroup = async (username, currentGroup) => {
    const nextGroup = currentGroup === 'CONTROL' ? 'ADAPTIVE' : 'CONTROL';
    try {
      await axios.put(`${API_BASE}/auth/users/${username}/change-group?group=${nextGroup}`);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.detail || 'Không thể thay đổi nhóm học sinh.');
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

  // ── Thao tác Bảo mật Thiết bị & Phiên Đăng Nhập ───────────────────────────

  const handleKickAllOthers = async () => {
    const confirmMsg = "🚨 BẠN CÓ CHẮC CHẮN MUỐN KÍCH ĐĂNG XUẤT TẤT CẢ CÁC MÁY KHÁC?\n\n- Toàn bộ máy tính/thiết bị khác (kể cả máy tại điểm thi) sẽ bị đá văng ngay lập tức.\n- Chỉ duy nhất máy tính này của bạn được giữ lại là MÁY CHUẨN NHẤT.";
    const ok = window.appConfirm 
      ? await window.appConfirm(confirmMsg, "Kích Đăng Xuất Tất Cả Máy Khác", { type: 'error', confirmText: 'Kích Ngay Lập Tức' })
      : window.confirm(confirmMsg);
    if (!ok) return;

    setSessionActionLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await axios.post(`${API_BASE}/auth/sessions/kick-all-others`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.data?.status === 'success') {
        if (res.data.token) {
          localStorage.setItem('auth_token', res.data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        }
        setSecurityMessage({
          type: 'success',
          text: res.data.message || 'Đã kích đăng xuất thành công tất cả máy khác! Máy này đã được cài là máy chuẩn nhất.'
        });
        fetchSessions();
      }
    } catch (err) {
      setSecurityMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Lỗi khi thực hiện kích thiết bị khác.'
      });
    } finally {
      setSessionActionLoading(false);
    }
  };

  const handleKickSingleSession = async (sessionId, deviceName) => {
    const confirmMsg = `Xác nhận kích đăng xuất thiết bị "${deviceName}" ra khỏi tài khoản ngay lập tức?`;
    const ok = window.appConfirm
      ? await window.appConfirm(confirmMsg, "Kích Thiết Bị Ra Khỏi Tài Khoản", { type: 'warning', confirmText: 'Kích Thiết Bị' })
      : window.confirm(confirmMsg);
    if (!ok) return;

    setKickingSessionId(sessionId);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await axios.post(`${API_BASE}/auth/sessions/${sessionId}/kick`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.data?.status === 'success') {
        setSecurityMessage({
          type: 'success',
          text: res.data.message
        });
        fetchSessions();
      }
    } catch (err) {
      setSecurityMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Lỗi khi kích thiết bị.'
      });
    } finally {
      setKickingSessionId(null);
    }
  };

  const handleSetPrimaryDevice = async () => {
    setSessionActionLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await axios.post(`${API_BASE}/auth/sessions/set-primary`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.data?.status === 'success') {
        if (res.data.token) {
          localStorage.setItem('auth_token', res.data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        }
        setSecurityMessage({
          type: 'success',
          text: res.data.message || 'Đã cài máy này làm thiết bị chuẩn nhất của tài khoản!'
        });
        fetchSessions();
      }
    } catch (err) {
      setSecurityMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Lỗi khi thiết lập thiết bị chuẩn.'
      });
    } finally {
      setSessionActionLoading(false);
    }
  };

  const otherSessions = useMemo(() => sessions.filter(s => !s.is_current), [sessions]);
  const otherActiveCount = useMemo(() => sessions.filter(s => !s.is_current && s.is_active).length, [sessions]);

  // ── Tab definitions ───────────────────────────────────────────────────────

  const tabs = [
    { id: 'dashboard', icon: TrendingUp, label: 'Tổng quan & Tiến trình (θ)' },
    { id: 'security',  icon: ShieldAlert, label: `Bảo Mật & Thiết Bị${otherActiveCount > 0 ? ` (⚠️ ${otherActiveCount} máy lạ)` : ''}` },
    { id: 'users',     icon: Users,     label: `Quản lý Học sinh (${students.length})` },
    { id: 'teacher-keys', icon: KeyRound, label: `Quản Lý & Sinh Key Giáo Viên (${teacherKeys.length})` },
    { id: 'content',   icon: BookOpen,  label: 'Quản lý Học liệu (CMS)' },
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

      {/* ── CẢNH BÁO AN NINH NẾU CÓ MÁY KHÁC ĐANG MỞ ── */}
      {otherActiveCount > 0 && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/90 via-red-900/80 to-rose-950/90 border-2 border-rose-500/60 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/30 text-rose-300 border border-rose-400/40 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <span>CẢNH BÁO: Phát hiện {otherActiveCount} máy tính khác đang mở tài khoản Admin!</span>
                <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-md uppercase font-black">Nguy cấp</span>
              </h4>
              <p className="text-xs text-rose-200/90 mt-0.5">
                Có thể là máy tính tại điểm thi chưa thoát được. Hãy bấm kích ngay để bảo vệ an toàn toàn bộ hệ thống!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={handleKickAllOthers}
              disabled={sessionActionLoading}
              className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs shadow-xl shadow-rose-600/40 transition cursor-pointer flex items-center justify-center gap-2 border border-rose-400/40"
            >
              <LogOut className="w-4 h-4" />
              <span>🚨 KÍCH ĐĂNG XUẤT TẤT CẢ MÁY KHÁC NGAY</span>
            </button>
            <button
              onClick={() => setAdminTab('security')}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <span>Xem thiết bị</span>
            </button>
          </div>
        </div>
      )}

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
          TAB 2: BẢO MẬT & QUẢN LÝ THIẾT BỊ ĐĂNG NHẬP (KÍCH MÁY KHÁC)
      ══════════════════════════════════════════════════════════════ */}
      {adminTab === 'security' && (
        <div className="space-y-6">

          {/* Banner Thông báo & Thao tác khẩn cấp */}
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-rose-500/40 bg-gradient-to-r from-rose-950/40 via-red-950/30 to-indigo-950/40 space-y-5 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-500/20 shrink-0">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl md:text-2xl font-black text-white font-outfit">Bảo Mật &amp; Quản Lý Thiết Bị Đăng Nhập</h2>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
                      Chống rò rỉ quyền Admin
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
                    Bạn vừa đi thi về hoặc quên chưa đăng xuất trên máy tính tại phòng thi / máy lạ?
                    Bấm nút kích bên dưới để <strong className="text-rose-300">lập tức đá văng tất cả các máy khác</strong> ra khỏi tài khoản của bạn và xác nhận máy tính này là <strong className="text-emerald-300">thiết bị chính chủ (chuẩn nhất)</strong>!
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
                <button
                  onClick={handleKickAllOthers}
                  disabled={sessionActionLoading}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs shadow-xl shadow-rose-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2.5 border border-rose-400/40"
                >
                  <LogOut className="w-4 h-4" />
                  <span>🚨 KÍCH ĐĂNG XUẤT TẤT CẢ MÁY KHÁC</span>
                </button>
                <button
                  onClick={fetchSessions}
                  disabled={loadingSessions}
                  className="px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingSessions ? 'animate-spin' : ''}`} />
                  <span>Làm mới</span>
                </button>
              </div>
            </div>

            {securityMessage && (
              <div className={`p-4 rounded-2xl text-xs font-bold border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in ${
                securityMessage.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center gap-2">
                  <span>{securityMessage.text}</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                  {securityMessage.needLogin && (
                    <button
                      onClick={() => onOpenAuth ? onOpenAuth() : window.location.reload()}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 shrink-0 border border-rose-400/40"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Đăng nhập lại Admin</span>
                    </button>
                  )}
                  <button onClick={() => setSecurityMessage(null)} className="text-gray-400 hover:text-white font-black text-sm px-2 cursor-pointer">✕</button>
                </div>
              </div>
            )}
          </div>

          {/* PHẦN 1: MÁY TÍNH HIỆN TẠI (MÁY CHUẨN NHẤT) */}
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-emerald-500/40 bg-gradient-to-r from-emerald-950/20 via-slate-900/40 to-indigo-950/20 space-y-5 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                  <Laptop className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white font-outfit">Thiết Bị Của Bạn (Máy Này)</h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-black flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                      ĐANG TRUY CẬP
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Máy tính bạn đang trực tiếp điều hành hệ thống Examora AI</p>
                </div>
              </div>

              <button
                onClick={handleSetPrimaryDevice}
                disabled={sessionActionLoading}
                className="px-4 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 font-extrabold text-xs transition flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>⭐ Cài máy này là máy chuẩn nhất</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tên thiết bị</span>
                <div className="text-sm font-black text-white">{currentDeviceName || 'Máy tính hiện tại'}</div>
                <p className="text-[10px] text-emerald-400 font-semibold">Thiết bị tin cậy số 1</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Địa chỉ IP kết nối</span>
                <div className="text-sm font-black text-indigo-300 font-mono">{currentIp || '127.0.0.1'}</div>
                <p className="text-[10px] text-gray-400">Đã định tuyến an toàn</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Trạng thái định danh</span>
                <div className="text-sm font-black text-emerald-300 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Máy Chuẩn Nhất</span>
                </div>
                <p className="text-[10px] text-gray-400">Không bao giờ bị kích nhầm</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Quyền hạn hệ thống</span>
                <div className="text-sm font-black text-rose-400">ADMINISTRATOR</div>
                <p className="text-[10px] text-gray-400">Toàn quyền điều hành</p>
              </div>
            </div>
          </div>

          {/* PHẦN 2: CÁC MÁY KHÁC (MÁY ĐIỂM THI / MÁY LẠ) */}
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white font-outfit">Danh Sách Máy Khác / Máy Tại Điểm Thi</h3>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold ${
                    otherActiveCount > 0 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-white/10 text-gray-400'
                  }`}>
                    {otherActiveCount} máy đang mở
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Tất cả các máy tính khác từng đăng nhập tài khoản của bạn</p>
              </div>
            </div>

            {loadingSessions ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-gray-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
                <span>Đang kiểm tra trạng thái các thiết bị...</span>
              </div>
            ) : otherSessions.length === 0 ? (
              <div className="py-10 text-center space-y-2 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-black text-white">An toàn tuyệt đối! Không phát hiện máy tính nào khác</h4>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Chỉ có duy nhất máy tính này của bạn đang truy cập tài khoản. Toàn bộ các máy khác (kể cả máy tại phòng thi) đã bị loại bỏ an toàn.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {otherSessions.map(sess => (
                  <div
                    key={sess.session_id}
                    className={`p-4 md:p-5 rounded-2xl border transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                      sess.is_active
                        ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500/60'
                        : 'bg-white/[0.01] border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        sess.is_active
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-gray-800 text-gray-500 border border-white/5'
                      }`}>
                        <Monitor className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-white">{sess.device_name}</h4>
                          {sess.is_active ? (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold">
                              ⚠️ Đang mở trên máy này (Chưa thoát)
                            </span>
                          ) : (
                            <span className="text-[10px] bg-gray-700/50 text-gray-400 border border-white/10 px-2 py-0.5 rounded-md font-bold">
                              ✓ Đã kích đăng xuất
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 flex-wrap">
                          <span>IP: <strong className="text-gray-300 font-mono">{sess.ip_address || 'Không rõ'}</strong></span>
                          <span>•</span>
                          <span>Hệ điều hành: <strong className="text-gray-300">{sess.os_name}</strong></span>
                          <span>•</span>
                          <span>Trình duyệt: <strong className="text-gray-300">{sess.browser}</strong></span>
                          {sess.created_at && (
                            <>
                              <span>•</span>
                              <span>Đăng nhập lúc: <strong className="text-gray-300">{sess.created_at.slice(0, 16).replace('T', ' ')}</strong></span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {sess.is_active ? (
                      <button
                        onClick={() => handleKickSingleSession(sess.session_id, sess.device_name)}
                        disabled={kickingSessionId === sess.session_id}
                        className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition shadow-md shadow-rose-600/20 cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-rose-400/30"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{kickingSessionId === sess.session_id ? 'Đang kích...' : 'Kích máy này ra ngay'}</span>
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500 font-bold px-3 py-1 bg-white/5 rounded-lg border border-white/5 shrink-0">
                        Phiên đã vô hiệu hóa
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 3: QUẢN LÝ TÀI KHOẢN HỌC SINH
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
                    <th className="p-3 text-center">Nhóm</th>
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
                              <span className="text-[10px] text-gray-500">{u.role === 'admin' ? 'Quản trị viên' : 'Học sinh'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-gray-400 text-[11px]">{u.username}</td>
                        <td className="p-3">Lớp {u.grade}</td>
                        <td className="p-3 text-center">
                          {u.role === 'student' ? (
                            <button
                              type="button"
                              onClick={() => handleToggleStudentGroup(u.username, u.experiment_group)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border cursor-pointer transition transform active:scale-95 ${
                                u.experiment_group === 'ADAPTIVE'
                                  ? 'bg-indigo-600/15 text-indigo-300 border-indigo-500/30 hover:bg-indigo-600/30'
                                  : 'bg-rose-600/15 text-rose-300 border-rose-500/30 hover:bg-rose-600/30'
                              }`}
                              title="Click để đổi nhóm học tập"
                            >
                              {u.experiment_group === 'ADAPTIVE' ? 'THỰC NGHIỆM' : 'ĐỐI CHỨNG'}
                            </button>
                          ) : (
                            <span className="text-gray-600 text-[10px]">—</span>
                          )}
                        </td>
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
          TAB MỚI: QUẢN LÝ & SINH MÃ KEY KÍCH HOẠT GIÁO VIÊN
      ══════════════════════════════════════════════════════════════ */}
      {adminTab === 'teacher-keys' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Header Card */}
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-amber-500/30 bg-gradient-to-r from-[#181105] via-[#0d0f1e] to-[#080d20] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-extrabold uppercase">
                <KeyRound className="w-3.5 h-3.5" />
                HỆ THỐNG CẤP PHÁT &amp; QUẢN TRỊ LICENSE KEY GIÁO VIÊN
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white font-outfit">
                Quản Lý &amp; Sinh Mã Kích Hoạt Giáo Viên
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-2xl font-normal">
                Tạo mã key riêng cho từng Thầy/Cô khi liên hệ Zalo <strong>0975.711.254</strong> hoặc điền form. Giáo viên dùng mã này để mở khóa Cổng Giáo Viên, quản lý lớp học và xáo đề thi.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-black/50 p-4 rounded-2xl border border-amber-500/30 text-center shrink-0">
                <div className="text-[10px] text-gray-400 uppercase font-bold">Tổng Số Key Đã Cấp</div>
                <div className="text-2xl font-black text-amber-400 font-mono">{teacherKeys.length} Mã Key</div>
              </div>
            </div>
          </div>

          {/* Danh Sách Yêu Cầu Đăng Ký Chờ Phê Duyệt */}
          {teacherRequests.length > 0 && (
            <div className="glass-card rounded-3xl p-6 border border-cyan-500/40 bg-gradient-to-b from-[#09152a] to-[#0a0f24] space-y-4 shadow-2xl animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-white">Yêu Cầu Đăng Ký Cấp Quyền Giáo Viên Mới</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        {teacherRequests.filter(r => r.status === 'pending').length} Chờ Duyệt
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">Các Thầy/Cô đã gửi thông tin qua form trên Cổng Giáo Viên.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[360px] overflow-y-auto pr-1">
                {teacherRequests.map((req) => (
                  <div
                    key={req.id}
                    className={`p-4 rounded-2xl border transition space-y-3 ${
                      req.status === 'approved'
                        ? 'bg-emerald-500/5 border-emerald-500/20 opacity-80'
                        : 'bg-black/40 border-cyan-500/30 hover:border-cyan-500/60 shadow-lg'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                          <span>{req.teacherName}</span>
                          {req.status === 'approved' && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Đã Duyệt</span>
                          )}
                        </h4>
                        <div className="text-xs text-cyan-300 font-mono mt-0.5">{req.school || 'Trường THPT'}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteTeacherRequest(req.id)}
                        className="text-gray-500 hover:text-rose-400 p-1 cursor-pointer"
                        title="Xóa yêu cầu này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 bg-white/5 p-2.5 rounded-xl">
                      <div>📞 SĐT / Zalo: <strong className="text-white font-mono">{req.phone}</strong></div>
                      {req.note && <div>💬 Lời nhắn: <span className="text-slate-300 italic">{req.note}</span></div>}
                      <div className="text-[10px] text-gray-400">⏱ Gửi lúc: {req.timestamp}</div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleApproveTeacherRequest(req)}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Duyệt &amp; Cấp Key</span>
                      </button>
                      <a
                        href={`https://zalo.me/${req.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-[#0068FF]/20 hover:bg-[#0068FF]/30 text-blue-300 border border-[#0068FF]/40 text-xs font-bold flex items-center justify-center gap-1 transition"
                        title="Nhắn tin Zalo"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#0068FF]" />
                        <span>Zalo</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Cột 1: Form Sinh Key Mới (Generator) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="glass-card rounded-3xl p-6 border border-amber-500/30 bg-[#0a0f24] space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Sinh &amp; Cấp Mã Key Giáo Viên Mới</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleAutoGenerateCode}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-bold cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Tự Động Sinh Mã</span>
                  </button>
                </div>

                <form onSubmit={handleAddTeacherKey} className="space-y-3.5">
                  <div>
                    <label className="text-[11px] text-gray-300 font-bold block mb-1">
                      Họ và Tên Giáo Viên: *
                    </label>
                    <input
                      type="text"
                      required
                      value={newKeyTeacherName}
                      onChange={(e) => setNewKeyTeacherName(e.target.value)}
                      placeholder="Ví dụ: Cô Nguyễn Thùy Trang..."
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-gray-300 font-bold block mb-1">
                        Trường THPT Giảng Dạy:
                      </label>
                      <input
                        type="text"
                        value={newKeySchool}
                        onChange={(e) => setNewKeySchool(e.target.value)}
                        placeholder="Ví dụ: THPT Chuyên Hà Nội..."
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-300 font-bold block mb-1">
                        Số Điện Thoại / Zalo:
                      </label>
                      <input
                        type="tel"
                        value={newKeyPhone}
                        onChange={(e) => setNewKeyPhone(e.target.value)}
                        placeholder="Ví dụ: 0912345678..."
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-300 font-bold block mb-1">
                      Mã Key Cấp Cho Giáo Viên (Có Thể Tự Gõ Hoặc Tự Sinh): *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={newKeyCustomCode}
                        onChange={(e) => setNewKeyCustomCode(e.target.value)}
                        placeholder="Ví dụ: GV-TRANG-2026..."
                        className="flex-1 bg-black/60 border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono uppercase tracking-wider focus:outline-none focus:border-amber-400 font-bold"
                      />
                      <button
                        type="button"
                        onClick={handleAutoGenerateCode}
                        className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 cursor-pointer"
                        title="Sinh mã ngẫu nhiên"
                      >
                        Random
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-300 font-bold block mb-1">
                      Thời Hạn Sử Dụng Của Key: *
                    </label>
                    <select
                      value={newKeyDuration}
                      onChange={(e) => setNewKeyDuration(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="1th">1 Tháng (Dùng thử)</option>
                      <option value="3th">3 Tháng</option>
                      <option value="6th">6 Tháng</option>
                      <option value="12th">1 Năm (Thông dụng)</option>
                      <option value="lifetime">Trọn Đời (VIP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-300 font-bold block mb-1">
                      Ghi Chú / Phân Quyền:
                    </label>
                    <input
                      type="text"
                      value={newKeyNote}
                      onChange={(e) => setNewKeyNote(e.target.value)}
                      placeholder="Ví dụ: Giáo viên khối 10, cấp quyền 1 năm..."
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black text-xs shadow-lg shadow-orange-500/25 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Xác Nhận Thêm &amp; Kích Hoạt Key Này</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Cột 2: Bảng Danh Sách Key Đã Cấp */}
            <div className="lg:col-span-7 space-y-4">
              <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-extrabold text-base text-white">Danh Sách Mã Key Đang Hoạt Động</h3>
                    <p className="text-xs text-gray-400">Sao chép mã hoặc tin nhắn Zalo gửi trực tiếp cho giáo viên.</p>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input
                      type="text"
                      value={teacherKeySearch}
                      onChange={(e) => setTeacherKeySearch(e.target.value)}
                      placeholder="Tìm theo tên GV, trường, key..."
                      className="pl-8 pr-3 py-1.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none w-56"
                    />
                  </div>
                </div>

                {copiedZaloMsg && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-in fade-in">
                    <Check className="w-4 h-4" />
                    <span>✓ Đã sao chép tin nhắn Zalo chuẩn! Thầy/Cô chỉ cần dán (Ctrl+V) vào Zalo gửi cho Giáo viên.</span>
                  </div>
                )}

                <div className="divide-y divide-white/5 max-h-[480px] overflow-y-auto pr-1">
                  {teacherKeys
                    .filter(k => {
                      if (!teacherKeySearch) return true;
                      const q = teacherKeySearch.toLowerCase();
                      return k.teacherName.toLowerCase().includes(q) || k.school.toLowerCase().includes(q) || k.key.toLowerCase().includes(q);
                    })
                    .map((k, idx) => (
                      <div key={k.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] px-2 rounded-xl">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-gray-500 text-xs">{idx + 1}.</span>
                            <span className="font-black text-sm text-white">{k.teacherName}</span>
                            <span className="text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                              {k.school}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              k.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                            }`}>
                              {k.status === 'active' ? '✓ Đang Hoạt Động' : '🔒 Đã Khóa'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                            <span>SĐT/Zalo: <strong className="text-slate-200">{k.phone}</strong></span>
                            <span>•</span>
                            <span>Ngày cấp: <strong className="text-slate-200">{k.date}</strong></span>
                            <span>•</span>
                            <span>Hạn dùng: <strong className="text-amber-400">{k.expiryDate === 'lifetime' || !k.expiryDate ? 'Trọn đời' : k.expiryDate}</strong></span>
                            <span>•</span>
                            <span className="italic text-gray-400">{k.note}</span>
                          </div>
                        </div>

                        {/* Cụm Nút Thao Tác Key */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Box Mã Key */}
                          <div className="bg-black/60 px-3 py-1.5 rounded-xl border border-amber-500/30 text-amber-300 font-mono font-black text-xs tracking-wider">
                            {k.key}
                          </div>

                          <button
                            onClick={() => handleCopySingleKey(k.key, k.id)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer border border-white/10 text-xs flex items-center gap-1"
                            title="Sao chép mã Key"
                          >
                            <Copy className="w-3.5 h-3.5 text-amber-400" />
                            <span>{copiedKeyId === k.id ? 'Đã Copy' : 'Copy'}</span>
                          </button>

                          <button
                            onClick={() => handleCopyZaloMessage(k)}
                            className="px-2.5 py-1.5 rounded-xl bg-[#0068FF]/20 hover:bg-[#0068FF]/30 border border-[#0068FF]/40 text-blue-300 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                            title="Copy tin nhắn gửi Zalo cho giáo viên"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[#0068FF]" />
                            <span>Nhắn Zalo</span>
                          </button>

                          <button
                            onClick={() => handleToggleKeyStatus(k.id)}
                            className={`p-2 rounded-xl transition cursor-pointer border ${
                              k.status === 'active' ? 'bg-white/5 text-gray-400 hover:text-amber-300 border-white/10' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            }`}
                            title={k.status === 'active' ? 'Tạm khóa key này' : 'Mở khóa key này'}
                          >
                            {k.status === 'active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleDeleteTeacherKey(k.id)}
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition cursor-pointer border border-red-500/20"
                            title="Xóa vĩnh viễn key này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 5: QUẢN LÝ HỌC LIỆU (CMS)
      ══════════════════════════════════════════════════════════════ */}
      {adminTab === 'content' && (
        <div className="space-y-6 animate-fade-in">
          {/* Sub Tab Bar */}
          <div className="flex flex-wrap items-center bg-[#070b18] border border-white/10 p-1.5 rounded-2xl gap-1.5 overflow-x-auto">
            {[
              { id: 'topics', label: 'Chủ đề từ vựng' },
              { id: 'words', label: 'Từ vựng chi tiết' },
              { id: 'ai-gen', label: 'AI Auto-Composer' },
              { id: 'ipa', label: 'Phát âm IPA' },
              { id: 'sentences', label: 'Câu phát âm (IRT)' }
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => setContentSubTab(sub.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  contentSubTab === sub.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Sub-tab 1: Topics */}
          {contentSubTab === 'topics' && (
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-extrabold text-lg text-white font-outfit">Chủ đề từ vựng</h3>
                  <p className="text-xs text-gray-400">Quản lý các chủ đề học tập cho các khối lớp học sinh</p>
                </div>
                <button
                  onClick={() => {
                    setEditingTopic({ title: '', slug: '', description: '', image: '', grade: '10', is_active: true });
                    setShowTopicModal(true);
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl text-xs font-extrabold shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm chủ đề mới
                </button>
              </div>

              {loadingTopics ? (
                <div className="text-center py-10 text-gray-500 animate-pulse font-bold text-xs">Đang tải chủ đề từ vựng...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {topics.map(t => (
                    <div key={t.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="bg-indigo-500/10 text-indigo-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-indigo-500/20">Lớp {t.grade}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${t.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>{t.is_active ? 'Đang hoạt động' : 'Đã ẩn'}</span>
                        </div>
                        <h4 className="text-base font-extrabold text-white mt-3 font-outfit">{t.title}</h4>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{t.description || 'Chưa có mô tả.'}</p>
                        <span className="text-[10px] text-gray-500 mt-2 block font-mono">slug: {t.slug}</span>
                      </div>
                      <div className="flex justify-end gap-2 border-t border-white/5 pt-3">
                        <button
                          onClick={() => {
                            setEditingTopic(t);
                            setShowTopicModal(true);
                          }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition cursor-pointer"
                          title="Sửa chủ đề"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTopic(t.id)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                          title="Xóa chủ đề"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {topics.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-500 text-xs font-bold">Chưa có chủ đề từ vựng nào. Hãy thêm mới!</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Sub-tab 2: Words */}
          {contentSubTab === 'words' && (
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-extrabold text-lg text-white font-outfit">Từ vựng chi tiết</h3>
                  <p className="text-xs text-gray-400">Xem và sửa đổi từ vựng theo từng chủ đề bài học</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedTopicId}
                    onChange={(e) => {
                      setSelectedTopicId(e.target.value);
                      if (e.target.value) fetchWords(e.target.value);
                      else setWords([]);
                    }}
                    className="bg-[#070a16] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 outline-none focus:border-indigo-500 cursor-pointer min-w-[200px]"
                  >
                    <option value="">— Chọn chủ đề để xem từ vựng —</option>
                    {topics.map(t => (
                      <option key={t.id} value={t.id}>[{t.grade}] {t.title}</option>
                    ))}
                  </select>
                  {selectedTopicId && (
                    <button
                      onClick={() => {
                        setEditingWord({ topic_id: parseInt(selectedTopicId, 10), word: '', ipa: '', reading: '', pos: 'Danh từ (n.)', meaning: '', example: '', example_vi: '', is_active: true });
                        setShowWordModal(true);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm từ mới
                    </button>
                  )}
                </div>
              </div>

              {!selectedTopicId ? (
                <div className="text-center py-12 text-gray-500 text-xs font-bold">Vui lòng chọn một chủ đề trong thanh menu bộ lọc phía trên để xem các từ vựng.</div>
              ) : loadingWords ? (
                <div className="text-center py-10 text-gray-500 animate-pulse font-bold text-xs">Đang tải danh sách từ vựng...</div>
              ) : words.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-white/5">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-white/5 text-gray-400 font-extrabold uppercase tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-3">Từ vựng</th>
                        <th className="p-3">Phiên âm / Cách đọc</th>
                        <th className="p-3">Từ loại</th>
                        <th className="p-3">Định nghĩa</th>
                        <th className="p-3">Ví dụ & Dịch nghĩa</th>
                        <th className="p-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {words.map(w => (
                        <tr key={w.id} className="hover:bg-white/[0.015] transition-colors">
                          <td className="p-3 font-extrabold text-white text-sm">{w.word}</td>
                          <td className="p-3">
                            <span className="text-indigo-300 font-mono block">{w.ipa}</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">({w.reading})</span>
                          </td>
                          <td className="p-3 text-amber-300 font-semibold">{w.pos}</td>
                          <td className="p-3 max-w-[200px] truncate" title={w.meaning}>{w.meaning}</td>
                          <td className="p-3 text-[11px] max-w-[300px]">
                            <span className="text-slate-200 block italic">"{w.example}"</span>
                            <span className="text-gray-400 block mt-0.5">({w.example_vi})</span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingWord(w);
                                  setShowWordModal(true);
                                }}
                                className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 transition cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteWord(w.id)}
                                className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 text-xs font-bold">Chủ đề này chưa có từ vựng nào. Hãy nhấn nút "Thêm từ mới" hoặc chuyển sang tab "AI Auto-Composer" để soạn thảo bằng AI!</div>
              )}
            </div>
          )}

          {/* Sub-tab 3: AI Auto-Composer */}
          {contentSubTab === 'ai-gen' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Form Input */}
              <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-5 lg:col-span-2">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="font-extrabold text-lg text-white font-outfit flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" /> AI Auto-Composer
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Soạn thảo học liệu siêu tốc bằng Trí tuệ nhân tạo Gemini</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Từ tiếng Anh cần soạn</label>
                    <input
                      value={aiWordInput}
                      onChange={e => setAiWordInput(e.target.value)}
                      placeholder="Ví dụ: Perseverance, Collaborative..."
                      className="w-full bg-[#070a16] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Trình độ / Khối lớp hướng tới</label>
                    <select
                      value={aiGradeInput}
                      onChange={e => setAiGradeInput(e.target.value)}
                      className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3 py-3 text-xs text-gray-300 outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="6">Lớp 6 (A1)</option>
                      <option value="7">Lớp 7 (A1)</option>
                      <option value="8">Lớp 8 (A2)</option>
                      <option value="9">Lớp 9 (A2)</option>
                      <option value="10">Lớp 10 (B1)</option>
                      <option value="11">Lớp 11 (B1)</option>
                      <option value="12">Lớp 12 (B2)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleAIGenerateWord}
                    disabled={aiLoading || !aiWordInput.trim()}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-xl transition disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {aiLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>AI Đang biên soạn dữ liệu...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Biên soạn nhanh bằng AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI result preview */}
              <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 lg:col-span-3 min-h-[300px] flex flex-col justify-between bg-slate-950/40">
                <div>
                  <h4 className="font-extrabold text-sm text-gray-300 uppercase tracking-wider border-b border-white/10 pb-3">Kết quả soạn thảo từ AI</h4>
                  {aiLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
                      <Sparkles className="w-10 h-10 text-indigo-400 animate-spin" />
                      <span className="text-xs font-bold text-center leading-relaxed">Mô hình Gemini 1.5 Flash đang sinh thông tin phiên âm chuẩn, định nghĩa, ví dụ tiếng Anh tương ứng độ tuổi...</span>
                    </div>
                  ) : aiResult ? (
                    <div className="space-y-4 pt-3 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-gray-500 font-extrabold uppercase">Từ gốc</span>
                          <p className="text-xl font-extrabold text-white mt-0.5">{aiWordInput}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 font-extrabold uppercase">Từ loại (POS)</span>
                          <p className="text-sm font-bold text-amber-300 mt-0.5">{aiResult.pos}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-gray-500 font-extrabold uppercase">Phiên âm IPA</span>
                          <p className="text-sm font-mono text-indigo-300 mt-0.5">{aiResult.ipa}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 font-extrabold uppercase">Gợi ý phát âm Việt</span>
                          <p className="text-sm font-bold text-gray-300 mt-0.5">{aiResult.reading}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-500 font-extrabold uppercase">Nghĩa tiếng Việt</span>
                        <p className="text-sm text-slate-100 mt-0.5 font-semibold">{aiResult.meaning}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-[10px] text-gray-500 font-extrabold uppercase">Câu ví dụ thực tế (phù hợp Lớp {aiGradeInput})</span>
                        <p className="text-sm text-slate-200 mt-1 italic leading-relaxed">"{aiResult.example}"</p>
                        <p className="text-xs text-gray-400 mt-1">({aiResult.example_vi})</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                      <span className="text-xs font-bold">Chưa có dữ liệu biên soạn. Hãy nhập từ tiếng Anh và nhấn biên soạn.</span>
                    </div>
                  )}
                </div>

                {aiResult && (
                  <div className="border-t border-white/10 pt-4 mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-bold whitespace-nowrap">Lưu vào Chủ đề:</span>
                      <select
                        value={aiTargetTopicId}
                        onChange={(e) => setAiTargetTopicId(e.target.value)}
                        className="bg-[#070a16] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 outline-none focus:border-indigo-500 cursor-pointer min-w-[200px]"
                      >
                        <option value="">— Chọn chủ đề nhận từ —</option>
                        {topics.map(t => (
                          <option key={t.id} value={t.id}>[{t.grade}] {t.title}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleSaveAIGeneratedWord}
                      disabled={!aiTargetTopicId}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 disabled:opacity-30 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Lưu từ vựng vào CSDL
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sub-tab 4: IPA Sounds */}
          {contentSubTab === 'ipa' && (
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-extrabold text-lg text-white font-outfit">Bảng âm IPA tiếng Anh</h3>
                  <p className="text-xs text-gray-400">Thiết lập các âm cơ bản để phục vụ bài học phát âm quốc tế</p>
                </div>
                <button
                  onClick={() => {
                    setEditingIpa({ symbol: '', name: '', sound_type: 'vowel', example_word: '', example_phonetic: '', mouth_guide: '', is_active: true });
                    setShowIpaModal(true);
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl text-xs font-extrabold shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm âm IPA mới
                </button>
              </div>

              {loadingIpa ? (
                <div className="text-center py-10 text-gray-500 animate-pulse font-bold text-xs">Đang tải bảng âm IPA...</div>
              ) : ipaSounds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {ipaSounds.map(s => (
                    <div key={s.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-all flex justify-between items-start gap-4">
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl font-black text-indigo-400 font-mono">{s.symbol}</span>
                          <span className="text-xs font-extrabold text-white">({s.name})</span>
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${s.sound_type === 'vowel' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'}`}>
                            {s.sound_type === 'vowel' ? 'Nguyên âm' : 'Phụ âm'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed mt-1">
                          <strong>Hướng dẫn:</strong> {s.mouth_guide || 'Chưa có hướng dẫn khẩu hình.'}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">
                          <strong>Ví dụ:</strong> <span className="text-emerald-400 font-bold">{s.example_word}</span> {s.example_phonetic}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setEditingIpa(s);
                            setShowIpaModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition cursor-pointer"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteIpa(s.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                          title="Xóa âm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 text-xs font-bold">Bảng âm IPA rỗng. Nhấp "Thêm âm IPA mới" để tạo.</div>
              )}
            </div>
          )}

          {/* Sub-tab 5: Sentences */}
          {contentSubTab === 'sentences' && (
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-extrabold text-lg text-white font-outfit">Câu luyện phát âm động</h3>
                  <p className="text-xs text-gray-400">Danh sách các câu mẫu để học sinh chấm điểm phát âm bằng AI, có kèm tham số khó IRT</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={sentenceGradeFilter}
                    onChange={(e) => setSentenceGradeFilter(e.target.value)}
                    className="bg-[#070a16] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 outline-none focus:border-indigo-500 cursor-pointer min-w-[150px]"
                  >
                    <option value="">— Tất cả khối lớp —</option>
                    <option value="6">Lớp 6</option>
                    <option value="7">Lớp 7</option>
                    <option value="8">Lớp 8</option>
                    <option value="9">Lớp 9</option>
                    <option value="10">Lớp 10</option>
                    <option value="11">Lớp 11</option>
                    <option value="12">Lớp 12</option>
                    <option value="A1">Trình độ A1</option>
                    <option value="A2">Trình độ A2</option>
                    <option value="B1">Trình độ B1</option>
                  </select>
                  <button
                    onClick={() => {
                      setEditingSentence({ text: '', level_grade: sentenceGradeFilter || '10', difficulty: 0.0, is_active: true });
                      setShowSentenceModal(true);
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl text-xs font-extrabold shadow-lg transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm câu mới
                  </button>
                </div>
              </div>

              {loadingSentences ? (
                <div className="text-center py-10 text-gray-500 animate-pulse font-bold text-xs">Đang tải danh sách câu phát âm...</div>
              ) : sentences.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-white/5">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-white/5 text-gray-400 font-extrabold uppercase tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-3">Câu luyện tập phát âm</th>
                        <th className="p-3 text-center">Khối lớp</th>
                        <th className="p-3 text-center">Tham số khó IRT</th>
                        <th className="p-3 text-center">Trạng thái</th>
                        <th className="p-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sentences.map(s => (
                        <tr key={s.id} className="hover:bg-white/[0.015] transition-colors">
                          <td className="p-3 text-white font-bold text-sm leading-relaxed">{s.text}</td>
                          <td className="p-3 text-center">
                            <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/20 text-[10px]">Lớp {s.level_grade}</span>
                          </td>
                          <td className="p-3 text-center font-mono font-black text-amber-400 text-sm">{s.difficulty >= 0 ? `+${s.difficulty.toFixed(1)}` : s.difficulty.toFixed(1)}</td>
                          <td className="p-3 text-center">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${s.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                              {s.is_active ? 'Hiển thị' : 'Ẩn'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingSentence(s);
                                  setShowSentenceModal(true);
                                }}
                                className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 transition cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteSentence(s.id)}
                                className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 text-xs font-bold">Chưa có câu luyện phát âm nào phù hợp với bộ lọc.</div>
              )}
            </div>
          )}
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
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300">
                <strong className="block mb-2 text-white font-bold text-xs flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Các trường dữ liệu chuẩn hóa:
                </strong>
                <div className="flex flex-wrap gap-1.5">
                  {['student_id', 'fullname', 'grade', 'experiment_group', 'repetition_engine', 'question_id', 'skill', 'correct', 'theta_before', 'theta_after', 'timestamp_iso'].map(col => (
                    <span key={col} className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 font-mono text-[11px] text-emerald-300 font-semibold">
                      {col}
                    </span>
                  ))}
                </div>
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
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-300">
                <strong className="block mb-2 text-white font-bold text-xs flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" /> Hướng dẫn nhập dữ liệu SPSS:
                </strong>
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-200 font-bold">File</span>
                  <span className="text-slate-500">→</span>
                  <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-200 font-bold">Import Data</span>
                  <span className="text-slate-500">→</span>
                  <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-200 font-bold">CSV Data</span>
                  <span className="text-slate-400 font-medium ml-1">· Encoding: <strong className="text-white">UTF-8</strong> · Separator: <strong className="text-white">Comma</strong></span>
                </div>
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
          <div className="p-5 rounded-2xl bg-amber-950/25 border border-amber-500/30 flex gap-3 shadow-lg">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-200 leading-relaxed space-y-1.5">
              <p>
                <strong className="text-amber-300 font-bold">Lưu ý nghiên cứu khoa học:</strong> Dữ liệu xuất phản ánh chính xác 100% nhật ký thực nghiệm từ hệ thống. Thông tin họ tên và khối lớp được đồng bộ tự động từ cơ sở dữ liệu học sinh.
              </p>
              <p>
                Biến phân nhóm <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-amber-200 text-[11px] font-bold">experiment_group</span> nhận 2 giá trị chính thức: <span className="px-2 py-0.5 rounded bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 font-bold text-[11px]">ADAPTIVE</span> (Nhóm thực nghiệm dùng AI thích ứng) hoặc <span className="px-2 py-0.5 rounded bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-[11px]">CONTROL</span> (Nhóm đối chứng). Dùng biến này làm nhân tố độc lập trong phân tích Independent Samples T-Test và ANOVA.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 4: API KEYS & SYSTEM
      ══════════════════════════════════════════════════════════════ */}
      {adminTab === 'system' && (
        <div className="space-y-6 animate-fade-in">
          {/* ── HEADER BANNER ── */}
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-gradient-to-br from-[#0c1228] via-[#080d1e] to-[#050814]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 p-0.5 shadow-lg shadow-indigo-500/20 shrink-0">
                <div className="w-full h-full bg-[#080d1e] rounded-[14px] flex items-center justify-center text-indigo-400">
                  <Brain className="w-7 h-7 animate-pulse text-indigo-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-extrabold text-2xl text-white font-outfit">Trung Tâm Quản Trị Siêu Trí Tuệ AI</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Frontier AI Hub • 7 Providers
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
                  Tích hợp &amp; điều phối toàn diện các mô hình AI mạnh nhất thế giới: <strong>OpenAI (GPT-4o/o1)</strong>, <strong>Claude 3.7 Sonnet</strong>, <strong>DeepSeek R1</strong>, <strong>Google Gemini 2.0</strong>, <strong>Groq LPU</strong> &amp; <strong>OpenRouter 200+ Models</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={handleSaveAllAiConfig}
                disabled={isSavingAi}
                className="w-full md:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {isSavingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSavingAi ? 'Đang lưu...' : 'Lưu toàn bộ cấu hình AI'}</span>
              </button>
            </div>
          </div>

          {/* ── SAVE STATUS ALERT BANNER ── */}
          {saveAiStatus && (
            <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold animate-fade-in ${
              saveAiStatus.type === 'success' 
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 shadow-lg shadow-emerald-500/10' 
                : 'bg-rose-500/15 border-rose-500/30 text-rose-300 shadow-lg shadow-rose-500/10'
            }`}>
              {saveAiStatus.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" /> : <XCircle className="w-5 h-5 shrink-0 text-rose-400" />}
              <span>{saveAiStatus.message}</span>
            </div>
          )}

          {/* ── BỘ NÃO SUY LUẬN MẶC ĐỊNH (DEFAULT AI BRAIN SELECTOR) ── */}
          <div className="glass-card rounded-3xl p-6 md:p-7 border border-white/10 space-y-4 bg-slate-950/40">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-indigo-400" />
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                  Bộ Não AI Suy Luận Ưu Tiên Toàn Hệ Thống (Default AI Brain Engine)
                </h3>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">
                Áp dụng cho Socrates AI Chat, Giải đề qua ảnh, Luyện viết câu &amp; Chấm luận
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: 'auto', label: '⚡ Tự Động Thông Minh', sub: 'Tự chọn model mạnh nhất có sẵn (R1 → GPT-4o → Claude → Gemini)', color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300' },
                { id: 'reasoning', label: '🧠 DeepSeek R1 Reasoning', sub: 'Tư duy logic sâu, bóc tách cạm bẫy câu hỏi phân hóa điểm 9+', color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' },
                { id: 'openai', label: '👑 OpenAI GPT-4o / o1', sub: 'Tiêu chuẩn vàng toàn cầu, độ chính xác ngữ pháp và đọc hiểu đỉnh cao', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
                { id: 'claude', label: '💎 Claude 3.7 Sonnet', sub: 'Văn phong bản xứ xuất sắc, viết luận và chấm bài 4 tiêu chí chuẩn IELTS', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
                { id: 'openrouter', label: '🌐 OpenRouter Multi-Model', sub: 'Cổng đa mô hình mở rộng, linh hoạt kết nối 200+ AI quốc tế', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
                { id: 'gemini', label: '✨ Google Gemini 2.0 Flash', sub: 'Đa phương thức thị giác cực mạnh, giải đề từ ảnh chụp, ngữ cảnh 2M tokens', color: 'border-blue-500/40 bg-blue-500/10 text-blue-300' },
                { id: 'groq', label: '🚀 Groq LPU Siêu Tốc (500 w/s)', sub: 'Tốc độ phản xạ tức thì (<0.2s) kèm nhận diện âm thanh giọng nói Whisper', color: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300' },
              ].map((engine) => (
                <button
                  key={engine.id}
                  type="button"
                  onClick={() => setDefaultBrain(engine.id)}
                  className={`p-4 rounded-2xl border text-left transition duration-200 cursor-pointer flex flex-col justify-between gap-2 relative ${
                    defaultBrain === engine.id
                      ? `${engine.color} shadow-lg ring-1 ring-white/20`
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-white">{engine.label}</span>
                    {defaultBrain === engine.id && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed text-gray-400">{engine.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* ── BẢNG HƯỚNG DẪN: TOP AI CHUYÊN TIẾNG ANH ĐÚNG MẠNH & 1-CHẠM GOOGLE ── */}
          <div className="glass-card rounded-3xl p-5 md:p-6 border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-950 to-indigo-950/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm uppercase tracking-wider">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>Gợi ý: Bộ 3 Siêu AI Tiếng Anh Cực Mạnh — Đăng Ký 1-Chạm Google — Miễn Phí 100%</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Bạn <strong>hoàn toàn không cần phải vất vả đăng ký thẻ Visa quốc tế hay tài khoản Azure phức tạp</strong>. Dưới đây là 3 AI chuyên sâu tiếng Anh tốt nhất, đăng ký chỉ mất 10 giây qua Google:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="font-extrabold text-white flex items-center gap-1.5 text-xs">
                  <Zap className="w-4 h-4 text-blue-400" /> Google Gemini 2.0 / 2.5
                </span>
                <p className="text-[11px] text-gray-400">
                  <strong className="text-emerald-400">Miễn phí 100% vĩnh viễn</strong>. Đăng ký bằng Gmail trong 5 giây. Vô địch về giải bài, đọc ảnh chụp đề thi THPT, phân tích ngữ pháp &amp; bài đọc hiểu.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="font-extrabold text-white flex items-center gap-1.5 text-xs">
                  <Cpu className="w-4 h-4 text-yellow-400" /> Groq Cloud Whisper
                </span>
                <p className="text-[11px] text-gray-400">
                  <strong className="text-emerald-400">Miễn phí 100% vĩnh viễn</strong>. Đăng nhập 1-chạm Google. Nhận diện giọng đọc tiếng Anh siêu nhạy, tốc độ phản xạ 500 từ/giây.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="font-extrabold text-white flex items-center gap-1.5 text-xs">
                  <Globe className="w-4 h-4 text-purple-400" /> OpenRouter (Claude 3.7)
                </span>
                <p className="text-[11px] text-gray-400">
                  Đăng nhập 1-chạm Google. Mở khóa <strong>Claude 3.7 Sonnet</strong> (vua viết luận tiếng Anh thế giới). Có sẵn model miễn phí, hoặc nạp tiền cực dễ không bị chặn thẻ.
                </p>
              </div>
            </div>
          </div>

          {/* ── GRID 7 NHÀ CUNG CẤP AI (AI PROVIDERS CARDS) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[
              {
                id: 'gemini',
                name: 'Google Gemini AI',
                models: 'Gemini 2.0 Flash • Gemini 2.5 • Flash Latest',
                badge: '🌟 VUA GIẢI ĐỀ & NGỮ PHÁP • MIỄN PHÍ 100%',
                badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
                description: 'Đăng ký 1-chạm bằng Google (không cần thẻ). Vô địch về nhận diện ảnh chụp đề thi THPT, phân tích đề viết tay, giải thích ngữ pháp và sinh bài đọc thích ứng IRT.',
                placeholder: 'AIzaSy... hoặc AQ.Ab8...',
                docUrl: 'https://aistudio.google.com/app/apikey',
                docLabel: 'Google AI Studio (Miễn phí 100%)'
              },
              {
                id: 'groq',
                name: 'Groq Cloud LPU & Whisper',
                models: 'Llama 3.3 70B • Whisper Large v3 Turbo',
                badge: '⚡ NHẬN DIỆN GIỌNG NÓI & PHẢN XẠ 500 W/S',
                badgeColor: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
                description: 'Đăng ký 1-chạm bằng Google (không cần thẻ). Nhận diện phát âm tiếng Anh siêu chuẩn và tốc độ sinh văn bản tức thì (<0.2s) phục vụ đàm thoại giao tiếp.',
                placeholder: 'gsk_...',
                docUrl: 'https://console.groq.com/keys',
                docLabel: 'Groq Console (Miễn phí 100%)'
              },
              {
                id: 'openrouter',
                name: 'OpenRouter AI Hub',
                models: 'Claude 3.7 Sonnet • GPT-4o • DeepSeek R1 (200+ AI)',
                badge: '🌐 MỞ KHÓA CLAUDE 3.7 & DỄ NẠP TIỀN',
                badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
                description: 'Đăng ký 1-chạm bằng Google. Gọi được Claude 3.7 Sonnet (vua viết luận tiếng Anh thế giới) và hàng trăm AI khác. Hỗ trợ nạp tiền cực dễ hoặc dùng model free.',
                placeholder: 'sk-or-v1-...',
                docUrl: 'https://openrouter.ai/keys',
                docLabel: 'OpenRouter Console'
              },
              {
                id: 'azure',
                name: 'Microsoft Jenny & Gemini Audio',
                models: 'Microsoft Jenny/Guy Neural Voice • Gemini Audio IPA',
                badge: '🎉 TÍCH HỢP SẴN • 100% MIỄN PHÍ KHÔNG CẦN THẺ',
                badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
                description: 'Thay thế hoàn toàn Azure! Hệ thống đã tích hợp sẵn công nghệ giọng đọc bản ngữ Microsoft Jenny/Guy Neural và chấm điểm phát âm IPA bằng Gemini Multimodal. Hoàn toàn miễn phí, không cần đăng ký tài khoản Azure hay thẻ tín dụng rườm rà.',
                placeholder: 'Đã tích hợp sẵn tự động (Hoặc nhập Azure Key riêng nếu muốn)',
                docUrl: 'https://portal.azure.com/',
                docLabel: 'Azure Portal (Không bắt buộc)',
                isBuiltIn: true
              },
              {
                id: 'claude',
                name: 'Anthropic Claude',
                models: 'Claude 3.7 Sonnet • Claude 3.5 Sonnet / Haiku',
                badge: '💎 BẬC THẦY VIẾT LUẬN & NGÔN NGỮ',
                badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
                description: 'Mô hình AI viết văn bản tiếng Anh tự nhiên nhất thế giới, phân tích cấu trúc bài luận 4 tiêu chí và diễn đạt bản xứ không đối thủ.',
                placeholder: 'sk-ant-api03-...',
                docUrl: 'https://console.anthropic.com/settings/keys',
                docLabel: 'Anthropic Console'
              },
              {
                id: 'openai',
                name: 'OpenAI (ChatGPT)',
                models: 'GPT-4o • o1 • o3-mini • GPT-4 Turbo',
                badge: '👑 MÔ HÌNH TOÀN NĂNG HÀNG ĐẦU',
                badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
                description: 'Tiêu chuẩn vàng của trí tuệ nhân tạo toàn cầu. Giải quyết đề thi THPT, tư duy logic câu khó và đọc hiểu học thuật cực kỳ chuẩn xác.',
                placeholder: 'sk-proj-... hoặc sk-...',
                docUrl: 'https://platform.openai.com/api-keys',
                docLabel: 'OpenAI Platform'
              },
              {
                id: 'deepseek',
                name: 'DeepSeek AI',
                models: 'DeepSeek-R1 (Full Reasoning) • DeepSeek-V3',
                badge: '🧠 SIÊU TƯ DUY SUY LUẬN BẪY ĐỀ THI',
                badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
                description: 'Mô hình tư duy sâu Reasoning R1 ngang ngửa OpenAI o1, bóc tách cặn kẽ mọi cạm bẫy đề thi phân hóa điểm 9+ với chuỗi suy luận từng bước (nạp $1-$2 để dùng).',
                placeholder: 'sk-... (Platform DeepSeek)',
                docUrl: 'https://platform.deepseek.com/api_keys',
                docLabel: 'DeepSeek Platform'
              }
            ].map((prov) => {
              const currentVal = aiKeysForm[prov.id] || '';
              const isBuiltIn = Boolean(prov.isBuiltIn);
              const isConfigured = isBuiltIn || Boolean(currentVal.trim());
              const isVisible = Boolean(aiKeyVisibility[prov.id]);
              const testInfo = testResults[prov.id];
              const isTesting = testingModel === prov.id;

              return (
                <div
                  key={prov.id}
                  className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col justify-between gap-4 bg-[#0a0f24]/70 hover:border-white/20 transition duration-200 shadow-xl"
                >
                  <div className="space-y-3">
                    {/* Header Card */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-base text-white font-outfit">{prov.name}</h4>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${prov.badgeColor}`}>
                            {prov.badge}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-indigo-300 mt-0.5">{prov.models}</p>
                      </div>

                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl whitespace-nowrap ${
                        isConfigured
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {isBuiltIn && !currentVal.trim() ? '✓ TÍCH HỢP SẴN (FREE)' : (isConfigured ? '✓ ĐÃ CẤU HÌNH' : '✗ CHƯA NHẬP')}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed">{prov.description}</p>

                    {/* Input Field */}
                    <div className="space-y-1.5 pt-1">
                      <div className="relative">
                        <input
                          type={isVisible ? 'text' : 'password'}
                          value={currentVal}
                          onChange={(e) => setAiKeysForm({ ...aiKeysForm, [prov.id]: e.target.value })}
                          placeholder={prov.placeholder}
                          className="w-full bg-[#050814] border border-white/10 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder-gray-600 outline-none transition font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => toggleKeyVisibility(prov.id)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 p-1 cursor-pointer"
                          title={isVisible ? 'Ẩn khóa' : 'Hiện khóa'}
                        >
                          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Live Test Feedback Area */}
                    {testInfo && (
                      <div className={`p-3 rounded-xl border text-[11px] font-medium animate-fade-in ${
                        testInfo.status === 'loading'
                          ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
                          : testInfo.status === 'success'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      }`}>
                        {testInfo.status === 'loading' && (
                          <div className="flex items-center gap-2">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                            <span>Đang gửi tín hiệu ping thử kết nối tới {prov.name}...</span>
                          </div>
                        )}
                        {testInfo.status === 'success' && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-bold">
                              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>Kết nối thành công ({testInfo.latency_ms}ms) • Model: {testInfo.model}</span>
                            </div>
                            {testInfo.reply && (
                              <p className="text-[10px] text-emerald-400/80 italic pl-5">
                                Phản hồi: "{testInfo.reply}"
                              </p>
                            )}
                          </div>
                        )}
                        {testInfo.status === 'error' && (
                          <div className="flex items-start gap-1.5">
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <span>{testInfo.message}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Action Footer */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                    <a
                      href={prov.docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
                    >
                      <span>Lấy key tại {prov.docLabel}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleTestAiKey(prov.id)}
                      disabled={isTesting}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                    >
                      {isTesting ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
                          <span>Đang test...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>Test kết nối</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── HỘP HƯỚNG DẪN KHOA HỌC & KIẾN TRÚC KHKT ── */}
          <div className="glass-card rounded-3xl p-6 md:p-7 border border-indigo-500/20 bg-gradient-to-br from-indigo-950/30 to-purple-950/20 text-xs text-gray-300 leading-relaxed space-y-3 shadow-2xl">
            <div className="flex items-center gap-2 text-indigo-400 font-extrabold uppercase text-xs tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ý nghĩa Khoa học &amp; Kiến trúc Đa Mô Hình (Ensemble Multi-LLM) đối với Đề tài KHKT</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <div className="space-y-1.5">
                <h5 className="font-bold text-white text-xs">1. Phục vụ Nghiên cứu Thực nghiệm So sánh Mô hình</h5>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Nhà nghiên cứu có thể phân tích đối chứng năng lực nhận thức của học sinh khi học với mô hình <strong>Reasoning chuyên sâu (DeepSeek R1 / o1)</strong> so với mô hình sinh ngữ chuẩn (GPT-4o / Claude) và mô hình đa phương thức (Gemini).
                </p>
              </div>

              <div className="space-y-1.5">
                <h5 className="font-bold text-white text-xs">2. Kiến trúc Độ Sẵn Sàng Cao (High Availability &amp; Fallback)</h5>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Nếu một nhà cung cấp API bị nghẽn ngạch hoặc hết hạn ngạch, bộ điều phối <strong>Examora Smart Fallback</strong> sẽ tự động chuyển hướng truy vấn sang mô hình kế tiếp mà không làm gián đoạn trải nghiệm học tập của học sinh.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between flex-wrap gap-2 text-[11px] text-gray-400">
              <span>Khóa API được mã hóa lưu trữ kép: Trình duyệt máy khách (localStorage) &amp; Môi trường độc lập máy chủ VPS (.env).</span>
              <span className="text-indigo-300 font-bold">Examora AI • THPT AI &amp; Luyện Thi ĐGNL 2027</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Topic Modal ── */}
      {showTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass rounded-3xl p-6 border border-white/10 max-w-md w-full shadow-2xl mx-4 space-y-4">
            <h3 className="font-extrabold text-lg text-white font-outfit">{editingTopic.id ? 'Chỉnh sửa chủ đề' : 'Thêm chủ đề mới'}</h3>
            <form onSubmit={handleSaveTopic} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">Tiêu đề chủ đề</label>
                <input
                  value={editingTopic.title}
                  onChange={e => setEditingTopic({ ...editingTopic, title: e.target.value })}
                  required
                  className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">Đường dẫn tĩnh (Slug)</label>
                <input
                  value={editingTopic.slug}
                  placeholder="Mặc định tự tạo từ tiêu đề"
                  onChange={e => setEditingTopic({ ...editingTopic, slug: e.target.value })}
                  className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">Khối lớp áp dụng</label>
                <select
                  value={editingTopic.grade}
                  onChange={e => setEditingTopic({ ...editingTopic, grade: e.target.value })}
                  className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-gray-300 outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="6">Lớp 6</option>
                  <option value="7">Lớp 7</option>
                  <option value="8">Lớp 8</option>
                  <option value="9">Lớp 9</option>
                  <option value="10">Lớp 10</option>
                  <option value="11">Lớp 11</option>
                  <option value="12">Lớp 12</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">Mô tả chủ đề</label>
                <textarea
                  value={editingTopic.description}
                  onChange={e => setEditingTopic({ ...editingTopic, description: e.target.value })}
                  rows="2"
                  className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="topic-active"
                  checked={editingTopic.is_active}
                  onChange={e => setEditingTopic({ ...editingTopic, is_active: e.target.checked })}
                  className="rounded border-white/10 bg-[#070a16] text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4"
                />
                <label htmlFor="topic-active" className="text-gray-300 font-bold cursor-pointer">Kích hoạt hiển thị cho học sinh</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowTopicModal(false)} className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white font-bold transition">Hủy</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold transition">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Word Modal ── */}
      {showWordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass rounded-3xl p-6 border border-white/10 max-w-lg w-full shadow-2xl mx-4 space-y-4">
            <h3 className="font-extrabold text-lg text-white font-outfit">{editingWord.id ? 'Chỉnh sửa từ vựng' : 'Thêm từ vựng mới'}</h3>
            <form onSubmit={handleSaveWord} className="space-y-4 text-xs grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-gray-400 font-bold block">Từ vựng (tiếng Anh)</label>
                <input
                  value={editingWord.word}
                  onChange={e => setEditingWord({ ...editingWord, word: e.target.value })}
                  required
                  className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">Phiên âm IPA</label>
                <input
                  value={editingWord.ipa}
                  placeholder="/.../"
                  onChange={e => setEditingWord({ ...editingWord, ipa: e.target.value })}
                  className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">Gợi ý cách đọc tiếng Việt</label>
                <input
                  value={editingWord.reading}
                  placeholder="Ví dụ: CẤT-stầm"
                  onChange={e => setEditingWord({ ...editingWord, reading: e.target.value })}
                  className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">Từ loại (POS)</label>
                <input
                  value={editingWord.pos}
                  placeholder="Danh từ (n.), Động từ (v.)..."
                  onChange={e => setEditingWord({ ...editingWord, pos: e.target.value })}
                  className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">Định nghĩa tiếng Việt</label>
                <input
                  value={editingWord.meaning}
                  required
                  onChange={e => setEditingWord({ ...editingWord, meaning: e.target.value })}
                  className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-gray-400 font-bold block">Câu ví dụ (English)</label>
                <input
                  value={editingWord.example}
                  onChange={e => setEditingWord({ ...editingWord, example: e.target.value })}
                  className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-gray-400 font-bold block">Dịch câu ví dụ (Vietnamese)</label>
                <input
                  value={editingWord.example_vi}
                  onChange={e => setEditingWord({ ...editingWord, example_vi: e.target.value })}
                  className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center gap-2 py-1 sm:col-span-2">
                <input
                  type="checkbox"
                  id="word-active"
                  checked={editingWord.is_active}
                  onChange={e => setEditingWord({ ...editingWord, is_active: e.target.checked })}
                  className="rounded border-white/10 bg-[#070a16] text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4"
                />
                <label htmlFor="word-active" className="text-gray-300 font-bold cursor-pointer">Kích hoạt từ vựng</label>
              </div>
              <div className="flex gap-3 pt-2 sm:col-span-2">
                <button type="button" onClick={() => setShowWordModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white font-bold transition">Hủy</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold transition">Lưu từ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit IPA Sound Modal ── */}
      {showIpaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass rounded-3xl p-6 border border-white/10 max-w-md w-full shadow-2xl mx-4 space-y-4">
            <h3 className="font-extrabold text-lg text-white font-outfit">{editingIpa.id ? 'Cập nhật âm IPA' : 'Thêm âm IPA mới'}</h3>
            <form onSubmit={handleSaveIpa} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-400 font-bold block">Kí hiệu âm IPA</label>
                  <input
                    value={editingIpa.symbol}
                    placeholder="Ví dụ: /iː/"
                    required
                    onChange={e => setEditingIpa({ ...editingIpa, symbol: e.target.value })}
                    className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-bold block">Tên âm</label>
                  <input
                    value={editingIpa.name}
                    placeholder="Ví dụ: i dài"
                    required
                    onChange={e => setEditingIpa({ ...editingIpa, name: e.target.value })}
                    className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">Loại âm</label>
                <select
                  value={editingIpa.sound_type}
                  onChange={e => setEditingIpa({ ...editingIpa, sound_type: e.target.value })}
                  className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-gray-300 outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="vowel">Nguyên âm (Vowel)</option>
                  <option value="consonant">Phụ âm (Consonant)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-400 font-bold block">Từ ví dụ</label>
                  <input
                    value={editingIpa.example_word}
                    placeholder="sheep"
                    onChange={e => setEditingIpa({ ...editingIpa, example_word: e.target.value })}
                    className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-bold block">Phiên âm ví dụ</label>
                  <input
                    value={editingIpa.example_phonetic}
                    placeholder="/ʃiːp/"
                    onChange={e => setEditingIpa({ ...editingIpa, example_phonetic: e.target.value })}
                    className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">Hướng dẫn khẩu hình miệng</label>
                <textarea
                  value={editingIpa.mouth_guide}
                  onChange={e => setEditingIpa({ ...editingIpa, mouth_guide: e.target.value })}
                  rows="3"
                  className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowIpaModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white font-bold transition">Hủy</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold transition">Lưu âm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Sentence Modal ── */}
      {showSentenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass rounded-3xl p-6 border border-white/10 max-w-md w-full shadow-2xl mx-4 space-y-4">
            <h3 className="font-extrabold text-lg text-white font-outfit">{editingSentence.id ? 'Cập nhật câu phát âm' : 'Thêm câu phát âm mới'}</h3>
            <form onSubmit={handleSaveSentence} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-400 font-bold block">Nội dung câu tiếng Anh</label>
                <textarea
                  value={editingSentence.text}
                  required
                  onChange={e => setEditingSentence({ ...editingSentence, text: e.target.value })}
                  rows="3"
                  className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-400 font-bold block">Khối lớp / Trình độ</label>
                  <select
                    value={editingSentence.level_grade}
                    onChange={e => setEditingSentence({ ...editingSentence, level_grade: e.target.value })}
                    className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-gray-300 outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="6">Lớp 6</option>
                    <option value="7">Lớp 7</option>
                    <option value="8">Lớp 8</option>
                    <option value="9">Lớp 9</option>
                    <option value="10">Lớp 10</option>
                    <option value="11">Lớp 11</option>
                    <option value="12">Lớp 12</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-bold block">Độ khó IRT (b)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingSentence.difficulty}
                    onChange={e => setEditingSentence({ ...editingSentence, difficulty: parseFloat(e.target.value) })}
                    className="w-full bg-[#070a16] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowSentenceModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white font-bold transition">Hủy</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold transition">Lưu câu</button>
              </div>
            </form>
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
