import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useUserProgress } from './hooks/useUserProgress';
import MegaNavbar from './components/MegaNavbar';
import GuestLandingPage from './components/GuestLandingPage';
import AuthModal from './components/AuthModal';
import CustomCursor from './components/CustomCursor';
import CustomAlertModal from './components/CustomAlertModal';
import MobileInstallModal from './components/MobileInstallModal';

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
const StudentClassroom = lazy(() => import('./components/StudentClassroom'));
const CanvaProModal = lazy(() => import('./components/CanvaProModal'));


import { 
  Sparkles, MessageSquare, Mic, BookOpen, GraduationCap, LayoutDashboard, ChevronRight, 
  Settings, Key, Save, AlertCircle, CheckCircle, Cpu, Zap, Activity, HelpCircle, 
  User, ShieldCheck, LogOut, LogIn, Clock, Headphones, Printer, Trophy, Database, BookMarked, PenLine, Camera, FileText,
  Shuffle, Users, ExternalLink, Gift, Sun, Moon, UserPlus
} from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api';

const DEFAULT_TESTER_USER = {
  id: 'guest_user',
  username: 'Khách Trải Nghiệm',
  full_name: 'Khách Trải Nghiệm',
  role: 'student',
  grade: '12'
};

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('portal') === 'teacher' || params.get('tab') === 'teacher-portal') {
        return 'teacher-portal';
      }
      if (window.location.hostname.includes('tuananhstudio.top')) {
        return 'teacher-portal';
      }
    }
    return 'dashboard';
  });
  const [selectedLevel, setSelectedLevel] = useState('12');
  const [backendStatus, setBackendStatus] = useState('connecting');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPhotoSolverOpen, setIsPhotoSolverOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user_session');
      if (savedUser && savedUser !== 'null' && savedUser !== 'undefined') {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.username) return parsed;
      }
    } catch (e) {}
    return null; // Mặc định là Khách vãng lai để hiển thị Landing Page & cho phép đăng ký tài khoản thật
  });

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCanvaOpen, setIsCanvaOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [tuananhTheme, setTuananhTheme] = useState(() => {
    return localStorage.getItem('tuananh_theme') || 'light';
  });

  const isTuanAnhDomain = typeof window !== 'undefined' && window.location.hostname.includes('tuananhstudio.top');

  // Pha 2: User progress sync hook
  const { loadFromServer, syncStatus, serverStats } = useUserProgress();

  const [keys, setKeys] = useState({
    gemini: localStorage.getItem('api_gemini') || '',
    groq: localStorage.getItem('api_groq') || '',
    deepseek: localStorage.getItem('api_deepseek') || '',
    openrouter: localStorage.getItem('api_openrouter') || '',
    openai: localStorage.getItem('api_openai') || '',
    claude: localStorage.getItem('api_claude') || '',
    azure: localStorage.getItem('api_azure') || ''
  });
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  // Dữ liệu lớp học đồng bộ giữa Cổng Giáo Viên & Cổng Học Sinh
  const [portalClasses, setPortalClasses] = useState(() => {
    try {
      const saved = localStorage.getItem('teacher_portal_classes');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { 
        id: 'cls-1', 
        name: 'Lớp 10A1 - Tiếng Anh Lớp 10', 
        code: 'ENG-10A1-26', 
        grade: '10', 
        studentCount: 38, 
        avgScore: 7.8, 
        activeAssignments: 1,
        announcements: [
          { id: 'ann-1', title: 'Nhắc nhở kiểm tra 15 phút', content: 'Thứ 6 tuần này lớp mình sẽ có bài kiểm tra 15 phút trắc nghiệm nhé các em!', date: '2026-08-25' }
        ],
        assignments: [
          { 
            id: 'asg-1', 
            title: 'Bài Kiểm Tra 15 Phút Số 1 - Từ Vựng & Ngữ Pháp', 
            questions: [
              {
                id: 1,
                part: 'Trắc nghiệm THPT',
                question: 'The government is making efforts to ______ the natural habitats of rare wild animals.',
                options: [
                  { key: 'A', text: 'preserve' },
                  { key: 'B', text: 'destroy' },
                  { key: 'C', text: 'pollute' },
                  { key: 'D', text: 'ignore' }
                ],
                correctAnswer: 'A',
                explanation: 'Đáp án đúng là A. preserve (bảo tồn).'
              },
              {
                id: 2,
                part: 'Trắc nghiệm THPT',
                question: 'If we continue to use fossil fuels at this rate, we ______ our energy resources soon.',
                options: [
                  { key: 'A', text: 'will exhaust' },
                  { key: 'B', text: 'would exhaust' },
                  { key: 'C', text: 'have exhausted' },
                  { key: 'D', text: 'exhausted' }
                ],
                correctAnswer: 'A',
                explanation: 'Đáp án đúng là A (Câu điều kiện loại 1: If + HTĐ, S + will + V).'
              },
              {
                id: 3,
                part: 'Trắc nghiệm THPT',
                question: 'She suggested ______ public transport to reduce air pollution in the metropolitan city.',
                options: [
                  { key: 'A', text: 'using' },
                  { key: 'B', text: 'to use' },
                  { key: 'C', text: 'used' },
                  { key: 'D', text: 'use' }
                ],
                correctAnswer: 'A',
                explanation: 'Đáp án đúng là A (suggest + V-ing).'
              }
            ],
            deadline: '2026-09-15', 
            timeLimit: 15,
            submittedCount: 35, 
            totalStudents: 38, 
            status: 'open' 
          }
        ],
        students: [
          { id: 'st-1', name: 'Nguyễn Văn An', email: 'an.nv@thpt.edu.vn', score1: 9.0, score2: 9.5, essayScore: 9.5, avg: 9.3, status: 'completed' },
          { id: 'st-2', name: 'Trần Thị Mai', email: 'mai.tt@thpt.edu.vn', score1: 8.5, score2: 8.0, essayScore: 8.5, avg: 8.3, status: 'completed' }
        ]
      },
      { 
        id: 'cls-2', 
        name: 'Lớp 11A2 - Tiếng Anh Lớp 11', 
        code: 'ENG-11A2-99', 
        grade: '11', 
        studentCount: 42, 
        avgScore: 8.2, 
        activeAssignments: 1,
        announcements: [
          { id: 'ann-3', title: 'Luyện tập đề định kỳ', content: 'Các em vào làm bài kiểm tra giáo viên vừa giao để lấy điểm thường xuyên.', date: '2026-08-26' }
        ],
        assignments: [
          { 
            id: 'asg-2', 
            title: 'Bài Khảo Sát Định Kỳ Lớp 11', 
            questions: [
              {
                id: 1,
                part: 'Trắc nghiệm THPT',
                question: 'Artificial intelligence is ______ changing how teachers deliver knowledge and assess students.',
                options: [
                  { key: 'A', text: 'rapidly' },
                  { key: 'B', text: 'rapid' },
                  { key: 'C', text: 'rapidity' },
                  { key: 'D', text: 'rapider' }
                ],
                correctAnswer: 'A',
                explanation: 'Đáp án đúng là A. rapidly (trạng từ bổ nghĩa cho động từ changing).'
              }
            ],
            deadline: '2026-09-18', 
            timeLimit: 45,
            submittedCount: 40, 
            totalStudents: 42, 
            status: 'open' 
          }
        ],
        students: [
          { id: 'st-6', name: 'Đặng Thu Hà', email: 'ha.dt@thpt.edu.vn', score1: 8.8, score2: 9.0, essayScore: 8.5, avg: 8.8, status: 'completed' }
        ]
      },
      { 
        id: 'cls-3', 
        name: 'Lớp 12A3 - Ôn Thi Tốt Nghiệp THPT', 
        code: 'ENG-12A3-77', 
        grade: '12', 
        studentCount: 45, 
        avgScore: 8.6, 
        activeAssignments: 1,
        announcements: [
          { id: 'ann-4', title: 'Chiến dịch luyện đề 8+', content: 'Tập trung hoàn thành bộ đề thi tốt nghiệp THPT chuẩn cấu trúc Bộ GD&ĐT.', date: '2026-08-27' }
        ],
        assignments: [],
        students: [
          { id: 'st-10', name: 'Hoàng Minh Quân', email: 'quan.hm@thpt.edu.vn', score1: 9.2, score2: 9.6, essayScore: 9.0, avg: 9.4, status: 'completed' }
        ]
      }
    ];
  });

  const updatePortalClasses = (newClassesOrUpdater) => {
    setPortalClasses(prev => {
      const nextVal = typeof newClassesOrUpdater === 'function' ? newClassesOrUpdater(prev) : newClassesOrUpdater;
      try {
        localStorage.setItem('teacher_portal_classes', JSON.stringify(nextVal));
      } catch (e) {}
      return nextVal;
    });
  };

  // Load Session, JWT token, and System Status
  useEffect(() => {
    // Khôi phục JWT token và set axios header
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }

    // Khôi phục user session nếu có
    const savedUser = localStorage.getItem('user_session');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        if (user.grade) setSelectedLevel(user.grade);
      } catch (e) {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }

    // Axios interceptor
    const interceptor = axios.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401 && localStorage.getItem('auth_token')) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_session');
          delete axios.defaults.headers.common['Authorization'];
          setCurrentUser(null);
        }
        return Promise.reject(err);
      }
    );

    const savedGemini = localStorage.getItem('api_gemini') || '';
    const savedGroq = localStorage.getItem('api_groq') || '';
    const savedDeepseek = localStorage.getItem('api_deepseek') || '';
    const savedOpenrouter = localStorage.getItem('api_openrouter') || '';
    const savedOpenai = localStorage.getItem('api_openai') || '';
    const savedClaude = localStorage.getItem('api_claude') || '';
    const savedAzure = localStorage.getItem('api_azure') || '';
    setKeys({
      gemini: savedGemini,
      groq: savedGroq,
      deepseek: savedDeepseek,
      openrouter: savedOpenrouter,
      openai: savedOpenai,
      claude: savedClaude,
      azure: savedAzure
    });
    
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
    if (currentUser && currentUser.role === 'student' && currentUser.grade) {
      // Học sinh đã đăng ký thì cố định theo khối của tài khoản
      setSelectedLevel(currentUser.grade);
      localStorage.setItem('selected_level', currentUser.grade);
      return;
    }
    setSelectedLevel(level);
    localStorage.setItem('selected_level', level);
  };

  const handleSaveKeys = async (eOrNewKeys) => {
    let targetKeys = keys;
    if (eOrNewKeys && eOrNewKeys.preventDefault) {
      eOrNewKeys.preventDefault();
    } else if (eOrNewKeys && typeof eOrNewKeys === 'object' && !eOrNewKeys.nativeEvent) {
      targetKeys = { ...keys, ...eOrNewKeys };
      setKeys(targetKeys);
    }
    
    localStorage.setItem('api_gemini', targetKeys.gemini || '');
    localStorage.setItem('api_groq', targetKeys.groq || '');
    localStorage.setItem('api_deepseek', targetKeys.deepseek || '');
    localStorage.setItem('api_openrouter', targetKeys.openrouter || '');
    localStorage.setItem('api_openai', targetKeys.openai || '');
    localStorage.setItem('api_claude', targetKeys.claude || '');
    localStorage.setItem('api_azure', targetKeys.azure || '');
    setShowSaveAlert(true);
    try {
      await axios.post('/api/save-keys', {
        gemini: targetKeys.gemini,
        groq: targetKeys.groq,
        deepseek: targetKeys.deepseek,
        openrouter: targetKeys.openrouter,
        openai: targetKeys.openai,
        claude: targetKeys.claude,
        azure: targetKeys.azure
      });
    } catch (err) {
      console.warn('Lưu API key lên máy chủ:', err.message);
    }
    setTimeout(() => setShowSaveAlert(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    setIsProfileOpen(false);
    setIsAuthOpen(false);
    setActiveTab('dashboard');
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
    { id: '10', label: 'Khối 10' },
    { id: '11', label: 'Khối 11' },
    { id: '12', label: 'Khối 12' },
  ];

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-200 ${
      isTuanAnhDomain
        ? (tuananhTheme === 'light' ? 'bg-[#f8fafc] text-slate-900 selection:bg-amber-400 selection:text-black' : 'bg-[#090d1f] text-[#f3f4f6] selection:bg-amber-500 selection:text-black')
        : 'bg-[#0c122c] text-slate-100 selection:bg-blue-600 selection:text-white'
    }`}>
      {/* Hiệu ứng con trỏ chuột công nghệ cao */}
      <CustomCursor />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
        onNavigate={(tab) => setActiveTab(tab)}
        initialMode={authMode}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onProfileUpdate={(updatedUser) => setCurrentUser(updatedUser)}
        onLogout={handleLogout}
      />

      {/* Photo Exam Solver Modal (Chụp ảnh giải đề AI) */}
      <PhotoExamSolverModal
        isOpen={isPhotoSolverOpen}
        onClose={() => setIsPhotoSolverOpen(false)}
        selectedGrade={selectedLevel}
        keys={keys}
      />

      {/* Main Content Space - Full Width Clean Layout with Top MegaNavbar */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden relative w-full">
        {/* Top Navigation Bar: Chuyên biệt cho tuananhstudio.top hoặc MegaNavbar cho examoraai.com */}
        {isTuanAnhDomain ? (
          <header className={`sticky top-0 z-40 w-full backdrop-blur-xl px-4 sm:px-8 py-3 flex items-center justify-between transition-colors duration-200 ${
            tuananhTheme === 'light'
              ? 'bg-white/95 border-b border-slate-200 text-slate-900 shadow-sm'
              : 'bg-[#090d1f]/90 border-b border-white/10 text-white shadow-lg'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-orange-500/20">
                <Shuffle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-black text-base tracking-tight font-outfit ${tuananhTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    TuanAnhStudio.top
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide ${
                    tuananhTheme === 'light'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    Chuyên Xáo Đề Thi
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide hidden md:inline-block ${
                    tuananhTheme === 'light'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    Chuẩn Bộ GD&amp;ĐT 2025
                  </span>
                </div>
                <p className={`text-[11px] hidden sm:block ${tuananhTheme === 'light' ? 'text-slate-500 font-medium' : 'text-slate-400'}`}>
                  Phần mềm xáo đề thi trắc nghiệm chuyên nghiệp &amp; xuất ma trận đáp án chuẩn Bộ GD&amp;ĐT
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Nút Nhận Canva Pro / Edu */}
              <button
                onClick={() => setIsCanvaOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-purple-500/20 cursor-pointer"
                title="Nhận bản quyền Canva Pro / Edu miễn phí"
              >
                <Gift className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                <span>🎁 Nhận Canva Pro/Edu</span>
              </button>

              {/* Nút Đổi Theme Sáng / Tối */}
              <button
                onClick={() => {
                  const next = tuananhTheme === 'light' ? 'dark' : 'light';
                  setTuananhTheme(next);
                  localStorage.setItem('tuananh_theme', next);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 border cursor-pointer ${
                  tuananhTheme === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
                title={tuananhTheme === 'light' ? 'Chuyển sang nền tối' : 'Chuyển sang nền trắng (Mặc định)'}
              >
                {tuananhTheme === 'light' ? <Moon className="w-3.5 h-3.5 text-indigo-600" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                <span className="hidden md:inline">{tuananhTheme === 'light' ? 'Nền Tối' : 'Nền Trắng'}</span>
              </button>

              {/* Link sang Examora AI */}
              <a
                href="https://examoraai.com"
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-sm cursor-pointer ${
                  tuananhTheme === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
                }`}
                title="Mở Hệ Thống Ôn Thi Trắc Nghiệm Thông Minh Examora AI"
              >
                <span>Hệ Thống Examora AI</span>
                <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
              </a>
            </div>
          </header>
        ) : (
          <MegaNavbar
            activeTab={activeTab}
            onNavigate={(tab) => setActiveTab(tab)}
            selectedGrade={selectedLevel}
            onGradeChange={handleLevelChange}
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onOpenProfile={() => setIsProfileOpen(true)}
            onLogout={handleLogout}
            onOpenPhotoSolver={() => setIsPhotoSolverOpen(true)}
            onOpenCanva={() => setIsCanvaOpen(true)}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
          />
        )}

        {/* Tab Body - Expansive Full-Bleed Layout with Edge-to-Edge Diffusion */}
        <div className={`flex-1 flex flex-col justify-start w-full ${
          !currentUser && (activeTab === 'dashboard' || activeTab === 'hub')
            ? 'px-0 py-0'
            : 'px-3 sm:px-6 md:px-8 lg:px-12 2xl:px-16 py-4 sm:py-6 md:py-8 pb-32 sm:pb-36 lg:pb-12'
        }`}>
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-24 space-y-4 animate-fade-in">
              <div className="w-10 h-10 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
              <p className="text-xs font-medium text-zinc-500 font-mono tracking-wider">ĐANG TẢI DỮ LIỆU...</p>
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
                  onOpenAuth={handleOpenAuth}
                  onStartTrial={() => handleOpenAuth('register')}
                  selectedGrade={selectedLevel}
                  onGradeChange={handleLevelChange}
                />
              )
            )}

            {/* CÁC TAB HỌC TẬP YÊU CẦU ĐĂNG NHẬP / ĐĂNG KÝ (Ngoại trừ Dashboard, Hướng dẫn & Cổng Giáo Viên) */}
            {!currentUser && activeTab !== 'dashboard' && activeTab !== 'hub' && activeTab !== 'guide' && activeTab !== 'teacher-portal' ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 max-w-lg mx-auto text-center space-y-6 animate-fade-in text-slate-100">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-cyan-400/40 flex items-center justify-center text-white shadow-xl mx-auto">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-3d-hero font-outfit">Đăng Ký Tài Khoản Để Tiếp Tục</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Vui lòng <strong className="text-cyan-300 font-semibold">Đăng ký tài khoản mới</strong> hoặc <strong className="text-cyan-300 font-semibold">Đăng nhập</strong> để lưu hồ sơ học tập cá nhân, đo năng lực IRT và đồng bộ tiến độ của bạn!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
                  <button
                    onClick={() => handleOpenAuth('register')}
                    className="btn-3d-primary px-6 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Đăng ký tài khoản mới</span>
                  </button>
                  <button
                    onClick={() => handleOpenAuth('login')}
                    className="btn-3d-secondary px-6 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Đã có tài khoản? Đăng nhập</span>
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
                {activeTab === 'chat' && (
                  <ChatMentor 
                    selectedGrade={selectedLevel} 
                    keys={keys} 
                    currentUser={currentUser} 
                  />
                )}

                {/* TAB PRONUNCIATION ASSESSOR */}
                {activeTab === 'pronounce' && <PronunciationAssessor selectedGrade={selectedLevel} keys={keys} />}

                {/* TAB ADAPTIVE INTEREST READING */}
                {activeTab === 'reading' && <AdaptiveReading selectedGrade={selectedLevel} />}

                {/* TAB ADAPTIVE LISTENING */}
                {activeTab === 'listening' && <AdaptiveListening selectedGrade={selectedLevel} />}

                {/* TAB STUDENT CLASSROOM (HỌC SINH VÀO LÀM BÀI) */}
                {activeTab === 'student-classroom' && (
                  <StudentClassroom
                    classes={portalClasses}
                    setClasses={updatePortalClasses}
                    onNavigate={(tab) => setActiveTab(tab)}
                  />
                )}

                {/* TAB OFFICIAL EXAMS REPOSITORY */}
                {activeTab === 'official-exams' && (
                  <OfficialExamRepository 
                    selectedGrade={selectedLevel}
                    currentUser={currentUser}
                    onStartExam={(tab) => setActiveTab(tab)} 
                  />
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
                  <VocabLibrary 
                    selectedGrade={selectedLevel} 
                    currentUser={currentUser}
                  />
                )}

                {/* TAB ITEM BANK MANAGER */}
                {activeTab === 'item-bank' && <ItemBankManager />}

                {/* TAB WRITING PRACTICE (AI-powered grammar & translation) */}
                {activeTab === 'writing-practice' && (
                  <WritingPractice selectedGrade={selectedLevel} keys={keys} />
                )}

                {/* TAB TEACHER PORTAL */}
                {activeTab === 'teacher-portal' && (
                  <TeacherPortal 
                    keys={keys} 
                    currentUser={currentUser} 
                    classes={portalClasses} 
                    setClasses={updatePortalClasses}
                    onNavigate={(tab) => setActiveTab(tab)}
                    standaloneShufflerOnly={isTuanAnhDomain}
                    isLightMode={isTuanAnhDomain ? (tuananhTheme === 'light') : false}
                    onOpenCanva={() => setIsCanvaOpen(true)}
                  />
                )}

                {/* TAB ADMIN PANEL */}
                {activeTab === 'admin-panel' && (
                  <AdminPanel 
                    keys={keys} 
                    onSaveKeys={handleSaveKeys} 
                    onOpenAuth={() => setIsAuthOpen(true)} 
                  />
                )}
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
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Google Gemini API Key</label>
                  <input
                    type="password"
                    value={keys.gemini}
                    onChange={(e) => setKeys({ ...keys, gemini: e.target.value })}
                    placeholder="AIzaSy..."
                    className="w-full bg-[#070a16] border border-white/10 hover:border-white/20 focus:border-blue-500 outline-none rounded-2xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 transition duration-200 shadow-inner"
                  />
                  <p className="text-[11px] text-slate-400 font-medium">
                    Tạo khóa miễn phí tại: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-bold hover:text-blue-300">Google AI Studio</a>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Groq API Key (Siêu Tốc 500 từ/s)</label>
                  <input
                    type="password"
                    value={keys.groq}
                    onChange={(e) => setKeys({ ...keys, groq: e.target.value })}
                    placeholder="gsk_..."
                    className="w-full bg-[#070a16] border border-white/10 hover:border-white/20 focus:border-blue-500 outline-none rounded-2xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 transition duration-200 shadow-inner"
                  />
                  <p className="text-[11px] text-slate-400 font-medium">
                    Tạo khóa miễn phí tại: <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-bold hover:text-blue-300">Groq Console</a>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">DeepSeek API Key (Tư Duy Suy Luận R1)</label>
                  <input
                    type="password"
                    value={keys.deepseek}
                    onChange={(e) => setKeys({ ...keys, deepseek: e.target.value })}
                    placeholder="sk-..."
                    className="w-full bg-[#070a16] border border-white/10 hover:border-white/20 focus:border-blue-500 outline-none rounded-2xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 transition duration-200 shadow-inner"
                  />
                  <p className="text-[11px] text-slate-400 font-medium">
                    Nhận 500k tokens miễn phí tại: <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-bold hover:text-blue-300">DeepSeek Platform</a>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">OpenAI API Key (GPT-4o, o1, o3-mini)</label>
                  <input
                    type="password"
                    value={keys.openai}
                    onChange={(e) => setKeys({ ...keys, openai: e.target.value })}
                    placeholder="sk-proj-..."
                    className="w-full bg-[#070a16] border border-white/10 hover:border-white/20 focus:border-blue-500 outline-none rounded-2xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 transition duration-200 shadow-inner"
                  />
                  <p className="text-[11px] text-slate-400 font-medium">
                    Tạo khóa tại: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-bold hover:text-blue-300">OpenAI Platform</a>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Anthropic Claude API Key (Claude 3.7 / 3.5 Sonnet)</label>
                  <input
                    type="password"
                    value={keys.claude}
                    onChange={(e) => setKeys({ ...keys, claude: e.target.value })}
                    placeholder="sk-ant-..."
                    className="w-full bg-[#070a16] border border-white/10 hover:border-white/20 focus:border-blue-500 outline-none rounded-2xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 transition duration-200 shadow-inner"
                  />
                  <p className="text-[11px] text-slate-400 font-medium">
                    Tạo khóa tại: <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-bold hover:text-blue-300">Anthropic Console</a>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">OpenRouter API Key (Đa Mô Hình 200+ All-in-One)</label>
                  <input
                    type="password"
                    value={keys.openrouter}
                    onChange={(e) => setKeys({ ...keys, openrouter: e.target.value })}
                    placeholder="sk-or-v1-..."
                    className="w-full bg-[#070a16] border border-white/10 hover:border-white/20 focus:border-blue-500 outline-none rounded-2xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 transition duration-200 shadow-inner"
                  />
                  <p className="text-[11px] text-slate-400 font-medium">
                    Tạo khóa đa mô hình tại: <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-bold hover:text-blue-300">OpenRouter AI</a>
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-4 text-sm font-extrabold shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-5 h-5" />
                  <span>Lưu cấu hình API Keys</span>
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

      {/* CANVA PRO / EDU REGISTRATION MODAL */}
      <CanvaProModal
        isOpen={isCanvaOpen}
        onClose={() => setIsCanvaOpen(false)}
      />

      {/* MOBILE APP INSTALL MODAL */}
      <MobileInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* CUSTOM GLASSMORPHIC POPUP NOTIFICATION MODAL */}
      <CustomAlertModal />
    </div>
  );
}

export default App;
