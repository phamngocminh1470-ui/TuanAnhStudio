import React from 'react';

export default function DaturaOrbitalSphere({ size = 'md', theme = 'vibrant', className = '' }) {
  const sizeClasses = {
    sm: 'w-48 h-48 sm:w-56 sm:h-56',
    md: 'w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96',
    lg: 'w-80 h-80 sm:w-[400px] sm:h-[400px] md:w-[480px] md:h-[480px]'
  }[size] || 'w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96';

  const isLight = theme === 'light';
  const isVibrant = theme === 'vibrant';

  return (
    <div className={`relative flex items-center justify-center pointer-events-none select-none ${sizeClasses} ${className}`}>
      
      {/* Vầng hào quang êm dịu, không chói */}
      <div className={`absolute w-52 h-52 sm:w-72 sm:h-72 rounded-full blur-[80px] animate-orbit-pulse ${
        isVibrant
          ? 'bg-gradient-to-tr from-blue-600/15 via-cyan-500/12 to-indigo-600/15'
          : (isLight ? 'bg-gradient-to-tr from-black/[0.04] via-emerald-600/[0.05] to-transparent' : 'bg-gradient-to-tr from-white/[0.04] to-transparent')
      }`} />

      {/* Vòng ngoài cùng 1 - Cyan Subtle Ring */}
      <div className={`absolute inset-0 rounded-full flex items-center justify-center animate-spin-3d ${
        isVibrant 
          ? 'border border-cyan-400/25' 
          : (isLight ? 'border border-black/[0.12]' : 'border border-white/[0.1]')
      }`}>
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
          isVibrant 
            ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.5)]' 
            : (isLight ? 'bg-black/80' : 'bg-white/80')
        }`} />
      </div>

      {/* Vòng 2 - Royal Indigo Orbit */}
      <div className={`absolute w-[114%] h-[114%] rounded-full flex items-center justify-center animate-spin-3d-reverse ${
        isVibrant 
          ? 'border border-indigo-400/25' 
          : (isLight ? 'border border-black/[0.08]' : 'border border-white/[0.06]')
      }`}>
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full ${
          isVibrant ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.4)]' : 'bg-emerald-600 shadow-[0_0_6px_rgba(5,150,105,0.4)]'
        }`} />
      </div>

      {/* Vòng Elip 3 - Sapphire Vertical Axis */}
      <div className={`absolute w-[80%] h-[130%] rounded-[100%] rotate-90 animate-spin-3d ${
        isVibrant 
          ? 'border border-blue-400/25' 
          : (isLight ? 'border border-black/[0.1]' : 'border border-white/[0.08] mix-blend-screen')
      }`} />

      {/* Vòng Elip 4 - Violet Diagonal Axis */}
      <div className={`absolute w-[125%] h-[80%] rounded-[100%] -rotate-30 animate-spin-3d-reverse ${
        isVibrant 
          ? 'border border-purple-400/20' 
          : (isLight ? 'border border-black/[0.06]' : 'border border-white/[0.05] mix-blend-screen')
      }`} />

      {/* Lõi Năng Lượng Sapphire & Cyan êm mắt */}
      <div className={`relative z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center shadow-lg ${
        isVibrant
          ? 'bg-gradient-to-br from-blue-900/80 via-indigo-900/80 to-[#0c122c] border-cyan-400/30'
          : (isLight ? 'bg-white border-black/10' : 'bg-[#0d0e14] border-white/15 shadow-xl')
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          isVibrant 
            ? 'bg-cyan-400' 
            : 'bg-emerald-500'
        }`} />
      </div>

    </div>
  );
}
