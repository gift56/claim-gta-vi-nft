// Mirrors the @theme tokens in src/app/globals.css — keep in sync.
// Source of truth: public/design.png (Nexus Collective style guide).
// Consumed by non-CSS surfaces (Three.js scene colors, canvas overlays).

export const DESIGN_TOKENS = {
  color: {
    night: "#0D132B",
    surface: "#131C3E",
    surface2: "#1B2650",
    gold: "#FFC800",
    cyan: "#00F0FF",
    ink: "#FFFFFF",
    muted: "#8B92A1",
    faint: "#6B7280",
    line: "#E5E7EB",
    paper: "#F6F7FB",
    success: "#21C16B",
    warning: "#FFC900",
    streak: "#FFBA00",
    error: "#FF4D4F",
  },
} as const;
