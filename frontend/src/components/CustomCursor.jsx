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
    // Only run on non-touch devices
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

      // Check if hovering over clickable element
      const target = e.target;
      const isClickable = target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer, .glass-card, .btn-hero');
      setIsHovered(!!isClickable);
    };

    const handleMouseDown = (e) => {
      setIsClicked(true);
      const newRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      };
      setRipples((prev) => [...prev.slice(-5), newRipple]);
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

    // Smooth trailing animation loop
    let animationFrameId;
    const animateTrail = () => {
      trailX += (mouseX - trailX) * 0.2;
      trailY += (mouseY - trailY) * 0.2;

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

  // Clean up ripples
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  if (!isVisible) return null;

  return (
    <>
      {/* Dynamic Cursor Click Ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="fixed pointer-events-none z-[99999] rounded-full border border-cyan-400/80 animate-ping-once"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
            width: '45px',
            height: '45px',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.6), inset 0 0 10px rgba(99, 102, 241, 0.4)'
          }}
        />
      ))}

      {/* Trailing Outer Ring */}
      <div
        ref={trailingRef}
        className={`fixed top-0 left-0 pointer-events-none z-[99998] rounded-full transition-all duration-150 ease-out ${
          isHovered
            ? 'w-12 h-12 bg-cyan-500/10 border border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.4)] backdrop-blur-[1px]'
            : isClicked
            ? 'w-7 h-7 bg-indigo-500/20 border border-indigo-400/80 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
            : 'w-8 h-8 border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]'
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
            ? 'w-2 h-2 bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-[0_0_12px_#06b6d4]'
            : isClicked
            ? 'w-3 h-3 bg-gradient-to-tr from-pink-500 to-purple-500 shadow-[0_0_15px_#ec4899]'
            : 'w-2 h-2 bg-cyan-400 shadow-[0_0_8px_#38bdf8]'
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
          willChange: 'transform',
        }}
      />
    </>
  );
}
