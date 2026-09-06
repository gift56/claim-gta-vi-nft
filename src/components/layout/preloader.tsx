"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef, useState } from "react";
import { CHARACTERS } from "@/data/characters";

gsap.registerPlugin(useGSAP);

const MIN_DISPLAY_MS = 1200;

interface PreloaderProps {
  /** Called after the overlay exit animation completes. */
  onComplete: () => void;
}

/**
 * Full-screen asset preloader. No logo — just a caption, progress bar and
 * percentage counter. Preloads every character showcase image, then plays a
 * GSAP exit timeline and unmounts via the parent's `onComplete` handler.
 */
export function Preloader({ onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(0);
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useGSAP(
    () => {
      const root = rootRef.current;
      const bar = barRef.current;
      if (!root || !bar) return;

      const proxy = { value: 0 };
      const render = () => {
        setPercent(Math.round(proxy.value));
        gsap.set(bar, { scaleX: proxy.value / 100 });
      };

      const mm = gsap.matchMedia();
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          animate: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { reduce } = ctx?.conditions ?? {};
          const duration = (seconds: number) => (reduce ? 0 : seconds);

          // Intro: logo scales in, caption + track fade up.
          gsap.from(logoRef.current, {
            autoAlpha: 0,
            scale: 0.8,
            duration: duration(0.6),
            ease: "power3.out",
          });
          gsap.from(contentRef.current, {
            autoAlpha: 0,
            y: 12,
            duration: duration(0.5),
            ease: "power2.out",
            delay: duration(0.15),
          });

          const exit = () => {
            if (doneRef.current) return;
            doneRef.current = true;

            // FLIP the logo from center screen into the top-nav logo slot.
            const logo = logoRef.current;
            const navLogo =
              document.querySelector<HTMLImageElement>("[data-site-logo]");
            let deltaX = 0;
            let deltaY = 0;
            let scale = 1;
            if (logo && navLogo && !reduce) {
              const from = logo.getBoundingClientRect();
              const to = navLogo.getBoundingClientRect();
              deltaX = to.left + to.width / 2 - (from.left + from.width / 2);
              deltaY = to.top + to.height / 2 - (from.top + from.height / 2);
              scale = to.width / from.width;
            }

            gsap
              .timeline({ onComplete: () => onCompleteRef.current() })
              .to(bar, {
                scaleX: 1,
                duration: duration(0.2),
                ease: "power1.out",
              })
              .to(
                contentRef.current,
                {
                  autoAlpha: 0,
                  y: -12,
                  duration: duration(0.35),
                  ease: "power2.in",
                },
                "+=0.1",
              )
              .to(
                logo,
                {
                  x: deltaX,
                  y: deltaY,
                  scale,
                  duration: duration(0.7),
                  ease: "power3.inOut",
                },
                "-=0.1",
              )
              .to(
                root,
                {
                  autoAlpha: 0,
                  duration: duration(0.45),
                  ease: "power2.out",
                },
                "-=0.25",
              );
          };

          // Minimum display time so the bar animation always reads.
          const startedAt = Date.now();
          let loaded = 0;

          const finish = () => {
            const remaining = Math.max(
              0,
              MIN_DISPLAY_MS - (Date.now() - startedAt),
            );
            gsap.to(proxy, {
              value: 100,
              duration: duration(Math.max(0.1, remaining / 1000)),
              ease: "power2.out",
              onUpdate: render,
              overwrite: "auto",
              onComplete: exit,
            });
          };

          const urls = CHARACTERS.flatMap((character) => [
            character.images.front,
            character.images.side,
            character.images.back,
            character.images.portrait,
          ]);

          const tick = () => {
            loaded += 1;
            if (loaded === urls.length) {
              finish();
              return;
            }
            gsap.to(proxy, {
              value: (loaded / urls.length) * 100,
              duration: duration(0.3),
              ease: "power1.out",
              onUpdate: render,
              overwrite: "auto",
            });
          };

          for (const url of urls) {
            const img = new window.Image();
            img.onload = tick;
            img.onerror = tick; // never block on failures
            img.src = url;
          }
        },
      );
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-night"
    >
      <div className="flex flex-col items-center gap-6">
        <div ref={logoRef} className="will-change-transform">
          <Image
            src="/logo.png"
            alt="ViceMint"
            width={96}
            height={96}
            className="rounded-xl"
            priority
          />
        </div>
        <div ref={contentRef} className="flex w-64 flex-col items-center gap-4">
          <p className="text-caption uppercase tracking-[0.3em] text-muted">
            ( Preparing the Showcase )
          </p>
          <div className="h-px w-full overflow-hidden bg-hairline">
            <div
              ref={barRef}
              className="h-full w-full origin-left bg-linear-to-r from-magenta to-cyan"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <p className="font-mono text-caption text-faint">{percent}%</p>
        </div>
      </div>
    </div>
  );
}
