import type { Metadata } from "next";
import { DESIGN_TOKENS } from "@/constants/design-tokens";

export const metadata: Metadata = {
  title: "Style Guide — GTA VI NFT",
};

const COLOR_GROUPS = [
  {
    title: "Primary",
    swatches: [
      { name: "night", hex: DESIGN_TOKENS.color.night, role: "Primary BG" },
      {
        name: "surface",
        hex: DESIGN_TOKENS.color.surface,
        role: "Elevated surface",
      },
      {
        name: "surface-2",
        hex: DESIGN_TOKENS.color.surface2,
        role: "Hover surface",
      },
      {
        name: "magenta",
        hex: DESIGN_TOKENS.color.magenta,
        role: "Accent Magenta (ViceMint)",
      },
      { name: "cyan", hex: DESIGN_TOKENS.color.cyan, role: "Active Cyan" },
      { name: "ink", hex: DESIGN_TOKENS.color.ink, role: "Text Primary" },
    ],
  },
  {
    title: "Semantic",
    swatches: [
      { name: "success", hex: DESIGN_TOKENS.color.success, role: "Success" },
      { name: "warning", hex: DESIGN_TOKENS.color.warning, role: "Warning" },
      { name: "streak", hex: DESIGN_TOKENS.color.streak, role: "Streak" },
      { name: "error", hex: DESIGN_TOKENS.color.error, role: "Error" },
    ],
  },
  {
    title: "Neutrals",
    swatches: [
      { name: "muted", hex: DESIGN_TOKENS.color.muted, role: "Text Secondary" },
      { name: "faint", hex: DESIGN_TOKENS.color.faint, role: "Sub-Text Gray" },
      { name: "line", hex: DESIGN_TOKENS.color.line, role: "Border" },
      { name: "paper", hex: DESIGN_TOKENS.color.paper, role: "UI Accents" },
    ],
  },
] as const;

const TYPE_SPECIMENS = [
  {
    className: "font-display text-h1",
    label: "H1",
    meta: "48px · 400 · 1.2 · display",
  },
  { className: "text-h2", label: "H2", meta: "24px · 600 · 1.3" },
  { className: "text-h3", label: "H3", meta: "20px · 600 · 1.3" },
  { className: "text-h4", label: "H4", meta: "16px · 500 · 1.4" },
  { className: "text-body-lg", label: "Body Large", meta: "16px · 400 · 1.6" },
  { className: "text-body-md", label: "Body Medium", meta: "14px · 400 · 1.6" },
  { className: "text-body-sm", label: "Body Small", meta: "13px · 400 · 1.6" },
  {
    className: "text-caption uppercase tracking-[0.08em]",
    label: "Caption",
    meta: "11px · 400 · 1.4 · uppercase",
  },
] as const;

export default function StyleGuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-14">
        <p className="text-caption uppercase tracking-[0.08em] text-muted">
          Nexus Collective
        </p>
        <h1 className="font-display text-h1 text-magenta">
          Design Style Guide
        </h1>
        <p className="mt-2 text-body-md text-muted">
          Canonical tokens from{" "}
          <span className="font-mono">public/design.png</span>. See{" "}
          <span className="font-mono">prompts/001-design-style-guide.md</span>.
        </p>
      </header>

      <section className="mb-14">
        <h2 className="mb-6 text-h2">Colors</h2>
        {COLOR_GROUPS.map((group) => (
          <div key={group.title} className="mb-8">
            <h3 className="mb-3 text-h4 text-muted">{group.title}</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {group.swatches.map((swatch) => (
                <div
                  key={swatch.name}
                  className="overflow-hidden rounded-md border border-hairline"
                >
                  <div
                    className="h-16 border-b border-hairline"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <div className="bg-surface px-3 py-2">
                    <p className="text-body-sm font-semibold text-ink">
                      {swatch.role}
                    </p>
                    <p className="font-mono text-caption text-muted">
                      {swatch.name} · {swatch.hex}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mb-14">
        <h2 className="mb-6 text-h2">Typography</h2>
        <div className="space-y-6">
          {TYPE_SPECIMENS.map((spec) => (
            <div key={spec.label}>
              <p className={`${spec.className} text-ink`}>
                Vice City Awaits — ABCDEF 0123456789
              </p>
              <p className="mt-1 font-mono text-caption text-faint">
                {spec.label} · {spec.meta}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="mb-6 text-h2">Effects</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-panel rounded-lg p-6">
            <h3 className="text-h3">Glass Panel</h3>
            <p className="mt-2 text-body-sm text-muted">
              <code className="font-mono">glass-panel</code> utility: white/5
              fill, backdrop blur, white/10 border.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-hairline bg-surface p-6">
            <span className="rounded-md bg-magenta px-6 py-2 font-semibold text-ink shadow-glow-magenta">
              Glow Gold
            </span>
            <span className="rounded-md border border-cyan px-6 py-2 font-semibold text-cyan shadow-glow-cyan">
              Glow Cyan
            </span>
          </div>
        </div>
      </section>

      <footer className="border-t border-hairline pt-6">
        <p className="text-caption uppercase tracking-[0.08em] text-faint">
          Internal reference page — safe to delete before launch.
        </p>
      </footer>
    </div>
  );
}
