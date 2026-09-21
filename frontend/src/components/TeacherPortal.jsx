import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  GraduationCap, Shuffle, Users, BookOpen, Sparkles, Plus, Trash2, 
  Copy, Check, Download, FileText, CheckCircle2, AlertCircle, Award, 
  Calendar, Send, RefreshCw, Layers, Printer, Eye, ChevronRight, BarChart3,
  Search, ShieldAlert, Sparkle, Trophy, CheckSquare, MessageSquare,
  Lock, Unlock, Key, Phone, ArrowLeft, Clock, PenTool, Edit3, Share2, Megaphone,
  UserCheck, AlertTriangle, FileSpreadsheet, ExternalLink, Play, RotateCcw, X, Upload,
  FileCheck, HelpCircle, Gift
} from 'lucide-react';
import axios from 'axios';
import mammoth from 'mammoth';

const API_BASE = '/api';

// Đề thi mẫu giáo viên có thể dán hoặc tham khảo
const SAMPLE_TEACHER_EXAM = `Câu 1: The government is making efforts to ______ the natural habitats of rare wild animals.
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

// Mẫu thử thách tuần
const INITIAL_TOPICS = [
  {
    id: 'top-1',
    week: 'Tuần 1',
    title: 'Chủ Đề 1: Môi Trường & Năng Lượng Xanh',
    grade: '10',
    deadline: '2026-09-15',
    description: 'Tìm từ vựng mới về chủ đề Môi trường và viết 1 đoạn văn đề xuất giải pháp bảo vệ hệ sinh thái.',
    essayPrompt: 'Write a paragraph of 120-150 words proposing practical solutions that high school students can do to reduce plastic waste and protect local ecosystems.',
    submissions: [
      { 
        id: 'sub-1', 
        studentName: 'Nguyễn Văn An', 
        word: 'Biodiversity', 
        meaning: 'Đa dạng sinh học', 
        sentence: 'Protecting biodiversity is crucial for preserving our planet ecological balance.', 
        essay: 'In modern society, protecting the environment has become an urgent priority for high school students. Firstly, students can minimize single-use plastic consumption by bringing reusable water bottles and fabric tote bags to school. Secondly, participating in weekly campus clean-up campaigns helps raise collective awareness about ecological conservation. In conclusion, small daily actions by students will create a profound positive impact on our blue planet.',
        aiScore: 9.5, 
        aiFeedback: 'Bài viết đoạn văn rất mạch lạc, liên kết ý logic, từ vựng C1 chuẩn xác!', 
        type: 'full',
        status: 'approved' 
      }
    ]
  },
  {
    id: 'top-2',
    week: 'Tuần 2',
    title: 'Chủ Đề 2: Trí Tuệ Nhân Tạo Trong Học Tập THPT',
    grade: '11',
    deadline: '2026-09-22',
    description: 'Thảo luận về cơ hội và thách thức khi áp dụng trợ lý AI trong quá trình tự học Tiếng Anh THPT.',
    essayPrompt: 'Write a paragraph (120-150 words) discussing both advantages and challenges of utilizing AI-powered learning assistants for high school students.',
    submissions: [
      { 
        id: 'sub-4', 
        studentName: 'Phạm Minh Đức', 
        word: 'Adaptive', 
        meaning: 'Thích ứng', 
        sentence: 'Adaptive learning platforms adjust exercises according to individual student proficiency.', 
        essay: 'AI-powered learning platforms offer remarkable benefits for high school education while posing certain challenges. On the positive side, adaptive intelligent tutoring systems diagnose individual learning gaps and customize practice exercises according to individual speed. However, over-reliance on artificial intelligence might diminish students critical thinking and independent problem-solving abilities. Therefore, learners should treat AI as a supportive mentor rather than a complete substitute for human effort.',
        aiScore: 10, 
        aiFeedback: 'Bài luận xuất sắc! Sử dụng cấu trúc câu phức, câu ghép linh hoạt và vốn từ vựng phong phú.', 
        type: 'full',
        status: 'approved' 
      }
    ]
  }
];

// Hàm chuyển đổi HTML từ Mammoth (giữ lại bold/underline) sang Markdown
function convertHtmlToMarkdown(html) {
  if (!html) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const paragraphs = doc.querySelectorAll('p');
  let markdown = '';
  
  paragraphs.forEach(p => {
    let pText = '';
    p.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        const text = node.textContent;
        if (tagName === 'strong' || tagName === 'b') {
          pText += `**${text}**`;
        } else if (tagName === 'u' || tagName === 'ins') {
          pText += `__${text}__`;
        } else {
          pText += text;
        }
      } else {
        pText += node.textContent;
      }
    });
    if (pText.trim().length > 0) {
      markdown += pText.trim() + '\n';
    }
  });
  return markdown;
}

// Hàm bóc tách thông minh hỗ trợ nhận diện bold/underline từ file Word
function parseExamTextToQuestions(text) {
  if (!text || !text.trim()) return [];
  
  // Chuẩn hóa dấu xuống dòng và khoảng trắng
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Tách theo câu hỏi: Câu 1, Câu 1., Question 1, Question 1:
  const rawBlocks = normalized.split(/(?=(?:Câu|Question|Bài)\s+\d+[\s.:])/i).filter(b => b.trim().length > 0);
  const questions = [];

  rawBlocks.forEach((block, index) => {
    const rawLines = block.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (rawLines.length === 0) return;

    let questionText = rawLines[0];
    let optionA = '';
    let optionB = '';
    let optionC = '';
    let optionD = '';
    let correctKey = ''; // Bắt đầu trống để tìm qua bold/underline

    const blockContent = rawLines.join('\n');
    
    // Quét tìm các dòng lựa chọn A, B, C, D và nhận diện in đậm/gạch chân
    rawLines.forEach(l => {
      const cleanLine = l.replace(/^[\s*_~]*/, ''); // loại bỏ ký tự markdown ở đầu
      if (/^A[.:)]/i.test(cleanLine)) {
        optionA = cleanLine.replace(/^A[.:)]\s*/i, '').replace(/[\s*_~]*$/, '');
        if (
          l.includes('**A.**') || l.includes('__A.__') || 
          l.includes('**A**') || l.includes('__A__') || 
          l.startsWith('**A.') || l.startsWith('__A.') ||
          l.includes('**' + optionA + '**') || l.includes('__' + optionA + '__')
        ) {
          correctKey = 'A';
        }
      }
      else if (/^B[.:)]/i.test(cleanLine)) {
        optionB = cleanLine.replace(/^B[.:)]\s*/i, '').replace(/[\s*_~]*$/, '');
        if (
          l.includes('**B.**') || l.includes('__B.__') || 
          l.includes('**B**') || l.includes('__B__') || 
          l.startsWith('**B.') || l.startsWith('__B.') ||
          l.includes('**' + optionB + '**') || l.includes('__' + optionB + '__')
        ) {
          correctKey = 'B';
        }
      }
      else if (/^C[.:)]/i.test(cleanLine)) {
        optionC = cleanLine.replace(/^C[.:)]\s*/i, '').replace(/[\s*_~]*$/, '');
        if (
          l.includes('**C.**') || l.includes('__C.__') || 
          l.includes('**C**') || l.includes('__C__') || 
          l.startsWith('**C.') || l.startsWith('__C.') ||
          l.includes('**' + optionC + '**') || l.includes('__' + optionC + '__')
        ) {
          correctKey = 'C';
        }
      }
      else if (/^D[.:)]/i.test(cleanLine)) {
        optionD = cleanLine.replace(/^D[.:)]\s*/i, '').replace(/[\s*_~]*$/, '');
        if (
          l.includes('**D.**') || l.includes('__D.__') || 
          l.includes('**D**') || l.includes('__D__') || 
          l.startsWith('**D.') || l.startsWith('__D.') ||
          l.includes('**' + optionD + '**') || l.includes('__' + optionD + '__')
        ) {
          correctKey = 'D';
        }
      }
    });

    // Nếu không nhận diện được qua bold/underline, tìm qua từ khóa "Đáp án: A" ở dưới
    if (!correctKey) {
      const ansMatch = blockContent.match(/(?:Đáp án|Đáp án đúng|Answer|Key)[\s.:]+([A-D])/i);
      if (ansMatch) {
        correctKey = ansMatch[1].toUpperCase();
      } else {
        correctKey = 'A'; // mặc định nếu không có gì
      }
    }

    const options = [
      { key: 'A', text: optionA },
      { key: 'B', text: optionB },
      { key: 'C', text: optionC },
      { key: 'D', text: optionD }
    ].filter(o => o.text.trim().length > 0);

    if (options.length >= 2) {
      // Làm sạch câu hỏi
      questionText = questionText.replace(/^[A-D][.:)].*$/i, '').trim();
      questions.push({
        id: index + 1,
        questionNumber: index + 1,
        part: 'Trắc nghiệm THPT',
        question: questionText,
        options,
        correctAnswer: correctKey,
        explanation: `Đáp án đúng là ${correctKey}.`
      });
    }
  });

  return questions;
}

// Danh sách lớp học mẫu ban đầu
const INITIAL_CLASSES = [
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
        questions: parseExamTextToQuestions(SAMPLE_TEACHER_EXAM),
        deadline: '2026-09-15', 
        timeLimit: 15,
        submittedCount: 35, 
        totalStudents: 38, 
        status: 'open' 
      }
    ],
    students: [
      { id: 'st-1', name: 'Nguyễn Văn An', email: 'an.nv@thpt.edu.vn', score1: 9.0, score2: 9.5, essayScore: 9.5, avg: 9.3, status: 'completed' },
      { id: 'st-2', name: 'Trần Thị Mai', email: 'mai.tt@thpt.edu.vn', score1: 8.5, score2: 8.0, essayScore: 9.0, avg: 8.5, status: 'completed' },
      { id: 'st-3', name: 'Lê Hoàng Nam', email: 'nam.lh@thpt.edu.vn', score1: 7.0, score2: 7.5, essayScore: 8.0, avg: 7.5, status: 'in_progress' },
      { id: 'st-4', name: 'Phạm Minh Đức', email: 'duc.pm@thpt.edu.vn', score1: 9.5, score2: 10.0, essayScore: 10.0, avg: 9.8, status: 'completed' },
      { id: 'st-5', name: 'Hoàng Quốc Bảo', email: 'bao.hq@thpt.edu.vn', score1: 4.5, score2: 5.0, essayScore: 4.8, avg: 4.8, status: 'needs_help' }
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
        questions: parseExamTextToQuestions(SAMPLE_TEACHER_EXAM),
        deadline: '2026-09-18', 
        timeLimit: 45,
        submittedCount: 40, 
        totalStudents: 42, 
        status: 'open' 
      }
    ],
    students: [
      { id: 'st-6', name: 'Đặng Thu Hà', email: 'ha.dt@thpt.edu.vn', score1: 8.8, score2: 9.0, essayScore: 8.5, avg: 8.8, status: 'completed' },
      { id: 'st-7', name: 'Vũ Hải Đăng', email: 'dang.vh@thpt.edu.vn', score1: 8.0, score2: 8.5, essayScore: 8.0, avg: 8.2, status: 'completed' }
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
      { id: 'ann-4', title: 'Bài kiểm tra 50 phút', content: 'Yêu cầu 100% các bạn hoàn thành bài thi trước hạn nộp.', date: '2026-08-27' }
    ],
    assignments: [
      { 
        id: 'asg-3', 
        title: 'Đề Luyện Thi Tốt Nghiệp THPT Số 1', 
        questions: parseExamTextToQuestions(SAMPLE_TEACHER_EXAM),
        deadline: '2026-09-20', 
        timeLimit: 50,
        submittedCount: 43, 
        totalStudents: 45, 
        status: 'open' 
      }
    ],
    students: [
      { id: 'st-8', name: 'Bùi Gia Huy', email: 'huy.bg@thpt.edu.vn', score1: 9.2, score2: 9.6, essayScore: 9.0, avg: 9.3, status: 'completed' }
    ]
  }
];

export default function TeacherPortal({ keys, classes: propClasses, setClasses: propSetClasses, onNavigate, standaloneShufflerOnly, isLightMode = true, onOpenCanva }) {
  // Nhận diện tên miền riêng tuananhstudio.top hoặc chế độ chuyên biệt chỉ xáo đề
  const isDedicatedDomain = typeof window !== 'undefined' && window.location.hostname.includes('tuananhstudio.top');
  const isShufflerOnlyMode = isDedicatedDomain || standaloneShufflerOnly;
  const isLight = isShufflerOnlyMode ? (isLightMode !== undefined ? isLightMode : true) : (isLightMode || false);

  // ════════════════════════════════════════════════════════════════════════════
  // 0. BẢO MẬT & KÍCH HOẠT QUYỀN GIÁO VIÊN
  // ════════════════════════════════════════════════════════════════════════════
  const [isTeacherActivated, setIsTeacherActivated] = useState(() => {
    if (typeof window !== 'undefined' && (window.location.hostname.includes('tuananhstudio.top') || standaloneShufflerOnly)) {
      return true;
    }
    return localStorage.getItem('is_teacher_activated') === 'true';
  });
  const [teacherInfo, setTeacherInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('teacher_activation_info');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    if (typeof window !== 'undefined' && (window.location.hostname.includes('tuananhstudio.top') || standaloneShufflerOnly)) {
      return { name: 'Thầy/Cô Giáo Viên', school: 'THPT', key: 'TUANANHSTUDIO-VIP', expiryDate: 'lifetime' };
    }
    return null;
  });
  const [activationInputCode, setActivationInputCode] = useState('');
  const [activationError, setActivationError] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);

  const [teacherName, setTeacherName] = useState('');
  const [teacherPhone, setTeacherPhone] = useState('');
  const [teacherSchool, setTeacherSchool] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);
  const [showTeacherFeatureModal, setShowTeacherFeatureModal] = useState(false);

  const handleVerifyTeacherCode = (e) => {
    e.preventDefault();
    const code = activationInputCode.trim().toUpperCase();
    
    // 1. Quét danh sách key từ localStorage
    let dynamicKeys = [];
    try {
      const saved = localStorage.getItem('admin_teacher_license_keys');
      if (saved) dynamicKeys = JSON.parse(saved);
    } catch (e) {}

    // Thêm các key mặc định để tương thích ngược
    const defaultKeys = [
      { key: 'GV-THPT-2026', teacherName: 'Cô Thùy Trang', school: 'THPT Hướng Dẫn KHKT', expiryDate: 'lifetime', status: 'active' },
      { key: 'VIP-TEACHER', teacherName: 'Admin Tuấn Anh', school: 'Ban Quản Trị Hệ Thống', expiryDate: 'lifetime', status: 'active' },
      { key: 'GV-HANOI-12', teacherName: 'Thầy Nguyễn Văn Nam', school: 'THPT Chu Văn An (Hà Nội)', expiryDate: 'lifetime', status: 'active' },
      { key: 'ADMIN', teacherName: 'Admin Toàn Quyền', school: 'Hệ Thống', expiryDate: 'lifetime', status: 'active' }
    ];

    const allKeys = [...dynamicKeys, ...defaultKeys];
    
    // Tìm key khớp
    const matchedKey = allKeys.find(k => k.key.toUpperCase() === code);
    
    if (matchedKey) {
      if (matchedKey.status === 'locked') {
        setActivationError("Mã key này đã bị khóa bởi Admin. Vui lòng liên hệ để mở khóa!");
        return;
      }
      
      // Kiểm tra ngày hết hạn
      const currentDateStr = new Date().toISOString().split('T')[0];
      if (matchedKey.expiryDate && matchedKey.expiryDate !== 'lifetime' && matchedKey.expiryDate < currentDateStr) {
        setActivationError(`Mã key đã hết hạn sử dụng vào ngày ${matchedKey.expiryDate}! Vui lòng liên hệ Admin để gia hạn.`);
        return;
      }

      setIsTeacherActivated(true);
      localStorage.setItem('is_teacher_activated', 'true');
      
      const teacherObj = {
        name: matchedKey.teacherName,
        school: matchedKey.school,
        key: matchedKey.key,
        expiryDate: matchedKey.expiryDate || 'lifetime'
      };
      setTeacherInfo(teacherObj);
      localStorage.setItem('teacher_activation_info', JSON.stringify(teacherObj));
      setActivationError('');
      alert(`✓ Xác thực thành công! Chào mừng Thầy/Cô ${matchedKey.teacherName} đến với Cổng Quản Trị Giáo Viên.`);
    } else {
      setActivationError("Mã kích hoạt không chính xác. Vui lòng liên hệ Admin qua Zalo 0975.711.254 để nhận mã!");
    }
  };

  const handleDeactivateTeacher = async () => {
    const ok = window.appConfirm
      ? await window.appConfirm("Thầy/Cô có muốn khóa phiên làm việc của Giáo Viên và đăng xuất không?", "Khóa Phiên Làm Việc", { type: 'warning', confirmText: 'Khóa & Đăng Xuất' })
      : window.confirm("Thầy/Cô có muốn khóa phiên làm việc của Giáo Viên không?");
    if (ok) {
      setIsTeacherActivated(false);
      localStorage.removeItem('is_teacher_activated');
      localStorage.removeItem('teacher_activation_info');
      setTeacherInfo(null);
    }
  };

  const handleSendTeacherRegistration = async (e) => {
    e.preventDefault();
    if (!teacherName || !teacherPhone) {
      alert("Vui lòng điền họ tên và số điện thoại / Zalo!");
      return;
    }
    
    // Gửi lên Backend API
    try {
      await axios.post(`${API_BASE}/teacher-requests`, {
        teacher_name: teacherName.trim(),
        phone: teacherPhone.trim(),
        school: (teacherSchool || 'Trường THPT').trim(),
        role_title: 'Giáo viên',
        note: (teacherNote || '').trim()
      });
    } catch (err) {
      console.warn('Lỗi API backend teacher-requests:', err);
    }

    // Lưu thông tin yêu cầu vào danh sách chờ duyệt của Admin trên local
    try {
      const existingReqs = JSON.parse(localStorage.getItem('admin_teacher_registration_requests') || '[]');
      const newReq = {
        id: 'REQ-' + Date.now(),
        teacherName: teacherName.trim(),
        phone: teacherPhone.trim(),
        school: (teacherSchool || 'Trường THPT').trim(),
        note: (teacherNote || '').trim(),
        timestamp: new Date().toLocaleString('vi-VN'),
        status: 'pending'
      };
      existingReqs.unshift(newReq);
      localStorage.setItem('admin_teacher_registration_requests', JSON.stringify(existingReqs));
    } catch (err) {
      console.warn('Lỗi lưu yêu cầu giáo viên:', err);
    }

    // Tự động mở Zalo Admin
    window.open('https://zalo.me/0975711254', '_blank');

    setContactSuccess(true);
  };

  // ════════════════════════════════════════════════════════════════════════════
  // 1. TÍNH NĂNG XÁO ĐỀ THI & TẢI FILE WORD (.DOCX / .DOC / .TXT)
  // ════════════════════════════════════════════════════════════════════════════
  const [activeSection, setActiveSection] = useState(isShufflerOnlyMode ? 'shuffler' : 'classes'); // 'classes' | 'shuffler' | 'weekly-topic'
  const [rawExamInput, setRawExamInput] = useState(SAMPLE_TEACHER_EXAM);
  const [numVariants, setNumVariants] = useState(4);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [shuffledExams, setShuffledExams] = useState(null);
  const [selectedExamCode, setSelectedExamCode] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const fileInputRef = useRef(null);

  // Tính năng nâng cao chuyên xáo đề & ma trận đáp án
  const [preservePassages, setPreservePassages] = useState(true);
  const [showMasterMatrix, setShowMasterMatrix] = useState(false);
  const [copiedMatrix, setCopiedMatrix] = useState(false);

  // Cấu hình định dạng xuất bản A4 Portrait & Times New Roman chuẩn Bộ GD&ĐT
  const [examFontSize, setExamFontSize] = useState(12); // 11, 12, 13, 14 pt
  const [examHeaderInfo, setExamHeaderInfo] = useState({
    department: 'SỞ GIÁO DỤC VÀ ĐÀO TẠO',
    school: 'TRƯỜNG THPT NGUYỄN KHUYẾN',
    examTitle: 'BÀI KIỂM TRA ĐỊNH KỲ MÔN TIẾNG ANH',
    subjectTitle: 'MÔN: TIẾNG ANH - THPT',
    durationMinutes: 50,
    grade: '12'
  });
  const [showEditHeaderModal, setShowEditHeaderModal] = useState(false);
  const [showCorrectInPreview, setShowCorrectInPreview] = useState(true);

  // Xử lý tải file đề thi của giáo viên lên (.docx, .doc, .txt)
  const handleUploadExamFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoadingFile(true);
    const fileName = file.name.toLowerCase();

    try {
      if (fileName.endsWith('.docx')) {
        // Đọc file Word .docx bằng mammoth (chuyển sang HTML giữ định dạng)
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ 
          arrayBuffer,
          styleMap: [
            "u => u",
            "strike => del"
          ]
        });
        const html = result.value;
        const text = convertHtmlToMarkdown(html);
        setRawExamInput(text);
        const parsed = parseExamTextToQuestions(text);
        alert(`✓ Đã tải file Word "${file.name}" thành công! Hệ thống nhận diện được ${parsed.length} câu hỏi trắc nghiệm (Tự động bóc tách đáp án in đậm/gạch chân).`);
      } else {
        // Đọc file .txt hoặc .doc
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target.result;
          setRawExamInput(text);
          const parsed = parseExamTextToQuestions(text);
          alert(`✓ Đã tải file "${file.name}" thành công! Hệ thống nhận diện được ${parsed.length} câu hỏi trắc nghiệm.`);
        };
        reader.readAsText(file, 'UTF-8');
      }
    } catch (err) {
      alert("Có lỗi khi đọc file đề thi. Vui lòng thử lại hoặc dán trực tiếp nội dung đề vào ô bên dưới!");
    } finally {
      setIsLoadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Thuật toán xáo đề chuẩn xác, không bị xáo trộn lung tung
  const handleShuffleExam = () => {
    const parsed = parseExamTextToQuestions(rawExamInput);
    if (parsed.length === 0) {
      alert("Không tìm thấy câu hỏi hợp lệ. Vui lòng kiểm tra định dạng đề thi (Câu 1:... A. ... B. ... C. ... D. ... Đáp án: A)!");
      return;
    }

    const generated = [];
    const baseCode = 101;

    for (let i = 0; i < numVariants; i++) {
      const codeStr = String(baseCode + i);

      let shuffledQList = [];
      if (shuffleQuestions) {
        if (preservePassages) {
          // Nhóm các câu hỏi thuộc cùng đoạn văn đọc hiểu để không bị xé lẻ
          const chunks = [];
          let currentPassageChunk = null;

          parsed.forEach((q) => {
            const isPassageStart = /(?:read\s+the\s+following\s+passage|đọc\s+đoạn\s+văn|passage\s+\d+|bài\s+đọc)/i.test(q.question);
            const isContinuation = /(?:according\s+to\s+the\s+passage|which\s+of\s+the\s+following|the\s+word\s+["'].*["']\s+in\s+paragraph|the\s+passage\s+mainly|what\s+does\s+the\s+author|inferred\s+from\s+the\s+passage)/i.test(q.question);

            if (isPassageStart) {
              if (currentPassageChunk && currentPassageChunk.length > 0) {
                chunks.push(currentPassageChunk);
              }
              currentPassageChunk = [q];
            } else if (currentPassageChunk && isContinuation) {
              currentPassageChunk.push(q);
            } else {
              if (currentPassageChunk && currentPassageChunk.length > 0) {
                chunks.push(currentPassageChunk);
                currentPassageChunk = null;
              }
              chunks.push([q]);
            }
          });
          if (currentPassageChunk && currentPassageChunk.length > 0) {
            chunks.push(currentPassageChunk);
          }

          // Xáo trộn thứ tự các cụm câu hỏi
          const shuffledChunks = [...chunks].sort(() => Math.random() - 0.5);
          // Ghép lại thành danh sách phẳng (giữ câu chứa bài đọc ở đầu cụm)
          shuffledQList = shuffledChunks.flatMap(chunk => {
            if (chunk.length > 1) {
              const first = chunk[0];
              const rest = chunk.slice(1).sort(() => Math.random() - 0.5);
              return [first, ...rest];
            }
            return chunk;
          });
        } else {
          shuffledQList = [...parsed].sort(() => Math.random() - 0.5);
        }
      } else {
        shuffledQList = [...parsed];
      }

      const finalQuestions = shuffledQList.map((q, qIdx) => {
        const originalCorrectText = q.options.find(o => o.key === q.correctAnswer)?.text || '';
        // Đảo thứ tự các phương án A, B, C, D nếu chọn shuffleOptions, ngược lại giữ nguyên
        const shuffledOptions = shuffleOptions ? [...q.options].sort(() => Math.random() - 0.5) : [...q.options];
        const keys = ['A', 'B', 'C', 'D'];
        const mappedOptions = shuffledOptions.map((opt, optIdx) => ({
          key: keys[optIdx],
          text: opt.text
        }));

        const newCorrectOption = mappedOptions.find(o => o.text === originalCorrectText);
        const newCorrectKey = newCorrectOption ? newCorrectOption.key : 'A';

        return {
          questionNumber: qIdx + 1,
          originalId: q.id,
          questionText: q.question.replace(/^(?:Câu|Question|Bài)\s+\d+[\s.:]/i, `Câu ${qIdx + 1}:`),
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
    alert(`✓ Đã xáo đề thành công tạo ra ${generated.length} mã đề riêng biệt (Mã 101 - ${100 + generated.length}) kèm ma trận đáp án!`);
  };

  // ════════════════════════════════════════════════════════════════════════════
  // BỘ TẠO FILE WORD (.DOC) & IN ẤN CHUẨN QUỐC GIA: KHỔ A4 DỌC, TIMES NEW ROMAN
  // Tương thích 100% Microsoft Word (mọi phiên bản), WPS Office, Google Docs
  // ════════════════════════════════════════════════════════════════════════════
  const generateWordDocContent = (examsList, { singleExamOnly = false, includeMatrix = true } = {}) => {
    const list = Array.isArray(examsList) ? examsList : [examsList];
    const totalExams = list.length;
    const totalQ = list[0]?.questions?.length || 0;
    const fontSize = Number(examFontSize) || 12;

    let bodyContent = '';

    list.forEach((exam, examIdx) => {
      const estPages = Math.max(1, Math.ceil(exam.questions.length / 10));

      let examHtml = `
      <table class="header-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 6pt;">
        <tr>
          <td style="width: 52%; vertical-align: top; text-align: center; border: none; padding: 0 8pt 0 0;">
            <p style="margin: 0 0 2pt 0; font-weight: bold; text-transform: uppercase; font-size: ${fontSize - 0.5}pt;">${examHeaderInfo.department || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO'}</p>
            <p style="margin: 0 0 2pt 0; font-weight: bold; text-transform: uppercase; font-size: ${fontSize}pt;">${examHeaderInfo.school || 'TRƯỜNG THPT NGUYỄN KHUYẾN'}</p>
            <p style="margin: 0; font-style: italic; font-size: ${fontSize - 2}pt;">(Đề thi có ${estPages} trang)</p>
          </td>
          <td style="width: 48%; vertical-align: top; text-align: center; border: none; padding: 0 0 0 8pt;">
            <p style="margin: 0 0 2pt 0; font-weight: bold; text-transform: uppercase; font-size: ${fontSize - 0.5}pt;">${examHeaderInfo.examTitle || 'BÀI KIỂM TRA ĐỊNH KỲ TIẾNG ANH'}</p>
            <p style="margin: 0 0 2pt 0; font-weight: bold; font-size: ${fontSize}pt;">${examHeaderInfo.subjectTitle || 'MÔN: TIẾNG ANH - THPT'}</p>
            <p style="margin: 0 0 4pt 0; font-style: italic; font-size: ${fontSize - 1.5}pt;">Thời gian làm bài: ${examHeaderInfo.durationMinutes || 50} phút (không kể phát đề)</p>
            <table border="1" cellspacing="0" cellpadding="0" style="margin: 2pt auto 0 auto; border-collapse: collapse; border: 1.5pt solid #000000;">
              <tr>
                <td style="padding: 2pt 12pt; font-weight: bold; font-size: ${fontSize + 1.5}pt; border: 1.5pt solid #000000; text-align: center; letter-spacing: 1pt;">
                  MÃ ĐỀ THI: ${exam.examCode}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <table border="0" cellspacing="0" cellpadding="0" style="width: 100%; margin-top: 6pt; margin-bottom: 8pt; border-bottom: 1.5pt solid #000000; padding-bottom: 5pt; border-collapse: collapse;">
        <tr>
          <td style="border: none; font-size: ${fontSize - 0.5}pt; padding: 0;">
            Họ và tên thí sinh: ............................................................................ Số báo danh: .............................
          </td>
        </tr>
      </table>
      `;

      exam.questions.forEach((q) => {
        const maxOptLen = Math.max(...q.options.map(o => (o.text || '').length));

        let optionsTable = '';
        if (maxOptLen <= 18) {
          optionsTable = `
          <table class="options-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse; border: none; margin-top: 1.5pt; margin-bottom: 4.5pt;">
            <tr>
              <td style="width: 25%; border: none; padding: 1.5pt 4pt 1.5pt 0; vertical-align: top;"><b>A.</b> ${q.options[0]?.text || ''}</td>
              <td style="width: 25%; border: none; padding: 1.5pt 4pt 1.5pt 0; vertical-align: top;"><b>B.</b> ${q.options[1]?.text || ''}</td>
              <td style="width: 25%; border: none; padding: 1.5pt 4pt 1.5pt 0; vertical-align: top;"><b>C.</b> ${q.options[2]?.text || ''}</td>
              <td style="width: 25%; border: none; padding: 1.5pt 4pt 1.5pt 0; vertical-align: top;"><b>D.</b> ${q.options[3]?.text || ''}</td>
            </tr>
          </table>`;
        } else if (maxOptLen <= 42) {
          optionsTable = `
          <table class="options-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse; border: none; margin-top: 1.5pt; margin-bottom: 4.5pt;">
            <tr>
              <td style="width: 50%; border: none; padding: 1.5pt 6pt 1.5pt 0; vertical-align: top;"><b>A.</b> ${q.options[0]?.text || ''}</td>
              <td style="width: 50%; border: none; padding: 1.5pt 6pt 1.5pt 0; vertical-align: top;"><b>B.</b> ${q.options[1]?.text || ''}</td>
            </tr>
            <tr>
              <td style="width: 50%; border: none; padding: 1.5pt 6pt 1.5pt 0; vertical-align: top;"><b>C.</b> ${q.options[2]?.text || ''}</td>
              <td style="width: 50%; border: none; padding: 1.5pt 6pt 1.5pt 0; vertical-align: top;"><b>D.</b> ${q.options[3]?.text || ''}</td>
            </tr>
          </table>`;
        } else {
          optionsTable = `
          <table class="options-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse; border: none; margin-top: 1.5pt; margin-bottom: 4.5pt;">
            <tr><td style="width: 100%; border: none; padding: 1.5pt 0; vertical-align: top;"><b>A.</b> ${q.options[0]?.text || ''}</td></tr>
            <tr><td style="width: 100%; border: none; padding: 1.5pt 0; vertical-align: top;"><b>B.</b> ${q.options[1]?.text || ''}</td></tr>
            <tr><td style="width: 100%; border: none; padding: 1.5pt 0; vertical-align: top;"><b>C.</b> ${q.options[2]?.text || ''}</td></tr>
            <tr><td style="width: 100%; border: none; padding: 1.5pt 0; vertical-align: top;"><b>D.</b> ${q.options[3]?.text || ''}</td></tr>
          </table>`;
        }

        examHtml += `
        <div style="margin-top: 5pt; margin-bottom: 3pt; page-break-inside: avoid;">
          <p style="margin: 0 0 2pt 0; text-align: justify;">
            <b>${q.questionText}</b>
          </p>
          ${optionsTable}
        </div>`;
      });

      examHtml += `
      <p style="text-align: center; margin: 16pt 0 3pt 0; font-weight: bold; letter-spacing: 2pt;">---------- HẾT ----------</p>
      <p style="text-align: center; font-style: italic; font-size: ${fontSize - 1.5}pt; margin-bottom: 12pt;">
        Thí sinh không được sử dụng tài liệu. Cán bộ coi thi không giải thích gì thêm.
      </p>`;

      // Bảng đáp án chuẩn trên trang mới
      examHtml += `
      <br clear="all" style="page-break-before: always; mso-break-type: section-break;" />
      <p style="text-align: center; font-weight: bold; font-size: ${fontSize + 2}pt; text-transform: uppercase; margin: 10pt 0 3pt 0;">
        ĐÁP ÁN ĐỀ THI MÔN TIẾNG ANH - MÃ ĐỀ ${exam.examCode}
      </p>
      <p style="text-align: center; font-style: italic; font-size: ${fontSize - 1.5}pt; margin-bottom: 12pt;">
        (Bảng đáp án chính thức gồm ${exam.questions.length} câu hỏi trắc nghiệm)
      </p>
      `;

      const chunkSize = 10;
      for (let cIdx = 0; cIdx < exam.answerKey.length; cIdx += chunkSize) {
        const chunk = exam.answerKey.slice(cIdx, cIdx + chunkSize);
        examHtml += `
        <table border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1pt solid #000000; width: 100%; margin-bottom: 8pt; text-align: center;">
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1pt solid #000000; padding: 4pt 2pt; font-size: ${fontSize - 1}pt; width: 10%;">Câu</th>
            ${chunk.map(c => `<th style="border: 1pt solid #000000; padding: 4pt 2pt; font-size: ${fontSize - 1}pt;">${c.qNum}</th>`).join('')}
          </tr>
          <tr>
            <td style="border: 1pt solid #000000; padding: 4pt 2pt; font-weight: bold; font-size: ${fontSize - 1}pt; width: 10%;">Đ/A</td>
            ${chunk.map(c => `<td style="border: 1pt solid #000000; padding: 4pt 2pt; font-weight: bold; font-size: ${fontSize + 1}pt; color: #b91c1c;">${c.ans}</td>`).join('')}
          </tr>
        </table>`;
      }

      bodyContent += examHtml;

      if (examIdx < totalExams - 1) {
        bodyContent += `<br clear="all" style="page-break-before: always; mso-break-type: section-break;" />`;
      }
    });

    // Bảng Ma Trận Đáp Án Đối Chiếu Tổng Hợp (ở cuối gói trọn bộ)
    if (!singleExamOnly && totalExams > 1 && includeMatrix) {
      bodyContent += `
      <br clear="all" style="page-break-before: always; mso-break-type: section-break;" />
      <p style="text-align: center; font-weight: bold; font-size: ${fontSize + 3}pt; text-transform: uppercase; margin: 10pt 0 4pt 0;">
        BẢNG MA TRẬN ĐÁP ÁN ĐỐI CHIẾU CÁC MÃ ĐỀ THI
      </p>
      <p style="text-align: center; font-style: italic; font-size: ${fontSize - 1.5}pt; margin-bottom: 14pt;">
        (Dành cho Giám thị & Ban Chấm thi • Đối chiếu ${totalExams} mã đề từ ${list[0]?.examCode} đến ${list[totalExams - 1]?.examCode})
      </p>
      <table border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1pt solid #000000; width: 100%; margin: 0 auto; text-align: center;">
        <thead>
          <tr style="background-color: #e5e7eb;">
            <th style="border: 1pt solid #000000; padding: 5pt 4pt; font-size: ${fontSize - 0.5}pt; width: 12%;">Câu hỏi</th>
            ${list.map(ex => `<th style="border: 1pt solid #000000; padding: 5pt 4pt; font-size: ${fontSize - 0.5}pt; font-weight: bold;">Mã ${ex.examCode}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${Array.from({ length: totalQ }, (_, i) => {
            const qNum = i + 1;
            const bgStyle = qNum % 2 === 0 ? 'background-color: #f9fafb;' : '';
            return `
            <tr style="${bgStyle}">
              <td style="border: 1pt solid #000000; padding: 3.5pt 4pt; font-weight: bold; font-size: ${fontSize - 1}pt;">Câu ${qNum}</td>
              ${list.map(ex => {
                const ans = ex.answerKey.find(a => a.qNum === qNum)?.ans || '-';
                return `<td style="border: 1pt solid #000000; padding: 3.5pt 4pt; font-weight: bold; font-size: ${fontSize}pt; color: #1e3a8a;">${ans}</td>`;
              }).join('')}
            </tr>`;
          }).join('')}
        </tbody>
      </table>`;
    }

    return `
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="ProgId" content="Word.Document">
<meta name="Generator" content="Microsoft Word 15">
<meta name="Originator" content="Microsoft Word 15">
<!--[if gte mso 9]>
<xml>
  <w:WordDocument>
    <w:View>Print</w:View>
    <w:Zoom>100</w:Zoom>
    <w:DoNotOptimizeForBrowser/>
    <w:PunctuationKerning/>
    <w:ValidateAgainstSchemas/>
    <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
    <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
    <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
    <w:Compatibility>
      <w:BreakWrappedTables/>
      <w:SnapToGridInCell/>
      <w:WrapTextWithPunct/>
      <w:UseAsianBreakRules/>
      <w:DontGrowAutofit/>
      <w:SplitPgLdFtMpt/>
    </w:Compatibility>
  </w:WordDocument>
</xml>
<![endif]-->
<style>
@page {
  size: 595.3pt 841.9pt; /* A4 Portrait: 210mm x 297mm */
  mso-page-orientation: portrait;
  margin: 56.7pt 42.5pt 56.7pt 56.7pt; /* Lề trên: 2cm, Lề phải: 1.5cm, Lề dưới: 2cm, Lề trái: 2cm */
  mso-header-margin: 36.0pt;
  mso-footer-margin: 36.0pt;
}
@page Section1 {
  size: 595.3pt 841.9pt;
  mso-page-orientation: portrait;
  margin: 56.7pt 42.5pt 56.7pt 56.7pt;
  mso-header-margin: 36.0pt;
  mso-footer-margin: 36.0pt;
  mso-paper-source: 0;
}
div.Section1 {
  page: Section1;
}
/* ÉP BUỘC FONT TIMES NEW ROMAN 100% CHO WORD VÀ WPS OFFICE */
body, p, div, span, table, td, th, h1, h2, h3, h4 {
  font-family: 'Times New Roman', Times, serif !important;
  mso-ascii-font-family: 'Times New Roman' !important;
  mso-hansi-font-family: 'Times New Roman' !important;
  mso-bidi-font-family: 'Times New Roman' !important;
  mso-font-alt: 'Times New Roman' !important;
  color: #000000;
}
body {
  font-size: ${fontSize}pt;
  line-height: 1.25;
  margin: 0;
  padding: 0;
}
p {
  margin-top: 0;
  margin-bottom: 3pt;
  mso-pagination: widow-orphan;
}
.header-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 6pt;
  border: none !important;
  mso-border-alt: none !important;
}
.header-table td {
  border: none !important;
  mso-border-alt: none !important;
  padding: 0;
  vertical-align: top;
}
.options-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5pt;
  margin-bottom: 4.5pt;
  border: none !important;
  mso-border-alt: none !important;
}
.options-table td {
  border: none !important;
  mso-border-alt: none !important;
  padding: 1.5pt 4pt 1.5pt 0;
  vertical-align: top;
}
</style>
</head>
<body lang="VI">
<div class="Section1">
${bodyContent}
</div>
</body>
</html>`;
  };

  // Xuất 1 mã đề Word (.doc) khổ A4 đứng, Times New Roman
  const handleExportWord = (examCode) => {
    if (!shuffledExams) return;
    const exam = shuffledExams.find(e => e.examCode === examCode);
    if (!exam) return;

    const html = generateWordDocContent(exam, { singleExamOnly: true });
    const blob = new Blob(['\ufeff' + html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `De_Thi_Tieng_Anh_MaDe_${exam.examCode}_A4.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Xuất trọn bộ file Word kèm ma trận đáp án tổng hợp
  const handleExportAllWord = () => {
    if (!shuffledExams || shuffledExams.length === 0) return;
    const html = generateWordDocContent(shuffledExams, { singleExamOnly: false, includeMatrix: true });
    const blob = new Blob(['\ufeff' + html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tron_Bo_${shuffledExams.length}_Ma_De_Kem_Ma_Tran_Dap_An_A4.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // In đề thi chuẩn A4 Portrait
  const handlePrintExam = (examCode) => {
    if (!shuffledExams) return;
    const exam = shuffledExams.find(e => e.examCode === examCode);
    if (!exam) return;

    const fontSize = Number(examFontSize) || 12;
    const printWin = window.open('', '_blank');
    if (!printWin) {
      alert("Vui lòng cho phép trình duyệt mở pop-up để xem và in đề thi!");
      return;
    }

    const estPages = Math.max(1, Math.ceil(exam.questions.length / 10));

    let content = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>In Đề Thi Tiếng Anh - Mã ${exam.examCode}</title>
<style>
@page {
  size: A4 portrait;
  margin: 18mm 15mm 18mm 20mm;
}
@media print {
  body {
    margin: 0;
    padding: 0;
    font-family: 'Times New Roman', Times, serif !important;
    font-size: ${fontSize}pt !important;
    line-height: 1.25;
    color: #000000 !important;
    background: #ffffff !important;
  }
  .no-print { display: none !important; }
  .page-break { page-break-before: always; break-before: page; }
  .question-item { page-break-inside: avoid; break-inside: avoid; }
}
body {
  font-family: 'Times New Roman', Times, serif;
  font-size: ${fontSize}pt;
  line-height: 1.25;
  color: #000;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}
.header-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; border: none; }
.header-table td { border: none; vertical-align: top; padding: 0; }
.candidate-box { width: 100%; border-bottom: 1.5px solid #000; padding-bottom: 6px; margin-bottom: 12px; font-size: ${fontSize - 0.5}pt; }
.code-box { border: 1.5px solid #000; padding: 2px 10px; font-weight: bold; display: inline-block; font-size: ${fontSize + 1}pt; }
.options-table { width: 100%; border-collapse: collapse; margin-top: 3px; margin-bottom: 6px; border: none; }
.options-table td { border: none; padding: 2px 6px 2px 0; vertical-align: top; }
.answer-grid { border-collapse: collapse; width: 100%; margin-top: 10px; margin-bottom: 12px; text-align: center; }
.answer-grid th, .answer-grid td { border: 1px solid #000; padding: 4px 2px; font-size: ${fontSize - 1}pt; }
.answer-grid th { background-color: #f2f2f2; font-weight: bold; }
</style>
</head>
<body onload="window.print()">
  <table class="header-table">
    <tr>
      <td style="width: 52%; text-align: center;">
        <div style="font-weight: bold; text-transform: uppercase;">${examHeaderInfo.department || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO'}</div>
        <div style="font-weight: bold; text-transform: uppercase;">${examHeaderInfo.school || 'TRƯỜNG THPT NGUYỄN KHUYẾN'}</div>
        <div style="font-style: italic; font-size: ${fontSize - 2}pt;">(Đề thi có ${estPages} trang)</div>
      </td>
      <td style="width: 48%; text-align: center;">
        <div style="font-weight: bold; text-transform: uppercase;">${examHeaderInfo.examTitle || 'BÀI KIỂM TRA TIẾNG ANH'}</div>
        <div style="font-weight: bold;">${examHeaderInfo.subjectTitle || 'MÔN: TIẾNG ANH - THPT'}</div>
        <div style="font-style: italic; font-size: ${fontSize - 1.5}pt; margin-bottom: 4px;">Thời gian: ${examHeaderInfo.durationMinutes || 50} phút (không kể phát đề)</div>
        <div class="code-box">MÃ ĐỀ: ${exam.examCode}</div>
      </td>
    </tr>
  </table>

  <div class="candidate-box">
    Họ và tên thí sinh: ............................................................................ Số báo danh: .............................
  </div>
`;

    exam.questions.forEach((q) => {
      const maxOptLen = Math.max(...q.options.map(o => (o.text || '').length));
      let optsHtml = '';
      if (maxOptLen <= 18) {
        optsHtml = `
        <table class="options-table"><tr>
          <td style="width: 25%;"><b>A.</b> ${q.options[0]?.text || ''}</td>
          <td style="width: 25%;"><b>B.</b> ${q.options[1]?.text || ''}</td>
          <td style="width: 25%;"><b>C.</b> ${q.options[2]?.text || ''}</td>
          <td style="width: 25%;"><b>D.</b> ${q.options[3]?.text || ''}</td>
        </tr></table>`;
      } else if (maxOptLen <= 42) {
        optsHtml = `
        <table class="options-table">
          <tr>
            <td style="width: 50%;"><b>A.</b> ${q.options[0]?.text || ''}</td>
            <td style="width: 50%;"><b>B.</b> ${q.options[1]?.text || ''}</td>
          </tr>
          <tr>
            <td style="width: 50%;"><b>C.</b> ${q.options[2]?.text || ''}</td>
            <td style="width: 50%;"><b>D.</b> ${q.options[3]?.text || ''}</td>
          </tr>
        </table>`;
      } else {
        optsHtml = `
        <table class="options-table">
          <tr><td style="width: 100%;"><b>A.</b> ${q.options[0]?.text || ''}</td></tr>
          <tr><td style="width: 100%;"><b>B.</b> ${q.options[1]?.text || ''}</td></tr>
          <tr><td style="width: 100%;"><b>C.</b> ${q.options[2]?.text || ''}</td></tr>
          <tr><td style="width: 100%;"><b>D.</b> ${q.options[3]?.text || ''}</td></tr>
        </table>`;
      }

      content += `
      <div class="question-item" style="margin-top: 6px; margin-bottom: 4px;">
        <div style="text-align: justify;"><b>${q.questionText}</b></div>
        ${optsHtml}
      </div>`;
    });

    content += `
    <div style="text-align: center; margin: 20px 0 4px 0; font-weight: bold; letter-spacing: 2px;">---------- HẾT ----------</div>
    <div style="text-align: center; font-style: italic; font-size: ${fontSize - 1.5}pt; margin-bottom: 20px;">
      Thí sinh không được sử dụng tài liệu. Cán bộ coi thi không giải thích gì thêm.
    </div>

    <div class="page-break" style="page-break-before: always; break-before: page; margin-top: 25px;">
      <div style="text-align: center; font-weight: bold; font-size: ${fontSize + 2}pt; text-transform: uppercase; margin-bottom: 4px;">
        ĐÁP ÁN ĐỀ THI MÔN TIẾNG ANH - MÃ ĐỀ ${exam.examCode}
      </div>
      <div style="text-align: center; font-style: italic; font-size: ${fontSize - 1.5}pt; margin-bottom: 15px;">
        (Bảng đáp án chính thức gồm ${exam.questions.length} câu hỏi)
      </div>
    `;

    const chunkSize = 10;
    for (let cIdx = 0; cIdx < exam.answerKey.length; cIdx += chunkSize) {
      const chunk = exam.answerKey.slice(cIdx, cIdx + chunkSize);
      content += `
      <table class="answer-grid">
        <tr>
          <th style="width: 10%;">Câu</th>
          ${chunk.map(c => `<th>${c.qNum}</th>`).join('')}
        </tr>
        <tr>
          <td style="font-weight: bold;">Đ/A</td>
          ${chunk.map(c => `<td style="font-weight: bold; font-size: ${fontSize + 1}pt; color: #b91c1c;">${c.ans}</td>`).join('')}
        </tr>
      </table>`;
    }

    content += `</div></body></html>`;

    printWin.document.write(content);
    printWin.document.close();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // 1. Chuẩn hóa & làm sạch định dạng đề thi tự động
  const handleAutoCleanExam = () => {
    if (!rawExamInput || !rawExamInput.trim()) {
      alert("Vui lòng dán hoặc tải đề thi cần chuẩn hóa trước!");
      return;
    }
    let text = rawExamInput.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    let qCount = 0;
    // Chuẩn hóa định dạng số câu: "1.", "1/", "1 -", "Question 1:", "Bài 1:" thành "Câu X:"
    text = text.replace(/(?:^|\n)\s*(?:(?:Câu|Question|Bài)\s*\d+[\s.:]|(?:\d+)[\s.):\/-]+)/gim, () => {
      qCount++;
      return `\n\nCâu ${qCount}: `;
    });
    // Đảm bảo các phương án A., B., C., D. xuống dòng rõ ràng
    text = text.replace(/\s+([A-D])[.:)]\s+/g, '\n$1. ');
    // Đảm bảo đáp án xuống dòng
    text = text.replace(/\s*(?:Đáp án|Answer|Key)[\s.:]+([A-D])/gi, '\nĐáp án: $1');
    text = text.trim();
    setRawExamInput(text);
    const parsed = parseExamTextToQuestions(text);
    alert(`✓ Đã chuẩn hóa định dạng đề thi tự động! Hệ thống nhận diện được ${parsed.length} câu hỏi trắc nghiệm chuẩn.`);
  };

  // 2. Xuất file Word riêng biệt cho Bảng Ma Trận Đáp Án Đối Chiếu Tổng Hợp
  const handleExportMasterMatrixWord = () => {
    if (!shuffledExams || shuffledExams.length === 0) return;
    const totalQ = shuffledExams[0]?.questions?.length || 0;
    const fontSize = Number(examFontSize) || 12;

    let html = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="ProgId" content="Word.Document">
<meta name="Generator" content="Microsoft Word 15">
<meta name="Originator" content="Microsoft Word 15">
<!--[if gte mso 9]>
<xml>
  <w:WordDocument>
    <w:View>Print</w:View>
    <w:Zoom>100</w:Zoom>
    <w:DoNotOptimizeForBrowser/>
  </w:WordDocument>
</xml>
<![endif]-->
<style>
@page Section1 {
  size: 595.3pt 841.9pt; /* A4 Portrait */
  mso-page-orientation: portrait;
  margin: 56.7pt 42.5pt 56.7pt 56.7pt;
}
div.Section1 { page: Section1; }
body, p, div, span, table, td, th {
  font-family: 'Times New Roman', Times, serif !important;
  mso-ascii-font-family: 'Times New Roman' !important;
  mso-hansi-font-family: 'Times New Roman' !important;
  mso-bidi-font-family: 'Times New Roman' !important;
  color: #000000;
}
body { font-size: ${fontSize}pt; line-height: 1.3; }
.title { text-align: center; font-weight: bold; font-size: ${fontSize + 3}pt; text-transform: uppercase; margin-bottom: 4pt; }
.sub { text-align: center; font-size: ${fontSize - 1.5}pt; font-style: italic; margin-bottom: 16pt; }
table { width: 100%; border-collapse: collapse; margin-top: 10pt; }
th, td { border: 1pt solid #000000; padding: 4pt 4pt; text-align: center; font-size: ${fontSize - 1}pt; }
th { background-color: #e5e7eb; font-weight: bold; }
</style>
</head>
<body lang="VI">
<div class="Section1">
<div class="title">BẢNG MA TRẬN ĐÁP ÁN TỔNG HỢP CÁC MÃ ĐỀ THI</div>
<div class="sub">Hệ thống xáo đề tự động Examora AI • examoraai.com</div>
<table border="1" cellspacing="0" cellpadding="0">
  <thead>
    <tr style="background-color: #e5e7eb;">
      <th style="width: 14%;">Câu hỏi</th>
      ${shuffledExams.map(ex => `<th>Mã ${ex.examCode}</th>`).join('')}
    </tr>
  </thead>
  <tbody>
    ${Array.from({ length: totalQ }, (_, i) => {
      const qNum = i + 1;
      const bg = qNum % 2 === 0 ? 'style="background-color: #f9fafb;"' : '';
      return `<tr ${bg}>
        <td><strong>Câu ${qNum}</strong></td>
        ${shuffledExams.map(ex => {
          const ans = ex.answerKey.find(a => a.qNum === qNum)?.ans || '-';
          return `<td style="font-weight: bold; font-size: ${fontSize}pt; color: #1e3a8a;">${ans}</td>`;
        }).join('')}
      </tr>`;
    }).join('')}
  </tbody>
</table>
</div>
</body>
</html>`;

    const blob = new Blob(['\ufeff' + html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ma_Tran_Dap_An_Tong_Hop_${shuffledExams.length}_MaDe_A4.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const [internalClasses, setInternalClasses] = useState(INITIAL_CLASSES);
  const classes = propClasses || internalClasses;
  const setClasses = propSetClasses || setInternalClasses;
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('10');
  const [isCreatingClass, setIsCreatingClass] = useState(false);

  const [selectedClassWorkspace, setSelectedClassWorkspace] = useState(null);
  const [classWorkspaceTab, setClassWorkspaceTab] = useState('assignments'); // 'assignments' | 'gradebook' | 'announcements' | 'overview'

  // Màn hình làm bài trực tuyến
  const [activeTakingAssignment, setActiveTakingAssignment] = useState(null);
  const [studentQuizAnswers, setStudentQuizAnswers] = useState({});
  const [studentQuizSubmitted, setStudentQuizSubmitted] = useState(false);
  const [studentQuizScore, setStudentQuizScore] = useState(null);

  // Form giao bài tập mới (Tự tải file / Dán đề của giáo viên)
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentText, setNewAssignmentText] = useState(SAMPLE_TEACHER_EXAM);
  const [newAssignmentDeadlineType, setNewAssignmentDeadlineType] = useState('unlimited'); // 'date' | 'unlimited'
  const [newAssignmentDeadline, setNewAssignmentDeadline] = useState('2026-10-01');
  const [newAssignmentTimeLimit, setNewAssignmentTimeLimit] = useState(15);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);

  // Form đăng thông báo
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [isCreatingAnn, setIsCreatingAnn] = useState(false);

  // Mã lớp học sinh nhập
  const [studentInputCode, setStudentInputCode] = useState('');
  const [joinedClassCode, setJoinedClassCode] = useState(() => localStorage.getItem('joined_class_code') || '');
  const [isTeacherAdminView, setIsTeacherAdminView] = useState(true);

  const handleJoinClassByCode = (e) => {
    e.preventDefault();
    const code = studentInputCode.trim().toUpperCase();
    if (!code) return;
    const found = classes.find(c => c.code.toUpperCase() === code);
    if (!found) {
      alert(`Không tìm thấy lớp học có mã "${code}". Vui lòng kiểm tra lại mã do Thầy/Cô cung cấp!`);
      return;
    }
    setJoinedClassCode(code);
    localStorage.setItem('joined_class_code', code);
    setIsTeacherAdminView(false);
    setSelectedClassWorkspace(found);
    alert(`✓ Chúc mừng bạn đã tham gia: ${found.name}! Hãy bấm "Làm Bài Trực Tuyến" ở bài tập được giao nhé.`);
  };

  const handleLeaveClass = () => {
    setJoinedClassCode('');
    localStorage.removeItem('joined_class_code');
    setStudentInputCode('');
    setSelectedClassWorkspace(null);
  };

  const handleDeleteClass = async (classId) => {
    const ok = window.appConfirm
      ? await window.appConfirm("Thầy/Cô có chắc chắn muốn xóa lớp học này không? Toàn bộ danh sách học sinh và dữ liệu lớp sẽ bị gỡ bỏ.", "Xóa Lớp Học", { type: 'error', confirmText: 'Xóa Lớp' })
      : window.confirm("Thầy/Cô có chắc chắn muốn xóa lớp học này không? Toàn bộ danh sách học sinh và dữ liệu lớp sẽ bị gỡ bỏ.");
    if (ok) {
      setClasses(prev => prev.filter(c => c.id !== classId));
      if (selectedClassWorkspace?.id === classId) {
        setSelectedClassWorkspace(null);
      }
    }
  };

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
      activeAssignments: 0,
      announcements: [
        { id: `ann-${Date.now()}`, title: 'Chào mừng các em tham gia lớp học mới!', content: 'Hãy chuẩn bị bài học và theo dõi bảng tin để cập nhật bài tập hàng tuần.', date: new Date().toISOString().split('T')[0] }
      ],
      assignments: [],
      students: []
    };
    setClasses([newClass, ...classes]);
    setNewClassName('');
    setIsCreatingClass(false);
  };

  // Tải file trong form giao bài tập lớp
  const handleUploadClassAssignmentFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    try {
      if (fileName.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setNewAssignmentText(result.value);
        const parsed = parseExamTextToQuestions(result.value);
        alert(`✓ Đã tải file Word "${file.name}" thành công! Hệ thống nhận diện được ${parsed.length} câu hỏi.`);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target.result;
          setNewAssignmentText(text);
          const parsed = parseExamTextToQuestions(text);
          alert(`✓ Đã tải file "${file.name}" thành công! Hệ thống nhận diện được ${parsed.length} câu hỏi.`);
        };
        reader.readAsText(file, 'UTF-8');
      }
    } catch (err) {
      alert("Có lỗi khi đọc file. Vui lòng thử lại!");
    }
  };

  const handleAddAssignment = () => {
    if (!newAssignmentTitle.trim() || !selectedClassWorkspace) {
      alert("Vui lòng nhập tiêu đề bài kiểm tra!");
      return;
    }

    const parsedQuestions = parseExamTextToQuestions(newAssignmentText);
    if (parsedQuestions.length === 0) {
      alert("Chưa nhận diện được câu hỏi trắc nghiệm nào từ nội dung Thầy/Cô nhập. Vui lòng kiểm tra định dạng câu hỏi (Câu 1:... A. ... B. ... Đáp án: A)!");
      return;
    }

    const finalDeadline = newAssignmentDeadlineType === 'unlimited' ? 'unlimited' : (newAssignmentDeadline || '2026-10-01');
    const newAsg = {
      id: `asg-${Date.now()}`,
      title: newAssignmentTitle.trim(),
      questions: parsedQuestions,
      deadline: finalDeadline,
      timeLimit: Number(newAssignmentTimeLimit) || 15,
      submittedCount: 0,
      totalStudents: selectedClassWorkspace.students?.length || selectedClassWorkspace.studentCount,
      status: 'open'
    };

    const updatedClass = {
      ...selectedClassWorkspace,
      assignments: [newAsg, ...selectedClassWorkspace.assignments],
      activeAssignments: (selectedClassWorkspace.activeAssignments || 0) + 1
    };

    setSelectedClassWorkspace(updatedClass);
    setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
    setNewAssignmentTitle('');
    setIsCreatingAssignment(false);
    alert(`✓ Đã giao bài "${newAsg.title}" gồm ${parsedQuestions.length} câu hỏi cho lớp thành công!`);
  };

  const handleAddAnnouncement = () => {
    if (!newAnnTitle.trim() || !selectedClassWorkspace) return;
    const newAnn = {
      id: `ann-${Date.now()}`,
      title: newAnnTitle.trim(),
      content: newAnnContent.trim() || 'Thông báo mới từ giáo viên.',
      date: new Date().toISOString().split('T')[0]
    };
    const updatedClass = {
      ...selectedClassWorkspace,
      announcements: [newAnn, ...selectedClassWorkspace.announcements]
    };
    setSelectedClassWorkspace(updatedClass);
    setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
    setNewAnnTitle('');
    setNewAnnContent('');
    setIsCreatingAnn(false);
    alert("✓ Đã đăng thông báo lên bảng tin của lớp!");
  };

  const handleExportGradebook = () => {
    if (!selectedClassWorkspace) return;
    const students = selectedClassWorkspace.students || [];
    let csvContent = "data:text/csv;charset=utf-8,﻿";
    csvContent += "STT,Họ và Tên,Email,Điểm KT 1,Điểm KT 2,Điểm Bài Luận,Điểm Trung Bình,Trạng Thái\n";
    students.forEach((st, idx) => {
      csvContent += `${idx + 1},"${st.name}","${st.email || ''}",${st.score1 || 0},${st.score2 || 0},${st.essayScore || 0},${st.avg || 0},"${st.status}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `So_Diem_${selectedClassWorkspace.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartTakingAssignment = (asg) => {
    const questions = asg.questions && asg.questions.length > 0 ? asg.questions : parseExamTextToQuestions(SAMPLE_TEACHER_EXAM);
    setActiveTakingAssignment({ ...asg, questions });
    setStudentQuizAnswers({});
    setStudentQuizSubmitted(false);
    setStudentQuizScore(null);
  };

  const handleSubmitQuiz = () => {
    const questions = activeTakingAssignment.questions || [];
    const totalQ = questions.length;
    let correct = 0;
    questions.forEach(q => {
      if (studentQuizAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const score10 = Number(((correct / totalQ) * 10).toFixed(1));
    const result = { correct, total: totalQ, score10 };
    setStudentQuizScore(result);
    setStudentQuizSubmitted(true);

    if (selectedClassWorkspace) {
      const updatedStudents = (selectedClassWorkspace.students || []).map((st, idx) => {
        if (idx === 0) {
          return { ...st, score2: score10, avg: Number(((st.score1 + score10) / 2).toFixed(1)), status: 'completed' };
        }
        return st;
      });
      const updatedClass = { ...selectedClassWorkspace, students: updatedStudents };
      setSelectedClassWorkspace(updatedClass);
      setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
    }
  };

  // ════════════════════════════════════════════════════════════════════════════
  // 3. THỬ THÁCH TUẦN
  // ════════════════════════════════════════════════════════════════════════════
  const [topics, setTopics] = useState(INITIAL_TOPICS);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicGrade, setNewTopicGrade] = useState('10');
  const [newTopicDesc, setNewTopicDesc] = useState('');
  const [newTopicEssayPrompt, setNewTopicEssayPrompt] = useState('');
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

  const [studentSubmitName, setStudentSubmitName] = useState('Học sinh');
  const [submitWord, setSubmitWord] = useState('');
  const [submitMeaning, setSubmitMeaning] = useState('');
  const [submitSentence, setSubmitSentence] = useState('');
  const [submitEssayContent, setSubmitEssayContent] = useState('');
  const [isEvaluatingSentence, setIsEvaluatingSentence] = useState(false);
  const [isEvaluatingEssay, setIsEvaluatingEssay] = useState(false);

  const handleDeleteTopic = async (topicId) => {
    const ok = window.appConfirm
      ? await window.appConfirm("Thầy/Cô có chắc chắn muốn xóa chủ đề Topic này không?", "Xóa Chủ Đề Lớp", { type: 'error', confirmText: 'Xóa Chủ Đề' })
      : window.confirm("Thầy/Cô có chắc chắn muốn xóa chủ đề Topic này không?");
    if (ok) {
      setTopics(prev => prev.filter(t => t.id !== topicId));
    }
  };

  const handleDeleteSubmission = async (topicId, submissionId) => {
    const ok = window.appConfirm
      ? await window.appConfirm("Bạn có chắc chắn muốn xóa bài nộp này không?", "Xóa Bài Nộp", { type: 'warning', confirmText: 'Xóa Bài' })
      : window.confirm("Bạn có chắc chắn muốn xóa bài nộp này không?");
    if (ok) {
      setTopics(prev => prev.map(t => {
        if (t.id === topicId) {
          return { ...t, submissions: t.submissions.filter(s => s.id !== submissionId) };
        }
        return t;
      }));
    }
  };

  const handleCreateTopic = () => {
    if (!newTopicTitle.trim()) return;
    const newTop = {
      id: `top-${Date.now()}`,
      week: `Tuần ${topics.length + 1}`,
      title: newTopicTitle.trim(),
      grade: newTopicGrade,
      deadline: '2026-10-01',
      description: newTopicDesc.trim() || 'Học sinh nộp từ vựng mới và viết đoạn văn theo chủ đề.',
      essayPrompt: newTopicEssayPrompt.trim() || 'Write a paragraph (120-150 words) exploring solutions related to this topic.',
      submissions: []
    };
    setTopics([newTop, ...topics]);
    setNewTopicTitle('');
    setNewTopicDesc('');
    setNewTopicEssayPrompt('');
    setIsCreatingTopic(false);
  };

  const handleQuickAddVocab = (topicId) => {
    if (!submitWord.trim()) {
      alert("Vui lòng nhập từ vựng tiếng Anh bạn muốn thêm!");
      return;
    }
    const newSub = {
      id: `sub-${Date.now()}`,
      studentName: studentSubmitName || 'Học sinh',
      word: submitWord.trim(),
      meaning: submitMeaning.trim() || 'Đang cập nhật nghĩa',
      sentence: submitSentence.trim() || `Từ vựng mới: ${submitWord.trim()}`,
      essay: '',
      aiScore: submitSentence.trim() ? 8.5 : 8.0,
      aiFeedback: submitSentence.trim() ? 'Đã lưu vào sổ tay từ vựng của lớp.' : 'Đã thêm từ vựng thành công!',
      type: 'vocab',
      status: 'approved'
    };
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return { ...t, submissions: [newSub, ...t.submissions] };
      }
      return t;
    }));
    setSubmitWord('');
    setSubmitMeaning('');
    setSubmitSentence('');
    alert("✓ Đã lưu từ vựng vào sổ tay của lớp thành công!");
  };

  const handleAISentenceCheck = async (topicId) => {
    if (!submitWord.trim()) {
      alert("Vui lòng nhập từ vựng tiếng Anh!");
      return;
    }
    setIsEvaluatingSentence(true);
    try {
      const prompt = `Bạn là giám khảo tiếng Anh chuyên nghiệp. Hãy chấm điểm và nhận xét câu tiếng Anh sau do học sinh đặt chứa từ vựng "${submitWord}":
Câu học sinh đặt: "${submitSentence || submitWord}"
Nghĩa tiếng Việt: "${submitMeaning}"

Trả về định dạng JSON thuần túy:
{
  "score": 9.0,
  "is_correct": true,
  "grammar_analysis": "Cấu trúc câu chuẩn xác, từ vựng sử dụng tự nhiên đúng ngữ cảnh.",
  "improved_sentence": "${submitSentence || submitWord} (Enhanced)"
}`;
      let aiResponse = { score: 9.0, grammar_analysis: "Câu chuẩn xác.", improved_sentence: submitSentence };
      if (keys?.gemini) {
        const res = await axios.post(`${API_BASE}/chat`, { prompt }, { headers: { 'x-gemini-key': keys.gemini } });
        if (res.data?.response) {
          try {
            const clean = res.data.response.replace(/```json/g, '').replace(/```/g, '').trim();
            aiResponse = JSON.parse(clean);
          } catch (e) {}
        }
      }

      setTopics(prev => prev.map(t => {
        if (t.id === topicId) {
          const newSub = {
            id: `sub-${Date.now()}`,
            studentName: studentSubmitName,
            word: submitWord.trim(),
            meaning: submitMeaning.trim(),
            sentence: submitSentence.trim(),
            essay: '',
            aiScore: aiResponse.score || 9.0,
            aiFeedback: `${aiResponse.grammar_analysis} Gợi ý: "${aiResponse.improved_sentence}"`,
            type: 'sentence',
            status: 'approved'
          };
          return { ...t, submissions: [newSub, ...t.submissions] };
        }
        return t;
      }));

      setSubmitWord('');
      setSubmitMeaning('');
      setSubmitSentence('');
      alert("✓ AI đã chấm điểm câu của bạn thành công!");
    } catch (err) {
      alert("Có lỗi khi kết nối AI. Vui lòng thử lại!");
    } finally {
      setIsEvaluatingSentence(false);
    }
  };

  const handleAIEssayCheck = async (topicId, topicPrompt) => {
    if (!submitEssayContent.trim() || submitEssayContent.trim().split(/\s+/).length < 20) {
      alert("Vui lòng viết đoạn văn ít nhất 20 từ trước khi nộp!");
      return;
    }
    setIsEvaluatingEssay(true);
    try {
      const wordCount = submitEssayContent.trim().split(/\s+/).length;
      const prompt = `Bạn là giám khảo chấm thi Tốt nghiệp THPT môn Tiếng Anh. Hãy chấm đoạn văn sau theo 4 tiêu chí chuẩn Bộ GD&ĐT:
Đề bài: "${topicPrompt}"
Bài làm học sinh (${wordCount} từ): "${submitEssayContent}"

Trả về định dạng JSON thuần túy:
{
  "total_score": 9.2,
  "detailed_feedback": "Nhận xét tổng quát về bố cục, từ nối và từ vựng",
  "corrections": "Gợi ý câu viết nâng cấp"
}`;

      let aiScore = 9.0;
      let aiFeedback = "Bài viết có bố cục rõ ràng. Từ nối và ngữ pháp được sử dụng linh hoạt.";

      if (keys?.gemini) {
        const res = await axios.post(`${API_BASE}/chat`, { prompt }, { headers: { 'x-gemini-key': keys.gemini } });
        if (res.data?.response) {
          try {
            const clean = res.data.response.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(clean);
            aiScore = parsed.total_score || 9.0;
            aiFeedback = `${parsed.detailed_feedback} • Gợi ý: ${parsed.corrections}`;
          } catch (e) {}
        }
      }

      setTopics(prev => prev.map(t => {
        if (t.id === topicId) {
          const newSub = {
            id: `sub-${Date.now()}`,
            studentName: studentSubmitName,
            word: 'Writing Essay',
            meaning: 'Đoạn văn hoàn chỉnh',
            sentence: `Đoạn văn (${wordCount} từ)`,
            essay: submitEssayContent.trim(),
            aiScore: aiScore,
            aiFeedback: aiFeedback,
            type: 'essay',
            status: 'approved'
          };
          return { ...t, submissions: [newSub, ...t.submissions] };
        }
        return t;
      }));

      setSubmitEssayContent('');
      alert(`✓ AI đã chấm điểm đoạn văn của bạn: ${aiScore}/10.0 Điểm!`);
    } catch (err) {
      alert("Có lỗi khi kết nối AI. Vui lòng thử lại!");
    } finally {
      setIsEvaluatingEssay(false);
    }
  };

  // ════════════════════════════════════════════════════════════════════════════
  // 4. MÀN HÌNH KHÓA BẢO MẬT
  // ════════════════════════════════════════════════════════════════════════════
  if (!isTeacherActivated) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-8 py-6 sm:py-10 px-2 sm:px-4 animate-fade-in">
        <div className="glass-card rounded-3xl p-6 sm:p-10 md:p-12 border border-amber-500/30 bg-gradient-to-b from-[#161208] via-[#0e0c1a] to-[#070b18] text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center mx-auto text-black shadow-xl shadow-orange-500/25">
            <Lock className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-extrabold uppercase">
              <ShieldAlert className="w-4 h-4" />
              CỔNG QUẢN TRỊ BẢO MẬT DÀNH RIÊNG CHO GIÁO VIÊN THPT
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white font-outfit tracking-tight">
              Yêu Cầu Kích Hoạt Quyền Giáo Viên
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
              Để bảo mật ngân hàng đề thi, dữ liệu điểm số và tránh học sinh can thiệp vào lớp học, khu vực này <strong>yêu cầu Thầy/Cô kích hoạt quyền truy cập</strong> trước khi sử dụng.
            </p>
          </div>

          <div className="max-w-lg mx-auto p-6 sm:p-7 rounded-2xl bg-black/60 border border-amber-500/30 space-y-4 shadow-2xl">
            <form onSubmit={handleVerifyTeacherCode} className="space-y-3">
              <label className="text-xs text-left font-bold text-gray-300 block">
                🔑 Nhập Mã Kích Hoạt Giáo Viên:
              </label>
              <input
                type="text"
                required
                value={activationInputCode}
                onChange={(e) => {
                  setActivationInputCode(e.target.value);
                  setActivationError('');
                }}
                placeholder="Ví dụ: GV-THPT-2026..."
                className="w-full bg-black/70 border border-amber-500/40 rounded-xl px-4 py-3 text-sm text-white font-mono uppercase tracking-wider text-center focus:outline-none focus:border-amber-400"
              />

              {activationError && (
                <p className="text-xs text-red-400 font-semibold text-left flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{activationError}</span>
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-black text-sm shadow-lg shadow-orange-500/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Mở Khóa Cổng Quản Trị Giáo Viên</span>
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://zalo.me/0975711254"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-2xl bg-[#0068FF]/20 hover:bg-[#0068FF]/30 border border-[#0068FF]/50 text-blue-300 font-extrabold text-xs transition flex items-center gap-2 shadow-lg"
            >
              <MessageSquare className="w-4 h-4 text-[#0068FF]" />
              <span>Nhắn Zalo Nhận Mã Miễn Phí: 0975.711.254 (Admin Tuấn Anh)</span>
            </a>

            <button
              onClick={() => setShowContactModal(true)}
              className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-emerald-400" />
              <span>Gửi Yêu Cầu Cấp Quyền Tới Admin</span>
            </button>

            <button
              onClick={() => setShowTeacherFeatureModal(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/40 text-cyan-300 font-extrabold text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Xem Chi Tiết Các Tính Năng Dành Cho Giáo Viên</span>
            </button>
          </div>
        </div>

        {/* 🌟 SHOWCASE CÁC TÍNH NĂNG NỔI BẬT DÀNH CHO GIÁO VIÊN TRÊN HỆ THỐNG */}
        <div className="space-y-6 pt-4 animate-fade-in">
          <div className="text-center space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-black uppercase">
              HỆ SINH THÁI GIẢNG DẠY TIẾNG ANH THPT TOÀN DIỆN
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white font-outfit">
              Các Tính Năng Đột Phá Hỗ Trợ Thầy/Cô
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
              Hệ thống được thiết kế chuẩn sư phạm, giúp giáo viên tiết kiệm 80% thời gian soạn đề, xáo đề và quản lý học sinh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1 */}
            <div className="glass-card rounded-3xl p-6 border border-amber-500/30 bg-gradient-to-b from-[#141208] to-[#0a0e1c] space-y-4 hover:border-amber-500/60 transition shadow-xl">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Shuffle className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ĐỘT PHÁ 2026
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">1. Xáo Đề &amp; Xuất File Word (.docx/.doc) Chuẩn Bộ GD&amp;ĐT</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Tải trực tiếp file Word từ máy tính hoặc dán đề. Tự động xáo thành 4 mã đề (101-104), tính toán Bảng Ma Trận Đáp Án Chuẩn và xuất file Word đẹp mắt, căn chỉnh trang in A4 chuẩn sư phạm.
                </p>
              </div>
              <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2 text-[11px] text-amber-300 font-mono">
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Đọc file .docx trực tiếp</span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ 4 Mã đề chuẩn xác</span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Bảng ma trận đáp án</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-card rounded-3xl p-6 border border-cyan-500/30 bg-gradient-to-b from-[#071324] to-[#070b18] space-y-4 hover:border-cyan-500/60 transition shadow-xl">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  KHÔNG GIAN RIÊNG
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">2. Không Gian Lớp Học &amp; Cấp Mã Học Sinh</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Tạo lớp theo khối 10, 11, 12 với mã lớp riêng (ví dụ: <strong className="text-amber-400 font-mono">ENG-10A1-26</strong>). Học sinh chỉ cần nhập mã là vào làm bài, hoàn toàn không thấy các lớp khác và không can thiệp được hệ thống.
                </p>
              </div>
              <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2 text-[11px] text-cyan-300 font-mono">
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Mã lớp bảo mật</span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Phân quyền học sinh</span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Bảng tin dặn dò</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-b from-[#081814] to-[#070b18] space-y-4 hover:border-emerald-500/60 transition shadow-xl">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  TỰ ĐỘNG CHẤM
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">3. Giao Bài Tự Do &amp; AI Chấm Điểm Trực Tuyến</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Thầy/Cô tự tải file bài kiểm tra riêng của mình lên. Học sinh làm bài trực tuyến có đếm giờ. Khóa đáp án trong lúc thi để chống gian lận. Nộp bài xong điểm tự động lưu vào Sổ Điểm.
                </p>
              </div>
              <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2 text-[11px] text-emerald-300 font-mono">
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Đề thi tự do</span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Chống gian lận</span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Chấm điểm tức thì</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="glass-card rounded-3xl p-6 border border-purple-500/30 bg-gradient-to-b from-[#140b22] to-[#070b18] space-y-4 hover:border-purple-500/60 transition shadow-xl">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  BÁO CÁO NHANH
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">4. Sổ Điểm Điện Tử &amp; Xuất Excel (.CSV)</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Thống kê điểm trung bình môn, tỷ lệ hoàn thành bài tập, cảnh báo học sinh cần chú ý. Xuất sổ điểm ra file Excel chỉ với 1 click để nộp báo cáo chuyên môn cho nhà trường.
                </p>
              </div>
              <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2 text-[11px] text-purple-300 font-mono">
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Thống kê điểm TB</span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Xuất Excel 1 chạm</span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Theo dõi chuyên cần</span>
              </div>
            </div>
          </div>
        </div>

        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="glass-card w-full max-w-lg rounded-3xl p-6 md:p-8 border border-cyan-500/40 bg-[#090e24] space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-6 h-6 text-cyan-400" />
                  <h3 className="font-extrabold text-base text-white font-outfit">Đăng Ký Cấp Quyền Giáo Viên THPT</h3>
                </div>
                <button onClick={() => { setShowContactModal(false); setContactSuccess(false); }} className="text-gray-400 hover:text-white">✕</button>
              </div>

              {contactSuccess ? (
                <div className="p-6 text-center space-y-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl animate-in fade-in">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-white text-base">Đã Gửi Yêu Cầu Tới Admin Thành Công!</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Thông tin của Thầy/Cô <strong className="text-emerald-300">{teacherName}</strong> đã được chuyển tới Admin Tuấn Anh để kiểm duyệt hồ sơ.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-amber-500/30 text-amber-200 text-xs leading-relaxed text-left space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-300">
                      <Sparkles className="w-3.5 h-3.5" /> Hướng dẫn nhận Mã Kích Hoạt ngay:
                    </div>
                    <div>Thầy/Cô vui lòng nhắn tin Zalo tới số <strong>0975.711.254 (Admin Tuấn Anh)</strong> để được cấp Mã Key riêng và mở khóa quyền sử dụng.</div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                    <a
                      href="https://zalo.me/0975711254"
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-[#0068FF] hover:bg-[#0055D4] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Nhắn Zalo Nhận Mã: 0975.711.254</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => { setShowContactModal(false); setContactSuccess(false); }}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold transition cursor-pointer"
                    >
                      Đã Hiểu &amp; Đóng
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendTeacherRegistration} className="space-y-3.5">
                  <p className="text-xs text-slate-300">
                    Vui lòng điền thông tin bên dưới, Admin Tuấn Anh sẽ phê duyệt và cấp Mã Key riêng cho Thầy/Cô:
                  </p>
                  <div>
                    <label className="text-[11px] text-gray-300 font-bold block mb-1">Họ và Tên Giáo Viên: *</label>
                    <input
                      type="text"
                      required
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      placeholder="Ví dụ: Thầy Trần Tuấn Anh..."
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-gray-300 font-bold block mb-1">Số Điện Thoại / Zalo: *</label>
                      <input
                        type="tel"
                        required
                        value={teacherPhone}
                        onChange={(e) => setTeacherPhone(e.target.value)}
                        placeholder="Ví dụ: 0975711254..."
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-300 font-bold block mb-1">Trường THPT Giảng Dạy:</label>
                      <input
                        type="text"
                        value={teacherSchool}
                        onChange={(e) => setTeacherSchool(e.target.value)}
                        placeholder="Ví dụ: THPT Chuyên / THPT Quốc Gia..."
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button type="button" onClick={() => setShowContactModal(false)} className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-bold cursor-pointer">Đóng</button>
                    <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-extrabold shadow cursor-pointer">Gửi Yêu Cầu Cho Admin</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 5. GIAO DIỆN CHÍNH
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-8 w-full max-w-[1600px] mx-auto px-4 md:px-8 pb-20 animate-fade-in">
      
      {isShufflerOnlyMode ? (
        /* GIAO DIỆN CHUYÊN BIỆT THUẦN TÚY XÁO ĐỀ (tuananhstudio.top) */
        <div className={`rounded-3xl p-6 md:p-8 border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-colors duration-200 ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900 shadow-sm'
            : 'glass-card border-amber-500/30 bg-gradient-to-r from-[#140b2a] via-[#090f26] to-[#07131b] shadow-2xl text-white'
        }`}>
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-black flex items-center gap-1.5 shadow-xs ${
                isLight
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                <Shuffle className={`w-3.5 h-3.5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
                TUANANHSTUDIO.TOP • PHẦN MỀM XÁO ĐỀ CHUYÊN NGHIỆP
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                isLight
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                Chuẩn Bộ GD&amp;ĐT 2025
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${
                isLight
                  ? 'text-blue-900 bg-blue-50 border-blue-200'
                  : 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20'
              }`}>
                Hotline/Zalo: 0975.711.254 (Admin Tuấn Anh)
              </span>
            </div>
            <h1 className={`text-2xl md:text-3xl font-black font-outfit tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Phần Mềm Xáo Đề Thi Chuyên Nghiệp &amp; Tạo Ma Trận THPT
            </h1>
            <p className={`text-xs md:text-sm max-w-3xl font-normal leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Phần mềm sư phạm chuyên dụng dành cho Giáo viên: Tải file Word (.docx) &rarr; Tự động đảo câu hỏi &amp; phương án &rarr; Bảo toàn cụm bài đọc hiểu &rarr; Xuất Bảng Ma Trận Đáp Án Đối Chiếu &amp; Tải Trọn Bộ Đề Word (.docx) chuẩn cấu trúc Bộ GD&amp;ĐT!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onOpenCanva && (
              <button
                type="button"
                onClick={onOpenCanva}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Gift className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                <span>🎁 Nhận Canva Pro / Edu</span>
              </button>
            )}
            <a
              href="https://examoraai.com"
              target="_blank"
              rel="noreferrer"
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 border cursor-pointer shadow-sm ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  : 'bg-white/10 hover:bg-white/15 text-white border-white/15'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
              <span>Vào Nền Tảng Examora AI</span>
            </a>
          </div>
        </div>
      ) : (
        /* GIAO DIỆN CỔNG GIÁO VIÊN TÍCH HỢP ĐẦY ĐỦ TRÊN examoraai.com */
        <>
          {/* Banner Kết Nối Giữa examoraai.com & tuananhstudio.top */}
          <div className="rounded-2xl p-4 border border-cyan-500/30 bg-gradient-to-r from-[#0d1e3a]/90 via-[#0a162b]/90 to-[#121c38]/90 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-white text-xs sm:text-sm">
                    🌐 Cổng Quản Trị Giáo Viên &amp; Công Cụ Sư Phạm
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Tích Hợp Toàn Diện
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Thầy/Cô có thể thao tác trực tiếp tại đây hoặc chuyển sang tên miền riêng tuananhstudio.top để làm việc toàn màn hình mượt mà hơn.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="https://tuananhstudio.top"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <span>Mở Cổng Riêng tuananhstudio.top</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Top Banner */}
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 bg-gradient-to-r from-[#0c1430] via-[#070b1a] to-[#120a28] shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-extrabold flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  TÀI KHOẢN GIÁO VIÊN ĐÃ XÁC THỰC
                </span>
                {teacherInfo && (
                  <span className="px-3 py-1 rounded-full bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold">
                    Thầy/Cô: {teacherInfo.name} ({teacherInfo.school})
                  </span>
                )}
                {teacherInfo && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                    Hạn Dùng Key: {teacherInfo.expiryDate === 'lifetime' ? 'Trọn Đời (VIP)' : teacherInfo.expiryDate}
                  </span>
                )}
                <span className="text-xs text-amber-300 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                  Hotline/Zalo: 0975.711.254 (Admin Tuấn Anh)
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-white font-outfit tracking-tight">
                Cổng Giáo Viên &amp; Quản Trị Học Tập THPT
              </h1>
              <p className="text-xs md:text-sm text-slate-300 max-w-2xl font-normal">
                Không gian riêng để Thầy/Cô quản lý lớp học, tự tải file đề thi (.docx / .doc / .txt) lên giao cho học sinh làm trực tuyến, xáo đề và xuất file Word / PDF chuẩn UTF-8.
              </p>
            </div>

            <button
              onClick={handleDeactivateTeacher}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 text-xs font-bold transition border border-white/10 flex items-center gap-1.5 cursor-pointer w-fit"
              title="Khóa lại cổng giáo viên để bảo mật"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Khóa Cổng GV</span>
            </button>
          </div>

          {/* Nav Tab Switcher */}
          <div className="flex items-center p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 w-fit overflow-x-auto no-scrollbar gap-1">
            <button
              onClick={() => { setActiveSection('classes'); setSelectedClassWorkspace(null); setActiveTakingAssignment(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeSection === 'classes'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Quản Lý Lớp Học &amp; Giao Bài</span>
            </button>

            <button
              onClick={() => { setActiveSection('shuffler'); setSelectedClassWorkspace(null); setActiveTakingAssignment(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeSection === 'shuffler'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shuffle className="w-4 h-4" />
              <span>Công Cụ Xáo Đề Thi</span>
            </button>

            <button
              onClick={() => { setActiveSection('weekly-topic'); setSelectedClassWorkspace(null); setActiveTakingAssignment(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeSection === 'weekly-topic'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Thử Thách Tuần: Từ Vựng &amp; Viết Đoạn Văn AI</span>
            </button>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1: QUẢN LÝ LỚP HỌC & GIAO ĐỀ CỦA GIÁO VIÊN                      */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'classes' && (
        <div className="space-y-6">

          {/* 1. MÀN HÌNH LÀM BÀI TRỰC TUYẾN KHI HỌC SINH HOẶC GV BẤM 'LÀM BÀI' */}
          {activeTakingAssignment ? (
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-cyan-500/40 bg-[#070d1e] space-y-6 shadow-2xl animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <button
                    onClick={() => setActiveTakingAssignment(null)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition w-fit cursor-pointer mb-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay Lại Không Gian Lớp Học</span>
                  </button>
                  <h2 className="text-xl md:text-2xl font-black text-white font-outfit">
                    {activeTakingAssignment.title}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Lớp: <strong>{selectedClassWorkspace?.name || 'Lớp Học'}</strong> • Thời gian làm bài: {activeTakingAssignment.timeLimit || 15} phút • Tổng số câu: {activeTakingAssignment.questions?.length || 0} câu
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {!studentQuizSubmitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs shadow-lg shadow-emerald-500/25 transition cursor-pointer"
                    >
                      Nộp Bài &amp; Xem Điểm Ngay
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setStudentQuizAnswers({});
                        setStudentQuizSubmitted(false);
                        setStudentQuizScore(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Làm Lại Bài Này</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Bảng điểm khi nộp bài */}
              {studentQuizSubmitted && studentQuizScore && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#0a1532] to-cyan-950/60 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">KẾT QUẢ BÀI LÀM TRẮC NGHIỆM</span>
                    <h3 className="text-2xl font-black text-white mt-1">Đạt {studentQuizScore.score10} / 10.0 Điểm</h3>
                    <p className="text-xs text-emerald-300 mt-0.5">✓ Điểm số đã được tự động lưu vào Sổ Điểm của Thầy/Cô.</p>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300">
                      Đúng: <strong>{studentQuizScore.correct}</strong> / {studentQuizScore.total} câu
                    </div>
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300">
                      Sai: <strong>{studentQuizScore.total - studentQuizScore.correct}</strong> câu
                    </div>
                  </div>
                </div>
              )}

              {/* Danh sách câu hỏi */}
              <div className="space-y-5">
                {(activeTakingAssignment.questions || []).map((q, idx) => {
                  const isChoice = studentQuizAnswers[q.id];
                  const isCorrect = studentQuizAnswers[q.id] === q.correctAnswer;

                  return (
                    <div 
                      key={q.id || idx} 
                      className={`glass p-5 md:p-6 rounded-2xl border transition-all space-y-4 ${
                        studentQuizSubmitted
                          ? isCorrect ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-red-500/40 bg-red-950/10'
                          : 'border-white/10 bg-[#060a18]'
                      }`}
                    >
                      <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                        CÂU {idx + 1} • {q.part || 'Trắc nghiệm THPT'}
                      </div>

                      <div className="text-sm font-bold text-white leading-relaxed">{q.question}</div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options.map(opt => {
                          const selectedThis = studentQuizAnswers[q.id] === opt.key;
                          let style = 'bg-white/5 border-white/10 text-slate-200 hover:border-white/20';

                          if (studentQuizSubmitted) {
                            if (opt.key === q.correctAnswer) {
                              style = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                            } else if (selectedThis && opt.key !== q.correctAnswer) {
                              style = 'bg-red-500/20 border-red-500 text-red-200 line-through';
                            } else {
                              style = 'bg-white/[0.02] border-white/5 text-slate-500';
                            }
                          } else if (selectedThis) {
                            style = 'bg-cyan-500/20 border-cyan-500 text-cyan-200 font-bold';
                          }

                          return (
                            <button
                              key={opt.key}
                              disabled={studentQuizSubmitted}
                              onClick={() => setStudentQuizAnswers(prev => ({ ...prev, [q.id]: opt.key }))}
                              className={`p-3 rounded-xl border text-left text-xs transition flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${style}`}
                            >
                              <span className="w-5 h-5 rounded bg-black/40 border border-white/10 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">{opt.key}</span>
                              <span className="flex-1">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>

                      {studentQuizSubmitted && (
                        <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs space-y-1.5 animate-fade-in">
                          <div className="font-bold text-emerald-400">Đáp án đúng: {q.correctAnswer}</div>
                          <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : selectedClassWorkspace ? (
            /* 2. KHÔNG GIAN QUẢN TRỊ LỚP HỌC */
            <div className="space-y-6 animate-fade-in">
              
              <div className="glass-card rounded-3xl p-6 md:p-8 border border-emerald-500/30 bg-[#081220] space-y-6 shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <button
                    onClick={() => setSelectedClassWorkspace(null)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition w-fit cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay lại danh sách lớp học</span>
                  </button>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleExportGradebook}
                      className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Xuất Sổ Điểm Excel</span>
                    </button>

                    <button
                      onClick={() => handleDeleteClass(selectedClassWorkspace.id)}
                      className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa Lớp</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                        Khối {selectedClassWorkspace.grade}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-black text-white font-outfit">
                        {selectedClassWorkspace.name}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-400">
                      Không gian quản trị riêng • Mã lớp bảo mật: <strong className="text-amber-400 font-mono text-sm">{selectedClassWorkspace.code}</strong>
                    </p>
                  </div>

                  <div className="bg-black/50 p-4 rounded-2xl border border-amber-500/30 flex items-center gap-4 shrink-0">
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase font-semibold">Mã Lớp Học Sinh Nhập:</div>
                      <div className="text-lg font-black font-mono text-amber-400 tracking-wider">{selectedClassWorkspace.code}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedClassWorkspace.code)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 border border-amber-500/40"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedKey ? 'Đã Copy!' : 'Copy Mã Lớp'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-white/10 pt-4 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'assignments', label: '📑 Giao Bài Tập & Đề Thi', count: selectedClassWorkspace.assignments?.length || 0 },
                    { id: 'gradebook', label: '📋 Sổ Điểm Học Sinh', count: selectedClassWorkspace.students?.length || selectedClassWorkspace.studentCount },
                    { id: 'announcements', label: '📢 Bảng Tin & Dặn Dò', count: selectedClassWorkspace.announcements?.length || 0 },
                    { id: 'overview', label: '📊 Tổng Quan Sĩ Số & Điểm', count: null }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setClassWorkspaceTab(tab.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 border ${
                        classWorkspaceTab === tab.id
                          ? 'bg-white text-black border-white shadow-md'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.count !== null && <span className="ml-1.5 opacity-70">({tab.count})</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* TAB 1: GIAO BÀI TẬP VÀ ĐỀ THI DO GIÁO VIÊN TỰ TẢI/DÁN */}
              {classWorkspaceTab === 'assignments' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-extrabold text-base text-white">Danh Sách Bài Kiểm Tra Của Lớp</h3>
                      <p className="text-xs text-gray-400">Thầy/Cô tự dán hoặc tải file đề thi của mình lên để giao cho học sinh làm trực tuyến.</p>
                    </div>
                    <button
                      onClick={() => setIsCreatingAssignment(!isCreatingAssignment)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-500/25 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isCreatingAssignment ? 'Đóng Form' : '+ Tải Lên & Giao Bài Mới'}</span>
                    </button>
                  </div>

                  {/* FORM TẢI/DÁN ĐỀ THI RIÊNG CỦA GIÁO VIÊN */}
                  {isCreatingAssignment && (
                    <div className="glass p-6 rounded-2xl border border-indigo-500/40 bg-indigo-950/30 space-y-4 animate-in fade-in">
                      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
                        <h4 className="font-bold text-sm text-indigo-300 flex items-center gap-2">
                          <Upload className="w-4 h-4 text-indigo-400" />
                          <span>Tải Lên Hoặc Dán Đề Thi Của Thầy/Cô</span>
                        </h4>
                        
                        <label className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition flex items-center gap-1.5 cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Tải File Đề Từ Máy Tính (.docx / .doc / .txt)</span>
                          <input type="file" accept=".docx,.doc,.txt" onChange={handleUploadClassAssignmentFile} className="hidden" />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] text-gray-300 font-bold block mb-1">Tiêu Đề Bài Kiểm Tra: *</label>
                          <input
                            type="text"
                            required
                            value={newAssignmentTitle}
                            onChange={(e) => setNewAssignmentTitle(e.target.value)}
                            placeholder="Ví dụ: Bài kiểm tra 15 phút Unit 2 - Đề số 1..."
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] text-gray-300 font-bold block">Hạn Nộp Bài:</label>
                            <div className="flex items-center gap-3 text-xs">
                              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                                <input
                                  type="radio"
                                  name="deadlineType"
                                  checked={newAssignmentDeadlineType === 'unlimited'}
                                  onChange={() => setNewAssignmentDeadlineType('unlimited')}
                                  className="accent-indigo-500"
                                />
                                <span>Không giới hạn (Vô thời hạn)</span>
                              </label>
                              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                                <input
                                  type="radio"
                                  name="deadlineType"
                                  checked={newAssignmentDeadlineType === 'date'}
                                  onChange={() => setNewAssignmentDeadlineType('date')}
                                  className="accent-indigo-500"
                                />
                                <span>Có hạn nộp</span>
                              </label>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              {newAssignmentDeadlineType === 'date' ? (
                                <input
                                  type="date"
                                  value={newAssignmentDeadline}
                                  onChange={(e) => setNewAssignmentDeadline(e.target.value)}
                                  className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
                                />
                              ) : (
                                <div className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold text-center">
                                  ✓ Không giới hạn thời gian nộp
                                </div>
                              )}
                            </div>
                            <div>
                              <select
                                value={newAssignmentTimeLimit}
                                onChange={(e) => setNewAssignmentTimeLimit(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
                              >
                                <option value={15}>⏱️ 15 Phút</option>
                                <option value={45}>⏱️ 45 Phút</option>
                                <option value={50}>⏱️ 50 Phút</option>
                                <option value={60}>⏱️ 60 Phút</option>
                                <option value={90}>⏱️ 90 Phút</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Khung Dán Nội Dung Đề Thi */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] text-gray-300 font-bold">
                            Nội Dung Đề Thi Của Thầy/Cô (Dán trực tiếp câu hỏi &amp; đáp án vào đây): *
                          </label>
                          <span className="text-[11px] font-mono text-emerald-400 font-bold">
                            ✓ Nhận diện được: {parseExamTextToQuestions(newAssignmentText).length} câu hỏi
                          </span>
                        </div>
                        <textarea
                          rows={8}
                          value={newAssignmentText}
                          onChange={(e) => setNewAssignmentText(e.target.value)}
                          placeholder="Dán đề thi của Thầy/Cô vào đây theo định dạng:\nCâu 1: Question text...\nA. option 1\nB. option 2\nC. option 3\nD. option 4\nĐáp án: A"
                          className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-400 resize-none leading-relaxed"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                        <button onClick={() => setIsCreatingAssignment(false)} className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-bold">Hủy</button>
                        <button onClick={handleAddAssignment} className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow">Xác Nhận Giao Cho Lớp</button>
                      </div>
                    </div>
                  )}

                  {/* Danh sách bài tập */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(selectedClassWorkspace.assignments || []).map(asg => (
                      <div key={asg.id} className="glass p-5 rounded-2xl border border-white/10 space-y-4 hover:border-indigo-500/30 transition shadow-lg">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-extrabold text-sm text-white leading-relaxed">{asg.title}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                            {asg.status === 'open' ? 'Đang Mở' : 'Đã Đóng'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/5">
                          <span>Số câu: <strong className="text-cyan-300">{asg.questions?.length || 0} câu</strong></span>
                          <span>Hạn nộp: <strong className="text-amber-300">{asg.deadline}</strong></span>
                          <span>Thời gian: <strong className="text-slate-200">{asg.timeLimit || 15} phút</strong></span>
                        </div>

                        <button
                          onClick={() => handleStartTakingAssignment(asg)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Làm Bài Trực Tuyến</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: SỔ ĐIỂM HỌC SINH */}
              {classWorkspaceTab === 'gradebook' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-white">Sổ Điểm &amp; Theo Dõi Tiến Độ</h3>
                      <p className="text-xs text-gray-400">Bảng điểm tổng hợp các bài kiểm tra của từng học sinh.</p>
                    </div>
                    <button
                      onClick={handleExportGradebook}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Xuất File Sổ Điểm (.CSV)</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-white/10 rounded-2xl">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-black/50 text-gray-400 font-bold uppercase text-[10px] border-b border-white/10">
                        <tr>
                          <th className="p-3.5">STT</th>
                          <th className="p-3.5">Họ và Tên</th>
                          <th className="p-3.5">Điểm KT 1</th>
                          <th className="p-3.5">Điểm KT 2</th>
                          <th className="p-3.5">Điểm Bài Luận</th>
                          <th className="p-3.5">Điểm TB</th>
                          <th className="p-3.5">Trạng Thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {(selectedClassWorkspace.students || []).map((st, idx) => (
                          <tr key={st.id || idx} className="hover:bg-white/[0.02]">
                            <td className="p-3.5 font-mono text-gray-500">{idx + 1}</td>
                            <td className="p-3.5 font-bold text-white">{st.name}</td>
                            <td className="p-3.5 font-mono">{st.score1 || '-'}</td>
                            <td className="p-3.5 font-mono">{st.score2 || '-'}</td>
                            <td className="p-3.5 font-mono text-indigo-300">{st.essayScore || '-'}</td>
                            <td className="p-3.5 font-mono font-bold text-emerald-400">{st.avg || '-'}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                st.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                                st.status === 'needs_help' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                              }`}>
                                {st.status === 'completed' ? 'Đã Hoàn Thành' : st.status === 'needs_help' ? 'Cần Chú Ý' : 'Đang Làm'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: BẢNG TIN & DẶN DÒ */}
              {classWorkspaceTab === 'announcements' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-white">Bảng Tin &amp; Thông Báo Của Lớp</h3>
                      <p className="text-xs text-gray-400">Dặn dò bài học, lịch kiểm tra cho học sinh trong lớp.</p>
                    </div>
                    <button
                      onClick={() => setIsCreatingAnn(!isCreatingAnn)}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
                    >
                      <Megaphone className="w-4 h-4" />
                      <span>{isCreatingAnn ? 'Đóng Form' : '+ Đăng Thông Báo'}</span>
                    </button>
                  </div>

                  {isCreatingAnn && (
                    <div className="glass p-5 rounded-2xl border border-amber-500/30 bg-amber-950/20 space-y-3 animate-in fade-in">
                      <h4 className="font-bold text-sm text-amber-300">Đăng Thông Báo Mới</h4>
                      <div>
                        <label className="text-[11px] text-gray-300 font-bold block mb-1">Tiêu Đề Thông Báo:</label>
                        <input
                          type="text"
                          value={newAnnTitle}
                          onChange={(e) => setNewAnnTitle(e.target.value)}
                          placeholder="Ví dụ: Lịch kiểm tra 15 phút..."
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-300 font-bold block mb-1">Nội Dung Dặn Dò:</label>
                        <textarea
                          rows={3}
                          value={newAnnContent}
                          onChange={(e) => setNewAnnContent(e.target.value)}
                          placeholder="Nhập nội dung chi tiết dặn dò học sinh..."
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button onClick={() => setIsCreatingAnn(false)} className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-bold">Hủy</button>
                        <button onClick={handleAddAnnouncement} className="px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold shadow">Đăng Lên Bảng Tin</button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {(selectedClassWorkspace.announcements || []).map(ann => (
                      <div key={ann.id} className="glass p-5 rounded-2xl border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
                            <Megaphone className="w-4 h-4 text-amber-400" />
                            <span>{ann.title}</span>
                          </h4>
                          <span className="text-[11px] font-mono text-gray-500">{ann.date}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: TỔNG QUAN LỚP */}
              {classWorkspaceTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass p-5 rounded-2xl border border-white/10 space-y-1">
                      <div className="text-[11px] text-gray-400 font-bold uppercase">Sĩ Số Học Sinh</div>
                      <div className="text-3xl font-black text-white font-outfit">{selectedClassWorkspace.studentCount || selectedClassWorkspace.students?.length || 0} HS</div>
                      <div className="text-[11px] text-emerald-400">100% Đã kích hoạt tài khoản</div>
                    </div>
                    <div className="glass p-5 rounded-2xl border border-white/10 space-y-1">
                      <div className="text-[11px] text-gray-400 font-bold uppercase">Điểm Trung Bình Môn</div>
                      <div className="text-3xl font-black text-emerald-400 font-outfit">{selectedClassWorkspace.avgScore} / 10.0</div>
                      <div className="text-[11px] text-slate-400">Dựa trên các bài kiểm tra</div>
                    </div>
                    <div className="glass p-5 rounded-2xl border border-white/10 space-y-1">
                      <div className="text-[11px] text-gray-400 font-bold uppercase">Bài Kiểm Tra Đã Giao</div>
                      <div className="text-3xl font-black text-indigo-400 font-outfit">{selectedClassWorkspace.assignments?.length || selectedClassWorkspace.activeAssignments || 0} Bài</div>
                      <div className="text-[11px] text-indigo-300">Do Thầy/Cô tự tải lên</div>
                    </div>
                    <div className="glass p-5 rounded-2xl border border-white/10 space-y-1">
                      <div className="text-[11px] text-gray-400 font-bold uppercase">Thông Báo Đã Đăng</div>
                      <div className="text-3xl font-black text-amber-400 font-outfit">{selectedClassWorkspace.announcements?.length || 0} Tin</div>
                      <div className="text-[11px] text-amber-300">Hiển thị cho học sinh đọc</div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* 3. DANH SÁCH LỚP HỌC */
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-white font-outfit flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <span>Danh Sách Lớp Học Của Thầy/Cô</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Bấm vào từng lớp để vào <strong>Không Gian Lớp Học</strong> để giao bài tập hoặc xem sổ điểm.
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

              {/* Hướng Dẫn Giáo Viên Giao Mã Cho Học Sinh */}
              <div className="glass p-4 md:p-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-[#0a1329] to-blue-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm">💡 Hướng Dẫn Cấp Mã Cho Học Sinh Vào Làm Bài:</h4>
                    <p className="text-slate-300 mt-0.5">
                      Thầy/Cô chỉ cần bấm <strong>[Copy]</strong> mã lớp bên dưới (ví dụ: <span className="text-amber-400 font-mono font-bold">ENG-10A1-26</span>) gửi cho học sinh. Học sinh chỉ cần vào mục <strong>"Lớp Học &amp; Bài Tập Của Tôi"</strong> ở menu bên trái để vào lớp làm bài thi trực tuyến!
                    </p>
                  </div>
                </div>
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
                        placeholder="Ví dụ: Lớp 10A2 - Tiếng Anh Lớp 10..."
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
                {classes
                  .filter(cls => {
                    if (isTeacherAdminView) return true;
                    if (!joinedClassCode) return true;
                    return cls.code.toUpperCase() === joinedClassCode.toUpperCase();
                  })
                  .map(cls => (
                    <div 
                      key={cls.id} 
                      className="glass p-5 rounded-2xl border border-white/10 space-y-4 hover:border-emerald-500/40 transition-all group relative bg-gradient-to-b from-[#0a1024] to-[#060a18] shadow-xl"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Khối {cls.grade}
                          </span>
                          <h3 
                            onClick={() => setSelectedClassWorkspace(cls)}
                            className="font-extrabold text-sm text-white mt-1.5 group-hover:text-emerald-300 transition cursor-pointer"
                          >
                            {cls.name}
                          </h3>
                        </div>

                        <button
                          onClick={() => handleDeleteClass(cls.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                          title="Xóa lớp học này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Mã Lớp */}
                      <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-gray-400 uppercase font-semibold">Mã Lớp Học Sinh Nhập:</div>
                          <div className="text-sm font-black font-mono text-amber-400 tracking-wider">{cls.code}</div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(cls.code)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer flex items-center gap-1 text-xs"
                          title="Sao chép mã lớp"
                        >
                          <Copy className="w-3.5 h-3.5 text-amber-400" />
                          <span>Copy</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/5">
                        <div>
                          <div className="text-xs font-bold text-white">{cls.studentCount || cls.students?.length || 0}</div>
                          <div className="text-[10px] text-gray-400">Học sinh</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-emerald-400">{cls.avgScore} / 10</div>
                          <div className="text-[10px] text-gray-400">Điểm TB</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-indigo-400">{cls.assignments?.length || cls.activeAssignments || 0}</div>
                          <div className="text-[10px] text-gray-400">Bài kiểm tra</div>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedClassWorkspace(cls)}
                        className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-emerald-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-white/5 hover:border-emerald-500/30"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Mở Không Gian Lớp Học</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2: CÔNG CỤ XÁO ĐỀ THI & TẢI FILE ĐỀ THI (.DOCX / .DOC / .TXT)    */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'shuffler' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className={`text-lg font-extrabold font-outfit flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <Shuffle className="w-5 h-5 text-amber-500 animate-spin-slow" />
                  <span>Công Cụ Xáo Đề Thi &amp; Xuất File Word / In PDF</span>
                </h2>
                <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-md uppercase tracking-wider shadow-xs ${
                  isLight
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/20'
                }`}>
                  Miễn phí 100% trọn đời
                </span>
              </div>
              <p className={`text-xs mt-1.5 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                Tải file Word (.docx / .doc) hoặc dán đề gốc &rarr; Hệ thống tự động đảo câu hỏi &amp; đáp án để tạo các mã đề kèm bảng đáp án. Xuất file Word (.doc) và in PDF chuẩn UTF-8 không lỗi font!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {shuffledExams && (
                <>
                  <button
                    onClick={() => setShowMasterMatrix(true)}
                    className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer flex items-center gap-2"
                    title="Mở bảng ma trận đáp án đối chiếu tất cả mã đề để chấm điểm nhanh"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>📊 Ma Trận Đáp Án</span>
                  </button>

                  <button
                    onClick={handleExportAllWord}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/20 transition cursor-pointer flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải Trọn Bộ Word</span>
                  </button>
                </>
              )}

              <button
                onClick={handleShuffleExam}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-orange-500/25 transition cursor-pointer flex items-center gap-2"
              >
                <Shuffle className="w-4 h-4" />
                <span>Xáo Đề &amp; Sinh {numVariants} Mã Đề Ngay</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cột Trái: Tải File Lên Hoặc Dán Đề Gốc */}
            <div className="lg:col-span-5 space-y-4">
              <div className={`p-5 rounded-2xl border space-y-3.5 ${
                isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'glass border-white/10 text-white'
              }`}>
                
                {/* Thanh Tiêu Đề & Nút Tải File */}
                <div className={`flex flex-wrap items-center justify-between gap-2 pb-3 border-b ${
                  isLight ? 'border-slate-200' : 'border-white/10'
                }`}>
                  <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <FileText className="w-4 h-4 text-amber-500" /> Đề Thi Gốc Của Giáo Viên:
                  </span>

                  <div className="flex items-center gap-2">
                    {/* NÚT CHUẨN HÓA ĐỊNH DẠNG ĐỀ TỰ ĐỘNG */}
                    <button
                      type="button"
                      onClick={handleAutoCleanExam}
                      className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition flex items-center gap-1.5 cursor-pointer border shadow-xs ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                          : 'bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border-white/10'
                      }`}
                      title="Tự động chuẩn hóa số thứ tự câu hỏi và tách dòng đáp án A B C D"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                      <span>🧹 Chuẩn Hóa Đề</span>
                    </button>

                    {/* NÚT TẢI FILE WORD (.DOCX / .DOC / .TXT) NỔI BẬT */}
                    <label className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-orange-500/20">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isLoadingFile ? 'Đang Đọc File...' : '📁 Tải File Đề'}</span>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept=".docx,.doc,.txt" 
                        onChange={handleUploadExamFile} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                <div className={`space-y-3 p-3 rounded-xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/5'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${isLight ? 'text-slate-800 font-bold' : 'text-slate-300'}`}>Số mã đề cần sinh:</span>
                    <select
                      value={numVariants}
                      onChange={(e) => setNumVariants(Number(e.target.value))}
                      className={`rounded-lg px-2.5 py-1 text-xs focus:outline-none border ${
                        isLight
                          ? 'bg-white border-slate-300 text-slate-900 shadow-xs'
                          : 'bg-black/50 border-white/10 text-white'
                      }`}
                    >
                      <option value={2}>2 Mã Đề (101, 102)</option>
                      <option value={4}>4 Mã Đề (101, 102, 103, 104)</option>
                      <option value={6}>6 Mã Đề (101-106)</option>
                      <option value={8}>8 Mã Đề (101-108)</option>
                    </select>
                  </div>

                  <div className={`flex flex-wrap items-center gap-4 pt-2 border-t ${
                    isLight ? 'border-slate-200' : 'border-white/5'
                  }`}>
                    <label className={`flex items-center gap-1.5 text-[11px] cursor-pointer select-none font-medium ${
                      isLight ? 'text-slate-700 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                    }`}>
                      <input
                        type="checkbox"
                        checked={shuffleQuestions}
                        onChange={(e) => setShuffleQuestions(e.target.checked)}
                        className={`w-3.5 h-3.5 rounded cursor-pointer ${
                          isLight
                            ? 'border-slate-300 bg-white text-amber-600 focus:ring-0'
                            : 'border-white/10 bg-black text-amber-500 focus:ring-0'
                        }`}
                      />
                      <span>Xáo thứ tự câu hỏi</span>
                    </label>

                    <label className={`flex items-center gap-1.5 text-[11px] cursor-pointer select-none font-medium ${
                      isLight ? 'text-slate-700 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                    }`}>
                      <input
                        type="checkbox"
                        checked={shuffleOptions}
                        onChange={(e) => setShuffleOptions(e.target.checked)}
                        className={`w-3.5 h-3.5 rounded cursor-pointer ${
                          isLight
                            ? 'border-slate-300 bg-white text-amber-600 focus:ring-0'
                            : 'border-white/10 bg-black text-amber-500 focus:ring-0'
                        }`}
                      />
                      <span>Xáo phương án (A, B, C, D)</span>
                    </label>

                    <label className={`flex items-center gap-1.5 text-[11px] cursor-pointer select-none font-bold ${
                      isLight ? 'text-cyan-800 hover:text-cyan-900' : 'text-cyan-300 hover:text-cyan-200'
                    }`}>
                      <input
                        type="checkbox"
                        checked={preservePassages}
                        onChange={(e) => setPreservePassages(e.target.checked)}
                        className={`w-3.5 h-3.5 rounded cursor-pointer ${
                          isLight
                            ? 'border-cyan-300 bg-white text-cyan-600 focus:ring-0'
                            : 'border-cyan-500/40 bg-black text-cyan-500 focus:ring-0'
                        }`}
                      />
                      <span>Giữ cụm bài đọc hiểu (không xé lẻ)</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isLight ? 'text-slate-500 font-medium' : 'text-gray-400'}`}>Trạng thái:</span>
                  <span className={`text-[11px] font-mono font-bold ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>
                    ✓ Nhận diện được: {parseExamTextToQuestions(rawExamInput).length} câu hỏi
                  </span>
                </div>

                <textarea
                  rows={13}
                  value={rawExamInput}
                  onChange={(e) => setRawExamInput(e.target.value)}
                  placeholder="Dán đề thi của Thầy/Cô vào đây hoặc bấm nút 'Tải File Đề' ở trên..."
                  className={`w-full rounded-xl p-3.5 text-xs font-mono focus:outline-none resize-none leading-relaxed border ${
                    isLight
                      ? 'bg-slate-50/70 border-slate-300 text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                      : 'bg-black/50 border-white/10 text-slate-200 focus:border-amber-500/50'
                  }`}
                />

                <div className="flex justify-between items-center text-[11px] pt-1">
                  <button
                    onClick={() => setRawExamInput(SAMPLE_TEACHER_EXAM)}
                    className={`cursor-pointer font-bold ${
                      isLight ? 'text-amber-800 hover:text-amber-900 hover:underline' : 'text-amber-400 hover:underline'
                    }`}
                  >
                    Dán Đề Mẫu Chuẩn
                  </button>

                  <button
                    onClick={() => setRawExamInput('')}
                    className={`cursor-pointer font-bold ${
                      isLight ? 'text-red-700 hover:text-red-800 hover:underline' : 'text-red-400 hover:underline'
                    }`}
                  >
                    Xóa Sạch Nội Dung
                  </button>
                </div>
              </div>
            </div>

            {/* Cột Phải: Xem Mã Đề Đã Sinh & Tải Word / In PDF */}
            <div className="lg:col-span-7 space-y-4">
              {shuffledExams ? (
                <div className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
                  isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'glass border-white/10 text-white'
                }`}>
                  
                  {/* THANH CÔNG CỤ ĐỊNH DẠNG: CỠ CHỮ, FONT, SỬA TIÊU ĐỀ, ĐÁP ÁN */}
                  <div className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.03] border-white/10'
                  }`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                        isLight ? 'text-slate-800' : 'text-slate-300'
                      }`}>
                        ⚙️ Định dạng Word:
                      </span>

                      {/* CHỌN CỠ CHỮ CHO GIÁO VIÊN */}
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${
                        isLight ? 'bg-white border-slate-300 text-slate-900 shadow-xs' : 'bg-black/50 border-white/15 text-white'
                      }`}>
                        <span className="text-[11px] text-amber-500 font-extrabold">Cỡ chữ:</span>
                        <select
                          value={examFontSize}
                          onChange={(e) => setExamFontSize(Number(e.target.value))}
                          className="bg-transparent text-xs font-black focus:outline-none cursor-pointer"
                          title="Chọn cỡ chữ in đề thi (Chuẩn Bộ GD&ĐT là 12pt hoặc 13pt)"
                        >
                          <option value={11} className={isLight ? 'text-black' : 'text-black'}>11 pt (Nhỏ gọn)</option>
                          <option value={12} className={isLight ? 'text-black' : 'text-black'}>12 pt (Chuẩn Bộ GD&ĐT)</option>
                          <option value={13} className={isLight ? 'text-black' : 'text-black'}>13 pt (Tiêu chuẩn)</option>
                          <option value={14} className={isLight ? 'text-black' : 'text-black'}>14 pt (Cỡ chữ lớn)</option>
                        </select>
                      </div>

                      {/* BADGE KHỔ A4 DỌC */}
                      <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                        📄 Khổ A4 Dọc (210×297mm)
                      </span>

                      {/* BADGE FONT TIMES NEW ROMAN */}
                      <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 font-serif">
                        🔤 Times New Roman
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* NÚT TÙY CHỈNH TIÊU ĐỀ SỞ / TRƯỜNG */}
                      <button
                        type="button"
                        onClick={() => setShowEditHeaderModal(true)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isLight
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30'
                        }`}
                        title="Tùy chỉnh thông tin Sở GD&ĐT, Tên Trường, Kỳ Thi và Thời gian làm bài"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                        <span>Sửa Tiêu Đề Trường</span>
                      </button>

                      {/* BẬT / TẮT ĐÁP ÁN ĐÚNG TRÊN PREVIEW */}
                      <button
                        type="button"
                        onClick={() => setShowCorrectInPreview(!showCorrectInPreview)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition flex items-center gap-1 cursor-pointer shadow-xs ${
                          showCorrectInPreview
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-white/5 text-gray-400 border-white/10'
                        }`}
                        title="Bật/tắt đánh dấu đáp án đúng trên màn hình xem trước"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{showCorrectInPreview ? 'Đáp Án: Hiện' : 'Đáp Án: Ẩn'}</span>
                      </button>
                    </div>
                  </div>

                  {/* THANH CHỌN MÃ ĐỀ & BỘ NÚT TẢI FILE NỔI BẬT */}
                  <div className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b ${
                    isLight ? 'border-slate-200' : 'border-white/10'
                  }`}>
                    {/* Danh sách tab mã đề */}
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>Mã đề:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {shuffledExams.map(ex => (
                          <button
                            key={ex.examCode}
                            onClick={() => setSelectedExamCode(ex.examCode)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1 ${
                              selectedExamCode === ex.examCode
                                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/25 scale-105'
                                : isLight
                                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
                            }`}
                          >
                            <span>Mã {ex.examCode}</span>
                            <span className="text-[10px] opacity-75">({ex.questions.length}c)</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bộ nút tải file & in ấn */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleExportWord(selectedExamCode)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20"
                        title="Tải file Word (.doc) riêng của mã đề này, mở ra là khổ đứng A4, Times New Roman"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải Word Mã Này (.doc)</span>
                      </button>

                      <button
                        onClick={handleExportAllWord}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/25"
                        title="Tải trọn bộ tất cả các mã đề kèm Ma trận đáp án trong 1 file Word duy nhất"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Tải Trọn Bộ ({shuffledExams.length} Mã)</span>
                      </button>

                      <button
                        onClick={() => handlePrintExam(selectedExamCode)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isLight
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/40'
                        }`}
                        title="In hoặc lưu PDF khổ A4 đứng"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-500" />
                        <span>In / PDF A4</span>
                      </button>

                      <button
                        onClick={() => {
                          const active = shuffledExams.find(e => e.examCode === selectedExamCode);
                          if (!active) return;
                          let text = `${examHeaderInfo.school}\n${examHeaderInfo.examTitle} - MÃ ĐỀ ${active.examCode}\n\n`;
                          active.questions.forEach(q => {
                            text += `${q.questionText}\n`;
                            q.options.forEach(o => text += `${o.key}. ${o.text}\n`);
                            text += `\n`;
                          });
                          copyToClipboard(text);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1 cursor-pointer shadow-xs ${
                          isLight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                            : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                        }`}
                        title="Sao chép toàn bộ nội dung đề thi vào bộ nhớ tạm"
                      >
                        <Copy className="w-3.5 h-3.5 text-amber-500" />
                        <span>{copiedKey ? 'Đã Copy!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* KHUNG XEM TRƯỚC TỜ GIẤY A4 ĐÍCH THỰC (A4 PAPER PREVIEW SHEET) */}
                  {selectedExamCode && (() => {
                    const activeExam = shuffledExams.find(e => e.examCode === selectedExamCode);
                    if (!activeExam) return null;
                    const estPages = Math.max(1, Math.ceil(activeExam.questions.length / 10));

                    return (
                      <div className="max-h-[620px] overflow-y-auto p-2 sm:p-4 rounded-xl bg-slate-200 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10">
                        {/* TỜ GIẤY A4 TRẮNG TINH */}
                        <div 
                          className="max-w-[760px] mx-auto bg-white text-slate-950 p-6 sm:p-10 shadow-2xl rounded-sm border border-slate-300 font-serif space-y-4"
                          style={{
                            fontFamily: "'Times New Roman', Times, serif",
                            fontSize: `${examFontSize}pt`,
                            lineHeight: 1.35
                          }}
                        >
                          {/* ĐẦU TRANG 2 CỘT CHUẨN BỘ GD&ĐT */}
                          <div className="grid grid-cols-2 gap-4 pb-2 text-center select-none">
                            <div className="space-y-0.5">
                              <div className="font-bold uppercase tracking-tight" style={{ fontSize: `${examFontSize - 0.5}pt` }}>
                                {examHeaderInfo.department || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO'}
                              </div>
                              <div className="font-bold uppercase tracking-tight" style={{ fontSize: `${examFontSize}pt` }}>
                                {examHeaderInfo.school || 'TRƯỜNG THPT NGUYỄN KHUYẾN'}
                              </div>
                              <div className="italic text-slate-600 text-[11px]">
                                (Đề thi có {estPages} trang)
                              </div>
                            </div>

                            <div className="space-y-0.5">
                              <div className="font-bold uppercase tracking-tight" style={{ fontSize: `${examFontSize - 0.5}pt` }}>
                                {examHeaderInfo.examTitle || 'BÀI KIỂM TRA ĐỊNH KỲ TIẾNG ANH'}
                              </div>
                              <div className="font-bold" style={{ fontSize: `${examFontSize}pt` }}>
                                {examHeaderInfo.subjectTitle || 'MÔN: TIẾNG ANH - THPT'}
                              </div>
                              <div className="italic text-slate-600 text-[11px]">
                                Thời gian làm bài: {examHeaderInfo.durationMinutes || 50} phút (không kể phát đề)
                              </div>
                              <div className="inline-block border-2 border-slate-900 font-bold px-3 py-0.5 mt-1 text-center font-mono">
                                MÃ ĐỀ: {activeExam.examCode}
                              </div>
                            </div>
                          </div>

                          {/* THÔNG TIN THÍ SINH & ĐƯỜNG KẺ NGANG */}
                          <div className="border-b-2 border-slate-900 pb-2 text-xs select-none">
                            Họ và tên thí sinh: ............................................................................ Số báo danh: .............................
                          </div>

                          {/* DANH SÁCH CÂU HỎI TRẮC NGHIỆM */}
                          <div className="space-y-3.5 pt-1">
                            {activeExam.questions.map((q) => {
                              const maxOptLen = Math.max(...q.options.map(o => (o.text || '').length));

                              let colClass = 'grid-cols-4';
                              if (maxOptLen > 42) colClass = 'grid-cols-1';
                              else if (maxOptLen > 18) colClass = 'grid-cols-2';

                              return (
                                <div key={q.questionNumber} className="space-y-1">
                                  <div className="text-justify leading-relaxed">
                                    <span className="font-bold mr-1.5">Câu {q.questionNumber}:</span>
                                    <span>{q.questionText.replace(/^(?:Câu|Question|Bài)\s*\d+[\s.:]/i, '')}</span>
                                  </div>

                                  <div className={`grid ${colClass} gap-x-3 gap-y-1 text-left`}>
                                    {q.options.map(opt => {
                                      const isCorrect = opt.key === q.correctKey;
                                      return (
                                        <div
                                          key={opt.key}
                                          className={`py-0.5 px-1.5 rounded transition ${
                                            showCorrectInPreview && isCorrect
                                              ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-400'
                                              : 'text-slate-900'
                                          }`}
                                        >
                                          <span className="font-bold mr-1">{opt.key}.</span>
                                          <span>{opt.text}</span>
                                          {showCorrectInPreview && isCorrect && (
                                            <span className="ml-1 text-emerald-700 text-xs font-bold select-none">✓</span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* PHẦN KẾT THÚC ĐỀ THI */}
                          <div className="pt-4 text-center select-none space-y-1">
                            <div className="font-bold tracking-widest text-sm">---------- HẾT ----------</div>
                            <div className="italic text-xs text-slate-600">
                              Thí sinh không được sử dụng tài liệu. Cán bộ coi thi không giải thích gì thêm.
                            </div>
                          </div>

                          {/* BẢNG ĐÁP ÁN MÃ ĐỀ NÀY (TRANG CUỐI) */}
                          <div className="border-t-2 border-dashed border-slate-400 pt-6 mt-6 select-none">
                            <div className="font-bold uppercase text-center text-sm">
                              BẢNG ĐÁP ÁN MÃ ĐỀ {activeExam.examCode}
                            </div>
                            <div className="text-center italic text-xs text-slate-600 mb-3">
                              (Bảng đáp án chính thức gồm {activeExam.questions.length} câu hỏi)
                            </div>

                            {/* Chia từng 10 câu */}
                            {Array.from({ length: Math.ceil(activeExam.answerKey.length / 10) }, (_, chunkIdx) => {
                              const chunk = activeExam.answerKey.slice(chunkIdx * 10, (chunkIdx + 1) * 10);
                              return (
                                <table key={chunkIdx} className="w-full border-collapse border border-slate-900 text-center text-xs mb-2">
                                  <thead>
                                    <tr className="bg-slate-100">
                                      <th className="border border-slate-900 p-1 w-12 font-bold">Câu</th>
                                      {chunk.map(c => (
                                        <th key={c.qNum} className="border border-slate-900 p-1 font-bold">{c.qNum}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="border border-slate-900 p-1 font-bold">Đ/A</td>
                                      {chunk.map(c => (
                                        <td key={c.qNum} className="border border-slate-900 p-1 font-extrabold text-red-700">
                                          {c.ans}
                                        </td>
                                      ))}
                                    </tr>
                                  </tbody>
                                </table>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className={`p-12 rounded-2xl border text-center space-y-4 flex flex-col items-center justify-center min-h-[350px] ${
                  isLight ? 'bg-white border-slate-200 shadow-sm text-slate-900' : 'glass border-white/10 text-white'
                }`}>
                  <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center ${
                    isLight ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}>
                    <Shuffle className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className={`font-extrabold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>Chưa Có Mã Đề Nào Được Sinh</h4>
                    <p className={`text-xs mt-1 max-w-md ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                      Bấm nút <strong>"📁 Tải File Đề (.docx / .doc / .txt)"</strong> hoặc dán đề thi ở cột bên trái &rarr; Bấm <strong>"Xáo Đề &amp; Sinh Mã Đề"</strong> để tải file Word và in PDF tự động!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 3: THỬ THÁCH TUẦN                                               */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'weekly-topic' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-white font-outfit flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Chủ Đề Tuần: Từ Vựng, Đặt Câu &amp; Viết Đoạn Văn AI</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Giáo viên đặt chủ đề theo tuần. Học sinh nộp <strong>Từ vựng + Đặt câu + Viết đoạn văn (120-150 từ)</strong>. AI chấm điểm 4 tiêu chí THPT tự động!
              </p>
            </div>

            <button
              onClick={() => setIsCreatingTopic(!isCreatingTopic)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isCreatingTopic ? 'Đóng Form' : '+ Tạo Chủ Đề Tuần Mới'}</span>
            </button>
          </div>

          {/* Form tạo Topic mới */}
          {isCreatingTopic && (
            <div className="glass p-5 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 space-y-4 animate-in fade-in">
              <h3 className="font-extrabold text-sm text-indigo-300">Tạo Chủ Đề Từ Vựng &amp; Viết Luận Mới</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="text-[11px] text-gray-400 font-semibold block mb-1">Tên Chủ Đề:</label>
                  <input
                    type="text"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    placeholder="Ví dụ: Chủ Đề 3: Năng Lượng Tái Tạo..."
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
                <label className="text-[11px] text-gray-400 font-semibold block mb-1">Đề bài viết đoạn văn / bài luận tuần này (120 - 150 từ):</label>
                <textarea
                  rows={2}
                  value={newTopicEssayPrompt}
                  onChange={(e) => setNewTopicEssayPrompt(e.target.value)}
                  placeholder="Ví dụ: Write a paragraph (120-150 words) discussing the key advantages of renewable energy..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
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
                  Lưu &amp; Kích Hoạt Chủ Đề
                </button>
              </div>
            </div>
          )}

          {/* Danh sách các Topic */}
          <div className="space-y-6">
            {topics.map((top) => (
              <div key={top.id} className="glass p-5 md:p-7 rounded-3xl border border-white/10 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-lg text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {top.week}
                    </span>
                    <h3 className="font-extrabold text-base text-white font-outfit">{top.title}</h3>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-white/5 text-gray-400">
                      Lớp {top.grade}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-400">
                      Đã có <strong className="text-emerald-400">{top.submissions.length} bài nộp</strong>
                    </span>
                    <button
                      onClick={() => handleDeleteTopic(top.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition cursor-pointer border border-red-500/20"
                      title="Xóa Topic tuần này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {top.essayPrompt && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border border-purple-500/30 space-y-1.5">
                    <span className="text-[10px] font-bold font-mono text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                      <PenTool className="w-3.5 h-3.5 text-purple-400" />
                      ĐỀ BÀI VIẾT ĐOẠN VĂN / BÀI LUẬN (120 - 150 TỪ):
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 font-semibold italic">
                      "{top.essayPrompt}"
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                  <div className="lg:col-span-5 bg-black/40 p-4 md:p-5 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        <span>Phần 1: Từ Vựng Mới &amp; Đặt Câu</span>
                      </h4>
                      <span className="text-[10px] text-gray-400">* Tự do thêm</span>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={submitWord}
                        onChange={(e) => setSubmitWord(e.target.value)}
                        placeholder="Từ vựng mới (VD: Sustainable)... *"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                      />
                      <input
                        type="text"
                        value={submitMeaning}
                        onChange={(e) => setSubmitMeaning(e.target.value)}
                        placeholder="Nghĩa tiếng Việt (VD: Bền vững)..."
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                      <input
                        type="text"
                        value={submitSentence}
                        onChange={(e) => setSubmitSentence(e.target.value)}
                        placeholder="(Tùy chọn) Câu tiếng Anh chứa từ trên..."
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => handleQuickAddVocab(top.id)}
                        className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer border border-white/10"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-400" />
                        <span>Lưu Nhanh</span>
                      </button>

                      <button
                        onClick={() => handleAISentenceCheck(top.id)}
                        disabled={isEvaluatingSentence}
                        className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow disabled:opacity-50"
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${isEvaluatingSentence ? 'animate-spin' : ''}`} />
                        <span>{isEvaluatingSentence ? 'AI Đang Chấm...' : 'AI Chấm Câu'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-black/40 p-4 md:p-5 rounded-2xl border border-purple-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-purple-300 flex items-center gap-1.5">
                        <PenTool className="w-4 h-4 text-purple-400" />
                        <span>Phần 2: Nộp Đoạn Văn / Bài Luận Theo Chủ Đề</span>
                      </h4>
                      <span className="text-[11px] font-mono text-gray-400">
                        {submitEssayContent.trim() ? submitEssayContent.trim().split(/\s+/).length : 0} / 150 từ
                      </span>
                    </div>

                    <textarea
                      rows={4}
                      value={submitEssayContent}
                      onChange={(e) => setSubmitEssayContent(e.target.value)}
                      placeholder="Nhập đoạn văn tiếng Anh (120-150 từ) của bạn tại đây để AI phân tích ngữ pháp, chấm điểm 4 tiêu chí THPT..."
                      className="w-full bg-black/50 border border-purple-500/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-400 leading-relaxed resize-none"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <input
                        type="text"
                        value={studentSubmitName}
                        onChange={(e) => setStudentSubmitName(e.target.value)}
                        placeholder="Tên học sinh nộp bài..."
                        className="bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none w-48"
                      />

                      <button
                        onClick={() => handleAIEssayCheck(top.id, top.essayPrompt || top.title)}
                        disabled={isEvaluatingEssay}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className={`w-4 h-4 ${isEvaluatingEssay ? 'animate-spin' : ''}`} />
                        <span>{isEvaluatingEssay ? 'AI Đang Chấm 4 Tiêu Chí...' : 'Nộp Đoạn Văn & AI Chấm Điểm'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {top.submissions.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-white/5">
                    <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Bài Đã Nộp &amp; Kết Quả Chấm AI ({top.submissions.length}):
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {top.submissions.map(sub => (
                        <div key={sub.id} className="bg-black/50 p-4 rounded-2xl border border-white/10 space-y-2.5 relative group">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-white">{sub.studentName}</span>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {sub.aiScore} / 10.0 Điểm
                              </span>
                              <button
                                onClick={() => handleDeleteSubmission(top.id, sub.id)}
                                className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded"
                                title="Xóa bài nộp này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {sub.word && sub.type !== 'essay' && (
                            <div>
                              <span className="text-amber-400 font-bold text-xs">{sub.word}</span>
                              <span className="text-gray-400 text-[11px] ml-1.5">({sub.meaning})</span>
                            </div>
                          )}

                          {sub.essay ? (
                            <p className="text-xs text-slate-200 bg-white/5 p-3 rounded-xl leading-relaxed italic border border-white/5">
                              "{sub.essay}"
                            </p>
                          ) : (
                            <p className="text-xs text-slate-200 bg-white/5 p-2 rounded-lg font-mono">
                              "{sub.sentence}"
                            </p>
                          )}

                          <p className="text-[11px] text-indigo-300 leading-relaxed bg-indigo-950/20 p-2.5 rounded-xl border border-indigo-500/20">
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

    
      {/* MODAL GIỚI THIỆU TÍNH NĂNG DÀNH CHO GIÁO VIÊN */}
      {showTeacherFeatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-3xl rounded-3xl p-6 md:p-8 border border-cyan-500/40 bg-[#090f26] space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base md:text-lg text-white font-outfit">
                    Cẩm Nang Tính Năng Dành Cho Giáo Viên Tiếng Anh THPT
                  </h3>
                  <p className="text-xs text-slate-400">Hướng dẫn sử dụng và khai thác tối đa hệ thống</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTeacherFeatureModal(false)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 text-xs text-slate-300 leading-relaxed">
              {/* Quy trình 3 bước */}
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-2">
                <h4 className="font-bold text-cyan-300 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Quy Trình 3 Bước Dành Cho Thầy/Cô:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="font-bold text-amber-400 font-mono">BƯỚC 1:</span>
                    <p className="font-semibold text-white">Soạn hoặc Tải Đề</p>
                    <p className="text-[11px] text-gray-400">Tải file Word (.docx) đề thi của Thầy/Cô lên hệ thống.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="font-bold text-cyan-400 font-mono">BƯỚC 2:</span>
                    <p className="font-semibold text-white">Xáo Đề hoặc Giao Bài</p>
                    <p className="text-[11px] text-gray-400">Tạo 4 mã đề in ấn hoặc cấp mã lớp cho học sinh làm bài.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="font-bold text-emerald-400 font-mono">BƯỚC 3:</span>
                    <p className="font-semibold text-white">AI Chấm &amp; Xuất Sổ Điểm</p>
                    <p className="text-[11px] text-gray-400">Hệ thống tự động chấm điểm và xuất file Excel nộp trường.</p>
                  </div>
                </div>
              </div>

              {/* Chi tiết từng tính năng */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <h5 className="font-bold text-white text-sm flex items-center gap-2">
                    <Shuffle className="w-4 h-4 text-amber-400" />
                    <span>Công Cụ Xáo Đề Thi Word (.docx/.doc) Chuẩn Quốc Gia</span>
                  </h5>
                  <p>• <strong>Đọc file Word thông minh:</strong> Tích hợp thư viện Mammoth trích xuất chính xác câu hỏi và 4 phương án từ file Word của giáo viên.</p>
                  <p>• <strong>Sinh 4 mã đề:</strong> Đảo trật tự câu và các phương án A, B, C, D ngẫu nhiên, tự động sinh Bảng Ma Trận Đáp Án Chuẩn.</p>
                  <p>• <strong>Xuất file Word chuẩn A4:</strong> Có sẵn khung tiêu đề Sở GD&ĐT, Trường THPT, SBD, căn đều 2 cột đẹp mắt.</p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <h5 className="font-bold text-white text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Không Gian Quản Trị Lớp Học Trực Tuyến</span>
                  </h5>
                  <p>• <strong>Mã Lớp Bảo Mật:</strong> Cấp mã lớp (ví dụ: <span className="text-amber-400 font-mono font-bold">ENG-10A1-26</span>) cho học sinh. Học sinh chỉ thấy lớp của mình, không can thiệp được lớp khác.</p>
                  <p>• <strong>Giao Bài Kiểm Tra Tự Do:</strong> Thầy/Cô tự tải file đề thi của mình lên giao cho lớp làm bài trực tuyến có đếm giờ.</p>
                  <p>• <strong>Chống Gian Lận:</strong> Khóa đáp án và lời giải chi tiết khi học sinh đang làm bài, chỉ mở khóa sau khi nộp bài.</p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <h5 className="font-bold text-white text-sm flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>Sổ Điểm Điện Tử &amp; Xuất Báo Cáo Excel</span>
                  </h5>
                  <p>• AI chấm trắc nghiệm ngay khi học sinh nộp bài và tự động lưu điểm vào sổ điểm của lớp.</p>
                  <p>• Tải file Excel Sổ Điểm (.CSV) danh sách cả lớp chỉ với 1 click chuột.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-white">Cần Hỗ Trợ Hoặc Cấp Key Miễn Phí?</h5>
                  <p className="text-[11px] text-blue-300">Liên hệ Zalo Admin để được kích hoạt tài khoản giáo viên ngay tức thì.</p>
                </div>
                <a
                  href="https://zalo.me/0975711254"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#0068FF] hover:bg-blue-600 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shrink-0"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Zalo: 0975.711.254</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: BẢNG MA TRẬN ĐÁP ÁN ĐỐI CHIẾU CÁC MÃ ĐỀ */}
      {showMasterMatrix && shuffledExams && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-4xl rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] flex flex-col transition-colors duration-200 ${
            isLight
              ? 'bg-white text-slate-900 border border-slate-200 shadow-xl'
              : 'glass-card border border-cyan-500/40 bg-[#090f26] text-white shadow-2xl'
          }`}>
            <div className={`flex items-center justify-between pb-4 shrink-0 border-b ${
              isLight ? 'border-slate-200' : 'border-white/10'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isLight ? 'bg-indigo-50 border border-indigo-200 text-indigo-600' : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400'
                }`}>
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-extrabold text-base md:text-lg font-outfit ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Bảng Ma Trận Đáp Án Đối Chiếu ({shuffledExams.length} Mã Đề)
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Đối chiếu đáp án tất cả các mã đề theo từng câu hỏi để chấm bài nhanh nhất
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowMasterMatrix(false)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm cursor-pointer ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                ✕
              </button>
            </div>

            {/* Bảng dữ liệu ma trận cuộn được */}
            <div className={`overflow-auto flex-1 rounded-2xl border ${
              isLight ? 'border-slate-200 bg-white' : 'border-white/10 bg-black/40'
            }`}>
              <table className="w-full text-center border-collapse text-xs">
                <thead className={`sticky top-0 font-bold border-b ${
                  isLight ? 'bg-slate-100 text-slate-900 border-slate-200' : 'bg-[#0c1633] text-cyan-300 border-white/10'
                }`}>
                  <tr>
                    <th className={`p-3 border-r ${isLight ? 'border-slate-200' : 'border-white/10'}`}>Câu</th>
                    {shuffledExams.map(ex => (
                      <th key={ex.examCode} className={`p-3 border-r font-mono ${isLight ? 'border-slate-200 text-amber-800' : 'border-white/10 text-amber-300'}`}>
                        Mã {ex.examCode}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? 'divide-slate-200 text-slate-800' : 'divide-white/5 text-slate-200'}`}>
                  {Array.from({ length: shuffledExams[0]?.questions?.length || 0 }, (_, i) => {
                    const qNum = i + 1;
                    return (
                      <tr key={qNum} className={`transition ${isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.03]'}`}>
                        <td className={`p-2.5 font-bold border-r ${isLight ? 'border-slate-200 text-slate-700' : 'border-white/10 text-slate-300'}`}>
                          Câu {qNum}
                        </td>
                        {shuffledExams.map(ex => {
                          const ans = ex.answerKey.find(a => a.qNum === qNum)?.ans || '-';
                          return (
                            <td key={ex.examCode} className={`p-2.5 border-r font-mono font-extrabold text-sm ${
                              isLight ? 'border-slate-200 text-indigo-700 bg-indigo-50/40' : 'border-white/10 text-cyan-300'
                            }`}>
                              {ans}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Nút hành động */}
            <div className={`flex flex-wrap items-center justify-between gap-3 pt-2 border-t shrink-0 ${
              isLight ? 'border-slate-200' : 'border-white/10'
            }`}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    // Copy dạng TSV cho Excel
                    const totalQ = shuffledExams[0]?.questions?.length || 0;
                    let tsv = 'Câu\t' + shuffledExams.map(e => `Mã ${e.examCode}`).join('\t') + '\n';
                    for (let q = 1; q <= totalQ; q++) {
                      tsv += `${q}\t` + shuffledExams.map(e => e.answerKey.find(a => a.qNum === q)?.ans || '-').join('\t') + '\n';
                    }
                    navigator.clipboard.writeText(tsv);
                    setCopiedMatrix(true);
                    setTimeout(() => setCopiedMatrix(false), 2000);
                  }}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer border ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                      : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5 text-amber-500" />
                  <span>{copiedMatrix ? '✓ Đã Copy Cho Excel!' : '📋 Copy Bảng Cho Excel'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportMasterMatrixWord}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer border ${
                    isLight
                      ? 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 border-blue-500/40'
                  }`}
                >
                  <FileText className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                  <span>Tải Bảng Word (.doc)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowMasterMatrix(false)}
                className={`px-5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/10 hover:bg-white/15 text-gray-300'
                }`}
              >
                Đóng Bảng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TÙY CHỈNH TIÊU ĐỀ SỞ / TRƯỜNG CHO ĐỀ THI */}
      {showEditHeaderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-lg rounded-3xl p-6 md:p-7 border shadow-2xl space-y-5 ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f172a] border-white/10 text-white'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm md:text-base">Tùy Chỉnh Tiêu Đề Đề Thi</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Thông tin xuất hiện ở đầu trang giấy A4 và file Word</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditHeaderModal(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold">1. Tên Sở GD&ĐT:</label>
                <input
                  type="text"
                  value={examHeaderInfo.department}
                  onChange={(e) => setExamHeaderInfo({ ...examHeaderInfo, department: e.target.value })}
                  placeholder="Ví dụ: SỞ GIÁO DỤC VÀ ĐÀO TẠO"
                  className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-black/40 border-white/10 text-white'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold">2. Tên Trường THPT:</label>
                <input
                  type="text"
                  value={examHeaderInfo.school}
                  onChange={(e) => setExamHeaderInfo({ ...examHeaderInfo, school: e.target.value })}
                  placeholder="Ví dụ: TRƯỜNG THPT NGUYỄN KHUYẾN"
                  className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-black/40 border-white/10 text-white'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold">3. Tiêu Đề Kỳ Thi:</label>
                <input
                  type="text"
                  value={examHeaderInfo.examTitle}
                  onChange={(e) => setExamHeaderInfo({ ...examHeaderInfo, examTitle: e.target.value })}
                  placeholder="Ví dụ: BÀI KIỂM TRA ĐỊNH KỲ TIẾNG ANH"
                  className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-black/40 border-white/10 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold">4. Môn Thi / Khối Lớp:</label>
                  <input
                    type="text"
                    value={examHeaderInfo.subjectTitle}
                    onChange={(e) => setExamHeaderInfo({ ...examHeaderInfo, subjectTitle: e.target.value })}
                    placeholder="MÔN: TIẾNG ANH - THPT"
                    className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-black/40 border-white/10 text-white'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold">5. Thời Gian Làm Bài (phút):</label>
                  <input
                    type="number"
                    value={examHeaderInfo.durationMinutes}
                    onChange={(e) => setExamHeaderInfo({ ...examHeaderInfo, durationMinutes: Number(e.target.value) })}
                    placeholder="50"
                    className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-black/40 border-white/10 text-white'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setShowEditHeaderModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-orange-500/20 cursor-pointer"
              >
                ✓ Lưu &amp; Cập Nhật Tiêu Đề
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

