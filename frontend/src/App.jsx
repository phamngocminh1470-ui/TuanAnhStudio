import React, { useState, useEffect } from 'react';
import { useUserProgress } from './hooks/useUserProgress';
import ChatMentor from './components/ChatMentor';
import PronunciationAssessor from './components/PronunciationAssessor';
import AdaptiveDashboard from './components/AdaptiveDashboard';
import IRTTestEngine from './components/IRTTestEngine';
import SM2Flashcards from './components/SM2Flashcards';
import AdaptiveReading from './components/AdaptiveReading';
import AdaptiveListening from './components/AdaptiveListening';
import UserGuide from './components/UserGuide';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import EnglishChess from './components/EnglishChess';
import ExportProgressReportModal from './components/ExportProgressReportModal';
import ItemBankManager from './components/ItemBankManager';
import UserProfileModal from './components/UserProfileModal';

import { 
  Sparkles, MessageSquare, Mic, BookOpen, GraduationCap, LayoutDashboard, ChevronRight, 
  Settings, Key, Save, AlertCircle, CheckCircle, Cpu, Zap, Activity, HelpCircle, 
  User, ShieldCheck, LogOut, LogIn, Clock, Headphones, Printer, Trophy, Database
} from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLevel, setSelectedLevel] = useState('10');
  const [backendStatus, setBackendStatus] = useState('connecting');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Pha 2: User progress sync hook
  const { loadFromServer, syncStatus, serverStats } = useUserProgress();

  const [keys, setKeys] = useState({
    gemini: '',
    groq: '',
    azure: ''
  });
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  // Load Session, JWT token, and System Status
  useEffect(() => {
    // Khôi phục JWT token và set axios header
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }

    // Khôi phục user session
    const savedUser = localStorage.getItem('user_session');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        // Sync khối lớp từ profile user
        if (user.grade) setSelectedLevel(user.grade);
      } catch (e) {}
    }

    // Axios interceptor: tự động xử lý 401 (token hết hạn)
    const interceptor = axios.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401 && localStorage.getItem('auth_token')) {
          // Token hết hạn → logout
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_session');
          delete axios.defaults.headers.common['Authorization'];
          setCurrentUser(null);
          setIsAuthOpen(true);
        }
        return Promise.reject(err);
      }
    );

    const savedGemini = localStorage.getItem('api_gemini') || '';
    const savedGroq = localStorage.getItem('api_groq') || '';
    const savedAzure = localStorage.getItem('api_azure') || '';
    setKeys({ gemini: savedGemini, groq: savedGroq, azure: savedAzure });
    
    const savedLevel = localStorage.getItem('selected_level') || '12';
    setSelectedLevel(savedLevel);

    const checkBackend = async () => {
      try {
        const response = await axios.get(`${API_BASE}/health`);
        if (response.data.status === 'healthy') {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (err) {
        setBackendStatus('offline');
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 10000);
    return () => {
      clearInterval(interval);
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    localStorage.setItem('selected_level', level);
  };

  const handleSaveKeys = (e) => {
    e.preventDefault();
    localStorage.setItem('api_gemini', keys.gemini);
    localStorage.setItem('api_groq', keys.groq);
    localStorage.setItem('api_azure', keys.azure);
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 3000);
  };

  const handleLogout = () => {
    // Pha 2: Chỉ xóa token/session, KHÔNG xóa dữ liệu học (theta, history, mastery)
    // Data học tập vẫn nằm trong localStorage để offline fallback hoạt động
    localStorage.removeItem('user_session');
    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    setIsProfileOpen(false);
  };

  const handleLoginSuccess = async (userData) => {
    setCurrentUser(userData);
    // Sync level từ profile
    if (userData.grade) {
      setSelectedLevel(userData.grade);
      localStorage.setItem('selected_level', userData.grade);
    }
    // Pha 2: Sau khi đăng nhập, tải dữ liệu từ server và merge với localStorage
    // Đây là điểm then chốt của Pha 2 — server wins, offline steps được flush
    try {
      const result = await loadFromServer();
      if (result.success) {
        console.log('[Auth] Đã đồng bộ dữ liệu học tập từ server. Theta:', result.mergedTheta?.toFixed(3));
      }
    } catch (err) {
      console.warn('[Auth] Không thể đồng bộ dữ liệu sau đăng nhập:', err.message);
      // Silent — không block UI
    }
  };

  const gradeLevels = [
    { id: '6', label: 'Lớp 6' },
    { id: '7', label: 'Lớp 7' },
    { id: '8', label: 'Lớp 8' },
    { id: '9', label: 'Lớp 9' },
    { id: '10', label: 'Lớp 10' },
    { id: '11', label: 'Lớp 11' },
    { id: '12', label: 'Lớp 12' },
  ];

  return (
    <div className="flex min-h-screen bg-mesh text-[#f3f4f6] font-sans selection:bg-indigo-500 selection:text-white">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onProfileUpdate={(updatedUser) => setCurrentUser(updatedUser)}
      />

      {/* Sidebar Navigation */}
      <aside className="w-72 glass border-r border-slate-800 flex flex-col justify-between hidden md:flex shrink-0 z-20">
        <div className="p-6 space-y-8">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-normal block">
                AI English Mentor
              </span>
              <span className="text-[10px] text-amber-400 font-extrabold tracking-wider block uppercase">
                Luyện Thi Tốt Nghiệp THPT AI
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              <span>Bảng điều khiển (Tổng quan)</span>
            </button>

            <button
              onClick={() => setActiveTab('irt-test')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'irt-test'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Đánh giá Đọc &amp; Ngữ pháp</span>
            </button>

            <button
              onClick={() => setActiveTab('sm2-flashcards')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'sm2-flashcards'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Học từ vựng thông minh</span>
            </button>

            <button
              onClick={() => setActiveTab('reading')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'reading'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Luyện đọc thích ứng AI</span>
            </button>

            <button
              onClick={() => setActiveTab('listening')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'listening'
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Headphones className="w-4 h-4 text-purple-400" />
              <span>Luyện nghe thích ứng AI</span>
            </button>

            <button
              onClick={() => setActiveTab('chess')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'chess'
                  ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Cờ Vua Tiếng Anh AI</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Hội thoại Gia sư AI</span>
            </button>

            <button
              onClick={() => setActiveTab('pronounce')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'pronounce'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>Chấm điểm phát âm</span>
            </button>

            <button
              onClick={() => setActiveTab('item-bank')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'item-bank'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Database className="w-4 h-4 text-indigo-400" />
              <span>Ngân hàng câu hỏi (Item Bank)</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Hướng dẫn sử dụng</span>
            </button>

            {currentUser && currentUser.role === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('admin-panel')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    activeTab === 'admin-panel'
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Admin Panel</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Cấu hình API Keys</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Backend Status & User Profile */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/40 space-y-3">
          {currentUser ? (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition flex-1 min-w-0"
                  title="Xem hồ sơ cá nhân"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/40 text-indigo-200 flex items-center justify-center font-black text-sm shrink-0">
                    {(currentUser.fullname || currentUser.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">{currentUser.fullname || currentUser.username}</span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase">{currentUser.role} • Lớp {currentUser.grade}</span>
                  </div>
                </button>
                <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-rose-400 transition cursor-pointer shrink-0" title="Đăng xuất">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập / Đăng ký</span>
            </button>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" /> Trạng thái Server
            </span>
            {backendStatus === 'online' ? (
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                SẴN SÀNG
              </span>
            ) : (
              <span className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                ĐANG KẾT NỐI
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Space */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden glass border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-indigo-400" />
            <span className="font-bold text-base text-white">AI English Mentor</span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setActiveTab('dashboard')} className={`p-2 rounded-lg ${activeTab === 'dashboard' ? 'text-indigo-400 bg-indigo-600/20' : 'text-slate-400'}`}>
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveTab('irt-test')} className={`p-2 rounded-lg ${activeTab === 'irt-test' ? 'text-indigo-400 bg-indigo-600/20' : 'text-slate-400'}`}>
              <Zap className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveTab('sm2-flashcards')} className={`p-2 rounded-lg ${activeTab === 'sm2-flashcards' ? 'text-amber-400 bg-indigo-600/20' : 'text-slate-400'}`}>
              <Clock className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveTab('chat')} className={`p-2 rounded-lg ${activeTab === 'chat' ? 'text-purple-400 bg-indigo-600/20' : 'text-slate-400'}`}>
              <MessageSquare className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveTab('pronounce')} className={`p-2 rounded-lg ${activeTab === 'pronounce' ? 'text-emerald-400 bg-indigo-600/20' : 'text-slate-400'}`}>
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Global Toolbar Header Bar */}
        <div className="glass border-b border-slate-800 px-6 md:px-8 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Khối Lớp:</span>
            </span>
            <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl gap-1 overflow-x-auto max-w-full">
              {gradeLevels.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => handleLevelChange(lvl.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    selectedLevel === lvl.id || (selectedLevel === 'A1' && lvl.id === '6') || (selectedLevel === 'A2' && lvl.id === '8') || (selectedLevel === 'B1' && lvl.id === '10') || (selectedLevel === 'B2' && lvl.id === '11') || (selectedLevel === 'C1' && lvl.id === '12')
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md glow-btn-brand scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* School Name & Login Profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-amber-300 shadow">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>DỰ ÁN NGHIÊN CỨU KHOA HỌC KỸ THUẬT</span>
            </div>

            {currentUser ? (
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl cursor-pointer hover:border-indigo-500/50 transition"
              >
                <div className="w-6 h-6 rounded-md bg-indigo-600/40 text-indigo-200 flex items-center justify-center font-black text-xs shrink-0">
                  {(currentUser.fullname || currentUser.username || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-slate-200">{currentUser.fullname || currentUser.username}</span>
                <span className="text-[10px] bg-indigo-600/20 text-indigo-300 px-2 py-0.5 rounded font-bold uppercase">{currentUser.role}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Body - Balanced Spacious Widescreen Container */}
        <div className="flex-1 px-6 md:px-10 py-8 flex flex-col justify-start w-full max-w-[1600px] mx-auto">
          {/* TAB DASHBOARD */}
          {activeTab === 'dashboard' && (
            <AdaptiveDashboard
              selectedGrade={selectedLevel}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              currentUser={currentUser}
              serverStats={serverStats}
            />
          )}

          {/* TAB IRT ADAPTIVE TEST ENGINE */}
          {activeTab === 'irt-test' && (
            <IRTTestEngine
              selectedGrade={selectedLevel}
              currentUser={currentUser}
            />
          )}

          {/* TAB SUPERMEMO-2 SPACED REPETITION FLASHCARDS */}
          {activeTab === 'sm2-flashcards' && (
            <SM2Flashcards
              selectedGrade={selectedLevel}
              currentUser={currentUser}
            />
          )}

          {/* TAB CHAT AI MENTOR */}
          {activeTab === 'chat' && <ChatMentor selectedGrade={selectedLevel} keys={keys} />}

          {/* TAB PRONUNCIATION ASSESSOR */}
          {activeTab === 'pronounce' && <PronunciationAssessor selectedGrade={selectedLevel} keys={keys} />}

          {/* TAB ADAPTIVE INTEREST READING */}
          {activeTab === 'reading' && <AdaptiveReading selectedGrade={selectedLevel} />}

          {/* TAB ADAPTIVE LISTENING */}
          {activeTab === 'listening' && <AdaptiveListening selectedGrade={selectedLevel} />}

          {/* TAB AI ENGLISH CHESS */}
          {activeTab === 'chess' && <EnglishChess selectedGrade={selectedLevel} />}

          {/* TAB USER GUIDE */}
          {activeTab === 'guide' && <UserGuide onStartLearning={(tab) => setActiveTab(tab)} />}

          {/* TAB ITEM BANK MANAGER */}
          {activeTab === 'item-bank' && <ItemBankManager />}

          {/* TAB ADMIN PANEL */}
          {activeTab === 'admin-panel' && <AdminPanel keys={keys} onSaveKeys={handleSaveKeys} />}

          {/* TAB SETTINGS */}
          {activeTab === 'settings' && (
            <div className="w-full glass rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center space-x-3 border-b border-white/10 pb-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-extrabold text-2xl text-white font-outfit">Cấu hình API Keys Cá Nhân</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Nhập khóa API cá nhân của bạn để gọi trực tiếp các mô hình AI</p>
                </div>
              </div>

              {showSaveAlert && (
                <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-2xl text-sm font-bold animate-fade-in shadow-lg">
                  <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
                  <span>Đã lưu khóa API thành công vào bộ nhớ trình duyệt!</span>
                </div>
              )}

              <form onSubmit={handleSaveKeys} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">Gemini API Key</label>
                  <input
                    type="password"
                    value={keys.gemini}
                    onChange={(e) => setKeys({ ...keys, gemini: e.target.value })}
                    placeholder="AIzaSy..."
                    className="w-full bg-[#070a16] border border-white/10 hover:border-white/20 focus:border-indigo-500 outline-none rounded-2xl px-4 py-3.5 text-sm text-gray-200 placeholder-gray-600 transition duration-200 shadow-inner"
                  />
                  <p className="text-[11px] text-gray-400 font-medium">
                    Tạo khóa miễn phí tại: <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline font-bold hover:text-indigo-300">Google AI Studio</a>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">Groq API Key (Tùy chọn)</label>
                  <input
                    type="password"
                    value={keys.groq}
                    onChange={(e) => setKeys({ ...keys, groq: e.target.value })}
                    placeholder="gsk_..."
                    className="w-full bg-[#070a16] border border-white/10 hover:border-white/20 focus:border-indigo-500 outline-none rounded-2xl px-4 py-3.5 text-sm text-gray-200 placeholder-gray-600 transition duration-200 shadow-inner"
                  />
                  <p className="text-[11px] text-gray-400 font-medium">
                    Tạo khóa miễn phí tại: <a href="https://console.groq.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline font-bold hover:text-indigo-300">Groq Console</a>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-2xl text-sm font-extrabold shadow-xl glow-btn-brand shine-effect flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-5 h-5" />
                  <span>Lưu cấu hình API Key</span>
                </button>
              </form>
            </div>
          )}


        </div>
      </main>
      {/* PRINTABLE PROGRESS REPORT MODAL */}
      <ExportProgressReportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        selectedGrade={selectedLevel}
      />
    </div>
  );
}

export default App;
