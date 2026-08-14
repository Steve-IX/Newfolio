# Credits

Third-party assets and licenses used by this portfolio. No hot-linked stock art or unlicensed fonts were added during the 2026 upgrade.

## Fonts

Loaded via [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) from Google Fonts. All four are licensed under the [SIL Open Font License 1.1](https://scripts.sil.org/OFL).

| Face | Role | Source |
|------|------|--------|
| [Inter](https://fonts.google.com/specimen/Inter) | Body / Swiss grid | Google Fonts, OFL 1.1 |
| [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) | Display headings | Google Fonts, OFL 1.1 |
| [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) | Dissertation academic register | Google Fonts, OFL 1.1 |
| [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | HUD labels, nav, code | Google Fonts, OFL 1.1 |

## Environment lighting (WebGL globe)

The hero globe uses `@react-three/drei`'s built-in `Environment` preset `"studio"` for reflections on the glass shell. Drei's studio HDRI is derived from [Poly Haven](https://polyhaven.com) HDRIs, released under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).

## Project photography

Project gallery stills are served from Unsplash under the [Unsplash License](https://unsplash.com/license). Host: `images.unsplash.com` (allow-listed in `next.config.mjs`).

Photo IDs:

- `photo-1635070041078-e363dbe005cb`
- `photo-1633613286991-611fe299c4be`
- `photo-1636466497217-26a8cbeaf0aa`
- `photo-1580894908361-967195033215`
- `photo-1451187580459-43490279c0fa`
- `photo-1507413245164-6160d8298b31`
- `photo-1518770660439-4636190af475`
- `photo-1558346490-a72e53ae2d4f`
- `photo-1516110833967-0b5716ca1387`
- `photo-1509228468518-180dd4864904`
- `photo-1620712943543-bcc4688e7485`
- `photo-1504639725590-34d0984388bd`
- `photo-1580894894513-541e068a3e2b`
- `photo-1581092160562-40aa08e78837`
- `photo-1597589827317-4c6d6e0a90bd`
- `photo-1596496050827-8299e0220de1`
- `photo-1614064641938-3bbee52942c7`
- `photo-1532094349884-543bc11b234d`

## Runtime libraries (new or central to the upgrade)

| Package | License |
|---------|---------|
| [three](https://threejs.org/) | MIT |
| [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) | MIT |
| [@react-three/drei](https://github.com/pmndrs/drei) | MIT |
| [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) | MIT |
| [animejs](https://animejs.com/) | MIT |
| [Next.js](https://nextjs.org/) | MIT |
| [Tailwind CSS](https://tailwindcss.com/) | MIT |

Icons in the UI are inline SVG (Lucide-style outlines), not a separate icon package.

## Music

The now-playing widget uses local files already present in `public/music/`. Those recordings were not added as part of this upgrade and remain the site owner's responsibility to license for public performance.
