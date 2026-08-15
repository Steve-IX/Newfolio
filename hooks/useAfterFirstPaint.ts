"use client";

import { useEffect, useState } from "react";

export function useAfterFirstPaint(idleTimeoutMs = 900) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let usedIdleCallback = false;

    const fire = () => {
      if (!cancelled) setReady(true);
    };

    const afterPaint = () => {
      const requestIdle = window.requestIdleCallback;
      if (typeof requestIdle === "function") {
        usedIdleCallback = true;
        idleId = requestIdle(fire, { timeout: idleTimeoutMs });
        return;
      }
      idleId = window.setTimeout(fire, 0);
    };

    const outer = requestAnimationFrame(() => {
      requestAnimationFrame(afterPaint);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(outer);
      if (idleId === undefined) return;
      if (usedIdleCallback && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, [idleTimeoutMs]);

  return ready;
}
