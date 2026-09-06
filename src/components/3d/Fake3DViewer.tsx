"use client";

import {
  AnimatePresence,
  animate,
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

import type { Character, CharacterView } from "@/data/characters";

/** Views handled by this viewer — side view intentionally removed. */
type TurnaroundView = Extract<CharacterView, "front" | "back">;

interface Fake3DViewerProps {
  character: Character;
  view: CharacterView;
  /** Called when a drag settles on a new view bucket so parent state stays in sync. */
  onViewChange?: (view: CharacterView) => void;
  /** Tailwind classes for the accent glow layer (parallaxed for depth). */
  glowLayerClassName?: string;
}

/** Rotation targets (deg) for each view. */
const VIEW_ANGLES: Record<TurnaroundView, number> = {
  front: 0,
  back: 180,
};

const SNAP_POINTS = [0, 180];
const DEG_PER_PX = 0.5;

function viewFromAngle(angle: number): TurnaroundView {
  const a = ((angle % 360) + 360) % 360;
  return a < 90 || a >= 270 ? "front" : "back";
}

/** Map any incoming view (including legacy "side") onto the turnaround views. */
function toTurnaroundView(view: CharacterView): TurnaroundView {
  return view === "back" ? "back" : "front";
}

/** Shortest circular distance in degrees between two angles. */
function angleDistance(a: number, b: number): number {
  const diff = Math.abs((((a - b) % 360) + 360) % 360);
  return Math.min(diff, 360 - diff);
}

export function Fake3DViewer({
  character,
  view,
  onViewChange,
  glowLayerClassName,
}: Fake3DViewerProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartAngle = useRef(0);

  // --- Mouse-tracking tilt (depth illusion) ---
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltX = useSpring(pointerY, { stiffness: 150, damping: 20 });
  const tiltY = useSpring(pointerX, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(tiltX, (v) =>
    prefersReducedMotion ? 0 : v * -8,
  );
  const tiltRotateY = useTransform(tiltY, (v) =>
    prefersReducedMotion ? 0 : v * 12,
  );
  const glowParallaxX = useTransform(tiltY, (v) => v * -20);
  const glowParallaxY = useTransform(tiltX, (v) => v * -14);
  const sheenX = useTransform(tiltY, (v) => 50 + v * 40);
  const sheenY = useTransform(tiltX, (v) => 50 + v * 40);
  const sheenPosition = useTransform([sheenX, sheenY], ([x, y]: number[]) => {
    return `${x}% ${y}%`;
  });

  // --- Drag-to-rotate turnaround ---
  const angle = useMotionValue(VIEW_ANGLES[toTurnaroundView(view)]);
  const dragX = useMotionValue(0);
  const rotateY = useTransform([tiltRotateY, angle], (latest: number[]) => {
    return latest[0] + latest[1];
  });

  // Total opacity per stacked view image, driven by angular proximity.
  function useViewOpacity(center: number): MotionValue<number> {
    return useTransform(angle, (a) =>
      Math.max(0, 1 - angleDistance(a, center) / 50),
    );
  }
  const frontOpacity = useViewOpacity(VIEW_ANGLES.front);
  const backOpacity = useViewOpacity(VIEW_ANGLES.back);

  // Sync external view changes (footer arrows) to the angle motion value.
  useEffect(() => {
    const current = angle.get();
    const target = VIEW_ANGLES[toTurnaroundView(view)];
    // Choose the nearest equivalent target to avoid spinning the long way.
    const nearest = target + 360 * Math.round((current - target) / 360);
    animate(angle, nearest, { type: "spring", stiffness: 200, damping: 25 });
  }, [view, angle]);

  const rotateToView = useCallback(
    (next: CharacterView) => {
      onViewChange?.(next);
    },
    [onViewChange],
  );

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  function handleDragStart() {
    dragStartAngle.current = angle.get();
  }

  function handleDrag(_event: unknown, info: { offset: { x: number } }) {
    angle.set(dragStartAngle.current + info.offset.x * DEG_PER_PX);
  }

  function handleDragEnd() {
    const current = angle.get();
    // Snap to the nearest 90° point (spring both the rotation and the slide-back).
    const snap = SNAP_POINTS.reduce((best, point) =>
      angleDistance(current, point) < angleDistance(current, best)
        ? point
        : best,
    );
    animate(angle, snap, { type: "spring", stiffness: 200, damping: 25 });
    animate(dragX, 0, { type: "spring", stiffness: 300, damping: 30 });
    const next = viewFromAngle(snap);
    if (next !== view) {
      rotateToView(next);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const order: TurnaroundView[] = ["front", "back"];
    const current = toTurnaroundView(view);
    const index = order.indexOf(current);
    const step = event.key === "ArrowRight" ? 1 : order.length - 1;
    rotateToView(order[(index + step) % order.length]);
  }

  const glowClass =
    glowLayerClassName ??
    (character.accent === "magenta"
      ? "bg-magenta/14"
      : character.accent === "gold"
        ? "bg-gold/14"
        : "bg-cyan/14");
  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`${character.name} — draggable 360° turnaround, currently ${view} view`}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: keyboard arrows drive the turnaround rotation per prompt 003
      tabIndex={0}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
      className="group relative h-full w-full cursor-grab touch-pan-y rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-cyan/60 active:cursor-grabbing"
      style={{ perspective: 1200 }}
    >
      {/* Parallaxed accent glow (moves opposite the tilt for layered depth) */}
      <motion.div
        aria-hidden
        style={{ x: glowParallaxX, y: glowParallaxY }}
        className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-colors duration-500"
      >
        <div className={`h-full w-full rounded-full ${glowClass}`} />
      </motion.div>

      {/* Specular sheen following the pointer */}
      <motion.div
        aria-hidden
        style={{ backgroundPosition: sheenPosition }}
        className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_45%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Tilt + rotation wrapper (preserve-3d) */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full w-full p-6"
      >
        {/* Drag layer: horizontal drag maps to rotation, springs back on release */}
        <motion.div
          drag={prefersReducedMotion ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          dragMomentum={false}
          style={{ x: dragX }}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className="relative h-full w-full"
        >
          {/* Character swap crossfade; turnaround images crossfade by angle */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={character.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <motion.div
                style={{ opacity: frontOpacity }}
                className="absolute inset-0"
              >
                <Image
                  src={character.images.front}
                  alt={`${character.name} — front view`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  quality={95}
                  className="object-contain"
                  priority
                />
              </motion.div>
              <motion.div
                style={{ opacity: backOpacity }}
                className="absolute inset-0"
              >
                <Image
                  src={character.images.back}
                  alt={`${character.name} — back view`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  quality={95}
                  className="object-contain"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
