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
          className="fixed pointer-events-none z-[99999] rounded-full border border-emerald-400/40 animate-ping-once"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
            width: '28px',
            height: '28px'
          }}
        />
      ))}

      {/* Trailing Outer Ring */}
      <div
        ref={trailingRef}
        className={`fixed top-0 left-0 pointer-events-none z-[99998] rounded-full transition-all duration-150 ease-out ${
          isHovered
            ? 'w-7 h-7 bg-emerald-500/5 border border-emerald-400/60'
            : isClicked
            ? 'w-4 h-4 bg-emerald-500/10 border border-emerald-500/60'
            : 'w-5 h-5 border border-white/20'
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
            ? 'w-1.5 h-1.5 bg-emerald-400'
            : isClicked
            ? 'w-1 h-1 bg-emerald-500'
            : 'w-1 h-1 bg-emerald-400'
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
          willChange: 'transform',
        }}
      />
    </>
  );
}
