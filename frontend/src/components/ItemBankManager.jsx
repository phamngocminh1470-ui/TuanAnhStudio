import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Database, Plus, Edit3, Trash2, Search, Filter, Download, Upload,
  CheckCircle2, AlertCircle, XCircle, Eye, BarChart3, ChevronLeft,
  ChevronRight, RefreshCw, FileText, Shield, BookOpen, Zap, Activity,
  Check, X, AlertTriangle, ExternalLink, Save, ChevronDown, List
} from 'lucide-react';
import axios from 'axios';

const API = '/api';

// ─── CONSTANTS ───────────────────────────────────────────────
const SKILLS = ['Tenses','Passive Voice','Relative Clauses','Conditionals','Reported Speech','Vocabulary','Collocations','Pronunciation','Stress'];
const TOPICS = ['Grammar','Vocabulary','Phonology','Reading','Writing','Listening'];
const DIFFICULTY_LEVELS = ['Easy','Medium','Hard'];
const COGNITIVE_LEVELS = ['Remember','Understand','Apply','Analyze','Evaluate','Create'];
const STATUS_OPTS = ['Draft','Reviewed','Approved'];
const CALIBRATION_OPTS = ['CALIBRATED','PROVISIONAL','UNCALIBRATED'];
const QTYPES = ['Multiple Choice','Fill in the blank','True/False','Matching'];
const SOURCE_YEARS = ['2020','2021','2022','2023','2024','2025'];

const STATUS_COLORS = {
  'Approved': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Reviewed': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Draft': 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};
const CALIB_COLORS = {
  'CALIBRATED': 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  'PROVISIONAL': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  'UNCALIBRATED': 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};
const DIFF_COLORS = {
  'Easy': 'text-emerald-400',
  'Medium': 'text-amber-400',
  'Hard': 'text-rose-400',
};

// ─── BADGE COMPONENT ─────────────────────────────────────────
const Badge = ({ label, colorClass }) => (
  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colorClass}`}>{label}</span>
);

// ─── EMPTY FORM ──────────────────────────────────────────────
const emptyForm = () => ({
  question: '', option_a: '', option_b: '', option_c: '', option_d: '',
  correct_answer: 'A', explanation: '', topic: 'Grammar', skill: 'Tenses',
  question_type: 'Multiple Choice', cognitive_level: 'Remember', difficulty_level: 'Medium',
  source: '', source_year: '2023', calibration_status: 'UNCALIBRATED',
  discrimination: '', difficulty_parameter: '', guessing_parameter: '',
  sample_size: 0, status: 'Draft', reviewer: '',
});

export default function ItemBankManager() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // ─── DASHBOARD STATE ─────────────────────────────────────
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // ─── QUESTIONS STATE ─────────────────────────────────────
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loadingItems, setLoadingItems] = useState(false);

  // Filters
  const [searchQ, setSearchQ] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCalib, setFilterCalib] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null = create, object = edit
  const [form, setForm] = useState(emptyForm());
  const [formError, setFormError] = useState('');
  const [formSaving, setFormSaving] = useState(false);

  // Preview
  const [previewItem, setPreviewItem] = useState(null);

  // Selected for bulk actions
  const [selected, setSelected] = useState(new Set());

  // ─── QUALITY CHECK STATE ─────────────────────────────────
  const [qualityData, setQualityData] = useState(null);
  const [loadingQuality, setLoadingQuality] = useState(false);

  // ─── IMPORT STATE ────────────────────────────────────────
  const [importResult, setImportResult] = useState(null);
  const [importing, setImporting] = useState(false);
  const importRef = useRef(null);

  // ─── DATA FETCHING ────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await axios.get(`${API}/items/stats`);
      setStats(res.data);
    } catch (e) { console.error(e); }
    finally { setLoadingStats(false); }
  }, []);

  const fetchItems = useCallback(async () => {
    setLoadingItems(true);
    try {
      const params = { page, page_size: pageSize };
      if (searchQ) params.q = searchQ;
      if (filterSkill) params.skill = filterSkill;
      if (filterTopic) params.topic = filterTopic;
      if (filterDifficulty) params.difficulty_level = filterDifficulty;
      if (filterStatus) params.status = filterStatus;
      if (filterCalib) params.calibration_status = filterCalib;
      const res = await axios.get(`${API}/items`, { params });
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.total_pages || 1);
    } catch (e) { console.error(e); }
    finally { setLoadingItems(false); }
  }, [page, pageSize, searchQ, filterSkill, filterTopic, filterDifficulty, filterStatus, filterCalib]);

  const fetchQuality = useCallback(async () => {
    setLoadingQuality(true);
    try {
      const res = await axios.get(`${API}/items/quality-check`);
      setQualityData(res.data);
    } catch (e) { console.error(e); }
    finally { setLoadingQuality(false); }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { if (activeTab === 'questions') fetchItems(); }, [activeTab, fetchItems]);
  useEffect(() => { if (activeTab === 'quality') fetchQuality(); }, [activeTab, fetchQuality]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [searchQ, filterSkill, filterTopic, filterDifficulty, filterStatus, filterCalib]);

  // ─── FORM HANDLERS ────────────────────────────────────────
  const openCreate = () => {
    setEditingItem(null);
    setForm(emptyForm());
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      question: item.question || '',
      option_a: item.option_a || '',
      option_b: item.option_b || '',
      option_c: item.option_c || '',
      option_d: item.option_d || '',
      correct_answer: item.correct_answer || 'A',
      explanation: item.explanation || '',
      topic: item.topic || 'Grammar',
      skill: item.skill || 'Tenses',
      question_type: item.question_type || 'Multiple Choice',
      cognitive_level: item.cognitive_level || 'Remember',
      difficulty_level: item.difficulty_level || 'Medium',
      source: item.source || '',
      source_year: item.source_year || '2023',
      calibration_status: item.calibration_status || 'UNCALIBRATED',
      discrimination: item.discrimination ?? '',
      difficulty_parameter: item.difficulty_parameter ?? '',
      guessing_parameter: item.guessing_parameter ?? '',
      sample_size: item.sample_size || 0,
      status: item.status || 'Draft',
      reviewer: item.reviewer || '',
    });
    setFormError('');
    setShowForm(true);
  };

  const handleFormChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleFormSave = async (e) => {
    e.preventDefault();
    if (!form.question.trim()) { setFormError('Câu hỏi không được để trống.'); return; }
    if (!form.option_a || !form.option_b || !form.option_c || !form.option_d) { setFormError('Phải điền đủ 4 đáp án A, B, C, D.'); return; }
    setFormSaving(true);
    setFormError('');
    try {
      const payload = {
        ...form,
        discrimination: form.discrimination !== '' ? parseFloat(form.discrimination) : null,
        difficulty_parameter: form.difficulty_parameter !== '' ? parseFloat(form.difficulty_parameter) : null,
        guessing_parameter: form.guessing_parameter !== '' ? parseFloat(form.guessing_parameter) : null,
        sample_size: parseInt(form.sample_size) || 0,
      };
      if (editingItem) {
        await axios.put(`${API}/items/${editingItem.item_id}`, payload);
      } else {
        await axios.post(`${API}/items`, payload);
      }
      setShowForm(false);
      fetchItems();
      fetchStats();
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Lỗi lưu câu hỏi. Vui lòng thử lại.');
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm(`Xóa câu hỏi ${itemId}? Thao tác không thể hoàn tác.`)) return;
    try {
      await axios.delete(`${API}/items/${itemId}`);
      fetchItems();
      fetchStats();
    } catch (e) { alert('Lỗi xóa câu hỏi: ' + (e.response?.data?.detail || e.message)); }
  };

  const handleBulkApprove = async (newStatus) => {
    if (selected.size === 0) return;
    try {
      await axios.post(`${API}/items/bulk/status`, {
        item_ids: Array.from(selected),
        status: newStatus,
        reviewer: 'Giáo viên'
      });
      setSelected(new Set());
      fetchItems();
      fetchStats();
    } catch (e) { alert('Lỗi cập nhật trạng thái.'); }
  };

  // ─── IMPORT HANDLERS ──────────────────────────────────────
  const handleImportFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const endpoint = file.name.endsWith('.xlsx') ? `${API}/items/import-xlsx` : `${API}/items/import-csv`;
      const res = await axios.post(endpoint, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImportResult(res.data);
      if (res.data.status === 'success') { fetchItems(); fetchStats(); }
    } catch (err) {
      setImportResult({ status: 'error', message: err.response?.data?.detail || 'Lỗi upload file.' });
    } finally {
      setImporting(false);
      if (importRef.current) importRef.current.value = '';
    }
  };

  const handleExport = async (format) => {
    const params = {};
    if (filterSkill) params.skill = filterSkill;
    if (filterStatus) params.status = filterStatus;
    const endpoint = format === 'xlsx' ? `${API}/items/export-xlsx` : `${API}/items/export-csv`;
    try {
      const res = await axios.get(endpoint, { params, responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url;
      a.download = `item_bank_${new Date().toISOString().slice(0,10)}.${format}`;
      a.click(); URL.revokeObjectURL(url);
    } catch (e) { alert('Lỗi xuất file: ' + e.message); }
  };

  const handleDownloadTemplate = async () => {
    try {
      const res = await axios.get(`${API}/items/export-template-csv`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url; a.download = 'item_bank_template.csv';
      a.click(); URL.revokeObjectURL(url);
    } catch (e) { alert('Lỗi tải template.'); }
  };

  // ─── SELECT HELPERS ───────────────────────────────────────
  const toggleSelect = (id) => setSelected(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });
  const toggleSelectAll = () => {
    if (selected.size === items.length) setSelected(new Set());
    else setSelected(new Set(items.map(i => i.item_id)));
  };

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div className="w-full space-y-8 pb-20 animate-fade-in">

      {/* Header */}
      <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-white font-outfit">Item Bank Manager</h1>
              <span className="text-[10px] text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-extrabold">KHKT v2.0</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Quản lý ngân hàng câu hỏi ôn thi THPT môn Tiếng Anh — Schema đầy đủ metadata</p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          {stats && (
            <div className="hidden md:flex items-center gap-4 text-center">
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl font-black text-white">{stats.total}</div>
                <div className="text-[10px] text-gray-400 font-bold">Tổng câu hỏi</div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-2xl font-black text-emerald-400">{stats.calibrated_count}</div>
                <div className="text-[10px] text-emerald-500 font-bold">Đã hiệu chuẩn</div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-2xl font-black text-amber-400">{stats.questions_with_issues ?? stats.missing_explanation + stats.missing_source}</div>
                <div className="text-[10px] text-amber-500 font-bold">Cần kiểm tra</div>
              </div>
            </div>
          )}
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition shadow-lg cursor-pointer">
            <Plus className="w-4 h-4" />
            Thêm câu hỏi
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-1">
        {[
          { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
          { id: 'questions', icon: List, label: 'Quản lý câu hỏi' },
          { id: 'import-export', icon: Upload, label: 'Import / Export' },
          { id: 'quality', icon: Shield, label: 'Kiểm tra chất lượng' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: DASHBOARD ── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={fetchStats} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition cursor-pointer">
              <RefreshCw className={`w-3.5 h-3.5 ${loadingStats ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
          </div>

          {loadingStats ? (
            <div className="text-center text-gray-500 animate-pulse py-12">Đang tải thống kê...</div>
          ) : stats ? (
            <>
              {/* Summary KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Tổng câu hỏi', value: stats.total, color: 'text-white', bg: 'bg-indigo-500/10 border-indigo-500/20' },
                  { label: 'Đã duyệt', value: stats.approved_count, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                  { label: 'Đã hiệu chuẩn IRT', value: stats.calibrated_count, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
                  { label: 'Thiếu explanation', value: stats.missing_explanation, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
                ].map((kpi, i) => (
                  <div key={i} className={`glass-card rounded-2xl p-5 border ${kpi.bg} space-y-2`}>
                    <div className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</div>
                    <div className="text-xs text-gray-400 font-bold">{kpi.label}</div>
                  </div>
                ))}
              </div>

              {/* Distribution Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Theo kỹ năng (Skill)', data: stats.by_skill },
                  { title: 'Theo chủ đề (Topic)', data: stats.by_topic },
                  { title: 'Theo độ khó', data: stats.by_difficulty_level },
                  { title: 'Theo trạng thái duyệt', data: stats.by_status },
                  { title: 'Theo hiệu chuẩn IRT', data: stats.by_calibration },
                  { title: 'Theo năm nguồn', data: stats.by_source_year },
                ].map((group, i) => (
                  <div key={i} className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
                    <h4 className="font-extrabold text-sm text-white border-b border-white/10 pb-2">{group.title}</h4>
                    <div className="space-y-2">
                      {Object.entries(group.data || {}).map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between gap-2">
                          <span className="text-xs text-gray-300 truncate">{k}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                style={{ width: `${stats.total > 0 ? (v / stats.total) * 100 : 0}%` }}
                              />
                            </div>
                            <span className="text-xs font-black text-white w-5 text-right">{v}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-12">Không thể tải thống kê.</div>
          )}
        </div>
      )}

      {/* ── TAB: QUESTIONS ── */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {/* Search + Filters */}
          <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                <Search className="w-4 h-4 text-gray-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi, item_id, explanation..."
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none"
                />
              </div>
              <button onClick={() => { setSearchQ(''); setFilterSkill(''); setFilterTopic(''); setFilterDifficulty(''); setFilterStatus(''); setFilterCalib(''); }}
                className="text-xs text-slate-400 hover:text-white transition cursor-pointer px-3 py-2 rounded-xl border border-white/10 hover:bg-white/5">
                Xóa filter
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Kỹ năng', value: filterSkill, setter: setFilterSkill, opts: SKILLS },
                { label: 'Chủ đề', value: filterTopic, setter: setFilterTopic, opts: TOPICS },
                { label: 'Độ khó', value: filterDifficulty, setter: setFilterDifficulty, opts: DIFFICULTY_LEVELS },
                { label: 'Trạng thái', value: filterStatus, setter: setFilterStatus, opts: STATUS_OPTS },
                { label: 'IRT Status', value: filterCalib, setter: setFilterCalib, opts: CALIBRATION_OPTS },
              ].map(f => (
                <select
                  key={f.label}
                  value={f.value}
                  onChange={e => f.setter(e.target.value)}
                  className="bg-white/5 border border-white/10 text-xs text-gray-300 rounded-lg px-3 py-1.5 outline-none cursor-pointer"
                >
                  <option value="">— {f.label} —</option>
                  {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          {selected.size > 0 && (
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-xs">
              <span className="text-indigo-300 font-bold">Đã chọn {selected.size} câu</span>
              {['Reviewed', 'Approved', 'Draft'].map(s => (
                <button key={s} onClick={() => handleBulkApprove(s)}
                  className={`px-3 py-1 rounded-lg font-extrabold cursor-pointer transition ${STATUS_COLORS[s]}`}>
                  → {s}
                </button>
              ))}
              <button onClick={() => setSelected(new Set())} className="ml-auto text-slate-400 hover:text-white cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Total info + pagination top */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{total} câu hỏi{searchQ || filterSkill || filterStatus ? ' (đang lọc)' : ''}</span>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-white">{page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          {loadingItems ? (
            <div className="text-center text-gray-500 animate-pulse py-10">Đang tải...</div>
          ) : items.length === 0 ? (
            <div className="text-center text-gray-500 py-10">Không có câu hỏi nào.</div>
          ) : (
            <div className="space-y-2">
              {/* Select all */}
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500">
                <input type="checkbox"
                  checked={selected.size === items.length && items.length > 0}
                  onChange={toggleSelectAll}
                  className="w-3.5 h-3.5 rounded cursor-pointer" />
                <span>Chọn tất cả trang này</span>
              </div>

              {items.map(item => (
                <div key={item.item_id}
                  className="glass-card rounded-2xl p-4 border border-white/5 hover:border-indigo-500/30 transition group">
                  <div className="flex items-start gap-3">
                    <input type="checkbox"
                      checked={selected.has(item.item_id)}
                      onChange={() => toggleSelect(item.item_id)}
                      className="mt-1 w-3.5 h-3.5 rounded cursor-pointer shrink-0" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black text-indigo-400 font-mono">{item.item_id}</span>
                          <Badge label={item.skill || '?'} colorClass="bg-indigo-500/10 text-indigo-300 border-indigo-500/20" />
                          <Badge label={item.difficulty_level || '?'} colorClass={`bg-white/5 border-white/10 ${DIFF_COLORS[item.difficulty_level] || 'text-gray-400'}`} />
                          <Badge label={item.status || 'Draft'} colorClass={STATUS_COLORS[item.status] || STATUS_COLORS.Draft} />
                          <Badge label={item.calibration_status || '?'} colorClass={CALIB_COLORS[item.calibration_status] || CALIB_COLORS.UNCALIBRATED} />
                        </div>

                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => setPreviewItem(item)}
                            className="p-1.5 rounded-lg hover:bg-indigo-600/20 text-indigo-400 cursor-pointer" title="Xem trước">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => openEdit(item)}
                            className="p-1.5 rounded-lg hover:bg-amber-600/20 text-amber-400 cursor-pointer" title="Chỉnh sửa">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(item.item_id)}
                            className="p-1.5 rounded-lg hover:bg-rose-600/20 text-rose-400 cursor-pointer" title="Xóa">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-200 mt-2 leading-relaxed line-clamp-2">{item.question}</p>

                      <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-gray-500">
                        <span>📖 {item.topic}</span>
                        <span>🎯 {item.cognitive_level}</span>
                        {item.source && <span>📄 {item.source} {item.source_year || ''}</span>}
                        {item.calibration_status === 'CALIBRATED' && item.difficulty_parameter != null &&
                          <span className="text-indigo-400">IRT b={item.difficulty_parameter}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Bottom */}
          <div className="flex justify-center gap-2 pt-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 cursor-pointer hover:bg-white/10">
              <ChevronLeft className="w-3.5 h-3.5" />Trước
            </button>
            <span className="px-4 py-2 text-xs font-bold text-gray-300">Trang {page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 cursor-pointer hover:bg-white/10">
              Sau<ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── TAB: IMPORT / EXPORT ── */}
      {activeTab === 'import-export' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Import */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                <Upload className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-white">Import câu hỏi</h3>
                <p className="text-xs text-gray-500">Hỗ trợ CSV và Excel (.xlsx)</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-1.5">
              <p className="text-xs font-bold text-indigo-300">Hướng dẫn import:</p>
              <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
                <li>Tải file template CSV mẫu bên dưới</li>
                <li>Điền câu hỏi vào file (không xóa dòng header)</li>
                <li>Các trường bắt buộc: question, option_a/b/c/d, correct_answer, skill, topic</li>
                <li>correct_answer phải là A, B, C hoặc D</li>
                <li>Lưu file và upload lên đây</li>
                <li>Câu mới import luôn có status=Draft và UNCALIBRATED</li>
              </ol>
            </div>

            <button onClick={handleDownloadTemplate}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 text-xs font-extrabold hover:bg-indigo-600/25 transition cursor-pointer">
              <Download className="w-4 h-4" />
              Tải file Template CSV mẫu
            </button>

            <div
              className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-indigo-500/40 transition cursor-pointer"
              onClick={() => importRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-400 font-bold">Click để chọn file CSV hoặc Excel</p>
              <p className="text-xs text-gray-600 mt-1">Hỗ trợ .csv và .xlsx (UTF-8)</p>
              <input ref={importRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={handleImportFile} />
            </div>

            {importing && <div className="text-center text-indigo-400 animate-pulse text-sm font-bold">Đang xử lý import...</div>}

            {importResult && (
              <div className={`p-4 rounded-xl border text-sm space-y-2 ${
                importResult.status === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {importResult.status === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {importResult.message}
                </div>
                {importResult.errors && importResult.errors.length > 0 && (
                  <div className="space-y-1 text-xs max-h-40 overflow-y-auto">
                    {importResult.errors.map((e, i) => (
                      <div key={i} className="p-2 rounded bg-rose-500/10">
                        <span className="font-bold">Dòng {e.row}:</span> {e.errors.join(' • ')}
                      </div>
                    ))}
                  </div>
                )}
                {importResult.imported_ids && (
                  <div className="text-xs text-emerald-400">
                    Đã import: {importResult.imported_ids.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Export */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <Download className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-white">Export câu hỏi</h3>
                <p className="text-xs text-gray-500">Xuất ra CSV hoặc Excel với đầy đủ metadata</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-gray-400 font-bold">Áp dụng filter từ tab Quản lý câu hỏi:</p>
              <div className="flex flex-wrap gap-2">
                {filterSkill && <Badge label={`Skill: ${filterSkill}`} colorClass="bg-indigo-500/15 text-indigo-300 border-indigo-500/30" />}
                {filterStatus && <Badge label={`Status: ${filterStatus}`} colorClass={STATUS_COLORS[filterStatus] || STATUS_COLORS.Draft} />}
                {!filterSkill && !filterStatus && <span className="text-xs text-gray-600">Không có filter — xuất toàn bộ</span>}
              </div>
            </div>

            <div className="space-y-3">
              <button onClick={() => handleExport('csv')}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-extrabold text-sm transition cursor-pointer">
                <FileText className="w-5 h-5 text-emerald-400" />
                Export CSV (UTF-8)
              </button>
              <button onClick={() => handleExport('xlsx')}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-extrabold text-sm transition cursor-pointer">
                <FileText className="w-5 h-5 text-indigo-400" />
                Export Excel (.xlsx) — màu trạng thái
              </button>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <p className="text-xs text-amber-300 font-bold">Lưu ý:</p>
              <p className="text-xs text-gray-400 mt-1">File Excel xuất ra có màu sắc theo trạng thái duyệt (Xanh=Approved, Vàng=Reviewed, Đỏ=Draft). Có thể mở trực tiếp bằng Microsoft Excel hoặc Google Sheets.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: QUALITY CHECK ── */}
      {activeTab === 'quality' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Phát hiện câu hỏi thiếu metadata, chưa duyệt, hoặc trùng lặp.</p>
            <button onClick={fetchQuality} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition cursor-pointer">
              <RefreshCw className={`w-3.5 h-3.5 ${loadingQuality ? 'animate-spin' : ''}`} />
              Kiểm tra lại
            </button>
          </div>

          {loadingQuality ? (
            <div className="text-center animate-pulse text-gray-500 py-10">Đang kiểm tra...</div>
          ) : qualityData ? (
            <>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="glass-card rounded-2xl p-4 border border-white/10 text-center">
                  <div className="text-3xl font-black text-white">{qualityData.total_questions}</div>
                  <div className="text-xs text-gray-400 font-bold mt-1">Tổng câu hỏi</div>
                </div>
                <div className="glass-card rounded-2xl p-4 border border-rose-500/20 text-center">
                  <div className="text-3xl font-black text-rose-400">{qualityData.questions_with_issues}</div>
                  <div className="text-xs text-gray-400 font-bold mt-1">Cần xem xét</div>
                </div>
                <div className="glass-card rounded-2xl p-4 border border-emerald-500/20 text-center">
                  <div className="text-3xl font-black text-emerald-400">{qualityData.clean_questions}</div>
                  <div className="text-xs text-gray-400 font-bold mt-1">Không có lỗi</div>
                </div>
              </div>

              {qualityData.questions_with_issues === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <p className="text-emerald-400 font-extrabold text-lg">Toàn bộ câu hỏi đạt chất lượng!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {qualityData.issues.map(issue => (
                    <div key={issue.item_id} className="glass-card rounded-2xl p-4 border border-rose-500/20 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black text-rose-400 font-mono">{issue.item_id}</span>
                          <Badge label={issue.skill || '?'} colorClass="bg-white/5 text-gray-400 border-white/10" />
                          <Badge label={issue.status || '?'} colorClass={STATUS_COLORS[issue.status] || STATUS_COLORS.Draft} />
                          <Badge label={issue.calibration_status || '?'} colorClass={CALIB_COLORS[issue.calibration_status] || CALIB_COLORS.UNCALIBRATED} />
                        </div>
                        <button
                          onClick={() => {
                            const fullItem = items.find(i => i.item_id === issue.item_id);
                            if (fullItem) { openEdit(fullItem); setActiveTab('questions'); }
                            else { setActiveTab('questions'); setSearchQ(issue.item_id); }
                          }}
                          className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer whitespace-nowrap"
                        >
                          <Edit3 className="w-3 h-3" />Sửa
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 italic line-clamp-1">{issue.question_preview}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {issue.issues.map((iss, j) => (
                          <span key={j} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 font-semibold">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            {iss}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 py-10">Chưa có dữ liệu kiểm tra.</div>
          )}
        </div>
      )}

      {/* ── FORM MODAL (Create / Edit) ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1117] border border-white/10 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleFormSave}>
              <div className="sticky top-0 bg-[#0d1117] border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="font-black text-white text-lg">
                  {editingItem ? `Sửa câu hỏi ${editingItem.item_id}` : 'Thêm câu hỏi mới'}
                </h2>
                <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {formError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {formError}
                  </div>
                )}

                {/* Question text */}
                <div>
                  <label className="text-xs font-extrabold text-gray-400 mb-1 block">Câu hỏi <span className="text-rose-400">*</span></label>
                  <textarea value={form.question} onChange={e => handleFormChange('question', e.target.value)}
                    rows={3} placeholder="Nhập nội dung câu hỏi..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 resize-none" />
                </div>

                {/* Options A-D */}
                <div className="grid grid-cols-2 gap-3">
                  {['a','b','c','d'].map(opt => (
                    <div key={opt}>
                      <label className="text-xs font-extrabold text-gray-400 mb-1 block">
                        Đáp án {opt.toUpperCase()} {opt === 'a' || opt === 'b' ? <span className="text-rose-400">*</span> : ''}
                      </label>
                      <input value={form[`option_${opt}`]} onChange={e => handleFormChange(`option_${opt}`, e.target.value)}
                        placeholder={`Nội dung đáp án ${opt.toUpperCase()}`}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50" />
                    </div>
                  ))}
                </div>

                {/* Correct answer + Explanation */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-extrabold text-gray-400 mb-1 block">Đáp án đúng <span className="text-rose-400">*</span></label>
                    <select value={form.correct_answer} onChange={e => handleFormChange('correct_answer', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none cursor-pointer">
                      {['A','B','C','D'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-gray-400 mb-1 block">Trạng thái duyệt</label>
                    <select value={form.status} onChange={e => handleFormChange('status', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none cursor-pointer">
                      {STATUS_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-400 mb-1 block">Giải thích (Explanation)</label>
                  <textarea value={form.explanation} onChange={e => handleFormChange('explanation', e.target.value)}
                    rows={3} placeholder="Giải thích quy tắc ngữ pháp / từ vựng..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 resize-none" />
                </div>

                {/* Metadata grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'Kỹ năng *', field: 'skill', opts: SKILLS },
                    { label: 'Chủ đề *', field: 'topic', opts: TOPICS },
                    { label: 'Loại câu', field: 'question_type', opts: QTYPES },
                    { label: 'Cấp nhận thức', field: 'cognitive_level', opts: COGNITIVE_LEVELS },
                    { label: 'Độ khó', field: 'difficulty_level', opts: DIFFICULTY_LEVELS },
                    { label: 'Năm nguồn', field: 'source_year', opts: SOURCE_YEARS },
                  ].map(({ label, field, opts }) => (
                    <div key={field}>
                      <label className="text-xs font-extrabold text-gray-400 mb-1 block">{label}</label>
                      <select value={form[field]} onChange={e => handleFormChange(field, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none cursor-pointer">
                        {opts.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-extrabold text-gray-400 mb-1 block">Nguồn (Source)</label>
                    <input value={form.source} onChange={e => handleFormChange('source', e.target.value)}
                      placeholder="Đề thi tốt nghiệp THPT"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-gray-400 mb-1 block">Người kiểm duyệt</label>
                    <input value={form.reviewer} onChange={e => handleFormChange('reviewer', e.target.value)}
                      placeholder="Tên giáo viên kiểm duyệt"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none" />
                  </div>
                </div>

                {/* IRT Parameters section */}
                <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-extrabold text-indigo-300">Tham số IRT (chỉ điền khi đã hiệu chuẩn)</p>
                    <select value={form.calibration_status} onChange={e => handleFormChange('calibration_status', e.target.value)}
                      className="bg-indigo-900/30 border border-indigo-500/30 rounded-lg px-2 py-1 text-xs text-indigo-300 outline-none cursor-pointer">
                      {CALIBRATION_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  {form.calibration_status !== 'UNCALIBRATED' && (
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Độ phân biệt a', field: 'discrimination', placeholder: '1.0 – 2.0' },
                        { label: 'Độ khó b', field: 'difficulty_parameter', placeholder: '-3.0 – 3.0' },
                        { label: 'Đoán mò c', field: 'guessing_parameter', placeholder: '0.20 – 0.25' },
                      ].map(({ label, field, placeholder }) => (
                        <div key={field}>
                          <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                          <input type="number" step="0.01" value={form[field]} onChange={e => handleFormChange(field, e.target.value)}
                            placeholder={placeholder}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-200 placeholder-gray-600 outline-none" />
                        </div>
                      ))}
                    </div>
                  )}
                  {form.calibration_status === 'UNCALIBRATED' && (
                    <p className="text-[11px] text-gray-500">Câu hỏi mới thêm sẽ được đánh dấu UNCALIBRATED. Tham số IRT sẽ được gán sau khi thu thập đủ dữ liệu phản hồi học sinh.</p>
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 bg-[#0d1117] border-t border-white/10 px-6 py-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition cursor-pointer">
                  Hủy
                </button>
                <button type="submit" disabled={formSaving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-extrabold transition disabled:opacity-50 cursor-pointer shadow-lg">
                  {formSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingItem ? 'Lưu thay đổi' : 'Tạo câu hỏi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PREVIEW MODAL ── */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d1117] border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0d1117] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-indigo-400 font-mono">{previewItem.item_id}</span>
                <Badge label={previewItem.status || 'Draft'} colorClass={STATUS_COLORS[previewItem.status] || STATUS_COLORS.Draft} />
                <Badge label={previewItem.calibration_status} colorClass={CALIB_COLORS[previewItem.calibration_status] || CALIB_COLORS.UNCALIBRATED} />
              </div>
              <button onClick={() => setPreviewItem(null)} className="text-gray-500 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <p className="text-base text-white font-semibold leading-relaxed">{previewItem.question}</p>

              <div className="space-y-2">
                {['a','b','c','d'].map(opt => {
                  const isCorrect = previewItem.correct_answer === opt.toUpperCase();
                  return (
                    <div key={opt} className={`flex items-center gap-3 p-3 rounded-xl border ${
                      isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5'
                    }`}>
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                        isCorrect ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-400'
                      }`}>{opt.toUpperCase()}</span>
                      <span className={`text-sm ${isCorrect ? 'text-emerald-300 font-bold' : 'text-gray-300'}`}>
                        {previewItem[`option_${opt}`]}
                      </span>
                      {isCorrect && <Check className="w-4 h-4 text-emerald-400 ml-auto" />}
                    </div>
                  );
                })}
              </div>

              {previewItem.explanation && (
                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <p className="text-xs font-extrabold text-indigo-300 mb-1">Giải thích:</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{previewItem.explanation}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-2 border-t border-white/5">
                <div><span className="font-bold text-gray-400">Skill:</span> {previewItem.skill}</div>
                <div><span className="font-bold text-gray-400">Topic:</span> {previewItem.topic}</div>
                <div><span className="font-bold text-gray-400">Độ khó:</span> <span className={DIFF_COLORS[previewItem.difficulty_level]}>{previewItem.difficulty_level}</span></div>
                <div><span className="font-bold text-gray-400">Nhận thức:</span> {previewItem.cognitive_level}</div>
                <div><span className="font-bold text-gray-400">Nguồn:</span> {previewItem.source || '—'} {previewItem.source_year || ''}</div>
                <div><span className="font-bold text-gray-400">Người duyệt:</span> {previewItem.reviewer || '—'}</div>
                {previewItem.calibration_status === 'CALIBRATED' && (
                  <>
                    <div><span className="font-bold text-indigo-400">IRT b:</span> {previewItem.difficulty_parameter}</div>
                    <div><span className="font-bold text-indigo-400">IRT a:</span> {previewItem.discrimination}</div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button onClick={() => { openEdit(previewItem); setPreviewItem(null); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600/15 border border-amber-500/30 text-amber-300 text-xs font-extrabold cursor-pointer hover:bg-amber-600/25 transition">
                  <Edit3 className="w-3.5 h-3.5" />Chỉnh sửa
                </button>
                <button onClick={() => setPreviewItem(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs font-bold cursor-pointer">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
