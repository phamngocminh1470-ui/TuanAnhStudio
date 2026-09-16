import React, { useState } from 'react';
import { 
  Mic, Headphones, BookOpen, PenLine, FileText, 
  BrainCircuit, Shuffle, Camera, ArrowRight, Check
} from 'lucide-react';
import DaturaOrbitalSphere from './DaturaOrbitalSphere';

export default function DaturaSkillsSection({ onNavigate, onOpenPhotoSolver }) {
  const [openIndex, setOpenIndex] = useState(0);

  const skills = [
    {
      id: 'pronounce',
      num: '(01)',
      title: 'Chấm Điểm Phát Âm Chuẩn 44 Âm IPA',
      enTitle: 'Pronunciation Assessment',
      desc: 'Hệ thống ứng dụng Azure Speech AI phân tích phổ sóng âm ở mức mili-giây, nhận diện chính xác từng nguyên âm, phụ âm cuối, trọng âm câu và ngữ điệu theo chuẩn Oxford.',
      tags: ['Bảng 44 Âm IPA', 'Sóng âm mili-giây', 'Chấm điểm tức thì', 'Chuẩn Oxford'],
      action: () => onNavigate('pronounce'),
      icon: Mic,
      badge: 'Azure Speech AI'
    },
    {
      id: 'listening',
      num: '(02)',
      title: 'Luyện Nghe & Chép Chính Tả Từng Câu',
      enTitle: 'Dictation & Interactive Audio',
      desc: 'Mô hình luyện nghe tương tác 3 tốc độ linh hoạt (0.8x, 1.0x, 1.2x). Thực hành chép chính tả (Sentence Dictation) kết hợp bắt từ khóa then chốt theo cấu trúc đề thi.',
      tags: ['Audio bản ngữ', 'Chép chính tả', '3 Mức tốc độ', 'Bắt từ khóa đề thi'],
      action: () => onNavigate('listening'),
      icon: Headphones,
      badge: 'Interactive Audio'
    },
    {
      id: 'reading',
      num: '(03)',
      title: 'Đọc Hiểu Thích Ứng Chủ Đề SGK Mới',
      enTitle: 'Adaptive Reading',
      desc: 'Kho bài đọc phân tầng độ khó: Trí tuệ nhân tạo, Môi trường xanh, Đổi mới công nghệ theo chuẩn GDPT 2018. Tự động trích xuất từ vựng và câu hỏi suy luận tương đương bài thi ĐGNL & THPT.',
      tags: ['12 Units SGK Global Success', 'Đổi độ khó theo năng lực', 'Phân tích phản đề', 'Suy luận ý ngầm'],
      action: () => onNavigate('reading'),
      icon: BookOpen,
      badge: 'Adaptive Reading'
    },
    {
      id: 'writing',
      num: '(04)',
      title: 'Chấm Chữa Bài Luận 4 Tiêu Chí AI',
      enTitle: 'Pedagogical Writing Assessor',
      desc: 'Giám khảo AI chấm bài viết theo 4 tiêu chí chuẩn quốc tế: Ngữ pháp, Từ vựng, Tính liên kết và Mạch lạc luận điểm. Bóc tách từng câu sai và gợi ý nâng cấp Collocations Band 8.0+.',
      tags: ['Rubric 4 tiêu chí', 'Sửa lỗi từng câu', 'Nâng cấp Collocations', 'Bài mẫu điểm 9-10'],
      action: () => onNavigate('writing-practice'),
      icon: PenLine,
      badge: 'Rubric 4 Tiêu Chí'
    },
    {
      id: 'sm2-vocab',
      num: '(05)',
      title: 'Siêu Trí Nhớ Từ Vựng Não Bộ (SM-2)',
      enTitle: 'Spaced Repetition Flashcards',
      desc: 'Ứng dụng thuật toán SuperMemo-2 tính toán thời điểm vàng của đường cong quên lãng Ebbinghaus. Chỉ cần ôn tập 5-8 phút mỗi ngày để đưa hơn 1,500 từ vựng cốt lõi vào vùng nhớ dài hạn.',
      tags: ['Thuật toán SuperMemo-2', 'Đường cong Ebbinghaus', '1,500+ Từ vựng SGK', 'Nhớ sâu gấp 3 lần'],
      action: () => onNavigate('sm2-flashcards'),
      icon: BrainCircuit,
      badge: 'Khoa Học Não Bộ'
    },
    {
      id: 'official-exams',
      num: '(06)',
      title: 'Kho Đề Chuẩn Hóa 63 Tỉnh Thành',
      enTitle: 'Official Exam Repository',
      desc: 'Ngân hàng đề thi chính thức cập nhật mới nhất từ Hà Nội, TP.HCM, Nghệ An, Nam Định, Chuyên ĐH Sư Phạm kèm phân tích các phương án gây nhiễu (Distractor Analysis) để tránh bẫy.',
      tags: ['Đề 63 tỉnh thành', 'Lời giải chi tiết', 'Bóc tách bẫy trắc nghiệm', 'Bấm giờ thi chuẩn'],
      action: () => onNavigate('official-exams'),
      icon: FileText,
      badge: 'Đề Thi Thật'
    },
    {
      id: 'teacher-hub',
      num: '(07)',
      title: 'Cổng Giáo Viên: Xáo Đề 4-8 Mã & Quản Lý Lớp',
      enTitle: 'Teacher Exam Studio',
      desc: 'Công cụ độc quyền dành cho thầy cô: Tự động xáo đề từ 1 đề gốc thành 4-8 mã đề thi (101-108) bảo toàn ma trận cân bằng độ khó, xuất file Word/Docs chuẩn quy chế Bộ GD&ĐT.',
      tags: ['Xáo 2-8 Mã đề', 'Bảo toàn ma trận', 'Xuất file Word chuẩn', 'Quản lý nhóm lớp'],
      action: () => onNavigate('teacher-portal'),
      icon: Shuffle,
      badge: 'Dành Cho Thầy Cô'
    },
    {
      id: 'photo-solver',
      num: '(08)',
      title: 'Chụp Ảnh Bài Tập Giải Đề AI',
      enTitle: 'Multimodal Vision OCR',
      desc: 'Chụp ảnh trực tiếp hoặc tải ảnh chụp bài tập trên giấy, Gemini Multimodal Vision AI nhận diện chữ in và chữ viết tay, phân tích bản chất kiến thức và đưa ra lời giải từng bước.',
      tags: ['OCR chữ viết tay', 'Giải từng bước', 'Gợi mở Socrates', 'Độ chính xác cao'],
      action: onOpenPhotoSolver,
      icon: Camera,
      badge: 'Vision AI'
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="relative w-full rounded-3xl bg-[#10193e]/90 border border-cyan-500/25 p-6 sm:p-10 md:p-14 lg:p-16 text-slate-100 overflow-hidden shadow-2xl backdrop-blur-xl">
      
      {/* Expansive Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-600/20 via-cyan-500/20 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-tl from-indigo-600/20 via-purple-500/15 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        
        {/* ─── CỘT TRÁI: TIÊU ĐỀ LỚN & QUẢ CẦU VÒNG XOAY 3D (ANIMATED SPHERE) ─── */}
        <div className="lg:w-5/12 w-full flex flex-col justify-between min-h-[380px] lg:sticky lg:top-28">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono tracking-widest text-cyan-300 uppercase shadow-[0_0_12px_rgba(6,182,212,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
              <span>HỆ SINH THÁI KỸ NĂNG</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] font-outfit whitespace-pre-line">
              <span className="text-3d-hero">Kỹ năng AI</span> <br />
              <span className="text-3d-cyan">thúc đẩy bứt phá</span> <br />
              <span className="text-slate-100">điểm số của bạn.</span>
            </h2>

            <p className="text-sm md:text-base text-slate-300 max-w-md leading-relaxed pt-2 font-normal">
              Thiết kế theo chuẩn sư phạm GDPT 2018 kết hợp mô hình tâm trắc học IRT. Chạm vào từng kỹ năng để khám phá chi tiết và luyện tập tức thì.
            </p>
          </div>

          {/* 3D Kinetic Orbital Sphere Display */}
          <div className="relative w-full flex items-center justify-center mx-auto lg:mx-0 mt-8 mb-2">
            <DaturaOrbitalSphere size="md" theme="vibrant" />
          </div>
        </div>

        {/* ─── CỘT PHẢI: ACCORDION KỸ NĂNG TƯƠNG TÁC (DATURA STYLE) ─── */}
        <div className="lg:w-7/12 w-full flex flex-col divide-y divide-cyan-500/20">
          {skills.map((skill, index) => {
            const isOpen = openIndex === index;
            const Icon = skill.icon;

            return (
              <div 
                key={skill.id}
                className="py-5 sm:py-6 transition-colors duration-300 group"
              >
                {/* Header Dòng Accordion */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex justify-between items-center text-left cursor-pointer gap-4 py-1"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 flex-1">
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen 
                        ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/30'
                        : 'bg-[#0a0f24] border border-cyan-500/20 text-cyan-400 group-hover:text-cyan-300 group-hover:bg-[#131d48]'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-100 group-hover:text-cyan-300 transition-colors font-outfit">
                          {skill.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono tracking-widest text-cyan-400/70 uppercase block mt-0.5">
                        {skill.num} // {skill.enTitle}
                      </span>
                    </div>
                  </div>

                  {/* Nút tròn + / × xoay mượt mà */}
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono transition-transform duration-300 shrink-0 ${
                    isOpen
                      ? 'border-cyan-400 text-cyan-300 rotate-45 bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                      : 'border-cyan-500/20 text-slate-400 group-hover:border-cyan-400/40 group-hover:text-cyan-300'
                  }`}>
                    <span>+</span>
                  </div>
                </button>

                {/* Nội dung mở rộng mượt mà */}
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-[500px] opacity-100 pt-4 pb-2' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pl-13 sm:pl-15 space-y-4 text-slate-300">
                    <p className="text-xs sm:text-sm md:text-base leading-relaxed text-slate-300 font-normal">
                      {skill.desc}
                    </p>

                    {/* Tag tính năng */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {skill.tags.map((tag, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono font-normal px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                        >
                          <Check className="w-3 h-3 text-cyan-400" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>

                    {/* Nút Khám Phá Kỹ Năng */}
                    <div className="pt-2">
                      <button
                        onClick={skill.action}
                        className="btn-3d-primary inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs font-mono font-bold transition-all duration-300 shadow-md cursor-pointer"
                      >
                        <span>Trải nghiệm kỹ năng này</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
