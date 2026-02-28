"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  createTimeline,
  createScope,
  svg,
  stagger,
  spring,
  splitText,
} from "animejs";
import ParticleField from "./ParticleField";
import WireframeGlobe from "./WireframeGlobe";

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;

    const scope = createScope({ root }).add(() => {
      const nameEl = root.current!.querySelector(".hero-name");
      const taglineEl = root.current!.querySelector(".hero-tagline");

      if (!nameEl || !taglineEl) return;

      (nameEl as HTMLElement).style.opacity = "1";
      (taglineEl as HTMLElement).style.opacity = "1";

      const nameSplit = splitText(nameEl as HTMLElement, {
        chars: { wrap: "clip" },
      });
      const taglineSplit = splitText(taglineEl as HTMLElement, {
        chars: { wrap: "clip" },
      });

      nameSplit.chars.forEach((c: HTMLElement) => (c.style.opacity = "0"));
      taglineSplit.chars.forEach((c: HTMLElement) => (c.style.opacity = "0"));

      const heroDrawables = svg.createDrawable(
        root.current!.querySelectorAll(".hero-svg-line") as any
      );

      const heroCircuitDrawables = svg.createDrawable(
        root.current!.querySelectorAll(".hero-circuit") as any
      );

      const tl = createTimeline({
        defaults: { ease: "easeOutExpo" },
      });

      tl
        .add(".hero-overlay", {
          opacity: [1, 0],
          duration: 900,
          ease: "easeOutQuad",
        })
        .add(heroDrawables, {
          draw: ["0 0", "0 1"],
          duration: 2500,
          delay: stagger(120),
          ease: "easeInOutQuart",
        }, 150)
        .add(heroCircuitDrawables, {
          draw: ["0 0", "0 1"],
          duration: 1500,
          delay: stagger(80),
          ease: "easeOutQuart",
        }, 400)
        .add(".hero-globe-container", {
          opacity: [0, 1],
          scale: [0.3, 1],
          rotate: ["-10deg", "0deg"],
          duration: 1400,
          ease: spring({ stiffness: 80, damping: 18 }),
        }, 250)
        .add(nameSplit.chars, {
          opacity: [0, 1],
          translateY: [120, 0],
          rotateX: ["-90deg", "0deg"],
          rotateZ: ["-5deg", "0deg"],
          scale: [0.3, 1],
          delay: stagger(30),
          duration: 1400,
          ease: "easeOutExpo",
        }, 400)
        .add(taglineSplit.chars, {
          opacity: [0, 1],
          translateY: [30, 0],
          rotateX: ["-45deg", "0deg"],
          delay: stagger(10),
          duration: 700,
        }, 850)
        .add(".hero-subtitle", {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 700,
        }, 1100)
        .add(".hero-accent-line", {
          scaleX: [0, 1],
          duration: 800,
          ease: "easeOutQuart",
        }, 1200)
        .add(".hero-badge", {
          opacity: [0, 1],
          scale: [0.6, 1],
          translateY: [10, 0],
          delay: stagger(60),
          duration: 500,
          ease: spring({ stiffness: 400, damping: 20 }),
        }, 1300)
        .add(".hero-cta", {
          opacity: [0, 1],
          translateY: [30, 0],
          scale: [0.9, 1],
          delay: stagger(100),
          duration: 800,
          ease: spring({ stiffness: 200, damping: 20 }),
        }, 1500)
        .add(".hero-stat", {
          opacity: [0, 1],
          translateY: [20, 0],
          delay: stagger(80),
          duration: 600,
        }, 1650)
        .add(".hero-stat-divider", {
          scaleY: [0, 1],
          duration: 400,
          delay: stagger(80, { start: 100 }),
        }, 1700)
        .add(".hero-scroll-indicator", {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 600,
        }, 1900);

      nameSplit.addEffect(({ chars }) => {
        return animate(chars, {
          backgroundImage: [
            { to: "linear-gradient(90deg, var(--accent), var(--accent-secondary), var(--accent))" },
          ],
          backgroundClip: "text",
          webkitBackgroundClip: "text",
          color: [
            { to: "transparent", delay: 3000 },
            { to: "var(--foreground)", delay: 500 },
          ],
          filter: [
            { to: "brightness(1)" },
            { to: "brightness(1.3)", delay: 3000 },
            { to: "brightness(1)", delay: 500 },
          ],
          delay: stagger(80, { start: 2500 }),
          duration: 4000,
          loop: true,
          ease: "easeInOutSine",
        });
      });

      animate(".hero-float-shape", {
        translateY: () => [
          `${Math.random() * -30}px`,
          `${Math.random() * 30}px`,
        ],
        translateX: () => [
          `${Math.random() * -25}px`,
          `${Math.random() * 25}px`,
        ],
        rotate: () => [`${Math.random() * -20}deg`, `${Math.random() * 20}deg`],
        scale: () => [0.9 + Math.random() * 0.1, 1 + Math.random() * 0.15],
        duration: () => Math.random() * 3000 + 5000,
        loop: true,
        alternate: true,
        ease: "easeInOutSine",
        delay: () => Math.random() * 2000,
      });

      animate(".orbit-dot", {
        rotate: 360,
        duration: () => Math.random() * 6000 + 12000,
        loop: true,
        ease: "linear",
      });

      animate(".hero-node", {
        scale: [0.8, 1.2, 0.8],
        opacity: [0.3, 0.8, 0.3],
        duration: () => Math.random() * 2000 + 3000,
        loop: true,
        ease: "easeInOutSine",
        delay: () => Math.random() * 2000,
      });

      animate(".scroll-arrow", {
        translateY: [0, 12, 0],
        opacity: [1, 0.3, 1],
        duration: 2000,
        loop: true,
        ease: "easeInOutQuad",
      });

      animate(".hero-glow-ring", {
        rotate: [0, 360],
        duration: 30000,
        loop: true,
        ease: "linear",
      });
    });

    return () => scope.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={root}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <div className="hero-overlay absolute inset-0 bg-[var(--background)] z-10" />

      <ParticleField count={60} />

      {/* SVG layer: flowing lines + circuit patterns */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 800"
        fill="none"
        aria-hidden
      >
        {/* Flowing curves */}
        <path className="hero-svg-line" d="M0 400 Q200 320 400 380 T800 360 T1200 400" stroke="var(--accent)" strokeWidth="0.6" opacity="0.25" />
        <path className="hero-svg-line" d="M0 200 Q300 160 600 200 T1200 180" stroke="var(--accent-secondary)" strokeWidth="0.4" opacity="0.15" />
        <path className="hero-svg-line" d="M0 600 Q250 640 500 600 T1000 620 T1200 590" stroke="var(--accent)" strokeWidth="0.4" opacity="0.15" />

        {/* Grid reference lines */}
        <line className="hero-svg-line" x1="200" y1="0" x2="200" y2="800" stroke="var(--accent)" strokeWidth="0.15" opacity="0.06" />
        <line className="hero-svg-line" x1="400" y1="0" x2="400" y2="800" stroke="var(--accent)" strokeWidth="0.15" opacity="0.06" />
        <line className="hero-svg-line" x1="600" y1="0" x2="600" y2="800" stroke="var(--accent)" strokeWidth="0.2" opacity="0.08" />
        <line className="hero-svg-line" x1="800" y1="0" x2="800" y2="800" stroke="var(--accent)" strokeWidth="0.15" opacity="0.06" />
        <line className="hero-svg-line" x1="1000" y1="0" x2="1000" y2="800" stroke="var(--accent)" strokeWidth="0.15" opacity="0.06" />
        <line className="hero-svg-line" x1="0" y1="400" x2="1200" y2="400" stroke="var(--accent)" strokeWidth="0.15" opacity="0.04" />

        {/* Concentric rings around globe area */}
        <circle className="hero-svg-line" cx="850" cy="400" r="200" stroke="var(--accent)" strokeWidth="0.3" opacity="0.06" />
        <circle className="hero-svg-line" cx="850" cy="400" r="280" stroke="var(--accent-secondary)" strokeWidth="0.2" opacity="0.04" />
        <circle className="hero-svg-line" cx="850" cy="400" r="360" stroke="var(--accent)" strokeWidth="0.15" opacity="0.03" />

        {/* Circuit board traces */}
        <path className="hero-circuit" d="M0 300 L100 300 L130 330 L200 330" stroke="var(--accent)" strokeWidth="0.5" opacity="0.1" />
        <path className="hero-circuit" d="M0 500 L80 500 L110 470 L180 470 L200 490" stroke="var(--accent)" strokeWidth="0.5" opacity="0.08" />
        <path className="hero-circuit" d="M1200 250 L1100 250 L1070 280 L1000 280" stroke="var(--accent-secondary)" strokeWidth="0.5" opacity="0.08" />
        <path className="hero-circuit" d="M1200 550 L1120 550 L1090 520 L1020 520" stroke="var(--accent)" strokeWidth="0.5" opacity="0.06" />

        {/* Circuit nodes */}
        <circle className="hero-node" cx="200" cy="330" r="3" fill="var(--accent)" opacity="0.3" />
        <circle className="hero-node" cx="200" cy="490" r="2.5" fill="var(--accent)" opacity="0.25" />
        <circle className="hero-node" cx="1000" cy="280" r="3" fill="var(--accent-secondary)" opacity="0.25" />
        <circle className="hero-node" cx="1020" cy="520" r="2.5" fill="var(--accent)" opacity="0.2" />
        <circle className="hero-node" cx="130" cy="330" r="2" fill="var(--accent)" opacity="0.2" />
        <circle className="hero-node" cx="1070" cy="280" r="2" fill="var(--accent-secondary)" opacity="0.2" />

        {/* Diagonal connector */}
        <path className="hero-circuit" d="M350 0 L350 100 L400 150 L400 250" stroke="var(--accent)" strokeWidth="0.3" opacity="0.06" strokeDasharray="4 6" />
        <path className="hero-circuit" d="M850 750 L850 700 L900 650 L900 600" stroke="var(--accent-secondary)" strokeWidth="0.3" opacity="0.05" strokeDasharray="4 6" />
      </svg>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="hero-float-shape absolute top-[12%] left-[6%] w-14 h-14 border border-[var(--accent)]/15 rotate-45 rounded-sm" />
        <div className="hero-float-shape absolute top-[22%] right-[12%] w-6 h-6 bg-[var(--accent)]/8 rounded-full" />
        <div className="hero-float-shape absolute bottom-[28%] left-[12%] w-10 h-10 border border-[var(--accent-secondary)]/12 rounded-full" />
        <div className="hero-float-shape absolute bottom-[12%] right-[6%] w-16 h-16 border border-[var(--accent)]/8 rotate-12" />
        <div className="hero-float-shape absolute top-[50%] left-[2%] w-5 h-5 bg-[var(--accent-secondary)]/6 rotate-45" />
        <div className="hero-float-shape absolute top-[6%] right-[22%] w-8 h-8 border border-[var(--accent)]/10 rounded-lg rotate-[30deg]" />
        <div className="hero-float-shape absolute top-[38%] left-[35%] w-3 h-3 bg-[var(--accent)]/12 rounded-full" />
        <div className="hero-float-shape absolute bottom-[35%] right-[30%] w-5 h-5 border border-[var(--accent)]/8 rotate-[60deg]" />
        <div className="hero-float-shape absolute top-[70%] left-[25%] w-4 h-4 border border-[var(--accent-secondary)]/10 rounded-full" />
        <div className="hero-float-shape absolute top-[18%] left-[45%] w-3 h-3 bg-[var(--accent)]/6 rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-20 section-container w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center min-h-screen py-24">
          {/* Left: Text */}
          <div className="text-left lg:pr-8">
            <p className="hero-subtitle font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-[var(--accent)] mb-6 opacity-0">
              Software Engineer &middot; Automation &middot; AI
            </p>

            <h1
              className="hero-name text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-serif font-bold mb-6 leading-[0.95]"
              style={{ opacity: 0, perspective: "1200px" }}
            >
              Stephen Addo
            </h1>

            <p
              className="hero-tagline text-lg md:text-xl lg:text-2xl text-[var(--muted-foreground)] font-light mb-4 tracking-wide"
              style={{ opacity: 0, perspective: "600px" }}
            >
              Automation Software Engineer @ BDO UK
            </p>

            <div className="hero-accent-line h-px w-28 bg-gradient-to-r from-[var(--accent)] via-[var(--accent-secondary)] to-transparent mb-6 origin-left" />

            <div className="flex flex-wrap gap-2 mb-8">
              {["C#", "Java", "RPA", "UiPath", ".NET", "Python"].map((tech) => (
                <span key={tech} className="hero-badge px-3 py-1.5 font-mono text-[10px] tracking-wider uppercase text-[var(--accent)] border border-[var(--accent)]/20 rounded-full opacity-0 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 transition-all cursor-default">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
              <a
                href="#projects"
                className="hero-cta group relative px-8 py-3.5 font-mono text-sm uppercase tracking-wider bg-[var(--accent)] text-[var(--background)] rounded-lg overflow-hidden opacity-0"
              >
                <span className="relative z-10">View Work</span>
                <span className="absolute inset-0 bg-[var(--accent-secondary)] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </a>
              <a
                href="#contact"
                className="hero-cta px-8 py-3.5 font-mono text-sm uppercase tracking-wider border border-[var(--border)] text-[var(--foreground)] rounded-lg hover:border-[var(--accent)] transition-colors duration-300 opacity-0"
              >
                Get in Touch
              </a>
            </div>

            <div className="flex items-center gap-6">
              {[
                { label: "Years Exp", value: "3+" },
                { label: "Projects", value: "15+" },
                { label: "LeetCode", value: "63" },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-6">
                  <div className="hero-stat opacity-0">
                    <div className="text-2xl font-serif font-bold gradient-text">{stat.value}</div>
                    <div className="font-mono text-[10px] tracking-wider uppercase text-[var(--muted-foreground)]">{stat.label}</div>
                  </div>
                  {i < 2 && (
                    <div className="hero-stat-divider w-px h-8 bg-[var(--border)] origin-center" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Globe + orbital elements */}
          <div className="hero-globe-container hidden lg:flex items-center justify-center opacity-0 relative -mr-8 xl:-mr-4">
            {/* Outer glow ring */}
            <div className="hero-glow-ring absolute w-[110%] h-[110%] rounded-full border border-[var(--accent)]/5 border-dashed" style={{ transformOrigin: "center" }} />

            {/* Orbiting dots */}
            <div className="orbit-dot absolute w-full h-full" style={{ transformOrigin: "center" }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]" />
                <div className="w-px h-4 bg-[var(--accent)]/20" />
              </div>
            </div>
            <div className="orbit-dot absolute w-[85%] h-[85%] top-[7.5%] left-[7.5%]" style={{ transformOrigin: "center" }}>
              <div className="absolute bottom-0 right-0">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-secondary)] shadow-[0_0_10px_var(--accent-secondary)]" />
              </div>
            </div>
            <div className="orbit-dot absolute w-[70%] h-[70%] top-[15%] left-[15%]" style={{ transformOrigin: "center" }}>
              <div className="absolute left-0 top-1/2 -translate-y-1/2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] opacity-60" />
              </div>
            </div>

            <WireframeGlobe size={650} />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--muted-foreground)]">
            Scroll
          </span>
          <svg
            className="scroll-arrow w-4 h-6 text-[var(--accent)]"
            viewBox="0 0 16 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M8 0v20M2 14l6 6 6-6" />
          </svg>
        </div>
      </div>
    </section>
  );
}
