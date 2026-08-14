"use client";

import { useEffect, useMemo, useRef } from "react";
import { animate, stagger, createScope } from "animejs";

interface ParticleFieldProps {
  count?: number;
  className?: string;
}

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export default function ParticleField({ count = 30, className = "" }: ParticleFieldProps) {
  const root = useRef<HTMLDivElement>(null);

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        size: seeded(i, 1) * 4 + 1,
        isAccent: seeded(i, 2) > 0.5,
        left: seeded(i, 3) * 100,
        top: seeded(i, 4) * 100,
      })),
    [count]
  );

  useEffect(() => {
    if (!root.current) return;

    const scope = createScope({ root }).add(() => {
      const nodes = root.current!.querySelectorAll(".particle");

      animate(nodes, {
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

  return (
    <div ref={root} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden>
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            backgroundColor: p.isAccent ? "var(--accent)" : "var(--accent-secondary)",
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
