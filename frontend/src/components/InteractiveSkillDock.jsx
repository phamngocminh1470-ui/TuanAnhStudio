import React, { useState } from 'react';
import { 
  Zap, Mic, MessageSquare, BrainCircuit, BookMarked, 
  PenLine, Camera, Headphones, Sparkles, Volume2, VolumeX, Flame
} from 'lucide-react';

export default function InteractiveSkillDock({ activeTab, onNavigate, onOpenPhotoSolver }) {
  const [isMuted, setIsMuted] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  // Hiệu ứng âm thanh tương tác Web Audio API nhẹ nhàng (Không cần tải file bên ngoài)
  const playInteractiveSound = (type = 'click') => {
    if (isMuted) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'hover') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'click') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch (e) {
      // Ignore if browser blocks audio autoplay
    }
  };

  const skills = [
    {
      id: 'irt-test',
      name: 'Luyện Đề IRT',
      badge: 'Skill 1',
      desc: 'Tự động thích ứng độ khó',
      icon: Zap,
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/30',
      action: () => onNavigate('irt-test')
    },
    {
      id: 'pronounce',
      name: 'Phát Âm IPA',
      badge: 'Skill 2',
      desc: 'Nhận diện 44 âm quốc tế',
      icon: Mic,
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/30',
      action: () => onNavigate('pronounce')
    },
    {
      id: 'chat',
      name: 'Gia Sư AI',
      badge: 'Skill 3',
      desc: 'Đàm thoại gợi mở Socrates',
      icon: MessageSquare,
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/30',
      action: () => onNavigate('chat')
    },
    {
      id: 'sm2-flashcards',
      name: 'Não Bộ SM-2',
      badge: 'Skill 4',
      desc: 'Lặp lại ngắt quãng khoa học',
      icon: BrainCircuit,
      color: 'from-purple-500 to-violet-600',
      shadow: 'shadow-purple-500/30',
      action: () => onNavigate('sm2-flashcards')
    },
    {
      id: 'vocab-library',
      name: 'Từ Điển Live',
      badge: 'Skill 5',
      desc: 'Tra cứu song ngữ tức thì',
      icon: BookMarked,
      color: 'from-cyan-500 to-blue-600',
      shadow: 'shadow-cyan-500/30',
      action: () => onNavigate('vocab-library')
    },
    {
      id: 'writing-practice',
      name: 'Chữa Viết AI',
      badge: 'Skill 6',
      desc: 'Sửa lỗi từng câu & dàn ý',
      icon: PenLine,
      color: 'from-pink-500 to-rose-600',
      shadow: 'shadow-pink-500/30',
      action: () => onNavigate('writing-practice')
    },
    {
      id: 'listening',
      name: 'Luyện Nghe AI',
      badge: 'Skill 7',
      desc: 'Audio bản xứ tương tác',
      icon: Headphones,
      color: 'from-violet-500 to-indigo-600',
      shadow: 'shadow-violet-500/30',
      action: () => onNavigate('listening')
    },
    {
      id: 'photo-solver',
      name: 'Chụp Đề AI',
      badge: 'Tool VIP',
      desc: 'Giải đề thi qua ảnh tức thì',
      icon: Camera,
      color: 'from-amber-400 via-orange-500 to-rose-500',
      shadow: 'shadow-orange-500/40',
      action: () => onOpenPhotoSolver && onOpenPhotoSolver()
    }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] sm:max-w-fit pointer-events-auto select-none animate-slide-up">
      {/* Floating Dock Container */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-[#080d1e]/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/80 ring-1 ring-white/5">
        
        {/* Glow ambient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10 rounded-2xl sm:rounded-3xl blur-xl pointer-events-none" />

        {/* Skill Item Buttons */}
        {skills.map((skill) => {
          const Icon = skill.icon;
          const isActive = activeTab === skill.id;
          const isHovered = hoveredSkill === skill.id;

          return (
            <div key={skill.id} className="relative group">
              <button
                onClick={() => {
                  playInteractiveSound('click');
                  skill.action();
                }}
                onMouseEnter={() => {
                  setHoveredSkill(skill.id);
                  playInteractiveSound('hover');
                }}
                onMouseLeave={() => setHoveredSkill(null)}
                className={`relative flex flex-col items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer ${
                  isActive
                    ? `bg-gradient-to-tr ${skill.color} text-white scale-110 shadow-lg ${skill.shadow} ring-2 ring-white/30`
                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 hover:scale-105'
                }`}
                title={skill.name}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
                
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white shadow-sm shadow-white animate-pulse" />
                )}
              </button>

              {/* Floating Tooltip with Skill Details */}
              {isHovered && (
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-2 rounded-xl bg-[#0d142b] border border-white/15 shadow-xl text-center whitespace-nowrap pointer-events-none animate-fade-in z-50">
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {skill.badge}
                    </span>
                    <span className="text-xs font-bold text-white">{skill.name}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">{skill.desc}</p>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#0d142b]" />
                </div>
              )}
            </div>
          );
        })}

        {/* Divider */}
        <div className="w-[1px] h-6 bg-white/10 mx-0.5" />

        {/* Audio FX Toggle Button */}
        <button
          onClick={() => {
            setIsMuted(!isMuted);
            if (isMuted) playInteractiveSound('click');
          }}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs transition cursor-pointer ${
            !isMuted 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
              : 'bg-white/5 text-slate-500 border border-transparent hover:text-slate-300'
          }`}
          title={!isMuted ? 'Đang bật hiệu ứng âm thanh tương tác' : 'Đã tắt âm thanh'}
        >
          {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

      </div>
    </div>
  );
}
