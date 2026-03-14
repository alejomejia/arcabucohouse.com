"use client";

/**
 * Renders the current year on the client.
 * Must be a Client Component because new Date() is non-deterministic
 * and Next.js 16 PPR forbids it in statically prerendered Server Components.
 */
export function CurrentYear() {
  return <>{new Date().getFullYear()}</>;
}
