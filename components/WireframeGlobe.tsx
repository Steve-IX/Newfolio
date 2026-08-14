"use client";

import { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import OrbitalScene from "@/components/globe/OrbitalScene";

interface WireframeGlobeProps {
  size?: number;
  className?: string;
}

function subscribeLite(onChange: () => void) {
  const mql = window.matchMedia("(max-width: 1023px)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function readIsLite() {
  const narrow = window.matchMedia("(max-width: 1023px)").matches;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const saveData = Boolean(connection?.saveData);
  const coarseGpu = (navigator.hardwareConcurrency ?? 8) <= 4;
  return narrow || saveData || coarseGpu;
}

export default function WireframeGlobe({ size = 650, className = "" }: WireframeGlobeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const lite = useSyncExternalStore(subscribeLite, readIsLite, () => true);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.12, rootMargin: "80px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const frameloop = !inView ? "never" : reduced ? "demand" : "always";

  return (
    <div
      ref={rootRef}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div className="absolute inset-[-18%] rounded-full bg-(--accent) opacity-[0.07] blur-[90px] pointer-events-none" />
      <Canvas
        frameloop={frameloop}
        dpr={lite ? 1 : [1, 1.5]}
        gl={{ antialias: !lite, alpha: true, powerPreference: lite ? "low-power" : "high-performance" }}
        camera={{ position: [0, 0.15, 4.35], fov: 38 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          {!lite && <AdaptiveDpr pixelated={false} />}
          <OrbitalScene lite={lite} reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  );
}
