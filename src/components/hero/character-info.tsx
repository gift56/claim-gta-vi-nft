"use client";

import type { Character } from "@/data/characters";

interface CharacterInfoProps {
  character: Character;
}

export function CharacterInfo({ character }: CharacterInfoProps) {
  const nameClass =
    character.accent === "gold"
      ? "text-gradient-gold"
      : character.accent === "cyan"
        ? "text-cyan drop-shadow-[0_0_20px_rgb(0_240_255/40%)]"
        : "text-magenta drop-shadow-[0_0_20px_rgb(255_42_133/40%)]";
  const aliasClass =
    character.accent === "gold"
      ? "text-gold"
      : character.accent === "cyan"
        ? "text-cyan"
        : "text-magenta";

  return (
    <div className="flex flex-col gap-2">
      <p className="text-caption uppercase tracking-[0.14em] text-muted">
        Nexus Collective Presents
      </p>
      <h1 className={`font-display text-h1 ${nameClass}`}>{character.name}</h1>
      <p
        className={`text-body-sm font-semibold uppercase tracking-widest ${aliasClass}`}
      >
        {character.alias}
      </p>
      <p className="text-body-md text-muted">{character.tagline}</p>
      <p className="text-body-sm text-faint lg:line-clamp-3">
        {character.description}
      </p>
    </div>
  );
}
