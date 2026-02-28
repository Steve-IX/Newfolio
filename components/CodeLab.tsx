"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, splitText, createScope, spring } from "animejs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const CODE_SNIPPET = `// quantum_optimizer.py
import qiskit
from qiskit import QuantumCircuit

def build_qaoa_circuit(graph, p=2):
    """Build QAOA circuit for MaxCut."""
    n_qubits = len(graph.nodes)
    qc = QuantumCircuit(n_qubits)
    
    # Initial superposition
    for i in range(n_qubits):
        qc.h(i)
    
    # QAOA layers
    for layer in range(p):
        # Problem unitary
        for edge in graph.edges:
            qc.cx(edge[0], edge[1])
            qc.rz(gamma[layer], edge[1])
            qc.cx(edge[0], edge[1])
        
        # Mixer unitary
        for i in range(n_qubits):
            qc.rx(beta[layer], i)
    
    return qc

# Optimize and execute
result = optimizer.minimize(
    cost_function, x0=[0.5, 0.5]
)
print(f"Optimal: {result.fun:.4f}")`;

export default function CodeLab() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const root = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current || !root.current) return;
    hasAnimated.current = true;

    const scope = createScope({ root }).add(() => {
      animate(".codelab-label", {
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 600,
        ease: "easeOutQuart",
      });

      animate(".terminal-window", {
        opacity: [0, 1],
        translateY: [60, 0],
        scale: [0.95, 1],
        duration: 800,
        ease: spring({ stiffness: 200, damping: 25 }),
        delay: 200,
      });

      const codeEl = root.current!.querySelector(".code-content") as HTMLElement;
      if (codeEl) {
        codeEl.style.opacity = "1";
        const codeSplit = splitText(codeEl, { chars: true, words: false });
        codeSplit.chars.forEach((c: HTMLElement) => (c.style.opacity = "0"));
        animate(codeSplit.chars, {
          opacity: [0, 1],
          delay: stagger(8, { start: 600 }),
          duration: 50,
          ease: "linear",
        });
      }

      animate(".terminal-cursor", {
        opacity: [1, 0],
        duration: 600,
        loop: true,
        alternate: true,
        ease: "easeInOutQuad",
        delay: 500,
      });

      animate(".terminal-dot", {
        scale: [0, 1],
        delay: stagger(80, { start: 100 }),
        duration: 400,
        ease: spring({ stiffness: 400, damping: 15 }),
      });
    });

    return () => scope.revert();
  }, [isVisible]);

  return (
    <section id="codelab" ref={sectionRef} className="section-padding relative">
      <div ref={root} className="section-container">
        <div className="codelab-label flex items-center gap-4 mb-16 opacity-0">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--accent)]">
            07 / Code Lab
          </span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="terminal-window rounded-xl overflow-hidden border border-[var(--border)] opacity-0">
            {/* Terminal header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[var(--muted)] border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div className="terminal-dot w-3 h-3 rounded-full bg-red-500/80" />
                <div className="terminal-dot w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="terminal-dot w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="font-mono text-xs text-[var(--muted-foreground)] ml-2">
                quantum_optimizer.py &mdash; ~/projects/dissertation
              </span>
            </div>

            {/* Code content */}
            <div className="p-6 md:p-8 bg-[#0d0d15] overflow-x-auto">
              <pre className="font-mono text-xs md:text-sm leading-relaxed">
                <code
                  className="code-content text-[var(--foreground)]"
                  style={{ opacity: 0 }}
                >
                  {CODE_SNIPPET}
                </code>
                <span className="terminal-cursor inline-block w-2 h-4 bg-[var(--accent)] ml-0.5 align-text-bottom" />
              </pre>
            </div>

            {/* Terminal footer */}
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--muted)] border-t border-[var(--border)]">
              <span className="font-mono text-[10px] text-[var(--muted-foreground)]">
                Python 3.11 &middot; Qiskit 1.0
              </span>
              <span className="font-mono text-[10px] text-[var(--accent)]">
                Ln 34, Col 1
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-[var(--muted-foreground)] mt-6">
            A snippet from my quantum computing dissertation &mdash; exploring QAOA for combinatorial optimization
          </p>
        </div>
      </div>
    </section>
  );
}
