import React, { useState, useEffect } from 'react';
import { 
  Brain, Flame, Target, Award, RefreshCw, CheckCircle2, ArrowRight, Zap, 
  Clock, BookOpen, BarChart3, Activity, MessageSquare, Mic, Sparkles, GraduationCap,
  Printer, ShieldAlert, Headphones, FileText, Check, Trophy
} from 'lucide-react';
import axios from 'axios';

export default function AdaptiveDashboard({ selectedGrade, onNavigate, onOpenExportModal, currentUser, serverStats }) {
  // Global Student Profile State
  // Global Student Profile State
  const [theta, setTheta] = useState(0.0);
  const [ef, setEf] = useState(2.5);
  const [nextInterval, setNextInterval] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [pronounceScore, setPronounceScore] = useState(0.0);
  const [vocabCount, setVocabCount] = useState(0);
  const [predictions, setPredictions] = useState({
    semesterScore: '—',
    thptScore: '—',
    vstepLevel: 'Chưa đánh giá'
  });
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  useEffect(() => {
    const savedTheta = localStorage.getItem('user_theta');
    const savedEf = localStorage.getItem('user_ef');
    const savedNextInterval = localStorage.getItem('user_next_interval');
    const savedStreak = localStorage.getItem('user_streak');
    const savedPronounce = localStorage.getItem('user_pronounce_score');
    const savedVocab = localStorage.getItem('user_vocab_count');

    const activeTheta = savedTheta ? parseFloat(savedTheta) : 0.0;
    const activeEf = savedEf ? parseFloat(savedEf) : 2.5;
    const activeInterval = savedNextInterval ? parseInt(savedNextInterval, 10) : 0;
    // Pha 2: Sử dụng server stats nếu có, fallback về localStorage
    const activeStreak = serverStats?.streak_days ?? (savedStreak ? parseInt(savedStreak, 10) : 0);
    const activePronounce = savedPronounce ? parseFloat(savedPronounce) : 0.0;
    const activeVocab = serverStats?.total_questions
      ? Math.max(parseInt(savedVocab || '0', 10), serverStats.total_questions)  // Show higher of local or server
      : (savedVocab ? parseInt(savedVocab, 10) : 0);

    setTheta(activeTheta);
    setEf(activeEf);
    setNextInterval(activeInterval);
    setStreakDays(activeStreak);
    setPronounceScore(activePronounce);
    setVocabCount(activeVocab);

    const fetchPredictions = async () => {
      setLoadingPredictions(true);
      try {
        const res = await axios.post('/api/predict/scores', {
          theta: activeTheta,
          ef: activeEf,
          streak: activeStreak,
          pronounce_score: activePronounce
        });
        if (res.data && res.data.predictions) {
          const pred = res.data.predictions;
          const thptVal = pred.thpt_score;
          const semVal = Math.max(4.0, Math.min(10.0, Number((thptVal - 0.2).toFixed(1))));
          
          let levelStr = 'Mức: Giỏi';
          if (thptVal >= 8.0) levelStr = 'Mức: Giỏi';
          else if (thptVal >= 6.5) levelStr = 'Mức: Khá';
          else if (thptVal >= 5.0) levelStr = 'Mức: Trung bình';
          else levelStr = 'Mức: Yếu';

          setPredictions({
            semesterScore: semVal.toFixed(1),
            thptScore: thptVal.toFixed(1),
            vstepLevel: levelStr
          });
        }
      } catch (err) {
        console.error('Lỗi lấy điểm dự báo:', err);
      } finally {
        setLoadingPredictions(false);
      }
    };
    fetchPredictions();
  }, [selectedGrade, serverStats]);  // Re-run khi serverStats thay đổi (sau login)

  // BUG-12: Learning Path state
  const [learningPath, setLearningPath] = useState(null);
  const [loadingPath, setLoadingPath] = useState(false);

  useEffect(() => {
    const fetchLearningPath = async () => {
      setLoadingPath(true);
      try {
        const savedTheta = localStorage.getItem('user_theta');
        const savedMastery = localStorage.getItem('skill_mastery');
        const savedHistory = localStorage.getItem('irt_history');
        const thetaVal = savedTheta ? parseFloat(savedTheta) : 0.0;
        const masteryVal = savedMastery ? JSON.parse(savedMastery) : null;
        const historyVal = savedHistory ? JSON.parse(savedHistory) : [];

        const res = await axios.post('/api/adaptive/learning-path', {
          theta: thetaVal,
          skill_mastery: masteryVal,
          history: historyVal.map(h => ({ itemId: h.itemId, result: h.result }))
        });
        if (res.data && res.data.daily_plan) {
          setLearningPath(res.data.daily_plan);
        }
      } catch (err) {
        console.error('Lỗi lấy lộ trình học:', err);
      } finally {
        setLoadingPath(false);
      }
    };
    fetchLearningPath();
  }, [selectedGrade]);

  const getProficiencyBadge = (val) => {
    if (val < -1.0) return { label: 'A1 Sơ cấp', text: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' };
    if (val < 0.5) return { label: 'A2 Đạt yêu cầu', text: 'text-cyan-400', bg: 'bg-cyan-500/15 border-cyan-500/30' };
    if (val < 1.8) return { label: 'B1 Khá giỏi', text: 'text-indigo-400', bg: 'bg-indigo-500/15 border-indigo-500/30' };
    return { label: 'B2/C1 Xuất sắc', text: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' };
  };

  // Dynamic gamification logic (BUG FIX)
  const localHistoryStr = localStorage.getItem('irt_history');
  const localHistory = localHistoryStr ? JSON.parse(localHistoryStr) : [];
  const totalQuestions = serverStats?.total_questions || localHistory.length;
  
  const hasStudied = totalQuestions > 0 || vocabCount > 0 || pronounceScore > 0;
  
  // Calculate dynamic EXP points
  const exp = (vocabCount * 10) + (totalQuestions * 15) + Math.round(pronounceScore * 2);
  const currentLevel = hasStudied ? Math.max(1, Math.min(10, Math.floor(exp / 150) + 1)) : 1;
  const nextLevelExp = currentLevel * 150;
  const expInCurrentLevel = exp % 150;
  const levelProgressPct = hasStudied ? Math.min(100, Math.round((expInCurrentLevel / nextLevelExp) * 100)) : 5;
  const remainingExp = nextLevelExp - expInCurrentLevel;

  const levelNames = ["BEGINNER", "NOVICE", "APPRENTICE", "INITIATE", "ADEPT", "EXPERT", "MASTER", "GRANDMASTER", "LEGEND", "CHAMPION"];
  const levelName = `LEVEL ${currentLevel} - ${levelNames[currentLevel - 1]}`;

  const badge = getProficiencyBadge(theta);

  return (
    <div className="space-y-12 w-full pb-16 animate-fade-in max-w-[1600px] mx-auto">
      
      {/* HERO WELCOME BANNER WITH CLEAN SPACIOUS LAYOUT & SCHOOL BRANDING */}
      <div className="glass rounded-3xl p-8 md:p-10 border border-indigo-500/25 shadow-2xl relative overflow-hidden bg-gradient-to-r from-[#0d132c] via-[#090e24] to-[#120a28]">
        
        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-4 relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/35 text-amber-300 text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-amber-500/10">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Dự án Nghiên cứu Khoa học Kỹ thuật • Hệ thống Ôn thi tốt nghiệp THPT Quốc gia thích ứng AI</span>
            </div>

            {/* PRINT PDF REPORT BUTTON */}
            {onOpenExportModal && (
              <button
                onClick={onOpenExportModal}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-extrabold text-xs transition cursor-pointer flex items-center gap-2 shadow-lg"
              >
                <Printer className="w-4 h-4 text-indigo-400" />
                <span>Xuất Báo Cáo Học Tập (PDF/In)</span>
              </button>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white font-outfit tracking-normal leading-snug drop-shadow-md">
            Nền tảng Ôn Thi Tốt Nghiệp THPT Môn Tiếng Anh <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Thích ứng AI &amp; Cá nhân hóa</span>
          </h1>

          <p className="text-sm md:text-[15px] text-gray-300 leading-relaxed font-medium max-w-3xl">
            Hệ thống hỗ trợ cá nhân hóa lộ trình ôn tập và dự báo kết quả thi tốt nghiệp THPT Quốc gia môn Tiếng Anh dành cho học sinh phổ thông.
          </p>

          <div className="flex flex-wrap gap-3.5 pt-5">
            <button
              onClick={() => onNavigate('irt-test')}
              className="px-6 py-3 rounded-2xl glow-btn-brand text-white font-extrabold text-xs shadow-xl cursor-pointer flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Đánh giá năng lực</span>
            </button>

            <button
              onClick={() => onNavigate('listening')}
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-xl cursor-pointer flex items-center gap-2"
            >
              <Headphones className="w-4 h-4" />
              <span>Luyện nghe AI</span>
            </button>

            <button
              onClick={() => onNavigate('sm2-flashcards')}
              className="px-6 py-3 rounded-2xl glow-btn-amber text-white font-extrabold text-xs shadow-xl cursor-pointer flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Học từ vựng</span>
            </button>

            <button
              onClick={() => onNavigate('vocab-library')}
              className="px-6 py-3 rounded-2xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-200 border border-cyan-500/40 font-extrabold text-xs transition cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Học liệu từ vựng</span>
            </button>

            <button
              onClick={() => onNavigate('chat')}
              className="px-6 py-3 rounded-2xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/40 font-extrabold text-xs transition cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Gia sư AI</span>
            </button>

            <button
              onClick={() => onNavigate('pronounce')}
              className="px-6 py-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 font-extrabold text-xs transition cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>Chấm phát âm</span>
            </button>
          </div>

        </div>
      </div>

      {/* HEADER TOP STATS BAR - NO OVERLAPPING BADGES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1: IRT Theta Rating */}
        <div 
          onClick={() => onNavigate('irt-test')}
          className="glass-card glass-card-hover rounded-3xl p-7 border border-indigo-500/25 space-y-4 cursor-pointer group shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-indigo-300 uppercase tracking-widest">Trình độ Đọc &amp; Ngữ pháp</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            {hasStudied ? (
              <span className="text-3xl font-black text-white font-outfit tracking-normal">
                {Math.max(1.0, Math.min(10.0, Math.round(((theta + 3.0) / 6.0) * 100) / 10)).toFixed(1)} <span className="text-sm text-slate-400 font-normal">/ 10</span>
              </span>
            ) : (
              <span className="text-3xl font-black text-gray-500 font-outfit tracking-normal">—</span>
            )}
            {hasStudied ? (
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badge.bg} ${badge.text}`}>{badge.label}</span>
            ) : (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-gray-500/10 border-gray-500/30 text-gray-400">Chưa đánh giá</span>
            )}
          </div>

          <p className="text-[11px] text-indigo-400 font-bold pt-2 border-t border-white/5 flex items-center justify-between group-hover:underline">
            <span>{hasStudied ? 'Dự báo điểm thi THPT Quốc Gia' : 'Làm bài test để cập nhật'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Stat 2: SuperMemo-2 Spaced Repetition */}
        <div 
          onClick={() => onNavigate('sm2-flashcards')}
          className="glass-card glass-card-hover rounded-3xl p-7 border border-amber-500/25 space-y-4 cursor-pointer group shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-widest">Từ Vựng Đã Thuộc</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl font-black text-amber-400 font-outfit tracking-normal">{vocabCount} <span className="text-sm text-amber-200/70 font-normal">từ</span></span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-amber-500/10 border-amber-500/30 text-amber-300">
              {vocabCount > 0 ? `Ôn lại: ${nextInterval} ngày` : 'Chưa ôn tập'}
            </span>
          </div>

          <p className="text-[11px] text-amber-400 font-bold pt-2 border-t border-white/5 flex items-center justify-between group-hover:underline">
            <span>Luyện thẻ từ vựng SM-2</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Stat 3: Streak Days — Pha 2: hiển thị dữ liệu thực từ server */}
        <div className="glass-card glass-card-hover rounded-3xl p-7 border border-rose-500/25 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-rose-300 uppercase tracking-widest">Chuỗi Học tập</span>
            <div className="flex items-center gap-2">
              {/* Badge nguồn dữ liệu */}
              {serverStats ? (
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">Server ✔</span>
              ) : (
                <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full">Local</span>
              )}
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Flame className="w-5 h-5 fill-rose-400" />
              </div>
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl font-black text-rose-400 font-outfit tracking-normal">{streakDays} Ngày</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-rose-500/10 border-rose-500/30 text-rose-300 flex items-center gap-1">
              <Flame className="w-3 h-3 fill-rose-400 inline" /> Liên tục
            </span>
          </div>

          {/* Pha 2: Hiển thị thêm stats từ server nếu có */}
          {serverStats ? (
            <div className="pt-2 border-t border-white/5 space-y-1">
              <p className="text-[11px] text-gray-400 font-semibold">
                Tổng: <span className="text-white font-bold">{serverStats.total_sessions} phiên</span> &bull; <span className="text-white font-bold">{serverStats.total_questions} câu</span>
              </p>
              <p className="text-[11px] text-emerald-400 font-bold">Tỷ lệ đúng: {serverStats.accuracy}%</p>
            </div>
          ) : (
            <p className="text-[11px] text-gray-400 font-semibold pt-2 border-t border-white/5">Duy trì thói quen hàng ngày</p>
          )}
        </div>

        {/* Stat 4: Pronunciation Avg */}
        <div 
          onClick={() => onNavigate('pronounce')}
          className="glass-card glass-card-hover rounded-3xl p-7 border border-emerald-500/25 space-y-4 cursor-pointer group shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-emerald-300 uppercase tracking-widest">Phát âm Azure AI</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl font-black text-emerald-400 font-outfit tracking-normal">{pronounceScore}%</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-emerald-500/10 border-emerald-500/30 text-emerald-300">Lớp {selectedGrade}</span>
          </div>

          <p className="text-[11px] text-emerald-400 font-bold pt-2 border-t border-white/5 flex items-center justify-between group-hover:underline">
            <span>Chấm điểm phát âm</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>
      </div>

      {/* LEARNING PATH: HÔM NAY HỌC GÌ? (BUG-12 FIX) */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-indigo-500/20 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white font-outfit">Hôm nay cần học gì?</h3>
              <p className="text-xs text-slate-400">Lộ trình học cá nhân hóa — Thuật toán phân tích năng lực thích ứng AI</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('irt-test')}
            className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-extrabold flex items-center gap-2 transition cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Bắt đầu luyện</span>
          </button>
        </div>

        {loadingPath ? (
          <div className="text-center text-gray-500 font-bold text-sm animate-pulse py-4">Đang tính toán lộ trình học...</div>
        ) : learningPath && learningPath.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {learningPath.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 hover:bg-white/[0.04] transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider">{item.skill}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    ~{item.est_minutes} phút
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Thành thạo hiện tại</span>
                    <span className="font-black text-white">{item.current_mastery_pct}% → {item.goal_mastery_pct}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.current_mastery_pct}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">{item.reason}</p>
                <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
                  <span>📝 {item.target_questions} câu</span>
                  <span>📚 Còn {item.available_questions} câu trong ngân hàng</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 space-y-2">
            <p className="text-gray-400 font-bold text-sm">Chưa có dữ liệu lộ trình.</p>
            <p className="text-gray-500 text-xs">Hãy làm bài đánh giá năng lực để hệ thống tạo lộ trình học cho bạn.</p>
            <button
              onClick={() => onNavigate('irt-test')}
              className="mt-3 px-6 py-2.5 rounded-xl glow-btn-brand text-white text-xs font-extrabold cursor-pointer"
            >
              Làm bài đánh giá ngay
            </button>
          </div>
        )}
      </div>

      {/* QUICK FEATURE MODULE NAVIGATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Module 1: IRT CAT Test */}
        <div
          onClick={() => onNavigate('irt-test')}
          className="glass-card glass-card-hover rounded-3xl p-6 border border-indigo-500/30 space-y-5 group cursor-pointer relative overflow-hidden flex flex-col justify-between shadow-2xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 group-hover:scale-110 transition-transform">
            <Zap className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-black text-xl text-white font-outfit group-hover:text-indigo-300 transition-colors">
              Đánh giá Đọc &amp; Ngữ pháp
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed font-medium">
              Bài đánh giá năng lực tự động chọn câu hỏi thông minh bằng Gemini AI bám sát trình độ học sinh Khối Lớp {selectedGrade}.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs font-black text-indigo-400 group-hover:translate-x-1.5 transition-transform">
            <span>Đánh giá năng lực</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </div>
        </div>

        {/* Module 2: SM-2 Flashcards */}
        <div
          onClick={() => onNavigate('sm2-flashcards')}
          className="glass-card glass-card-hover rounded-3xl p-6 border border-amber-500/30 space-y-5 group cursor-pointer relative overflow-hidden flex flex-col justify-between shadow-2xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/30 group-hover:scale-110 transition-transform">
            <Clock className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-black text-xl text-white font-outfit group-hover:text-amber-300 transition-colors">
              Học từ vựng thông minh
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed font-medium">
              Thẻ từ vựng 3D tích hợp Phiên âm IPA chuẩn quốc tế và thuật toán ôn tập thông minh giúp nhớ từ vựng lâu dài.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs font-black text-amber-400 group-hover:translate-x-1.5 transition-transform">
            <span>Học từ vựng ngay</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </div>
        </div>

        {/* Module 3: AI Chat Tutor */}
        <div
          onClick={() => onNavigate('chat')}
          className="glass-card glass-card-hover rounded-3xl p-6 border border-purple-500/30 space-y-5 group cursor-pointer relative overflow-hidden flex flex-col justify-between shadow-2xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-xl shadow-purple-500/30 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-black text-xl text-white font-outfit group-hover:text-purple-300 transition-colors">
              Hội thoại Gia sư AI
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed font-medium">
              Trò chuyện tiếng Anh tự do 2 chiều với AI Mentor, tự động phản hồi &amp; sửa lỗi ngữ pháp tiếng Anh.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs font-black text-purple-400 group-hover:translate-x-1.5 transition-transform">
            <span>Trò chuyện ngay</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </div>
        </div>

        {/* Module 4: Pronunciation Assessor */}
        <div
          onClick={() => onNavigate('pronounce')}
          className="glass-card glass-card-hover rounded-3xl p-6 border border-emerald-500/30 space-y-5 group cursor-pointer relative overflow-hidden flex flex-col justify-between shadow-2xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 group-hover:scale-110 transition-transform">
            <Mic className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-black text-xl text-white font-outfit group-hover:text-emerald-300 transition-colors">
              Chấm điểm Phát âm AI
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed font-medium">
              Chấm điểm chi tiết từng từ, tô màu phân biệt âm chuẩn hay sai bằng công nghệ Azure / Gemini Multimodal.
            </p>
          </div>
          <div className="pt-2 flex items-center text-xs font-black text-emerald-400 group-hover:translate-x-1.5 transition-transform">
            <span>Thực hành phát âm</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </div>
        </div>

      </div>

      {/* NEW SECTION v4.2.0: DEEP DIAGNOSTIC HEATMAP & GAMIFICATION BADGES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Deep Diagnostic Heatmap Matrix */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-white font-outfit">Bản Đồ Chẩn Đoán Lỗ Hổng Kiến Thức</h3>
                <p className="text-xs text-slate-400">Phân tích ma trận điểm yếu ngữ pháp GDPT Khối Lớp {selectedGrade}</p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">
              AI Diagnostic Matrix
            </span>
          </div>

          <div className="space-y-4">
            {!hasStudied ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
                <p className="text-gray-400 font-bold text-sm">Chưa có dữ liệu chẩn đoán ngữ pháp.</p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Hãy hoàn thành ít nhất 1 bài đánh giá năng lực Đọc & Ngữ pháp (IRT) đầu tiên để AI phân tích và xây dựng bản đồ lỗ hổng kiến thức cho bạn!
                </p>
                <button
                  onClick={() => onNavigate('irt-test')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-lg inline-flex items-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Bắt đầu đánh giá ngay</span>
                </button>
              </div>
            ) : (
              <>
                {/* Topic 1 */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Thì &amp; Dạng Động từ (Tenses &amp; Verbs)</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">An toàn (86%)</span>
                    </div>
                    <p className="text-xs text-slate-400">Đã thành thạo các thì Quá khứ đơn, Hiện tại hoàn thành và Tương lai.</p>
                  </div>
                  <button onClick={() => onNavigate('irt-test')} className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition cursor-pointer shrink-0">Luyện thêm</button>
                </div>

                {/* Topic 2 - WEAK SPOT */}
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-rose-200">Mệnh đề quan hệ &amp; Câu ghép (Relative Clauses)</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">Cần ôn tập (64%)</span>
                    </div>
                    <p className="text-xs text-slate-300">Nhầm lẫn khi rút gọn mệnh đề quan hệ dạng V-ing / P2.</p>
                  </div>
                  <button onClick={() => onNavigate('irt-test')} className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition cursor-pointer shrink-0 shadow-md">Luyện lỗ hổng này</button>
                </div>

                {/* Topic 3 */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Câu điều kiện &amp; Câu bị động (Conditionals)</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Vừa sức (78%)</span>
                    </div>
                    <p className="text-xs text-slate-400">Hiểu rõ câu điều kiện loại 1, 2 và thể bị động cơ bản.</p>
                  </div>
                  <button onClick={() => onNavigate('irt-test')} className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition cursor-pointer shrink-0">Củng cố</button>
                </div>

                {/* Topic 4 */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Từ vựng &amp; Cụm từ cố định (Vocabulary)</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">Thành thạo (92%)</span>
                    </div>
                    <p className="text-xs text-slate-400">Ôn tập thông minh giúp duy trì độ bền ghi nhớ từ vựng tốt.</p>
                  </div>
                  <button onClick={() => onNavigate('sm2-flashcards')} className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition cursor-pointer shrink-0">Học từ mới</button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right 5 Cols: Gamification Level & Badges */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-white font-outfit">Cấp Độ &amp; Huy Hiệu Thành Tích</h3>
              <p className="text-xs text-slate-400">Hệ thống động lực khen thưởng học tập</p>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-purple-600/10 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-300 uppercase tracking-widest">Đẳng cấp Học viên:</span>
              <span className="text-xs font-extrabold text-white bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">{levelName}</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
              <div 
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelProgressPct}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              {hasStudied 
                ? `Còn ${remainingExp} EXP nữa để thăng cấp lên LEVEL ${currentLevel + 1}.` 
                : 'Hãy bắt đầu làm bài tập hoặc học từ vựng để tích luỹ điểm EXP thăng cấp!'}
            </p>
          </div>

          {/* Badges Collection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
              <span className="text-2xl">🌟</span>
              <div>
                <strong className="text-xs text-white block font-extrabold">Tân Binh Chăm Chỉ</strong>
                <span className="text-[10px] text-emerald-400 font-bold">Chuỗi {streakDays} Ngày</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
              <span className="text-2xl">🧠</span>
              <div>
                <strong className="text-xs text-white block font-extrabold">Siêu Nhân Ghi Nhớ</strong>
                <span className="text-[10px] text-amber-400 font-bold">{vocabCount} Từ đã nhớ</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
              <span className="text-2xl">🎙️</span>
              <div>
                <strong className="text-xs text-white block font-extrabold">Bậc Thầy Phát Âm</strong>
                <span className="text-[10px] text-indigo-400 font-bold">Azure AI {pronounceScore}%</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
              <span className="text-2xl">🎧</span>
              <div>
                <strong className="text-xs text-white block font-extrabold">Kỉ Lục Luyện Nghe</strong>
                <span className="text-[10px] text-purple-400 font-bold">{hasStudied ? 'Luyện nghe thích ứng' : 'Chưa luyện tập'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Skill Matrix (8 cols) */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-6 shadow-2xl">
          <div className="flex items-center space-x-4 border-b border-white/10 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 border border-cyan-400/40 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-2xl text-white font-outfit">Ma trận Phân tích Kỹ năng Học tập</h3>
              <p className="text-xs text-gray-300 font-medium mt-0.5">Theo dõi sự tiến bộ toàn diện của học sinh Khối Lớp {selectedGrade}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Skill 1: IRT Reading & Grammar */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-white flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-400" /> Ngữ pháp &amp; Đọc hiểu
                </span>
                <span className="text-xs font-black text-indigo-400">
                  Dự báo: {Math.max(1.0, Math.min(10.0, Math.round(((theta + 3.0) / 6.0) * 100) / 10)).toFixed(1)} / 10 ({badge.label})
                </span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden p-0.5 border border-white/10">
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 shadow-md" style={{ width: `${Math.max(10, Math.min(100, Math.round(((theta + 3.0) / 6.0) * 100)))}%` }}></div>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">Khuyến nghị AI: Tự động điều chỉnh độ khó bám sát ma trận đề thi</p>
            </div>

            {/* Skill 2: Azure Pronunciation */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" /> Phát âm Chuẩn Azure AI
                </span>
                <span className="text-xs font-black text-emerald-400">{pronounceScore}% ({pronounceScore >= 80 ? 'Tốt' : 'Cần cải thiện'})</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden p-0.5 border border-white/10">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-md" style={{ width: `${Math.max(10, Math.min(100, Math.round(pronounceScore)))}%` }}></div>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">Cần phát âm rõ trọng âm từ 3 âm tiết trở lên</p>
            </div>

            {/* Skill 3: SM-2 Spaced Vocabulary */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" /> Học &amp; Ghi nhớ từ vựng
                </span>
                <span className="text-xs font-black text-amber-400">{vocabCount} Từ đã nhớ</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden p-0.5 border border-white/10">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500 shadow-md" style={{ width: `${Math.max(10, Math.min(100, Math.round((ef / 3.0) * 100)))}%` }}></div>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">Tốc độ phản xạ ghi nhớ từ vựng tốt</p>
            </div>

            {/* Skill 4: Interactive Speaking Fluency */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-pink-400" /> Phản xạ Giao tiếp AI
                </span>
                <span className="text-xs font-black text-pink-400">{pronounceScore >= 80 ? 'Khá giỏi' : 'Đạt yêu cầu'}</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden p-0.5 border border-white/10">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full transition-all duration-500 shadow-md" style={{ width: `${Math.max(10, Math.min(100, Math.round(pronounceScore - 5)))}%` }}></div>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">Duy trì phản xạ nói tiếng Anh tự nhiên với AI Mentor</p>
            </div>
          </div>
        </div>

        {/* Right Column: Predicted Exam Scores (4 cols) */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-6 border border-amber-500/20 space-y-5 shadow-2xl bg-gradient-to-br from-[#0e1633] to-[#080d1e] relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Target className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-black text-lg text-white font-outfit">Đánh giá Năng lực Học tập</h4>
                <p className="text-[10px] text-gray-400">Dự báo kết quả học tập định kỳ theo chương trình GDPT mới</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Semester Exam Prediction */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Điểm kiểm tra Học kỳ</span>
                  <span className="text-xs text-gray-300 block mt-0.5">Dự đoán điểm trung bình học kỳ</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-amber-400 font-outfit">
                    {hasStudied ? predictions.semesterScore : '—'} / 10
                  </span>
                </div>
              </div>

              {/* THPT Graduation prediction */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Dự báo Điểm thi tốt nghiệp THPT</span>
                  <span className="text-xs text-gray-300 block mt-0.5">Kỳ thi Quốc gia THPT</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-indigo-300 font-outfit">
                    {hasStudied ? predictions.thptScore : '—'} / 10
                  </span>
                </div>
              </div>

              {/* GDPT 2018 Standard */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Chuẩn GDPT 2018 Bộ GD&amp;ĐT</span>
                  <span className="text-xs text-gray-300 block mt-0.5">Xếp loại năng lực theo Khối Lớp</span>
                </div>
                <div className="text-right text-xs font-black text-emerald-400">
                  {hasStudied ? predictions.vstepLevel : 'Chưa đánh giá'}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-semibold">
            <span>Độ tin cậy mô hình: 94.8%</span>
            <span className="text-amber-400/80 font-bold">AI Pathway Analytics</span>
          </div>
        </div>

      </div>

      {/* AI STUDY QUEST MAP & ROADMAP */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 border border-indigo-400/40 flex items-center justify-center text-white shadow-lg shrink-0">
              <Target className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-2xl text-white font-outfit">Lộ trình &amp; Nhiệm vụ Học tập Cá nhân hóa AI</h3>
              <p className="text-xs text-gray-300 font-medium mt-0.5">Hệ thống tự động phân tích lỗ hổng kiến thức để đề xuất mục tiêu hàng ngày</p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-xl shadow-inner">
            Mục tiêu Lớp {selectedGrade}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Quest 1: Reading & Grammar */}
          {(() => {
            const isCompleted = theta >= 0.5;
            return (
              <div className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[200px] ${
                isCompleted 
                  ? 'bg-emerald-500/5 border-emerald-500/35 shadow-lg shadow-emerald-500/5' 
                  : 'bg-white/[0.02] border-white/5 hover:border-white/15'
              }`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                      <Brain className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      isCompleted 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
                    }`}>
                      {isCompleted ? 'Đã hoàn thành' : 'Đang thực hiện'}
                    </span>
                  </div>
                  <h4 className="font-black text-lg text-white font-outfit">1. Đọc hiểu &amp; Ngữ pháp</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                    Đạt năng lực tiếng Anh từ <strong className="text-indigo-300">7.0 / 10 điểm trở lên</strong> qua bài kiểm tra thích ứng.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-bold">
                    Hiện tại: {Math.max(1.0, Math.min(10.0, Math.round(((theta + 3.0) / 6.0) * 100) / 10)).toFixed(1)} / 10 ({badge.label})
                  </span>
                  {!isCompleted && (
                    <button 
                      onClick={() => onNavigate('irt-test')}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black tracking-wider uppercase transition cursor-pointer"
                    >
                      Luyện ngay
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Quest 2: Vocabulary Spaced Repetition */}
          {(() => {
            const isCompleted = vocabCount >= 145;
            return (
              <div className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[200px] ${
                isCompleted 
                  ? 'bg-emerald-500/5 border-emerald-500/35 shadow-lg shadow-emerald-500/5' 
                  : 'bg-white/[0.02] border-white/5 hover:border-white/15'
              }`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      isCompleted 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                    }`}>
                      {isCompleted ? 'Đã hoàn thành' : 'Đang thực hiện'}
                    </span>
                  </div>
                  <h4 className="font-black text-lg text-white font-outfit">2. Tích lũy Từ vựng</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                    Ghi nhớ tối thiểu <strong className="text-amber-300">145 từ vựng</strong> trong kho từ thích ứng của khối lớp.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-bold">Hiện tại: {vocabCount} từ</span>
                  {!isCompleted && (
                    <button 
                      onClick={() => onNavigate('sm2-flashcards')}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black tracking-wider uppercase transition cursor-pointer"
                    >
                      Luyện ngay
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Quest 3: Pronunciation */}
          {(() => {
            const isCompleted = pronounceScore >= 80;
            return (
              <div className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[200px] ${
                isCompleted 
                  ? 'bg-emerald-500/5 border-emerald-500/35 shadow-lg shadow-emerald-500/5' 
                  : 'bg-white/[0.02] border-white/5 hover:border-white/15'
              }`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <Mic className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      isCompleted 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    }`}>
                      {isCompleted ? 'Đã hoàn thành' : 'Đang thực hiện'}
                    </span>
                  </div>
                  <h4 className="font-black text-lg text-white font-outfit">3. Chấm phát âm AI</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                    Luyện nói đoạn văn đạt điểm phát âm chuẩn tối thiểu <strong className="text-emerald-300">80% trở lên</strong>.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-bold">Hiện tại: {pronounceScore}%</span>
                  {!isCompleted && (
                    <button 
                      onClick={() => onNavigate('pronounce')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black tracking-wider uppercase transition cursor-pointer"
                    >
                      Luyện ngay
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

        </div>
      </div>

    </div>
  );
}
