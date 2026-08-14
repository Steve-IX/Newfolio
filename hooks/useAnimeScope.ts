"use client";

import { useEffect, useRef } from "react";
import { createScope } from "animejs";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type ScopeCallback = (scope: any) => void;

export function useAnimeScope(callback: ScopeCallback, deps: any[] = []) {
  const root = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<any>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!root.current || reducedMotion) return;

    scopeRef.current = createScope({ root }).add(callback);

    return () => {
      scopeRef.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, ...deps]);

  return { root, scope: scopeRef, reducedMotion };
}
