"use client";

import Image from "next/image";
import {
  ACCENT_ACTIVE_RING,
  ACCENT_HOVER_BORDER,
} from "@/constants/accent-styles";
import { CHARACTERS, type Character } from "@/data/characters";

interface ThumbnailSelectorProps {
  activeCharacterId: string;
  onSelect: (character: Character) => void;
}

export function ThumbnailSelector({
  activeCharacterId,
  onSelect,
}: ThumbnailSelectorProps) {
  return (
    <nav
      aria-label="Character selector"
      className="flex flex-row gap-3 lg:flex-col"
    >
      {CHARACTERS.map((character) => {
        const active = character.id === activeCharacterId;
        return (
          <button
            key={character.id}
            type="button"
            aria-pressed={active}
            aria-label={`View ${character.name}`}
            onClick={() => onSelect(character)}
            className={`relative aspect-square w-16 overflow-hidden rounded-md border transition-colors duration-300 lg:w-full ${
              active
                ? ACCENT_ACTIVE_RING[character.accent]
                : `border-hairline bg-surface hover:bg-surface-2 ${ACCENT_HOVER_BORDER[character.accent]}`
            }`}
          >
            <Image
              src={character.images.portrait}
              alt=""
              fill
              sizes="176px"
              quality={90}
              className="object-cover"
            />
          </button>
        );
      })}
    </nav>
  );
}
