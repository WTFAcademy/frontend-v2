
export const shortWallet = (wallet?: string) => {
  if (!wallet) return "";
  return wallet.slice(0, 4) + "..." + wallet.slice(-4);
};
