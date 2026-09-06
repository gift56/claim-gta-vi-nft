"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import type { Character } from "@/data/characters";

gsap.registerPlugin(useGSAP);

interface CharacterInfoProps {
  character: Character;
  /** Fires once the preloader has finished; entrances wait for it. */
  ready: boolean;
}

export function CharacterInfo({ character, ready }: CharacterInfoProps) {
  const rootRef = useRef<HTMLDivElement>(null);

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

  useGSAP(
    () => {
      const el = rootRef.current;
      if (!el) return;
      const targets = el.querySelectorAll("[data-reveal]");

      const mm = gsap.matchMedia();
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          animate: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { reduce } = ctx?.conditions ?? {};
          if (!ready) {
            gsap.set(targets, { autoAlpha: 0 });
            return;
          }
          gsap.fromTo(
            targets,
            { autoAlpha: 0, y: reduce ? 0 : 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: reduce ? 0 : 0.6,
              ease: "power3.out",
              stagger: reduce ? 0 : 0.08,
              delay: 0.1,
            },
          );
        },
        el,
      );
      return () => mm.revert();
    },
    {
      scope: rootRef,
      dependencies: [ready, character.id],
      revertOnUpdate: true,
    },
  );

  return (
    <div ref={rootRef} className="flex flex-col gap-2">
      <p
        data-reveal
        className="text-caption uppercase tracking-[0.14em] text-muted"
      >
        Nexus Collective Presents
      </p>
      <h1 data-reveal className={`font-display text-h1 ${nameClass}`}>
        {character.name}
      </h1>
      <p
        data-reveal
        className={`text-body-sm font-semibold uppercase tracking-widest ${aliasClass}`}
      >
        {character.alias}
      </p>
      <p data-reveal className="text-body-md text-muted">
        {character.tagline}
      </p>
      <p data-reveal className="text-body-sm text-faint lg:line-clamp-3">
        {character.description}
      </p>
    </div>
  );
}
