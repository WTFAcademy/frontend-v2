// Test-only stub for Next.js' `server-only` package.
//
// The real package's browser entry point throws on import, which is exactly
// what it is for: catching server modules pulled into a client bundle. In
// jsdom there is no RSC boundary to protect, so this no-op stands in.
export {};
