# Prompt 001 — Design Style Guide & Design Tokens

> **Status:** DRAFT — awaiting product-owner approval.
> **Phase:** 1 (foundation). No feature sections, no 3D, no GSAP, no Web3 in this prompt.
> **Rule:** Implement strictly as defined below. Do not add anything not listed here.

---

## 1. Goal

Codify the visual identity of the **GTA VI Character NFT Claim** client into a Tailwind CSS v4 design-token layer, so every later feature prompt (hero, character selector, mint flow) consumes one canonical theme instead of ad-hoc values.

## 2. Source of truth & conflict note ⚠️

- **Canonical source:** `public/design.png` — the "Nexus Collective — Urban Cyberpunk Gaming" style guide provided by the product owner:
  - Primary BG `#0D132B`, Accent Gold `#FFC800`, Active Cyan `#00F0FF`, Text White `#FFFFFF`
  - Semantic: Success `#21C16B`, Warning `#FFC900`, Streak `#FFBA00`, Error `#FF4D4F`
  - Neutrals: Text Secondary `#8B92A1`, Sub-Text Gray `#6B7280`, Border `#E5E7EB`, UI Accents `#F6F7FB`
  - Display font: **Pricedown**; 8-step type scale (H1 48/Bold/1.2 → Caption 11/Regular/1.4)
- **Conflict:** `client/AGENTS.md §4` describes a Vice City palette (`#0B0813` bg, `#FF2A85` magenta, `#00F0FF` cyan). **This prompt supersedes §4 with the attached guide.** Cyan `#00F0FF` carries over unchanged; magenta is dropped. If the owner prefers the §4 palette, reject this prompt and a variant will be issued.

## 3. Scope

**In scope**
- Design tokens (colors, typography, radii, shadows, effects) in `src/app/globals.css` (Tailwind v4 `@theme`)
- Font wiring via `next/font` in `src/app/layout.tsx` + updated metadata
- Base element styles (selection, focus ring, scrollbar, `color-scheme`, reduced-motion guard)
- Small `@utility` layer (`glass-panel`, `text-gradient`, glow helpers)
- Static style-guide reference route `/styleguide`
- Minimal on-brand placeholder home (`src/app/page.tsx`)
- `src/constants/design-tokens.ts` — hex exports for future non-CSS consumers (Three.js)
- Add `"typecheck": "tsc --noEmit"` npm script (AGENTS.md §8 expects it; it is missing)

**Out of scope (do NOT build)**
- GSAP / ScrollTrigger, Three.js / R3F, wagmi / viem / wallet UI, contract reads
- Any new npm dependencies (`next/font` is built into Next)
- Navbar/footer/sections beyond the placeholder home

## 4. File plan

| Action | File |
|---|---|
| Modify | `src/app/globals.css` — replace boilerplate with the full token layer |
| Modify | `src/app/layout.tsx` — fonts, metadata, `themeColor`, body classes |
| Modify | `src/app/page.tsx` — minimal on-brand placeholder (see §8) |
| Modify | `package.json` — add `typecheck` script |
| Create | `src/app/styleguide/page.tsx` — static reference page (see §7) |
| Create | `src/constants/design-tokens.ts` — plain hex constants (see §9) |

## 5. Token specification

### 5.1 Colors — `@theme` namespace `--color-*`

| Token | Value | Role |
|---|---|---|
| `--color-night` | `#0D132B` | Primary BG — app background |
| `--color-surface` | `#131C3E` | Elevated card surface *(derived — not in guide)* |
| `--color-surface-2` | `#1B2650` | Hover / active surface *(derived — not in guide)* |
| `--color-gold` | `#FFC800` | Accent Gold — primary accent, CTAs |
| `--color-cyan` | `#00F0FF` | Active Cyan — secondary accent, focus |
| `--color-ink` | `#FFFFFF` | Text Primary |
| `--color-muted` | `#8B92A1` | Text Secondary |
| `--color-faint` | `#6B7280` | Sub-Text Gray |
| `--color-line` | `#E5E7EB` | Border (guide value — see usage note) |
| `--color-paper` | `#F6F7FB` | UI Accents (light chips/badges on dark) |
| `--color-success` | `#21C16B` | Semantic success |
| `--color-warning` | `#FFC900` | Semantic warning |
| `--color-streak` | `#FFBA00` | Semantic streak |
| `--color-error` | `#FF4D4F` | Semantic error |
| `--color-hairline` | `rgb(255 255 255 / 8%)` | Default hairline border on dark surfaces |

**Usage notes**
- The guide's `Border #E5E7EB` is near-white and harsh on navy; keep the token (per guide) but default dark-UI hairlines to `border-hairline` (`white/8%`). Reserve `line`/`paper` for high-contrast needs.
- `faint` has ≈3.8:1 contrast on `night` → use only for ≥14px non-essential text; otherwise use `muted` (≈5.9:1, AA).

### 5.2 Typography

**Fonts** (`next/font`, build-time self-hosted, `display: "swap"`):
- Display: **`Fugaz_One`** (Google, weight `"400"`, subset `latin`, variable `--font-display`) — stand-in for **Pricedown** (not on Google Fonts; licensed via Typodermic). Swap procedure in §6.
- Body: **`Inter`** (Google, variable, subset `latin`, variable `--font-sans`) — per AGENTS.md §4 body suggestion.
- Mono: **`Geist_Mono`** (Google, subset `latin`, variable `--font-mono`) — retained for wallet/contract addresses.

Declare in `@theme inline { --font-sans: var(--font-inter); --font-display: var(--font-fugaz); --font-mono: var(--font-geist-mono); }` (adjust var names to the `variable:` values chosen in `layout.tsx`).

**Type scale** — `@theme` `--text-*` tokens (size + `--line-height` + `--font-weight` modifiers):

| Utility | Size | Weight | Line-height | Usage |
|---|---|---|---|---|
| `text-h1` | `3rem` (48px) | 400 *(display font is inherently heavy)* | 1.2 | Page/screen titles, in `font-display` |
| `text-h2` | `1.5rem` (24px) | 600 | 1.3 | Section titles (body font) |
| `text-h3` | `1.25rem` (20px) | 600 | 1.3 | Card / module titles |
| `text-h4` | `1rem` (16px) | 500 | 1.4 | Subheadings |
| `text-body-lg` | `1rem` (16px) | 400 | 1.6 | Important content |
| `text-body-md` | `0.875rem` (14px) | 400 | 1.6 | Body text |
| `text-body-sm` | `0.8125rem` (13px) | 400 | 1.6 | Supporting text |
| `text-caption` | `0.6875rem` (11px) | 400 | 1.4 | Labels/meta — convention: `uppercase tracking-[0.08em]` |

**Heading font rule:** `H1` renders in `font-display`; `H2–H4` render in the body font at the weights above (Pricedown/Fugaz One have no semibold). A larger hero display token (~clamp 48→72px) may be introduced in the hero prompt, not now.

### 5.3 Radii, shadows, gradients

- Override radius scale: `--radius-sm: 8px`, `--radius-md: 12px`, `--radius-lg: 16px`, `--radius-xl: 24px` (plus `rounded-full` for pills).
- Shadows (`--shadow-*`):
  - `--shadow-glow-gold: 0 0 24px rgb(255 200 0 / 35%), 0 0 64px rgb(255 200 0 / 12%)`
  - `--shadow-glow-cyan: 0 0 24px rgb(0 240 255 / 35%), 0 0 64px rgb(0 240 255 / 12%)`
  - `--shadow-card: 0 8px 32px rgb(0 0 0 / 35%)`
- Gradient (used by `text-gradient` utility): `linear-gradient(90deg, #FFC800 0%, #FFFFFF 48%, #00F0FF 100%)`.
- Hero backdrop glows: two large `blur-3xl` radial blobs — gold at ~14% alpha top-left, cyan at ~14% alpha bottom-right.

### 5.4 Utilities (`@utility`)

- `glass-panel` → `bg-white/5 backdrop-blur-md border border-white/10`
- `text-gradient` → gradient background-clip text (transparent fill)
- `glow-gold` / `glow-cyan` → apply `shadow-glow-gold` / `shadow-glow-cyan`

### 5.5 Base styles (`@layer base`)

- `html`: `color-scheme: dark; scroll-behavior: smooth;`
- `body`: background `night`, text `ink`, `font-sans`, antialiased (applied via classes in `layout.tsx`).
- `::selection`: gold background, night text.
- `:focus-visible`: 2px cyan outline, 2px offset (never remove outlines without replacement).
- Custom scrollbar: thin; track `night`, thumb `surface-2`, hover `gold`.
- `@media (prefers-reduced-motion: reduce)`: neutralize CSS animations/transitions (GSAP prompts must also honor this later).
- Headings get `text-wrap: balance`.

## 6. Font wiring & Pricedown swap-in

1. In `src/app/layout.tsx`, load the three fonts from §5.2 with `next/font/google`, CSS variables `--font-fugaz`, `--font-inter`, `--font-geist-mono` (names must match `globals.css`).
2. `<html>` keeps `h-full antialiased` + the three font variables; `<body>` gets `min-h-full bg-night font-sans text-ink`.
3. Update metadata: `title: "GTA VI Character NFT Claim"`, `description: "Inspect and claim GTA VI-inspired character NFTs on Ethereum Sepolia."`. Set `themeColor: "#0D132B"` via the **`viewport` export** (Next 16 moved `themeColor` out of `metadata` — verify against `node_modules/next/dist/docs/` before coding).
4. **Pricedown swap (documented as a code comment, not executed):** drop licensed files into `src/app/fonts/` (e.g. `pricedown-bl.woff2`), then replace `Fugaz_One` with `next/font/local` exposing the same `--font-display` variable. No token or component changes required.

> Before implementing, consult `node_modules/next/dist/docs/` for `next/font` and the metadata/viewport APIs (Next 16 conventions may differ from older training data).

## 7. Style-guide route `/styleguide`

Static **server component**, zero client JS:
- **Colors:** swatch grid for bg/surface/gold/cyan, semantic, neutrals — each swatch shows token name + hex in `font-mono text-caption`.
- **Typography:** live specimens for H1 (plain + `text-gradient` variants), H2, H3, H4, body-lg/md/sm, caption; each labeled with size/weight/line-height from §5.2.
- **Effects:** one `glass-panel` card, one gradient headline, gold/cyan glow button previews (non-interactive), hairline dividers.
- Footer note: "Internal reference page — safe to delete before launch."
- Per-page `metadata` title: `"Style Guide — GTA VI NFT"`.

## 8. Placeholder home `src/app/page.tsx`

Replace the create-next-app boilerplate with a single full-viewport section:
- `bg-night` + the two radial glow blobs (§5.3)
- Centered stack: `text-caption` eyebrow `NEXUS COLLECTIVE PRESENTS` → `text-h1 font-display text-gradient` headline `GTA VI CHARACTER NFT` → `text-body-lg text-muted` one-line tagline → a gold CTA button preview (`bg-gold text-night font-semibold rounded-md shadow-glow-gold`) marked `aria-disabled` with helper text "Mint flow arrives in a later phase".
- No GSAP, no 3D, no links.

## 9. `src/constants/design-tokens.ts`

Plain `as const` object mirroring §5.1 hex values (`night`, `surface`, `surface2`, `gold`, `cyan`, `ink`, `muted`, `faint`, `line`, `paper`, `success`, `warning`, `streak`, `error`). Purpose: non-CSS consumers (future Three.js scene colors, canvas overlays). Header comment: "Mirrors @theme tokens in src/app/globals.css — keep in sync."

## 10. Accessibility & quality gates

- Contrast targets: gold on night ≈11.8:1 ✓, cyan ≈13:1 ✓, muted ≈5.9:1 ✓ (AA), faint large-only (§5.1 note).
- Every text token carries its line-height; no fixed pixel heights on text containers.
- Keyboard focus visible everywhere (cyan ring).
- Must pass: `npm run lint` (Biome), `npm run typecheck`, `npm run build`.
- React Compiler is enabled (`next.config.ts` `reactCompiler: true`) — write idiomatic, side-effect-free components.

## 11. Verification — exact steps

1. `npm run dev` → open `/`: night-navy background (no white flash), Fugaz One gradient headline, gold glowing CTA, radial glows visible.
2. Open `/styleguide`: all swatches and type specimens render per spec; visually compare against `public/design.png`.
3. Press `Tab` through both pages: cyan focus rings visible on interactive elements.
4. Select text: gold highlight, night text.
5. Resize 375px → 1440px: layout intact, no horizontal scroll.
6. Run `npm run lint`, `npm run typecheck`, `npm run build` — all clean.

## 12. Assumptions / open questions

1. **`design.png` supersedes AGENTS.md §4 palette** (flagged in §2) — confirm at approval.
2. **Pricedown is not bundled** (availability/licensing); Fugaz One stands in, swap documented in §6. If you have Pricedown files, say so at approval and implementation will wire `next/font/local` instead.
3. Derived tokens `surface` / `surface-2` and the `hairline` alpha are my elevation choices (not in the guide) — adjustable on request.
4. `Border #E5E7EB` / `UI Accents #F6F7FB` kept as tokens per the guide, but dark-UI hairlines default to `white/8%` (§5.1 note).

## 13. Next prompts (context only — do not implement)

`002` Hero + interactive 3D canvas · `003` GSAP scroll-driven rotation/entrance · `004` Character selector & metadata preview · `005` Wagmi provider + wallet connect · `006` Eligibility + claim flow (Sepolia).

