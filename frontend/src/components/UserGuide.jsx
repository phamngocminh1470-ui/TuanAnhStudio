import React, { useState } from 'react';
import { 
  BookOpen, Brain, Clock, Mic, MessageSquare, Award, Sparkles, ChevronRight, 
  HelpCircle, CheckCircle2, ArrowRight, ShieldCheck, Cpu, Zap, Star 
} from 'lucide-react';

export default function UserGuide({ onStartLearning }) {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: 'Lựa chọn Trình độ & Cấp độ Học sinh',
      desc: 'Hệ thống tự động tùy biến ngân hàng câu hỏi, từ vựng và tốc độ nói của Gia sư AI bám sát trình độ năng lực Tiếng Anh của học sinh.',
      icon: BookOpen,
      color: 'bg-indigo-600',
      badge: 'Bước 1',
      details: [
        'Chọn khung trình độ CEFR (A1 - C1) trên thanh Toolbar phía trên.',
        'Mô hình AI sẽ tự điều chỉnh độ khó khởi điểm và bộ từ vựng tương ứng.',
        'Có thể chuyển đổi cấp độ linh hoạt theo nhu cầu học tập sinh viên/học sinh.'
      ]
    },
    {
      id: 2,
      title: 'Đánh giá Thích ứng IRT (Item Response Theory)',
      desc: 'Áp dụng mô hình toán học 3PL và thuật toán Maximum Fisher Information để xác định chính xác trình độ năng lực Theta (θ) của học sinh.',
      icon: Brain,
      color: 'bg-blue-600',
      badge: 'Bước 2',
      details: [
        'Làm các câu hỏi trắc nghiệm thích ứng trực tiếp trên Dashboard.',
        'Trả lời đúng -> AI tự tăng độ khó câu tiếp theo; Trả lời sai -> AI điều chỉnh giảm độ khó.',
        'Ước lượng năng lực Theta (θ) chuẩn xác từ sơ cấp đến nâng cao.'
      ]
    },
    {
      id: 3,
      title: 'Ôn tập Lặp Ngắt Quãng SuperMemo-2 (SM-2)',
      desc: 'Tối ưu hóa thời điểm ôn tập từ vựng ngắt quãng dựa trên độ nhớ, giúp học sinh ghi nhớ từ vựng lâu dài.',
      icon: Clock,
      color: 'bg-amber-600',
      badge: 'Bước 3',
      details: [
        'Lật thẻ Flashcard để xem phiên âm IPA, phát âm và nghĩa từ vựng.',
        'Đánh giá mức độ nhớ từ 1 đến 5 (Chưa nhớ, Khó nhớ, Nhớ rõ, Rất dễ).',
        'Thuật toán SM-2 tự động tính toán khoảng ngày ôn tập tiếp theo (Interval).'
      ]
    },
    {
      id: 4,
      title: 'Hội thoại Giao tiếp với Gia sư AI',
      desc: 'Trò chuyện tiếng Anh tự do 2 chiều bằng chữ hoặc giọng nói. Tích hợp công nghệ Speech-to-Text Whisper và Text-to-Speech.',
      icon: MessageSquare,
      color: 'bg-purple-600',
      badge: 'Bước 4',
      details: [
        'Nhấn nút Micro để giao tiếp bằng tiếng Anh trực tiếp với AI.',
        'AI Mentor sẽ tự động nghe, phân tích và phản hồi lại giọng đọc.',
        'AI tự động sửa lỗi ngữ pháp và gợi ý từ vựng chuẩn xác hơn.'
      ]
    },
    {
      id: 5,
      title: 'Chấm điểm Phát âm Chi tiết Azure AI',
      desc: 'Phân tích chính xác từng âm tiết, từ vựng và độ trôi chảy khi đọc văn bản tiếng Anh, giúp sửa lỗi phát âm.',
      icon: Award,
      color: 'bg-emerald-600',
      badge: 'Bước 5',
      details: [
        'Chọn mẫu câu gợi ý theo cấp độ hoặc tự nhập đoạn văn bản muốn thực hành.',
        'Ghi âm giọng đọc và gửi lên hệ thống.',
        'Xem bảng phân tích điểm số: Từ phát âm đúng (màu xanh), từ sai (màu đỏ).'
      ]
    },
    {
      id: 6,
      title: 'Dành Cho Giáo Viên: Xáo Đề & Quản Trị Lớp Học THPT',
      desc: 'Công cụ đắc lực hỗ trợ Thầy/Cô xáo đề Word (.docx) chuẩn Bộ GD&ĐT, giao bài online, AI chấm điểm tự động và xuất sổ điểm Excel.',
      icon: Award,
      color: 'bg-amber-600',
      badge: 'Cổng Giáo Viên',
      details: [
        'Tải file Word (.docx / .doc) đề thi trực tiếp từ máy tính lên để xáo 4 mã đề (101-104).',
        'Xuất file Word chuẩn in A4 kèm Bảng Ma Trận Đáp Án Chuẩn.',
        'Tạo lớp học theo khối 10, 11, 12 và cấp mã lớp riêng biệt cho học sinh vào làm bài.',
        'AI chấm điểm tự động ngay khi học sinh nộp bài và xuất Sổ Điểm Excel (.CSV) nộp trường.'
      ]
    }
  ];

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl p-8 glass-card border border-slate-800 text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>HƯỚNG DẪN SỬ DỤNG HỆ THỐNG</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-normal leading-relaxed">
          Các bước Luyện tập Tiếng Anh &amp; Quản Lý Giảng Dạy THPT
        </h1>
        
        <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
          Tích hợp 2 thuật toán cốt lõi <strong className="text-indigo-400">IRT (Đánh giá thích ứng)</strong>, <strong className="text-amber-400">SuperMemo-2 (Lặp ngắt quãng)</strong> &amp; <strong className="text-emerald-400">Cổng Quản Trị Giáo Viên</strong> giúp nâng cao chất lượng dạy và học.
        </p>
      </div>

      {/* Step Selector Horizontal Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = activeStep === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isActive
                  ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${isActive ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
                  {s.badge}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              </div>
              <span className="text-xs font-bold line-clamp-2 leading-snug">{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Step Detail View Box */}
      {(() => {
        const curStep = steps.find(s => s.id === activeStep) || steps[0];
        const Icon = curStep.icon;
        return (
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-slate-800 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center space-x-3">
                <div className={`w-11 h-11 rounded-xl ${curStep.color} flex items-center justify-center text-white shadow shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{curStep.badge}</span>
                  <h2 className="text-xl font-bold text-white">{curStep.title}</h2>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  disabled={activeStep === 1}
                  onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Trang trước
                </button>
                <button
                  disabled={activeStep === steps.length}
                  onClick={() => setActiveStep(prev => Math.min(steps.length, prev + 1))}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1"
                >
                  <span>Trang tiếp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-slate-200 text-sm leading-relaxed font-medium">
              {curStep.desc}
            </p>

            <div className="space-y-3 pt-1">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Chi tiết các thao tác:</h4>
              <div className="space-y-2">
                {curStep.details.map((d, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start space-x-3 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onStartLearning('dashboard')}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition"
              >
                <span>Bắt đầu trải nghiệm ngay</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
