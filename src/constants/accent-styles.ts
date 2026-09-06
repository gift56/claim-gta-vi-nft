import type { CharacterAccent } from "@/data/characters";

/**
 * Accent-driven style maps — single source of truth so the Mint button,
 * Connect Wallet button, and thumbnails all follow the active character.
 * Values are static Tailwind class strings (required for JIT detection).
 */

export const ACCENT_SOLID_BUTTON: Record<CharacterAccent, string> = {
  magenta: "bg-magenta text-ink shadow-glow-magenta",
  gold: "bg-gold text-night shadow-glow-gold",
  cyan: "bg-cyan text-night shadow-glow-cyan",
};

export const ACCENT_OUTLINE_BUTTON: Record<CharacterAccent, string> = {
  magenta: "border-magenta/40 bg-surface text-magenta hover:bg-surface-2",
  gold: "border-gold/40 bg-surface text-gold hover:bg-surface-2",
  cyan: "border-cyan/40 bg-surface text-cyan hover:bg-surface-2",
};

export const ACCENT_ACTIVE_RING: Record<CharacterAccent, string> = {
  magenta: "border-magenta ring-1 ring-magenta",
  gold: "border-gold ring-1 ring-gold",
  cyan: "border-cyan ring-1 ring-cyan",
};

export const ACCENT_HOVER_BORDER: Record<CharacterAccent, string> = {
  magenta: "hover:border-magenta/60",
  gold: "hover:border-gold/60",
  cyan: "hover:border-cyan/60",
};
