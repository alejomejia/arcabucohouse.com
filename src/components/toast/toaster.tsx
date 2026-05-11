"use client"

import dynamic from "next/dynamic";
import type { ToasterProps } from "sonner";

// Dynamic import: sonner is only pulled into the bundle for routes that
// actually render <Toaster />.
const SonnerToaster = dynamic(
  () => import("sonner").then((mod) => mod.Toaster),
)

/**
 * Lazy-loaded wrapper around `sonner`'s `<Toaster />`. Mount once near
 * the root of the tree; pass any sonner config via `props`.
 *
 * @example
 * ```tsx
 * <body>
 *   <Toaster position="top-right" richColors />
 *   {children}
 * </body>
 * ```
 */
export function Toaster({ ...props }: ToasterProps) {
  return <SonnerToaster {...props} />
}