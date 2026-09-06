"use client";

import type { CharacterView } from "@/data/characters";

const SOCIALS = [
  { label: "X", href: "https://x.com" },
  { label: "Discord", href: "https://discord.com" },
  { label: "OpenSea", href: "https://opensea.io" },
];

const VIEWS: CharacterView[] = ["front", "side", "back"];

interface FooterProps {
  view: CharacterView;
  onViewChange: (view: CharacterView) => void;
}

export function Footer({ view, onViewChange }: FooterProps) {
  return (
    <footer className="relative z-10 flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-hairline px-4 py-2 text-caption text-muted md:flex-nowrap md:px-6">
      {/* Socials (left) */}
      <nav
        aria-label="Social links"
        className="flex items-center gap-4 md:gap-6"
      >
        {SOCIALS.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="uppercase tracking-[0.12em] transition-colors hover:text-gold"
          >
            {social.label}
          </a>
        ))}
      </nav>

      {/* View controls (right) */}
      <div
        role="radiogroup"
        aria-label="Character view angle"
        className="flex items-center gap-2"
      >
        <span className="mr-2 uppercase tracking-[0.12em] text-faint">
          View
        </span>
        {VIEWS.map((option) => {
          const selected = option === view;
          return (
            // biome-ignore lint/a11y/useSemanticElements: segmented view-control buttons per prompt 002 §5 radiogroup spec
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onViewChange(option)}
              className={`rounded-md px-3 py-1 uppercase tracking-[0.12em] transition-colors ${
                selected
                  ? "bg-surface-2 text-cyan"
                  : "text-muted hover:text-ink"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </footer>
  );
}
