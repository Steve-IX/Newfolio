export function showInstant(root: ParentNode, selectors: string[]) {
  selectors.forEach((selector) => {
    root.querySelectorAll(selector).forEach((node) => {
      const el = node as HTMLElement;
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.filter = "none";
    });
  });
}

export function revealHidden(root: ParentNode) {
  root.querySelectorAll<HTMLElement>("[class*='opacity-0']").forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
    el.style.filter = "none";
  });
}

