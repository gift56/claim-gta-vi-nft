# Prompt 003 — Fake 3D Interactive Character Viewer

## Goal
Replace the CSS-only parallax placeholder in `client/src/components/hero/character-stage.tsx` with a high-end "fake 3D" interactive viewer (like the PS5 DualSense 007 hero): mouse-tilt depth illusion + drag-to-rotate 360° turnaround using the existing 2D turnaround images (`front`, `side`, `back`), animated smoothly with Framer Motion.

## Context (verified)
- `character-stage.tsx` currently renders a `next/image` with a static CSS hover tilt inside a `.glass-panel` section. It receives `character: Character` and `view: CharacterView` from `page.tsx`.
- `CharacterView` = `"front" | "side" | "back"`. `Character.images` exposes `front`, `side`, `back`, `portrait`. There is **no dedicated right-facing image** — the `side` image is reused for both left and right facings.
- `page.tsx` owns `view` state (also driven by `Footer` arrows) and `activeCharacterId`.
- No `/components/3d/` directory exists yet. `framer-motion` is **not** installed in `client/package.json` (Next 16.3.4, React 19, Tailwind v4, Biome).

## Task 1 — Install dependency
- Add `motion` (the Framer Motion package, v12+, React 19 compatible) to `/client` via the project's package manager. Import from `"motion/react"`.

## Task 2 — Create `client/src/components/3d/Fake3DViewer.tsx`
A `"use client"` component with props `{ character: Character; view: CharacterView; onViewChange?: (v: CharacterView) => void }`.

### A. Mouse-tracking tilt (depth illusion)
- Container `motion.div` with `perspective` (e.g. 1200px) covering the stage.
- Bind `useMotionValue` for normalized pointer position (`mx`, `my` in `-1..1`) via `onPointerMove` / `onPointerLeave` on the container.
- `useSpring` wrapping those values (stiffness ~150, damping ~20) for buttery motion.
- `useTransform` to derive:
  - `rotateY = mx * 12deg`, `rotateX = -my * 8deg` on the character image wrapper (`transform-style: preserve-3d`).
  - A subtle parallax translate on the accent glow layer (moves opposite the tilt, e.g. ±20px) for layered depth.
  - Optional specular sheen: a radial highlight overlay whose `backgroundPosition` follows the pointer.
- Reset to 0 with spring on pointer leave.

### B. Drag-to-rotate 360° turnaround
- Make the character image a Framer Motion draggable element: `drag="x"`, `dragConstraints={{ left: 0, right: 0 }}`, `dragElastic: 0.15`.
- Track drag offset (`x` motion value) and pointer velocity/direction.
- Map horizontal drag to a rotation index snapped to 4 positions: `left-side(-1) → front(0) → back(1) → right-side(-1 reuse)`… **Simpler, decided model:** a linear `angle` motion value; dragging rotates `rotateY` proportionally (e.g. 0.5deg per px). The displayed image = `view` derived from `angle` bucket:
  - `|angle| < 45°` → front, `45–135°` → side, `135–225°` → back, then mirror back to side/front (wraps at 360°).
- On drag end, animate (`animate(x, snapTarget, { type: "spring", stiffness: 200, damping: 25 })`) the angle to the nearest snap point so it always settles cleanly on a view.
- **Crossfade between views:** render all view images stacked (`front`, `side`, `back`) with `AnimatePresence`-free opacity crossfade — each `motion.img` opacity driven by angular proximity to its bucket center (via `useTransform` on the angle motion value). This makes the swap feel like a real 3D rotation instead of a hard image swap. No layout jump; images are absolutely stacked with identical sizing.
- Sync with external state: when `view` prop changes (footer arrows / selector), animate the angle motion value to that view's target angle. When drag settles on a new bucket, call `onViewChange` so `page.tsx` state stays in sync (optional prop; guard for undefined).

### C. Interaction polish
- `cursor-grab` / `cursor-grabbing` during drag; `touch-action: pan-y` so mobile vertical scroll still works.
- Disable drag + reduce tilt on `prefers-reduced-motion`.
- Character swap (`character.id` change): fade/scale out-in transition (opacity + slight `scale 0.96→1`, 300ms ease-out).
- Keyboard accessible: left/right arrow keys rotate between views (on the focusable container, `role="img"` + `aria-label`).

## Task 3 — Wire into `CharacterStage`
- Replace the placeholder `<div className="group ...">` + `Image` in `character-stage.tsx` with `<Fake3DViewer character={character} view={view} onViewChange={...} />`.
- Keep the accent glow but move its parallax motion inside `Fake3DViewer` (or pass it as `children` — implementer's choice, document it).
- `page.tsx`: pass `onViewChange={(v) => setView(v)}` through `CharacterStage` → extend its props accordingly.

## Task 4 — Data fix
- `client/src/data/characters.ts`: Lucia's side image is `/images/lucid-side-light.png` — verify against `/public/images`; correct to the actual filename (likely `lucia-side-light.png`) if it's a typo. Do not break the build if the file genuinely doesn't exist — report findings.

## Constraints
- No Three.js in this prompt — this is the pure 2D "fake 3D" layer.
- Keep `next/image` for the character PNGs (fixed width/height or `fill` consistent with current layout).
- Style with Tailwind v4 utilities already used in the project (`glass-panel`, `bg-magenta`, `perspective-distant` etc. where applicable).
- No changes to layout/nav/footer components beyond the `onViewChange` prop threading.

## Acceptance checks
1. Moving the mouse over the character tilts it smoothly (X/Y rotation + glow parallax), springs back on leave.
2. Dragging left/right rotates through front → side → back with smooth crossfades and snaps to the nearest view on release.
3. Footer arrow view changes animate the character rotation to the matching view.
4. Switching characters crossfades cleanly; no image flashes or layout shift.
5. Works with touch drag on mobile; vertical page scroll not hijacked.
6. `npm run typecheck`, `npx @biomejs/biome check .`, `npm run build` all pass from `/client`.
