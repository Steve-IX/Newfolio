"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger, createScope, spring, svg as animeSvg } from "animejs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { projects } from "@/lib/data";
import ProjectModal from "./ProjectModal";

const PROJECT_COLORS = [
  { from: "#00e5ff", to: "#0091b3" },
  { from: "#ff9100", to: "#d47600" },
  { from: "#a855f7", to: "#7c3aed" },
  { from: "#10b981", to: "#059669" },
  { from: "#f43f5e", to: "#e11d48" },
  { from: "#3b82f6", to: "#2563eb" },
];

function ProjectCard({
  project,
  index,
  onSelect,
}: {
  project: (typeof projects)[0];
  index: number;
  isVisible?: boolean;
  onSelect: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const colors = PROJECT_COLORS[index % PROJECT_COLORS.length];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !glowRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glowRef.current.style.background = `radial-gradient(300px circle at ${x}px ${y}px, ${colors.from}15, transparent 60%)`;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;
    cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !glowRef.current) return;
    cardRef.current.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale(1)";
    glowRef.current.style.background = "transparent";
  };

  return (
    <div
      ref={cardRef}
      className="project-card glass-card relative group opacity-0 overflow-hidden transition-transform duration-200 cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div ref={glowRef} className="absolute inset-0 pointer-events-none transition-all duration-200 z-0" />

      {/* Thumbnail preview */}
      <div className="relative w-full h-44 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.images[0]}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-[var(--card)]/20 to-transparent" />

        {/* Expand hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-5 h-5">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </div>
        </div>

        {/* Number badge */}
        <div
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold backdrop-blur-sm"
          style={{ color: colors.from, border: `1px solid ${colors.from}60`, backgroundColor: `${colors.from}10` }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      <div className="relative z-10 p-6 md:p-8">
        <svg className="absolute top-0 right-0 w-20 h-20 opacity-[0.06]" viewBox="0 0 80 80">
          <path d="M80 0 L80 80 L0 80" fill="none" stroke={colors.from} strokeWidth="1.5" />
          <circle cx="70" cy="10" r="3" fill={colors.from} />
        </svg>

        <div className="flex items-start justify-between mb-4">
          <span className="font-mono text-xs tracking-wider" style={{ color: colors.from }}>
            {project.year}
          </span>
        </div>

        <h3 className="text-xl font-serif font-bold text-[var(--foreground)] mb-3 group-hover:text-[var(--accent)] transition-colors leading-tight">
          {project.name}
        </h3>

        <p className="text-sm text-[var(--muted-foreground)] mb-6 leading-relaxed line-clamp-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="tech-tag px-3 py-1.5 font-mono text-[10px] tracking-wider uppercase rounded-md border border-[var(--border)] text-[var(--muted-foreground)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)]/30 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>

        <button
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider group/link"
          style={{ color: colors.from }}
        >
          <span className="relative">
            View Details
            <span className="absolute bottom-0 left-0 w-0 h-px group-hover/link:w-full transition-all duration-300" style={{ backgroundColor: colors.from }} />
          </span>
          <svg className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div
        className="project-accent-bar h-0.5 w-0 transition-all duration-500 group-hover:w-full"
        style={{ background: `linear-gradient(90deg, ${colors.from}, ${colors.to})` }}
      />
    </div>
  );
}

export default function Projects() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.05 });
  const root = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allTech = ["All", ...Array.from(new Set(projects.flatMap((p) => p.tech.slice(0, 1))))];

  const filtered = activeFilter === "All" ? projects : projects.filter((p) => p.tech.includes(activeFilter));

  useEffect(() => {
    if (!isVisible || hasAnimated.current || !root.current) return;
    hasAnimated.current = true;

    const scope = createScope({ root }).add(() => {
      animate(".projects-label", {
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 600,
        ease: "easeOutQuart",
      });

      animate(".projects-heading", {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: 100,
        ease: "easeOutQuart",
      });

      animate(".projects-filter-btn", {
        opacity: [0, 1],
        translateY: [10, 0],
        delay: stagger(50, { start: 300 }),
        duration: 500,
        ease: "easeOutQuart",
      });

      animate(".project-card", {
        opacity: [0, 1],
        translateY: [80, 0],
        rotateX: ["-8deg", "0deg"],
        delay: stagger(120, { start: 400 }),
        duration: 1000,
        ease: spring({ stiffness: 120, damping: 18 }),
      });

      const connectors = root.current!.querySelectorAll(".project-connector");
      if (connectors.length) {
        animate(animeSvg.createDrawable(connectors as any), {
          draw: ["0 0", "0 1"],
          duration: 2000,
          delay: 600,
          ease: "easeInOutQuart",
        });
      }
    });

    return () => scope.revert();
  }, [isVisible]);

  useEffect(() => {
    if (!hasAnimated.current || !root.current) return;
    animate(".project-card", {
      opacity: [0, 1],
      translateY: [40, 0],
      delay: stagger(60),
      duration: 500,
      ease: "easeOutQuart",
    });
  }, [activeFilter]);

  return (
    <section id="projects" ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg className="absolute w-full h-full" viewBox="0 0 1200 800" fill="none">
          <path className="project-connector" d="M0 200 Q600 100 1200 200" stroke="var(--accent)" strokeWidth="0.3" opacity="0.08" />
          <path className="project-connector" d="M0 600 Q600 700 1200 600" stroke="var(--accent-secondary)" strokeWidth="0.3" opacity="0.06" />
        </svg>
      </div>

      <div ref={root} className="section-container relative">
        <div className="projects-label flex items-center gap-4 mb-6 opacity-0">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--accent)]">
            04 / Projects
          </span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <h2 className="projects-heading text-3xl md:text-4xl font-serif font-bold opacity-0">
            Featured <span className="gradient-text">Work</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {allTech.map((tech) => (
              <button
                key={tech}
                onClick={() => setActiveFilter(tech)}
                className={`projects-filter-btn px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider rounded-full border transition-all opacity-0 ${
                  activeFilter === tech
                    ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10"
                    : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent)]/50"
                }`}
              >
                {tech}
            </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={i}
              isVisible={isVisible}
              onSelect={() => {
                setSelectedProject(project);
                setSelectedIndex(i);
              }}
            />
          ))}
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        accentColor={PROJECT_COLORS[selectedIndex % PROJECT_COLORS.length].from}
      />
    </section>
  );
}
