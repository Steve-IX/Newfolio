"use client";

import { useEffect, useRef } from "react";
import { animate, svg, createScope, stagger } from "animejs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { revealHidden } from "@/lib/motion";

export default function Footer() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.3 });
  const root = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isVisible || hasAnimated.current || !root.current) return;
    hasAnimated.current = true;

    if (reducedMotion) {
      revealHidden(root.current);
      return;
    }

    const scope = createScope({ root }).add(() => {
      const lines = root.current!.querySelectorAll(".footer-line");
      if (lines.length) {
        animate(svg.createDrawable(lines as any), {
          draw: ["0 0", "0 1"],
          duration: 2000,
          delay: stagger(300),
          ease: "easeInOutQuart",
        });
      }

      animate(".footer-content", {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        delay: 500,
        ease: "easeOutQuart",
      });
    });

    return () => scope.revert();
  }, [isVisible, reducedMotion]);

  return (
    <footer ref={sectionRef} className="relative py-12 border-t border-(--border)">
      <div ref={root} className="section-container">
        <svg
          className="absolute top-0 left-0 w-full h-px"
          viewBox="0 0 1200 2"
          preserveAspectRatio="none"
          aria-hidden
        >
          <line
            className="footer-line"
            x1="0"
            y1="1"
            x2="1200"
            y2="1"
            stroke="var(--accent)"
            strokeWidth="2"
          />
        </svg>

        <div className="footer-content flex flex-col md:flex-row items-center justify-between gap-4 opacity-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs tracking-widest uppercase text-(--accent)">
              SA.
            </span>
            <span className="text-xs text-(--muted-foreground)">
              &copy; {new Date().getFullYear()} Stephen Addo
            </span>
          </div>

          <p className="font-mono text-[10px] text-(--muted-foreground) tracking-wider">
            Built with Next.js &middot; Three.js &middot; Anime.js &middot; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
