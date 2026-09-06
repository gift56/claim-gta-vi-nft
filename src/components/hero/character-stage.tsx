"use client";

import { Fake3DViewer } from "@/components/3d/Fake3DViewer";
import type { Character, CharacterView } from "@/data/characters";

interface CharacterStageProps {
  character: Character;
  view: CharacterView;
  onViewChange?: (view: CharacterView) => void;
}

export function CharacterStage({
  character,
  view,
  onViewChange,
}: CharacterStageProps) {
  return (
    <section
      aria-label={`${character.name} display`}
      className="glass-panel relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl"
    >
      {/* Glow + tilt + drag-to-rotate live inside Fake3DViewer */}
      <Fake3DViewer
        character={character}
        view={view}
        onViewChange={onViewChange}
      />
    </section>
  );
}
