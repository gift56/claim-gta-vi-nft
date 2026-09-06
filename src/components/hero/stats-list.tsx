"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import type { Character } from "@/data/characters";

gsap.registerPlugin(useGSAP);

interface StatsListProps {
  character: Character;
  /** Fires once the preloader has finished; entrances wait for it. */
  ready: boolean;
}

export function StatsList({ character, ready }: StatsListProps) {
  const rootRef = useRef<HTMLDListElement>(null);

  useGSAP(
    () => {
      const el = rootRef.current;
      if (!el) return;
      const rows = el.querySelectorAll("[data-stat-row]");
      const fills = el.querySelectorAll<HTMLElement>("[data-stat-fill]");

      const mm = gsap.matchMedia();
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          animate: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { reduce } = ctx?.conditions ?? {};
          if (!ready) {
            gsap.set(rows, { autoAlpha: 0 });
            gsap.set(fills, { scaleX: 0 });
            return;
          }
          // Rows stagger in…
          gsap.fromTo(
            rows,
            { autoAlpha: 0, x: reduce ? 0 : -24 },
            {
              autoAlpha: 1,
              x: 0,
              duration: reduce ? 0 : 0.5,
              ease: "power3.out",
              stagger: reduce ? 0 : 0.08,
              delay: 0.25,
            },
          );
          // …then each stat bar fills to its value.
          fills.forEach((fill, index) => {
            const value = Number(fill.dataset.statFill) / 100;
            gsap.fromTo(
              fill,
              { scaleX: 0 },
              {
                scaleX: value,
                duration: reduce ? 0 : 0.9,
                ease: "power2.out",
                delay: reduce ? 0 : 0.45 + index * 0.08,
              },
            );
          });
        },
        el,
      );
      return () => mm.revert();
    },
    {
      scope: rootRef,
      dependencies: [ready, character.id],
      revertOnUpdate: true,
    },
  );

  return (
    <dl
      ref={rootRef}
      className="flex flex-col divide-y divide-hairline border-y border-hairline"
    >
      {character.stats.map((stat) => (
        <div
          key={stat.label}
          data-stat-row
          className="flex flex-col gap-1 py-2"
        >
          <div className="flex items-baseline justify-between">
            <dt className="text-body-sm uppercase tracking-widest text-muted">
              {stat.label}
            </dt>
            <dd className="font-mono text-body-sm text-ink">{stat.value}</dd>
          </div>
          <div
            role="presentation"
            className="h-1 w-full overflow-hidden rounded-full bg-surface-2"
          >
            <div
              data-stat-fill={stat.value}
              className={`h-full w-full origin-left rounded-full ${
                character.accent === "magenta"
                  ? "bg-magenta"
                  : character.accent === "gold"
                    ? "bg-gold"
                    : "bg-cyan"
              }`}
              style={{ transform: `scaleX(${stat.value / 100})` }}
            />
          </div>
        </div>
      ))}
    </dl>
  );
}
