"use client";

import Image from "next/image";

import type { Character, CharacterView } from "@/data/characters";

interface CharacterStageProps {
  character: Character;
  view: CharacterView;
}

export function CharacterStage({ character, view }: CharacterStageProps) {
  const glow =
    character.accent === "magenta"
      ? "bg-magenta/14"
      : character.accent === "gold"
        ? "bg-gold/14"
        : "bg-cyan/14";

  return (
    <section
      aria-label={`${character.name} display`}
      className="glass-panel relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl"
    >
      {/* Accent radial glow */}
      <div
        aria-hidden
        className={`pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full ${glow} blur-3xl transition-colors duration-500`}
      />

      {/* CSS-only parallax tilt placeholder (Three.js arrives in prompt 003) */}
      <div className="group relative h-full w-full p-6 perspective-distant">
        <Image
          key={`${character.id}-${view}`}
          src={character.images[view]}
          alt={`${character.name} — ${view} view`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          quality={95}
          className="object-contain transition-transform duration-300 ease-out transform-3d group-hover:transform-[rotateX(3deg)_rotateY(-6deg)_translateZ(8px)]"
          priority
        />
      </div>
    </section>
  );
}
