"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, createScope, spring, svg as animeSvg } from "animejs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";
import { achievements } from "@/lib/data";

const ICONS = [
  <svg key="lc" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v15A2.5 2.5 0 0 0 9.5 22h5a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 14.5 2h-5z" /><path d="M12 18h.01" /></svg>,
  <svg key="users" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  <svg key="zap" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  <svg key="award" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>,
  <svg key="clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  <svg key="folder" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>,
];

function AchievementCard({
  achievement,
  index,
  isVisible,
}: {
  achievement: (typeof achievements)[0];
  index: number;
  isVisible: boolean;
}) {
  const value = useCountUp(achievement.numericValue, isVisible, {
    duration: 2500,
    delay: index * 200,
  });
  const ringRef = useRef<SVGCircleElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current || !ringRef.current) return;
    hasAnimated.current = true;
    const circumference = 2 * Math.PI * 36;
    const target = Math.min(achievement.numericValue / 100, 1);
    ringRef.current.style.strokeDasharray = `${circumference}`;
    ringRef.current.style.strokeDashoffset = `${circumference}`;
    animate(ringRef.current, {
      strokeDashoffset: circumference * (1 - target),
      duration: 2500,
      delay: index * 200,
      ease: "easeOutQuart",
    });
  }, [isVisible, achievement.numericValue, index]);

  return (
    <div className="achievement-card glass-card p-6 text-center group opacity-0 relative overflow-hidden">
      <div className="absolute -top-6 -right-6 w-24 h-24 opacity-[0.03]">
        <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="var(--accent)" strokeWidth="8" fill="none" /></svg>
      </div>

      <div className="relative w-20 h-20 mx-auto mb-4">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="36" fill="none" stroke="var(--muted)" strokeWidth="3" />
          <circle
            ref={ringRef}
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="url(#achievementGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="achievementGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--accent-secondary)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[var(--accent)]">
          {ICONS[index] || ICONS[0]}
        </div>
      </div>

      <div className="text-3xl md:text-4xl font-serif font-bold gradient-text mb-1">
        {value}
        {achievement.suffix}
      </div>
      <div className="text-xs font-mono uppercase tracking-wider text-[var(--foreground)] mb-1">
        {achievement.label}
      </div>
      <div className="text-[10px] text-[var(--muted-foreground)]">
        {achievement.description}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

export default function Achievements() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const root = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current || !root.current) return;
    hasAnimated.current = true;

    const scope = createScope({ root }).add(() => {
      animate(".achievements-label", {
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 600,
        ease: "easeOutQuart",
      });

      animate(".achievement-card", {
        opacity: [0, 1],
        translateY: [80, 0],
        rotateY: ["15deg", "0deg"],
        scale: [0.85, 1],
        delay: stagger(120, { start: 200 }),
        duration: 1000,
        ease: spring({ stiffness: 150, damping: 20 }),
      });

      const lines = root.current!.querySelectorAll(".achievement-connector");
      if (lines.length) {
        animate(animeSvg.createDrawable(lines as any), {
          draw: ["0 0", "0 1"],
          duration: 1500,
          delay: 800,
          ease: "easeInOutQuart",
        });
      }

      animate(".achievement-heading", {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: 100,
        ease: "easeOutQuart",
      });
    });

    return () => scope.revert();
  }, [isVisible]);

  return (
    <section id="achievements" ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
      <div ref={root} className="section-container relative">
        <div className="achievements-label flex items-center gap-4 mb-6 opacity-0">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--accent)]">
            02 / Achievements
          </span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <h2 className="achievement-heading text-3xl md:text-4xl font-serif font-bold mb-12 opacity-0">
          Impact in <span className="gradient-text">Numbers</span>
        </h2>

        <svg className="absolute top-1/2 left-0 right-0 w-full h-1 pointer-events-none" aria-hidden>
          <line className="achievement-connector" x1="10%" y1="0" x2="90%" y2="0" stroke="var(--accent)" strokeWidth="1" opacity="0.1" />
        </svg>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {achievements.map((achievement, i) => (
            <AchievementCard
              key={achievement.label}
              achievement={achievement}
              index={i}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
