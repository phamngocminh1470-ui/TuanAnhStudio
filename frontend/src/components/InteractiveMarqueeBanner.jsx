import React from 'react';
import { 
  Zap, Mic, MessageSquare, BrainCircuit, BookMarked, 
  PenLine, Camera, Headphones, Sparkles, Flame, CheckCircle2, ShieldCheck, Star
} from 'lucide-react';

export default function InteractiveMarqueeBanner({ onNavigate, onOpenPhotoSolver }) {
  const row1 = [
    {
      id: 'irt-test',
      title: 'Luyện Đề Thích Ứng IRT',
      badge: 'Công nghệ 2PL IRT',
      desc: 'Tự động tăng giảm độ khó theo năng lực',
      icon: Zap,
      color: 'from-blue-500 to-indigo-600',
      badgeColor: 'text-blue-300 bg-blue-500/20 border-blue-500/30',
      action: () => onNavigate && onNavigate('irt-test')
    },
    {
      id: 'pronounce',
      title: 'Phát Âm Chuẩn 44 Âm IPA',
      badge: 'Azure Speech AI',
      desc: 'Phân tích sóng âm & chỉnh từng phụ âm cuối',
      icon: Mic,
      color: 'from-emerald-500 to-teal-600',
      badgeColor: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30',
      action: () => onNavigate && onNavigate('pronounce')
    },
    {
      id: 'chat',
      title: 'Gia Sư Gợi Mở Socrates',
      badge: 'Socratic Method 1:1',
      desc: 'Đàm thoại gợi mở tư duy, không mớm đáp án',
      icon: MessageSquare,
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'text-amber-300 bg-amber-500/20 border-amber-500/30',
      action: () => onNavigate && onNavigate('chat')
    },
    {
      id: 'sm2-flashcards',
      title: 'Thẻ Não Bộ SM-2',
      badge: 'Spaced Repetition',
      desc: 'Lặp lại ngắt quãng khắc sâu trí nhớ dài hạn',
      icon: BrainCircuit,
      color: 'from-purple-500 to-violet-600',
      badgeColor: 'text-purple-300 bg-purple-500/20 border-purple-500/30',
      action: () => onNavigate && onNavigate('sm2-flashcards')
    },
    {
      id: 'vocab-library',
      title: 'Kho Từ Điển Song Ngữ Live',
      badge: 'Full Lexicon SGK',
      desc: 'Tra cứu Anh ↔ Việt tức thì không độ trễ',
      icon: BookMarked,
      color: 'from-cyan-500 to-blue-600',
      badgeColor: 'text-cyan-300 bg-cyan-500/20 border-cyan-500/30',
      action: () => onNavigate && onNavigate('vocab-library')
    }
  ];

  const row2 = [
    {
      id: 'writing-practice',
      title: 'Chữa Viết Luận & Đoạn Văn AI',
      badge: 'Line-by-line Fix',
      desc: 'Sửa ngữ pháp từng câu & bài mẫu điểm 9-10',
      icon: PenLine,
      color: 'from-pink-500 to-rose-600',
      badgeColor: 'text-pink-300 bg-pink-500/20 border-pink-500/30',
      action: () => onNavigate && onNavigate('writing-practice')
    },
    {
      id: 'photo-solver',
      title: 'Chụp Ảnh Giải Đề Thi AI',
      badge: 'Vision OCR 3s',
      desc: 'Nhận diện đề thi từ camera & giải chi tiết',
      icon: Camera,
      color: 'from-amber-400 via-orange-500 to-rose-500',
      badgeColor: 'text-orange-300 bg-orange-500/20 border-orange-500/30',
      action: () => onOpenPhotoSolver && onOpenPhotoSolver()
    },
    {
      id: 'listening',
      title: 'Luyện Nghe Tương Tác Audio',
      badge: 'Native Accent',
      desc: 'Nghe audio bản xứ & bắt từ khóa tự động',
      icon: Headphones,
      color: 'from-violet-500 to-indigo-600',
      badgeColor: 'text-violet-300 bg-violet-500/20 border-violet-500/30',
      action: () => onNavigate && onNavigate('listening')
    },
    {
      id: 'official-exams',
      title: 'Kho Đề Thi Chuẩn Hóa GD&ĐT',
      badge: 'Đề Đổi Mới 2025',
      desc: 'Tuyển tập đề thi chính thức từ các Sở GD',
      icon: ShieldCheck,
      color: 'from-blue-600 to-cyan-500',
      badgeColor: 'text-blue-300 bg-blue-500/20 border-blue-500/30',
      action: () => onNavigate && onNavigate('official-exams')
    },
    {
      id: 'reading',
      title: 'Đọc Hiểu Tương Tác SGK',
      badge: 'Reading AI',
      desc: 'Tự động điều chỉnh bài đọc theo sở thích',
      icon: Sparkles,
      color: 'from-emerald-600 to-teal-500',
      badgeColor: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30',
      action: () => onNavigate && onNavigate('reading')
    }
  ];

  // Nhân đôi mảng để tạo hiệu ứng chạy vòng lặp vô tận mượt mà
  const doubleRow1 = [...row1, ...row1];
  const doubleRow2 = [...row2, ...row2];

  const renderCard = (item, idx) => {
    const Icon = item.icon;
    return (
      <div
        key={idx}
        onClick={item.action}
        className="group relative flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-[#090e21]/80 hover:bg-[#121a38] border border-white/10 hover:border-indigo-500/40 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-indigo-500/10 shrink-0 select-none min-w-[280px] sm:min-w-[320px] backdrop-blur-xl"
      >
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
              {item.title}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 truncate mt-0.5">{item.desc}</p>
        </div>
        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${item.badgeColor} shrink-0`}>
          {item.badge}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full py-4 space-y-3 overflow-hidden relative">
      
      {/* Gradient mờ 2 bên mép để dải chạy vào/ra mượt mà */}
      <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-[#050814] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-[#050814] to-transparent z-10 pointer-events-none" />

      {/* Dòng 1: Chạy từ phải sang trái */}
      <div className="animate-marquee flex gap-3">
        {doubleRow1.map((item, idx) => renderCard(item, idx))}
      </div>

      {/* Dòng 2: Chạy từ trái sang phải */}
      <div className="animate-marquee-reverse flex gap-3">
        {doubleRow2.map((item, idx) => renderCard(item, idx))}
      </div>

    </div>
  );
}
