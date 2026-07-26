import { base, bsc, bscTestnet, sepolia } from "viem/chains";
import type { Chain } from "viem";

const SUPPORTED_SBT_CHAINS: Record<number, Chain> = {
  [bsc.id]: bsc, // 56
  [bscTestnet.id]: bscTestnet, // 97
  [base.id]: base, // 8453
  [sepolia.id]: sepolia, // 11155111
};

export const SBT_CHAIN_ID = Number(process.env.NEXT_PUBLIC_SBT_CHAIN_ID);

if (!process.env.NEXT_PUBLIC_SBT_CHAIN_ID || !SUPPORTED_SBT_CHAINS[SBT_CHAIN_ID]) {
  throw new Error(
    `NEXT_PUBLIC_SBT_CHAIN_ID is missing or unsupported (got "${process.env.NEXT_PUBLIC_SBT_CHAIN_ID}"). ` +
      `Supported chain ids: ${Object.keys(SUPPORTED_SBT_CHAINS).join(", ")}.`
  );
}

export const SBT_CHAIN = SUPPORTED_SBT_CHAINS[SBT_CHAIN_ID];

// WTFSBT1155 contract address (previous Base deployment used
// "0x2BBE57dA6DFE615B9cE86B2BD149A953af7385d2" for the minter; new BNB Chain
// addresses are provided via env once deployed).
export const SBT_ADDRESS = process.env.NEXT_PUBLIC_SBT_ADDRESS as `0x${string}`;

// WTFSBT1155Minter contract address.
export const SBT_MINTER_ADDRESS = process.env
  .NEXT_PUBLIC_SBT_MINTER_ADDRESS as `0x${string}`;

export const OS_LINK =
  process.env.NEXT_PUBLIC_SBT_OPENSEA_URL ??
  "https://opensea.io/collection/wtf-certificates-base";
