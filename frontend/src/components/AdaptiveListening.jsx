import React, { useState, useEffect, useMemo } from 'react';
import { 
  Headphones, Play, Pause, RotateCcw, Volume2, Sparkles, CheckCircle2, XCircle, 
  HelpCircle, Eye, EyeOff, BookOpen, VolumeX, FastForward, Award, ArrowRight, Loader2,
  ListFilter, Target, Globe, BookOpenCheck, PenTool, Check, AlertTriangle, Lightbulb,
  RefreshCw, ChevronLeft, ChevronRight, Star
} from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api';

// ════════════════════════════════════════════════════════════════════════════════
// KHO BÀI NGHE CHÉP CHÍNH TẢ TỪNG CÂU THPT (SEnglish Sentence Dictation Standard)
// TẬP TRUNG VÀO BẪY PHÁT ÂM: ĐUÔI -ED, ĐUÔI -S/-ES, MẠO TỪ, GIỚI TỪ SGK 10-11-12
// ════════════════════════════════════════════════════════════════════════════════
const THPT_DICTATION_BANK = [
  {
    id: 'dict_1',
    grade: '10',
    unit: 'Unit 1: Family Life & Chores',
    targetSentence: 'All family members share the household chores equally to create a harmonious atmosphere.',
    translation: 'Tất cả các thành viên trong gia đình chia sẻ việc nhà đồng đều để tạo ra bầu không khí hòa thuận.',
    traps: 'Bẫy âm đuôi: "chores" đuôi /z/, "members" đuôi /z/. Chú ý mạo từ "the" và trạng từ "equally".'
  },
  {
    id: 'dict_2',
    grade: '10',
    unit: 'Unit 2: Humans and Environment',
    targetSentence: 'Using renewable energy reduces greenhouse gas emissions and protects our vulnerable planet.',
    translation: 'Sử dụng năng lượng tái tạo làm giảm lượng phát thải khí nhà kính và bảo vệ hành tinh dễ bị tổn thương của chúng ta.',
    traps: 'Bẫy phát âm: "reduces" đuôi /ɪz/, "emissions" đuôi /ʃənz/, "protects" đuôi /ts/.'
  },
  {
    id: 'dict_3',
    grade: '10',
    unit: 'Unit 3: Music & Arts',
    targetSentence: 'The young artist performed passionately and received enthusiastic applause from the audience.',
    translation: 'Người nghệ sĩ trẻ biểu diễn đầy nhiệt huyết và nhận được tràng pháo tay nồng nhiệt từ khán giả.',
    traps: 'Bẫy đuôi -ed: "performed" phát âm /d/, "received" phát âm /d/. Chú ý từ "applause" đuôi /z/.'
  },
  {
    id: 'dict_4',
    grade: '10',
    unit: 'Unit 4: Community Service',
    targetSentence: 'Volunteers gathered yesterday to help disadvantaged children in the mountainous district.',
    translation: 'Các tình nguyện viên đã tập hợp lại ngày hôm qua để giúp đỡ trẻ em có hoàn cảnh khó khăn ở huyện vùng núi.',
    traps: 'Bẫy đuôi -ed: "gathered" phát âm /d/, "disadvantaged" phát âm /ɪd/. Chú ý "children" danh từ số nhiều bất quy tắc.'
  },
  {
    id: 'dict_5',
    grade: '11',
    unit: 'Unit 1: Healthy Lifestyle',
    targetSentence: 'Regular physical exercise and balanced nutrition boost the human immune system remarkably.',
    translation: 'Tập thể dục đều đặn và dinh dưỡng cân bằng tăng cường hệ miễn dịch của con người một cách đáng kể.',
    traps: 'Bẫy âm đuôi: "balanced" đuôi /t/, "boost" đuôi /s/, tính từ "remarkable" chuyển thành trạng từ "remarkably".'
  },
  {
    id: 'dict_6',
    grade: '11',
    unit: 'Unit 2: The Generation Gap',
    targetSentence: 'Parents and teenagers should communicate openly to bridge the widening generational gap.',
    translation: 'Cha mẹ và thanh thiếu niên nên giao tiếp cởi mở để thu hẹp khoảng cách thế hệ ngày càng nới rộng.',
    traps: 'Bẫy phát âm: "parents" đuôi /ts/, "teenagers" đuôi /dʒəz/. Chú ý động từ "communicate" và trạng từ "openly".'
  },
  {
    id: 'dict_7',
    grade: '11',
    unit: 'Unit 3: Cities of the Future',
    targetSentence: 'Modern smart cities will utilize solar power to minimize carbon footprints effectively.',
    translation: 'Các thành phố thông minh hiện đại sẽ tận dụng năng lượng mặt trời để giảm thiểu lượng khí thải carbon một cách hiệu quả.',
    traps: 'Bẫy phát âm: "cities" đuôi /z/, "utilize" đuôi /z/, "footprints" đuôi /ts/.'
  },
  {
    id: 'dict_8',
    grade: '11',
    unit: 'Unit 5: Global Warming',
    targetSentence: 'Deforestation causes severe soil erosion and threatens the natural habitats of wildlife.',
    translation: 'Nạn phá rừng gây ra xói mòn đất nghiêm trọng và đe dọa môi trường sống tự nhiên của động vật hoang dã.',
    traps: 'Bẫy âm đuôi: "causes" đuôi /ɪz/, "threatens" đuôi /z/, "habitats" đuôi /ts/.'
  },
  {
    id: 'dict_9',
    grade: '12',
    unit: 'Unit 1: Life Stories',
    targetSentence: 'He overcame immense hardships through determination and inspired millions of students worldwide.',
    translation: 'Ông đã vượt qua muôn vàn gian khó bằng lòng quyết tâm và truyền cảm hứng cho hàng triệu học sinh trên toàn thế giới.',
    traps: 'Bẫy đuôi -ed & thì quá khứ: "overcame" (bất quy tắc), "hardships" đuôi /s/, "inspired" đuôi /d/.'
  },
  {
    id: 'dict_10',
    grade: '12',
    unit: 'Unit 2: Cultural Diversity',
    targetSentence: 'Preserving cultural identity while embracing international integration is a vital challenge.',
    translation: 'Bảo tồn bản sắc văn hóa trong khi đón nhận hội nhập quốc tế là một thách thức sống còn.',
    traps: 'Bẫy phát âm: "preserving", "embracing" đuôi /sɪŋ/, "vital" /vaɪ.təl/, "integration" /ˌɪn.tɪˈɡreɪ.ʃən/.'
  },
  {
    id: 'dict_11',
    grade: '12',
    unit: 'Unit 3: Green Living',
    targetSentence: 'Governments worldwide must enforce stricter regulations on industrial chemical waste disposal.',
    translation: 'Các chính phủ trên khắp thế giới phải thực thi các quy định nghiêm ngặt hơn về xử lý chất thải hóa học công nghiệp.',
    traps: 'Bẫy phát âm: "governments" đuôi /ts/, "regulations" đuôi /z/, "waste" /weɪst/.'
  },
  {
    id: 'dict_12',
    grade: '12',
    unit: 'Unit 5: Lifelong Learning',
    targetSentence: 'Continuous professional development enables employees to adapt to technological revolutions smoothly.',
    translation: 'Sự phát triển chuyên môn liên tục giúp người lao động thích ứng với các cuộc cách mạng công nghệ một cách suôn sẻ.',
    traps: 'Bẫy âm đuôi: "enables" đuôi /z/, "employees" đuôi /z/, "revolutions" đuôi /z/.'
  }
];

export default function AdaptiveListening({ selectedGrade = '10', theta = 0.0 }) {
  // Tab chính: Dictation (Nghe chép chính tả SEnglish) hoặc Comprehension (Bài nghe hiểu trắc nghiệm)
  const [learningTab, setLearningTab] = useState('dictation'); // 'dictation' | 'comprehension'

  // --- STATE FOR SENTENCE DICTATION (SENGLISH STANDARD) ---
  const [dictGrade, setDictGrade] = useState('all');
  const [dictIndex, setDictIndex] = useState(0);
  const [dictInput, setDictInput] = useState('');
  const [dictSpeed, setDictSpeed] = useState(1.0);
  const [dictPlayCount, setDictPlayCount] = useState(0);
  const [dictResult, setDictResult] = useState(null);
  const [showDictHint, setShowDictHint] = useState(false);

  const filteredDictations = useMemo(() => {
    if (dictGrade === 'all') return THPT_DICTATION_BANK;
    return THPT_DICTATION_BANK.filter(d => d.grade === dictGrade);
  }, [dictGrade]);

  const currentDict = filteredDictations[dictIndex] || filteredDictations[0];

  const playDictationAudio = (sentence, rate = 1.0) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(sentence);
    utter.lang = 'en-US';
    utter.rate = rate;
    window.speechSynthesis.speak(utter);
    setDictPlayCount(prev => prev + 1);
  };

  const handleCheckDictation = (e) => {
    if (e) e.preventDefault();
    if (!dictInput.trim() || !currentDict) return;

    const cleanTargetWords = currentDict.targetSentence.trim().split(/\s+/);
    const cleanStudentWords = dictInput.trim().split(/\s+/);

    let correctCount = 0;
    const analysis = cleanTargetWords.map((tWord, idx) => {
      const rawT = tWord.replace(/[.,!?;:"'()]/g, '').toLowerCase();
      const sWord = cleanStudentWords[idx] || '';
      const rawS = sWord.replace(/[.,!?;:"'()]/g, '').toLowerCase();

      if (!sWord) {
        return { target: tWord, student: '', status: 'missing' };
      } else if (rawT === rawS) {
        correctCount++;
        return { target: tWord, student: sWord, status: 'correct' };
      } else {
        return { target: tWord, student: sWord, status: 'incorrect' };
      }
    });

    const accuracy = Math.round((correctCount / cleanTargetWords.length) * 100);
    setDictResult({
      analysis,
      accuracy,
      correctCount,
      totalCount: cleanTargetWords.length
    });
  };

  // Config States for Comprehension
  const [activeGrade, setActiveGrade] = useState(selectedGrade);

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
      const savedGemini = localStorage.getItem('api_gemini') || localStorage.getItem('gemini_api_key') || '';
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

  // Initial load for comprehension
  useEffect(() => {
    fetchListeningLesson(activeTopicVal, activeGrade);
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [activeGrade]);

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
      {/* SEnglish inspired THPT Mode Switcher */}
      <div className="flex p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-xl max-w-2xl mx-auto">
        <button
          onClick={() => setLearningTab('dictation')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 ${
            learningTab === 'dictation'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold shadow-lg shadow-orange-500/25'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>✍️ Nghe Chép Chính Tả THPT (Sentence Dictation)</span>
        </button>
        <button
          onClick={() => setLearningTab('comprehension')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
            learningTab === 'comprehension'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>🎧 Bài Nghe Hiểu Thích Ứng (Comprehension)</span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: SENGLISH SENTENCE DICTATION (CHÉP CHÍNH TẢ TỪNG CÂU CHUẨN THPT) */}
      {/* ════════════════════════════════════════════════════════════════════════════════ */}
      {learningTab === 'dictation' && currentDict && (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
          {/* Grade Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl bg-white/[0.02] border border-white/5">
            {[
              { id: 'all', label: 'Tất cả khối lớp THPT' },
              { id: '10', label: 'Khối 10 (Global Success 10)' },
              { id: '11', label: 'Khối 11 (Global Success 11)' },
              { id: '12', label: 'Khối 12 & Ôn Thi Tốt Nghiệp' }
            ].map(pill => (
              <button
                key={pill.id}
                onClick={() => {
                  setDictGrade(pill.id);
                  setDictIndex(0);
                  setDictInput('');
                  setDictResult(null);
                  setDictPlayCount(0);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  dictGrade === pill.id
                    ? 'bg-amber-500 text-black shadow-md shadow-orange-500/20'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Main Dictation Card */}
          <div className="glass rounded-3xl p-6 md:p-9 border border-amber-500/30 shadow-2xl bg-[#080d24]/90 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase">
                  {currentDict.unit}
                </span>
                <span className="text-xs text-gray-400 font-bold">
                  Câu {dictIndex + 1}/{filteredDictations.length}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400 font-bold">Đã nghe:</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-black">
                  {dictPlayCount} lần
                </span>
              </div>
            </div>

            {/* Audio Controls (SEnglish Style) */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => playDictationAudio(currentDict.targetSentence, dictSpeed)}
                  className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs shadow-lg shadow-orange-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
                  title="Bấm để nghe câu tiếng Anh"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Phát Âm Thanh ({dictSpeed}x)</span>
                </button>

                <button
                  onClick={() => playDictationAudio(currentDict.targetSentence, 0.75)}
                  className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-gray-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  title="Nghe chậm 0.75x để nghe rõ từng âm đuôi -s, -ed"
                >
                  <span>🐢 0.75x (Chậm)</span>
                </button>
              </div>

              {/* Hint button */}
              <button
                onClick={() => setShowDictHint(!showDictHint)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Lightbulb className="w-4 h-4" />
                <span>{showDictHint ? 'Ẩn gợi ý chữ cái' : 'Hiện gợi ý chữ cái đầu'}</span>
              </button>
            </div>

            {/* First letter hint if toggled */}
            {showDictHint && (
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-200 animate-fade-in">
                <span className="font-bold text-cyan-300">Gợi ý từ đầu: </span>
                {currentDict.targetSentence.split(/\s+/).map(w => w.charAt(0) + '...').join(' ')}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleCheckDictation} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                  Gõ lại nguyên văn những gì bạn nghe được:
                </label>
                <textarea
                  rows={3}
                  value={dictInput}
                  onChange={(e) => setDictInput(e.target.value)}
                  placeholder="Type the English sentence you heard here (chú ý âm đuôi -ed, -s, mạo từ)..."
                  className="w-full bg-[#060a18] border border-white/10 focus:border-amber-500 outline-none rounded-2xl p-4 text-sm text-gray-200 placeholder-gray-600 font-sans leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-gray-400 hidden sm:inline">
                  💡 Mẹo: Nhấn phím Enter hoặc nút bên cạnh để đối chiếu ngay.
                </span>

                <button
                  type="submit"
                  disabled={!dictInput.trim()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Kiểm Tra Chính Tả</span>
                </button>
              </div>
            </form>

            {/* Diff Result Analysis (SEnglish Standard) */}
            {dictResult && (
              <div className="space-y-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10 animate-scale-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-black text-white font-outfit">
                      Kết Quả Đối Chiếu Từng Từ
                    </strong>
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold ${
                      dictResult.accuracy >= 80 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      Độ chính xác: {dictResult.accuracy}% ({dictResult.correctCount}/{dictResult.totalCount} từ)
                    </span>
                  </div>
                </div>

                {/* Word Chips Diff Display */}
                <div className="flex flex-wrap gap-2 p-3 bg-[#060a16] rounded-xl border border-white/5">
                  {dictResult.analysis.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      {item.status === 'correct' && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                          ✓ {item.target}
                        </span>
                      )}
                      {item.status === 'incorrect' && (
                        <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold line-through" title={`Đúng là: "${item.target}"`}>
                          ✗ {item.student || '(sai)'}
                        </span>
                      )}
                      {item.status === 'missing' && (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-dashed border-amber-500/50 text-amber-300 text-xs font-bold" title="Từ này bị bạn nghe sót">
                          ? [{item.target}]
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Target Sentence & Translation */}
                <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.03] text-xs">
                  <div>
                    <span className="text-gray-400 font-bold">Câu chuẩn: </span>
                    <span className="text-white font-semibold">{currentDict.targetSentence}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold">Bản dịch tiếng Việt: </span>
                    <span className="text-emerald-300 font-medium">{currentDict.translation}</span>
                  </div>
                </div>

                {/* Phonetic & Grammar Traps */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="text-white">Bẫy đề thi THPT: </strong>
                    {currentDict.traps}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  setDictIndex(prev => (prev - 1 + filteredDictations.length) % filteredDictations.length);
                  setDictInput('');
                  setDictResult(null);
                  setDictPlayCount(0);
                  setShowDictHint(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Câu trước</span>
              </button>

              <button
                onClick={() => {
                  setDictIndex(prev => (prev + 1) % filteredDictations.length);
                  setDictInput('');
                  setDictResult(null);
                  setDictPlayCount(0);
                  setShowDictHint(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-orange-500/20"
              >
                <span>Câu tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: BÀI NGHE HIỂU TRẮC NGHIỆM TRUYỀN THỐNG */}
      {/* ════════════════════════════════════════════════════════════════════════════════ */}
      {learningTab === 'comprehension' && (
        <div className="space-y-8">
      
      {/* Header Panel */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-purple-600/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Headphones className="w-4 h-4 text-purple-400" />
            <span>LUYỆN NGHE SONG SONG &amp; ĐA CẤP ĐỘ</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white font-outfit leading-relaxed">
            Luyện Nghe Tiếng Anh THPT Thích Ứng (Lớp 10 - 11 - 12)
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
            Luyện nghe bám sát chương trình Tiếng Anh THPT GDPT 2018 (Sách Global Success &amp; Friends Global Lớp 10, 11, 12). Nghe kết hợp đọc lời song song, tra từ vựng và làm bài tập trắc nghiệm củng cố.
          </p>
        </div>

        {/* Level Selectors & Category Filters */}
        <div className="pt-4 border-t border-white/5 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-amber-400" /> Chọn Khối Lớp THPT:
          </span>
          
          <div className="flex flex-wrap gap-2">
            {[
              { id: '10', label: 'Khối 10 (Global Success 10)' },
              { id: '11', label: 'Khối 11 (Global Success 11)' },
              { id: '12', label: 'Khối 12 & Ôn Thi Tốt Nghiệp THPT' }
            ].map((gr) => (
              <button
                key={gr.id}
                onClick={() => { setActiveGrade(gr.id); setListeningMode('grade'); }}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
                  activeGrade === gr.id
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/50 shadow-md'
                    : 'bg-slate-800/50 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {gr.label}
              </button>
            ))}
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
      )}
    </div>
  );
}
