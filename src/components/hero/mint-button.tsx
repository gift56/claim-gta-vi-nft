"use client";

import { ACCENT_SOLID_BUTTON } from "@/constants/accent-styles";
import type { CharacterAccent } from "@/data/characters";
import { useMintCharacter } from "@/hooks/use-mint-character";

interface MintButtonProps {
  characterId: number;
  characterName: string;
  accent: CharacterAccent;
}

const LABELS: Record<ReturnType<typeof useMintCharacter>["status"], string> = {
  idle: "Connect wallet to mint",
  ready: "Mint",
  confirming: "Confirm in wallet…",
  pending: "Minting…",
  success: "Minted ✓",
  error: "Mint failed",
};

export function MintButton({
  characterId,
  characterName,
  accent,
}: MintButtonProps) {
  const { status, errorMessage, needsSwitch, mintPriceEth, mint } =
    useMintCharacter();

  const isBusy = status === "confirming" || status === "pending";
  const label =
    status === "ready" && !needsSwitch
      ? `Mint ${characterName}`
      : LABELS[status];

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        aria-disabled={isBusy}
        onClick={() => mint(characterId)}
        className={`shrink-0 rounded-md px-6 py-2.5 font-semibold transition-colors duration-300 ${ACCENT_SOLID_BUTTON[accent]} ${isBusy ? "opacity-60" : ""}`}
      >
        {label}
      </button>
      <output className="block text-caption text-faint">
        {mintPriceEth ? `${mintPriceEth} ETH` : "Loading price…"} · Sepolia
        testnet
        {status === "error" && errorMessage ? (
          <span className="block text-error">{errorMessage}</span>
        ) : null}
      </output>
    </div>
  );
}
