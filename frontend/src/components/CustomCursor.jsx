import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const cursorRef = useRef(null);
  const trailingRef = useRef(null);

  useEffect(() => {
    // Only on desktop pointer
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    setIsVisible(true);

    let mouseX = -100;
    let mouseY = -100;
    let trailX = -100;
    let trailY = -100;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setPosition({ x: mouseX, y: mouseY });

      const target = e.target;
      const isClickable = target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer, .glass-card, .btn-hero, tr');
      setIsHovered(!!isClickable);
    };

    const handleMouseDown = (e) => {
      setIsClicked(true);
      const newRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      };
      setRipples((prev) => [...prev.slice(-6), newRipple]);
    };

    const handleMouseUp = () => {
      setIsClicked(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    let animationFrameId;
    const animateTrail = () => {
      trailX += (mouseX - trailX) * 0.18;
      trailY += (mouseY - trailY) * 0.18;

      if (trailingRef.current) {
        trailingRef.current.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%)`;
      }
      animationFrameId = requestAnimationFrame(animateTrail);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    animationFrameId = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  if (!isVisible) return null;

  return (
    <>
      {/* Dynamic Laser Shockwave Ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="fixed pointer-events-none z-[99999] rounded-full border border-emerald-400 animate-ping-once"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
            width: '55px',
            height: '55px',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.8), inset 0 0 15px rgba(59, 130, 246, 0.6)'
          }}
        />
      ))}

      {/* Trailing Outer Ring */}
      <div
        ref={trailingRef}
        className={`fixed top-0 left-0 pointer-events-none z-[99998] rounded-full transition-all duration-200 ease-out ${
          isHovered
            ? 'w-14 h-14 bg-emerald-500/10 border border-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.45)] backdrop-blur-[2px]'
            : isClicked
            ? 'w-8 h-8 bg-cyan-500/25 border border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.7)]'
            : 'w-9 h-9 border border-white/25 shadow-[0_0_12px_rgba(255,255,255,0.15)]'
        }`}
        style={{
          willChange: 'transform',
        }}
      />

      {/* Inner Glowing Center Dot */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[99999] rounded-full transition-transform duration-75 ease-out ${
          isHovered
            ? 'w-2.5 h-2.5 bg-emerald-400 shadow-[0_0_15px_#10b981]'
            : isClicked
            ? 'w-3.5 h-3.5 bg-cyan-300 shadow-[0_0_20px_#22d3ee]'
            : 'w-2 h-2 bg-emerald-400 shadow-[0_0_10px_#10b981]'
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
          willChange: 'transform',
        }}
      />
    </>
  );
}
