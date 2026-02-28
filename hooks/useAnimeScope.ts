"use client";

import { useEffect, useRef } from "react";
import { createScope } from "animejs";

type ScopeCallback = (scope: any) => void;

export function useAnimeScope(callback: ScopeCallback, deps: any[] = []) {
  const root = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<any>(null);

  useEffect(() => {
    if (!root.current) return;

    scopeRef.current = createScope({ root }).add(callback);

    return () => {
      scopeRef.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { root, scope: scopeRef };
}
