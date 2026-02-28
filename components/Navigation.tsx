"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger, createScope, spring } from "animejs";
import { navLinks } from "@/lib/data";
import ThemeToggle from "./ThemeToggle";

export default function Navigation() {
  const root = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);

      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 150) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!root.current) return;
    const scope = createScope({ root }).add(() => {
      animate(".nav-link", {
        opacity: [0, 1],
        translateY: [-10, 0],
        delay: stagger(50, { start: 300 }),
        duration: 600,
        ease: "easeOutQuart",
      });
    });
    return () => scope.revert();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const items = document.querySelectorAll(".mobile-nav-link");
    if (items.length === 0) return;
    animate(items, {
      opacity: [0, 1],
      translateX: [-30, 0],
      delay: stagger(60),
      duration: 500,
      ease: "easeOutQuart",
    });
  }, [mobileOpen]);

  const handleLinkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    animate(e.currentTarget, {
      scale: 1.05,
      duration: 300,
      ease: spring({ stiffness: 400, damping: 15 }),
    });
  };

  const handleLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    animate(e.currentTarget, {
      scale: 1,
      duration: 300,
      ease: spring({ stiffness: 400, damping: 15 }),
    });
  };

  return (
    <nav
      ref={root}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? "bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--border)]"
          : "bg-transparent"
      }`}
    >
      <div className="section-container flex items-center justify-between h-16 md:h-20">
        <a
          href="#hero"
          className="font-mono text-sm tracking-widest uppercase text-[var(--accent)] font-bold"
        >
          SA.
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link relative px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                activeSection === link.href.replace("#", "")
                  ? "text-[var(--accent)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
              onMouseEnter={handleLinkHover}
              onMouseLeave={handleLinkLeave}
            >
              {link.label}
              {activeSection === link.href.replace("#", "") && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--accent)]" />
              )}
            </a>
          ))}
          <ThemeToggle />
        </div>

        {/* Theme toggle + Mobile hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-[var(--foreground)] transition-transform duration-300 ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-[var(--foreground)] transition-opacity duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-[var(--foreground)] transition-transform duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--background)]/95 backdrop-blur-xl border-b border-[var(--border)]">
          <div className="section-container py-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`mobile-nav-link py-3 px-4 text-sm font-mono uppercase tracking-wider rounded-lg transition-colors ${
                  activeSection === link.href.replace("#", "")
                    ? "text-[var(--accent)] bg-[var(--muted)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
