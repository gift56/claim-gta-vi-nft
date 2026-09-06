"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import {
  ACCENT_ACTIVE_RING,
  ACCENT_HOVER_BORDER,
} from "@/constants/accent-styles";
import { CHARACTERS, type Character } from "@/data/characters";

gsap.registerPlugin(useGSAP);

interface ThumbnailSelectorProps {
  activeCharacterId: string;
  onSelect: (character: Character) => void;
  /** Fires once the preloader has finished; the scale-in waits for it. */
  ready: boolean;
}

export function ThumbnailSelector({
  activeCharacterId,
  onSelect,
  ready,
}: ThumbnailSelectorProps) {
  const navRef = useRef<HTMLElement>(null);

  // Staggered scale-in entrance, gated on the preloader.
  useGSAP(
    () => {
      const el = navRef.current;
      if (!el) return;
      const buttons = el.querySelectorAll("button");

      const mm = gsap.matchMedia();
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          animate: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { reduce } = ctx?.conditions ?? {};
          if (!ready) {
            gsap.set(buttons, { autoAlpha: 0 });
            return;
          }
          gsap.fromTo(
            buttons,
            { autoAlpha: 0, scale: reduce ? 1 : 0.6 },
            {
              autoAlpha: 1,
              scale: 1,
              duration: reduce ? 0 : 0.6,
              ease: reduce ? "none" : "back.out(1.7)",
              stagger: reduce ? 0 : 0.08,
              delay: 0.2,
            },
          );
        },
        el,
      );
      return () => mm.revert();
    },
    { scope: navRef, dependencies: [ready], revertOnUpdate: true },
  );

  // Micro pop whenever the active thumbnail changes.
  useGSAP(
    () => {
      if (!ready) return;
      const active = navRef.current?.querySelector(
        "button[aria-pressed='true']",
      );
      if (active) {
        gsap.fromTo(
          active,
          { scale: 1 },
          {
            scale: 1.12,
            duration: 0.16,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
            overwrite: "auto",
          },
        );
      }
    },
    { scope: navRef, dependencies: [activeCharacterId, ready] },
  );

  return (
    <nav
      ref={navRef}
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
