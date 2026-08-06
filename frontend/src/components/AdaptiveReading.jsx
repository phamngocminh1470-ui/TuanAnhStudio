import React, { useState } from 'react';
import { BookOpen, Sparkles, RefreshCw, CheckCircle2, XCircle, ArrowRight, HelpCircle, Volume2, PenTool, Award, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api';

export default function AdaptiveReading({ selectedGrade }) {
  const [subTab, setSubTab] = useState('reading'); // 'reading' or 'writing'

  // --- STATE FOR READING ---
  const [topic, setTopic] = useState('Technology');
  const [loadingRead, setLoadingRead] = useState(false);
  const [readingData, setReadingData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanations, setShowExplanations] = useState({});

  // --- STATE FOR WRITING ---
  const [writingPrompt, setWritingPrompt] = useState('Write about your favorite hobby and explain why you enjoy it.');
  const [writingText, setWritingText] = useState('');
  const [loadingWrite, setLoadingWrite] = useState(false);
  const [writingEvaluation, setWritingEvaluation] = useState(null);
  const [writingSampleData, setWritingSampleData] = useState(null);
  const [loadingSample, setLoadingSample] = useState(false);
  const [showSample, setShowSample] = useState(false);

  // Pre-defined writing prompts for student ease
  const samplePrompts = [
    "Write about your favorite hobby and explain why you enjoy it.",
    "Describe the benefits of using technology in education.",
    "What are some simple ways students can help protect the environment?",
    "Describe a memorable trip you took with your family or friends.",
    "Should high school students have part-time jobs? Why or why not?",
    "Describe a person who has influenced you the most in your life.",
    "What are the advantages and disadvantages of online learning?",
    "Why is learning English important for your future career?"
  ];

  // --- HANDLERS FOR READING ---
  const handleGenerateReading = async () => {
    if (!topic.trim()) return;
    setLoadingRead(true);
    setSelectedAnswers({});
    setShowExplanations({});
    try {
      const savedTheta = parseFloat(localStorage.getItem('user_theta')) || 0.406;
      const savedGemini = localStorage.getItem('api_gemini') || '';
      const res = await axios.post(
        `${API_BASE}/reading/generate`,
        {
          topic: topic,
          grade: selectedGrade,
          theta: savedTheta
        },
        {
          headers: savedGemini ? { 'X-Gemini-Key': savedGemini } : {}
        }
      );
      if (res.data && res.data.reading) {
        setReadingData(res.data.reading);
      }
    } catch (e) {
      console.error(e);
      // Fallback local mockup data
      setReadingData({
        title: `The Influence of ${topic} on Education`,
        passage: `In recent years, the integration of ${topic} into classrooms has transformed the way students learn. By using interactive platforms, teachers can customize lessons to match individual needs. This development not only enhances academic outcomes but also prepares students for global careers in the modern world. Experts believe that adopting these methods is crucial for future success.`,
        topic: topic,
        grade: selectedGrade,
        key_vocabulary: [
          { word: "Integration", ipa: "/ˌɪn.tɪˈɡreɪ.ʃən/", meaning: "sự tích hợp, kết hợp" },
          { word: "Transform", ipa: "/trænsˈfɔːm/", meaning: "biến đổi sâu sắc" },
          { word: "Interactive", ipa: "/ˌɪn.təˈræk.tɪv/", meaning: "tương tác qua lại" },
          { word: "Outcome", ipa: "/ˈaʊt.kʌm/", meaning: "kết quả đầu ra" }
        ],
        questions: [
          {
            id: "Q1",
            question: "What is the main topic of the passage?",
            options: [`A. The positive impact of ${topic} on education`, "B. The history of traditional schools", "C. Disadvantages of classroom games", "D. How to become a teacher"],
            correct: "A",
            explanation: "Toàn bộ đoạn văn thảo luận về sự biến đổi và lợi ích tích cực của chủ đề đối với môi trường giáo dục."
          },
          {
            id: "Q2",
            question: "According to the passage, interactive platforms allow teachers to:",
            options: ["A. Cancel all examinations", "B. Customize lessons to match individual needs", "C. Play video games all day", "D. Spend less time reading"],
            correct: "B",
            explanation: "Thông tin có sẵn trong đoạn văn: 'By using interactive platforms, teachers can customize lessons to match individual needs.'"
          }
        ]
      });
    } finally {
      setLoadingRead(false);
    }
  };

  const handleSelectOption = (qId, optionChar) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionChar }));
    setShowExplanations(prev => ({ ...prev, [qId]: true }));
  };

  // --- HANDLERS FOR WRITING ---
  const handleGetSample = async () => {
    if (!writingPrompt.trim()) return;
    setLoadingSample(true);
    setWritingSampleData(null);
    setShowSample(true);
    try {
      const headers = {};
      const savedGemini = localStorage.getItem('api_gemini') || '';
      if (savedGemini) {
        headers['x-gemini-key'] = savedGemini;
      }
      
      const res = await axios.post(`${API_BASE}/writing/sample`, {
        prompt: writingPrompt,
        grade: selectedGrade
      }, { headers });
      
      if (res.data && res.data.sample) {
        setWritingSampleData(res.data.sample);
      }
    } catch (e) {
      console.error(e);
      // Fallback
      setWritingSampleData({
        outline: "1. Mở bài: Giới thiệu chủ đề này và nêu ý kiến chung của bạn.\n2. Thân bài: Đưa ra 2 luận điểm (lý do) giải thích rõ ràng kèm ví dụ thực tế.\n3. Kết bài: Tóm tắt lại suy nghĩ chính của bạn.",
        suggested_vocabulary: [
          { word: "Essential", ipa: "/ɪˈsen.ʃəl/", meaning: "rất quan trọng, thiết yếu" },
          { word: "Beneficial", ipa: "/ˌben.ɪˈfɪʃ.əl/", meaning: "có lợi" },
          { word: "Furthermore", ipa: "/ˌfɜː.ðəˈmɔːr/", meaning: "hơn thế nữa" }
        ],
        sample_essay: `Writing about this topic is very beneficial. Firstly, it helps students develop their critical thinking. Furthermore, it is essential to support our ideas with strong examples. In conclusion, practicing regularly leads to success.`
      });
    } finally {
      setLoadingSample(false);
    }
  };

  const handleEvaluateWriting = async () => {
    if (!writingText.trim()) return;
    setLoadingWrite(true);
    setWritingEvaluation(null);
    try {
      const res = await axios.post(`${API_BASE}/writing/evaluate`, {
        text: writingText,
        prompt: writingPrompt,
        grade: selectedGrade
      });
      if (res.data && res.data.evaluation) {
        setWritingEvaluation(res.data.evaluation);
      }
    } catch (e) {
      console.error(e);
      // Fallback mockup
      setWritingEvaluation({
        score: 7.5,
        overall_feedback: "Bài viết của bạn có cấu trúc tốt và bám sát chủ đề yêu cầu. Tuy nhiên cần chú ý sửa một số lỗi ngữ pháp nhỏ và nâng cấp từ vựng phong phú hơn.",
        grammar_corrections: [
          {
            original: "I very like playing soccer in the afternoon.",
            corrected: "I really enjoy playing soccer in the afternoon.",
            reason: "Không dùng 'very like' trong tiếng Anh, nên thay thế bằng cụm từ tự nhiên hơn như 'really enjoy' hoặc 'really like'."
          }
        ],
        vocabulary_upgrades: [
          {
            original_word: "good",
            suggested_word: "beneficial",
            context: "playing sports is beneficial for health."
          }
        ]
      });
    } finally {
      setLoadingWrite(false);
    }
  };

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full space-y-6 pb-16 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="glass rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 border border-indigo-400/40 flex items-center justify-center text-white shadow-xl shrink-0">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white font-outfit">Luyện Đọc &amp; Viết Thích Ứng AI</h1>
            <p className="text-xs text-gray-400 mt-1">
              Phát triển toàn diện kỹ năng Đọc hiểu (Reading) và Viết đoạn văn (Writing) cá nhân hóa theo Khối Lớp {selectedGrade}
            </p>
          </div>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-white/10 self-stretch md:self-auto">
          <button
            onClick={() => setSubTab('reading')}
            className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-2 ${
              subTab === 'reading'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Luyện đọc thích ứng</span>
          </button>
          <button
            onClick={() => setSubTab('writing')}
            className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-2 ${
              subTab === 'writing'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Luyện viết thích ứng</span>
          </button>
        </div>
      </div>

      {/* --- SUB-TAB 1: ADAPTIVE READING --- */}
      {subTab === 'reading' && (
        <div className="space-y-6">
          {/* Generator Prompt Panel */}
          <div className="glass rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
            {/* Quick topics recommendation list */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Gợi ý chủ đề đọc hiểu đa dạng:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Trí tuệ nhân tạo (AI)', val: 'Artificial Intelligence & Robotics' },
                  { label: 'Bảo vệ Môi trường', val: 'Environmental Protection & Green Lifestyle' },
                  { label: 'Du hành Vũ trụ', val: 'Space Exploration & Galaxies' },
                  { label: 'Ẩm thực Việt Nam', val: 'Traditional Vietnamese Cuisine' },
                  { label: 'Thể thao & Sức khỏe', val: 'Sports, Fitness and Mental Health' },
                  { label: 'Du lịch thế giới', val: 'World Travel & Cultural Diversity' },
                  { label: 'Kỹ năng sống học đường', val: 'High School Life & Soft Skills' }
                ].map((pt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTopic(pt.label);
                      // Trigger generate immediately with the value
                      setTimeout(async () => {
                        setLoadingRead(true);
                        setSelectedAnswers({});
                        setShowExplanations({});
                        try {
                          const savedTheta = parseFloat(localStorage.getItem('user_theta')) || 0.406;
                          const savedGemini = localStorage.getItem('api_gemini') || '';
                          const res = await axios.post(
                            `${API_BASE}/reading/generate`,
                            {
                              topic: pt.val,
                              grade: selectedGrade,
                              theta: savedTheta
                            },
                            {
                              headers: savedGemini ? { 'X-Gemini-Key': savedGemini } : {}
                            }
                          );
                          if (res.data && res.data.reading) {
                            setReadingData(res.data.reading);
                          }
                        } catch (e) {
                          console.error(e);
                        } finally {
                          setLoadingRead(false);
                        }
                      }, 50);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                      topic === pt.label
                        ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 shadow-md'
                        : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="text-xs font-extrabold text-gray-300 uppercase tracking-wider block pt-2">
              Hoặc nhập chủ đề tự chọn khác theo ý bạn:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Nhập chủ đề bằng tiếng Anh hoặc tiếng Việt..."
                className="flex-1 bg-[#060a16] border border-white/10 hover:border-white/20 focus:border-indigo-500 outline-none rounded-2xl px-5 py-3.5 text-sm text-gray-200 placeholder-gray-600 transition"
              />
              <button
                onClick={handleGenerateReading}
                disabled={loadingRead || !topic.trim()}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loadingRead ? 'Đang soạn bài...' : 'Tạo bài đọc thích ứng'}</span>
              </button>
            </div>
          </div>

          {readingData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Passage & Vocab */}
              <div className="lg:col-span-8 space-y-6">
                <div className="glass rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl space-y-6 bg-[#070b19]/80">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full w-fit">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Chủ đề: {readingData.topic} • Lớp {selectedGrade}</span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black text-white font-outfit leading-normal border-b border-white/10 pb-4">
                    {readingData.title}
                  </h2>

                  <p className="text-gray-200 text-base md:text-lg leading-loose tracking-wide font-normal whitespace-pre-line text-justify">
                    {readingData.passage}
                  </p>
                </div>

                {/* Key Vocabulary Highlight Card */}
                <div className="glass rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-white/5 pb-2">
                    Từ vựng trọng tâm trong bài đọc:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {readingData.key_vocabulary.map((vocab, index) => (
                      <div key={index} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                        <div>
                          <strong className="text-sm text-white block">{vocab.word}</strong>
                          <span className="text-[10px] text-amber-400 font-mono font-semibold block">{vocab.ipa}</span>
                          <span className="text-xs text-gray-300 block mt-1">{vocab.meaning}</span>
                        </div>
                        <button
                          onClick={() => speakWord(vocab.word)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-400 transition"
                          title="Nghe phát âm"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Comprehension Questions */}
              <div className="lg:col-span-4 space-y-6">
                <div className="glass rounded-3xl p-6 border border-white/10 shadow-2xl space-y-5">
                  <h3 className="font-extrabold text-lg text-white font-outfit flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                    <span>Câu hỏi Đọc hiểu</span>
                  </h3>

                  <div className="space-y-6">
                    {readingData.questions.map((q, qIdx) => (
                      <div key={q.id} className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                          Câu hỏi {qIdx + 1}:
                        </span>
                        <p className="text-xs text-gray-200 font-bold leading-relaxed">
                          {q.question}
                        </p>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const optChar = opt.charAt(0);
                            const isSelected = selectedAnswers[q.id] === optChar;
                            const isCorrect = optChar === q.correct;
                            const hasAnswered = selectedAnswers[q.id] !== undefined;

                            let btnStyle = "bg-white/5 border-white/5 hover:bg-white/10 text-gray-300";
                            if (hasAnswered) {
                              if (isCorrect) {
                                btnStyle = "bg-emerald-500/20 border-emerald-500/40 text-emerald-300";
                              } else if (isSelected) {
                                btnStyle = "bg-rose-500/20 border-rose-500/40 text-rose-300";
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => !hasAnswered && handleSelectOption(q.id, optChar)}
                                disabled={hasAnswered}
                                className={`w-full p-3 rounded-xl text-left text-xs font-semibold border transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                                {hasAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>

                        {showExplanations[q.id] && (
                          <div className="mt-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-200">
                            <span className="font-bold text-indigo-400 block uppercase mb-0.5">Giải thích:</span>
                            <p>{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- SUB-TAB 2: AI WRITING ASSISTANT --- */}
      {subTab === 'writing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Writing Input Panel (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="glass rounded-3xl p-6 border border-white/10 shadow-xl space-y-5">
                
                {/* Select Prompt Topic */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-gray-300 uppercase tracking-wider block">
                    Bước 1: Chọn hoặc nhập chủ đề luyện viết:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {samplePrompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => setWritingPrompt(p)}
                        className={`px-3.5 py-2 rounded-xl text-left text-[11px] font-bold border transition cursor-pointer ${
                          writingPrompt === p
                            ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        Chủ đề {idx + 1}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={writingPrompt}
                    onChange={(e) => setWritingPrompt(e.target.value)}
                    className="w-full bg-[#060a16] border border-white/10 focus:border-indigo-500 outline-none rounded-xl px-4 py-2.5 text-xs text-gray-200 mt-2 mb-3"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleGetSample}
                      disabled={loadingSample || !writingPrompt.trim()}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600/20 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{loadingSample ? 'Đang tạo hướng dẫn...' : 'Xem Dàn Ý & Bài Mẫu AI'}</span>
                    </button>
                    {showSample && (
                      <button
                        onClick={() => setShowSample(false)}
                        className="py-2.5 px-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-gray-400 hover:text-white transition cursor-pointer"
                      >
                        Ẩn
                      </button>
                    )}
                  </div>
                </div>

                {/* Guide Section */}
                {showSample && (
                  <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-4 animate-fade-in">
                    <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider border-b border-indigo-500/20 pb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      Hướng dẫn & Bài mẫu AI (Lớp {selectedGrade})
                    </h4>
                    
                    {loadingSample ? (
                      <div className="flex flex-col items-center justify-center py-6 space-y-2">
                        <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                        <span className="text-[11px] text-gray-400">AI đang phân tích và chuẩn bị bài học...</span>
                      </div>
                    ) : writingSampleData ? (
                      <div className="space-y-4 text-xs">
                        {/* Dàn ý */}
                        <div className="space-y-1.5">
                          <strong className="text-[10px] text-amber-400 uppercase tracking-wider block">📋 Dàn ý gợi ý (Outline):</strong>
                          <p className="text-gray-300 whitespace-pre-line leading-relaxed bg-[#060a16]/60 p-3.5 rounded-xl border border-white/5 text-justify">
                            {writingSampleData.outline}
                          </p>
                        </div>
                        
                        {/* Từ vựng gợi ý */}
                        {writingSampleData.suggested_vocabulary && writingSampleData.suggested_vocabulary.length > 0 && (
                          <div className="space-y-1.5">
                            <strong className="text-[10px] text-indigo-300 uppercase tracking-wider block">💡 Từ vựng nên dùng (Vocabulary):</strong>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {writingSampleData.suggested_vocabulary.map((vocab, index) => (
                                <div key={index} className="p-2.5 rounded-xl bg-[#060a16]/40 border border-white/5 flex items-center justify-between">
                                  <div>
                                    <strong className="text-white block text-[11px]">{vocab.word}</strong>
                                    <span className="text-[9px] text-amber-400 font-mono font-semibold block">{vocab.ipa}</span>
                                    <span className="text-[10px] text-gray-400 block mt-0.5">{vocab.meaning}</span>
                                  </div>
                                  <button
                                    onClick={() => speakWord(vocab.word)}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 transition cursor-pointer"
                                    title="Nghe phát âm"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Bài mẫu */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <strong className="text-[10px] text-emerald-400 uppercase tracking-wider block">📝 Bài viết mẫu (Sample Essay):</strong>
                            <button
                              onClick={() => speakWord(writingSampleData.sample_essay)}
                              className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 hover:bg-emerald-500/20 transition cursor-pointer flex items-center gap-1"
                              title="Nghe đọc bài mẫu"
                            >
                              <Volume2 className="w-3 h-3" />
                              <span>Đọc bài mẫu</span>
                            </button>
                          </div>
                          <p className="text-gray-200 leading-relaxed bg-[#060a16]/60 p-3.5 rounded-xl border border-white/5 text-justify italic font-medium">
                            {writingSampleData.sample_essay}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-rose-400">Không thể tải hướng dẫn viết lúc này.</span>
                    )}
                  </div>
                )}

                {/* Write Area */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-gray-300 uppercase tracking-wider block">
                    Bước 2: Viết đoạn văn bằng Tiếng Anh (khoảng 50 - 150 từ):
                  </label>
                  <textarea
                    rows={8}
                    value={writingText}
                    onChange={(e) => setWritingText(e.target.value)}
                    placeholder="Type your English paragraph here..."
                    className="w-full bg-[#060a16] border border-white/10 focus:border-indigo-500 outline-none rounded-2xl p-4 text-sm text-gray-200 placeholder-gray-600 font-mono"
                  ></textarea>
                  <div className="flex justify-between items-center text-[11px] text-gray-400">
                    <span>Số từ: {writingText.trim() ? writingText.trim().split(/\s+/).length : 0} từ</span>
                    <span>Khuyến nghị cho Lớp {selectedGrade}: từ 50 từ trở lên</span>
                  </div>
                </div>

                <button
                  onClick={handleEvaluateWriting}
                  disabled={loadingWrite || !writingText.trim()}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loadingWrite ? 'AI đang chấm điểm và phân tích...' : 'Nộp bài &amp; Chấm điểm AI'}</span>
                </button>

              </div>
            </div>

            {/* Right Writing Feedback Panel (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {writingEvaluation ? (
                <div className="glass rounded-3xl p-6 border border-white/10 shadow-2xl space-y-6 bg-[#070b19]/80">
                  
                  {/* Score */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-base text-white font-outfit">Kết quả Đánh giá AI</h4>
                        <p className="text-[10px] text-gray-400">Được chấm bởi Gemini 1.5 Flash</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-amber-400 font-outfit">{writingEvaluation.score}</span>
                      <span className="text-xs text-gray-400 font-bold block">/ 10 điểm</span>
                    </div>
                  </div>

                  {/* Overall Feedback */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-indigo-300 font-extrabold uppercase tracking-widest block">Nhận xét tổng quan</span>
                    <p className="text-xs text-gray-200 leading-relaxed font-medium text-justify">
                      {writingEvaluation.overall_feedback}
                    </p>
                  </div>

                  {/* Inline Corrections */}
                  {writingEvaluation.annotated_text && (
                    <div className="space-y-2.5 p-4 rounded-2xl bg-slate-950/70 border border-indigo-500/15 shadow-inner">
                      <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest block">Bản sửa lỗi trực tiếp (AI Edit)</span>
                      <div 
                        className="text-sm font-semibold leading-relaxed text-gray-200 p-1" 
                        dangerouslySetInnerHTML={{ __html: writingEvaluation.annotated_text }}
                      />
                    </div>
                  )}

                  {/* Grammar Corrections */}
                  <div className="space-y-3">
                    <span className="text-[10px] text-rose-300 font-extrabold uppercase tracking-widest block">Phân tích lỗi Ngữ pháp &amp; Từ vựng</span>
                    {writingEvaluation.grammar_corrections && writingEvaluation.grammar_corrections.length > 0 ? (
                      <div className="space-y-3">
                        {writingEvaluation.grammar_corrections.map((corr, idx) => (
                          <div key={idx} className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/25 space-y-2 text-xs">
                            <div className="space-y-1">
                              <span className="text-[10px] text-rose-400 font-bold block">❌ Bản gốc của bạn:</span>
                              <p className="text-gray-300 font-mono line-through">{corr.original}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-emerald-400 font-bold block">✓ Đề xuất sửa lại:</span>
                              <p className="text-white font-bold font-mono">{corr.corrected}</p>
                            </div>
                            <div className="text-[10px] text-indigo-200 bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/10">
                              <span className="font-bold block text-indigo-400">Giải thích lý do:</span>
                              <p className="mt-0.5">{corr.reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>Tuyệt vời! Không phát hiện lỗi ngữ pháp nghiêm trọng.</span>
                      </div>
                    )}
                  </div>

                  {/* Vocabulary Upgrades */}
                  {writingEvaluation.vocabulary_upgrades && writingEvaluation.vocabulary_upgrades.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-widest block">Đề xuất nâng cấp từ vựng</span>
                      <div className="space-y-2">
                        {writingEvaluation.vocabulary_upgrades.map((up, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs flex justify-between items-center">
                            <div>
                              <span className="text-gray-400 line-through mr-2">{up.original_word}</span>
                              <ArrowRight className="w-3.5 h-3.5 inline text-gray-500 mr-2" />
                              <span className="text-amber-400 font-bold">{up.suggested_word}</span>
                              <p className="text-[10px] text-gray-400 mt-1 italic">Ngữ cảnh: {up.context}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="glass rounded-3xl p-6 border border-white/10 text-center py-16 text-gray-400 space-y-3 flex flex-col items-center">
                  <PenTool className="w-12 h-12 text-gray-600 animate-bounce" />
                  <span className="text-xs font-bold">Hãy hoàn thành và nộp bài viết ở ô bên trái để nhận đánh giá chi tiết từ AI.</span>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
