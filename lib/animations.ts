export const EASE = {
  entrance: "easeOutQuart",
  smooth: "easeOutQuart",
  bounce: "easeOutBounce",
  elastic: "easeOutElastic(1, .6)",
  expo: "easeOutExpo",
  inOut: "easeInOutQuart",
  sharp: "easeInOutCubic",
} as const;

export const DURATION = {
  fast: 250,
  normal: 350,
  slow: 450,
  reveal: 400,
  counter: 900,
} as const;

export const STAGGER = {
  fast: 40,
  normal: 70,
  slow: 80,
  chars: 20,
  cards: 70,
} as const;
