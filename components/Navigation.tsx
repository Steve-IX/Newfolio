"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger, createScope, spring } from "animejs";
import { navLinks } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { DURATION, EASE, STAGGER } from "@/lib/animations";
import { showInstant } from "@/lib/motion";
import ThemeToggle from "./ThemeToggle";

export default function Navigation() {
  const root = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const reducedMotion = usePrefersReducedMotion();

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
    if (reducedMotion) {
      showInstant(root.current, [".nav-link"]);
      return;
    }
    const scope = createScope({ root }).add(() => {
      animate(".nav-link", {
        opacity: [0, 1],
        translateY: [-8, 0],
        delay: stagger(STAGGER.fast, { start: 200 }),
        duration: DURATION.normal,
        ease: EASE.entrance,
      });
    });
    return () => scope.revert();
  }, [reducedMotion]);

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
    if (reducedMotion) return;
    animate(e.currentTarget, {
      scale: 1.05,
      duration: DURATION.fast,
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
      className={`fixed top-0 left-0 right-0 z-50 transition-[background,backdrop-filter,border] duration-300 ${
        isScrolled
          ? "glass-surface rounded-none border-x-0 border-t-0"
          : "bg-transparent"
      }`}
    >
      <div className="section-container flex items-center justify-between h-16 md:h-20">
        <a
          href="#hero"
          className="font-display text-lg md:text-xl tracking-tight text-(--foreground) font-bold hover:text-(--accent) transition-colors"
        >
          SA<span className="text-(--accent)">.</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link relative px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                activeSection === link.href.replace("#", "")
                  ? "text-(--accent)"
                  : "text-(--muted-foreground) hover:text-(--foreground)"
              }`}
              onMouseEnter={handleLinkHover}
              onMouseLeave={handleLinkLeave}
            >
              {link.label}
              {activeSection === link.href.replace("#", "") && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-(--accent)" />
              )}
            </a>
          ))}
          <ThemeToggle />
        </div>

        {/* Theme toggle + Mobile hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span
              className={`block w-6 h-0.5 bg-(--foreground) transition-transform duration-300 ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-(--foreground) transition-opacity duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-(--foreground) transition-transform duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-surface rounded-none border-x-0">
          <div className="section-container py-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`mobile-nav-link py-3 px-4 text-sm font-mono uppercase tracking-wider rounded-lg transition-colors ${
                  activeSection === link.href.replace("#", "")
                    ? "text-(--accent) bg-(--muted)"
                    : "text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--muted)"
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
