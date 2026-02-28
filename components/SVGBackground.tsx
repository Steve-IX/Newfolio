"use client";

import { useEffect, useRef } from "react";
import { animate, svg, stagger, createScope } from "animejs";

export default function SVGBackground() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;

    const scope = createScope({ root }).add(() => {
      const lines = root.current!.querySelectorAll(".draw-line");
      if (lines.length === 0) return;

      const drawables = svg.createDrawable(lines as any);

      animate(drawables, {
        draw: ["0 0", "0 1"],
        ease: "easeInOutQuad",
        duration: 3000,
        delay: stagger(200),
        loop: true,
        alternate: true,
      });
    });

    return () => scope.revert();
  }, []);

  return (
    <div ref={root} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <svg
        className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.07]"
        viewBox="0 0 600 600"
        fill="none"
      >
        <path
          className="draw-line"
          d="M100 50 L500 50 L500 250 L300 250 L300 450 L500 450 L500 550 L100 550 L100 350 L300 350 L300 150 L100 150 Z"
          stroke="var(--accent)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          className="draw-line"
          d="M50 100 L550 100"
          stroke="var(--accent)"
          strokeWidth="0.5"
        />
        <path
          className="draw-line"
          d="M50 300 L550 300"
          stroke="var(--accent-secondary)"
          strokeWidth="0.5"
        />
        <path
          className="draw-line"
          d="M50 500 L550 500"
          stroke="var(--accent)"
          strokeWidth="0.5"
        />
        <circle
          className="draw-line"
          cx="300"
          cy="300"
          r="120"
          stroke="var(--accent)"
          strokeWidth="0.5"
        />
        <circle
          className="draw-line"
          cx="300"
          cy="300"
          r="200"
          stroke="var(--accent-secondary)"
          strokeWidth="0.3"
        />
      </svg>

      <svg
        className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-[0.05]"
        viewBox="0 0 400 400"
        fill="none"
      >
        <path
          className="draw-line"
          d="M20 380 L200 20 L380 380 Z"
          stroke="var(--accent-secondary)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          className="draw-line"
          d="M100 380 L200 120 L300 380"
          stroke="var(--accent)"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}
