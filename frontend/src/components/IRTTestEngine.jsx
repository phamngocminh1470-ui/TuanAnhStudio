import React, { useState, useEffect } from 'react';
import { 
  Zap, Brain, RefreshCw, CheckCircle2, XCircle, ArrowRight, Activity, 
  HelpCircle, Sparkles, Award, BarChart3, Layers, Filter, Check,
  Clock, ShieldAlert, ArrowLeft, RotateCw
} from 'lucide-react';
import axios from 'axios';
import { useUserProgress } from '../hooks/useUserProgress';
import SyncStatusBadge from './SyncStatusBadge';

const API_BASE = '/api';

export default function IRTTestEngine({ selectedGrade, currentUser }) {
  const [activeTabMode, setActiveTabMode] = useState('topics'); // 'topics' | 'parts'
  const [selectedDifficulty, setSelectedDifficulty] = useState('all'); // 'all' | 'easy' | 'medium' | 'hard'
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedPart, setSelectedPart] = useState('all');

  const [theta, setTheta] = useState(() => {
    const saved = localStorage.getItem('user_theta');
    return saved ? parseFloat(saved) : 0.0;
  });
  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  
  // Multi-part support (Part 2: True/False statements; Part 3: Short answer)
  const [tfSelections, setTfSelections] = useState({}); // e.g. { 'a': true, 'b': false, ... }
  const [shortAnswerInput, setShortAnswerInput] = useState('');

  const [questionFeedback, setQuestionFeedback] = useState(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  
  const [irtHistory, setIrtHistory] = useState(() => {
    const saved = localStorage.getItem('irt_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter(h => h.itemId && !['Q105', 'Q107', 'Q108'].includes(h.itemId));
      } catch (e) {}
    }
    return [];
  });

  const [recommendationReason, setRecommendationReason] = useState('');
  const [skillMastery, setSkillMastery] = useState(() => {
    const saved = localStorage.getItem('skill_mastery');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });
  const [lastDiagnostics, setLastDiagnostics] = useState(null);

  const { syncStatus, lastSyncAt, saveToServer, loadFromServer, isLoggedIn } = useUserProgress();

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
  }, [currentUser]);

  // Topic definitions
  const topicList = [
    { id: 'all', name: 'Tất cả chủ đề', count: '480 câu' },
    { id: 'grammar', name: 'Ngữ pháp & Cấu trúc thì', count: '140 câu' },
    { id: 'reading', name: 'Đọc hiểu & Suy luận ý', count: '120 câu' },
    { id: 'vocab', name: 'Từ vựng & Cụm Collocations', count: '110 câu' },
    { id: 'comm', name: 'Giao tiếp & Ngữ dụng học', count: '60 câu' },
    { id: 'writing', name: 'Biến đổi câu & Viết lại', count: '50 câu' }
  ];

  // Part format definitions (GD&ĐT 2025-2027)
  const partList = [
    { id: 'all', name: 'Toàn bộ định dạng (Part 1 - 3)', desc: 'Tổng hợp mọi định dạng câu hỏi' },
    { id: 'part1', name: 'Phần I: Trắc nghiệm 4 lựa chọn (MCQ)', desc: 'Chọn 1 phương án đúng A, B, C, D' },
    { id: 'part2', name: 'Phần II: Đúng / Sai 4 mệnh đề', desc: 'Xác định Đúng/Sai cho 4 ý a, b, c, d' },
    { id: 'part3', name: 'Phần III: Trả lời ngắn / Điền từ', desc: 'Tự điền câu trả lời ngắn vào ô input' }
  ];

  // FETCH NEXT QUESTION
  const fetchNextQuestion = async () => {
    setLoadingQuestion(true);
    setSelectedOption(null);
    setTfSelections({});
    setShortAnswerInput('');
    setQuestionFeedback(null);

    try {
      const res = await axios.post(`${API_BASE}/adaptive/generate-question`, {
        grade: selectedGrade,
        theta: theta,
        history: irtHistory,
        topic: selectedTopic !== 'all' ? selectedTopic : undefined,
        part: selectedPart !== 'all' ? selectedPart : undefined,
        difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined
      }).catch(() => null);

      if (res && res.data && res.data.question) {
        setCurrentQuestion(res.data.question);
        if (res.data.recommendation_reason) {
          setRecommendationReason(res.data.recommendation_reason);
        }
        if (res.data.skill_mastery) {
          setSkillMastery(res.data.skill_mastery);
        }
      } else {
        // High-quality fallback question formatted for THPT 2027
        if (selectedPart === 'part2') {
          setCurrentQuestion({
            item_id: 'IRT_TF_001',
            task_type: 'Phần II: Đúng / Sai',
            question: 'Xét tính Đúng (Đ) hoặc Sai (S) của các nhận định dưới đây về việc sử dụng Trí tuệ Nhân tạo (AI) trong học tập Tiếng Anh:',
            statements: [
              { key: 'a', text: 'AI có thể phân tích tức thì độ chính xác của từng âm tiết theo bảng phiên âm quốc tế IPA.', correct: true },
              { key: 'b', text: 'Thuật toán SuperMemo-2 yêu cầu người học phải ôn tập lại toàn bộ 1000 từ mỗi ngày.', correct: false },
              { key: 'c', text: 'Mô hình IRT tự động điều chỉnh độ khó câu hỏi dựa vào năng lực thực tế của học sinh.', correct: true },
              { key: 'd', text: 'Học sinh chỉ cần học vẹt đáp án trắc nghiệm mà không cần rèn luyện đọc hiểu theo ngữ cảnh.', correct: false }
            ],
            difficulty: 0.2,
            discrimination: 1.2,
            explanation: 'Ý (a) & (c) đúng theo cơ chế AI/IRT. Ý (b) sai vì SM-2 chia nhỏ khoảng thời gian lặp lại. Ý (d) sai vì GDPT 2018 chú trọng năng lực thực.'
          });
        } else if (selectedPart === 'part3') {
          setCurrentQuestion({
            item_id: 'IRT_SA_001',
            task_type: 'Phần III: Trả lời ngắn',
            question: 'Give the correct form of the word in brackets to complete the sentence:\n"Solar and wind power are excellent examples of ________ energy sources." (RENEW)',
            correct_short: 'renewable',
            difficulty: 0.5,
            discrimination: 1.3,
            explanation: 'Vị trí này cần một tính từ bổ nghĩa cho danh từ "energy sources". Dạng tính từ của "renew" là "renewable" (có thể tái tạo).'
          });
        } else {
          setCurrentQuestion({
            item_id: 'IRT_MCQ_001',
            task_type: 'Phần I: Trắc nghiệm 4 lựa chọn',
            question: 'If students ________ modern AI tools effectively, they would optimize their study time significantly.',
            options: ['A. used', 'B. use', 'C. had used', 'D. will use'],
            correct: 'A',
            difficulty: -0.2,
            discrimination: 1.1,
            explanation: 'Câu điều kiện loại 2 (Second Conditional) diễn tả giả định không có thật ở hiện tại: If + S + V2/ed, S + would + V-inf. Do vế sau có "would optimize" nên chọn "used".'
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingQuestion(false);
    }
  };

  useEffect(() => {
    fetchNextQuestion();
  }, [selectedGrade, selectedTopic, selectedPart, selectedDifficulty]);

  // SUBMIT ANSWER
  const handleAnswerSubmit = async () => {
    if (!currentQuestion) return;

    let isCorrect = false;

    if (currentQuestion.statements) {
      // Part 2: True/False statements
      const keys = currentQuestion.statements.map(s => s.key);
      const allAnswered = keys.every(k => tfSelections[k] !== undefined);
      if (!allAnswered) return;
      const allMatch = currentQuestion.statements.every(s => tfSelections[s.key] === s.correct);
      isCorrect = allMatch;
    } else if (currentQuestion.correct_short) {
      // Part 3: Short answer
      if (!shortAnswerInput.trim()) return;
      isCorrect = shortAnswerInput.trim().toLowerCase() === currentQuestion.correct_short.trim().toLowerCase();
    } else {
      // Part 1: MCQ
      if (!selectedOption) return;
      isCorrect = selectedOption === currentQuestion.correct;
    }

    let newThetaFormatted = theta;
    const isResponseCorrectInt = isCorrect ? 1 : 0;

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

      historyPayload.push({
        question: {
          item_id: currentQuestion.item_id,
          difficulty: currentQuestion.difficulty || 0.0,
          discrimination: currentQuestion.discrimination || 1.0,
          guessing: currentQuestion.guessing || 0.2
        },
        response: isResponseCorrectInt
      });

      const res = await axios.post(`${API_BASE}/adaptive/update-ability`, {
        history: historyPayload,
        student_id: currentUser?.username || localStorage.getItem('user_id') || 'student_test',
        experiment_group: currentUser?.experiment_group || localStorage.getItem('experiment_group') || 'ADAPTIVE',
        repetition_engine: localStorage.getItem('spaced_repetition_engine') || 'SM2'
      });

      if (res.data && res.data.new_theta !== undefined) {
        newThetaFormatted = Number(res.data.new_theta.toFixed(3));
        if (res.data.diagnostics) setLastDiagnostics(res.data.diagnostics);
        if (res.data.skill_mastery) setSkillMastery(res.data.skill_mastery);
      }
    } catch (err) {
      const updatedTheta = isCorrect ? Math.min(3.0, theta + 0.18) : Math.max(-3.0, theta - 0.14);
      newThetaFormatted = Number(updatedTheta.toFixed(3));
    }

    const proficiencyPercentage = Math.max(10, Math.min(100, Math.round(((newThetaFormatted + 3.0) / 6.0) * 100)));

    setQuestionFeedback({
      isCorrect,
      message: isCorrect 
        ? `Xuất sắc! Năng lực thích ứng ước lượng: ${proficiencyPercentage}%` 
        : `Chưa chính xác. Năng lực thích ứng ước lượng: ${proficiencyPercentage}%`
    });

    const newStep = {
      step: irtHistory.length + 1,
      itemId: currentQuestion.item_id,
      difficulty: currentQuestion.difficulty || 0.0,
      score: isCorrect ? 100 : 0,
      result: isCorrect ? 1 : 0,
      theta: newThetaFormatted
    };

    const newHistory = [newStep, ...irtHistory];
    setIrtHistory(newHistory);
    setQuestionsAnswered(prev => prev + 1);
    setTheta(newThetaFormatted);

    localStorage.setItem('user_theta', newThetaFormatted.toString());
    localStorage.setItem('irt_history', JSON.stringify(newHistory));

    await saveToServer({
      theta: newThetaFormatted,
      theta_before: theta,
      skill_mastery: skillMastery || undefined,
      irt_history_step: newStep,
      session_type: 'irt_test',
      questions_answered: 1,
      correct_count: isCorrect ? 1 : 0,
      skill_focus: currentQuestion.task_type || '',
    });
  };

  const getAbilityBadge = (val) => {
    if (val < -1.0) return { label: 'Sơ cấp (A1)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    if (val < 0.5) return { label: 'Đạt yêu cầu (A2)', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
    if (val < 1.8) return { label: 'Khá giỏi (B1)', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
    return { label: 'Xuất sắc (B2/C1)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  };

  const badge = getAbilityBadge(theta);
  const totalQuestions = irtHistory.length;
  const correctQuestions = irtHistory.filter(h => h.result === 1).length;
  const rawAccuracyRate = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

  return (
    <div className="w-full space-y-6 pb-16 animate-fade-in">
      {/* ─── 1. TOP HEADER & METRICS BAR ──────────────────────────────────── */}
      <div className="glass rounded-2xl p-6 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Luyện Đề &amp; Đánh Giá Năng Lực</h1>
              <span className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">
                Khối Lớp {selectedGrade}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Chuẩn cấu trúc Đổi mới GD&amp;ĐT 2025-2027 • Tự động thích ứng theo mô hình IRT
            </p>
          </div>
        </div>

        {/* Metrics Box */}
        <div className="flex items-center gap-4 bg-[#0a0f1d] border border-white/5 px-4 py-2.5 rounded-xl shrink-0">
          <div className="text-right border-r border-white/10 pr-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Tỉ lệ đúng</span>
            <span className="text-base font-black text-emerald-400 font-mono block">
              {rawAccuracyRate}% <span className="text-[10px] text-slate-500 font-normal">({correctQuestions}/{totalQuestions})</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Trình độ ước tính</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base font-black text-blue-400 font-mono">
                {Math.max(10, Math.min(100, Math.round(((theta + 3.0) / 6.0) * 100)))}%
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                {badge.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. TABS & DIFFICULTY FILTER (Like study.thptai.kr) ───────────── */}
      <div className="space-y-3">
        {/* Mode Selector: Chủ đề (Topics) vs Dạng bài (Parts) */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#0c1220] border border-white/5 max-w-md">
          <button
            onClick={() => { setActiveTabMode('topics'); setSelectedPart('all'); }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTabMode === 'topics'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Chủ đề (Topics)</span>
          </button>

          <button
            onClick={() => { setActiveTabMode('parts'); setSelectedTopic('all'); }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTabMode === 'parts'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Dạng bài (Part 1 - 3)</span>
          </button>
        </div>

        {/* Sub-selector based on Mode */}
        {activeTabMode === 'topics' ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {topicList.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                  selectedTopic === t.id
                    ? 'bg-white/10 text-white border-blue-500/50'
                    : 'bg-[#0d1424] text-slate-400 border-white/5 hover:text-slate-200'
                }`}
              >
                {t.name} <span className="text-[10px] text-slate-500 ml-1">({t.count})</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {partList.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPart(p.id)}
                className={`p-2.5 text-left rounded-xl border transition cursor-pointer ${
                  selectedPart === p.id
                    ? 'bg-[#141f36] border-blue-500/50 text-white'
                    : 'bg-[#0d1424] border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold">{p.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{p.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Difficulty Filter Bar */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" /> Chọn độ khó:
          </span>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'easy', label: '⚡ Dễ (Nhận biết)' },
              { id: 'medium', label: '⚖️ Trung bình (Thông hiểu)' },
              { id: 'hard', label: '🔥 Khó (Vận dụng cao)' }
            ].map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDifficulty(d.id)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                  selectedDifficulty === d.id
                    ? 'bg-white/10 text-white border-white/20'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 3. MAIN QUESTION WORKSPACE ───────────────────────────────────── */}
      <div className="glass-card p-6 md:p-8 border border-white/10 relative overflow-hidden bg-[#0d1424]">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {currentQuestion?.task_type || 'Câu hỏi Trắc nghiệm'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              #{currentQuestion?.item_id || 'IRT'}
            </span>
          </div>

          <button
            onClick={fetchNextQuestion}
            disabled={loadingQuestion}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-white/5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingQuestion ? 'animate-spin text-blue-400' : ''}`} />
            <span>Đổi câu hỏi khác</span>
          </button>
        </div>

        {currentQuestion ? (
          <div className="space-y-6">
            {/* Passage if present */}
            {currentQuestion.passage && (
              <div className="p-5 rounded-2xl bg-[#090d18] border border-white/10 text-slate-200 text-xs md:text-sm leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto space-y-2">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    📄 Văn bản / Bài đọc tham chiếu:
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">SCROLL ĐỂ ĐỌC HẾT</span>
                </div>
                <div className="leading-relaxed font-sans text-slate-300">
                  {currentQuestion.passage}
                </div>
              </div>
            )}

            {/* Smart Vertical Question Renderer (Fixes clumped sentence ordering text) */}
            {(() => {
              const qText = currentQuestion.question || '';
              const regexLettered = /(\([a-g]\)|[a-g]\))\s+/i;
              
              if (regexLettered.test(qText)) {
                const firstMatch = qText.search(/(\([a-g]\)|[a-g]\))\s+/i);
                const preamble = qText.slice(0, firstMatch).trim();
                const body = qText.slice(firstMatch);
                const items = body.split(/(?=(\([a-g]\)|[a-g]\))\s+)/i).filter(p => p && p.trim().length > 0 && !/^(\([a-g]\)|[a-g]\))\s*$/i.test(p));

                return (
                  <div className="space-y-3.5">
                    {preamble && (
                      <div className="text-sm md:text-base font-bold text-white leading-relaxed">
                        {preamble}
                      </div>
                    )}
                    <div className="space-y-2">
                      {items.map((item, idx) => {
                        const matchKey = item.match(/^(\(([a-g])\)|([a-g])\))\s*(.*)/i);
                        const key = matchKey ? (matchKey[2] || matchKey[3]).toLowerCase() : `${idx + 1}`;
                        const content = matchKey ? matchKey[4] : item;
                        return (
                          <div 
                            key={idx}
                            className="flex items-start gap-3 p-3.5 rounded-xl bg-[#101728] border border-white/10 hover:border-blue-500/40 transition text-slate-200 text-xs md:text-sm leading-relaxed group"
                          >
                            <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 group-hover:bg-blue-500 group-hover:text-white transition">
                              {key}
                            </span>
                            <span className="flex-1 font-medium">{content}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <div className="text-sm md:text-base font-semibold text-white leading-relaxed whitespace-pre-wrap">
                  {qText}
                </div>
              );
            })()}

            {/* ── FORMAT 1: MCQ (Single Choice 4 Options) ── */}
            {currentQuestion.options && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {currentQuestion.options.map((opt, idx) => {
                  const letter = opt.charAt(0);
                  const isSelected = selectedOption === letter;
                  const isOrdering = opt.includes(' - ') || opt.includes('-');
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => !questionFeedback && setSelectedOption(letter)}
                      className={`p-4 rounded-xl text-left text-xs md:text-sm font-medium transition cursor-pointer flex items-center justify-between border ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                          : 'bg-[#101728] border-white/5 text-slate-300 hover:bg-[#152038] hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold font-mono text-xs ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400'
                        }`}>
                          {letter}
                        </span>
                        <span className="font-semibold text-white">
                          {opt.replace(/^[A-D]\.\s*/, '')}
                        </span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── FORMAT 2: TRUE / FALSE STATEMENTS ── */}
            {currentQuestion.statements && (
              <div className="space-y-2.5">
                <div className="grid grid-cols-12 text-[11px] font-bold text-slate-400 px-3 pb-1">
                  <div className="col-span-8">Mệnh đề khẳng định</div>
                  <div className="col-span-4 text-right pr-4">Lựa chọn Đúng / Sai</div>
                </div>
                {currentQuestion.statements.map((stmt) => {
                  const currentVal = tfSelections[stmt.key];
                  return (
                    <div 
                      key={stmt.key}
                      className="grid grid-cols-12 items-center p-3.5 rounded-xl bg-[#101728] border border-white/5 gap-3"
                    >
                      <div className="col-span-8 text-xs text-slate-200">
                        <span className="font-bold text-blue-400 mr-2">{stmt.key})</span>
                        {stmt.text}
                      </div>
                      <div className="col-span-4 flex items-center justify-end gap-2">
                        <button
                          onClick={() => !questionFeedback && setTfSelections(prev => ({ ...prev, [stmt.key]: true }))}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                            currentVal === true
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                              : 'bg-white/5 border-transparent text-slate-400 hover:text-white'
                          }`}
                        >
                          Đúng
                        </button>
                        <button
                          onClick={() => !questionFeedback && setTfSelections(prev => ({ ...prev, [stmt.key]: false }))}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                            currentVal === false
                              ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                              : 'bg-white/5 border-transparent text-slate-400 hover:text-white'
                          }`}
                        >
                          Sai
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── FORMAT 3: SHORT ANSWER INPUT ── */}
            {currentQuestion.correct_short && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Nhập câu trả lời của bạn:</label>
                <input
                  type="text"
                  value={shortAnswerInput}
                  onChange={(e) => setShortAnswerInput(e.target.value)}
                  disabled={!!questionFeedback}
                  placeholder="Điền từ hoặc cụm từ thích hợp..."
                  className="w-full bg-[#0a0f1d] border border-white/10 focus:border-blue-500 outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600"
                />
              </div>
            )}

            {/* Feedback & Actions */}
            {questionFeedback ? (
              <div className="space-y-4 animate-fade-in">
                <div className={`p-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-between border ${
                  questionFeedback.isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  <div className="flex items-center gap-2">
                    {questionFeedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />}
                    <span>{questionFeedback.message}</span>
                  </div>
                  <button
                    onClick={fetchNextQuestion}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Câu tiếp theo →
                  </button>
                </div>

                {currentQuestion.explanation && (
                  <div className="p-4 rounded-xl bg-[#090e1a] border border-white/5 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-blue-400 block uppercase text-[10px]">Giải thích đáp án chi tiết:</span>
                    <p className="leading-relaxed">{currentQuestion.explanation}</p>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleAnswerSubmit}
                className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Xác nhận đáp án &amp; Cập nhật năng lực</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-sm">Đang tải câu hỏi...</div>
        )}
      </div>

      {/* ─── 4. HISTORY TABLE ─────────────────────────────────────────────── */}
      {irtHistory.length > 0 && (
        <div className="glass-card p-6 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Nhật ký làm bài gần đây</span>
            </h3>
            <span className="text-[11px] text-slate-500">{irtHistory.length} Lượt hoàn thành</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 font-bold text-[10px] uppercase">
                  <th className="pb-2 px-2">#</th>
                  <th className="pb-2 px-2">Mã câu hỏi</th>
                  <th className="pb-2 px-2">Kết quả</th>
                  <th className="pb-2 px-2">Độ thành thạo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {irtHistory.slice(0, 5).map((h, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-2 text-slate-500">#{h.step}</td>
                    <td className="py-2.5 px-2 font-mono text-slate-300 font-semibold">{h.itemId}</td>
                    <td className="py-2.5 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        h.result === 1 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {h.result === 1 ? 'ĐÚNG' : 'SAI'}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-mono font-bold text-blue-400">
                      {Math.max(10, Math.min(100, Math.round(((h.theta + 3.0) / 6.0) * 100)))}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
