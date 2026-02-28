"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { animate, spring, stagger } from "animejs";
import type { Project } from "@/lib/data";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
}

export default function ProjectModal({ project, isOpen, onClose, accentColor }: ProjectModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<boolean[]>([]);

  const handleClose = useCallback(() => {
    if (!overlayRef.current || !contentRef.current) {
      onClose();
      return;
    }

    animate(contentRef.current, {
      opacity: [1, 0],
      scale: [1, 0.92],
      translateY: [0, 40],
      duration: 350,
      ease: "easeInQuart",
    });

    animate(overlayRef.current, {
      opacity: [1, 0],
      duration: 350,
      ease: "easeInQuart",
      onComplete: onClose,
    });
  }, [onClose]);

  useEffect(() => {
    if (!isOpen || !overlayRef.current || !contentRef.current) return;

    setCurrentImage(0);
    setImageLoaded([]);
    document.body.style.overflow = "hidden";

    animate(overlayRef.current, {
      opacity: [0, 1],
      duration: 400,
      ease: "easeOutQuart",
    });

    animate(contentRef.current, {
      opacity: [0, 1],
      scale: [0.88, 1],
      translateY: [60, 0],
      duration: 600,
      ease: spring({ stiffness: 200, damping: 22 }),
    });

    animate(".modal-image-container", {
      opacity: [0, 1],
      scale: [0.95, 1],
      duration: 500,
      delay: 200,
      ease: "easeOutQuart",
    });

    animate(".modal-detail", {
      opacity: [0, 1],
      translateY: [20, 0],
      delay: stagger(60, { start: 300 }),
      duration: 500,
      ease: "easeOutQuart",
    });

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight" && project) setCurrentImage((p) => (p + 1) % project.images.length);
      if (e.key === "ArrowLeft" && project) setCurrentImage((p) => (p - 1 + project.images.length) % project.images.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, project, handleClose]);

  if (!isOpen || !project) return null;

  const handleImageLoad = (index: number) => {
    setImageLoaded((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/70 backdrop-blur-md opacity-0"
        onClick={handleClose}
      />

      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border)] opacity-0"
        style={{ background: "var(--card)" }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Image gallery */}
        <div className="modal-image-container relative w-full aspect-[16/9] overflow-hidden rounded-t-2xl bg-[var(--muted)]">
          {project.images.map((src, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-all duration-500 ease-out"
              style={{
                opacity: currentImage === i ? 1 : 0,
                transform: currentImage === i ? "scale(1)" : "scale(1.05)",
              }}
            >
              {!imageLoaded[i] && currentImage === i && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin" />
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${project.name} - image ${i + 1}`}
                className="w-full h-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                onLoad={() => handleImageLoad(i)}
              />
            </div>
          ))}

          {/* Image overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-transparent to-transparent opacity-60" />

          {/* Navigation arrows */}
          <button
            onClick={() => setCurrentImage((p) => (p - 1 + project.images.length) % project.images.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentImage((p) => (p + 1) % project.images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {project.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: currentImage === i ? accentColor : "rgba(255,255,255,0.3)",
                  transform: currentImage === i ? "scale(1.3)" : "scale(1)",
                  boxShadow: currentImage === i ? `0 0 8px ${accentColor}` : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10">
          <div className="modal-detail flex items-center gap-3 mb-3">
            <span className="font-mono text-xs tracking-wider" style={{ color: accentColor }}>
              {project.year}
            </span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <h3 className="modal-detail text-2xl md:text-3xl font-serif font-bold text-[var(--foreground)] mb-4">
            {project.name}
          </h3>

          <p className="modal-detail text-sm md:text-base text-[var(--muted-foreground)] leading-relaxed mb-6">
            {project.longDescription}
          </p>

          <div className="modal-detail flex flex-wrap gap-2 mb-8">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 font-mono text-[10px] tracking-wider uppercase rounded-md border text-[var(--muted-foreground)]"
                style={{ borderColor: `${accentColor}40`, color: accentColor }}
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="modal-detail flex flex-col sm:flex-row gap-3">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider rounded-lg transition-all duration-300"
              style={{ backgroundColor: accentColor, color: "var(--background)" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View on GitHub
            </a>
            <button
              onClick={handleClose}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
