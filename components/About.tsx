"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, splitText, svg, createScope } from "animejs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { personalInfo } from "@/lib/data";

export default function About() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const root = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current || !root.current) return;
    hasAnimated.current = true;

    const scope = createScope({ root }).add(() => {
      const quoteEl = root.current!.querySelector(".pull-quote") as HTMLElement;
      if (quoteEl) {
        quoteEl.style.opacity = "1";
        const quoteSplit = splitText(quoteEl, { chars: { wrap: "clip" } });
        quoteSplit.chars.forEach((c: HTMLElement) => (c.style.opacity = "0"));
        animate(quoteSplit.chars, {
          opacity: [0, 1],
          translateY: ["100%", "0%"],
          filter: ["blur(6px)", "blur(0px)"],
          delay: stagger(18),
          duration: 600,
          ease: "easeOutQuart",
        });

        quoteSplit.addEffect(({ chars }) => {
          return animate(chars, {
            opacity: [
              { to: 1 },
              { to: 0.6, delay: 4000 },
              { to: 1, delay: 200 },
            ],
            delay: stagger(30, { start: 3000 }),
            duration: 5000,
            loop: true,
            ease: "easeInOutSine",
          });
        });
      }

      animate(".about-paragraph", {
        opacity: [0, 1],
        translateY: [40, 0],
        delay: stagger(120, { start: 300 }),
        duration: 900,
        ease: "easeOutQuart",
      });

      animate(".about-label", {
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 600,
        delay: 200,
        ease: "easeOutQuart",
      });

      const drawables = root.current!.querySelectorAll(".about-line");
      if (drawables.length) {
        animate(svg.createDrawable(drawables as any), {
          draw: ["0 0", "0 1"],
          duration: 1500,
          delay: stagger(200),
          ease: "easeInOutQuart",
        });
      }
    });

    return () => scope.revert();
  }, [isVisible]);

  return (
    <section id="about" ref={sectionRef} className="section-padding relative">
      <div ref={root} className="section-container">
        {/* Section label */}
        <div className="about-label flex items-center gap-4 mb-16 opacity-0">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--accent)]">
            01 / About
          </span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Pull quote - left side */}
          <div className="lg:col-span-5 relative">
            <svg
              className="absolute -top-4 -left-4 w-[120%] h-[120%] pointer-events-none"
              viewBox="0 0 400 300"
              fill="none"
              aria-hidden
            >
              <path
                className="about-line"
                d="M0 0 L50 0 L50 50"
                stroke="var(--accent)"
                strokeWidth="1"
              />
              <path
                className="about-line"
                d="M400 300 L350 300 L350 250"
                stroke="var(--accent-secondary)"
                strokeWidth="1"
              />
            </svg>

            <blockquote className="relative">
              <span className="absolute -top-8 -left-4 text-6xl font-serif text-[var(--accent)]/20">
                &ldquo;
              </span>
              <p
                className="pull-quote text-2xl md:text-3xl lg:text-4xl font-serif leading-snug text-[var(--foreground)]"
                style={{ opacity: 0 }}
              >
                {personalInfo.pullQuote}
              </p>
            </blockquote>
          </div>

          {/* Body text - right side */}
          <div className="lg:col-span-7 space-y-6">
            {personalInfo.about.map((paragraph, i) => (
              <p
                key={i}
                className="about-paragraph text-base md:text-lg leading-relaxed text-[var(--muted-foreground)] opacity-0"
              >
                {paragraph}
              </p>
            ))}

            <div className="about-paragraph pt-4 flex flex-wrap gap-3 opacity-0">
              {["Lancaster University", "BDO UK", "FDM Group", "AI & Quantum"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 font-mono text-xs tracking-wider text-[var(--accent)] border border-[var(--accent)]/20 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
