"use client";

import { ACCENT_SOLID_BUTTON } from "@/constants/accent-styles";
import type { CharacterAccent } from "@/data/characters";

interface MintButtonProps {
  characterName: string;
  accent: CharacterAccent;
}

export function MintButton({ characterName, accent }: MintButtonProps) {
  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        aria-disabled="true"
        title="Mint flow arrives in a later phase"
        className={`shrink-0 cursor-not-allowed rounded-md px-6 py-2.5 font-semibold transition-colors duration-300 ${ACCENT_SOLID_BUTTON[accent]}`}
      >
        Mint {characterName}
      </button>
      <p className="text-caption text-faint">
        0.05 ETH · Mint flow arrives in a later phase.
      </p>
    </div>
  );
}
