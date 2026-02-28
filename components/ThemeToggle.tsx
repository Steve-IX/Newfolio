"use client";
import { useRef } from "react";
import { animate, spring } from "animejs";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (btnRef.current) {
      animate(btnRef.current, {
        rotate: [0, 360],
        scale: [1, 0.8, 1.1, 1],
        duration: 500,
        ease: spring({ stiffness: 300, damping: 15 }),
      });
    }
    toggleTheme();
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--muted)] text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      )}
    </button>
  );
}
