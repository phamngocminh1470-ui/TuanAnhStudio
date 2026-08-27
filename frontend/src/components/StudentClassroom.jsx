import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, BookOpen, Clock, CheckCircle2, Play, AlertCircle, 
  RotateCcw, ArrowLeft, Megaphone, Trophy, FileText, ChevronRight,
  Sparkles, Check, X, HelpCircle, Lock, Award, Calendar, LogOut
} from 'lucide-react';

export default function StudentClassroom({ classes, setClasses, onNavigate }) {
  const [joinedCode, setJoinedCode] = useState(() => localStorage.getItem('student_joined_class_code') || '');
  const [inputCode, setInputCode] = useState('');
  const [studentName, setStudentName] = useState(() => localStorage.getItem('student_display_name') || 'Học Sinh');
  const [errorMsg, setErrorMsg] = useState('');

  // Bài kiểm tra đang làm
  const [activeExam, setActiveExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Tìm lớp học mà học sinh đang tham gia
  const currentClass = classes.find(c => c.code.toUpperCase() === joinedCode.toUpperCase());

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

  const handleLeaveClass = () => {
    if (window.confirm("Bạn có chắc chắn muốn rời khỏi lớp học này để nhập mã lớp khác không?")) {
      setJoinedCode('');
      localStorage.removeItem('student_joined_class_code');
      setInputCode('');
      setActiveExam(null);
      setIsSubmitted(false);
    }
  };

  const handleStartExam = (asg) => {
    setActiveExam(asg);
    setAnswers({});
    setIsSubmitted(false);
    setQuizScore(null);
    setShowExplanation(false);
  };

  const handleSubmitExam = () => {
    if (!activeExam) return;
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
    setQuizScore(result);
    setIsSubmitted(true);
    setShowExplanation(true);

    // Cập nhật điểm của học sinh này vào Sổ Điểm của Lớp
    if (currentClass && setClasses) {
      const studentEmail = `${studentName.toLowerCase().replace(/\\s+/g, '')}@student.edu.vn`;
      let existingStudents = currentClass.students || [];
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
  // 2. MÀN HÌNH LÀM BÀI KIỂM TRA TRỰC TUYẾN
  // ════════════════════════════════════════════════════════════════════════════
  if (activeExam) {
    const questions = activeExam.questions || [];

    return (
      <div className="max-w-5xl mx-auto space-y-6 px-4 md:px-6 pb-20 animate-fade-in">
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
            {!isSubmitted ? (
              <button
                onClick={handleSubmitExam}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition cursor-pointer"
              >
                Nộp Bài &amp; Xem Điểm Ngay
              </button>
            ) : (
              <button
                onClick={() => {
                  setAnswers({});
                  setIsSubmitted(false);
                  setQuizScore(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm Lại Bài Này</span>
              </button>
            )}
          </div>
        </div>

        {/* Score Banner (sau khi nộp bài) */}
        {isSubmitted && quizScore && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#07132a] to-cyan-950/60 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in shadow-xl">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">KẾT QUẢ BÀI KIỂM TRA</span>
              <h3 className="text-2xl md:text-3xl font-black text-white mt-1">Đạt {quizScore.score10} / 10.0 Điểm</h3>
              <p className="text-xs text-emerald-300 mt-0.5">✓ Điểm số đã được tự động lưu vào Sổ Điểm của Thầy/Cô.</p>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300">
                Đúng: <strong>{quizScore.correct}</strong> / {quizScore.total} câu
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300">
                Sai: <strong>{quizScore.total - quizScore.correct}</strong> câu
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
                  isSubmitted
                    ? isCorrect ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-red-500/40 bg-red-950/10'
                    : 'border-white/10 bg-[#060a18]'
                }`}
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                    CÂU {idx + 1} • {q.part || 'Trắc nghiệm THPT'}
                  </span>
                  {isSubmitted && (
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

                    if (isSubmitted) {
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
                        disabled={isSubmitted}
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.key }))}
                        className={`p-3.5 rounded-2xl border text-left text-xs transition flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${style}`}
                      >
                        <span className="w-5 h-5 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">{opt.key}</span>
                        <span className="flex-1">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {isSubmitted && (
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
            {currentClass.assignments.map((asg) => (
              <div 
                key={asg.id}
                className="glass p-5 md:p-6 rounded-3xl border border-white/10 space-y-4 hover:border-cyan-500/40 transition shadow-xl bg-gradient-to-b from-[#091024] to-[#050914]"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-sm text-white leading-relaxed">{asg.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                    {asg.status === 'open' ? 'Đang Mở' : 'Đã Đóng'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" /> {asg.questions?.length || 0} câu hỏi
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> {asg.timeLimit || 15} phút
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Hạn: {asg.deadline}
                  </span>
                </div>

                <button
                  onClick={() => handleStartExam(asg)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Làm Bài Kiểm Tra Này Ngay</span>
                </button>
              </div>
            ))}
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
