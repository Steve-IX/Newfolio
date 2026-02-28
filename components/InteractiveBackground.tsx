"use client";

import { useEffect, useRef, useCallback } from "react";

const GRID_SPACING = 50;
const INFLUENCE_RADIUS = 160;
const DOT_BASE_SIZE = 1.2;
const DOT_MAX_SIZE = 3.5;
const LINE_DISTANCE = 100;

interface Dot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  hue: number;
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const frameRef = useRef<number>(0);
  const reducedMotionRef = useRef(false);

  const initDots = useCallback((width: number, height: number) => {
    const dots: Dot[] = [];
    const cols = Math.ceil(width / GRID_SPACING) + 2;
    const rows = Math.ceil(height / GRID_SPACING) + 2;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dots.push({
          x: col * GRID_SPACING,
          y: row * GRID_SPACING,
          baseX: col * GRID_SPACING,
          baseY: row * GRID_SPACING,
          size: DOT_BASE_SIZE,
          opacity: 0.08,
          hue: 0,
        });
      }
    }
    dotsRef.current = dots;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mql.matches;
    const motionHandler = (e: MediaQueryListEvent) => { reducedMotionRef.current = e.matches; };
    mql.addEventListener("change", motionHandler);

    const ctx = canvas.getContext("2d")!;
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initDots(window.innerWidth, window.innerHeight);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    const accentCyan = { r: 0, g: 229, b: 255 };
    const accentOrange = { r: 255, g: 145, b: 0 };

    const draw = () => {
      if (reducedMotionRef.current) {
        frameRef.current = requestAnimationFrame(draw);
        return;
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      ctx.clearRect(0, 0, vw, vh);

      const { x: mx, y: my } = mouseRef.current;
      const dots = dotsRef.current;
      const activeDots: Dot[] = [];

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const dx = mx - dot.baseX;
        const dy = my - dot.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / INFLUENCE_RADIUS);

        const targetSize = DOT_BASE_SIZE + (DOT_MAX_SIZE - DOT_BASE_SIZE) * influence;
        const targetOpacity = 0.08 + 0.45 * influence;

        dot.size += (targetSize - dot.size) * 0.12;
        dot.opacity += (targetOpacity - dot.opacity) * 0.12;

        const displaceStrength = 12 * influence;
        const angle = Math.atan2(dy, dx);
        const targetX = dot.baseX - Math.cos(angle) * displaceStrength;
        const targetY = dot.baseY - Math.sin(angle) * displaceStrength;
        dot.x += (targetX - dot.x) * 0.1;
        dot.y += (targetY - dot.y) * 0.1;

        dot.hue = influence;

        const r = Math.round(accentCyan.r + (accentOrange.r - accentCyan.r) * influence);
        const g = Math.round(accentCyan.g + (accentOrange.g - accentCyan.g) * influence);
        const b = Math.round(accentCyan.b + (accentOrange.b - accentCyan.b) * influence);

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${dot.opacity})`;
        ctx.fill();

        if (influence > 0.05) activeDots.push(dot);
      }

      ctx.lineWidth = 0.5;
      for (let i = 0; i < activeDots.length; i++) {
        for (let j = i + 1; j < activeDots.length; j++) {
          const a = activeDots[i];
          const b = activeDots[j];
          const ddx = a.x - b.x;
          const ddy = a.y - b.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < LINE_DISTANCE) {
            const lineOpacity = (1 - d / LINE_DISTANCE) * 0.15 * Math.min(a.opacity, b.opacity) * 4;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${lineOpacity})`;
            ctx.stroke();
          }
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      document.removeEventListener("mouseleave", handleMouseLeave);
      mql.removeEventListener("change", motionHandler);
    };
  }, [initDots]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden
    />
  );
}
