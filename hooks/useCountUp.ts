"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";

interface CountUpOptions {
  duration?: number;
  delay?: number;
  easing?: string;
}

export function useCountUp(
  target: number,
  trigger: boolean,
  options: CountUpOptions = {}
) {
  const { duration = 2000, delay = 0, easing = "easeOutExpo" } = options;
  const [value, setValue] = useState(0);
  const objRef = useRef({ val: 0 });

  useEffect(() => {
    if (!trigger) return;

    objRef.current.val = 0;
    animate(objRef.current, {
      val: target,
      duration,
      delay,
      ease: easing,
      onUpdate: () => {
        setValue(Math.round(objRef.current.val));
      },
    });
  }, [trigger, target, duration, delay, easing]);

  return value;
}
