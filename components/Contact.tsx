"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger, createScope, spring, svg as animeSvg } from "animejs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { socialLinks, personalInfo } from "@/lib/data";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
};

export default function Contact() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const root = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    if (!isVisible || hasAnimated.current || !root.current) return;
    hasAnimated.current = true;

    const scope = createScope({ root }).add(() => {
      animate(".contact-label", {
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 600,
        ease: "easeOutQuart",
      });

      animate(".contact-heading", {
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 800,
        delay: 200,
        ease: "easeOutQuart",
      });

      animate(".form-field", {
        opacity: [0, 1],
        translateY: [30, 0],
        delay: stagger(100, { start: 400 }),
        duration: 700,
        ease: "easeOutQuart",
      });

      animate(".social-link-item", {
        opacity: [0, 1],
        translateX: [30, 0],
        scale: [0.8, 1],
        delay: stagger(80, { start: 500 }),
        duration: 600,
        ease: spring({ stiffness: 300, damping: 20 }),
      });

      animate(".contact-cta-btn", {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        delay: 800,
        ease: "easeOutQuart",
      });

      animate(".send-btn-pulse", {
        scale: [1, 1.05, 1],
        duration: 2000,
        loop: true,
        ease: "easeInOutSine",
        delay: 2000,
      });

      const morphShape1 = root.current!.querySelector("#contact-morph-1") as SVGPolygonElement;
      const morphShape2 = root.current!.querySelector("#contact-morph-2") as SVGPolygonElement;
      if (morphShape1 && morphShape2) {
        const morphDrawables = animeSvg.createDrawable([morphShape1, morphShape2] as any);
        animate(morphDrawables, {
          draw: ["0 0", "0 1"],
          duration: 2000,
          delay: stagger(300),
          ease: "easeInOutQuart",
        });

        const generatePoints = () => {
          const total = 6 + Math.floor(Math.random() * 4);
          const r1 = 30 + Math.random() * 40;
          const r2 = 60;
          let points = "";
          for (let i = 0; i < total; i++) {
            const r = i % 2 === 0 ? r1 : r2;
            const a = (2 * Math.PI * i) / total - Math.PI / 2;
            const x = 80 + Math.round(r * Math.cos(a));
            const y = 80 + Math.round(r * Math.sin(a));
            points += `${x},${y} `;
          }
          return points.trim();
        };

        const animateMorph = () => {
          if (!morphShape2 || !morphShape1) return;
          morphShape2.setAttribute("points", generatePoints());
          animate(morphShape1, {
            points: animeSvg.morphTo(morphShape2),
            ease: "easeInOutQuart",
            duration: 3000,
            onComplete: animateMorph,
          });
        };
        setTimeout(animateMorph, 2500);
      }
    });

    return () => scope.revert();
  }, [isVisible]);

  const handleSocialHover = (e: React.MouseEvent) => {
    animate(e.currentTarget, {
      scale: 1.15,
      rotate: "8deg",
      duration: 300,
      ease: spring({ stiffness: 400, damping: 12 }),
    });
  };

  const handleSocialLeave = (e: React.MouseEvent) => {
    animate(e.currentTarget, {
      scale: 1,
      rotate: "0deg",
      duration: 300,
      ease: spring({ stiffness: 400, damping: 12 }),
    });
  };

  return (
    <section id="contact" ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Morphing decorative shape */}
      <div className="absolute right-0 top-1/4 pointer-events-none opacity-[0.06]" aria-hidden>
        <svg width="160" height="160" viewBox="0 0 160 160">
          <polygon
            id="contact-morph-1"
            points="80,20 140,50 140,110 80,140 20,110 20,50"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1"
          />
          <polygon
            id="contact-morph-2"
            points="80,10 150,40 150,120 80,150 10,120 10,40"
            fill="none"
            stroke="var(--accent-secondary)"
            strokeWidth="0.5"
            opacity="0"
          />
        </svg>
      </div>

      <div ref={root} className="section-container">
        <div className="contact-label flex items-center gap-4 mb-16 opacity-0">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--accent)]">
            08 / Contact
          </span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Form side */}
          <div>
            <h2 className="contact-heading text-4xl md:text-5xl font-serif font-bold mb-4 opacity-0">
              Let&apos;s work<br />
              <span className="gradient-text">together.</span>
            </h2>
            <p className="contact-heading text-[var(--muted-foreground)] mb-8 opacity-0">
              Have a project in mind? I&apos;d love to hear about it.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = `mailto:${personalInfo.email}?subject=Portfolio Contact from ${formState.name}&body=${formState.message}`;
              }}
              className="space-y-5"
            >
              <div className="form-field opacity-0">
                <label className="block font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-[var(--border)] focus:border-[var(--accent)] py-3 text-[var(--foreground)] outline-none transition-colors font-light"
                  placeholder="Your name"
                />
              </div>

              <div className="form-field opacity-0">
                <label className="block font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-[var(--border)] focus:border-[var(--accent)] py-3 text-[var(--foreground)] outline-none transition-colors font-light"
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-field opacity-0">
                <label className="block font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                  Message
                </label>
                <textarea
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  rows={4}
                  className="w-full bg-transparent border-b-2 border-[var(--border)] focus:border-[var(--accent)] py-3 text-[var(--foreground)] outline-none transition-colors font-light resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                className="contact-cta-btn send-btn-pulse mt-4 px-8 py-3.5 font-mono text-sm uppercase tracking-wider bg-[var(--accent)] text-[var(--background)] rounded-lg hover:bg-[var(--accent-secondary)] transition-colors duration-300 opacity-0"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Social / info side */}
          <div className="flex flex-col justify-center">
            <div className="glass-card p-8 md:p-10">
              <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-8">
                Connect
              </h3>

              <div className="space-y-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target={link.url.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="social-link-item flex items-center gap-4 group opacity-0"
                    onMouseEnter={handleSocialHover}
                    onMouseLeave={handleSocialLeave}
                  >
                    <div className="w-12 h-12 rounded-lg bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] group-hover:text-[var(--accent)] group-hover:bg-[var(--accent)]/10 transition-colors">
                      {SOCIAL_ICONS[link.icon]}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                        {link.name}
                      </span>
                      <span className="block text-xs text-[var(--muted-foreground)] font-mono">
                        {link.url.replace("mailto:", "").replace("https://", "")}
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-[var(--border)]">
                <p className="font-mono text-xs text-[var(--muted-foreground)] leading-relaxed">
                  Based in the UK. Open to full-time roles, freelance projects, and
                  collaborations in software engineering, automation, and AI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
