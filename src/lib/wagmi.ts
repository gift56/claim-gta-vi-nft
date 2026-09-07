import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
const wcProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    walletConnect({ projectId: wcProjectId ?? "", showQrModal: true }),
    coinbaseWallet(),
  ],
  transports: { [sepolia.id]: rpcUrl ? http(rpcUrl) : http() },
});
