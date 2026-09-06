/**
 * Character showcase data.
 * Mock stats until prompt 004 wires real on-chain metadata.
 * Image paths point at verified files in /public/images.
 */

export type CharacterAccent = "magenta" | "cyan" | "gold";
export type CharacterView = "front" | "side" | "back";

export interface CharacterStat {
  label: string;
  /** 0–100, rendered as a stat bar percentage. */
  value: number;
}

export interface CharacterImages {
  front: string;
  side: string;
  back: string;
  /** Face crop used by the thumbnail selector. */
  portrait: string;
}

export interface Character {
  id: string;
  name: string;
  alias: string;
  tagline: string;
  description: string;
  stats: CharacterStat[];
  images: CharacterImages;
  accent: CharacterAccent;
}

export const CHARACTERS: Character[] = [
  {
    id: "jason",
    name: "Jason Duval",
    alias: "The Drifter",
    tagline: "Wants an easy life — but things just keep getting harder.",
    description:
      "Jason grew up around grifters and crooks, running with a rough crowd. A stint in the army aimed him toward a better life, but he came home to Vice City and fell back in with local trouble. Now he wants out of the trade — and Lucia is the reason he keeps finding a way back in.",
    stats: [
      { label: "Street Rep", value: 76 },
      { label: "Marksmanship", value: 94 },
      { label: "Driving", value: 80 },
      { label: "Nerve", value: 85 },
    ],
    images: {
      front: "/images/jason-font-light.png",
      side: "/images/jason-side-light.png",
      back: "/images/jason-back-light.png",
      portrait: "/images/jason-face.png",
    },
    accent: "gold",
  },
  {
    id: "lucia",
    name: "Lucia Caminos",
    alias: "The Strategist",
    tagline: "Fresh out of Leonida Penitentiary — and right back in the game.",
    description:
      "Lucia's father taught her to fight as soon as she could walk. Freshly released from prison, she and Jason Duval are determined to build a better life across Vice City — even if it means taking it from anyone in the way.",
    stats: [
      { label: "Street Rep", value: 82 },
      { label: "Driving", value: 74 },
      { label: "Hacking", value: 91 },
      { label: "Stamina", value: 68 },
    ],
    images: {
      front: "/images/lucia-front-light.png",
      side: "/images/lucid-side-light.png",
      back: "/images/lucia-back-light.png",
      portrait: "/images/lucia-face.png",
    },
    accent: "magenta",
  },
  {
    id: "dre-priest",
    name: "Dre'Quan Priest",
    alias: "The Hustler",
    tagline: "From block parties to the boardroom — every move is business.",
    description:
      "A promoter who knows exactly what the streets want to hear. Dre'Quan runs Only Raw Records and manages the Real Dimez, turning Vice City's music scene into his personal empire.",
    stats: [
      { label: "Street Rep", value: 90 },
      { label: "Driving", value: 61 },
      { label: "Charisma", value: 88 },
      { label: "Stamina", value: 72 },
    ],
    images: {
      front: "/images/dre-front-light.png",
      side: "/images/dre-side-light.png",
      back: "/images/dre-back-light.png",
      portrait: "/images/dre-face.png",
    },
    accent: "cyan",
  },
];

export function getCharacterById(id: string): Character {
  const found = CHARACTERS.find((character) => character.id === id);
  if (!found) {
    throw new Error(`Unknown character id: ${id}`);
  }
  return found;
}
