import React, { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Play, Mic, Square, Volume2, Award, RefreshCw, ChevronRight, ChevronLeft, 
  HelpCircle, BookOpen, Sparkles, Plus, Wand2, Shuffle, AlertTriangle, CheckCircle2, 
  AlertCircle, Target, Zap, Lightbulb, Star, RotateCcw, Check
} from 'lucide-react';
import { EXTENDED_PRONUNCIATION_SENTENCES } from '../data/pronunciationSentencesData';

const API_BASE = '/api';

// ════════════════════════════════════════════════════════════════════════════════
// NGÂN HÀNG CHUYÊN ĐỀ TRỌNG ÂM & NGỮ ÂM THPT (4 CÂU ĐỀ THI TỐT NGHIỆP THPT BỘ GD&ĐT)
// ════════════════════════════════════════════════════════════════════════════════
const THPT_STRESS_BANK = [
  // CHUYÊN ĐỀ 1: TRỌNG ÂM TỪ 2 ÂM TIẾT
  {
    id: 'thpt_s2_1',
    word: 'decide',
    ipa: '/dɪˈsaɪd/',
    syllables: [
      { text: 'de', isStressed: false, phonetic: 'dɪ' },
      { text: 'CIDE', isStressed: true, phonetic: 'saɪd' }
    ],
    stressPosition: 2,
    category: 'stress_2',
    categoryLabel: 'Trọng âm 2 âm tiết',
    rule: 'Đa số ĐỘNG TỪ 2 âm tiết nhấn trọng âm vào âm tiết thứ 2 (de-CIDE, a-TTRACT, pre-FER).',
    trapNote: 'Tránh đọc ngang; âm tiết thứ 2 phải phát âm cao giọng và kéo dài hơn.',
    example: 'Students must decide their future career paths.'
  },
  {
    id: 'thpt_s2_2',
    word: 'attract',
    ipa: '/əˈtrækt/',
    syllables: [
      { text: 'at', isStressed: false, phonetic: 'ə' },
      { text: 'TRACT', isStressed: true, phonetic: 'trækt' }
    ],
    stressPosition: 2,
    category: 'stress_2',
    categoryLabel: 'Trọng âm 2 âm tiết',
    rule: 'Động từ có âm đầu là /ə/ không bao giờ nhận trọng âm, trọng âm LUÔN rơi vào âm 2.',
    trapNote: 'Bẫy đề thi: âm /æ/ ở âm tiết thứ hai đọc dứt khoát.',
    example: 'The festival attracts thousands of tourists every year.'
  },
  {
    id: 'thpt_s2_3',
    word: 'subject',
    ipa: '/ˈsʌb.dʒɪkt/',
    syllables: [
      { text: 'SUB', isStressed: true, phonetic: 'sʌb' },
      { text: 'ject', isStressed: false, phonetic: 'dʒɪkt' }
    ],
    stressPosition: 1,
    category: 'stress_2',
    categoryLabel: 'Trọng âm 2 âm tiết',
    rule: 'Đa số DANH TỪ và TÍNH TỪ 2 âm tiết nhấn trọng âm vào âm tiết thứ 1 (SUB-ject, STU-dent).',
    trapNote: 'Cực kỳ cẩn thận: Nếu là động từ "sub-JECT" (bắt phải chịu) thì lại nhấn âm 2!',
    example: 'English is a compulsory subject in the national exam.'
  },
  {
    id: 'thpt_s2_4',
    word: 'record',
    ipa: '/ˈrek.ɔːd/',
    syllables: [
      { text: 'RE', isStressed: true, phonetic: 'rek' },
      { text: 'cord', isStressed: false, phonetic: 'ɔːd' }
    ],
    stressPosition: 1,
    category: 'stress_2',
    categoryLabel: 'Trọng âm 2 âm tiết',
    rule: 'Danh từ nhấn âm 1 (/ˈrek.ɔːd/ - kỷ lục, hồ sơ), Động từ nhấn âm 2 (/rɪˈkɔːd/ - ghi âm, thu âm).',
    trapNote: 'Từ bẫy kinh điển trong mọi đề thi thử tốt nghiệp THPT!',
    example: 'She broke the national swimming record.'
  },
  {
    id: 'thpt_s2_5',
    word: 'present',
    ipa: '/ˈprez.ənt/',
    syllables: [
      { text: 'PRE', isStressed: true, phonetic: 'prez' },
      { text: 'sent', isStressed: false, phonetic: 'ənt' }
    ],
    stressPosition: 1,
    category: 'stress_2',
    categoryLabel: 'Trọng âm 2 âm tiết',
    rule: 'Danh từ/Tính từ nhấn âm 1 (/ˈprez.ənt/ - món quà, hiện diện), Động từ nhấn âm 2 (/prɪˈzent/ - thuyết trình).',
    trapNote: 'Học sinh hay nhầm trọng âm khi từ chuyển từ loại.',
    example: 'He gave me an unexpected birthday present.'
  },
  {
    id: 'thpt_s2_6',
    word: 'pollute',
    ipa: '/pəˈluːt/',
    syllables: [
      { text: 'pol', isStressed: false, phonetic: 'pə' },
      { text: 'LUTE', isStressed: true, phonetic: 'luːt' }
    ],
    stressPosition: 2,
    category: 'stress_2',
    categoryLabel: 'Trọng âm 2 âm tiết',
    rule: 'Động từ 2 âm tiết nhấn âm 2. Âm đầu là /pə/ đọc lướt nhanh.',
    trapNote: 'Âm thứ hai /luːt/ chứa nguyên âm dài /uː/ có trọng âm chính.',
    example: 'Industrial waste pollutes our drinking water.'
  },

  // CHUYÊN ĐỀ 2: TRỌNG ÂM TỪ 3-4 ÂM TIẾT
  {
    id: 'thpt_s3_1',
    word: 'generation',
    ipa: '/ˌdʒen.əˈreɪ.ʃən/',
    syllables: [
      { text: 'gen', isStressed: false, phonetic: 'dʒen' },
      { text: 'er', isStressed: false, phonetic: 'ə' },
      { text: 'A', isStressed: true, phonetic: 'reɪ' },
      { text: 'tion', isStressed: false, phonetic: 'ʃən' }
    ],
    stressPosition: 3,
    category: 'stress_3',
    categoryLabel: 'Trọng âm 3-4 âm tiết',
    rule: 'Quy tắc vàng: Từ kết thúc bằng đuôi -TION, -SION trọng âm LUÔN rơi vào âm tiết NGAY TRƯỚC NÓ.',
    trapNote: 'Cứ thấy đuôi -tion hoặc -sion thì chọn ngay âm tiết đứng trước nó (gene-RA-tion, pollu-TION).',
    example: 'The gap between generations is narrowing.'
  },
  {
    id: 'thpt_s3_2',
    word: 'economic',
    ipa: '/ˌiː.kəˈnɒm.ɪk/',
    syllables: [
      { text: 'e', isStressed: false, phonetic: 'iː' },
      { text: 'co', isStressed: false, phonetic: 'kə' },
      { text: 'NOM', isStressed: true, phonetic: 'nɒm' },
      { text: 'ic', isStressed: false, phonetic: 'ɪk' }
    ],
    stressPosition: 3,
    category: 'stress_3',
    categoryLabel: 'Trọng âm 3-4 âm tiết',
    rule: 'Quy tắc vàng: Từ kết thúc bằng đuôi -IC, -ICAL trọng âm LUÔN rơi vào âm tiết LIỀN TRƯỚC NÓ (eco-NOM-ic, his-TOR-ic).',
    trapNote: 'Bẫy đề thi: Danh từ e-CO-no-my (nhấn âm 2) nhưng tính từ eco-NOM-ic (nhấn âm 3)!',
    example: 'Green technology promotes sustainable economic growth.'
  },
  {
    id: 'thpt_s3_3',
    word: 'biodiversity',
    ipa: '/ˌbaɪ.əʊ.daɪˈvɜː.sɪ.ti/',
    syllables: [
      { text: 'bi', isStressed: false, phonetic: 'baɪ' },
      { text: 'o', isStressed: false, phonetic: 'əʊ' },
      { text: 'di', isStressed: false, phonetic: 'daɪ' },
      { text: 'VER', isStressed: true, phonetic: 'vɜː' },
      { text: 'si', isStressed: false, phonetic: 'sɪ' },
      { text: 'ty', isStressed: false, phonetic: 'ti' }
    ],
    stressPosition: 4,
    category: 'stress_3',
    categoryLabel: 'Trọng âm 3-4 âm tiết',
    rule: 'Quy tắc vàng: Từ kết thúc bằng -ITY, -ETY trọng âm rơi vào âm tiết THỨ 3 TỪ CUỐI ĐẾM LÊN.',
    trapNote: 'bi-o-di-VER-si-ty, ac-TI-vi-ty, com-mu-NI-ty.',
    example: 'Conserving biodiversity is crucial for our planet.'
  },
  {
    id: 'thpt_s3_4',
    word: 'volunteer',
    ipa: '/ˌvɒl.ənˈtɪər/',
    syllables: [
      { text: 'vol', isStressed: false, phonetic: 'vɒl' },
      { text: 'un', isStressed: false, phonetic: 'ən' },
      { text: 'TEER', isStressed: true, phonetic: 'tɪər' }
    ],
    stressPosition: 3,
    category: 'stress_3',
    categoryLabel: 'Trọng âm 3-4 âm tiết',
    rule: 'Hậu tố nhận chính trọng âm: Các từ có đuôi -EER, -EE, -ESE, -IQUE trọng âm RƠI VÀO CHÍNH NÓ (volun-TEER, engi-NEER, Vietna-MESE).',
    trapNote: 'Trọng âm nằm ở chính âm tiết cuối cùng!',
    example: 'Students volunteer to teach English in rural areas.'
  },
  {
    id: 'thpt_s3_5',
    word: 'photography',
    ipa: '/fəˈtɒɡ.rə.fi/',
    syllables: [
      { text: 'pho', isStressed: false, phonetic: 'fə' },
      { text: 'TOG', isStressed: true, phonetic: 'tɒɡ' },
      { text: 'ra', isStressed: false, phonetic: 'rə' },
      { text: 'phy', isStressed: false, phonetic: 'fi' }
    ],
    stressPosition: 2,
    category: 'stress_3',
    categoryLabel: 'Trọng âm 3-4 âm tiết',
    rule: 'Từ kết thúc bằng -PHY, -GY trọng âm rơi vào âm tiết thứ 3 từ cuối đếm lên (pho-TOG-ra-phy, bi-OL-o-gy).',
    trapNote: 'PHO-to (nhấn 1) nhưng pho-TOG-ra-phy (nhấn 2)!',
    example: 'Landscape photography requires patience and skill.'
  },

  // CHUYÊN ĐỀ 3: PHÁT ÂM ĐUÔI -ED
  {
    id: 'thpt_ed_1',
    word: 'decided',
    ipa: '/dɪˈsaɪ.dɪd/',
    syllables: [
      { text: 'de', isStressed: false, phonetic: 'dɪ' },
      { text: 'ci', isStressed: true, phonetic: 'saɪ' },
      { text: 'DED (/ɪd/)', isStressed: false, phonetic: 'dɪd' }
    ],
    stressPosition: 2,
    category: 'pron_ed',
    categoryLabel: 'Quy tắc phát âm đuôi -ed',
    rule: 'Quy tắc 1 (/ɪd/): Đuôi -ed phát âm là /ɪd/ khi động từ tận cùng bằng âm /t/ hoặc /d/ (wanted, decided, polluted).',
    trapNote: 'Mẹo nhớ nhanh trong phòng thi: "Tiền Đô" (T và D).',
    example: 'They decided to adopt eco-friendly habits.'
  },
  {
    id: 'thpt_ed_2',
    word: 'looked',
    ipa: '/lʊkt/',
    syllables: [
      { text: 'looked (/t/)', isStressed: true, phonetic: 'lʊkt' }
    ],
    stressPosition: 1,
    category: 'pron_ed',
    categoryLabel: 'Quy tắc phát âm đuôi -ed',
    rule: 'Quy tắc 2 (/t/): Đuôi -ed phát âm là /t/ khi tận cùng bằng âm vô thanh: /p/, /k/, /f/, /s/, /ʃ/ (sh), /tʃ/ (ch).',
    trapNote: 'Mẹo nhớ: "Chính Phủ Phát Sách Không Thèm Share".',
    example: 'He looked at the exam questions thoroughly.'
  },
  {
    id: 'thpt_ed_3',
    word: 'played',
    ipa: '/pleɪd/',
    syllables: [
      { text: 'played (/d/)', isStressed: true, phonetic: 'pleɪd' }
    ],
    stressPosition: 1,
    category: 'pron_ed',
    categoryLabel: 'Quy tắc phát âm đuôi -ed',
    rule: 'Quy tắc 3 (/d/): Đuôi -ed phát âm là /d/ với các trường hợp còn lại (nguyên âm & phụ âm hữu thanh).',
    trapNote: 'Âm /d/ rung nhẹ dây thanh quản, đọc nhẹ ở cuối.',
    example: 'Children played happily in the schoolyard.'
  },

  // CHUYÊN ĐỀ 4: PHÁT ÂM ĐUÔI -S/-ES
  {
    id: 'thpt_s_1',
    word: 'books',
    ipa: '/bʊks/',
    syllables: [
      { text: 'books (/s/)', isStressed: true, phonetic: 'bʊks' }
    ],
    stressPosition: 1,
    category: 'pron_s',
    categoryLabel: 'Quy tắc phát âm đuôi -s/-es',
    rule: 'Đuôi -s phát âm là /s/ khi tận cùng bằng các âm vô thanh: /p/, /t/, /k/, /f/, /θ/.',
    trapNote: 'Mẹo nhớ: "Thời Phong Kiến Phương Tây" (Th, P, K, Ph, T).',
    example: 'Students read classic books for literature.'
  },
  {
    id: 'thpt_s_2',
    word: 'watches',
    ipa: '/ˈwɒtʃ.ɪz/',
    syllables: [
      { text: 'watch', isStressed: true, phonetic: 'wɒtʃ' },
      { text: 'ES (/ɪz/)', isStressed: false, phonetic: 'ɪz' }
    ],
    stressPosition: 1,
    category: 'pron_s',
    categoryLabel: 'Quy tắc phát âm đuôi -s/-es',
    rule: 'Đuôi -es phát âm là /ɪz/ khi tận cùng bằng âm gió: /s/, /z/, /ʃ/, /tʃ/, /dʒ/.',
    trapNote: 'Mẹo nhớ: "Sáu Chạy Xe Sh Giỏi Zữ".',
    example: 'He watches science documentaries on weekends.'
  },
  {
    id: 'thpt_s_3',
    word: 'pens',
    ipa: '/penz/',
    syllables: [
      { text: 'pens (/z/)', isStressed: true, phonetic: 'penz' }
    ],
    stressPosition: 1,
    category: 'pron_s',
    categoryLabel: 'Quy tắc phát âm đuôi -s/-es',
    rule: 'Đuôi -s/-es phát âm là /z/ với các trường hợp còn lại (nguyên âm và phụ âm hữu thanh).',
    trapNote: 'Âm /z/ cần rung nhẹ thanh quản, không được đọc thành /s/.',
    example: 'Bring two black pens to the exam room.'
  }
];

// Ngân hàng câu hỏi chấm phát âm Tiếng Anh mở rộng (285+ câu hỏi offline chuẩn SGK Global Success & CEFR)
// Được gán kèm thông số độ khó IRT difficulty (b) từ -2.5 (dễ) đến +3.4 (rất khó)
const SENTENCES_BY_GRADE = EXTENDED_PRONUNCIATION_SENTENCES;

export default function PronunciationAssessor({ selectedGrade, keys }) {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);

  // THUẬT TOÁN THÍCH ỨNG IRT & SPACED REPETITION (SM-2)
  const [theta, setTheta] = useState(0.0); // Năng lực học tập ước lượng hiện tại
  const [history, setHistory] = useState([]); // Lịch sử làm bài: [{question, response}]
  const [isAdaptive, setIsAdaptive] = useState(true); // Bật/tắt chế độ thích ứng IRT
  const [loadingNext, setLoadingNext] = useState(false); // Trạng thái tải câu tiếp theo
  const [spacedRepetitionInfo, setSpacedRepetitionInfo] = useState(null); // Thông tin ôn tập SM-2

  // Ngân hàng câu hỏi động tải từ backend API & Gemini AI
  const [dynamicSentences, setDynamicSentences] = useState([]);
  const [aiSentences, setAiSentences] = useState([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  // CHẾ ĐỘ SEnglish THPT: CHUYÊN ĐỀ TRỌNG ÂM & NGỮ ÂM (SHADOWING & IPA)
  const [assessmentMode, setAssessmentMode] = useState('thpt_stress'); // 'thpt_stress' | 'general'
  const [thptCategory, setThptCategory] = useState('all');
  const [thptIndex, setThptIndex] = useState(0);
  const [isShadowingListening, setIsShadowingListening] = useState(false);
  const [shadowingResult, setShadowingResult] = useState(null);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);

  const filteredThptWords = useMemo(() => {
    if (thptCategory === 'all') return THPT_STRESS_BANK;
    return THPT_STRESS_BANK.filter(w => w.category === thptCategory);
  }, [thptCategory]);

  const currentThptWord = filteredThptWords[thptIndex] || filteredThptWords[0];

  const playThptSample = (word, rate = 1.0) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = 'en-US';
    utter.rate = rate;
    window.speechSynthesis.speak(utter);
  };

  const startShadowingMic = (targetWord) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Trình duyệt chưa hỗ trợ Web Speech Recognition trực tiếp. Bạn hãy thử trên Google Chrome hoặc Microsoft Edge.");
      return;
    }

    setIsShadowingListening(true);
    setShadowingResult(null);

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      recognition.onresult = (event) => {
        const spoken = (event.results[0][0].transcript || '').trim().toLowerCase();
        const targetClean = targetWord.toLowerCase().trim();
        const isMatch = spoken === targetClean || spoken.includes(targetClean) || targetClean.includes(spoken);

        if (isMatch) {
          setShadowingResult({
            match: true,
            spokenText: spoken,
            score: 100,
            message: 'Xuất sắc 100%! Bạn đã nhấn chuẩn xác trọng âm và ngữ điệu người bản xứ!'
          });
        } else {
          setShadowingResult({
            match: false,
            spokenText: spoken,
            score: 60,
            message: `Hệ thống ghi nhận âm: "${spoken}". Hãy bấm nghe lại phát âm chậm 0.8x và đọc to rõ âm tiết nhấn nhé!`
          });
        }
        setIsShadowingListening(false);
      };

      recognition.onerror = (event) => {
        console.warn("Speech error:", event.error);
        setIsShadowingListening(false);
      };

      recognition.onend = () => {
        setIsShadowingListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsShadowingListening(false);
    }
  };

  const [isAutoAI, setIsAutoAI] = useState(true);
  const [selectedWordInfo, setSelectedWordInfo] = useState(null);

  const playWordSample = (wordText) => {
    if (!wordText) return;
    try {
      window.speechSynthesis?.cancel();
      const utterance = new SpeechSynthesisUtterance(wordText);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis?.speak(utterance);
    } catch (e) {
      console.warn("Speech error:", e);
    }
  };

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Tải danh sách câu hỏi mỗi lớp/trình độ từ backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${API_BASE}/content/pronounce/sentences?grade=${selectedGrade}`);
        if (response.data.status === 'success' && response.data.data?.length > 0) {
          const mapped = response.data.data
            .filter(s => s.is_active)
            .map(s => ({
              id: s.id,
              text: s.text,
              level: `Lớp ${s.level_grade} (IRT: ${s.difficulty.toFixed(1)})`,
              difficulty: s.difficulty
            }));
          if (mapped.length > 0) {
            setDynamicSentences(mapped);
            return;
          }
        }
        setDynamicSentences([]);
      } catch (err) {
        console.error("Dùng ngân hàng câu hỏi nội bộ fallback:", err);
        setDynamicSentences([]);
      }
    };
    fetchQuestions();
  }, [selectedGrade]);

  // Sinh câu phát âm ngẫu nhiên mới bằng Gemini AI
  const generateNewAISentences = async (count = 1) => {
    setIsGeneratingAI(true);
    try {
      const generated = [];
      for (let i = 0; i < count; i++) {
        const response = await axios.post(
          `${API_BASE}/pronounce/generate-sentence`,
          { level: selectedGrade },
          { headers: getHeaders() }
        );
        if (response.data?.sentence) {
          generated.push(response.data.sentence);
        }
      }
      if (generated.length > 0) {
        setAiSentences(prev => [...generated, ...prev]);
        setAssessmentResult(null);
      }
    } catch (err) {
      console.error("Lỗi sinh câu AI:", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Tự động sinh câu AI khi chuyển trình độ nếu bật Auto AI
  useEffect(() => {
    if (isAutoAI && keys?.gemini) {
      generateNewAISentences(2);
    }
  }, [selectedGrade]);

  // Lọc câu hỏi tương ứng khối lớp / trình độ CEFR - Hợp nhất DB và ngân hàng nội bộ
  const basePool = useMemo(() => {
    const localBank = SENTENCES_BY_GRADE[selectedGrade] || SENTENCES_BY_GRADE["12"] || [];
    const combined = [...dynamicSentences, ...localBank];
    const seen = new Set();
    const unique = [];
    for (const item of combined) {
      const clean = (item.text || '').trim().toLowerCase();
      if (clean && !seen.has(clean)) {
        seen.add(clean);
        unique.push(item);
      }
    }
    return unique.length > 0 ? unique : localBank;
  }, [dynamicSentences, selectedGrade]);

  const sentences = useMemo(() => [...aiSentences, ...basePool], [aiSentences, basePool]);
  const currentSentence = sentences[currentSentenceIndex] || sentences[0] || { text: "Welcome to Examora AI.", level: "Default" };

  // Tự động random câu hỏi khi vào trang hoặc đổi khối lớp
  useEffect(() => {
    const bank = SENTENCES_BY_GRADE[selectedGrade] || SENTENCES_BY_GRADE["12"] || [];
    if (bank.length > 0) {
      const randIdx = Math.floor(Math.random() * bank.length);
      setCurrentSentenceIndex(randIdx);
    } else {
      setCurrentSentenceIndex(0);
    }
    setAiSentences([]);
    setAssessmentResult(null);
    setTheta(0.0);
    setHistory([]);
    setSpacedRepetitionInfo(null);
  }, [selectedGrade]);

  // Helper lấy headers chứa Azure Key và Gemini Key
  const getHeaders = (isMultipart = false) => {
    const headers = {};
    if (isMultipart) {
      headers['Content-Type'] = 'multipart/form-data';
    }
    if (keys?.azure) headers['x-azure-key'] = keys.azure;
    if (keys?.gemini) headers['x-gemini-key'] = keys.gemini;
    return headers;
  };

  // Phát âm câu mẫu chuẩn (TTS)
  const playSample = async () => {
    setIsPlayingSample(true);
    try {
      const response = await axios.post(
        `${API_BASE}/tts`,
        { text: currentSentence.text },
        { 
          responseType: 'blob',
          headers: getHeaders()
        }
      );
      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlayingSample(false);
      audio.onerror = () => setIsPlayingSample(false);
      await audio.play();
    } catch (error) {
      console.error("Lỗi phát giọng mẫu:", error);
      setIsPlayingSample(false);
    }
  };

  // Bắt đầu ghi âm giọng đọc (Tối ưu cho cả Mobile Safari/Chrome và Desktop)
  const startRecording = async () => {
    audioChunksRef.current = [];
    setAssessmentResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      let options = {};
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          options = { mimeType: 'audio/webm;codecs=opus' };
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          options = { mimeType: 'audio/webm' };
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          options = { mimeType: 'audio/mp4' };
        } else if (MediaRecorder.isTypeSupported('audio/aac')) {
          options = { mimeType: 'audio/aac' };
        }
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const actualMime = mediaRecorder.mimeType || options.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMime });
        try {
          stream.getTracks().forEach(track => track.stop());
        } catch (e) {}
        sendToAssessment(audioBlob);
      };

      mediaRecorder.start(250);
      setIsRecording(true);
    } catch (error) {
      console.error("Lỗi micro:", error);
      setAssessmentResult({
        silenceDetected: true,
        errorNotice: "Không thể truy cập Microphone. Vui lòng cấp quyền Microphone cho trình duyệt trong Cài đặt của điện thoại.",
        words: []
      });
    }
  };

  // Dừng ghi âm và gửi đi chấm điểm
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (mediaRecorderRef.current.state === 'recording') {
        try {
          mediaRecorderRef.current.requestData();
        } catch (e) {}
      }
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Gửi file ghi âm lên backend chấm điểm
  const sendToAssessment = async (audioBlob) => {
    setIsLoading(true);
    setAssessmentResult(null);

    const refWords = currentSentence.text.split(/\s+/).map(w => w.replace(/[.,!?"']/g, '').trim()).filter(Boolean);

    // Kiểm tra nếu audio quá bé (< 400 bytes)
    if (!audioBlob || audioBlob.size < 400) {
      setAssessmentResult({
        accuracyScore: 0,
        fluencyScore: 0,
        completenessScore: 0,
        pronunciationScore: 0,
        silenceDetected: true,
        words: refWords.map(w => ({
          Word: w,
          word: w,
          accuracyScore: 0,
          errorType: 'Omission'
        }))
      });
      setIsLoading(false);
      return;
    }

    let ext = 'webm';
    if (audioBlob.type.includes('mp4')) ext = 'mp4';
    else if (audioBlob.type.includes('aac') || audioBlob.type.includes('m4a')) ext = 'm4a';
    else if (audioBlob.type.includes('wav')) ext = 'wav';
    else if (audioBlob.type.includes('ogg')) ext = 'ogg';

    const formData = new FormData();
    formData.append('file', audioBlob, `speech.${ext}`);
    formData.append('reference_text', currentSentence.text);

    try {
      const response = await axios.post(`${API_BASE}/pronounce-assess`, formData, {
        headers: getHeaders(true)
      });
      
      const nbest = response.data.NBest?.[0];
      const isSilence = response.data.RecognitionStatus === 'InitialSilenceTimeout' || (!nbest || nbest.PronunciationAssessment?.PronunciationScore === 0);

      if (isSilence) {
        setAssessmentResult({
          accuracyScore: 0,
          fluencyScore: 0,
          completenessScore: 0,
          pronunciationScore: 0,
          silenceDetected: true,
          words: refWords.map(w => ({
            Word: w,
            word: w,
            accuracyScore: 0,
            errorType: 'Omission'
          }))
        });
        setIsLoading(false);
        return;
      }

      if (nbest) {
        let overallScore = nbest.PronunciationAssessment?.PronunciationScore || 0;
        let accuracy = nbest.PronunciationAssessment?.AccuracyScore || 0;
        let fluency = nbest.PronunciationAssessment?.FluencyScore || 0;
        let completeness = nbest.PronunciationAssessment?.CompletenessScore || 0;
        
        let evaluatedWords = (nbest.Words || []).map(w => {
          const wText = w.Word || w.word || '';
          const acc = w.PronunciationAssessment?.AccuracyScore ?? w.accuracyScore ?? 0;
          const err = w.PronunciationAssessment?.ErrorType ?? (acc >= 70 ? 'None' : 'Mispronunciation');
          return {
            Word: wText,
            word: wText,
            accuracyScore: acc,
            errorType: err
          };
        });

        const isReallySilent = evaluatedWords.length === 0 || evaluatedWords.every(w => w.accuracyScore === 0);

        setAssessmentResult({
          accuracyScore: accuracy,
          fluencyScore: fluency,
          completenessScore: completeness,
          pronunciationScore: overallScore,
          silenceDetected: isReallySilent,
          words: evaluatedWords
        });

        // Cập nhật IRT Năng lực
        const responseVal = overallScore >= 70 ? 1 : 0;
        const newHistoryItem = {
          question: {
            item_id: (currentSentence.id || 1).toString(),
            difficulty: currentSentence.difficulty || 0,
            discrimination: 1.0,
            guessing: 0.2
          },
          response: responseVal
        };
        const updatedHistory = [...history, newHistoryItem];
        setHistory(updatedHistory);

        try {
          const thetaRes = await axios.post(`${API_BASE}/adaptive/update-ability`, {
            history: updatedHistory
          });
          if (thetaRes.data.status === 'success') {
            setTheta(thetaRes.data.new_theta);
          }
        } catch (err) {}

        // Cập nhật SM-2 Spaced Repetition
        let quality = overallScore >= 85 ? 5 : overallScore >= 70 ? 4 : overallScore >= 55 ? 3 : 2;
        const currentRep = spacedRepetitionInfo?.repetition || 0;
        const currentEF = spacedRepetitionInfo?.ef || 2.5;
        const currentInterval = spacedRepetitionInfo?.interval || 1;

        try {
          const sm2Res = await axios.post(`${API_BASE}/spaced-repetition/next-review`, {
            quality: quality,
            current_repetition: currentRep,
            current_ef: currentEF,
            current_interval: currentInterval
          });
          if (sm2Res.data.status === 'success') {
            setSpacedRepetitionInfo({
              interval: sm2Res.data.next_interval_days,
              ef: sm2Res.data.new_ef,
              repetition: sm2Res.data.new_repetition,
              qualityScore: quality
            });
          }
        } catch (err) {}

      } else {
        setAssessmentResult({
          accuracyScore: 0,
          fluencyScore: 0,
          completenessScore: 0,
          pronunciationScore: 0,
          silenceDetected: true,
          words: refWords.map(w => ({
            Word: w,
            word: w,
            accuracyScore: 0,
            errorType: 'Omission'
          }))
        });
      }
    } catch (error) {
      console.error("Lỗi chấm phát âm:", error);
      setAssessmentResult({
        accuracyScore: 0,
        fluencyScore: 0,
        completenessScore: 0,
        pronunciationScore: 0,
        silenceDetected: true,
        words: refWords.map(w => ({
          Word: w,
          word: w,
          accuracyScore: 0,
          errorType: 'Omission'
        }))
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Đổi ngẫu nhiên một câu trong ngân hàng
  const jumpRandomSentence = () => {
    if (sentences.length <= 1) return;
    let nextIdx;
    let tries = 0;
    do {
      nextIdx = Math.floor(Math.random() * sentences.length);
      tries++;
    } while (nextIdx === currentSentenceIndex && tries < 10);
    setCurrentSentenceIndex(nextIdx);
    setAssessmentResult(null);
    setSpacedRepetitionInfo(null);
  };

  // Quay lại câu trước
  const prevSentence = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(prev => prev - 1);
      setAssessmentResult(null);
      setSpacedRepetitionInfo(null);
    }
  };

  // Chuyển câu tiếp theo
  const nextSentence = async () => {
    setSpacedRepetitionInfo(null);

    // Nếu bật Auto AI, tự động sinh thêm 1 câu AI mới ở background khi tiến gần cuối danh sách
    if (isAutoAI && currentSentenceIndex >= sentences.length - 2) {
      generateNewAISentences(1);
    }

    // Nếu bật chế độ thích ứng IRT
    if (isAdaptive && history.length > 0) {
      setLoadingNext(true);
      try {
        const nextQRes = await axios.post(`${API_BASE}/adaptive/next-question`, {
          theta: theta,
          excluded_ids: history.map(h => h.question.item_id),
          pool: sentences.map(s => ({
            item_id: (s.id || 1).toString(),
            difficulty: s.difficulty || 0,
            discrimination: 1.0,
            guessing: 0.2
          }))
        });

        if (nextQRes.data.status === 'success') {
          const nextQuestionId = parseInt(nextQRes.data.question.item_id);
          const nextIndex = sentences.findIndex(s => s.id === nextQuestionId);
          if (nextIndex !== -1) {
            setCurrentSentenceIndex(nextIndex);
            setAssessmentResult(null);
            setLoadingNext(false);
            return;
          }
        }
      } catch (err) {
        console.error("Lỗi chọn câu hỏi thích ứng:", err);
      } finally {
        setLoadingNext(false);
      }
    }

    // Luồng chuyển câu bình thường tuần tự (xoay vòng)
    setCurrentSentenceIndex(prev => (prev + 1) % sentences.length);
    setAssessmentResult(null);
  };

  // Màu từ phát âm
  const getWordColor = (wordAssessment) => {
    if (!wordAssessment) return 'text-gray-300';
    const errorType = wordAssessment.errorType || wordAssessment.PronunciationAssessment?.ErrorType;
    const score = wordAssessment.accuracyScore ?? wordAssessment.PronunciationAssessment?.AccuracyScore ?? 0;
    
    if (errorType === 'Omission' || score === 0) return 'text-gray-600 line-through';
    if (errorType === 'Mispronunciation' || score < 70) return 'text-red-400 font-bold underline decoration-wavy decoration-red-500';
    return 'text-emerald-400 font-extrabold';
  };

  return (
    <div className="w-full py-2 px-1 space-y-6">
      {/* SEnglish inspired THPT Mode Switcher */}
      <div className="flex p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-xl max-w-2xl mx-auto">
        <button
          onClick={() => {
            setAssessmentMode('thpt_stress');
            setShadowingResult(null);
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 ${
            assessmentMode === 'thpt_stress'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold shadow-lg shadow-orange-500/25'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>🎯 Chuyên Đề Trọng Âm &amp; Ngữ Âm THPT (Shadowing &amp; IPA)</span>
        </button>
        <button
          onClick={() => setAssessmentMode('general')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
            assessmentMode === 'general'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>🎙️ Chấm Phát Âm Câu Dài (AI IRT)</span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════════════ */}
      {/* VIEW 1: CHUYÊN ĐỀ TRỌNG ÂM & NGỮ ÂM THPT (SHADOWING & PHIÊN ÂM IPA CHUẨN) */}
      {/* ════════════════════════════════════════════════════════════════════════════════ */}
      {assessmentMode === 'thpt_stress' && currentThptWord && (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl bg-white/[0.02] border border-white/5">
            {[
              { id: 'all', label: 'Tất cả chuyên đề' },
              { id: 'stress_2', label: 'Trọng âm 2 âm tiết' },
              { id: 'stress_3', label: 'Trọng âm 3-4 âm tiết' },
              { id: 'pron_ed', label: 'Quy tắc đuôi -ed' },
              { id: 'pron_s', label: 'Quy tắc đuôi -s/-es' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setThptCategory(cat.id);
                  setThptIndex(0);
                  setShadowingResult(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  thptCategory === cat.id
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Core Interactive Shadowing Card */}
          <div className="glass rounded-3xl p-6 md:p-10 border border-amber-500/30 shadow-2xl bg-[#080d22]/90 space-y-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase">
                  {currentThptWord.categoryLabel}
                </span>
                <span className="text-xs text-gray-400 font-bold">
                  Từ {thptIndex + 1}/{filteredThptWords.length}
                </span>
              </div>

              {/* Speech speed selector */}
              <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
                <span className="text-[11px] text-gray-400 px-2 font-bold">Tốc độ audio:</span>
                <button
                  onClick={() => setSpeechSpeed(0.8)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    speechSpeed === 0.8 ? 'bg-amber-500 text-black font-extrabold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  0.8x (Chậm)
                </button>
                <button
                  onClick={() => setSpeechSpeed(1.0)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    speechSpeed === 1.0 ? 'bg-amber-500 text-black font-extrabold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  1.0x (Chuẩn)
                </button>
              </div>
            </div>

            {/* Word Display & IPA Breakdown */}
            <div className="text-center space-y-4 py-4">
              <h2 className="text-4xl md:text-6xl font-black text-white font-outfit tracking-tight">
                {currentThptWord.word}
              </h2>

              {/* Large High-visibility IPA */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-white/[0.04] border border-white/10">
                <span className="text-xl md:text-2xl font-mono font-bold text-amber-400 tracking-wider">
                  {currentThptWord.ipa}
                </span>
              </div>

              {/* Syllable Breakdown Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="text-xs text-gray-400 block w-full mb-1">Cấu trúc phân tách âm tiết:</span>
                {currentThptWord.syllables.map((syl, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-2 rounded-2xl text-base font-extrabold tracking-wide transition flex flex-col items-center ${
                      syl.isStressed
                        ? 'bg-gradient-to-b from-amber-500 to-orange-500 text-black shadow-lg shadow-orange-500/30 scale-105 border border-amber-300'
                        : 'bg-white/5 text-gray-300 border border-white/10'
                    }`}
                  >
                    <span>{syl.text}</span>
                    <span className="text-[10px] opacity-75 font-mono">/{syl.phonetic}/</span>
                    {syl.isStressed && (
                      <span className="text-[9px] font-black uppercase tracking-tighter mt-0.5">
                        ⭐ Trọng âm
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Shadowing Action Zone */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Step 1: Listen Audio */}
              <button
                onClick={() => playThptSample(currentThptWord.word, speechSpeed)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2.5 cursor-pointer"
                title="Nghe phát âm chuẩn người bản xứ"
              >
                <Volume2 className="w-5 h-5" />
                <span>1. Nghe Người Bản Xứ ({speechSpeed}x)</span>
              </button>

              {/* Step 2: Shadowing Mic */}
              <button
                onClick={() => startShadowingMic(currentThptWord.word)}
                disabled={isShadowingListening}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-xs transition flex items-center justify-center gap-2.5 cursor-pointer shadow-xl ${
                  isShadowingListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-emerald-500/25'
                }`}
              >
                <Mic className="w-5 h-5" />
                <span>
                  {isShadowingListening ? 'Đang lắng nghe bạn đọc...' : '2. Bấm Mic Nói Nhại (Shadowing)'}
                </span>
              </button>
            </div>

            {/* Shadowing Result Feedback */}
            {shadowingResult && (
              <div 
                className={`p-5 rounded-2xl border transition animate-scale-in flex items-start gap-4 ${
                  shadowingResult.match
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                    : 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  shadowingResult.match ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {shadowingResult.match ? <Check className="w-6 h-6" /> : <Lightbulb className="w-6 h-6" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-black text-white">
                      {shadowingResult.match ? 'Chính Xác Hoàn Hảo!' : 'Cần Cải Thiện Thêm'}
                    </strong>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-white">
                      Điểm: {shadowingResult.score}/100
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">{shadowingResult.message}</p>
                </div>
              </div>
            )}

            {/* THPT Rule & Trap Explanation Box */}
            <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-black uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Quy Tắc Làm Đề Thi Tốt Nghiệp THPT:</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {currentThptWord.rule}
              </p>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Lưu ý bẫy đề thi:</strong> {currentThptWord.trapNote}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 italic">
                Ví dụ: &ldquo;{currentThptWord.example}&rdquo;
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  setThptIndex(prev => (prev - 1 + filteredThptWords.length) % filteredThptWords.length);
                  setShadowingResult(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Từ trước</span>
              </button>

              <button
                onClick={() => {
                  setThptIndex(prev => (prev + 1) % filteredThptWords.length);
                  setShadowingResult(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-orange-500/20"
              >
                <span>Từ tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════════════ */}
      {/* VIEW 2: CHẤM PHÁT ÂM CÂU DÀI THÍCH ỨNG AI (IRT ADAPTIVE) */}
      {/* ════════════════════════════════════════════════════════════════════════════════ */}
      {assessmentMode === 'general' && (
      <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between p-5 glass rounded-2xl mb-6 shadow-md border border-white/5 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-white font-outfit tracking-wide">Luyện &amp; Chấm Phát âm AI</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Luyện phát âm theo <strong className="text-brand-400">Trình độ {selectedGrade}</strong> ({sentences.length} câu sẵn có &amp; Sinh câu ngẫu nhiên không giới hạn bằng Gemini AI)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Nút Đổi câu ngẫu nhiên */}
          <button
            onClick={jumpRandomSentence}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition flex items-center gap-1.5 border border-white/10 cursor-pointer"
            title="Chọn ngẫu nhiên một câu khác trong ngân hàng câu hỏi"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            <span>Đổi câu ngẫu nhiên</span>
          </button>

          {/* Nút Tạo 3 câu AI bằng Gemini */}
          <button
            onClick={() => generateNewAISentences(3)}
            disabled={isGeneratingAI}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow glow-btn-brand"
            title="Kích hoạt Gemini AI tạo thêm 3 câu luyện phát âm ngẫu nhiên mới"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAI ? 'Gemini đang tạo câu...' : '+3 Câu Gemini AI'}</span>
          </button>

          {/* Toggle Auto AI Generation */}
          <div className="flex items-center space-x-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl text-xs" title="Tự động sinh thêm câu phát âm ngẫu nhiên từ Gemini AI khi thực hành">
            <span className="text-gray-300 font-semibold flex items-center gap-1">
              <Wand2 className="w-3.5 h-3.5 text-indigo-400" /> Auto AI
            </span>
            <button
              onClick={() => setIsAutoAI(!isAutoAI)}
              className={`w-8 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
                isAutoAI ? 'bg-indigo-600' : 'bg-gray-800'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  isAutoAI ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Chỉ số câu hỏi hiện tại */}
          <div className="text-xs text-gray-300 font-bold px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            Câu <span className="text-indigo-400 font-black text-sm">{currentSentenceIndex + 1}</span>/{sentences.length}
            {aiSentences.length > 0 && <span className="text-[10px] text-amber-400 ml-1 font-normal">(+{aiSentences.length} AI)</span>}
          </div>

          {/* Toggle IRT */}
          <div className="flex items-center space-x-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-gray-400 font-semibold">Thích ứng IRT</span>
            <button
              onClick={() => setIsAdaptive(!isAdaptive)}
              className={`w-8 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
                isAdaptive ? 'bg-indigo-600' : 'bg-gray-800'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  isAdaptive ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="text-xs text-brand-400 font-bold px-3 py-1.5 rounded-xl bg-brand-500/10 flex items-center gap-1.5 border border-brand-500/20">
            <BookOpen className="w-3.5 h-3.5 text-brand-400" />
            <span>{currentSentence.level}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Câu cần đọc & Nút điều khiển */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-8 shadow-md relative overflow-hidden min-h-[220px] flex flex-col justify-between border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl"></div>
            
            <div className="text-2xl md:text-3xl font-medium leading-relaxed font-outfit text-gray-100 py-2">
              {assessmentResult && !assessmentResult.silenceDetected ? (
                <div className="flex flex-wrap gap-x-3 gap-y-2">
                  {assessmentResult.words.map((wordObj, i) => (
                    <span key={i} className={getWordColor(wordObj)}>
                      {wordObj.Word || wordObj.word}
                    </span>
                  ))}
                </div>
              ) : (
                currentSentence.text
              )}
            </div>

            {assessmentResult?.silenceDetected && (
              <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold animate-fade-in mt-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Chưa phát hiện giọng nói: Micro chưa thu được tiếng của bạn hoặc âm lượng quá nhỏ. Bạn hãy bấm Micro lại và đọc to, rõ ràng câu mẫu nhé!</span>
              </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
              <button
                onClick={playSample}
                disabled={isPlayingSample || isRecording || isLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-300 transition glow-btn-dark cursor-pointer ${
                  isPlayingSample ? 'text-amber-400 animate-pulse bg-amber-400/5' : ''
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlayingSample ? 'Đang đọc...' : 'Nghe phát âm chuẩn'}</span>
              </button>

              <div className="text-[11px] text-gray-500 italic">
                {currentSentence.topic ? `Chủ đề: ${currentSentence.topic}` : `Trình độ ${selectedGrade}`}
              </div>
            </div>
          </div>

          {/* Điều khiển ghi âm */}
          <div className="flex items-center justify-center gap-6 p-4">
            <button
              onClick={prevSentence}
              disabled={isRecording || isLoading || currentSentenceIndex === 0}
              className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-gray-300 transition border border-white/5 glow-btn-dark cursor-pointer"
              title="Câu trước đó"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {isRecording ? (
              <button
                onClick={stopRecording}
                className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition shadow-md animate-pulse cursor-pointer"
                title="Dừng ghi âm và nhận diện"
              >
                <Square className="w-8 h-8 fill-current" />
              </button>
            ) : (
              <button
                onClick={startRecording}
                disabled={isPlayingSample || isLoading}
                className="w-20 h-20 rounded-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-800 flex items-center justify-center text-white transition shadow-md cursor-pointer"
                title="Bắt đầu nói"
              >
                <Mic className="w-9 h-9" />
              </button>
            )}

            <button
              onClick={jumpRandomSentence}
              disabled={isRecording || isLoading}
              className="w-12 h-12 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-center text-amber-400 transition border border-amber-500/20 glow-btn-dark cursor-pointer"
              title="Đổi ngẫu nhiên câu khác"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={nextSentence}
              disabled={isRecording || isLoading || loadingNext}
              className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 transition border border-white/5 glow-btn-dark cursor-pointer"
              title="Câu tiếp theo"
            >
              <ChevronRight className={`w-6 h-6 ${loadingNext ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Cột phải: Kết quả phân tích từ AI */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-8 shadow-md min-h-[350px] flex flex-col justify-between border border-white/5">
            <h3 className="font-bold text-gray-200 text-sm mb-4 border-b border-white/5 pb-3">Phân tích phát âm</h3>
            
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-10 h-10 text-brand-500 animate-spin" />
                <span className="text-xs text-gray-400">AI đang lắng nghe và phân tích từng âm...</span>
              </div>
            ) : assessmentResult && !assessmentResult.silenceDetected ? (
              <div className="flex-1 flex flex-col justify-between space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl md:text-2xl font-black text-white font-outfit">
                      {assessmentResult.words?.filter(w => (w.accuracyScore || 0) >= 70).length >= Math.ceil(assessmentResult.words?.length * 0.8) ? (
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          Phát âm Chuẩn &amp; Rõ Ràng
                        </span>
                      ) : assessmentResult.words?.filter(w => (w.accuracyScore || 0) >= 70).length >= Math.ceil(assessmentResult.words?.length * 0.5) ? (
                        <span className="text-amber-400 flex items-center gap-1.5">
                          <Sparkles className="w-6 h-6 text-amber-400" />
                          Khá Tốt • Cần Chỉnh Vài Âm
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1.5">
                          <AlertCircle className="w-6 h-6 text-rose-400" />
                          Cần Luyện Rõ Âm Đuôi
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 font-semibold mt-1">
                      {assessmentResult.words?.filter(w => (w.accuracyScore || 0) >= 70).length || 0} / {assessmentResult.words?.length || 0} từ đọc chuẩn xác
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-brand-500/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-brand-400" />
                  </div>
                </div>

                {/* Phân tích từ đúng vs từ cần sửa */}
                <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                    <span>Phân tích chi tiết từng từ:</span>
                    <span className="text-[10px] text-gray-500 font-normal">Bấm vào từ để nghe riêng</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {assessmentResult.words?.map((w, idx) => {
                      const wordText = w.Word || w.word;
                      const isGood = (w.accuracyScore || 0) >= 70;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            playWordSample(wordText);
                            setSelectedWordInfo({
                              word: wordText,
                              isGood: isGood
                            });
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isGood
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                              : 'bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25 animate-pulse'
                          }`}
                          title="Bấm để nghe AI phát âm chậm riêng từ này"
                        >
                          <span>{wordText}</span>
                          <span>{isGood ? '✓' : '⚠️'}</span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedWordInfo && (
                    <div className="mt-2 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs animate-fade-in">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="text-white font-bold">"{selectedWordInfo.word}":</span>
                        <span className="text-gray-300">
                          {selectedWordInfo.isGood ? 'Đã phát âm chuẩn xác!' : 'Cần bật rõ âm đuôi và nhấn đúng trọng âm.'}
                        </span>
                      </div>
                      <button
                        onClick={() => playWordSample(selectedWordInfo.word)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px] hover:bg-indigo-500 cursor-pointer transition"
                      >
                        🔊 Nghe lại
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-400">Độ chuẩn xác nguyên âm &amp; phụ âm</span>
                      <span className="text-emerald-400 font-bold">
                        {assessmentResult.accuracyScore >= 80 ? 'Rất chuẩn xác' : assessmentResult.accuracyScore >= 60 ? 'Tương đối tốt' : 'Cần chú ý âm đuôi'}
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.max(15, assessmentResult.accuracyScore)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-400">Độ lưu loát &amp; ngắt nghỉ tự nhiên</span>
                      <span className="text-brand-400 font-bold">
                        {assessmentResult.fluencyScore >= 75 ? 'Tự nhiên & Trôi chảy' : 'Khá lưu loát'}
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-brand-500 h-full rounded-full" style={{ width: `${Math.max(20, assessmentResult.fluencyScore)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-400">Mức độ hoàn thành câu</span>
                      <span className="text-indigo-400 font-bold">
                        {assessmentResult.completenessScore >= 80 ? 'Hoàn thành trọn vẹn' : 'Đã đọc hầu hết các từ'}
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.max(25, assessmentResult.completenessScore)}%` }}></div>
                    </div>
                  </div>
                </div>

                {spacedRepetitionInfo && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-500/10 to-indigo-500/10 border border-brand-500/10 space-y-1.5">
                    <div className="text-[11px] text-brand-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      <span>Chu kỳ ôn tập ngắt quãng (SM-2)</span>
                    </div>
                    <div className="text-xs text-white font-medium">
                      Lịch nhắc nhở luyện lại câu này: <span className="text-emerald-400 font-bold underline">Sau {spacedRepetitionInfo.interval} ngày</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shadow-lg">
                  <Mic className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-1.5 max-w-xs">
                  <h4 className="text-sm font-bold text-white">Sẵn sàng nhận diện phát âm</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Nhấn nút <strong className="text-emerald-400">Micro</strong> và đọc to câu mẫu tiếng Anh. AI sẽ chỉ ra từ nào bạn đọc chuẩn (màu xanh ✓) và từ nào cần sửa lại (màu đỏ ⚠️).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
      )}
    </div>
  );
}
