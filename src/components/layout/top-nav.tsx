"use client";

import Image from "next/image";
import { getCharacterById } from "@/data/characters";
import { WalletConnect } from "./wallet-connect";

const MENU_LINKS = [
  { label: "Characters", href: "#characters" },
  { label: "Mint", href: "#mint" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "FAQ", href: "#faq" },
];

interface TopNavProps {
  activeCharacterId: string;
}

export function TopNav({ activeCharacterId }: TopNavProps) {
  const active = getCharacterById(activeCharacterId);

  return (
    <header className="relative z-10 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-hairline px-4 md:px-6">
      {/* Logo (left) */}
      <a
        href="/"
        className="flex shrink-0 items-center"
        aria-label="ViceMint home"
      >
        <Image
          src="/logo.png"
          alt="ViceMint logo"
          width={48}
          height={48}
          className="rounded-lg"
          data-site-logo
          priority
        />
      </a>

      {/* Menu links (center) */}
      <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
        {MENU_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-body-sm uppercase tracking-[0.12em] text-muted transition-colors hover:text-gold"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Connect Wallet */}
      <WalletConnect />
      <span className="sr-only" aria-live="polite">
        Currently viewing {active.name}
      </span>
    </header>
  );
}
