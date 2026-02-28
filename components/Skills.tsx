"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger, createScope, spring, svg as animeSvg } from "animejs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";
import { skillCategories } from "@/lib/data";

const CATEGORY_ICONS = [
  <svg key="code" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
  <svg key="layers" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
  <svg key="tool" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
];

const CATEGORY_COLORS = [
  { accent: "#00e5ff", secondary: "#0091b3" },
  { accent: "#ff9100", secondary: "#d47600" },
  { accent: "#a855f7", secondary: "#7c3aed" },
];

function SkillOrb({
  skill,
  index,
  isVisible,
  color,
}: {
  skill: { name: string; level: number; years: string; projects: number };
  index: number;
  isVisible: boolean;
  color: { accent: string; secondary: string };
}) {
  const circleRef = useRef<SVGCircleElement>(null);
  const hasAnimated = useRef(false);
  const displayLevel = useCountUp(skill.level, isVisible, {
    duration: 2000,
    delay: index * 100,
  });

  useEffect(() => {
    if (!isVisible || hasAnimated.current || !circleRef.current) return;
    hasAnimated.current = true;
    const circumference = 2 * Math.PI * 28;
    circleRef.current.style.strokeDasharray = `${circumference}`;
    circleRef.current.style.strokeDashoffset = `${circumference}`;
    animate(circleRef.current, {
      strokeDashoffset: circumference * (1 - skill.level / 100),
      duration: 2000,
      delay: index * 100,
      ease: "easeOutQuart",
    });
  }, [isVisible, skill.level, index]);

  return (
    <div className="skill-orb flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--muted)]/50 transition-all group/skill opacity-0 cursor-default">
      <div className="relative w-14 h-14 shrink-0">
        <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
          <circle cx="32" cy="32" r="28" fill="none" stroke="var(--muted)" strokeWidth="3" />
          <circle
            ref={circleRef}
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke={color.accent}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-xs font-bold" style={{ color: color.accent }}>
            {displayLevel}
          </span>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-[var(--foreground)] group-hover/skill:text-[var(--accent)] transition-colors">{skill.name}</div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--muted-foreground)]">
          <span>{skill.years} yrs</span>
          <span className="w-1 h-1 rounded-full bg-[var(--muted-foreground)]" />
          <span>{skill.projects} projects</span>
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.05 });
  const root = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    if (!isVisible || hasAnimated.current || !root.current) return;
    hasAnimated.current = true;

    const scope = createScope({ root }).add(() => {
      animate(".skills-label", {
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 600,
        ease: "easeOutQuart",
      });

      animate(".skills-heading", {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: 100,
        ease: "easeOutQuart",
      });

      animate(".skills-tab", {
        opacity: [0, 1],
        translateY: [20, 0],
        delay: stagger(80, { start: 300 }),
        duration: 600,
        ease: spring({ stiffness: 300, damping: 25 }),
      });

      animate(".skills-panel", {
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 800,
        delay: 400,
        ease: "easeOutQuart",
      });

      animate(".skill-orb", {
        opacity: [0, 1],
        scale: [0.8, 1],
        delay: stagger(50, { start: 500 }),
        duration: 600,
        ease: spring({ stiffness: 200, damping: 20 }),
      });

      const connectors = root.current!.querySelectorAll(".skills-connector");
      if (connectors.length) {
        animate(animeSvg.createDrawable(connectors as any), {
          draw: ["0 0", "0 1"],
          duration: 1500,
          delay: 600,
          ease: "easeInOutQuart",
        });
      }
    });

    return () => scope.revert();
  }, [isVisible]);

  useEffect(() => {
    if (!hasAnimated.current || !root.current) return;
    animate(".skill-orb", {
      opacity: [0, 1],
      scale: [0.85, 1],
      translateY: [15, 0],
      delay: stagger(40),
      duration: 400,
      ease: "easeOutQuart",
    });
  }, [activeCategory]);

  const totalSkills = skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0);
  const avgLevel = Math.round(
    skillCategories.flatMap((c) => c.skills).reduce((acc, s) => acc + s.level, 0) / totalSkills
  );

  return (
    <section id="skills" ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
          <path className="skills-connector" d="M100 400 Q600 300 1100 400" stroke="var(--accent)" strokeWidth="0.3" opacity="0.06" />
          <circle className="skills-connector" cx="600" cy="400" r="300" stroke="var(--accent)" strokeWidth="0.2" opacity="0.04" />
        </svg>
      </div>

      <div ref={root} className="section-container relative">
        <div className="skills-label flex items-center gap-4 mb-6 opacity-0">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--accent)]">
            06 / Skills
          </span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <h2 className="skills-heading text-3xl md:text-4xl font-serif font-bold opacity-0">
            Technical <span className="gradient-text">Arsenal</span>
          </h2>

          <div className="flex items-center gap-6 skills-heading opacity-0">
            <div className="text-center">
              <div className="text-xl font-serif font-bold gradient-text">{totalSkills}</div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--muted-foreground)]">Technologies</div>
            </div>
            <div className="h-8 w-px bg-[var(--border)]" />
            <div className="text-center">
              <div className="text-xl font-serif font-bold gradient-text">{avgLevel}%</div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--muted-foreground)]">Avg Proficiency</div>
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {skillCategories.map((category, ci) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(ci)}
              className={`skills-tab flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs uppercase tracking-wider border transition-all opacity-0 ${
                activeCategory === ci
                  ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10 shadow-[0_0_20px_-5px_var(--accent)]"
                  : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent)]/40 hover:text-[var(--foreground)]"
              }`}
            >
              <span style={{ color: CATEGORY_COLORS[ci].accent }}>{CATEGORY_ICONS[ci]}</span>
              {category.name}
              <span className="ml-1 px-1.5 py-0.5 rounded-md text-[9px] bg-[var(--muted)]">
                {category.skills.length}
              </span>
            </button>
          ))}
        </div>

        {/* Skills panel */}
        <div className="skills-panel glass-card p-6 md:p-8 rounded-2xl opacity-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {skillCategories[activeCategory].skills.map((skill, si) => (
              <SkillOrb
                key={skill.name}
                skill={skill}
                index={si}
                isVisible={isVisible}
                color={CATEGORY_COLORS[activeCategory]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
