"use client";

import { useSyncExternalStore } from "react";

export function useIsMinWidth(px: number) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(`(min-width: ${px}px)`);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(`(min-width: ${px}px)`).matches,
    () => false
  );
}
