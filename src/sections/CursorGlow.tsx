import { useEffect, useRef, useState, memo } from 'react';

function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const mousePos = useRef({ x: -500, y: -500 });
  const currentPos = useRef({ x: -500, y: -500 });
  const rafId = useRef<number>(0);
  const throttleRef = useRef<number>(0);

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    setIsTouch(isTouchDevice);
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - throttleRef.current < 16) return; // Throttle to ~60fps
      throttleRef.current = now;
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const lerp = 0.15;
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * lerp;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * lerp;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${currentPos.current.x - 200}px, ${currentPos.current.y - 200}px, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (isTouch) return null;

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(255,179,64,0.08), transparent 70%)',
        borderRadius: '50%',
        willChange: 'transform',
      }}
    />
  );
}

export default memo(CursorGlow);
