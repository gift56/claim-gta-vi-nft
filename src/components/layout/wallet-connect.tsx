"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

const BASE_BUTTON_CLASSES =
  "rounded-md border px-4 py-2 text-body-sm font-semibold uppercase tracking-[0.12em] whitespace-nowrap transition-colors duration-300";

const GOLD_OUTLINE = "border-gold text-gold hover:bg-gold hover:text-night";

export function WalletConnect() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const connected = mounted && account && chain;

        if (!connected) {
          return (
            <button
              type="button"
              onClick={openConnectModal}
              className={`${BASE_BUTTON_CLASSES} ${GOLD_OUTLINE}`}
            >
              Connect Wallet
            </button>
          );
        }

        if (chain.unsupported) {
          return (
            <button
              type="button"
              onClick={openChainModal}
              className={`${BASE_BUTTON_CLASSES} border-error text-error hover:bg-error hover:text-ink`}
            >
              Wrong Network
            </button>
          );
        }

        return (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={openChainModal}
              className={`${BASE_BUTTON_CLASSES} border-hairline text-muted hover:text-gold`}
            >
              {chain.name}
            </button>
            <button
              type="button"
              onClick={openAccountModal}
              className={`${BASE_BUTTON_CLASSES} ${GOLD_OUTLINE}`}
            >
              {account.displayName}
            </button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
