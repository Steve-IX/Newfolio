"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, splitText } from "animejs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { EASE, DURATION, STAGGER } from "@/lib/animations";

interface AnimatedTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  splitBy?: "chars" | "words" | "both";
  animateOn?: "scroll" | "mount";
  delay?: number;
  duration?: number;
  staggerAmount?: number;
  direction?: "up" | "down" | "none";
  threshold?: number;
}

export default function AnimatedText({
  text,
  as: Tag = "h2",
  className = "",
  splitBy = "chars",
  animateOn = "scroll",
  delay = 0,
  duration = DURATION.normal,
  staggerAmount = STAGGER.chars,
  direction = "up",
  threshold = 0.15,
}: AnimatedTextProps) {
  const { ref: scrollRef, isVisible } = useScrollAnimation({ threshold });
  const textRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const shouldAnimate =
      (animateOn === "scroll" && isVisible) || animateOn === "mount";

    if (!shouldAnimate || hasAnimated.current || !textRef.current) return;
    hasAnimated.current = true;

    textRef.current.style.opacity = "1";

    const split = splitText(textRef.current, {
      chars: splitBy === "chars" || splitBy === "both",
      words: splitBy === "words" || splitBy === "both",
    });

    const targets = splitBy === "words" ? split.words : split.chars;
    (targets as HTMLElement[]).forEach((el: HTMLElement) => (el.style.opacity = "0"));

    const yOffset = direction === "up" ? 40 : direction === "down" ? -40 : 0;

    const animProps: Record<string, any> = {
      opacity: [0, 1],
      duration,
      delay: stagger(staggerAmount, { start: delay }),
      ease: EASE.expo,
    };

    if (yOffset !== 0) animProps.translateY = [yOffset, 0];
    if (direction !== "none") animProps.rotateX = ["-40deg", "0deg"];

    animate(targets, animProps);
  }, [isVisible, animateOn, splitBy, delay, duration, staggerAmount, direction]);

  return (
    <div ref={scrollRef}>
      <Tag
        ref={textRef as any}
        className={className}
        style={{ opacity: 0, perspective: "600px" }}
      >
        {text}
      </Tag>
    </div>
  );
}
