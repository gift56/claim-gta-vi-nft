import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { sepolia } from "wagmi/chains";

const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
const wcProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!wcProjectId) {
  // eslint-disable-next-line no-console -- build-time config sanity check
  console.warn(
    "[wagmi] NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set. " +
      "WalletConnect mobile wallets will be unavailable.",
  );
}

export const config = getDefaultConfig({
  appName: "ViceMint",
  projectId: wcProjectId ?? "",
  chains: [sepolia],
  transports: rpcUrl ? { [sepolia.id]: http(rpcUrl) } : undefined,
  ssr: true, // Next.js app router requires this
});
