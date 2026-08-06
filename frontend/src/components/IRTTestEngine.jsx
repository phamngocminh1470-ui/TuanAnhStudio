import React, { useState, useEffect } from 'react';
import { 
  Zap, Brain, RefreshCw, CheckCircle2, XCircle, ArrowRight, Activity, 
  HelpCircle, Sparkles, Award, BarChart3, RotateCw 
} from 'lucide-react';
import axios from 'axios';
import { useUserProgress } from '../hooks/useUserProgress';
import SyncStatusBadge from './SyncStatusBadge';

const API_BASE = '/api';

export default function IRTTestEngine({ selectedGrade, currentUser }) {
  const [theta, setTheta] = useState(() => {
    const saved = localStorage.getItem('user_theta');
    return saved ? parseFloat(saved) : 0.0;  // Default 0.0 (theta trung bình)
  });
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionFeedback, setQuestionFeedback] = useState(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  
  // BUG-02 FIX: Xóa dữ liệu giả Q105/Q107/Q108 — khởi tạo rỗng
  const [irtHistory, setIrtHistory] = useState(() => {
    const saved = localStorage.getItem('irt_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Kiểm tra: loại bỏ history giả cũ (Q105, Q107...)
        const filtered = parsed.filter(h => h.itemId && !['Q105', 'Q107', 'Q108'].includes(h.itemId));
        return filtered;
      } catch (e) {}
    }
    return [];
  });

  // State variables for adaptive selection & diagnostics
  const [recommendationReason, setRecommendationReason] = useState('');
  // BUG-10 FIX: Load skillMastery từ localStorage
  const [skillMastery, setSkillMastery] = useState(() => {
    const saved = localStorage.getItem('skill_mastery');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });
  const [lastDiagnostics, setLastDiagnostics] = useState(null);

  // Pha 2: User progress sync
  const { syncStatus, lastSyncAt, saveToServer, loadFromServer, isLoggedIn } = useUserProgress();

  // Pha 2: Load dữ liệu từ server khi mount (nếu đã đăng nhập)
  // Đảm bảo theta/history được phục hồi từ server sau khi reload trang
  useEffect(() => {
    if (!isLoggedIn()) return;
    (async () => {
      try {
        const result = await loadFromServer();
        if (result.success && result.mergedTheta !== undefined) {
          setTheta(result.mergedTheta);
          if (result.mergedHistory) setIrtHistory(result.mergedHistory);
          if (result.mergedMastery && Object.keys(result.mergedMastery).length > 0) {
            setSkillMastery(result.mergedMastery);
          }
        }
      } catch (err) {
        console.warn('[IRT] Could not load progress on mount:', err.message);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);  // Re-run when user changes (login/logout)

  // FETCH NEXT IRT QUESTION (GEMINI AI DYNAMIC GENERATOR)
  const fetchNextQuestion = async () => {
    setLoadingQuestion(true);
    setSelectedOption(null);
    setQuestionFeedback(null);
    try {
      const res = await axios.post(`${API_BASE}/adaptive/generate-question`, {
        grade: selectedGrade,
        theta: theta,
        history: irtHistory
      }).catch(() => null);

      if (res && res.data && res.data.question) {
        setCurrentQuestion(res.data.question);
        if (res.data.recommendation_reason) {
          setRecommendationReason(res.data.recommendation_reason);
        }
        if (res.data.skill_mastery) {
          setSkillMastery(res.data.skill_mastery);
        }
      } else if (res && res.data && res.data.status === 'completed') {
        setCurrentQuestion(null);
        setRecommendationReason(res.data.recommendation_reason || "Đã hoàn thành toàn bộ câu hỏi định chuẩn.");
      } else {
        // Nếu server lỗi kết nối, lấy ngẫu nhiên câu đầu tiên từ ngân hàng câu hỏi định chuẩn
        setCurrentQuestion({
          item_id: 'IRT_Q_001',
          question: 'She usually ________ to school by bicycle every morning, but today she is walking.',
          options: ['A. goes', 'B. go', 'C. is going', 'D. went'],
          correct: 'A',
          difficulty: -1.2,
          discrimination: 1.1,
          explanation: 'Dùng thì Hiện tại đơn (Present Simple) với "usually" để diễn tả thói quen hàng ngày. Chủ ngữ "She" thêm "-s": goes.'
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingQuestion(false);
    }
  };

  useEffect(() => {
    fetchNextQuestion();
  }, [selectedGrade]);

  // SUBMIT IRT ANSWER
  const handleAnswerSubmit = async () => {
    if (!selectedOption || !currentQuestion) return;
    const isCorrect = selectedOption === currentQuestion.correct;
    
    let newThetaFormatted = theta;
    const isResponseCorrectInt = isCorrect ? 1 : 0;

    // Call backend API /api/adaptive/update-ability to compute EAP theta
    try {
      const historyPayload = irtHistory.map(h => ({
        question: {
          item_id: h.itemId,
          difficulty: h.difficulty,
          discrimination: 1.0,
          guessing: 0.2
        },
        response: h.result
      }));
      
      // Add the current answer
      historyPayload.push({
        question: {
          item_id: currentQuestion.item_id,
          difficulty: currentQuestion.difficulty,
          discrimination: currentQuestion.discrimination || 1.0,
          guessing: currentQuestion.guessing || 0.2
        },
        response: isResponseCorrectInt
      });

      const res = await axios.post(`${API_BASE}/adaptive/update-ability`, {
        history: historyPayload,
        student_id: localStorage.getItem('user_id') || 'student_test',
        experiment_group: localStorage.getItem('experiment_group') || 'ADAPTIVE',
        repetition_engine: localStorage.getItem('spaced_repetition_engine') || 'SM2'
      });
      
      if (res.data && res.data.new_theta !== undefined) {
        newThetaFormatted = Number(res.data.new_theta.toFixed(3));
        if (res.data.diagnostics) {
          setLastDiagnostics(res.data.diagnostics);
        } else {
          setLastDiagnostics(null);
        }
        if (res.data.skill_mastery) {
          setSkillMastery(res.data.skill_mastery);
        }
      } else {
        throw new Error("Invalid backend response");
      }
    } catch (err) {
      console.warn("Lỗi tính toán EAP backend, sử dụng thuật toán tính nhanh local:", err);
      const updatedTheta = isCorrect ? Math.min(3.0, theta + 0.18) : Math.max(-3.0, theta - 0.14);
      newThetaFormatted = Number(updatedTheta.toFixed(3));
    }

    // Convert theta to percentage
    const proficiencyPercentage = Math.max(10, Math.min(100, Math.round(((newThetaFormatted + 3.0) / 6.0) * 100)));

    setQuestionFeedback({
      isCorrect,
      message: isCorrect 
        ? `Chính xác! Trình độ thành thạo ước lượng: ${proficiencyPercentage}%` 
        : `Chưa đúng! Đáp án đúng là ${currentQuestion.correct}. Trình độ thành thạo ước lượng: ${proficiencyPercentage}%`
    });

    const newStep = {
      step: irtHistory.length + 1,
      itemId: currentQuestion.item_id,
      difficulty: currentQuestion.difficulty,
      score: isCorrect ? 90 : 50,
      result: isCorrect ? 1 : 0,
      theta: newThetaFormatted
    };

    const newHistory = [newStep, ...irtHistory];
    setIrtHistory(newHistory);
    setQuestionsAnswered(prev => prev + 1);
    setTheta(newThetaFormatted);

    // Lưu vào localStorage (fallback cho user chưa đăng nhập)
    localStorage.setItem('user_theta', newThetaFormatted.toString());
    localStorage.setItem('irt_history', JSON.stringify(newHistory));
    // BUG-10 FIX: Lưu skillMastery vào localStorage để Learning Path có thể đọc
    const latestMastery = (typeof res !== 'undefined' && res?.data?.skill_mastery) ? res.data.skill_mastery : skillMastery;
    if (latestMastery) {
      localStorage.setItem('skill_mastery', JSON.stringify(latestMastery));
    }

    // Pha 2: Lưu lên server dùng hook (xử lý offline, token expired, retry)
    await saveToServer({
      theta: newThetaFormatted,
      theta_before: theta,
      skill_mastery: latestMastery || undefined,
      irt_history_step: newStep,  // hook sẽ wrap thành [newStep] để server append
      session_type: 'irt_test',
      questions_answered: 1,
      correct_count: isCorrect ? 1 : 0,
      skill_focus: currentQuestion.skill || '',
    });
  };

  const getAbilityBadge = (val) => {
    if (val < -1.0) return { label: 'Sơ cấp (A1)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    if (val < 0.5) return { label: 'Đạt yêu cầu (A2)', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
    if (val < 1.8) return { label: 'Khá giỏi (B1)', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
    return { label: 'Xuất sắc (B2/C1)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  };

  const badge = getAbilityBadge(theta);

  // Calculate traditional accuracy metrics to avoid confusing students
  const totalQuestions = irtHistory.length;
  const correctQuestions = irtHistory.filter(h => h.result === 1).length;
  const rawAccuracyRate = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

  return (
    <div className="w-full space-y-12 pb-16 animate-fade-in">
      {/* Header Banner */}
      <div className="glass rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
 
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400/40 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 shrink-0">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-white font-outfit">Đánh giá năng lực Đọc &amp; Ngữ pháp</h1>
              <span className="text-[10px] text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-extrabold">Học tập Thích ứng</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Tự động tối ưu hóa câu hỏi tương thích với độ thành thạo và năng lực thực tế Khối Lớp {selectedGrade}
            </p>
          </div>
        </div>

        {/* Double Metrics Panel: Raw Accuracy Rate & IRT Theta Level */}
        <div className="flex items-center space-x-6 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl shrink-0">
          <div className="text-right border-r border-slate-800 pr-4">
            <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block">Tỷ lệ đúng thực tế</span>
            <span className="text-xl font-black text-emerald-400 font-outfit block mt-0.5">{rawAccuracyRate}%</span>
            <span className="text-[9px] text-slate-500 font-bold block">({correctQuestions}/{totalQuestions} câu đúng)</span>
          </div>

          <div className="text-right">
            <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block">Độ thành thạo ước lượng</span>
            <div className="flex items-center justify-end space-x-2 mt-0.5">
              <span className="text-xl font-black text-indigo-400 font-outfit">{Math.max(10, Math.min(100, Math.round(((theta + 3.0) / 6.0) * 100)))}%</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>{badge.label}</span>
            </div>
          </div>
          {/* Pha 2: Sync Status Badge — hiển thị trạng thái lưu dữ liệu */}
          {isLoggedIn() && (
            <div className="mt-2 flex justify-end">
              <SyncStatusBadge status={syncStatus} lastSyncAt={lastSyncAt} />
            </div>
          )}
        </div>
      </div>

      {/* Main IRT Question Container */}
      <div className="glass-card rounded-3xl p-8 md:p-10 border border-white/10 space-y-8 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-extrabold text-white">Câu hỏi Đánh giá Thích ứng AI</span>
          </div>

          <button
            onClick={fetchNextQuestion}
            disabled={loadingQuestion}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold flex items-center gap-2 transition cursor-pointer border border-white/10"
          >
            <RefreshCw className={`w-4 h-4 ${loadingQuestion ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Đổi câu hỏi mới</span>
          </button>
        </div>

        {/* Question Box */}
        {currentQuestion ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
              <span className="font-bold text-gray-300">Mã câu hỏi: <strong className="text-indigo-400 font-mono">{currentQuestion.item_id}</strong></span>
              <div className="flex items-center gap-3">
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-xl text-gray-300 font-semibold">
                  Mức độ: <strong className="text-amber-400">{currentQuestion.difficulty >= 1.0 ? 'Thử thách' : (currentQuestion.difficulty <= -0.5 ? 'Cơ bản' : 'Vừa sức')}</strong>
                </span>
              </div>
            </div>

            {/* Explainable Recommendation Banner */}
            {recommendationReason && (
              <div className="p-3.5 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-xs text-indigo-300 font-bold">
                💡 <span className="text-gray-400">Độ thích ứng gợi ý:</span> {recommendationReason}
              </div>
            )}

            {/* Passage / Reading / Notice Container */}
            {currentQuestion.passage && (
              <div className="p-5 rounded-2xl bg-[#060a17] border border-indigo-500/30 text-gray-200 text-sm leading-relaxed whitespace-pre-wrap font-sans shadow-inner max-h-80 overflow-y-auto">
                <span className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-wider block mb-2 border-b border-indigo-500/20 pb-1 flex items-center gap-1.5">
                  📄 Văn bản / Bài đọc / Thông báo tham chiếu ({currentQuestion.task_type || 'Đọc hiểu'})
                </span>
                {currentQuestion.passage}
              </div>
            )}

            <div className="p-6 rounded-2xl bg-[#080d1e] border border-indigo-500/20 text-gray-100 font-semibold text-base leading-relaxed shadow-inner">
              {currentQuestion.question}
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((opt, idx) => {
                const letter = opt.charAt(0);
                const isSelected = selectedOption === letter;
                return (
                  <button
                    key={idx}
                    onClick={() => !questionFeedback && setSelectedOption(letter)}
                    className={`p-5 rounded-2xl text-left text-sm font-bold transition-all duration-200 border cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600/25 border-indigo-400 text-white shadow-xl shadow-indigo-500/20 scale-[1.01]'
                        : 'bg-white/[0.02] border-white/5 text-gray-300 hover:bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Feedback / Explanation Box */}
            {questionFeedback ? (
              <div className="space-y-4 animate-fade-in">
                <div className={`p-4 rounded-2xl text-sm font-extrabold flex items-center justify-between ${
                  questionFeedback.isCorrect 
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 shadow-lg' 
                    : 'bg-rose-500/15 border border-rose-500/40 text-rose-300 shadow-lg'
                }`}>
                  <div className="flex items-center gap-3">
                    {questionFeedback.isCorrect ? <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" /> : <XCircle className="w-6 h-6 shrink-0 text-rose-400" />}
                    <span>{questionFeedback.message}</span>
                  </div>
                  <button
                    onClick={fetchNextQuestion}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold flex items-center gap-2 transition cursor-pointer"
                  >
                    <span>Câu tiếp theo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* AI Diagnostics Panel */}
                {lastDiagnostics && !questionFeedback.isCorrect && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 space-y-1.5 animate-fade-in">
                    <span className="font-extrabold uppercase text-rose-400 block">Chẩn đoán lỗi (Diagnostic Engine):</span>
                    <p>{lastDiagnostics.relevance}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Phân loại lỗi: <strong className="text-rose-400 font-mono">{lastDiagnostics.error_category}</strong> (Độ tin cậy của mô hình: {Math.round(lastDiagnostics.confidence_score * 100)}%)</p>
                  </div>
                )}

                {currentQuestion.explanation && (
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 space-y-1">
                    <span className="font-extrabold uppercase text-indigo-400 block">Giải thích đáp án chi tiết:</span>
                    <p className="leading-relaxed">{currentQuestion.explanation}</p>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleAnswerSubmit}
                disabled={!selectedOption}
                className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  selectedOption
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white glow-btn-brand shine-effect'
                    : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                }`}
              >
                <span>Xác nhận đáp án &amp; Cập nhật trình độ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500 font-bold animate-pulse">Đang tải câu hỏi đánh giá thích ứng...</div>
        )}
      </div>

      {/* Trajectory History Logs Table */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-4">
        <h3 className="font-extrabold text-lg text-white font-outfit flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          <span>Nhật ký tiến trình Đánh giá Đọc &amp; Ngữ pháp</span>
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="pb-3 px-3">Lần làm</th>
                <th className="pb-3 px-3">Mã câu hỏi</th>
                <th className="pb-3 px-3">Mức độ câu hỏi</th>
                <th className="pb-3 px-3">Kết quả</th>
                <th className="pb-3 px-3">Độ thành thạo (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-semibold">
              {irtHistory.map((h, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-3 text-gray-400">#{h.step}</td>
                  <td className="py-3 px-3 font-mono text-indigo-400 font-bold">{h.itemId}</td>
                  <td className="py-3 px-3 text-amber-400">{h.difficulty >= 1.0 ? 'Thử thách' : (h.difficulty <= -0.5 ? 'Cơ bản' : 'Vừa sức')} ({h.difficulty})</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${h.result === 1 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                      {h.result === 1 ? 'ĐÚNG' : 'SAI'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-white font-black">{Math.max(10, Math.min(100, Math.round(((h.theta + 3.0) / 6.0) * 100)))}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Skill Mastery Grid (KHKT 2.0 Feature) */}
      {skillMastery && (
        <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-4">
          <h3 className="font-extrabold text-lg text-white font-outfit flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            <span>Phân tích chi tiết từng kỹ năng</span>
          </h3>
          <p className="text-xs text-gray-400">
            Cập nhật tức thì sau mỗi câu hỏi, phản ánh chính xác mức độ thành thạo thực tế của học sinh.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
            {Object.entries(skillMastery).map(([skillName, value]) => {
              const pct = Math.round(value * 100);
              return (
                <div key={skillName} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-300">{skillName}</span>
                    <span className="font-black text-indigo-400">{pct}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
