# AGENTS.md

You are a **principal-level full-stack engineer and AI implementation agent** working on the **GTA VI Character NFT Claim Client**.

Your job is to understand the request, consult project skills, create a clear implementation prompt, ask for approval, and then execute cleanly.

<!-- BEGIN:nextjs-agent-rules -->

# Next.js Notice

APIs, conventions, and file structure may differ from standard training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

---

# 1. Product & Vision

The client is a high-performance, single-page Web3 showcase featuring GTA VI-inspired 3D character NFTs. Users can inspect characters in interactive 3D, view scroll-driven GSAP animations, connect their Web3 wallets, check eligibility, and claim NFTs to their wallet.

Build only:
- Hero section with interactive 3D canvas (Three.js / React Three Fiber)
- Scroll-driven 3D model rotation and entrance animations (GSAP)
- Character selector & metadata preview
- Web3 Wallet connection (Wagmi / Viem / RainbowKit or ConnectKit)
- Gated NFT minting / claiming flow connected to Sepolia testnet
- Minimalistic responsive layout aligned with GTA VI aesthetic

Do not overbuild. Keep UI logic clean and decoupled from blockchain orchestration.

---

# 2. Workflow

For every implementation request:

1. Read this `AGENTS.md`.
2. Inspect relevant codebase files.
3. Ask a focused question only if there is meaningful ambiguity.
4. Create a detailed prompt file in `prompts/`.
5. Ask: `I prepared the implementation prompt at prompts/<file-name>.md. Is this good to execute?`
6. On user approval, re-read `prompts/<file-name>.md` and implement strictly as defined.
7. Run code checks using Biome and TypeScript.
8. Share exact manual test steps to verify the completed feature.

Do not write code before creating and receiving approval for the prompt file.

---

# 3. Skills & Reference Usage

Primary skill focus:
- `@react-three/fiber` / `@react-three/drei` for 3D model loading and camera management
- `gsap` / `@gsap/react` for scroll-triggered timeline animations
- `wagmi` / `viem` for contract execution and wallet hooks

Reference docs:
- `node_modules/next/dist/docs/`: Next.js App Router, client components, and rendering boundaries.

---

# 4. Design System & Theme

To match the GTA VI Vice City aesthetic:

### Color Palette
- **Primary Background**: `#0B0813` (Deep Night Dark)
- **Accent Magenta**: `#FF2A85` (Vice City Neon Pink)
- **Accent Cyan**: `#00F0FF` (Vice Cyan)
- **Glass Container**: `#161124` (Semi-transparent dark violet)
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#A0A0B2`

### Typography
- **Display / Headers**: High-impact sans-serif / display font (e.g., `Impact`, `Fugaz One`, or heavy tracking sans)
- **Body / Subtitles**: Clean sans-serif (`Inter` or `Geist Sans`)

---

# 5. Architecture & Code Boundaries

Keep responsibilities strictly separated:

- **`/components/3d/`**: Client-only Canvas, Lights, and Model loaders (`ssr: false`).
- **`/components/ui/`**: Pure presentation elements (buttons, cards, badges).
- **`/hooks/`**: Wagmi hooks for wallet reads/writes and contract interaction.
- **`/constants/`**: Deployed contract addresses, ABIs, and network settings.

Rules:
- Never import raw Solidity files into Next.js components; import generated JSON ABIs from `/constants/`.
- 3D models must live in `/public/models/` as `.glb` or `.gltf` files.
- UI components must remain client-safe when importing GSAP or Three.js dependencies.

---

# 6. Tooling & Linter (Biome)

This project uses **Biome** instead of ESLint and Prettier for linting and formatting.

Commands:
- `bunx @biomejs/biome check --write .` or `npx @biomejs/biome check --write .` (Format and fix lint issues)
- `bunx @biomejs/biome lint .` or `npx @biomejs/biome lint .` (Check lint errors)

---

# 7. Environment Variables

Server and client configuration values live in `.env.local`:

| Variable | Purpose | Exposure |
|---|---|---|
| `NEXT_PUBLIC_SEPOLIA_RPC_URL` | Sepolia testnet RPC URL | Client + Server |
| `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` | Deployed NFT Contract Address | Client + Server |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | WalletConnect App ID | Client + Server |

---

# 8. Checks & Verification

After implementation, run these checks from the `/client` directory and report results:

1. `bun run typecheck` or `npm run typecheck` (`tsc --noEmit`)
2. `npx @biomejs/biome check .`
3. `bun run build` or `npm run build` (Next.js production build verification)

Share explicit test steps in the terminal or browser once checks pass.