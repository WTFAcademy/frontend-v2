/** Resolve repository-relative links against the immutable commit the author submitted. */
export function sourceLink(value: string, source?: string): string {
  if (
    !source ||
    !/^https:\/\/raw\.githubusercontent\.com\/[\w.-]+\/[\w.-]+\/[a-f0-9]{40}\//i.test(
      source
    ) ||
    !value ||
    /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(value)
  )
    return value;
  const repo = source.split("/").slice(0, 6).join("/") + "/";
  try {
    return value.startsWith("/")
      ? new URL(value.slice(1), repo).href
      : new URL(value, source).href;
  } catch {
    return value;
  }
}
