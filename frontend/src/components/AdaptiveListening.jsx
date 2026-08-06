import React, { useState, useEffect } from 'react';
import { 
  Headphones, Play, Pause, RotateCcw, Volume2, Sparkles, CheckCircle2, XCircle, 
  HelpCircle, Eye, EyeOff, BookOpen, VolumeX, FastForward, Award, ArrowRight, Loader2,
  ListFilter, Target, Globe, BookOpenCheck
} from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api';

export default function AdaptiveListening({ selectedGrade = '10', theta = 0.0 }) {
  // Config States
  const [listeningMode, setListeningMode] = useState('grade'); // 'grade' or 'exam'
  const [activeGrade, setActiveGrade] = useState(selectedGrade);
  const [activeExam, setActiveExam] = useState('KET'); // 'KET', 'PET', 'IELTS'

  const [topicInput, setTopicInput] = useState('');
  const [activeTopic, setActiveTopic] = useState('Công nghệ & Trí tuệ nhân tạo (AI)');
  const [activeTopicVal, setActiveTopicVal] = useState('Technology & AI in Modern Life');
  const [isLoading, setIsLoading] = useState(false);
  const [listeningData, setListeningData] = useState(null);

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showTranscript, setShowTranscript] = useState(true); // Default to true for "nghe song song"

  // Quiz State
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const predefinedTopics = [
    { label: 'Trí tuệ nhân tạo (AI)', val: 'Artificial Intelligence & Robotics' },
    { label: 'Bảo vệ Môi trường', val: 'Environmental Protection & Green Lifestyle' },
    { label: 'Du hành Vũ trụ', val: 'Space Exploration & Galaxies' },
    { label: 'Ẩm thực Việt Nam', val: 'Traditional Vietnamese Cuisine' },
    { label: 'Thể thao & Sức khỏe', val: 'Sports, Fitness and Mental Health' },
    { label: 'Du lịch thế giới', val: 'World Travel & Cultural Diversity' },
    { label: 'Kỹ năng sống học đường', val: 'High School Life & Soft Skills' }
  ];

  // Fetch or generate listening lesson
  const fetchListeningLesson = async (topicToUse, targetGradeOrExam) => {
    setIsLoading(true);
    setListeningData(null);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    setIsPlaying(false);
    window.speechSynthesis?.cancel();

    try {
      const savedGemini = localStorage.getItem('api_gemini') || '';
      const response = await axios.post(
        `${API_BASE}/generate-adaptive-listening`,
        {
          topic: topicToUse,
          grade: targetGradeOrExam,
          theta: theta
        },
        {
          headers: savedGemini ? { 'X-Gemini-Key': savedGemini } : {}
        }
      );

      if (response.data && response.data.listening) {
        setListeningData(response.data.listening);
      }
    } catch (error) {
      console.error('Lỗi khi tải bài nghe thích ứng:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    const targetVal = listeningMode === 'grade' ? activeGrade : activeExam;
    fetchListeningLesson(activeTopicVal, targetVal);
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [listeningMode, activeGrade, activeExam]);

  const handleGenerateCustomTopic = (e) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    setActiveTopic(topicInput.trim());
    setActiveTopicVal(topicInput.trim());
    const targetVal = listeningMode === 'grade' ? activeGrade : activeExam;
    fetchListeningLesson(topicInput.trim(), targetVal);
  };

  const handleSelectPreset = (topicVal, topicLabel) => {
    setActiveTopic(topicLabel);
    setActiveTopicVal(topicVal);
    const targetVal = listeningMode === 'grade' ? activeGrade : activeExam;
    fetchListeningLesson(topicVal, targetVal);
  };

  // Web Speech Synthesis Engine
  const handleTogglePlayAudio = () => {
    if (!listeningData || !listeningData.transcript) return;

    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ Web Speech Synthesis.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(listeningData.transcript);
      utterance.lang = 'en-US';
      utterance.rate = playbackRate;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleRateChange = (newRate) => {
    setPlaybackRate(newRate);
    if (isPlaying && listeningData?.transcript) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(listeningData.transcript);
      utterance.lang = 'en-US';
      utterance.rate = newRate;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeakWord = (word) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Quiz Handling
  const handleSelectAnswer = (qId, optionKey) => {
    if (showResults) return;
    setUserAnswers(prev => ({ ...prev, [qId]: optionKey }));
  };

  const handleSubmitQuiz = () => {
    if (!listeningData || !listeningData.questions) return;
    let correctCount = 0;
    listeningData.questions.forEach(q => {
      const selected = userAnswers[q.id];
      if (selected && selected.startsWith(q.correct)) {
        correctCount += 1;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
      
      {/* Header Panel */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-purple-600/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Headphones className="w-4 h-4 text-purple-400" />
            <span>LUYỆN NGHE SONG SONG &amp; ĐA CẤP ĐỘ</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white font-outfit leading-relaxed">
            Hệ thống Luyện Nghe AI Thích ứng Cấp độ
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
            Tự chọn luyện nghe theo chương trình Phổ thông (Lớp 6-12) hoặc theo chứng chỉ Quốc tế (KET, PET, IELTS). Nghe kết hợp đọc lời song song và ôn tập trắc nghiệm thông minh.
          </p>
        </div>

        {/* Level Selectors & Category Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 border-t border-white/5">
          {/* Mode Selector */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ListFilter className="w-3.5 h-3.5 text-purple-400" /> Chọn hệ luyện nghe:
            </span>
            <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setListeningMode('grade')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  listeningMode === 'grade' 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hệ Phổ thông (Grade)
              </button>
              <button
                onClick={() => setListeningMode('exam')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  listeningMode === 'exam' 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hệ Chứng chỉ (KET/PET/IELTS)
              </button>
            </div>
          </div>

          {/* Level Filter Dropdowns */}
          <div className="md:col-span-8 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-400" /> Chọn cấp độ chi tiết:
            </span>
            
            {listeningMode === 'grade' ? (
              <div className="flex flex-wrap gap-2">
                {['6', '7', '8', '9', '10', '11', '12'].map((gr) => (
                  <button
                    key={gr}
                    onClick={() => setActiveGrade(gr)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
                      activeGrade === gr
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                        : 'bg-slate-800/50 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    Lớp {gr}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex gap-2">
                {[
                  { id: 'KET', label: 'KET Listening (CEFR A2)' },
                  { id: 'PET', label: 'PET Listening (CEFR B1)' },
                  { id: 'IELTS', label: 'IELTS Listening (CEFR B2/C1)' }
                ].map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => setActiveExam(ex.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer border flex-1 md:flex-initial text-center ${
                      activeExam === ex.id
                        ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50 shadow-md'
                        : 'bg-slate-800/50 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preset Topics Recommendation */}
        <div className="pt-4 border-t border-white/5 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Gợi ý chủ đề bài nghe:</span>
          <div className="flex flex-wrap gap-2">
            {predefinedTopics.map((pt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(pt.val, pt.label)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                  activeTopic === pt.label
                    ? 'bg-purple-600/20 text-purple-300 border-purple-500/50 shadow-md'
                    : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                {pt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <form onSubmit={handleGenerateCustomTopic} className="flex gap-3">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Nhập chủ đề tự chọn khác (vd: Football, Robotics, K-pop, Travelling...)"
            className="flex-1 px-4 py-3.5 rounded-2xl bg-slate-950/70 border border-slate-700 text-white text-sm focus:outline-none focus:border-purple-500 transition placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={isLoading || !topicInput.trim()}
            className="px-6 py-3.5 rounded-2xl glow-btn-brand font-bold text-xs text-white disabled:opacity-50 cursor-pointer flex items-center gap-2 shrink-0 animate-pulse"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Sinh bài nghe AI</span>
          </button>
        </form>
      </div>

      {/* Main Parallel Learning Screen */}
      {isLoading ? (
        <div className="glass-card rounded-3xl p-16 text-center space-y-4 border border-purple-500/20">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
          <h3 className="text-xl font-bold text-white font-outfit">AI English Speaker đang biên soạn bài nghe...</h3>
          <p className="text-slate-400 text-sm">
            Tạo văn bản và câu hỏi theo chuẩn {listeningMode === 'grade' ? `Lớp ${activeGrade}` : activeExam}.
          </p>
        </div>
      ) : listeningData ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: AUDIO PLAYER & TRANSCRIPT (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Audio Controller Card */}
            <div className="glass-card glass-premium rounded-3xl p-6 border border-purple-500/30 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">
                    Đề bài: {listeningMode === 'grade' ? `Lớp ${activeGrade}` : activeExam}
                  </span>
                  <span className="text-xs text-slate-300 font-bold">Chủ đề: {listeningData.topic}</span>
                </div>

                {/* Show/Hide Script */}
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  {showTranscript ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{showTranscript ? 'Ẩn lời thoại' : 'Hiện lời thoại'}</span>
                </button>
              </div>

              {/* Play Pause Trigger */}
              <div className="flex items-center gap-4 bg-[#080d1e]/80 p-4 rounded-2xl border border-purple-500/10">
                <button
                  onClick={handleTogglePlayAudio}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-white transition transform active:scale-95 cursor-pointer shadow-md ${
                    isPlaying 
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20' 
                      : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20'
                  }`}
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                </button>
                <div>
                  <strong className="text-xs text-white block">
                    {isPlaying ? 'Đang đọc bài nghe AI...' : 'Nhấp nút để phát âm thanh'}
                  </strong>
                  <span className="text-[10px] text-slate-400">Giọng đọc Anh - Mỹ (AI Engine)</span>
                </div>
              </div>

              {/* Speed Controller */}
              <div className="flex items-center justify-between gap-2 bg-slate-950/70 px-4 py-2.5 rounded-xl border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Tốc độ phát:</span>
                <div className="flex gap-1.5">
                  {[0.8, 1.0, 1.2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleRateChange(rate)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition cursor-pointer ${
                        playbackRate === rate
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Read-Along Transcript Card ("Nghe song song") */}
            <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpenCheck className="w-4 h-4 text-purple-400" /> Lời thoại song hành (Transcript)
                </span>
              </div>

              {showTranscript ? (
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-900">
                  <p className="text-slate-200 text-base leading-loose font-normal text-justify">
                    {listeningData.transcript}
                  </p>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl space-y-2">
                  <VolumeX className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>Lời thoại đang ẩn để rèn phản xạ nghe thuần túy.</p>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: QUIZ & VOCABULARY (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Listening Quiz Questions */}
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-outfit">
                    Bài tập Trắc nghiệm Nghe hiểu
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">Chọn đáp án đúng nhất theo nội dung file âm thanh.</p>
                </div>
                {showResults && (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-xs">
                    Đúng: {score}/{listeningData.questions.length} câu
                  </span>
                )}
              </div>

              <div className="space-y-5">
                {listeningData.questions.map((q, idx) => {
                  const selected = userAnswers[q.id];
                  return (
                    <div key={q.id || idx} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
                      <h4 className="font-semibold text-white text-sm leading-relaxed">
                        <span className="text-purple-400 font-extrabold mr-2">Câu {idx + 1}:</span>
                        {q.question}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options.map((opt, oIdx) => {
                          const optionLetter = opt.charAt(0);
                          const isSelected = selected === opt;
                          const isOptionCorrect = optionLetter === q.correct;

                          let btnStyle = 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border-slate-800';
                          if (showResults) {
                            if (isOptionCorrect) {
                              btnStyle = 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold';
                            } else if (isSelected && !isOptionCorrect) {
                              btnStyle = 'bg-rose-600/20 border-rose-500 text-rose-300 font-bold';
                            }
                          } else if (isSelected) {
                            btnStyle = 'bg-purple-600/20 border-purple-500 text-purple-300 font-bold';
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={showResults}
                              onClick={() => handleSelectAnswer(q.id, opt)}
                              className={`p-3 rounded-xl border text-left text-xs leading-relaxed transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {showResults && isOptionCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                              {showResults && isSelected && !isOptionCorrect && <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {showResults && q.explanation && (
                        <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/10 text-[11px] text-indigo-300 leading-relaxed">
                          <strong>Giải thích:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              {!showResults ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length < listeningData.questions.length}
                  className="w-full py-3.5 rounded-xl glow-btn-brand text-white font-extrabold text-xs disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  Nộp bài &amp; Check đáp án chi tiết
                </button>
              ) : (
                <button
                  onClick={() => {
                    const targetVal = listeningMode === 'grade' ? activeGrade : activeExam;
                    fetchListeningLesson(activeTopicVal, targetVal);
                  }}
                  className="w-full py-3.5 rounded-xl glow-btn-amber text-white font-extrabold text-xs cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Đổi bài luyện nghe mới</span>
                </button>
              )}
            </div>

            {/* Core Listening Vocabulary Highlights */}
            {listeningData.key_vocabulary && listeningData.key_vocabulary.length > 0 && (
              <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
                <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-white/5 pb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Từ vựng khóa học xuất hiện:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {listeningData.key_vocabulary.map((vocab, index) => (
                    <div key={index} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between hover:border-purple-500/20 transition text-xs">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-purple-300 text-sm">{vocab.word}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">{vocab.ipa}</span>
                        </div>
                        <span className="text-[11px] text-slate-300 font-medium">{vocab.meaning}</span>
                      </div>

                      <button
                        onClick={() => handleSpeakWord(vocab.word)}
                        className="p-1.5 rounded-lg bg-purple-600/10 hover:bg-purple-600/30 text-purple-300 border border-purple-500/20 transition cursor-pointer"
                        title="Phát âm từ này"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      ) : null}
    </div>
  );
}
