/**
 * WasteIQ — CursorTrail Effect Component
 * Canvas-based cursor trail with ghost circles.
 * Only renders on the public landing page, desktop only.
 */
'use client';

import { useEffect, useRef } from 'react';

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animReq: number;
    let mouse = { x: 0, y: 0 };

    // 7 trailing points (main + 6 ghosts)
    const trail = Array.from({ length: 7 }, () => ({ x: 0, y: 0 }));
    const sizes = [40, 28, 20, 14, 10, 6, 4];
    const opacities = [0.08, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01];
    const lerpFactors = [0.12, 0.10, 0.08, 0.06, 0.05, 0.04, 0.03];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < trail.length; i++) {
        const target = i === 0 ? mouse : trail[i - 1];
        trail[i].x += (target.x - trail[i].x) * lerpFactors[i];
        trail[i].y += (target.y - trail[i].y) * lerpFactors[i];

        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, sizes[i] / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 193, 106, ${opacities[i]})`;
        ctx.filter = `blur(${Math.max(10, 20 - i * 3)}px)`;
        ctx.fill();
      }

      ctx.filter = 'none';
      animReq = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    animReq = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animReq);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
