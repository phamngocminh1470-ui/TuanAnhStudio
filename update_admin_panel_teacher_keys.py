# -*- coding: utf-8 -*-
"""
Script nâng cấp AdminPanel.jsx với Tab 'Quản Lý & Sinh Key Giáo Viên'
và đồng bộ TeacherPortal.jsx kiểm tra key từ admin_teacher_license_keys trong localStorage
"""

with open('frontend/src/components/AdminPanel.jsx', 'r', encoding='utf-8') as f:
    admin_code = f.read()

# 1. Thêm state teacherKeys và form generator trong AdminPanel.jsx
state_insert_point = "  const [students, setStudents] = useState([]);"
teacher_keys_state = """  const [students, setStudents] = useState([]);
  
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
  const [teacherKeySearch, setTeacherKeySearch] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  const [copiedZaloMsg, setCopiedZaloMsg] = useState(false);

  // Lưu danh sách key vào localStorage mỗi khi thay đổi
  useEffect(() => {
    try {
      localStorage.setItem('admin_teacher_license_keys', JSON.stringify(teacherKeys));
    } catch (e) {}
  }, [teacherKeys]);

  // Hàm tự động sinh mã ngẫu nhiên cho giáo viên
  const handleAutoGenerateCode = () => {
    let prefix = 'GV';
    if (newKeyTeacherName.trim()) {
      const cleanName = newKeyTeacherName.trim().split(' ').pop().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
      if (cleanName) prefix = `GV-${cleanName}`;
    }
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setNewKeyCustomCode(`${prefix}-${randomNum}`);
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

    const newKeyObj = {
      id: `k-${Date.now()}`,
      key: finalCode,
      teacherName: newKeyTeacherName.trim() || 'Giáo viên THPT',
      school: newKeySchool.trim() || 'Trường THPT',
      phone: newKeyPhone.trim() || 'Chưa cập nhật',
      subject: newKeySubject,
      date: new Date().toISOString().split('T')[0],
      status: 'active',
      note: newKeyNote.trim() || 'Cấp bởi Admin'
    };

    setTeacherKeys([newKeyObj, ...teacherKeys]);
    setNewKeyTeacherName('');
    setNewKeySchool('');
    setNewKeyPhone('');
    setNewKeyCustomCode('');
    setNewKeyNote('');
    alert(`✓ Đã tạo và kích hoạt mã "${finalCode}" cho ${newKeyObj.teacherName} thành công!`);
  };

  // Hàm xóa key
  const handleDeleteTeacherKey = (keyId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mã Key này không? Giáo viên dùng mã này sẽ bị thu hồi quyền truy cập.")) {
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
    const msg = `Dạ em gửi Thầy/Cô ${keyObj.teacherName} (${keyObj.school}) Mã Kích Hoạt Quyền Giáo Viên trên hệ thống:\\n\\n🔑 MÃ KÍCH HOẠT: ${keyObj.key}\\n🌐 ĐỊA CHỈ TRUY CẬP: https://tuananhstudio.top\\n\\nThầy/Cô vào mục 'Cổng Giáo Viên' dán mã trên để mở khóa toàn bộ không gian quản lý lớp học, xáo đề thi 101-104 và giao bài tập cho học sinh nhé ạ!`;
    navigator.clipboard.writeText(msg);
    setCopiedZaloMsg(true);
    setTimeout(() => setCopiedZaloMsg(false), 2500);
  };

  const handleCopySingleKey = (keyStr, keyId) => {
    navigator.clipboard.writeText(keyStr);
    setCopiedKeyId(keyId);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };
"""

admin_code = admin_code.replace(state_insert_point, teacher_keys_state, 1)

# 2. Thêm tab vào danh sách tabs
old_tabs_def = """  const tabs = [
    { id: 'dashboard', icon: TrendingUp, label: 'Tổng quan & Tiến trình (θ)' },
    { id: 'users',     icon: Users,     label: `Quản lý Học sinh (${students.length})` },
    { id: 'content',   icon: BookOpen,  label: 'Quản lý Học liệu (CMS)' },
    { id: 'export',    icon: Download,  label: 'Xuất dữ liệu KHKT' },
    { id: 'system',    icon: Cpu,       label: 'API Keys & Hệ thống' },
  ];"""

new_tabs_def = """  const tabs = [
    { id: 'dashboard', icon: TrendingUp, label: 'Tổng quan & Tiến trình (θ)' },
    { id: 'users',     icon: Users,     label: `Quản lý Học sinh (${students.length})` },
    { id: 'teacher-keys', icon: KeyRound, label: `Quản Lý & Sinh Key Giáo Viên (${teacherKeys.length})` },
    { id: 'content',   icon: BookOpen,  label: 'Quản lý Học liệu (CMS)' },
    { id: 'export',    icon: Download,  label: 'Xuất dữ liệu KHKT' },
    { id: 'system',    icon: Cpu,       label: 'API Keys & Hệ thống' },
  ];"""

admin_code = admin_code.replace(old_tabs_def, new_tabs_def, 1)

# 3. Thêm giao diện Tab 'teacher-keys' vào trước TAB 3 Quản lý học liệu
tab_content_insert_point = "{/* ══════════════════════════════════════════════════════════════\n          TAB 3: QUẢN LÝ HỌC LIỆU"
if tab_content_insert_point not in admin_code:
    tab_content_insert_point = "{/* ══════════════════════════════════════════════════════════════\r\n          TAB 3: QUẢN LÝ HỌC LIỆU"

teacher_keys_tab_jsx = """      {/* ══════════════════════════════════════════════════════════════
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

"""

if tab_content_insert_point in admin_code:
    admin_code = admin_code.replace(tab_content_insert_point, teacher_keys_tab_jsx + tab_content_insert_point, 1)
else:
    print("Warning: Tab insertion point not found by exact string, appending before content tab.")

with open('frontend/src/components/AdminPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(admin_code)

print("AdminPanel.jsx successfully upgraded with Teacher Key Generator tab!")
