import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, BookOpen, Clock, CheckCircle2, Play, AlertCircle, 
  ArrowLeft, Megaphone, Trophy, FileText, ChevronRight,
  Sparkles, Check, X, HelpCircle, Lock, Award, Calendar, LogOut,
  ShieldAlert, ShieldCheck, AlertTriangle, Eye
} from 'lucide-react';

export default function StudentClassroom({ classes, setClasses, onNavigate }) {
  const [joinedCode, setJoinedCode] = useState(() => localStorage.getItem('student_joined_class_code') || '');
  const [inputCode, setInputCode] = useState('');
  const [studentName, setStudentName] = useState(() => localStorage.getItem('student_display_name') || 'Học Sinh');
  const [errorMsg, setErrorMsg] = useState('');

  // Danh sách bài đã nộp/hoàn thành của học sinh trong lớp này
  const [completedExams, setCompletedExams] = useState(() => {
    try {
      const code = localStorage.getItem('student_joined_class_code') || '';
      const name = localStorage.getItem('student_display_name') || 'Học Sinh';
      const key = `examora_completed_exams_${code}_${name}`;
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  // Bài kiểm tra đang mở
  const [activeExam, setActiveExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isReviewOnly, setIsReviewOnly] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Hệ thống Chống Gian Lận (Anti-Cheat)
  const [violationCount, setViolationCount] = useState(0);
  const [violationAlertModal, setViolationAlertModal] = useState({ show: false, count: 0, reason: '' });
  const activeExamRef = useRef(activeExam);
  const isSubmittedRef = useRef(isSubmitted);
  const violationCountRef = useRef(violationCount);

  useEffect(() => {
    activeExamRef.current = activeExam;
  }, [activeExam]);

  useEffect(() => {
    isSubmittedRef.current = isSubmitted;
  }, [isSubmitted]);

  useEffect(() => {
    violationCountRef.current = violationCount;
  }, [violationCount]);

  // Tìm lớp học mà học sinh đang tham gia
  const currentClass = classes.find(c => c.code.toUpperCase() === joinedCode.toUpperCase());

  // Lưu completedExams vào localStorage mỗi khi thay đổi
  const saveCompletedExamRecord = (asgId, record) => {
    setCompletedExams(prev => {
      const next = { ...prev, [asgId]: record };
      try {
        const key = `examora_completed_exams_${joinedCode}_${studentName}`;
        localStorage.setItem(key, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // ════════════════════════════════════════════════════════════════════════════
  // HỆ THỐNG CHỐNG GIAN LẬN: BẮT SỰ KIỆN RỜI TAB / BLUR / PHÍM TẮT / COPY / CHUỘT PHẢI
  // ════════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!activeExam || isSubmitted) return;

    const handleTabViolation = (reason) => {
      if (!activeExamRef.current || isSubmittedRef.current) return;
      
      const newCount = violationCountRef.current + 1;
      setViolationCount(newCount);

      if (newCount === 1) {
        setViolationAlertModal({
          show: true,
          count: 1,
          reason: 'Hệ thống phát hiện bạn vừa rời khỏi cửa sổ làm bài (chuyển tab hoặc mở ứng dụng khác). Vui lòng tập trung làm bài!'
        });
      } else if (newCount === 2) {
        setViolationAlertModal({
          show: true,
          count: 2,
          reason: 'CẢNH BÁO LẦN 2: Bạn đã rời khỏi màn hình thi 2 lần! Nếu tiếp tục vi phạm lần thứ 3, hệ thống sẽ TỰ ĐỘNG THU BÀI và nộp bài thi ngay lập tức.'
        });
      } else if (newCount >= 3) {
        setViolationAlertModal({
          show: true,
          count: 3,
          reason: 'VI PHẠM QUY CHẾ THI: Bạn đã rời màn hình quá 3 lần! Hệ thống đang tự động khóa bài và nộp bài thi ngay lập tức.'
        });
        // Tự động thu bài và nộp bài cưỡng chế
        setTimeout(() => {
          handleSubmitExam(true, 3);
        }, 1500);
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        handleTabViolation('Chuyển Tab Trình Duyệt');
      }
    };

    const onWindowBlur = () => {
      handleTabViolation('Mở Ứng Dụng Khác');
    };

    const onContextMenu = (e) => {
      e.preventDefault();
    };

    const onCopyPaste = (e) => {
      e.preventDefault();
    };

    const onKeyDown = (e) => {
      // Chặn F12, Ctrl+Shift+I, Ctrl+U, Ctrl+C, Ctrl+V, Ctrl+S
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 'c' || e.key === 'C' || e.key === 'v' || e.key === 'V' || e.key === 's' || e.key === 'S'))
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onWindowBlur);
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('copy', onCopyPaste);
    document.addEventListener('paste', onCopyPaste);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onWindowBlur);
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('copy', onCopyPaste);
      document.removeEventListener('paste', onCopyPaste);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [activeExam, isSubmitted]);

  const handleJoinClass = (e) => {
    e.preventDefault();
    const code = inputCode.trim().toUpperCase();
    if (!code) return;

    const found = classes.find(c => c.code.toUpperCase() === code);
    if (!found) {
      setErrorMsg(`Không tìm thấy lớp học có mã "${code}". Vui lòng kiểm tra lại mã chính xác do Thầy/Cô cung cấp!`);
      return;
    }

    setJoinedCode(code);
    localStorage.setItem('student_joined_class_code', code);
    if (studentName.trim()) {
      localStorage.setItem('student_display_name', studentName.trim());
    }
    setErrorMsg('');
    alert(`✓ Chúc mừng bạn đã tham gia: ${found.name}! Hãy vào làm bài tập do Thầy/Cô giao nhé.`);
  };

  const handleLeaveClass = async () => {
    const ok = window.appConfirm
      ? await window.appConfirm("Bạn có chắc chắn muốn rời khỏi lớp học này để nhập mã lớp khác không?", "Rời Lớp Học", { type: 'warning', confirmText: 'Rời Lớp' })
      : window.confirm("Bạn có chắc chắn muốn rời khỏi lớp học này để nhập mã lớp khác không?");
    if (ok) {
      setJoinedCode('');
      localStorage.removeItem('student_joined_class_code');
      setInputCode('');
      setActiveExam(null);
      setIsSubmitted(false);
      setIsReviewOnly(false);
    }
  };

  // Bắt đầu làm bài thi mới
  const handleStartExam = (asg) => {
    // Kiểm tra nếu bài đã hoàn thành
    if (completedExams[asg.id]) {
      // Mở chế độ xem lại bài đã nộp
      const record = completedExams[asg.id];
      setActiveExam(asg);
      setAnswers(record.answers || {});
      setIsSubmitted(true);
      setIsReviewOnly(true);
      setQuizScore({ correct: record.correct, total: record.total, score10: record.score10 });
      setShowExplanation(true);
      setViolationCount(record.cheatViolations || 0);
      return;
    }

    // Kiểm tra hết hạn
    if (asg.deadline && asg.deadline !== 'unlimited') {
      const deadlineDate = new Date(asg.deadline + 'T23:59:59');
      if (deadlineDate < new Date()) {
        alert("⛔ Bài kiểm tra này đã quá hạn nộp bài. Bạn không thể làm bài này nữa!");
        return;
      }
    }

    setActiveExam(asg);
    setAnswers({});
    setIsSubmitted(false);
    setIsReviewOnly(false);
    setQuizScore(null);
    setShowExplanation(false);
    setViolationCount(0);
  };

  // Nộp bài thi
  const handleSubmitExam = (isForcedByCheat = false, forcedViolations = 0) => {
    if (!activeExam || isSubmitted) return;
    const questions = activeExam.questions || [];
    const total = questions.length;
    let correct = 0;

    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const score10 = Number(((correct / total) * 10).toFixed(1));
    const result = { correct, total, score10 };
    const currentViolations = isForcedByCheat ? forcedViolations : violationCount;

    setQuizScore(result);
    setIsSubmitted(true);
    setIsReviewOnly(false);
    setShowExplanation(true);

    // Lưu vĩnh viễn trạng thái đã hoàn thành của học sinh này
    const record = {
      asgId: activeExam.id,
      asgTitle: activeExam.title,
      score10,
      correct,
      total,
      answers,
      submittedAt: new Date().toLocaleString('vi-VN'),
      cheatViolations: currentViolations,
      isForcedByCheat
    };
    saveCompletedExamRecord(activeExam.id, record);

    // Cập nhật điểm của học sinh này vào Sổ Điểm của Lớp
    if (currentClass && setClasses) {
      const studentEmail = `${studentName.toLowerCase().replace(/\s+/g, '')}@student.edu.vn`;
      let existingStudents = [...(currentClass.students || [])];
      const foundIdx = existingStudents.findIndex(s => s.name === studentName);

      if (foundIdx >= 0) {
        existingStudents[foundIdx].score1 = score10;
        existingStudents[foundIdx].avg = Number(((existingStudents[foundIdx].score1 + (existingStudents[foundIdx].score2 || score10)) / 2).toFixed(1));
        existingStudents[foundIdx].status = 'completed';
      } else {
        existingStudents.push({
          id: `st-${Date.now()}`,
          name: studentName,
          email: studentEmail,
          score1: score10,
          score2: score10,
          essayScore: 8.5,
          avg: score10,
          status: 'completed'
        });
      }

      const updatedClass = {
        ...currentClass,
        students: existingStudents,
        studentCount: existingStudents.length
      };

      setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
    }
  };

  // ════════════════════════════════════════════════════════════════════════════
  // 1. MÀN HÌNH CHƯA NHẬP MÃ LỚP (FORM THAM GIA)
  // ════════════════════════════════════════════════════════════════════════════
  if (!joinedCode || !currentClass) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 py-10 px-4 animate-fade-in">
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-cyan-500/30 bg-gradient-to-b from-[#0b132b] via-[#070b1a] to-[#040714] text-center space-y-6 shadow-2xl">
          <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto text-white shadow-xl shadow-cyan-500/25">
            <GraduationCap className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-extrabold uppercase">
              KHÔNG GIAN LỚP HỌC DÀNH CHO HỌC SINH
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-white font-outfit">
              Tham Gia Lớp Học Của Thầy/Cô
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto">
              Nhập mã lớp do Thầy/Cô cung cấp để vào làm bài kiểm tra và nhận điểm số trực tiếp.
            </p>
          </div>

          <form onSubmit={handleJoinClass} className="space-y-4 max-w-md mx-auto text-left pt-2">
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1.5">Họ và Tên Học Sinh:</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn An..."
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1.5">🔑 Mã Lớp Học (Do Thầy/Cô cấp):</label>
              <input
                type="text"
                required
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Ví dụ: ENG-10A1-26, ENG-11A2-99..."
                className="w-full bg-black/60 border border-cyan-500/40 rounded-xl px-4 py-3 text-sm text-white uppercase font-mono tracking-wider focus:outline-none focus:border-cyan-400 font-black text-center"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs shadow-lg shadow-cyan-500/25 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Xác Nhận Tham Gia Lớp Học</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-white/5 text-xs text-slate-400">
            💡 Gợi ý mã lớp thử nghiệm: <strong className="text-amber-400 font-mono">ENG-10A1-26</strong> hoặc <strong className="text-amber-400 font-mono">ENG-11A2-99</strong>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 2. MÀN HÌNH LÀM BÀI KIỂM TRA TRỰC TUYẾN & XEM LẠI BÀI ĐÃ NỘP
  // ════════════════════════════════════════════════════════════════════════════
  if (activeExam) {
    const questions = activeExam.questions || [];
    const isCompletedMode = isSubmitted || isReviewOnly || Boolean(completedExams[activeExam.id]);

    return (
      <div className="max-w-5xl mx-auto space-y-6 px-4 md:px-6 pb-20 animate-fade-in select-none">
        
        {/* Anti-cheat violation modal */}
        {violationAlertModal.show && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-md bg-[#130712] border-2 border-rose-500/80 rounded-3xl p-6 md:p-8 text-center space-y-5 shadow-[0_0_60px_rgba(244,63,94,0.4)] animate-scale-up">
              <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400 shadow-xl shadow-rose-500/30">
                <ShieldAlert className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-mono font-black text-xs uppercase tracking-wider">
                  CẢNH BÁO GIAN LẬN (VI PHẠM {violationAlertModal.count}/3)
                </span>
                <h3 className="text-xl font-extrabold text-white font-outfit">Phát Hiện Rời Cửa Sổ Thi!</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {violationAlertModal.reason}
                </p>
              </div>
              <button
                onClick={() => setViolationAlertModal({ show: false, count: 0, reason: '' })}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs shadow-lg shadow-rose-500/30 transition cursor-pointer"
              >
                Tôi Đã Hiểu &amp; Tiếp Tục Làm Bài
              </button>
            </div>
          </div>
        )}

        {/* Thanh Giám Sát Chống Gian Lận (Chỉ hiện khi đang làm bài) */}
        {!isCompletedMode && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#071329] to-indigo-950/40 border border-cyan-500/30 flex items-center justify-between gap-3 text-xs shadow-lg">
            <div className="flex items-center gap-2 font-bold text-cyan-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>HỆ THỐNG GIÁM SÁT CHỐNG GIAN LẬN: <strong className="text-emerald-300 font-mono">ĐANG BẬT</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Rời tab:</span>
              <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                violationCount === 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                violationCount === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
              }`}>
                {violationCount} / 3 Lần
              </span>
            </div>
          </div>
        )}

        {/* Exam Top Bar */}
        <div className="glass-card rounded-3xl p-6 border border-cyan-500/30 bg-[#070e24] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => setActiveExam(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition cursor-pointer mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay Lại Lớp Học</span>
            </button>
            <h1 className="text-xl md:text-2xl font-black text-white font-outfit">
              {activeExam.title}
            </h1>
            <p className="text-xs text-slate-400">
              Lớp: <strong>{currentClass.name}</strong> • Học sinh: <strong className="text-cyan-300">{studentName}</strong> • Thời gian: {activeExam.timeLimit || 15} phút
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isCompletedMode ? (
              <button
                onClick={() => handleSubmitExam(false)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs shadow-lg shadow-emerald-500/25 transition cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Nộp Bài &amp; Xem Điểm Ngay</span>
              </button>
            ) : (
              <div className="px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                <span>ĐÃ HOÀN THÀNH (KHÔNG THỂ LÀM LẠI)</span>
              </div>
            )}
          </div>
        </div>

        {/* Score Banner (sau khi nộp bài) */}
        {isCompletedMode && quizScore && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#07132a] to-cyan-950/60 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">KẾT QUẢ BÀI KIỂM TRA CHÍNH THỨC</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  HOÀN THÀNH 100%
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mt-1">Đạt {quizScore.score10} / 10.0 Điểm</h3>
              <p className="text-xs text-emerald-300 mt-0.5">
                ✓ Điểm số đã được ghi nhận vào Sổ Điểm của Thầy/Cô. Bài kiểm tra này chỉ được làm 01 lần duy nhất!
              </p>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-center">
                <div className="text-[10px] text-emerald-400/70 uppercase">Đúng</div>
                <strong className="text-base">{quizScore.correct}</strong> / {quizScore.total} câu
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300 text-center">
                <div className="text-[10px] text-red-400/70 uppercase">Sai</div>
                <strong className="text-base">{quizScore.total - quizScore.correct}</strong> câu
              </div>
            </div>
          </div>
        )}

        {/* Danh sách câu hỏi */}
        <div className="space-y-5">
          {questions.map((q, idx) => {
            const isChoice = answers[q.id];
            const isCorrect = answers[q.id] === q.correctAnswer;

            return (
              <div 
                key={q.id || idx} 
                className={`glass p-5 md:p-6 rounded-3xl border transition-all space-y-4 ${
                  isCompletedMode
                    ? isCorrect ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-red-500/40 bg-red-950/10'
                    : 'border-white/10 bg-[#060a18]'
                }`}
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                    CÂU {idx + 1} • {q.part || 'Trắc nghiệm THPT'}
                  </span>
                  {isCompletedMode && (
                    <span className={`text-xs font-bold flex items-center gap-1 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>{isCorrect ? 'Chính xác' : `Sai (Đáp án: ${q.correctAnswer})`}</span>
                    </span>
                  )}
                </div>

                <div className="text-sm font-bold text-white leading-relaxed">{q.question}</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map(opt => {
                    const selectedThis = answers[q.id] === opt.key;
                    let style = 'bg-white/5 border-white/10 text-slate-200 hover:border-white/20';

                    if (isCompletedMode) {
                      if (opt.key === q.correctAnswer) {
                        style = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold shadow-md shadow-emerald-500/10';
                      } else if (selectedThis && opt.key !== q.correctAnswer) {
                        style = 'bg-red-500/20 border-red-500 text-red-200 line-through';
                      } else {
                        style = 'bg-white/[0.02] border-white/5 text-slate-500';
                      }
                    } else if (selectedThis) {
                      style = 'bg-cyan-500/20 border-cyan-500 text-cyan-200 font-bold shadow-md shadow-cyan-500/10';
                    }

                    return (
                      <button
                        key={opt.key}
                        disabled={isCompletedMode}
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.key }))}
                        className={`p-3.5 rounded-2xl border text-left text-xs transition flex items-start gap-2.5 ${isCompletedMode ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'} ${style}`}
                      >
                        <span className="w-5 h-5 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">{opt.key}</span>
                        <span className="flex-1">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {isCompletedMode && (
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs space-y-1.5 animate-fade-in">
                    <div className="font-bold text-emerald-400">Đáp án đúng: {q.correctAnswer}</div>
                    <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 3. MÀN HÌNH KHÔNG GIAN LỚP HỌC RIÊNG CỦA HỌC SINH (CHỈ THẤY LỚP NÀY)
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-5xl mx-auto space-y-6 px-4 md:px-6 pb-20 animate-fade-in">
      
      {/* Top Banner Lớp Học */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-cyan-500/30 bg-gradient-to-r from-[#0a1432] via-[#070b1a] to-[#100824] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Khối {currentClass.grade}
                </span>
                <span className="text-xs text-slate-400">
                  Mã lớp: <strong className="text-amber-400 font-mono">{currentClass.code}</strong>
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white font-outfit mt-0.5">
                {currentClass.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300">
              Học sinh: <strong className="text-cyan-300">{studentName}</strong>
            </span>
            <button
              onClick={handleLeaveClass}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition border border-red-500/20 flex items-center gap-1.5 cursor-pointer"
              title="Rời khỏi lớp học này"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đổi Lớp Khác</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-300">
          Chào mừng bạn đến với không gian học tập trực tuyến của lớp. Hãy hoàn thành các bài kiểm tra được Thầy/Cô giao bên dưới nhé!
        </p>
      </div>

      {/* 1. Bảng Tin & Dặn Dò Của Thầy/Cô */}
      {currentClass.announcements && currentClass.announcements.length > 0 && (
        <div className="glass p-5 rounded-3xl border border-amber-500/30 bg-amber-950/15 space-y-3 shadow-lg">
          <h3 className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-amber-400" />
            <span>Thông Báo &amp; Lời Dặn Từ Thầy/Cô:</span>
          </h3>
          <div className="space-y-2.5">
            {currentClass.announcements.map(ann => (
              <div key={ann.id} className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{ann.title}</span>
                  <span className="text-[10px] text-gray-500 font-mono">{ann.date}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Danh Sách Bài Kiểm Tra Được Giao */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white font-outfit flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Bài Kiểm Tra &amp; Đề Thi Của Lớp ({currentClass.assignments?.length || 0})</span>
          </h2>
          <span className="text-xs text-slate-400">Bấm làm bài để hệ thống chấm điểm tự động</span>
        </div>

        {currentClass.assignments && currentClass.assignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentClass.assignments.map((asg) => {
              const completedRecord = completedExams[asg.id];
              const isCompleted = Boolean(completedRecord);
              const isUnlimited = !asg.deadline || asg.deadline === 'unlimited';
              const isExpired = !isUnlimited && new Date(asg.deadline + 'T23:59:59') < new Date();

              return (
                <div 
                  key={asg.id}
                  className={`glass p-5 md:p-6 rounded-3xl border space-y-4 transition shadow-xl bg-gradient-to-b ${
                    isCompleted 
                      ? 'border-emerald-500/30 from-[#06141a] to-[#040c12]' 
                      : isExpired 
                      ? 'border-red-500/20 from-[#14080c] to-[#0a0406]'
                      : 'border-white/10 hover:border-cyan-500/40 from-[#091024] to-[#050914]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-sm text-white leading-relaxed">{asg.title}</h3>
                    {isCompleted ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>HOÀN THÀNH ({completedRecord.score10}/10)</span>
                      </span>
                    ) : isExpired ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>ĐÃ HẾT HẠN</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                        Đang Mở
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-cyan-400" /> {asg.questions?.length || 0} câu hỏi
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> {asg.timeLimit || 15} phút
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" /> 
                      {isUnlimited ? 'Không giới hạn' : `Hạn: ${asg.deadline}`}
                    </span>
                  </div>

                  {isCompleted ? (
                    <button
                      onClick={() => handleStartExam(asg)}
                      className="w-full py-3 rounded-2xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 font-extrabold text-xs border border-emerald-500/30 transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Xem Lại Bài Đã Nộp &amp; Lời Giải</span>
                    </button>
                  ) : isExpired ? (
                    <button
                      disabled
                      className="w-full py-3 rounded-2xl bg-white/5 text-slate-500 font-bold text-xs border border-white/5 flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Đã Quá Hạn Nộp Bài</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartExam(asg)}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Làm Bài Kiểm Tra Này Ngay</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass p-12 rounded-3xl border border-white/10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Chưa Có Bài Kiểm Tra Nào</h3>
            <p className="text-xs text-slate-400">Thầy/Cô chưa giao bài mới. Hãy quay lại sau nhé!</p>
          </div>
        )}
      </div>

    </div>
  );
}
