"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger, svg, createScope, spring, createTimeline } from "animejs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { experiences } from "@/lib/data";
import Image from "next/image";

const ROLE_COLORS: Record<string, string> = {
  "Automation Software Engineer": "#00e5ff",
  "Software Engineer": "#3b82f6",
  "AI Trainer": "#a855f7",
  "BSc Computer Science Graduate": "#10b981",
  "Optical Assistant": "#f59e0b",
  "Optical Consultant": "#f43f5e",
};

export default function Experience() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.05 });
  const root = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isVisible || hasAnimated.current || !root.current) return;
    hasAnimated.current = true;

    const scope = createScope({ root }).add(() => {
      const tl = createTimeline({ defaults: { ease: "easeOutQuart" } });

      tl.add(".experience-label", {
        opacity: [0, 1],
        translateX: [-30, 0],
        duration: 700,
      })
      .add(".experience-heading", {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
      }, 100)
      .add(".experience-summary-stat", {
        opacity: [0, 1],
        scale: [0.8, 1],
        delay: stagger(80),
        duration: 500,
        ease: spring({ stiffness: 300, damping: 20 }),
      }, 300);

      const timelineLines = root.current!.querySelectorAll(".timeline-line");
      if (timelineLines.length) {
        animate(svg.createDrawable(timelineLines as any), {
          draw: ["0 0", "0 1"],
          duration: 3000,
          ease: "easeInOutQuart",
          delay: 500,
        });
      }

      const connectorLines = root.current!.querySelectorAll(".exp-connector");
      if (connectorLines.length) {
        animate(svg.createDrawable(connectorLines as any), {
          draw: ["0 0", "0 1"],
          duration: 1000,
          delay: stagger(200, { start: 800 }),
          ease: "easeOutQuart",
        });
      }

      animate(".timeline-node", {
        scale: [0, 1],
        opacity: [0, 1],
        delay: stagger(150, { start: 600 }),
        duration: 600,
        ease: spring({ stiffness: 300, damping: 15 }),
      });

      animate(".experience-card", {
        opacity: [0, 1],
        translateY: [50, 0],
        delay: stagger(120, { start: 700 }),
        duration: 800,
      });

      animate(".exp-bullet", {
        opacity: [0, 1],
        translateX: [-15, 0],
        delay: stagger(40, { start: 1200 }),
        duration: 400,
      });

      animate(".timeline-energy", {
        translateY: ["-100%", "800%"],
        opacity: [0, 1, 1, 0],
        duration: 4000,
        loop: true,
        ease: "easeInOutSine",
        delay: 2000,
      });

      animate(".timeline-node-inner", {
        boxShadow: [
          { to: "0 0 0px var(--accent)" },
          { to: "0 0 15px var(--accent)" },
          { to: "0 0 0px var(--accent)" },
        ],
        duration: 3000,
        loop: true,
        ease: "easeInOutSine",
        delay: stagger(400, { start: 1500 }),
      });
    });

    return () => scope.revert();
  }, [isVisible]);

  const handleCardEnter = (e: React.MouseEvent, idx: number) => {
    setActiveIndex(idx);
    animate(e.currentTarget, {
      translateY: -4,
      duration: 300,
      ease: spring({ stiffness: 400, damping: 25 }),
    });
    const logo = e.currentTarget.querySelector(".exp-logo");
    if (logo) {
      animate(logo, {
        scale: 1.1,
        rotate: "3deg",
        duration: 400,
        ease: spring({ stiffness: 300, damping: 12 }),
      });
    }
  };

  const handleCardLeave = (e: React.MouseEvent) => {
    setActiveIndex(null);
    animate(e.currentTarget, {
      translateY: 0,
      duration: 300,
      ease: spring({ stiffness: 400, damping: 25 }),
    });
    const logo = e.currentTarget.querySelector(".exp-logo");
    if (logo) {
      animate(logo, {
        scale: 1,
        rotate: "0deg",
        duration: 400,
        ease: spring({ stiffness: 300, damping: 12 }),
      });
    }
  };

  return (
    <section id="experience" ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
          <path className="exp-connector" d="M100 100 Q300 400 100 700" stroke="var(--accent)" strokeWidth="0.3" opacity="0.05" />
          <path className="exp-connector" d="M1100 100 Q900 400 1100 700" stroke="var(--accent-secondary)" strokeWidth="0.3" opacity="0.04" />
        </svg>
      </div>

      <div ref={root} className="section-container relative">
        <div className="experience-label flex items-center gap-4 mb-6 opacity-0">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--accent)]">
            03 / Experience
          </span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <h2 className="experience-heading text-3xl md:text-4xl font-serif font-bold opacity-0">
            Professional <span className="gradient-text">Journey</span>
          </h2>
          <div className="flex items-center gap-5 experience-heading opacity-0">
            {[
              { val: "7", label: "Roles" },
              { val: "3+", label: "Years" },
              { val: "4", label: "Industries" },
            ].map((s) => (
              <div key={s.label} className="experience-summary-stat text-center opacity-0">
                <div className="text-lg font-serif font-bold gradient-text">{s.val}</div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--muted-foreground)]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline layout */}
        <div className="relative">
          {/* Central timeline line (desktop) */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 hidden md:block">
            <svg className="w-[2px] h-full" preserveAspectRatio="none">
              <line
                className="timeline-line"
                x1="1" y1="0" x2="1" y2="100%"
                stroke="var(--accent)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="timeline-energy absolute left-1/2 -translate-x-1/2 w-1.5 h-8 rounded-full bg-gradient-to-b from-transparent via-[var(--accent)] to-transparent opacity-0" />
          </div>

          {/* Mobile timeline line */}
          <div className="absolute left-3 top-0 bottom-0 md:hidden">
            <svg className="w-[2px] h-full" preserveAspectRatio="none">
              <line
                className="timeline-line"
                x1="1" y1="0" x2="1" y2="100%"
                stroke="var(--accent)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <div className="space-y-6 md:space-y-8">
            {experiences.map((exp, i) => {
              const color = ROLE_COLORS[exp.role] || "var(--accent)";
              const isActive = activeIndex === i;

              return (
                <div
                  key={exp.company + exp.role}
                  className="experience-card relative flex items-start opacity-0"
                  onMouseEnter={(e) => handleCardEnter(e, i)}
                  onMouseLeave={handleCardLeave}
                >
                  {/* Timeline node */}
                  <div className="timeline-node absolute left-3 md:left-8 top-8 -translate-x-1/2 z-10 opacity-0">
                    <div
                      className="w-4 h-4 rounded-full border-[3px] transition-all duration-300"
                      style={{
                        borderColor: color,
                        backgroundColor: isActive ? color : "var(--background)",
                        boxShadow: isActive ? `0 0 12px ${color}60` : "none",
                      }}
                    />
                  </div>

                  {/* Card */}
                  <div className={`ml-10 md:ml-20 flex-1 glass-card rounded-xl overflow-hidden transition-all duration-300 ${isActive ? "border-[var(--accent)]/30 shadow-lg" : ""}`}>
                    {/* Top accent bar */}
                    <div
                      className="h-[2px] transition-all duration-500"
                      style={{
                        background: `linear-gradient(90deg, ${color}, transparent)`,
                        opacity: isActive ? 1 : 0.3,
                      }}
                    />

                    <div className="p-5 md:p-6">
                      <div className="flex items-start gap-4">
                        {/* Logo */}
                        <div
                          className="exp-logo w-11 h-11 rounded-lg bg-[var(--muted)] flex items-center justify-center overflow-hidden shrink-0 border border-[var(--border)] transition-all"
                          style={{ borderColor: isActive ? `${color}40` : undefined }}
                        >
                          <Image
                            src={exp.logo}
                            alt={exp.company}
                            width={36}
                            height={36}
                            className="object-contain w-auto h-auto"
                          />
                        </div>

                        {/* Title block */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-0.5">
                            <h3 className="text-base font-serif font-bold text-[var(--foreground)] leading-tight">
                              {exp.role}
                            </h3>
                            <span
                              className="inline-flex px-2 py-0.5 rounded-md font-mono text-[9px] uppercase tracking-wider border"
                              style={{ color, borderColor: `${color}30`, backgroundColor: `${color}08` }}
                            >
                              {exp.company}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-[var(--muted-foreground)]">
                              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                              <path d="M8 4v4l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <span className="font-mono text-[11px] text-[var(--muted-foreground)]">
                              {exp.period}
                            </span>
                          </div>
                        </div>

                        {/* Index badge */}
                        <div
                          className="hidden sm:flex w-7 h-7 rounded-full items-center justify-center font-mono text-[10px] font-bold shrink-0 transition-colors"
                          style={{
                            color: isActive ? color : "var(--muted-foreground)",
                            borderWidth: 1,
                            borderColor: isActive ? `${color}40` : "var(--border)",
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </div>
                      </div>

                      {/* Bullets */}
                      <div className="mt-4 space-y-2 pl-0 md:pl-[60px]">
                        {exp.bullets.map((bullet, j) => (
                          <div
                            key={j}
                            className="exp-bullet flex items-start gap-2.5 text-sm text-[var(--muted-foreground)] leading-relaxed opacity-0"
                          >
                            <svg viewBox="0 0 8 8" className="w-1.5 h-1.5 mt-[7px] shrink-0" style={{ fill: color }}>
                              <circle cx="4" cy="4" r="4" />
                            </svg>
                            {bullet}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timeline end cap */}
          <div className="absolute left-3 md:left-8 bottom-0 -translate-x-1/2">
            <div className="w-2 h-2 rounded-full bg-[var(--muted-foreground)] opacity-30" />
          </div>
        </div>
      </div>
    </section>
  );
}
