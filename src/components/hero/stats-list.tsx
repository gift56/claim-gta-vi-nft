"use client";

import type { Character } from "@/data/characters";

interface StatsListProps {
  character: Character;
}

export function StatsList({ character }: StatsListProps) {
  return (
    <dl className="flex flex-col divide-y divide-hairline border-y border-hairline">
      {character.stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1 py-2">
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
              className={`h-full rounded-full ${
                character.accent === "magenta"
                  ? "bg-magenta"
                  : character.accent === "gold"
                    ? "bg-gold"
                    : "bg-cyan"
              }`}
              style={{ width: `${stat.value}%` }}
            />
          </div>
        </div>
      ))}
    </dl>
  );
}
