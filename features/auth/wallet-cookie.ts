export const walletStorageKey = "wagmi";
export const walletStoreCookie = walletStorageKey + ".store";

// Some clients persist JSON directly, others escape the entire cookie value.
export function walletStoreJSON(value: string | null | undefined) {
  if (!value) return null;
  try {
    const json = /^%7b/i.test(value) ? decodeURIComponent(value) : value;
    const record = JSON.parse(json);
    return record?.state && typeof record.state === "object" ? json : null;
  } catch {
    return null;
  }
}
