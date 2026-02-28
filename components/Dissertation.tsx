"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, createScope, spring, svg as animeSvg } from "animejs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const HIGHLIGHTS = [
  {
    title: "QAOA",
    subtitle: "Quantum Approximate Optimization Algorithm",
    description:
      "Implemented variational quantum circuits to approximate solutions for Max-Cut and graph colouring on NISQ-era hardware.",
  },
  {
    title: "Grover's Algorithm",
    subtitle: "Quadratic Speedup Search",
    description:
      "Demonstrated O(\u221AN) search across unstructured solution spaces, benchmarking against classical brute-force approaches.",
  },
  {
    title: "Qiskit & Cirq",
    subtitle: "Dual-Framework Implementation",
    description:
      "Built identical circuits in IBM Qiskit and Google Cirq to compare SDK ergonomics, transpilation, and simulator performance.",
  },
  {
    title: "Benchmarking",
    subtitle: "Classical vs Quantum",
    description:
      "Measured solution quality, circuit depth, and execution time across problem sizes to identify the quantum advantage crossover point.",
  },
];

export default function Dissertation() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.05 });
  const root = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current || !root.current) return;
    hasAnimated.current = true;

    const scope = createScope({ root }).add(() => {
      animate(".diss-label", {
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 600,
        ease: "easeOutQuart",
      });

      animate(".diss-title", {
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 900,
        delay: 100,
        ease: "easeOutQuart",
      });

      animate(".diss-subtitle", {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 700,
        delay: 250,
        ease: "easeOutQuart",
      });

      animate(".diss-author", {
        opacity: [0, 1],
        translateY: [15, 0],
        duration: 600,
        delay: 400,
        ease: "easeOutQuart",
      });

      animate(".diss-abstract", {
        opacity: [0, 1],
        translateY: [25, 0],
        duration: 800,
        delay: 500,
        ease: "easeOutQuart",
      });

      animate(".diss-highlight-card", {
        opacity: [0, 1],
        translateY: [60, 0],
        rotateX: ["-6deg", "0deg"],
        delay: stagger(100, { start: 600 }),
        duration: 900,
        ease: spring({ stiffness: 130, damping: 18 }),
      });

      animate(".diss-cta", {
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0.9, 1],
        duration: 700,
        delay: 1000,
        ease: spring({ stiffness: 200, damping: 20 }),
      });

      const circuits = root.current!.querySelectorAll(".diss-circuit");
      if (circuits.length) {
        animate(animeSvg.createDrawable(circuits as any), {
          draw: ["0 0", "0 1"],
          duration: 2500,
          delay: stagger(100),
          ease: "easeInOutQuart",
        });
      }

      animate(".diss-qubit", {
        scale: [0.5, 1.3, 0.5],
        opacity: [0.2, 0.8, 0.2],
        duration: () => Math.random() * 2000 + 3000,
        loop: true,
        ease: "easeInOutSine",
        delay: () => Math.random() * 2000,
      });

      animate(".diss-orbit", {
        rotate: [0, 360],
        duration: () => Math.random() * 8000 + 15000,
        loop: true,
        ease: "linear",
      });
    });

    return () => scope.revert();
  }, [isVisible]);

  return (
    <section id="dissertation" ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Quantum circuit SVG background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg className="absolute w-full h-full" viewBox="0 0 1200 800" fill="none">
          {/* Quantum gate lines */}
          <path className="diss-circuit" d="M0 150 L300 150 L350 200 L500 200" stroke="var(--accent)" strokeWidth="0.5" opacity="0.08" />
          <path className="diss-circuit" d="M0 250 L200 250 L250 300 L450 300" stroke="var(--accent-secondary)" strokeWidth="0.4" opacity="0.06" />
          <path className="diss-circuit" d="M700 100 L900 100 L950 150 L1200 150" stroke="var(--accent)" strokeWidth="0.4" opacity="0.06" />
          <path className="diss-circuit" d="M800 650 L1000 650 L1050 600 L1200 600" stroke="var(--accent-secondary)" strokeWidth="0.4" opacity="0.05" />
          <path className="diss-circuit" d="M0 550 L150 550 L200 500 L400 500 L450 550 L600 550" stroke="var(--accent)" strokeWidth="0.3" opacity="0.05" strokeDasharray="6 8" />
          <path className="diss-circuit" d="M900 350 L1050 350 L1100 400 L1200 400" stroke="var(--accent)" strokeWidth="0.3" opacity="0.04" strokeDasharray="4 6" />

          {/* Qubit state nodes */}
          <circle className="diss-qubit" cx="500" cy="200" r="4" fill="var(--accent)" opacity="0.3" />
          <circle className="diss-qubit" cx="450" cy="300" r="3" fill="var(--accent-secondary)" opacity="0.25" />
          <circle className="diss-qubit" cx="300" cy="150" r="3" fill="var(--accent)" opacity="0.2" />
          <circle className="diss-qubit" cx="950" cy="150" r="3.5" fill="var(--accent)" opacity="0.2" />
          <circle className="diss-qubit" cx="600" cy="550" r="3" fill="var(--accent)" opacity="0.15" />

          {/* Bloch sphere representation */}
          <circle className="diss-circuit" cx="1050" cy="250" r="60" stroke="var(--accent)" strokeWidth="0.4" opacity="0.06" />
          <ellipse className="diss-circuit" cx="1050" cy="250" rx="60" ry="20" stroke="var(--accent)" strokeWidth="0.3" opacity="0.04" />
          <line className="diss-circuit" x1="1050" y1="190" x2="1050" y2="310" stroke="var(--accent)" strokeWidth="0.3" opacity="0.05" />

          {/* Superposition wave */}
          <path className="diss-circuit" d="M100 700 Q200 660 300 700 Q400 740 500 700 Q600 660 700 700" stroke="var(--accent)" strokeWidth="0.3" opacity="0.04" />
        </svg>
      </div>

      <div ref={root} className="section-container relative">
        {/* Section label */}
        <div className="diss-label flex items-center gap-4 mb-6 opacity-0">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--accent)]">
            05 / Dissertation
          </span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        {/* Title block */}
        <div className="max-w-3xl mb-12">
          <h2 className="diss-title text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 opacity-0 leading-tight">
            Exploring Quantum Algorithms for{" "}
            <span className="gradient-text">Combinatorial Optimization</span>
          </h2>
          <p className="diss-subtitle text-lg md:text-xl text-[var(--muted-foreground)] mb-3 opacity-0">
            Third Year Project Report &mdash; B.Sc. (Hons) Computer Science
          </p>
          <p className="diss-author font-mono text-sm text-[var(--accent)] opacity-0">
            Stephen Yeboah Addo &middot; Lancaster University &middot; 2024
          </p>
        </div>

        {/* Abstract */}
        <div className="diss-abstract glass-card p-6 md:p-8 mb-12 max-w-3xl opacity-0 relative">
          <div className="absolute top-4 left-4 font-serif text-6xl text-[var(--accent)] opacity-10 leading-none">&ldquo;</div>
          <p className="text-sm md:text-base text-[var(--muted-foreground)] leading-relaxed pl-8">
            This dissertation investigates the application of quantum algorithms &mdash; specifically the Quantum
            Approximate Optimization Algorithm (QAOA) and Grover&apos;s search algorithm &mdash; to NP-hard
            combinatorial optimization problems. Implementations in both IBM Qiskit and Google Cirq are benchmarked
            against classical brute-force and heuristic solvers across Max-Cut and graph colouring problem instances
            of increasing size. Results demonstrate promising quantum speedup potential while identifying current
            NISQ-era hardware constraints on circuit depth and qubit coherence times.
          </p>
        </div>

        {/* Highlight cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {HIGHLIGHTS.map((item, i) => (
            <div
              key={item.title}
              className="diss-highlight-card glass-card p-5 relative group opacity-0 hover:border-[var(--accent)]/30 transition-colors"
            >
              {/* Orbit decoration */}
              <div className="diss-orbit absolute -top-2 -right-2 w-8 h-8" style={{ transformOrigin: "center" }}>
                <div className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-40" />
              </div>

              <div
                className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3"
                style={{ color: ["#00e5ff", "#ff9100", "#a855f7", "#10b981"][i] }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="text-lg font-serif font-bold text-[var(--foreground)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                {item.title}
              </h3>
              <p className="font-mono text-[10px] tracking-wider uppercase text-[var(--accent)] mb-3">
                {item.subtitle}
              </p>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="diss-cta flex flex-col sm:flex-row items-start gap-4 opacity-0">
          <a
            href="https://drive.google.com/file/d/1rRjaPwewK-waLi7AEGjWRylI-Q7y12Ly/view"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 font-mono text-sm uppercase tracking-wider bg-[var(--accent)] text-[var(--background)] rounded-lg overflow-hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 relative z-10">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span className="relative z-10">Read Full Dissertation</span>
            <span className="absolute inset-0 bg-[var(--accent-secondary)] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>
          <a
            href="https://github.com/Steve-IX/Exploring-Quantum-Algorithms-for-Combinatorial-Optimization"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3.5 font-mono text-sm uppercase tracking-wider border border-[var(--border)] text-[var(--foreground)] rounded-lg hover:border-[var(--accent)] transition-colors duration-300"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Source Code
          </a>
        </div>
      </div>
    </section>
  );
}
