export default function Home() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-night px-6">
      {/* Radial backdrop glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-128 w-lg rounded-full bg-gold/14 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -bottom-40 h-128 w-lg rounded-full bg-cyan/14 blur-3xl"
      />

      <main className="relative z-10 flex flex-col items-center gap-6 text-center">
        <p className="text-caption uppercase tracking-[0.08em] text-muted">
          Nexus Collective Presents
        </p>
        <h1 className="max-w-3xl font-display text-h1 text-gradient">
          GTA VI Character NFT
        </h1>
        <p className="max-w-md text-body-lg text-muted">
          Inspect the characters in interactive 3D and claim yours on Ethereum
          Sepolia.
        </p>
        <button
          type="button"
          aria-disabled="true"
          title="Mint flow arrives in a later phase"
          className="mt-2 cursor-not-allowed rounded-md bg-gold px-8 py-3 font-semibold text-night shadow-glow-gold"
        >
          Claim Your Character
        </button>
        <p className="text-body-sm text-faint">
          Mint flow arrives in a later phase.
        </p>
      </main>
    </div>
  );
}
