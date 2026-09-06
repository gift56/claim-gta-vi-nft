# Prompt 004 — Entry Animations: Asset Loader + Hero GSAP Entrances

## Goal
Add a logo-free preloader that waits for all showcase images, then plays smooth GSAP
entry animations for the hero content (`CharacterInfo`) and the `ThumbnailSelector`
scaling reveal — inspired by the "( PREPARING THE SHOWCASE )" reference loader.

## Step 0 — Install dependencies
From `/client`:
```bash
npm install gsap @gsap/react
```

## Conventions (from gsap-core / gsap-react skills — mandatory)
- Use `useGSAP()` from `@gsap/react`; register once per module: `gsap.registerPlugin(useGSAP)`.
- Always pass a `scope` ref; use transform aliases (`x`, `y`, `autoAlpha`, `scale`).
- Respect `prefers-reduced-motion` via `gsap.matchMedia()` (duration 0 / skip).
- All GSAP code runs client-side only; components stay `"use client"`.

## 1. Asset Preloader — `src/components/layout/preloader.tsx`
- Full-screen fixed overlay (`z-50`, `bg-night`), **no logo image**.
- Content: caption "( PREPARING THE SHOWCASE )" in caption/uppercase/track-widest
  style, a thin 1px progress track (hairline) with an accent gradient fill bar,
  and a `%` counter (mono font).
- Preload all character images from `CHARACTERS` (`images.front/side/back/portrait`,
  12 total) using `new Image()` with `onload`/`onerror`; errors count as loaded
  (never block). Include a minimum display time (~1.2s) so the bar animation reads.
- Drive progress with a GSAP tween on a proxy object `{ value: 0 }` updated via
  `onUpdate` → `setProgress`; tween the bar fill `scaleX` with `transformOrigin: left`
  (never animate `width`).
- On 100%: play an exit timeline (bar flash → overlay `autoAlpha: 0` + slight `y`),
  then call `onComplete()` and unmount via parent state.

## 2. Page wiring — `src/app/page.tsx`
- `const [ready, setReady] = useState(false)`; render `<Preloader onComplete={...} />`
  while `!ready`. Keep hero mounted underneath (GSAP `autoAlpha: 0` initial states set
  by the components themselves), and pass `ready` down so entrances fire only after
  the loader exits.

## 3. CharacterInfo entrance — `src/components/hero/character-info.tsx`
- `useGSAP` scoped to the root ref; timeline staggered reveal of the 5 text blocks:
  caption fades in, then the `h1` name rises with a clip/`yPercent` mask reveal,
  then alias, tagline, description (`autoAlpha: 0, y: 24, stagger 0.08,
  ease power3.out`, ~0.7s total).
- Re-run on character change: `dependencies: [character.id], revertOnUpdate: true`,
  but only play when `ready` is true (gate inside the hook / skip until ready).

## 4. ThumbnailSelector scaling — `src/components/hero/thumbnail-selector.tsx`
- Entrance: each thumbnail `fromTo` `autoAlpha: 0, scale: 0.6` → `scale: 1` with
  `back.out(1.7)` and `stagger: 0.08`, gated on `ready`.
- Active-change pop: when `activeCharacterId` changes, tween the active button
  `scale: 1 → 1.12 → 1` (`yoyo`, `duration 0.18`) via `contextSafe` handler in an
  effect scoped to the component.
- Hover micro-scale handled with existing CSS transition classes (no extra GSAP).

## 5. Accessibility
- Wrap all timelines in `gsap.matchMedia()` with a `reduceMotion` condition:
  when reduced, set final states instantly (`duration: 0`).

## Checks
1. `npm run typecheck`
2. `npx @biomejs/biome check --write src`
3. `npm run build`

## Manual test steps
- Hard refresh with devtools network throttling → loader shows bar 0→100%, exits smoothly.
- After exit, CharacterInfo lines stagger in; selecting another character replays info reveal.
- Thumbnails scale-in with back.out stagger; clicking one pops it.
- Enable OS "reduce motion" → content appears without movement.
