/** Resolve local material paths against the version served by its publisher. */
export function sourceLink(value: string, source?: string): string {
  if (!source || !value || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(value)) return value;
  try {
    const file = new URL(source);
    const github = /^https:\/\/raw\.githubusercontent\.com\/[\w.-]+\/[\w.-]+\/[a-f0-9]{40}\//i.exec(source);
    const academy = /^(.*\/v1\/material\/\d+\/[a-f0-9]{64}\/)/.exec(file.pathname);
    let root = github?.[0];
    if (academy && process.env.NEXT_PUBLIC_API_URL && file.origin === new URL(process.env.NEXT_PUBLIC_API_URL).origin) {
      root = file.origin + academy[1];
    }
    if (!root) return value;
    const target = value.startsWith("/") ? new URL(value.slice(1), root) : new URL(value, file);
    return target.href.startsWith(root) ? target.href : value;
  } catch {
    return value;
  }
}
