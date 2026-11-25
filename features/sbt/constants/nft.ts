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

// WTFSBT1155 (the ERC1155 that holds the certificates).
// Base deployment for reference: 0xB05D424943350aDfadeC4731CD54f12cC45E8c5c
// Note: the address this file used to hardcode as the "SBT" address
// (0x2BBE57dA6DFE615B9cE86B2BD149A953af7385d2) is in fact the *minter* — keep
// the two env vars straight or balance reads will revert.
export const SBT_ADDRESS = process.env.NEXT_PUBLIC_SBT_ADDRESS as `0x${string}`;

// WTFSBT1155Minter contract address (mint entrypoint; Base: 0x2BBE57dA…7385d2).
export const SBT_MINTER_ADDRESS = process.env
  .NEXT_PUBLIC_SBT_MINTER_ADDRESS as `0x${string}`;

// Suggested donation (in the chain's native currency) pre-filled in the mint
// step. Minting is free; this is only a suggestion.
export const SUGGESTED_DONATION_AMOUNT = 0.01;

// Native currency symbol of the configured SBT chain (BNB, ETH, ...). Used for
// every user-visible amount so copy follows the chain instead of hardcoding.
export const SBT_CURRENCY_SYMBOL = SBT_CHAIN.nativeCurrency.symbol;

// Social handle of the configured chain, used in the share-on-X copy.
const CHAIN_SOCIAL_HANDLES: Record<number, string> = {
  [bsc.id]: "@BNBCHAIN",
  [bscTestnet.id]: "@BNBCHAIN",
  [base.id]: "@base",
  [sepolia.id]: "@ethereum",
};

export const SBT_CHAIN_SOCIAL_HANDLE =
  CHAIN_SOCIAL_HANDLES[SBT_CHAIN_ID] ?? SBT_CHAIN.name;

export const OS_LINK =
  process.env.NEXT_PUBLIC_SBT_OPENSEA_URL ??
  "https://opensea.io/collection/wtf-certificates-base";
