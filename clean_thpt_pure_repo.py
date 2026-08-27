# -*- coding: utf-8 -*-

new_code = '''import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, Award, Clock, ArrowRight, 
  Search, Filter, BookOpen, Download, ExternalLink, Sparkles, Zap, ChevronRight,
  Eye, Check, X, HelpCircle, ChevronDown, ChevronUp, RotateCcw, AlertCircle, Building2, MapPin, GraduationCap
} from 'lucide-react';
import { COMPREHENSIVE_EXAMS_DATABASE } from '../data/officialExamsData';

export { COMPREHENSIVE_EXAMS_DATABASE };
export const OFFICIAL_EXAM_LIST = COMPREHENSIVE_EXAMS_DATABASE;

export default function OfficialExamRepository({ onStartExam }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeViewingExam, setActiveViewingExam] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showAllSolutions, setShowAllSolutions] = useState(false);
  const [expandedExplanations, setExpandedExplanations] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);

  const categories = [
    { id: 'all', label: 'Tất Cả Đề THPT' },
    { id: 'tnthpt', label: 'Đề Bộ GD&ĐT (TN THPT)' },
    { id: 'so_gddt', label: 'Khảo Sát Sở GD&ĐT (Lớp 12)' },
    { id: 'dgnl', label: 'Đánh Giá Năng Lực (HSA)' },
    { id: 'lop10_11', label: 'Lớp 10 & 11 (GDPT 2018)' }
  ];

  const provinces = [
    { id: 'all', label: 'Tất cả đơn vị ra đề' },
    { id: 'Bộ Giáo dục & Đào tạo', label: 'Bộ GD&ĐT' },
    { id: 'Sở GD&ĐT Hà Nội', label: 'Hà Nội' },
    { id: 'Sở GD&ĐT TP.HCM', label: 'TP.HCM' },
    { id: 'Sở GD&ĐT Nghệ An', label: 'Nghệ An' },
    { id: 'ĐHQG Hà Nội', label: 'ĐHQG Hà Nội' },
    { id: 'Chương Trình GDPT 2018', label: 'GDPT 2018' }
  ];

  const filteredExams = COMPREHENSIVE_EXAMS_DATABASE.filter(item => {
    const matchCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchProvince = selectedProvince === 'all' || item.province === selectedProvince;
    const matchQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.province.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchProvince && matchQuery;
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
                ← Quay lại danh sách đề thi THPT
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
                  <FileText className="w-4 h-4 text-cyan-400" /> {activeViewingExam.questions.length} câu hỏi chuẩn hóa
                </span>
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" /> {activeViewingExam.time} phút
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://thuvienhoclieu.com/de-thi-minh-hoa-tot-nghiep-thpt-mon-tieng-anh/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Đối Chiếu Đề Gốc thuvienhoclieu.com</span>
                </a>

                <button
                  onClick={() => setShowAllSolutions(!showAllSolutions)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-white/10"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{showAllSolutions ? 'Ẩn Lời Giải Chi Tiết' : 'Hiện Toàn Bộ Lời Giải Chi Tiết'}</span>
                </button>

                {!examSubmitted ? (
                  <button
                    onClick={() => {
                      setExamSubmitted(true);
                      setShowAllSolutions(true);
                    }}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                  >
                    Nộp Bài &amp; Xem Điểm Ngay
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setUserAnswers({});
                      setExamSubmitted(false);
                      setShowAllSolutions(false);
                      setExpandedExplanations({});
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Làm Lại Từ Đầu</span>
                  </button>
                )}
              </div>
            </div>

            {/* Score Result Banner (When submitted) */}
            {examSubmitted && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#070e24] to-cyan-950/60 border border-emerald-500/40 space-y-3 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                      KẾT QUẢ BÀI LÀM TRẮC NGHIỆM
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-white mt-1">
                      Đạt {scoreResult.score10} / 10.0 Điểm
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      Đúng: <strong>{scoreResult.correct}</strong> / {scoreResult.total} câu
                    </div>
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
                      Sai: <strong>{scoreResult.total - scoreResult.correct}</strong> câu
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* List of Questions with Detailed Solutions */}
          <div className="space-y-6">
            {activeViewingExam.questions.map((q, idx) => {
              const isSelected = userAnswers[q.id];
              const isCorrect = userAnswers[q.id] === q.correctAnswer;
              const isShown = showAllSolutions || expandedExplanations[q.id];

              return (
                <div 
                  key={q.id}
                  className={`glass-card rounded-3xl p-6 md:p-8 border transition-all duration-300 space-y-6 ${
                    examSubmitted
                      ? isCorrect
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : 'border-red-500/40 bg-red-950/10'
                      : 'border-white/10 hover:border-white/20 bg-[#070b18]'
                  }`}
                >
                  {/* Question Part Header */}
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                      CÂU {idx + 1} • {q.part}
                    </span>
                  </div>

                  {/* Passage if applicable */}
                  {q.passage && (
                    <div className="p-4 md:p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs md:text-sm text-slate-200 leading-relaxed font-serif whitespace-pre-line">
                      {q.passage}
                    </div>
                  )}

                  {/* Question Prompt */}
                  <div 
                    className="text-sm md:text-base font-bold text-white leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: q.question }}
                  />

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt) => {
                      const isChoice = userAnswers[q.id] === opt.key;
                      let optionStyle = 'bg-white/[0.03] border-white/10 text-slate-200 hover:border-white/25 hover:bg-white/[0.06]';

                      if (examSubmitted) {
                        if (opt.key === q.correctAnswer) {
                          optionStyle = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-bold shadow-lg shadow-emerald-500/10';
                        } else if (isChoice && opt.key !== q.correctAnswer) {
                          optionStyle = 'bg-red-500/20 border-red-500/60 text-red-200 line-through';
                        } else {
                          optionStyle = 'bg-white/[0.01] border-white/5 text-slate-500 opacity-60';
                        }
                      } else if (isChoice) {
                        optionStyle = 'bg-cyan-500/20 border-cyan-500 text-cyan-200 font-bold shadow-lg shadow-cyan-500/10';
                      }

                      return (
                        <button
                          key={opt.key}
                          onClick={() => handleSelectOption(q.id, opt.key)}
                          disabled={examSubmitted}
                          className={`p-4 rounded-2xl border text-left text-xs md:text-sm transition-all duration-200 flex items-start gap-3 cursor-pointer disabled:cursor-default ${optionStyle}`}
                        >
                          <span className="w-6 h-6 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                            {opt.key}
                          </span>
                          <span 
                            className="flex-1"
                            dangerouslySetInnerHTML={{ __html: opt.text }}
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* Solution Toggle and Status */}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <button
                      onClick={() => toggleExplanation(q.id)}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{isShown ? 'Thu gọn lời giải chi tiết' : 'Xem giải thích chuẩn sư phạm'}</span>
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
            DANH SÁCH TỔNG QUAN KHO ĐỀ THPT CHUYÊN BIỆT
        ═══════════════════════════════════════════════════════════ */
        <div className="space-y-10">
          
          {/* Header */}
          <div className="border-b border-white/10 pb-8 pt-4 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-emerald-400 tracking-widest uppercase flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                KHO ĐỀ THI TIẾNG ANH CẤP THPT ({COMPREHENSIVE_EXAMS_DATABASE.length} BỘ ĐỀ CHÍNH THỨC)
              </span>
              <span className="h-3 w-[1px] bg-white/20" />
              <span className="text-xs text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Nguồn: Thư Viện Học Liệu (thuvienhoclieu.com)
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight font-outfit leading-tight">
                  Kho Đề Thi Tiếng Anh Cấp THPT
                </h1>
                <p className="text-sm md:text-base text-slate-300 mt-2 max-w-3xl font-normal leading-relaxed">
                  Chuyên biệt 100% cho học sinh và giáo viên cấp <strong>Trung học Phổ thông (Lớp 10, Lớp 11, Lớp 12 &amp; Ôn Thi Tốt Nghiệp THPT)</strong> theo chương trình GDPT 2018. Toàn bộ đề thi trích nguồn chính thức từ <strong>thuvienhoclieu.com</strong> kèm đáp án chuẩn và lời giải chi tiết sư phạm.
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo đơn vị ra đề, tên bài kiểm tra..."
                  className="w-full pl-11 pr-4 py-3 bg-[#0d1220] border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* Banner Cam kết nguồn tư liệu chuẩn Bộ GD&ĐT */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-blue-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>
                  <strong>100% Đề Thi THPT Thật:</strong> Đề minh họa Tốt nghiệp THPT của Bộ GD&ĐT, đề khảo sát Sở GD&ĐT Hà Nội, TP.HCM, Nghệ An, ĐHQG Hà Nội HSA và Đề kiểm tra định kỳ Lớp 10, 11 Global Success.
                </span>
              </div>
              <a
                href="https://thuvienhoclieu.com/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-[11px] font-bold border border-emerald-500/30 transition shrink-0 flex items-center gap-1.5 w-fit"
              >
                <span>thuvienhoclieu.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* TAB SWITCHER: CHUYÊN MỤC THPT */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
              <div className="flex flex-wrap items-center p-1 rounded-2xl bg-white/[0.04] border border-white/10 gap-1">
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setActiveCategory(c.id); setSelectedProvince('all'); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      activeCategory === c.id
                        ? 'bg-white text-black font-extrabold shadow-lg'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Province Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {provinces.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProvince(p.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
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

          {/* Clean Minimal List View */}
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
                    <span className="text-xs text-slate-300 font-medium block">{exam.questionsCount} câu hỏi chuẩn • {exam.time} phút</span>
                    <span className="text-[11px] text-emerald-400 font-semibold">Có lời giải chi tiết A-Z</span>
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
'''

with open('frontend/src/components/OfficialExamRepository.jsx', 'w', encoding='utf-8') as f:
    f.write(new_code)

print("Updated OfficialExamRepository.jsx to 100% THPT pure focus with ZERO fake metrics!")
