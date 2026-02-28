"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, createScope } from "animejs";

interface ParticleFieldProps {
  count?: number;
  className?: string;
}

export default function ParticleField({ count = 30, className = "" }: ParticleFieldProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;

    const scope = createScope({ root }).add(() => {
      const particles = root.current!.querySelectorAll(".particle");

      animate(particles, {
        translateX: () => `${Math.random() * 100 - 50}px`,
        translateY: () => `${Math.random() * 80 - 40}px`,
        scale: () => [0, Math.random() * 0.8 + 0.2],
        opacity: () => [0, Math.random() * 0.5 + 0.1],
        duration: () => Math.random() * 4000 + 3000,
        delay: stagger(100, { from: "center" }),
        loop: true,
        alternate: true,
        ease: "easeInOutSine",
      });
    });

    return () => scope.revert();
  }, []);

  const particles = Array.from({ length: count }, (_, i) => {
    const size = Math.random() * 4 + 1;
    const isAccent = Math.random() > 0.5;
    return (
      <div
        key={i}
        className="particle absolute rounded-full"
        style={{
          width: size,
          height: size,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          backgroundColor: isAccent ? "var(--accent)" : "var(--accent-secondary)",
          opacity: 0,
        }}
      />
    );
  });

  return (
    <div ref={root} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden>
      {particles}
    </div>
  );
}
