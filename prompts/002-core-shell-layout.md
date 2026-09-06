# Prompt 002 — Core Page Structure (The Shell)

> **Status:** DRAFT — awaiting product-owner approval.
> **Phase:** 2 (layout shell). Static structure + styling only.
> **Out of scope (later prompts):** Three.js/R3F canvas, GSAP scroll animations, wagmi wallet logic, character metadata contract reads.
> **Rule:** Implement strictly as defined. Do not add anything not listed here.

---

## 1. Goal

Replace the placeholder home (`src/app/page.tsx`) with the full single-screen "shell" layout mirroring `public/design.png`:

```
┌────────────────────────────────────────────────────────────┐
│ TopNav:  [Nexus Collective logo]  [menu links]  [Connect]  │
├──────────────┬──────────────────────────────┬──────────────┤
│ LEFT COLUMN  │       CENTER COLUMN          │ RIGHT COLUMN │
│ Character    │   Main character display     │  Thumbnail   │
│ name + tag   │   (3D canvas / parallax      │  selector    │
│ Stats list   │    container — placeholder)  │  sidebar     │
│ Mint button  │                              │              │
├──────────────┴──────────────────────────────┴──────────────┤
│ Footer:  socials (left) · view controls (right)            │
└────────────────────────────────────────────────────────────┘
```

## 2. Scope

**In scope**
- Full-viewport (no page scroll on desktop) shell: TopNav, hero grid, Footer
- Grouped component folders: `components/layout/`, `components/hero/`
- Character data module: `src/data/characters.ts` (typed data for the two known characters: Lucia, Dre'Quan "Dre" Priest — image paths already in `public/images/`)
- Client-side character selection state (thumbnail click swaps left-column info + stage image)
- Connect Wallet button as a **styled placeholder** (`aria-disabled` + tooltip "Wallet connection arrives in a later phase")
- Center stage placeholder: parallax-ready container rendering the character's front-light PNG with subtle hover tilt (CSS transform only, no Three.js)

**Out of scope (do NOT build)**
- Any new npm dependencies
- Real 3D (`components/3d/` is reserved for prompt 003)
- GSAP, wagmi/viem, RainbowKit, minting logic

## 3. File plan

| Action | File | Purpose |
|---|---|---|
| Modify | `src/app/page.tsx` | Compose the shell from the components below |
| Create | `src/data/characters.ts` | `Character` type + `CHARACTERS` array (`id`, `name`, `alias`, `tagline`, `description`, `stats: {label, value}[]`, `images: {front, side, back}`, `accent: 'gold' \| 'cyan'`) |
| Create | `src/components/layout/top-nav.tsx` | Client component: logo left (wordmark "NEXUS COLLECTIVE" with gold dot), center menu links (Characters, Mint, Roadmap, FAQ — anchor placeholders), right Connect Wallet button |
| Create | `src/components/layout/footer.tsx` | Client component: socials left (X, Discord, OpenSea — anchor placeholders), view controls right (front/side/back light toggle affecting the stage image) |
| Create | `src/components/hero/character-info.tsx` | Client component: eyebrow caption (`NEXUS COLLECTIVE PRESENTS`), display name (`text-h1 font-display text-gradient`), alias + tagline (`text-muted`), description |
| Create | `src/components/hero/stats-list.tsx` | Client component: rows of `label … value` with hairline dividers, stat bars in character accent color |
| Create | `src/components/hero/mint-button.tsx` | Client component: gold CTA (`shadow-glow-gold`), price/availability caption beneath, `aria-disabled` placeholder |
| Create | `src/components/hero/character-stage.tsx` | Client component: center display area — glass-panel frame, radial glow in character accent, character PNG (front/side/back per footer view control), CSS-only pointer-parallax tilt, `next/image` with priority |
| Create | `src/components/hero/thumbnail-selector.tsx` | Client component: vertical sidebar of character thumbnails (existing PNGs), active state = cyan ring + `bg-surface-2`, click switches character |
| Create | `src/components/hero/index.ts` | Barrel export for the hero components |

**State ownership:** `page.tsx` becomes a client component holding `activeCharacterId` + `view` (front/side/back), passing data/props down. No context needed yet.

**Naming convention (project-wide):** all filenames are lowercase kebab-case (`top-nav.tsx`, `character-stage.tsx`); component/function exports remain PascalCase/camelCase. Apply this in all future prompts.

## 4. Layout & responsive spec

- Root: `min-h-dvh flex flex-col bg-night overflow-hidden` + the two radial glow blobs from prompt 001 kept.
- TopNav: `h-16`, hairline bottom border, `px-6`.
- Hero grid: `flex-1 grid grid-cols-[minmax(260px,340px)_1fr_minmax(180px,220px)] gap-8 px-6` on `lg+`. Below `lg`: stack — stage first, info, stats, thumbnails horizontal, footer.
- Footer: `h-14`, hairline top border, `text-caption text-muted`.
- Center stage: fills grid cell, `rounded-xl glass-panel`, character image `object-contain` max-h constrained.

## 5. Accessibility & quality gates

- All interactive elements keyboard-reachable with cyan focus ring (already global).
- Thumbnails are `<button>`s with `aria-pressed` + character name in `aria-label`.
- View controls: `role="radiogroup"` / `role="radio"` with `aria-checked`.
- Alt text on every character image.
- Must pass: `npm run lint` (Biome), `npm run typecheck`, `npm run build`.
- React Compiler enabled — idiomatic, side-effect-free render logic.

## 6. Verification — exact steps

1. `npm run dev` → `/` renders the three-column shell at 1440px: nav top, grid center, footer bottom, no page scroll.
2. Click a thumbnail → left info, stats, accent glow, and stage image swap.
3. Click footer view controls (front/side/back) → stage image switches light angle.
4. Hover center stage → subtle parallax tilt; reduced-motion honored.
5. Resize 375px → sections stack, no horizontal scroll.
6. Run `npm run lint`, `npm run typecheck`, `npm run build` — all clean.

## 7. Assumptions / open questions

1. Two characters (Lucia, Dre'Quan Priest) using PNGs already in `public/images/`; odd filenames (`lucid-side-light.png`, `Dre'Quan Priest.png` vs `Dre_Quan_Priest.png`) will be resolved by pointing `characters.ts` at verified paths.
2. Stats values are mock data (e.g., Street Rep, Vehicle Skill, Hacking) until prompt 004 wires real metadata.
3. Menu links + socials are decorative anchors until routes exist.

## 8. Next prompts (context only — do not implement)

`003` Three.js / R3F interactive canvas replacing the stage placeholder · `004` Character selector wired to real metadata · `005` wagmi provider + real Connect Wallet · `006` Eligibility + claim flow.

