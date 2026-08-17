import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck, Users, Key, RefreshCw, Cpu,
  Download, Lock, Unlock, KeyRound, TrendingUp, FileSpreadsheet, Filter,
  Search, RotateCcw, AlertTriangle, Calendar,
  Info, FileText, Zap, Mic, BookOpen, Plus, Trash2, Edit, Sparkles, Check, Globe
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

  useEffect(() => {
    fetchStudents();
    fetchResearchReport();
    fetchThetaTimeline();
    fetchTopics();
    fetchIpaSounds();
    fetchSentences();
  }, [sentenceGradeFilter]);

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
    if (!confirm('Bạn có chắc chắn muốn xóa chủ đề này? Tất cả các từ thuộc chủ đề này cũng sẽ bị xóa.')) return;
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
    if (!confirm('Bạn có chắc chắn muốn xóa từ vựng này?')) return;
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
    if (!confirm('Bạn có chắc chắn muốn xóa âm IPA này?')) return;
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
    if (!confirm('Bạn có chắc chắn muốn xóa câu phát âm này?')) return;
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

  // ── Tab definitions ───────────────────────────────────────────────────────

  const tabs = [
    { id: 'dashboard', icon: TrendingUp, label: 'Tổng quan & Tiến trình (θ)' },
    { id: 'users',     icon: Users,     label: `Quản lý Học sinh (${students.length})` },
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
                              <span className="text-[10px] text-gray-500">Mục tiêu: {u.target_score} điểm</span>
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
              { label: 'Azure Cognitive', sub: 'Speech & Pronunciation', key: keys?.azure, icon: Mic, color: 'purple' },
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
