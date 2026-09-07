"use client";

import { parseEther } from "viem";
import {
  useAccount,
  useChainId,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import {
  CHAIN_ID,
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
} from "@/constants/contractInfo";

export type MintStatus =
  | "idle"
  | "ready"
  | "confirming"
  | "pending"
  | "success"
  | "error";

// TODO(prompt 006): read mintPrice() from the contract instead of hardcoding.
const MINT_PRICE = parseEther("0.05");

export function useMintCharacter() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isReceiptPending,
    isSuccess,
    isError: isReceiptError,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash });

  const error = writeError ?? receiptError;
  const errorMessage = error
    ? ((error as { shortMessage?: string }).shortMessage ?? error.message)
    : null;

  let status: MintStatus = "idle";
  if (!isConnected) {
    status = "idle";
  } else if (isWritePending) {
    status = "confirming";
  } else if (isReceiptPending) {
    status = "pending";
  } else if (isSuccess) {
    status = "success";
  } else if (writeError || isReceiptError) {
    status = "error";
  } else {
    status = "ready";
  }

  async function mint(characterId: number) {
    if (status === "confirming" || status === "pending") return;

    if (chainId !== CHAIN_ID) {
      await switchChainAsync({ chainId: CHAIN_ID });
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "mintCharacter",
      args: [BigInt(characterId)],
      value: MINT_PRICE,
    });
  }

  return {
    status,
    errorMessage,
    needsSwitch: isConnected && chainId !== CHAIN_ID,
    mint,
    reset: resetWrite,
  };
}
