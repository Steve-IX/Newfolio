"use client";
import { useEffect, useRef, useCallback } from "react";

interface WireframeGlobeProps {
  size?: number;
  className?: string;
}

const PALETTE: [number, number, number][] = [
  [0, 229, 255],
  [0, 200, 240],
  [26, 212, 240],
  [80, 200, 255],
  [255, 145, 0],
  [255, 171, 64],
  [168, 85, 247],
  [124, 58, 237],
  [16, 185, 129],
];

interface GlobeArc {
  pts3d: Float64Array;
  color: [number, number, number];
  pulseOffset: number;
  pulseSpeed: number;
}

export default function WireframeGlobe({ size = 650, className = "" }: WireframeGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const buildArcs = useCallback((R: number): GlobeArc[] => {
    const arcs: GlobeArc[] = [];
    const STEPS = 180;

    for (let lat = -80; lat <= 80; lat += 16) {
      const phi = (lat * Math.PI) / 180;
      const r = R * Math.cos(phi);
      const y = R * Math.sin(phi);
      const pts = new Float64Array((STEPS + 1) * 3);
      for (let i = 0; i <= STEPS; i++) {
        const theta = (2 * Math.PI * i) / STEPS;
        pts[i * 3] = r * Math.cos(theta);
        pts[i * 3 + 1] = y;
        pts[i * 3 + 2] = r * Math.sin(theta);
      }
      arcs.push({
        pts3d: pts,
        color: PALETTE[Math.abs(lat / 16) % PALETTE.length],
        pulseOffset: Math.random(),
        pulseSpeed: 0.15 + Math.random() * 0.2,
      });
    }

    for (let lon = 0; lon < 360; lon += 16) {
      const theta = (lon * Math.PI) / 180;
      const pts = new Float64Array((STEPS + 1) * 3);
      for (let i = 0; i <= STEPS; i++) {
        const phi = (Math.PI * i) / STEPS - Math.PI / 2;
        pts[i * 3] = R * Math.cos(phi) * Math.cos(theta);
        pts[i * 3 + 1] = R * Math.sin(phi);
        pts[i * 3 + 2] = R * Math.cos(phi) * Math.sin(theta);
      }
      arcs.push({
        pts3d: pts,
        color: PALETTE[(lon / 16) % PALETTE.length],
        pulseOffset: Math.random(),
        pulseSpeed: 0.12 + Math.random() * 0.18,
      });
    }

    return arcs;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true })!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const R = size * 0.42;
    const cx = size / 2;
    const cy = size / 2;
    const fov = 800;
    const TILT_X = -0.22;
    const arcs = buildArcs(R);
    const totalPtsPerArc = 181;

    const cosT = Math.cos(TILT_X);
    const sinT = Math.sin(TILT_X);

    let rotY = 0;
    let time = 0;
    let targetRotSpeed = 0.003;
    let rotSpeed = 0.003;

    const projected = new Float64Array(totalPtsPerArc * 3);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left - rect.width / 2) / rect.width,
        y: (e.clientY - rect.top - rect.height / 2) / rect.height,
      };
      targetRotSpeed = 0.003 + Math.abs(mouseRef.current.x) * 0.008;
    };
    const handleLeave = () => {
      mouseRef.current = { x: 0, y: 0 };
      targetRotSpeed = 0.003;
    };
    canvas.style.pointerEvents = "auto";
    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mouseleave", handleLeave);

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      rotSpeed += (targetRotSpeed - rotSpeed) * 0.05;
      rotY += rotSpeed;
      time += 0.016;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      ctx.save();
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.4);
      grad.addColorStop(0, "rgba(0, 229, 255, 0.03)");
      grad.addColorStop(0.5, "rgba(0, 229, 255, 0.015)");
      grad.addColorStop(1, "rgba(0, 229, 255, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.01, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0, 229, 255, 0.07)";
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();

      for (let a = 0; a < arcs.length; a++) {
        const arc = arcs[a];
        const pts3d = arc.pts3d;
        const [cr, cg, cb] = arc.color;
        const pulsePos = ((time * arc.pulseSpeed + arc.pulseOffset) % 1);
        const pulseCentre = pulsePos * totalPtsPerArc;
        const pulseWidth = totalPtsPerArc * 0.22;

        for (let i = 0; i < totalPtsPerArc; i++) {
          const ox = pts3d[i * 3];
          const oy = pts3d[i * 3 + 1];
          const oz = pts3d[i * 3 + 2];

          const rx = ox * cosY - oz * sinY;
          const rz1 = ox * sinY + oz * cosY;

          const ry = oy * cosT - rz1 * sinT;
          const rz = oy * sinT + rz1 * cosT;

          const perspOffset = R * 1.5;
          const s = fov / (fov + rz + perspOffset);
          projected[i * 3] = cx + rx * s;
          projected[i * 3 + 1] = cy - ry * s;
          projected[i * 3 + 2] = rz;
        }

        for (let i = 0; i < totalPtsPerArc - 1; i++) {
          const x1 = projected[i * 3];
          const y1 = projected[i * 3 + 1];
          const z1 = projected[i * 3 + 2];
          const x2 = projected[(i + 1) * 3];
          const y2 = projected[(i + 1) * 3 + 1];
          const z2 = projected[(i + 1) * 3 + 2];

          const depthAvg = (z1 + z2) / 2;
          const depthFactor = Math.max(0.06, Math.min(1, (depthAvg + R * 1.6) / (R * 3.2)));

          let distToPulse = Math.abs(i - pulseCentre);
          if (distToPulse > totalPtsPerArc / 2) distToPulse = totalPtsPerArc - distToPulse;
          const pulseIntensity = Math.max(0, 1 - distToPulse / pulseWidth);
          const pulseCurve = pulseIntensity * pulseIntensity * (3 - 2 * pulseIntensity);

          const baseOpacity = 0.08 * depthFactor;
          const pulseOpacity = pulseCurve * 0.85 * depthFactor;
          const totalOpacity = Math.min(1, baseOpacity + pulseOpacity);

          if (totalOpacity < 0.005) continue;

          const brightness = 1 + pulseCurve * 0.4;
          const r = Math.min(255, Math.round(cr * brightness));
          const g = Math.min(255, Math.round(cg * brightness));
          const b = Math.min(255, Math.round(cb * brightness));

          const lw = 0.3 + pulseCurve * 1.8 * depthFactor;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `rgba(${r},${g},${b},${totalOpacity})`;
          ctx.lineWidth = lw;
          ctx.stroke();

          if (pulseCurve > 0.6) {
            const glowO = pulseCurve * depthFactor * 0.25;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(${Math.min(255, r + 80)},${Math.min(255, g + 80)},${Math.min(255, b + 80)},${glowO})`;
            ctx.lineWidth = lw + 3;
            ctx.stroke();
          }
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("mouseleave", handleLeave);
    };
  }, [size, buildArcs]);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-[-20%] rounded-full bg-[var(--accent)] opacity-[0.05] blur-[100px]" />
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
