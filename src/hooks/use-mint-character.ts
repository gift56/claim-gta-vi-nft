"use client";

import { formatEther } from "viem";
import {
  useAccount,
  useChainId,
  useReadContract,
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

export function useMintCharacter() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  // Read the live on-chain mint price so payments always match the contract's
  // IncorrectPayment check exactly.
  const { data: mintPrice } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "mintPrice",
  });

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
    if (!mintPrice) return; // price not loaded yet

    if (chainId !== CHAIN_ID) {
      await switchChainAsync({ chainId: CHAIN_ID });
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "mintCharacter",
      args: [BigInt(characterId)],
      value: mintPrice,
      // Simple mint ~150k-250k gas. Cap it so viem's estimation can never
      // inflate to the 21M block limit, which Infura rejects
      // ("transaction gas limit too high (cap: 16777216)").
      gas: BigInt(500_000),
    });
  }

  return {
    status,
    errorMessage,
    needsSwitch: isConnected && chainId !== CHAIN_ID,
    mintPriceEth: mintPrice ? formatEther(mintPrice) : null,
    mint,
    reset: resetWrite,
  };
}
