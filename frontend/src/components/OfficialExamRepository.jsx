import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, Award, Clock, ArrowRight, 
  Search, Filter, BookOpen, Download, ExternalLink, Sparkles, Zap, ChevronRight
} from 'lucide-react';

export const OFFICIAL_EXAM_LIST = [
  {
    id: 'thpt-2026-sample',
    date: '2026.06.28',
    type: 'Đề mẫu Bộ GD&ĐT',
    typeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    title: 'Đề minh họa Tốt nghiệp THPT 2026 Môn Tiếng Anh — Chuẩn GDPT 2018',
    subtitle: '40 câu trắc nghiệm • 50 phút • Đầy đủ Notice, Leaflet, Sentence Arrangement, Reading',
    questionsCount: 40,
    time: 50,
    solvedCount: 1420,
    avgScore: '7.45',
    category: 'thpt',
    hasSolution: true
  },
  {
    id: 'amsterdam-2026',
    date: '2026.06.19',
    type: 'Chuyên Hà Nội',
    typeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    title: 'Đề thi thử Tiếng Anh Chuyên Hà Nội – Amsterdam 2026 (Phân hóa cao)',
    subtitle: '50 câu trắc nghiệm • Ngữ liệu nâng cao C1 • Kèm ma trận phân tích bẫy đề',
    questionsCount: 50,
    time: 60,
    solvedCount: 980,
    avgScore: '6.80',
    category: 'chuyen',
    hasSolution: true
  },
  {
    id: 'lehongphong-2026',
    date: '2026.06.18',
    type: 'Chuyên TP.HCM',
    typeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    title: 'Đề thi chọn HSG & Khảo sát Tiếng Anh THPT Chuyên Lê Hồng Phong TP.HCM 2026',
    subtitle: 'Đọc hiểu chuyên sâu khoa học & xã hội • Có hướng dẫn giải chi tiết từng câu',
    questionsCount: 50,
    time: 60,
    solvedCount: 850,
    avgScore: '7.10',
    category: 'chuyen',
    hasSolution: true
  },
  {
    id: 'hsa-vnu-2026',
    date: '2026.06.02',
    type: 'ĐGNL HSA',
    typeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    title: 'Đề thi Đánh giá Năng lực ĐHQG Hà Nội (HSA) 2026 — Phần Tư duy Tiếng Anh',
    subtitle: 'Tập trung tư duy logic ngôn ngữ, suy luận văn bản và sửa lỗi câu',
    questionsCount: 50,
    time: 60,
    solvedCount: 1210,
    avgScore: '7.60',
    category: 'dgnl',
    hasSolution: true
  },
  {
    id: 'tsa-hust-2026',
    date: '2026.06.01',
    type: 'ĐGTD TSA',
    typeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    title: 'Đề Đánh giá Tư duy ĐH Bách Khoa Hà Nội (TSA) 2026 — Đọc hiểu Tiếng Anh',
    subtitle: 'Ngữ liệu công nghệ, khoa học kỹ thuật hiện đại • Lời giải phân tích bẫy logic',
    questionsCount: 40,
    time: 45,
    solvedCount: 790,
    avgScore: '6.95',
    category: 'dgnl',
    hasSolution: true
  },
  {
    id: 'chuyen-su-pham-2026',
    date: '2026.05.31',
    type: 'Chuyên Sư Phạm',
    typeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    title: 'Đề thi thử THPT Quốc Gia Trường THPT Chuyên ĐH Sư Phạm Hà Nội 2026',
    subtitle: 'Bộ đề thi thử đợt 3 chuẩn cấu trúc • 100% câu hỏi có đối chiếu ngữ pháp SGK',
    questionsCount: 40,
    time: 50,
    solvedCount: 1650,
    avgScore: '7.30',
    category: 'thpt',
    hasSolution: true
  }
];

export default function OfficialExamRepository({ onStartExam }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeExamDetail, setActiveExamDetail] = useState(null);

  const categories = [
    { id: 'all', label: 'Tất cả kho đề' },
    { id: 'thpt', label: 'Đề THPT Quốc Gia' },
    { id: 'chuyen', label: 'Đề Trường Chuyên' },
    { id: 'dgnl', label: 'Đề ĐGNL (HSA / TSA)' }
  ];

  const filteredExams = OFFICIAL_EXAM_LIST.filter(item => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       item.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="space-y-10 w-full pb-20 max-w-[1600px] mx-auto px-4 md:px-8 animate-fade-in">
      
      {/* Header Banner - Minimalist Luxury Typography */}
      <div className="border-b border-white/10 pb-8 pt-4 space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-bold text-emerald-400 tracking-widest uppercase">
            02 • KHO ĐỀ CHUẨN HÓA
          </span>
          <span className="h-3 w-[1px] bg-white/20" />
          <span className="text-xs text-slate-400 font-medium">Bám sát cấu trúc đề thi chính thức Bộ GD&ĐT</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight font-outfit leading-none">
              Đề thật, lời giải thật.
            </h1>
            <p className="text-sm md:text-base text-slate-400 mt-3 max-w-2xl font-normal">
              Kho đề thi Tốt nghiệp THPT, Chuyên Hà Nội - Sài Gòn và Đánh giá Năng lực (HSA/TSA) chuẩn ma trận 2026 kèm giải thích chi tiết từng câu.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm đề thi, trường chuyên..."
              className="w-full pl-11 pr-4 py-3 bg-[#0d1220] border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-white text-black font-extrabold shadow-lg'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Minimal List View matching screenshot */}
      <div className="divide-y divide-white/10 border-y border-white/10">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            onClick={() => setActiveExamDetail(exam)}
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
                <span className="text-[11px] text-slate-500 block">{exam.questionsCount} câu • {exam.time} phút</span>
                <span className="text-xs text-emerald-400 font-bold font-mono">Điểm TB: {exam.avgScore}</span>
              </div>

              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-white/30 group-hover:translate-x-1 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Exam Detail Modal (When Clicked) */}
      {activeExamDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl max-w-2xl w-full p-6 md:p-8 border border-white/15 space-y-6 shadow-2xl animate-fade-in bg-[#080d1a]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${activeExamDetail.typeColor}`}>
                {activeExamDetail.type} • {activeExamDetail.date}
              </span>
              <button
                onClick={() => setActiveExamDetail(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-3 py-1 rounded-lg bg-white/5"
              >
                Đóng ✕
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl md:text-2xl font-black text-white font-outfit">
                {activeExamDetail.title}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeExamDetail.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-center">
              <div>
                <span className="text-lg font-black text-white font-mono">{activeExamDetail.questionsCount}</span>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Số câu hỏi</span>
              </div>
              <div>
                <span className="text-lg font-black text-emerald-400 font-mono">{activeExamDetail.time} phút</span>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Thời gian</span>
              </div>
              <div>
                <span className="text-lg font-black text-blue-400 font-mono">{activeExamDetail.solvedCount}+</span>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Lượt làm đề</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Bao gồm lời giải chi tiết từng câu và mẹo tránh bẫy ngữ pháp.
              </p>
              <p className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Tích hợp thuật toán đo lường năng lực Theta IRT sau khi nộp bài.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setActiveExamDetail(null);
                  if (onStartExam) onStartExam('irt-test');
                }}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-extrabold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Bắt Đầu Làm Đề Ngay (Có Bấm Giờ)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
