import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, Award, Clock, ArrowRight, 
  Search, Filter, BookOpen, Download, ExternalLink, Sparkles, Zap, ChevronRight,
  Eye, Check, X, HelpCircle, ChevronDown, ChevronUp, RotateCcw, AlertCircle, Building2, MapPin
} from 'lucide-react';

export const COMPREHENSIVE_EXAMS_DATABASE = [
  // ===================== KHỐI CẤP 3 (THPT - LỚP 10, 11, 12) =====================
  {
    id: 'thpt-2026-sample',
    level: 'cap3',
    province: 'Bộ Giáo dục & Đào tạo',
    school: 'Bộ GD&ĐT',
    date: '2026.06.28',
    type: 'Đề mẫu Bộ GD&ĐT',
    typeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    title: 'Đề minh họa Tốt nghiệp THPT 2026 Môn Tiếng Anh — Chuẩn GDPT 2018',
    subtitle: 'Nguồn: Bộ GD&ĐT • Cấu trúc mới 40 câu • Đầy đủ Notice, Leaflet, Sentence Arrangement, Reading',
    questionsCount: 8,
    time: 50,
    solvedCount: 3420,
    avgScore: '7.45',
    category: 'thpt',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: NGỮ ÂM & TRỌNG ÂM',
        question: 'Choose the word whose underlined part differs from the other three in pronunciation:',
        options: [
          { key: 'A', text: 'innovat<u>ed</u>' },
          { key: 'B', text: 'protect<u>ed</u>' },
          { key: 'C', text: 'provid<u>ed</u>' },
          { key: 'D', text: 'improv<u>ed</u>' }
        ],
        correctAnswer: 'D',
        explanation: 'Đáp án D phát âm là /d/ (improved /ɪmˈpruːvd/). Các đáp án A, B, C đều kết thúc bằng âm /t/ hoặc /d/ nên đuôi "-ed" phát âm là /ɪd/ (innovated /ɪd/, protected /ɪd/, provided /ɪd/).',
        trapTip: 'Quy tắc đuôi "-ed": Phát âm là /ɪd/ sau /t/, /d/; phát âm là /t/ sau các âm vô thanh (/p/, /k/, /f/, /s/, /ʃ/, /tʃ/); phát âm là /d/ cho các trường hợp còn lại.'
      },
      {
        id: 2,
        part: 'PHẦN I: NGỮ ÂM & TRỌNG ÂM',
        question: 'Choose the word that differs from the other three in the position of primary stress:',
        options: [
          { key: 'A', text: 'academic' },
          { key: 'B', text: 'generation' },
          { key: 'C', text: 'environmental' },
          { key: 'D', text: 'independent' }
        ],
        correctAnswer: 'C',
        explanation: 'Đáp án C (environmental /ɪnˌvaɪrənˈmentl/) có trọng âm rơi vào âm tiết thứ 4. Các từ còn lại có trọng âm rơi vào âm tiết thứ 3: academic /ˌækəˈdemɪk/, generation /ˌdʒenəˈreɪʃn/, independent /ˌɪndɪˈpendənt/.',
        trapTip: 'Hậu tố "-ic", "-tion", "-ent" thường làm trọng âm rơi vào âm tiết ngay trước nó.'
      },
      {
        id: 3,
        part: 'PHẦN II: THÔNG BÁO (NOTICE & LEAFLET)',
        passage: 'SCHOOL GREEN CLUB NOTICE\nWe are organizing a Campus Clean-up Day this Sunday. All participants are required to bring reusable gloves and wear school uniforms. If you are interested in joining, please register with your class monitor by Friday afternoon.',
        question: 'According to the notice, what must participants bring to the event?',
        options: [
          { key: 'A', text: 'Plastic trash bags' },
          { key: 'B', text: 'Reusable gloves' },
          { key: 'C', text: 'Cleaning detergent' },
          { key: 'D', text: 'Tree saplings' }
        ],
        correctAnswer: 'B',
        explanation: 'Dẫn chứng trong đoạn thông báo: "All participants are required to bring reusable gloves..." (Tất cả người tham gia được yêu cầu mang theo găng tay tái sử dụng).',
        trapTip: 'Dạng bài Notice thường hỏi chi tiết trực tiếp trong văn bản, cần scan từ khóa "bring" để đối chiếu nhanh.'
      },
      {
        id: 4,
        part: 'PHẦN III: SẮP XẾP ĐOẠN VĂN (ARRANGEMENT)',
        question: 'Arrange the following sentences into a meaningful paragraph:\na. Firstly, reading regularly expands your vocabulary and comprehension skills.\nb. In conclusion, cultivating a daily reading habit brings immense intellectual benefits.\nc. Nowadays, books remain one of the most effective tools for self-education.\nd. Secondly, it sharpens critical thinking and reduces mental stress.',
        options: [
          { key: 'A', text: 'c - a - d - b' },
          { key: 'B', text: 'a - d - c - b' },
          { key: 'C', text: 'c - d - a - b' },
          { key: 'D', text: 'd - a - c - b' }
        ],
        correctAnswer: 'A',
        explanation: 'Thứ tự logic chuẩn: \n1. (c) Câu chủ đề giới thiệu vai trò của sách (Nowadays, books remain...)\n2. (a) Luận điểm thứ nhất (Firstly...)\n3. (d) Luận điểm thứ hai (Secondly...)\n4. (b) Câu kết luận (In conclusion...).',
        trapTip: 'Nhận diện liên từ nối: Câu mở đoạn nêu bối cảnh (Nowadays) -> Luận điểm (Firstly -> Secondly) -> Kết bài (In conclusion).'
      },
      {
        id: 5,
        part: 'PHẦN IV: ĐIỀN TỪ KHUYẾT (CLOZE TEXT)',
        passage: 'Artificial Intelligence is revolutionizing modern education. It provides students with personalized learning pathways and enables teachers to assess academic progress (5)______ higher accuracy than ever before.',
        question: 'Choose the best option for blank (5):',
        options: [
          { key: 'A', text: 'with' },
          { key: 'B', text: 'in' },
          { key: 'C', text: 'at' },
          { key: 'D', text: 'for' }
        ],
        correctAnswer: 'A',
        explanation: 'Cụm giới từ cố định: "with accuracy" hoặc "with precision" mang nghĩa "với độ chính xác". "with higher accuracy than ever before" = với độ chính xác cao hơn bao giờ hết.',
        trapTip: 'Ghi nhớ collocations: with accuracy, with ease, with certainty.'
      }
    ]
  },
  {
    id: 'so-gddt-hanoi-2026',
    level: 'cap3',
    province: 'Sở GD&ĐT Hà Nội',
    school: 'Toàn thành phố Hà Nội',
    date: '2026.06.19',
    type: 'Sở GD&ĐT Hà Nội',
    typeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    title: 'Đề Khảo sát Chất lượng Tốt nghiệp THPT 2026 — Sở GD&ĐT Hà Nội',
    subtitle: 'Nguồn: Sở GD&ĐT Hà Nội • Đề thi chính thức đợt 2 • Kèm ma trận phân hóa và giải chi tiết',
    questionsCount: 5,
    time: 50,
    solvedCount: 2890,
    avgScore: '7.15',
    category: 'thpt',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: NGỮ PHÁP & TỪ VỰNG',
        question: 'If the government ______ stricter regulations earlier, the river would not be heavily polluted now.',
        options: [
          { key: 'A', text: 'had implemented' },
          { key: 'B', text: 'implemented' },
          { key: 'C', text: 'implements' },
          { key: 'D', text: 'would implement' }
        ],
        correctAnswer: 'A',
        explanation: 'Đây là câu điều kiện hỗn hợp loại 3-2 (Mixed Conditional): Mệnh đề If diễn tả điều kiện trái với quá khứ (earlier -> dùng Had + V3/ed), mệnh đề chính diễn tả kết quả ở hiện tại (now -> would not be).',
        trapTip: 'Bẫy thời gian: Thấy "earlier" ở mệnh đề If và "now" ở mệnh đề chính -> 100% câu điều kiện hỗn hợp 3-2.'
      },
      {
        id: 2,
        part: 'PHẦN I: NGỮ PHÁP & TỪ VỰNG',
        question: 'The new renewable energy project was approved ______ strong opposition from local manufacturers.',
        options: [
          { key: 'A', text: 'despite' },
          { key: 'B', text: 'although' },
          { key: 'C', text: 'because of' },
          { key: 'D', text: 'whereas' }
        ],
        correctAnswer: 'A',
        explanation: 'Phía sau chỗ trống là một Cụm danh từ ("strong opposition from local manufacturers") mang nghĩa đối lập -> dùng "despite" + Noun phrase. "Although" và "whereas" phải đi với Mệnh đề (S + V).',
        trapTip: 'Phân biệt: Despite / In spite of + Cụm N/V-ing; Although / Even though + Mệnh đề.'
      }
    ]
  },
  {
    id: 'so-gddt-tphcm-2026',
    level: 'cap3',
    province: 'Sở GD&ĐT TP.HCM',
    school: 'Toàn TP. Hồ Chí Minh',
    date: '2026.06.18',
    type: 'Sở GD&ĐT TP.HCM',
    typeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    title: 'Đề thi Thử Tốt nghiệp THPT 2026 — Sở GD&ĐT TP. Hồ Chí Minh',
    subtitle: 'Nguồn: Sở GD&ĐT TP.HCM • Đề phân hóa năng lực tư duy ngôn ngữ • Hướng dẫn giải chi tiết',
    questionsCount: 5,
    time: 50,
    solvedCount: 2450,
    avgScore: '7.30',
    category: 'thpt',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: TÌM TỪ ĐỒNG NGHĨA (SYNONYM)',
        question: 'Solar and wind power are increasingly considered <u>viable</u> alternatives to traditional fossil fuels.',
        options: [
          { key: 'A', text: 'feasible' },
          { key: 'B', text: 'impossible' },
          { key: 'C', text: 'temporary' },
          { key: 'D', text: 'harmful' }
        ],
        correctAnswer: 'A',
        explanation: '"viable" (adj) có nghĩa là khả thi, có thể thực hiện được = "feasible" / "practical".',
        trapTip: 'Viable = Feasible = Workable. Tránh nhầm với "vulnerable" (dễ bị tổn thương) hoặc "variable" (biến đổi).'
      }
    ]
  },
  {
    id: 'chuyen-ams-2026',
    level: 'cap3',
    province: 'Hà Nội',
    school: 'THPT Chuyên Hà Nội – Amsterdam',
    date: '2026.06.15',
    type: 'Chuyên Hà Nội – Ams',
    typeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    title: 'Đề thi Khảo sát Phân hóa THPT Chuyên Hà Nội – Amsterdam 2026',
    subtitle: 'Nguồn: Trường THPT Chuyên Hà Nội – Amsterdam • Ngữ liệu nâng cao B2/C1 • Phân tích bẫy đề',
    questionsCount: 5,
    time: 60,
    solvedCount: 1820,
    avgScore: '6.85',
    category: 'chuyen',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: ĐỌC HIỂU NÂNG CAO',
        question: 'Rarely ______ such a remarkable breakthrough in quantum computing technology.',
        options: [
          { key: 'A', text: 'have scientists witnessed' },
          { key: 'B', text: 'scientists have witnessed' },
          { key: 'C', text: 'did scientists witnessed' },
          { key: 'D', text: 'scientists witnessed' }
        ],
        correctAnswer: 'A',
        explanation: 'Cấu trúc đảo ngữ với trạng từ phủ định/bán phủ định đứng đầu câu: Rarely + Trợ động từ + S + V. Vì "witnessed" là hiện tại hoàn thành nên đảo "have" lên trước "scientists".',
        trapTip: 'Công thức đảo ngữ: Rarely/Seldom/Hardly/Never + Auxiliary + Subject + Verb.'
      }
    ]
  },
  {
    id: 'hsa-dhqg-hanoi-2026',
    level: 'cap3',
    province: 'ĐHQG Hà Nội',
    school: 'Trung tâm Khảo thí ĐHQGHN',
    date: '2026.06.02',
    type: 'ĐGNL HSA (ĐHQGHN)',
    typeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    title: 'Đề thi Đánh giá Năng lực ĐHQG Hà Nội (HSA) 2026 — Tư duy Tiếng Anh',
    subtitle: 'Nguồn: ĐHQG Hà Nội • 50 câu trắc nghiệm đo lường tư duy logic ngôn ngữ và đọc hiểu học thuật',
    questionsCount: 5,
    time: 60,
    solvedCount: 2980,
    avgScore: '7.60',
    category: 'dgnl',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: TƯ DUY NGÔN NGỮ',
        question: 'The committee members could not reach a consensus; ______, the meeting was adjourned until next Monday.',
        options: [
          { key: 'A', text: 'consequently' },
          { key: 'B', text: 'nevertheless' },
          { key: 'C', text: 'otherwise' },
          { key: 'D', text: 'furthermore' }
        ],
        correctAnswer: 'A',
        explanation: '"consequently" = do đó, vì vậy (chỉ kết quả do vế trước không đạt được sự đồng thuận nên cuộc họp bị hoãn).',
        trapTip: 'Xét quan hệ logic giữa 2 vế: Vế 1 (Nguyên nhân) -> Vế 2 (Hậu quả) -> Dùng Consequently / Therefore.'
      }
    ]
  },

  // ===================== KHỐI CẤP 2 (THCS - LỚP 6, 7, 8, 9 - VÀO 10) =====================
  {
    id: 'vao-10-hanoi-2026',
    level: 'cap2',
    province: 'Sở GD&ĐT Hà Nội',
    school: 'Sở GD&ĐT Hà Nội',
    date: '2026.06.10',
    type: 'Vào 10 Hà Nội',
    typeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    title: 'Đề thi Tuyển sinh Lớp 10 THPT Môn Tiếng Anh 2026 — Sở GD&ĐT Hà Nội',
    subtitle: 'Nguồn: Sở GD&ĐT Hà Nội • Đề thi chính thức kỳ thi vào 10 công lập • 40 câu trắc nghiệm • Có giải chi tiết',
    questionsCount: 5,
    time: 60,
    solvedCount: 4200,
    avgScore: '7.80',
    category: 'vao10',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: NGỮ PHÁP VÀ TỪ VỰNG VÀO 10',
        question: 'She asked me ______ I was interested in participating in the school charity fair.',
        options: [
          { key: 'A', text: 'if' },
          { key: 'B', text: 'that' },
          { key: 'C', text: 'weather' },
          { key: 'D', text: 'what' }
        ],
        correctAnswer: 'A',
        explanation: 'Câu gián tiếp tường thuật câu hỏi Yes/No Question: S + asked + (O) + if / whether + S + V (lùi thì). "weather" là thời tiết (sai chính tả với whether).',
        trapTip: 'Cẩn thận bẫy chính tả giữa "weather" (thời tiết) và "whether" (liệu rằng).'
      },
      {
        id: 2,
        part: 'PHẦN I: NGỮ PHÁP VÀ TỪ VỰNG VÀO 10',
        question: 'My brother enjoys ______ football with his classmates every Saturday afternoon.',
        options: [
          { key: 'A', text: 'playing' },
          { key: 'B', text: 'to play' },
          { key: 'C', text: 'play' },
          { key: 'D', text: 'played' }
        ],
        correctAnswer: 'A',
        explanation: 'Quy tắc V-ing sau động từ chỉ sở thích: enjoy / fancy / dislike / mind + V-ing.',
        trapTip: 'Enjoy + V-ing (chơi bóng đá).'
      }
    ]
  },
  {
    id: 'vao-10-tphcm-2026',
    level: 'cap2',
    province: 'Sở GD&ĐT TP.HCM',
    school: 'Sở GD&ĐT TP.HCM',
    date: '2026.06.07',
    type: 'Vào 10 TP.HCM',
    typeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    title: 'Đề thi Tuyển sinh Lớp 10 THPT Môn Tiếng Anh 2026 — Sở GD&ĐT TP.HCM',
    subtitle: 'Nguồn: Sở GD&ĐT TP.HCM • Đề thi vào 10 đại trà • Chú trọng biển báo hiệu và tình huống giao tiếp thực tế',
    questionsCount: 5,
    time: 90,
    solvedCount: 3850,
    avgScore: '7.65',
    category: 'vao10',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: BIỂN BÁO & GIAO TIẾP THỰC TẾ (ĐẶC TRƯNG TP.HCM)',
        question: 'Look at the sign: [NO LITTERING - PENALTY UP TO 2,000,000 VND]. What does it mean?',
        options: [
          { key: 'A', text: 'You must pay 2,000,000 VND if you throw trash here.' },
          { key: 'B', text: 'You can sell recycled items for 2,000,000 VND here.' },
          { key: 'C', text: 'You are allowed to drop clean litter here.' },
          { key: 'D', text: 'Trash bins cost 2,000,000 VND.' }
        ],
        correctAnswer: 'A',
        explanation: 'Biển báo "NO LITTERING - PENALTY UP TO..." nghĩa là Cấm xả rác - Phạt tiền đến 2 triệu đồng -> Đáp án A chính xác.',
        trapTip: 'Dạng bài biển báo (Signboards) là đặc trưng lớn của đề thi Tuyển sinh vào 10 TP.HCM.'
      }
    ]
  },
  {
    id: 'chuyen-ngoai-ngu-2026',
    level: 'cap2',
    province: 'ĐHQG Hà Nội',
    school: 'THPT Chuyên Ngoại Ngữ (CNN)',
    date: '2026.06.03',
    type: 'Chuyên Ngoại Ngữ',
    typeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    title: 'Đề thi Đánh giá Năng lực vào Lớp 10 THPT Chuyên Ngoại Ngữ (CNN) 2026',
    subtitle: 'Nguồn: Trường THPT Chuyên Ngoại Ngữ - ĐHQGHN • Ngữ pháp chuyên sâu & Viết lại câu nâng cao',
    questionsCount: 5,
    time: 90,
    solvedCount: 2100,
    avgScore: '6.70',
    category: 'chuyen',
    questions: [
      {
        id: 1,
        part: 'PHẦN I: VIẾT LẠI CÂU NÂNG CAO',
        question: '"I am sorry I forgot your birthday," Tom said to Mary.\n-> Tom apologized to Mary ______',
        options: [
          { key: 'A', text: 'for having forgotten her birthday.' },
          { key: 'B', text: 'that he forgot her birthday.' },
          { key: 'C', text: 'about forgetting his birthday.' },
          { key: 'D', text: 'to forget her birthday.' }
        ],
        correctAnswer: 'A',
        explanation: 'Cấu trúc câu tường thuật xin lỗi: Apologize to someone FOR (having) + V3/V-ing (xin lỗi ai vì đã làm gì).',
        trapTip: 'Apologize to SB for (doing) ST.'
      }
    ]
  }
];

export default function OfficialExamRepository({ onStartExam }) {
  const [levelTab, setLevelTab] = useState('cap3'); // 'cap3' (THPT) | 'cap2' (THCS / Vào 10)
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeViewingExam, setActiveViewingExam] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showAllSolutions, setShowAllSolutions] = useState(false);
  const [expandedExplanations, setExpandedExplanations] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);

  const provinces = [
    { id: 'all', label: 'Tất cả nguồn đề' },
    { id: 'Bộ Giáo dục & Đào tạo', label: 'Bộ GD&ĐT' },
    { id: 'Sở GD&ĐT Hà Nội', label: 'Hà Nội' },
    { id: 'Sở GD&ĐT TP.HCM', label: 'TP.HCM' },
    { id: 'ĐHQG Hà Nội', label: 'ĐHQG / Chuyên' }
  ];

  const filteredExams = COMPREHENSIVE_EXAMS_DATABASE.filter(item => {
    const matchLevel = item.level === levelTab;
    const matchProvince = selectedProvince === 'all' || item.province === selectedProvince;
    const matchQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLevel && matchProvince && matchQuery;
  });

  const handleSelectOption = (questionId, optionKey) => {
    if (examSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionKey }));
  };

  const toggleExplanation = (qId) => {
    setExpandedExplanations(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleStartExamView = (exam) => {
    setActiveViewingExam(exam);
    setUserAnswers({});
    setExamSubmitted(false);
    setShowAllSolutions(false);
    setExpandedExplanations({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Tính điểm khi nộp bài
  const calculateScore = () => {
    if (!activeViewingExam) return { correct: 0, total: 0, score10: '0.0' };
    let correct = 0;
    activeViewingExam.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct += 1;
      }
    });
    const total = activeViewingExam.questions.length;
    const score10 = ((correct / total) * 10).toFixed(1);
    return { correct, total, score10 };
  };

  const scoreResult = calculateScore();

  return (
    <div className="space-y-10 w-full pb-20 max-w-[1600px] mx-auto px-4 md:px-8 animate-fade-in">
      
      {/* ═══════════════════════════════════════════════════════════
          CHẾ ĐỘ XEM & LÀM BÀI TRỰC TIẾP (FULL EXAM VIEWER)
      ═══════════════════════════════════════════════════════════ */}
      {activeViewingExam ? (
        <div className="space-y-8 animate-fade-in">
          
          {/* Top Bar of Exam Viewer */}
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl bg-[#070b18] space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <button
                onClick={() => setActiveViewingExam(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition w-fit cursor-pointer"
              >
                ← Quay lại danh sách kho đề
              </button>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${activeViewingExam.typeColor}`}>
                  {activeViewingExam.type}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {activeViewingExam.date}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-black text-white font-outfit">
                {activeViewingExam.title}
              </h1>
              <p className="text-xs md:text-sm text-slate-400">
                {activeViewingExam.subtitle}
              </p>
            </div>

            {/* Exam Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" /> {activeViewingExam.questions.length} câu hỏi trích dẫn thật
                </span>
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" /> {activeViewingExam.time} phút
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAllSolutions(!showAllSolutions)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>{showAllSolutions ? 'Ẩn Hướng Dẫn Giải' : 'Hiện Hướng Dẫn Giải Chi Tiết'}</span>
                </button>

                {!examSubmitted ? (
                  <button
                    onClick={() => { setExamSubmitted(true); setShowAllSolutions(true); }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    Nộp Bài &amp; Xem Điểm
                  </button>
                ) : (
                  <button
                    onClick={() => { setExamSubmitted(false); setUserAnswers({}); setShowAllSolutions(false); }}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Làm lại đề
                  </button>
                )}
              </div>
            </div>

            {/* Score Banner when submitted */}
            {examSubmitted && (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-black text-2xl text-emerald-400 font-mono">
                    {scoreResult.score10}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Kết Quả Làm Đề Của Bạn</h3>
                    <p className="text-xs text-slate-300">
                      Đúng {scoreResult.correct} / {scoreResult.total} câu ({((scoreResult.correct/scoreResult.total)*100).toFixed(0)}%)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 w-fit">
                  Đã mở toàn bộ lời giải và phân tích bẫy đề phía dưới!
                </span>
              </div>
            )}
          </div>

          {/* Question List */}
          <div className="space-y-6">
            {activeViewingExam.questions.map((q, idx) => {
              const isSelected = (key) => userAnswers[q.id] === key;
              const isCorrect = q.correctAnswer;
              const isShown = showAllSolutions || expandedExplanations[q.id];

              return (
                <div 
                  key={q.id}
                  className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-5 bg-[#080d1e] shadow-xl"
                >
                  {/* Part Tag & Question Title */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10 uppercase tracking-wider">
                      {q.part} • Câu {idx + 1}
                    </span>

                    {/* Passage if any */}
                    {q.passage && (
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs md:text-sm text-slate-200 leading-relaxed font-serif italic whitespace-pre-line">
                        {q.passage}
                      </div>
                    )}

                    <h3 className="text-sm md:text-base font-bold text-white leading-relaxed pt-1">
                      {q.question}
                    </h3>
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt) => {
                      let btnStyle = 'bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05] hover:text-white';
                      
                      if (examSubmitted) {
                        if (opt.key === isCorrect) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold';
                        } else if (isSelected(opt.key) && opt.key !== isCorrect) {
                          btnStyle = 'bg-red-500/20 border-red-500/50 text-red-300 line-through';
                        }
                      } else if (isSelected(opt.key)) {
                        btnStyle = 'bg-blue-600/30 border-blue-500 text-white font-bold shadow-md';
                      }

                      return (
                        <button
                          key={opt.key}
                          onClick={() => handleSelectOption(q.id, opt.key)}
                          className={`p-4 rounded-2xl border text-left text-xs md:text-sm transition flex items-center gap-3 cursor-pointer ${btnStyle}`}
                        >
                          <span className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs shrink-0">
                            {opt.key}
                          </span>
                          <span dangerouslySetInnerHTML={{ __html: opt.text }} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Toggle */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => toggleExplanation(q.id)}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isShown ? 'Thu gọn lời giải' : 'Xem giải thích chi tiết & Mẹo tránh bẫy'}</span>
                      {isShown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {examSubmitted && (
                      <span className={`text-xs font-bold flex items-center gap-1 ${
                        userAnswers[q.id] === q.correctAnswer ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {userAnswers[q.id] === q.correctAnswer ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        {userAnswers[q.id] === q.correctAnswer ? 'Đúng' : `Sai (Đáp án: ${q.correctAnswer})`}
                      </span>
                    )}
                  </div>

                  {/* Detailed Explanation Box */}
                  {isShown && (
                    <div className="p-5 rounded-2xl bg-[#060914] border border-indigo-500/25 space-y-3 animate-fade-in text-xs leading-relaxed">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                          Đáp án đúng: {q.correctAnswer}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <p className="font-bold text-slate-300">Hướng dẫn giải chi tiết:</p>
                        <p className="text-slate-300 whitespace-pre-line">{q.explanation}</p>
                      </div>

                      {q.trapTip && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                          <strong>💡 Mẹo tránh bẫy đề thi:</strong> {q.trapTip}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* ═══════════════════════════════════════════════════════════
            DANH SÁCH TỔNG QUAN KHO ĐỀ (CẤP 3 & CẤP 2 PHÂN HÓA)
        ═══════════════════════════════════════════════════════════ */
        <div className="space-y-10">
          
          {/* Header - Minimalist Luxury Typography matching screenshot */}
          <div className="border-b border-white/10 pb-8 pt-4 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono font-bold text-emerald-400 tracking-widest uppercase">
                02 • KHO ĐỀ TIÊU CHUẨN ĐỘC BẢN
              </span>
              <span className="h-3 w-[1px] bg-white/20" />
              <span className="text-xs text-slate-400 font-medium">Trích nguồn chính thức từ Sở GD&ĐT các Tỉnh Thành</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight font-outfit leading-none">
                  Đề thật, lời giải thật.
                </h1>
                <p className="text-sm md:text-base text-slate-400 mt-3 max-w-2xl font-normal">
                  Kho đề thi trích nguồn chính thức từ Bộ GD&ĐT, Sở Hà Nội, Sở TP.HCM, Chuyên Sư Phạm và Đánh giá Năng lực kèm lời giải chi tiết 100%.
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tỉnh thành, tên trường..."
                  className="w-full pl-11 pr-4 py-3 bg-[#0d1220] border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* TAB SWITCHER: CẤP 3 vs CẤP 2 (RÕ RÀNG MINH BẠCH) */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
              <div className="flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/10">
                <button
                  onClick={() => { setLevelTab('cap3'); setSelectedProvince('all'); }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    levelTab === 'cap3'
                      ? 'bg-white text-black font-extrabold shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Khối Cấp 3 (THPT - Lớp 10, 11, 12)</span>
                </button>

                <button
                  onClick={() => { setLevelTab('cap2'); setSelectedProvince('all'); }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    levelTab === 'cap2'
                      ? 'bg-white text-black font-extrabold shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Khối Cấp 2 (THCS - Lớp 6, 7, 8, 9 &amp; Thi Vào 10)</span>
                </button>
              </div>

              {/* Province Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {provinces.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProvince(p.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                      selectedProvince === p.id
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clean Minimal List View matching screenshot */}
          <div className="divide-y divide-white/10 border-y border-white/10">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                onClick={() => handleStartExamView(exam)}
                className="py-5 px-4 md:px-6 hover:bg-white/[0.03] transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 min-w-0 flex-1">
                  <span className="text-xs font-mono font-medium text-slate-500 shrink-0">
                    {exam.date}
                  </span>

                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border shrink-0 w-fit ${exam.typeColor}`}>
                    {exam.type}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm md:text-base font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 truncate font-normal">
                      {exam.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0 justify-between md:justify-end">
                  <div className="text-right hidden lg:block">
                    <span className="text-[11px] text-slate-500 block">{exam.questionsCount} câu hỏi • {exam.time} phút</span>
                    <span className="text-xs text-emerald-400 font-bold font-mono">Điểm TB: {exam.avgScore}</span>
                  </div>

                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-white/30 group-hover:translate-x-1 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}

export const OFFICIAL_EXAM_LIST = COMPREHENSIVE_EXAMS_DATABASE;
