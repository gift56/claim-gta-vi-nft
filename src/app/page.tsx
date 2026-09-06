"use client";

import { useState } from "react";

import {
  CharacterInfo,
  CharacterStage,
  MintButton,
  StatsList,
  ThumbnailSelector,
} from "@/components/hero";
import { Footer } from "@/components/layout/footer";
import { TopNav } from "@/components/layout/top-nav";
import {
  CHARACTERS,
  type CharacterView,
  getCharacterById,
} from "@/data/characters";

export default function Home() {
  const [activeCharacterId, setActiveCharacterId] = useState(CHARACTERS[0].id);
  const [view, setView] = useState<CharacterView>("front");

  const character = getCharacterById(activeCharacterId);

  return (
    <div className="relative flex min-h-dvh flex-col bg-night lg:h-dvh lg:overflow-hidden">
      {/* Banner backdrop — blended into the dark theme */}
      <div aria-hidden className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{ backgroundImage: "url(/gta-banner.png)" }}
        />
        {/* Dark scrims so text/cards stay readable */}
        <div className="absolute inset-0 bg-linear-to-b from-night/70 via-night/40 to-night/90" />
        <div className="absolute inset-0 bg-night/30" />
      </div>

      <TopNav activeCharacterId={activeCharacterId} />

      {/* Hero grid */}
      <main className="relative z-10 grid min-h-0 flex-1 grid-cols-1 gap-6 px-6 py-4 lg:grid-cols-[minmax(260px,340px)_1fr_minmax(180px,220px)] lg:gap-8 lg:py-5">
        {/* Left column: info, stats, mint — stage first on mobile via order */}
        <div className="order-2 flex min-h-0 flex-col gap-4 lg:order-1 lg:overflow-y-auto lg:pr-1">
          <CharacterInfo character={character} />
          <StatsList character={character} />
          <MintButton
            characterName={character.name}
            accent={character.accent}
          />
        </div>

        {/* Center column: character display */}
        <div className="order-1 min-h-[60vh] lg:order-2 lg:min-h-0">
          <CharacterStage
            character={character}
            view={view}
            onViewChange={setView}
          />
        </div>

        {/* Right column: thumbnail selector */}
        <div className="order-3 flex min-h-0 flex-row items-center justify-center gap-3 lg:flex-col lg:items-stretch lg:justify-start lg:overflow-y-auto">
          <ThumbnailSelector
            activeCharacterId={activeCharacterId}
            onSelect={(selected) => setActiveCharacterId(selected.id)}
          />
        </div>
      </main>

      <Footer view={view} onViewChange={setView} />
    </div>
  );
}
