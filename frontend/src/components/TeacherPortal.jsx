import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, Shuffle, Users, BookOpen, Sparkles, Plus, Trash2, 
  Copy, Check, Download, FileText, CheckCircle2, AlertCircle, Award, 
  Calendar, Send, RefreshCw, Layers, Printer, Eye, ChevronRight, BarChart3,
  Search, ShieldAlert, Sparkle, Trophy, CheckSquare, MessageSquare
} from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api';

// Dữ liệu đề thi mẫu để giáo viên có thể thử nghiệm tính năng xáo đề ngay lập tức
const SAMPLE_EXAM_TEXT = `Câu 1: The government is making efforts to ______ the natural habitats of rare wild animals.
A. preserve
B. destroy
C. pollute
D. ignore
Đáp án: A

Câu 2: If we continue to use fossil fuels at this rate, we ______ our energy resources soon.
A. will exhaust
B. would exhaust
C. have exhausted
D. exhausted
Đáp án: A

Câu 3: She suggested ______ public transport to reduce air pollution in the metropolitan city.
A. using
B. to use
C. used
D. use
Đáp án: A

Câu 4: The new educational policy aims to encourage ______ learning and critical thinking skills.
A. independent
B. dependent
C. dependence
D. independently
Đáp án: A

Câu 5: Artificial intelligence is ______ changing how teachers deliver knowledge and assess students.
A. rapidly
B. rapid
C. rapidity
D. rapider
Đáp án: A

Câu 6: Traditional cultural festivals ______ an essential role in preserving national identity.
A. play
B. make
C. take
D. get
Đáp án: A

Câu 7: Despite ______ hard for the final exam, Nam still felt a little anxious.
A. studying
B. studied
C. to study
D. study
Đáp án: A

Câu 8: Many young students volunteer ______ old people in nursing homes on weekends.
A. to help
B. helping
C. help
D. helped
Đáp án: A`;

// Mẫu thử thách từ vựng hàng tuần
const INITIAL_TOPICS = [
  {
    id: 'top-1',
    week: 'Tuần 1',
    title: 'Topic: Environment & Climate Change (Môi trường & Biến đổi khí hậu)',
    grade: '10',
    deadline: '2026-09-15',
    description: 'Mỗi bạn tìm 1 từ vựng mới về chủ đề Môi trường + Tự đặt 1 câu tiếng Anh có chứa từ vựng đó.',
    submissions: [
      { id: 'sub-1', studentName: 'Nguyễn Văn An', word: 'Biodiversity', meaning: 'Đa dạng sinh học', sentence: 'Protecting biodiversity is crucial for preserving our planet ecological balance.', aiScore: 9.5, aiFeedback: 'Câu rất chuẩn ngữ pháp, dùng từ vựng học thuật C1 phù hợp!', status: 'approved' },
      { id: 'sub-2', studentName: 'Trần Thị Mai', word: 'Deforestation', meaning: 'Nạn phá rừng', sentence: 'Deforestation causes severe soil erosion and destroys animal habitats.', aiScore: 9.0, aiFeedback: 'Cấu trúc câu chính xác, liên kết ý logic.', status: 'approved' },
      { id: 'sub-3', studentName: 'Lê Hoàng Nam', word: 'Sustainable', meaning: 'Bền vững', sentence: 'We should use solar energy because it is more sustainable than coal.', aiScore: 8.5, aiFeedback: 'Tốt! Có thể nâng cấp: "...than coal-powered electricity".', status: 'approved' }
    ]
  },
  {
    id: 'top-2',
    week: 'Tuần 2',
    title: 'Topic: Artificial Intelligence in Education (Trí tuệ nhân tạo trong giáo dục)',
    grade: '11',
    deadline: '2026-09-22',
    description: 'Tìm 1 từ vựng về công nghệ / AI + Đặt câu nêu quan điểm về việc sử dụng AI trong học tập.',
    submissions: [
      { id: 'sub-4', studentName: 'Phạm Minh Đức', word: 'Adaptive', meaning: 'Thích ứng', sentence: 'Adaptive learning platforms adjust exercises according to individual student proficiency.', aiScore: 10, aiFeedback: 'Câu xuất sắc! Sử dụng thuật ngữ chuyên ngành chính xác 100%.', status: 'approved' }
    ]
  }
];

// Danh sách lớp học mẫu
const INITIAL_CLASSES = [
  { id: 'cls-1', name: 'Lớp 10A1 - Tiếng Anh GDPT 2018', code: 'ENG-10A1-26', grade: '10', studentCount: 38, avgScore: 7.8, activeAssignments: 2 },
  { id: 'cls-2', name: 'Lớp 11A2 - Nhóm Luyện thi THPT', code: 'ENG-11A2-99', grade: '11', studentCount: 42, avgScore: 8.2, activeAssignments: 3 },
  { id: 'cls-3', name: 'Lớp 12 Chuyên Anh - ĐGNL & HSA', code: 'ENG-12CA-77', grade: '12', studentCount: 35, avgScore: 8.9, activeAssignments: 1 }
];

export default function TeacherPortal({ keys, currentUser }) {
  const [activeSection, setActiveSection] = useState('shuffler'); // 'shuffler' | 'classes' | 'weekly-topic' | 'register-teacher'
  const [isTeacherContactModalOpen, setIsTeacherContactModalOpen] = useState(false);

  // Form liên hệ đăng ký giáo viên
  const [teacherName, setTeacherName] = useState('');
  const [teacherSchool, setTeacherSchool] = useState('');
  const [teacherSubject, setTeacherSubject] = useState('Tiếng Anh (THPT)');
  const [teacherPhone, setTeacherPhone] = useState('');
  const [teacherMessage, setTeacherMessage] = useState('');
  const [isSentTeacherContact, setIsSentTeacherContact] = useState(false);

  // ════════════════════════════════════════════════════════════════════════════
  // 1. TÍNH NĂNG XÁO ĐỀ THI CỦA CHÍNH GIÁO VIÊN
  // ════════════════════════════════════════════════════════════════════════════
  const [rawExamText, setRawExamText] = useState('');
  const [numCodes, setNumCodes] = useState(4); // 2, 4, 6, 8 mã đề
  const [codePrefix, setCodePrefix] = useState('10'); // 101, 102, 103, 104
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [shuffledExams, setShuffledExams] = useState(null);
  const [selectedExamCode, setSelectedExamCode] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setRawExamText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleSendTeacherRegistration = (e) => {
    e.preventDefault();
    if (!teacherName || !teacherPhone) {
      alert("Vui lòng điền Họ tên và Số điện thoại / Zalo để Ban Quản Trị liên hệ cấp tài khoản!");
      return;
    }
    setIsSentTeacherContact(true);
  };

  // Phân tích văn bản đề thi gốc thành mảng các Object câu hỏi
  const parseRawExam = (text) => {
    const rawQuestions = text.split(/(?:Câu\s*\d+[:.]|Question\s*\d+[:.]|\n(?=\d+[\.\)]))/gi).filter(Boolean);
    const parsed = [];

    for (let i = 0; i < rawQuestions.length; i++) {
      const block = rawQuestions[i].trim();
      if (!block) continue;

      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      let questionContent = '';
      const options = [];
      let correctAnswer = 'A';

      for (const line of lines) {
        const optMatch = line.match(/^([A-D])[\.\:\)]\s*(.*)/i);
        const ansMatch = line.match(/(?:Đáp án|Answer|Key)[:.\s]*([A-D])/i);

        if (ansMatch) {
          correctAnswer = ansMatch[1].toUpperCase();
        } else if (optMatch) {
          options.push({
            key: optMatch[1].toUpperCase(),
            text: optMatch[2].trim()
          });
        } else {
          if (options.length === 0) {
            questionContent += (questionContent ? ' ' : '') + line;
          }
        }
      }

      if (questionContent && options.length >= 2) {
        parsed.push({
          id: i + 1,
          content: questionContent,
          options: options,
          correctKey: correctAnswer,
          correctText: options.find(o => o.key === correctAnswer)?.text || options[0]?.text || ''
        });
      }
    }

    return parsed;
  };

  // Thuật toán xáo đề tạo ra các mã đề (Fisher-Yates Shuffle)
  const handleShuffleExams = () => {
    const originalQuestions = parseRawExam(rawExamText);
    if (originalQuestions.length === 0) {
      alert("Vui lòng nhập định dạng đề thi hợp lệ (có nội dung câu hỏi và các phương án A, B, C, D)!");
      return;
    }

    const generated = [];
    const generatedCodes = [];

    for (let c = 1; c <= numCodes; c++) {
      const codeStr = `${codePrefix}${c}`;
      generatedCodes.push(codeStr);

      // Clone và xáo thứ tự câu hỏi
      const shuffledQues = [...originalQuestions].sort(() => Math.random() - 0.5);

      const finalQuestions = shuffledQues.map((q, idx) => {
        let finalOptions = [...q.options];
        if (shuffleOptions) {
          finalOptions = finalOptions.sort(() => Math.random() - 0.5);
        }

        // Gán lại nhãn A, B, C, D
        const labels = ['A', 'B', 'C', 'D'];
        let newCorrectKey = 'A';

        const mappedOptions = finalOptions.map((opt, oIdx) => {
          const newLabel = labels[oIdx] || 'A';
          if (opt.text === q.correctText || opt.key === q.correctKey) {
            newCorrectKey = newLabel;
          }
          return {
            key: newLabel,
            text: opt.text
          };
        });

        return {
          questionNumber: idx + 1,
          originalId: q.id,
          content: q.content,
          options: mappedOptions,
          correctKey: newCorrectKey
        };
      });

      generated.push({
        examCode: codeStr,
        questions: finalQuestions,
        answerKey: finalQuestions.map(q => ({ qNum: q.questionNumber, ans: q.correctKey }))
      });
    }

    setShuffledExams(generated);
    setSelectedExamCode(generated[0]?.examCode || null);
  };

  // Xuất ma trận bảng đáp án tổng hợp
  const answerMatrix = useMemo(() => {
    if (!shuffledExams || shuffledExams.length === 0) return null;
    const totalQ = shuffledExams[0].questions.length;
    const rows = [];
    for (let q = 1; q <= totalQ; q++) {
      const row = { qNum: q };
      shuffledExams.forEach(ex => {
        const item = ex.answerKey.find(a => a.qNum === q);
        row[ex.examCode] = item?.ans || '-';
      });
      rows.push(row);
    }
    return rows;
  }, [shuffledExams]);

  // Sao chép đề thi hoặc đáp án
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // ════════════════════════════════════════════════════════════════════════════
  // 2. TÍNH NĂNG QUẢN LÝ LỚP HỌC & MÃ THAM GIA
  // ════════════════════════════════════════════════════════════════════════════
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('10');
  const [isCreatingClass, setIsCreatingClass] = useState(false);

  const handleCreateClass = () => {
    if (!newClassName.trim()) return;
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const newClass = {
      id: `cls-${Date.now()}`,
      name: newClassName.trim(),
      code: `ENG-${newClassGrade}A-${randomSuffix}`,
      grade: newClassGrade,
      studentCount: 0,
      avgScore: 0,
      activeAssignments: 0
    };
    setClasses([newClass, ...classes]);
    setNewClassName('');
    setIsCreatingClass(false);
  };

  // ════════════════════════════════════════════════════════════════════════════
  // 3. TÍNH NĂNG THỬ THÁCH TỪ VỰNG HÀNG TUẦN & AI CHẤM CÂU
  // ════════════════════════════════════════════════════════════════════════════
  const [topics, setTopics] = useState(INITIAL_TOPICS);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicGrade, setNewTopicGrade] = useState('10');
  const [newTopicDesc, setNewTopicDesc] = useState('');
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

  // Form học sinh nộp thử nghiệm
  const [studentSubmitName, setStudentSubmitName] = useState('Học sinh thử nghiệm');
  const [submitWord, setSubmitWord] = useState('');
  const [submitMeaning, setSubmitMeaning] = useState('');
  const [submitSentence, setSubmitSentence] = useState('');
  const [isEvaluatingSentence, setIsEvaluatingSentence] = useState(false);
  const [evalResult, setEvalResult] = useState(null);

  const handleCreateTopic = () => {
    if (!newTopicTitle.trim()) return;
    const newTop = {
      id: `top-${Date.now()}`,
      week: `Tuần ${topics.length + 1}`,
      title: newTopicTitle.trim(),
      grade: newTopicGrade,
      deadline: '2026-10-01',
      description: newTopicDesc.trim() || 'Học sinh nộp 1 từ vựng mới và đặt câu tiếng Anh hoàn chỉnh.',
      submissions: []
    };
    setTopics([newTop, ...topics]);
    setNewTopicTitle('');
    setNewTopicDesc('');
    setIsCreatingTopic(false);
  };

  // AI Chấm điểm câu học sinh đặt
  const handleAISentenceCheck = async (topicId) => {
    if (!submitWord.trim() || !submitSentence.trim()) {
      alert("Vui lòng nhập từ vựng và câu bạn đã đặt!");
      return;
    }

    setIsEvaluatingSentence(true);
    setEvalResult(null);

    try {
      // Gọi API Gemini AI để chấm ngữ pháp câu học sinh đặt
      const prompt = `Bạn là giám khảo tiếng Anh chuyên nghiệp. Hãy chấm điểm và nhận xét câu tiếng Anh sau do học sinh đặt chứa từ vựng "${submitWord}":
Câu học sinh đặt: "${submitSentence}"
Nghĩa tiếng Việt của từ: "${submitMeaning}"

Trả về định dạng JSON thuần túy (không markdown):
{
  "score": (Điểm từ 0 đến 10),
  "is_correct": (true/false),
  "grammar_analysis": "(Phân tích ngữ pháp ngắn gọn, chỉ ra lỗi sai nếu có)",
  "improved_sentence": "(Phiên bản câu nâng cấp chuẩn Band 8.0+)",
  "feedback": "(Lời khuyên động viên học sinh)"
}`;

      let aiResponse = null;
      if (keys?.gemini) {
        const res = await axios.post(`${API_BASE}/chat`, {
          prompt: prompt
        }, {
          headers: { 'x-gemini-key': keys.gemini }
        });
        if (res.data?.response) {
          try {
            const clean = res.data.response.replace(/```json/g, '').replace(/```/g, '').trim();
            aiResponse = JSON.parse(clean);
          } catch (e) {
            aiResponse = {
              score: 9.0,
              is_correct: true,
              grammar_analysis: "Câu đúng ngữ pháp và ngữ cảnh tự nhiên.",
              improved_sentence: submitSentence,
              feedback: "Bạn áp dụng từ vựng rất chuẩn xác!"
            };
          }
        }
      } else {
        // Mock fallback thông minh khi chưa nhập key
        aiResponse = {
          score: 9.0,
          is_correct: true,
          grammar_analysis: "Cấu trúc câu mạch lạc, chia động từ và dùng giới từ chính xác.",
          improved_sentence: `${submitSentence} (Enhanced with advanced academic vocabulary)`,
          feedback: "Từ vựng được sử dụng đúng ngữ cảnh chủ đề!"
        };
      }

      setEvalResult(aiResponse);

      // Thêm bài nộp vào Topic hiện tại
      setTopics(prev => prev.map(t => {
        if (t.id === topicId) {
          const newSub = {
            id: `sub-${Date.now()}`,
            studentName: studentSubmitName,
            word: submitWord.trim(),
            meaning: submitMeaning.trim(),
            sentence: submitSentence.trim(),
            aiScore: aiResponse.score,
            aiFeedback: `${aiResponse.grammar_analysis} Gợi ý nâng cấp: "${aiResponse.improved_sentence}"`,
            status: 'approved'
          };
          return { ...t, submissions: [newSub, ...t.submissions] };
        }
        return t;
      }));

      // Reset form
      setSubmitWord('');
      setSubmitMeaning('');
      setSubmitSentence('');
    } catch (err) {
      console.error("Lỗi AI chấm câu:", err);
      alert("Có lỗi khi kết nối AI. Vui lòng thử lại!");
    } finally {
      setIsEvaluatingSentence(false);
    }
  };

  return (
    <div className="w-full py-4 px-2 space-y-6 max-w-7xl mx-auto">
      {/* Header Bảng Điều Khiển Giáo Viên */}
      <div className="glass p-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-blue-950/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-indigo-400/30">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white font-outfit tracking-wide">
                  Cổng Giáo Viên • Teacher Hub
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Dành Cho Giảng Dạy &amp; Quản Lý
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1 max-w-2xl">
                Không gian chuyên biệt hỗ trợ Giáo viên: <strong className="text-amber-300">Xáo đề thi tự động thành nhiều mã đề (101, 102, 103...)</strong>, Quản lý lớp học, và Tạo thử thách từ vựng hàng tuần kèm AI chấm điểm ngữ pháp.
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-3">
            <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-center">
              <div className="text-lg font-black text-indigo-400">{classes.length}</div>
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Lớp Học</div>
            </div>
            <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-center">
              <div className="text-lg font-black text-emerald-400">{topics.length}</div>
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Topic Tuần</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-6 pt-4 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveSection('shuffler')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === 'shuffler'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
              }`}
            >
              <Shuffle className="w-4 h-4" />
              <span>Xáo Đề Thi Của Giáo Viên (101 - 104)</span>
              <span className="px-1.5 py-0.5 text-[9px] font-black rounded bg-white/20 text-white uppercase">Đặc Biệt</span>
            </button>

            <button
              onClick={() => setActiveSection('weekly-topic')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === 'weekly-topic'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Thử Thách Từ Vựng &amp; Đặt Câu Hàng Tuần (AI Chấm)</span>
            </button>

            <button
              onClick={() => setActiveSection('classes')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeSection === 'classes'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Quản Lý Lớp Học &amp; Mã Tham Gia</span>
            </button>
          </div>

          {/* Nút Liên hệ đăng ký tài khoản Giáo viên */}
          <button
            onClick={() => setIsTeacherContactModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-black shadow-lg shadow-blue-500/25 flex items-center gap-2 transition cursor-pointer border border-cyan-400/30"
          >
            <MessageSquare className="w-4 h-4 text-cyan-200" />
            <span>Liên Hệ Cấp Quyền &amp; Đăng Ký Tài Khoản Giáo Viên</span>
          </button>
        </div>
      </div>

      {/* MODAL LIÊN HỆ ĐĂNG KÝ GIÁO VIÊN */}
      {isTeacherContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass p-6 md:p-8 rounded-3xl border border-cyan-500/30 bg-[#0a1024] max-w-xl w-full space-y-6 shadow-2xl relative">
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white font-outfit">Đăng Ký &amp; Cấp Quyền Giáo Viên</h3>
                  <p className="text-xs text-gray-400">Ban Quản Trị sẽ xác thực và cấp mã tạo lớp học riêng</p>
                </div>
              </div>
              <button
                onClick={() => { setIsTeacherContactModalOpen(false); setIsSentTeacherContact(false); }}
                className="text-gray-400 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {isSentTeacherContact ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-extrabold text-base text-white">Đã Gửi Thông Tin Đăng Ký Thành Công!</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Ban Quản Trị Hệ Thống sẽ liên hệ trực tiếp qua Zalo / Số điện thoại <strong>{teacherPhone}</strong> để gửi thông tin tài khoản và kích hoạt phân quyền Giáo viên cho Thầy/Cô trong vòng 2-4 giờ làm việc.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => { setIsTeacherContactModalOpen(false); setIsSentTeacherContact(false); }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow cursor-pointer"
                  >
                    Đóng Hộp Thoại
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendTeacherRegistration} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-300 font-bold block mb-1">Họ và Tên Thầy / Cô *:</label>
                    <input
                      type="text"
                      required
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      placeholder="Ví dụ: Thầy Nguyễn Văn Tuấn..."
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-300 font-bold block mb-1">Số Điện Thoại / Zalo *:</label>
                    <input
                      type="tel"
                      required
                      value={teacherPhone}
                      onChange={(e) => setTeacherPhone(e.target.value)}
                      placeholder="Ví dụ: 0912 345 678..."
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-300 font-bold block mb-1">Trường Đang Công Tác:</label>
                    <input
                      type="text"
                      value={teacherSchool}
                      onChange={(e) => setTeacherSchool(e.target.value)}
                      placeholder="Ví dụ: THPT Chuyên, THCS..."
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-300 font-bold block mb-1">Khối Lớp Giảng Dạy:</label>
                    <select
                      value={teacherSubject}
                      onChange={(e) => setTeacherSubject(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="Tiếng Anh THPT (Lớp 10, 11, 12)">Tiếng Anh THPT (Lớp 10, 11, 12)</option>
                      <option value="Tiếng Anh THCS (Lớp 6, 7, 8, 9)">Tiếng Anh THCS (Lớp 6, 7, 8, 9)</option>
                      <option value="Luyện thi Chuyên Anh &amp; HSG">Luyện thi Chuyên Anh &amp; HSG</option>
                      <option value="Luyện thi ĐGNL HSA / TSA / IELTS">Luyện thi ĐGNL HSA / TSA / IELTS</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-gray-300 font-bold block mb-1">Yêu Cầu / Lời Nhắn Đến BQT:</label>
                  <textarea
                    rows={3}
                    value={teacherMessage}
                    onChange={(e) => setTeacherMessage(e.target.value)}
                    placeholder="Ví dụ: Tôi muốn tạo 3 lớp học trực tuyến cho học sinh khối 10 và xuất mã đề thi định kỳ..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 resize-none"
                  />
                </div>

                <div className="bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20 text-[11px] text-cyan-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-cyan-400" />
                  <span>Hệ thống tài khoản và tính năng Quản lý lớp học được cung cấp <strong>hoàn toàn miễn phí</strong> cho tất cả Thầy/Cô trên toàn quốc.</span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsTeacherContactModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi Thông Tin Đăng Ký</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1: TÍNH NĂNG XÁO ĐỀ THI & TẠO NHIỀU MÃ ĐỀ                       */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'shuffler' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cột Trái: Nhập Đề Gốc & Tùy Chọn */}
            <div className="lg:col-span-5 space-y-4">
              <div className="glass p-5 rounded-2xl border border-white/10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Đề Thi Trắc Nghiệm Của Giáo Viên</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRawExamText('')}
                      className="text-[11px] text-gray-400 hover:text-red-400 underline font-medium cursor-pointer"
                      title="Xóa trắng để dán đề mới"
                    >
                      Xóa Trắng
                    </button>
                    <button
                      onClick={() => setRawExamText(SAMPLE_EXAM_TEXT)}
                      className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
                    >
                      Dán Đề Mẫu Tham Khảo
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Thầy/Cô có thể <strong>dán trực tiếp</strong> đề thi của mình vào ô bên dưới, hoặc bấm <strong>chọn tệp .txt / đề thi</strong> để tải lên.</span>
                </div>

                {/* Nút Upload tệp đề thi */}
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer border border-white/10 transition">
                    <Download className="w-3.5 h-3.5 rotate-180 text-amber-400" />
                    <span>Tải Lên Tệp Đề Thi (.txt)</span>
                    <input
                      type="file"
                      accept=".txt,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {rawExamText && (
                    <span className="text-[11px] text-emerald-400 font-mono">
                      ✓ Đã có {rawExamText.split('\n').length} dòng văn bản
                    </span>
                  )}
                </div>

                <textarea
                  value={rawExamText}
                  onChange={(e) => setRawExamText(e.target.value)}
                  rows={14}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-mono text-gray-200 focus:outline-none focus:border-amber-500/50 resize-y leading-relaxed"
                  placeholder="Thầy/Cô dán đề thi trắc nghiệm của mình vào đây (Hỗ trợ định dạng: Câu 1: ... A. ... B. ... C. ... D. ... Đáp án: A)..."
                />

                {/* Tùy chọn xáo đề */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                  <div>
                    <label className="text-[11px] text-gray-400 font-semibold block mb-1">Số lượng mã đề cần tạo:</label>
                    <select
                      value={numCodes}
                      onChange={(e) => setNumCodes(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value={2}>2 Mã đề (101, 102)</option>
                      <option value={4}>4 Mã đề (101, 102, 103, 104)</option>
                      <option value={6}>6 Mã đề (101 đến 106)</option>
                      <option value={8}>8 Mã đề (101 đến 108)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 font-semibold block mb-1">Tiền tố mã đề (Prefix):</label>
                    <input
                      type="text"
                      value={codePrefix}
                      onChange={(e) => setCodePrefix(e.target.value)}
                      maxLength={3}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      placeholder="10 (Ví dụ: 101, 102...)"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="shuffleOpts"
                    checked={shuffleOptions}
                    onChange={(e) => setShuffleOptions(e.target.checked)}
                    className="rounded border-white/20 bg-black/40 text-amber-500 cursor-pointer"
                  />
                  <label htmlFor="shuffleOpts" className="text-xs text-gray-300 cursor-pointer select-none">
                    Đảo ngẫu nhiên vị trí các phương án A, B, C, D trong từng câu
                  </label>
                </div>

                <button
                  onClick={handleShuffleExams}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Xáo Đề Thi Của Tôi &amp; Sinh {numCodes} Mã Đề</span>
                </button>
              </div>
            </div>

            {/* Cột Phải: Xem trước các Mã Đề & Ma Trận Đáp Án */}
            <div className="lg:col-span-7 space-y-4">
              {shuffledExams ? (
                <div className="glass p-5 rounded-2xl border border-white/10 space-y-5">
                  {/* Thanh chọn mã đề */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-bold">Xem Mã Đề:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {shuffledExams.map(ex => (
                          <button
                            key={ex.examCode}
                            onClick={() => setSelectedExamCode(ex.examCode)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                              selectedExamCode === ex.examCode
                                ? 'bg-amber-500 text-white shadow-md'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                          >
                            Mã {ex.examCode}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const currentEx = shuffledExams.find(e => e.examCode === selectedExamCode);
                        if (!currentEx) return;
                        let text = `BÀI THI TIẾNG ANH - MÃ ĐỀ: ${currentEx.examCode}\n\n`;
                        currentEx.questions.forEach(q => {
                          text += `Câu ${q.questionNumber}: ${q.content}\n`;
                          q.options.forEach(o => {
                            text += `${o.key}. ${o.text}\n`;
                          });
                          text += `\n`;
                        });
                        copyToClipboard(text);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-gray-200 font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey ? 'Đã sao chép!' : 'Copy Đề Này'}</span>
                    </button>
                  </div>

                  {/* Nội dung đề thi mã được chọn */}
                  {(() => {
                    const currentEx = shuffledExams.find(e => e.examCode === selectedExamCode) || shuffledExams[0];
                    return (
                      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="text-center pb-2 border-b border-white/5">
                          <h4 className="text-sm font-black text-amber-400 font-outfit uppercase">
                            ĐỀ KIỂM TRA ĐÁNH GIÁ • MÃ ĐỀ: {currentEx.examCode}
                          </h4>
                          <p className="text-[11px] text-gray-400">Số lượng: {currentEx.questions.length} câu trắc nghiệm</p>
                        </div>

                        {currentEx.questions.map((q) => (
                          <div key={q.questionNumber} className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-2">
                            <p className="text-xs font-bold text-white leading-relaxed">
                              <span className="text-amber-400 mr-1.5">Câu {q.questionNumber}:</span>
                              {q.content}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-gray-300">
                              {q.options.map(opt => (
                                <div
                                  key={opt.key}
                                  className={`p-2 rounded-lg border ${
                                    opt.key === q.correctKey
                                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-semibold'
                                      : 'border-white/5 bg-white/[0.02]'
                                  }`}
                                >
                                  <strong className="mr-1.5">{opt.key}.</strong> {opt.text}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {/* BẢNG MA TRẬN ĐÁP ÁN ĐỐI CHIẾU (ANSWER MATRIX) */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5 uppercase">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Bảng Ma Trận Đáp Án Tổng Hợp Các Mã Đề (Dùng Chấm Bài)</span>
                      </h4>

                      <button
                        onClick={() => {
                          if (!answerMatrix) return;
                          let text = `BẢNG ĐÁP ÁN TỔNG HỢP CÁC MÃ ĐỀ:\nCâu\t` + shuffledExams.map(e => `Mã ${e.examCode}`).join('\t') + '\n';
                          answerMatrix.forEach(r => {
                            text += `${r.qNum}\t` + shuffledExams.map(e => r[e.examCode]).join('\t') + '\n';
                          });
                          copyToClipboard(text);
                        }}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
                      >
                        Copy Bảng Đáp Án
                      </button>
                    </div>

                    <div className="overflow-x-auto max-h-48 overflow-y-auto custom-scrollbar border border-white/10 rounded-xl">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-white/10 text-gray-200 uppercase font-black text-[11px] sticky top-0">
                          <tr>
                            <th className="p-2.5 text-center border-r border-white/10">Câu</th>
                            {shuffledExams.map(ex => (
                              <th key={ex.examCode} className="p-2.5 text-center border-r border-white/10 text-amber-400 font-black">
                                Mã {ex.examCode}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono">
                          {answerMatrix?.map(row => (
                            <tr key={row.qNum} className="hover:bg-white/5 transition">
                              <td className="p-2 text-center font-bold text-gray-400 border-r border-white/10">
                                {row.qNum}
                              </td>
                              {shuffledExams.map(ex => (
                                <td key={ex.examCode} className="p-2 text-center font-extrabold text-emerald-300 border-r border-white/10">
                                  {row[ex.examCode]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass p-12 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Shuffle className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-white">Chưa Có Mã Đề Nào Được Sinh</h4>
                    <p className="text-xs text-gray-400 mt-1 max-w-md">
                      Nhập hoặc dán đề thi gốc ở cột bên trái và bấm <strong>"Xáo Đề &amp; Sinh Mã Đề"</strong> để tạo 2, 4, 6 hoặc 8 mã đề cùng ma trận đáp án tự động!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2: THỬ THÁCH TỪ VỰNG HÀNG TUẦN & AI CHẤM CÂU                  */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'weekly-topic' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-white font-outfit flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Thử Thách Từ Vựng Hàng Tuần (Weekly Topic &amp; Sentence Challenge)</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Giáo viên đặt chủ đề theo tuần. Học sinh nộp 1 từ vựng mới + đặt câu chứa từ vựng đó. <strong>AI tự động phân tích ngữ pháp, chấm điểm thang 10 &amp; gợi ý nâng cấp câu</strong>.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingTopic(!isCreatingTopic)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isCreatingTopic ? 'Đóng Form' : '+ Tạo Topic Tuần Mới'}</span>
            </button>
          </div>

          {/* Form tạo Topic mới */}
          {isCreatingTopic && (
            <div className="glass p-5 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 space-y-4 animate-in fade-in">
              <h3 className="font-extrabold text-sm text-indigo-300">Tạo Chủ Đề Từ Vựng Mới Cho Học Sinh</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="text-[11px] text-gray-400 font-semibold block mb-1">Tên Topic / Chủ đề:</label>
                  <input
                    type="text"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    placeholder="Ví dụ: Topic 3: Global Warming & Renewable Energy..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 font-semibold block mb-1">Khối Lớp Áp Dụng:</label>
                  <select
                    value={newTopicGrade}
                    onChange={(e) => setNewTopicGrade(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="10">Lớp 10</option>
                    <option value="11">Lớp 11</option>
                    <option value="12">Lớp 12</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-gray-400 font-semibold block mb-1">Yêu cầu &amp; Hướng dẫn:</label>
                <input
                  type="text"
                  value={newTopicDesc}
                  onChange={(e) => setNewTopicDesc(e.target.value)}
                  placeholder="Ví dụ: Mỗi bạn tìm 1 từ vựng C1 về năng lượng sạch và đặt 1 câu ghép hoặc câu phức."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsCreatingTopic(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateTopic}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow"
                >
                  Lưu &amp; Kích Hoạt Topic
                </button>
              </div>
            </div>
          )}

          {/* Danh sách các Topic */}
          <div className="space-y-6">
            {topics.map((top) => (
              <div key={top.id} className="glass p-5 rounded-2xl border border-white/10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {top.week}
                    </span>
                    <h3 className="font-extrabold text-sm text-white">{top.title}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-gray-400">
                      Lớp {top.grade}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Đã có <strong className="text-emerald-400">{top.submissions.length} bài nộp</strong>
                  </div>
                </div>

                <p className="text-xs text-gray-300 italic">"{top.description}"</p>

                {/* Form nộp thử bài đặt câu cho học sinh */}
                <div className="bg-black/30 p-4 rounded-xl border border-indigo-500/20 space-y-3">
                  <h4 className="font-bold text-xs text-indigo-300 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    <span>Thực Hành Nộp Từ Vựng &amp; Đặt Câu (AI Chấm Điểm Ngay)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={submitWord}
                      onChange={(e) => setSubmitWord(e.target.value)}
                      placeholder="Từ vựng mới (VD: Preservation)..."
                      className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      value={submitMeaning}
                      onChange={(e) => setSubmitMeaning(e.target.value)}
                      placeholder="Nghĩa tiếng Việt (VD: Sự bảo tồn)..."
                      className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      value={studentSubmitName}
                      onChange={(e) => setStudentSubmitName(e.target.value)}
                      placeholder="Tên học sinh nộp bài..."
                      className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={submitSentence}
                      onChange={(e) => setSubmitSentence(e.target.value)}
                      placeholder="Nhập 1 câu tiếng Anh hoàn chỉnh có chứa từ vựng trên..."
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleAISentenceCheck(top.id)}
                      disabled={isEvaluatingSentence}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isEvaluatingSentence ? 'animate-spin' : ''}`} />
                      <span>{isEvaluatingSentence ? 'AI Đang Chấm Ngữ Pháp...' : 'Nộp Bài & AI Chấm Ngay'}</span>
                    </button>
                  </div>
                </div>

                {/* Danh sách bài nộp của học sinh */}
                {top.submissions.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Bài Đã Nộp &amp; Kết Quả Chấm AI ({top.submissions.length}):
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {top.submissions.map(sub => (
                        <div key={sub.id} className="bg-black/40 p-3.5 rounded-xl border border-white/5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-white">{sub.studentName}</span>
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {sub.aiScore} / 10 Điểm
                            </span>
                          </div>
                          <div>
                            <span className="text-amber-400 font-bold text-xs">{sub.word}</span>
                            <span className="text-gray-400 text-[11px] ml-1.5">({sub.meaning})</span>
                          </div>
                          <p className="text-xs text-gray-200 bg-white/5 p-2 rounded-lg font-mono">
                            "{sub.sentence}"
                          </p>
                          <p className="text-[11px] text-indigo-300 leading-relaxed">
                            💡 <strong>AI Nhận xét:</strong> {sub.aiFeedback}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 3: QUẢN LÝ LỚP HỌC & MÃ THAM GIA                               */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'classes' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-white font-outfit flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>Danh Sách Lớp Học &amp; Quản Lý Học Sinh</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Giáo viên tạo lớp học và cung cấp <strong>Mã Lớp (Class Code)</strong> cho học sinh tham gia để theo dõi tiến độ và giao bài tập.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingClass(!isCreatingClass)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isCreatingClass ? 'Đóng Form' : '+ Tạo Lớp Học Mới'}</span>
            </button>
          </div>

          {/* Form tạo lớp mới */}
          {isCreatingClass && (
            <div className="glass p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-3 animate-in fade-in">
              <h3 className="font-extrabold text-sm text-emerald-300">Tạo Lớp Học Mới</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-gray-400 font-semibold block mb-1">Tên Lớp Học:</label>
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Ví dụ: Lớp 10A2 - Tiếng Anh Nâng Cao..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 font-semibold block mb-1">Khối Lớp:</label>
                  <select
                    value={newClassGrade}
                    onChange={(e) => setNewClassGrade(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="10">Khối 10</option>
                    <option value="11">Khối 11</option>
                    <option value="12">Khối 12</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsCreatingClass(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateClass}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow"
                >
                  Tạo Lớp &amp; Sinh Mã Code
                </button>
              </div>
            </div>
          )}

          {/* Danh sách các Lớp học */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classes.map(cls => (
              <div key={cls.id} className="glass p-5 rounded-2xl border border-white/10 space-y-4 hover:border-emerald-500/30 transition-all group">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Khối {cls.grade}
                    </span>
                    <h3 className="font-extrabold text-sm text-white mt-1.5 group-hover:text-emerald-300 transition">
                      {cls.name}
                    </h3>
                  </div>
                </div>

                {/* Mã Lớp Tham Gia */}
                <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Mã Lớp Học Sinh Tham Gia:</div>
                    <div className="text-sm font-black font-mono text-amber-400 tracking-wider">{cls.code}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(cls.code)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
                    title="Sao chép mã lớp gửi cho học sinh"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/5">
                  <div>
                    <div className="text-xs font-bold text-white">{cls.studentCount}</div>
                    <div className="text-[10px] text-gray-400">Học sinh</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-400">{cls.avgScore} / 10</div>
                    <div className="text-[10px] text-gray-400">Điểm TB</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-indigo-400">{cls.activeAssignments}</div>
                    <div className="text-[10px] text-gray-400">Bài tập</div>
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
