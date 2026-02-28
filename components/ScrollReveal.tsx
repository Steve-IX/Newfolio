"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { EASE, DURATION } from "@/lib/animations";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  staggerChildren?: boolean;
  staggerDelay?: number;
  once?: boolean;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = DURATION.reveal,
  staggerChildren = false,
  staggerDelay = 60,
  once = true,
  threshold = 0.15,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, once });
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || !innerRef.current) return;

    const targets = staggerChildren
      ? innerRef.current.children
      : innerRef.current;

    const animProps: Record<string, any> = {
      opacity: [0, 1],
      duration,
      delay: staggerChildren ? stagger(staggerDelay, { start: delay }) : delay,
      ease: EASE.smooth,
    };

    if (direction === "up") animProps.translateY = [60, 0];
    else if (direction === "down") animProps.translateY = [-60, 0];
    else if (direction === "left") animProps.translateX = [60, 0];
    else if (direction === "right") animProps.translateX = [-60, 0];

    animate(targets, animProps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  return (
    <div ref={ref} className={className}>
      <div ref={innerRef} style={{ opacity: 0 }}>
        {children}
      </div>
    </div>
  );
}
