import React, { useState } from 'react';
import { 
  Zap, Mic, MessageSquare, BrainCircuit, BookMarked, 
  PenLine, Camera, Headphones, Sparkles, Volume2, VolumeX, X, ChevronUp
} from 'lucide-react';

export default function InteractiveSkillDock({ activeTab, onNavigate, onOpenPhotoSolver }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  // Hiệu ứng âm thanh click nhẹ nhàng
  const playSound = () => {
    if (isMuted) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  const skills = [
    {
      id: 'irt-test',
      name: 'Luyện Đề IRT',
      badge: 'Thích ứng',
      desc: 'Tự điều chỉnh độ khó',
      icon: Zap,
      color: 'from-blue-500 to-indigo-600',
      action: () => onNavigate('irt-test')
    },
    {
      id: 'pronounce',
      name: 'Phát Âm IPA',
      badge: '44 Âm',
      desc: 'Nhận diện sóng âm chi tiết',
      icon: Mic,
      color: 'from-emerald-500 to-teal-600',
      action: () => onNavigate('pronounce')
    },
    {
      id: 'chat',
      name: 'Gia Sư AI',
      badge: 'Socrates',
      desc: 'Đàm thoại gợi mở tư duy',
      icon: MessageSquare,
      color: 'from-amber-500 to-orange-600',
      action: () => onNavigate('chat')
    },
    {
      id: 'sm2-flashcards',
      name: 'Não Bộ SM-2',
      badge: 'Trí nhớ',
      desc: 'Lặp lại ngắt quãng khoa học',
      icon: BrainCircuit,
      color: 'from-purple-500 to-violet-600',
      action: () => onNavigate('sm2-flashcards')
    },
    {
      id: 'vocab-library',
      name: 'Từ Điển Live',
      badge: 'Song ngữ',
      desc: 'Tra cứu Anh - Việt tức thì',
      icon: BookMarked,
      color: 'from-cyan-500 to-blue-600',
      action: () => onNavigate('vocab-library')
    },
    {
      id: 'writing-practice',
      name: 'Chữa Viết AI',
      badge: 'Viết luận',
      desc: 'Sửa lỗi từng câu & dàn ý',
      icon: PenLine,
      color: 'from-pink-500 to-rose-600',
      action: () => onNavigate('writing-practice')
    },
    {
      id: 'listening',
      name: 'Luyện Nghe AI',
      badge: 'Audio',
      desc: 'Nghe tương tác bản xứ',
      icon: Headphones,
      color: 'from-violet-500 to-indigo-600',
      action: () => onNavigate('listening')
    },
    {
      id: 'photo-solver',
      name: 'Chụp Đề Thi',
      badge: 'VIP',
      desc: 'Giải đề qua ảnh chụp',
      icon: Camera,
      color: 'from-amber-400 via-orange-500 to-rose-500',
      action: () => onOpenPhotoSolver && onOpenPhotoSolver()
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto select-none">
      
      {/* 1. POPUP MENU KHI BUNG RA (Không che khung chat) */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 sm:w-80 rounded-3xl bg-[#090e21]/95 backdrop-blur-2xl border border-white/10 shadow-2xl p-4 space-y-3 animate-scale-in ring-1 ring-white/10">
          
          {/* Header popup */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-outfit">Bộ Công Cụ &amp; Skill AI</h4>
                <p className="text-[10px] text-gray-400">Chọn nhanh tính năng học tập</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                title={!isMuted ? 'Đang bật âm thanh' : 'Đã tắt âm'}
              >
                {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  playSound();
                  setIsOpen(false);
                }}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                title="Đóng menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid 8 Skills */}
          <div className="grid grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1">
            {skills.map((skill) => {
              const Icon = skill.icon;
              const isActive = activeTab === skill.id;

              return (
                <button
                  key={skill.id}
                  onClick={() => {
                    playSound();
                    skill.action();
                    setIsOpen(false);
                  }}
                  className={`p-2.5 rounded-2xl text-left transition-all duration-200 cursor-pointer flex items-center gap-2.5 border ${
                    isActive
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-md'
                      : 'bg-white/[0.03] border-white/5 hover:bg-white/10 hover:border-white/15 text-slate-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${skill.color} flex items-center justify-center text-white shadow-md shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold text-white block truncate">{skill.name}</span>
                    <span className="text-[9px] text-gray-400 block truncate">{skill.badge}</span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      )}

      {/* 2. NÚT TRÒN MINI NHỎ GỌN TẠI GÓC PHẢI (Không bao giờ che ô nhập chat) */}
      <button
        onClick={() => {
          playSound();
          setIsOpen(!isOpen)}
        }
        className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 cursor-pointer shadow-xl ${
          isOpen
            ? 'bg-rose-600 text-white shadow-rose-600/40 rotate-90 scale-105'
            : 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-indigo-600/40 hover:scale-110 hover:shadow-indigo-600/60 ring-2 ring-white/20'
        }`}
        title="Mở nhanh bộ Skill & Công cụ AI"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-[7px] font-black uppercase tracking-tighter mt-0.5">Skills</span>
          </div>
        )}

        {/* Glow effect */}
        <span className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 blur-md opacity-30 -z-10 animate-pulse" />
      </button>

    </div>
  );
}
