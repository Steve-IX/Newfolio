export const EASE = {
  smooth: "easeOutQuart",
  bounce: "easeOutBounce",
  elastic: "easeOutElastic(1, .6)",
  expo: "easeOutExpo",
  inOut: "easeInOutQuart",
  sharp: "easeInOutCubic",
} as const;

export const DURATION = {
  fast: 400,
  normal: 700,
  slow: 1200,
  reveal: 900,
  counter: 2000,
} as const;

export const STAGGER = {
  fast: 30,
  normal: 60,
  slow: 100,
  chars: 25,
  cards: 80,
} as const;
