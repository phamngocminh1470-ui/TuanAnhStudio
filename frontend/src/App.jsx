import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useUserProgress } from './hooks/useUserProgress';
import MegaNavbar from './components/MegaNavbar';
import GuestLandingPage from './components/GuestLandingPage';
import AuthModal from './components/AuthModal';
import CustomCursor from './components/CustomCursor';

// Lazy loaded heavy components for optimal PageSpeed score
const LearningHub = lazy(() => import('./components/LearningHub'));
const ChatMentor = lazy(() => import('./components/ChatMentor'));
const PronunciationAssessor = lazy(() => import('./components/PronunciationAssessor'));
const AdaptiveDashboard = lazy(() => import('./components/AdaptiveDashboard'));
const IRTTestEngine = lazy(() => import('./components/IRTTestEngine'));
const SM2Flashcards = lazy(() => import('./components/SM2Flashcards'));
const AdaptiveReading = lazy(() => import('./components/AdaptiveReading'));
const AdaptiveListening = lazy(() => import('./components/AdaptiveListening'));
const UserGuide = lazy(() => import('./components/UserGuide'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const ExportProgressReportModal = lazy(() => import('./components/ExportProgressReportModal'));
const ItemBankManager = lazy(() => import('./components/ItemBankManager'));
const UserProfileModal = lazy(() => import('./components/UserProfileModal'));
const VocabLibrary = lazy(() => import('./components/VocabLibrary'));
const WritingPractice = lazy(() => import('./components/WritingPractice'));
const PhotoExamSolverModal = lazy(() => import('./components/PhotoExamSolverModal'));
const OfficialExamRepository = lazy(() => import('./components/OfficialExamRepository'));
const TeacherPortal = lazy(() => import('./components/TeacherPortal'));


import { 
  Sparkles, MessageSquare, Mic, BookOpen, GraduationCap, LayoutDashboard, ChevronRight, 
  Settings, Key, Save, AlertCircle, CheckCircle, Cpu, Zap, Activity, HelpCircle, 
  User, ShieldCheck, LogOut, LogIn, Clock, Headphones, Printer, Trophy, Database, BookMarked, PenLine, Camera, FileText
} from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLevel, setSelectedLevel] = useState('10');
  const [backendStatus, setBackendStatus] = useState('connecting');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPhotoSolverOpen, setIsPhotoSolverOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Pha 2: User progress sync hook
  const { loadFromServer, syncStatus, serverStats } = useUserProgress();

  const [keys, setKeys] = useState({
    gemini: localStorage.getItem('api_gemini') || '',
    groq: localStorage.getItem('api_groq') || '',
    azure: localStorage.getItem('api_azure') || ''
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

  const handleSaveKeys = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    localStorage.setItem('api_gemini', keys.gemini);
    localStorage.setItem('api_groq', keys.groq);
    localStorage.setItem('api_azure', keys.azure);
    setShowSaveAlert(true);
    try {
      await axios.post('/api/save-keys', {
        gemini: keys.gemini,
        groq: keys.groq,
        azure: keys.azure
      });
    } catch (err) {
      console.warn('Lưu API key lên máy chủ:', err.message);
    }
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
      {/* Hiệu ứng con trỏ chuột công nghệ cao */}
      <CustomCursor />

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

      {/* Photo Exam Solver Modal (Chụp ảnh giải đề AI) */}
      <PhotoExamSolverModal
        isOpen={isPhotoSolverOpen}
        onClose={() => setIsPhotoSolverOpen(false)}
        selectedGrade={selectedLevel}
        keys={keys}
      />

      {/* Sidebar Navigation (Hidden on Dashboard for clean wide layout matching study.thptai.kr) */}
      <aside className={`w-72 glass border-r border-slate-800 flex-col justify-between shrink-0 z-20 ${
        activeTab === 'dashboard' || activeTab === 'hub' ? 'hidden' : 'hidden md:flex'
      }`}>
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
          <nav className="space-y-6">
            {/* Group 1: Trung tâm & Luyện đề */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">
                Lộ Trình &amp; Đề Thi
              </div>
              
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'dashboard' || activeTab === 'hub'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 font-bold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                <span>Trang Chủ &amp; Đường Đua</span>
              </button>

              <button
                onClick={() => setActiveTab('irt-test')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'irt-test'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 font-bold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Luyện Đề Thích Ứng THPT</span>
              </button>

              <button
                onClick={() => setActiveTab('official-exams')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'official-exams'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 font-bold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Kho Đề Thi Chuẩn Hóa</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 font-bold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Báo Cáo Năng Lực &amp; Điểm</span>
              </button>
            </div>

            {/* Group 2: Học liệu & Kỹ năng AI */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">
                Học Liệu &amp; Kỹ Năng AI
              </div>

              <button
                onClick={() => setActiveTab('sm2-flashcards')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'sm2-flashcards'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 font-bold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Từ Vựng Não Bộ SM-2</span>
              </button>

              <button
                onClick={() => setActiveTab('reading')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'reading'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 font-bold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Đọc Thích Ứng (SGK)</span>
              </button>

              <button
                onClick={() => setActiveTab('listening')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'listening'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 font-bold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <Headphones className="w-4 h-4 text-purple-400" />
                <span>Nghe Tương Tác Audio</span>
              </button>

              <button
                onClick={() => setActiveTab('pronounce')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'pronounce'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 font-bold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <Mic className="w-4 h-4 text-emerald-400" />
                <span>Chấm Phát Âm Chuẩn IPA</span>
              </button>

              <button
                onClick={() => setActiveTab('writing-practice')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'writing-practice'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 font-bold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <PenLine className="w-4 h-4 text-pink-400" />
                <span>Luyện Viết Câu AI</span>
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 font-bold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span>Gia Sư Hội Thoại 1:1</span>
              </button>

              <button
                onClick={() => setActiveTab('vocab-library')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'vocab-library'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 font-bold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <BookMarked className="w-4 h-4 text-cyan-400" />
                <span>Học Liệu Từ Vựng</span>
              </button>
            </div>

            {/* Group 3: Hệ thống & Trợ giúp */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">
                Hệ Thống &amp; Trợ Giúp
              </div>

              <button
                onClick={() => setActiveTab('guide')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'guide'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 font-bold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>Hướng Dẫn Sử Dụng</span>
              </button>

              {currentUser && currentUser.role === 'admin' && (
                <>
                  <div className="pt-2 text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-3 pb-1">
                    Quản Trị Viên (Admin)
                  </div>

                  <button
                    onClick={() => setActiveTab('item-bank')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'item-bank'
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 font-bold'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>Ngân Hàng Câu Hỏi (Item Bank)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('admin-panel')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'admin-panel'
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 font-bold'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Admin Panel</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'settings'
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25 font-bold'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Cấu Hình API Keys</span>
                  </button>
                </>
              )}
            </div>
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
        {/* Top Mega Navigation Bar matching study.thptai.kr */}
        <MegaNavbar
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
          selectedGrade={selectedLevel}
          onGradeChange={handleLevelChange}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onLogout={handleLogout}
          onOpenPhotoSolver={() => setIsPhotoSolverOpen(true)}
        />

        {/* Tab Body - Balanced Spacious Responsive Container */}
        <div className="flex-1 px-3 sm:px-6 md:px-10 py-4 sm:py-6 md:py-8 pb-24 lg:pb-8 flex flex-col justify-start w-full max-w-[1600px] mx-auto">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-24 space-y-4 animate-fade-in">
              <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-gray-400 font-mono tracking-wider">ĐANG TẢI TÍNH NĂNG...</p>
            </div>
          }>
            {/* TAB LEARNING HUB (Home View) */}
            {(activeTab === 'dashboard' || activeTab === 'hub') && (
              currentUser ? (
                <LearningHub
                  selectedGrade={selectedLevel}
                  onGradeChange={handleLevelChange}
                  onNavigate={(tab) => setActiveTab(tab)}
                  currentUser={currentUser}
                  serverStats={serverStats}
                  onOpenPhotoSolver={() => setIsPhotoSolverOpen(true)}
                />
              ) : (
                <GuestLandingPage
                  onOpenAuth={() => setIsAuthOpen(true)}
                  onStartTrial={() => setIsAuthOpen(true)}
                  selectedGrade={selectedLevel}
                  onGradeChange={handleLevelChange}
                />
              )
            )}

            {/* CÁC TAB HỌC TẬP YÊU CẦU ĐĂNG NHẬP / ĐĂNG KÝ (Ngoại trừ Dashboard, Hướng dẫn & Cổng Giáo Viên) */}
            {!currentUser && activeTab !== 'dashboard' && activeTab !== 'hub' && activeTab !== 'guide' && activeTab !== 'teacher-portal' ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 max-w-lg mx-auto text-center space-y-6 animate-fade-in">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30 mx-auto animate-bounce-soft">
                  <GraduationCap className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-black text-white font-outfit">Yêu Cầu Đăng Nhập Hệ Thống</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Vui lòng <strong className="text-indigo-400">Đăng ký tài khoản mới</strong> hoặc <strong className="text-indigo-400">Đăng nhập</strong> để lưu hồ sơ học tập cá nhân, đo năng lực IRT và đồng bộ tiến độ của bạn!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/30 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Đăng nhập / Đăng ký ngay</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-sm border border-white/10 transition cursor-pointer"
                  >
                    <span>Về trang chủ</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* TAB DETAILED ANALYTICS DASHBOARD */}
                {activeTab === 'analytics' && (
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

                {/* TAB OFFICIAL EXAMS REPOSITORY */}
                {activeTab === 'official-exams' && (
                  <OfficialExamRepository onStartExam={(tab) => setActiveTab(tab)} />
                )}

                {/* TAB USER GUIDE */}
                {activeTab === 'guide' && <UserGuide onStartLearning={(tab) => {
                  if (!currentUser) {
                    setIsAuthOpen(true);
                  } else {
                    setActiveTab(tab);
                  }
                }} />}

                {/* TAB VOCAB LIBRARY (student-facing) */}
                {activeTab === 'vocab-library' && (
                  <VocabLibrary selectedGrade={selectedLevel} />
                )}

                {/* TAB ITEM BANK MANAGER */}
                {activeTab === 'item-bank' && <ItemBankManager />}

                {/* TAB WRITING PRACTICE (AI-powered grammar & translation) */}
                {activeTab === 'writing-practice' && (
                  <WritingPractice selectedGrade={selectedLevel} keys={keys} />
                )}

                {/* TAB TEACHER PORTAL */}
                {activeTab === 'teacher-portal' && (
                  <TeacherPortal keys={keys} currentUser={currentUser} />
                )}

                {/* TAB ADMIN PANEL */}
                {activeTab === 'admin-panel' && <AdminPanel keys={keys} onSaveKeys={handleSaveKeys} />}
              </>
            )}
          </Suspense>

          {/* TAB SETTINGS */}
          {activeTab === 'settings' && (
            <div className="w-full glass rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center space-x-3 border-b border-white/10 pb-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-md">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-extrabold text-2xl text-white font-outfit">Cấu hình API Keys Cá Nhân</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Nhập khóa API cá nhân của bạn để gọi trực tiếp các mô hình AI</p>
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
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Gemini API Key</label>
                  <input
                    type="password"
                    value={keys.gemini}
                    onChange={(e) => setKeys({ ...keys, gemini: e.target.value })}
                    placeholder="AIzaSy..."
                    className="w-full bg-[#070a16] border border-white/10 hover:border-white/20 focus:border-blue-500 outline-none rounded-2xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 transition duration-200 shadow-inner"
                  />
                  <p className="text-[11px] text-slate-400 font-medium">
                    Tạo khóa miễn phí tại: <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-bold hover:text-blue-300">Google AI Studio</a>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Groq API Key (Tùy chọn)</label>
                  <input
                    type="password"
                    value={keys.groq}
                    onChange={(e) => setKeys({ ...keys, groq: e.target.value })}
                    placeholder="gsk_..."
                    className="w-full bg-[#070a16] border border-white/10 hover:border-white/20 focus:border-blue-500 outline-none rounded-2xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 transition duration-200 shadow-inner"
                  />
                  <p className="text-[11px] text-slate-400 font-medium">
                    Tạo khóa miễn phí tại: <a href="https://console.groq.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-bold hover:text-blue-300">Groq Console</a>
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-4 text-sm font-extrabold shadow-xl flex items-center justify-center gap-2 cursor-pointer"
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
