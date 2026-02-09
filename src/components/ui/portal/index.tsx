"use client"

import { type ReactNode } from "react"
import { createPortal } from "react-dom"

import type { PortalId } from "./types"

export type PortalProps = {
  /** Target element ID (must exist in the DOM, e.g. via PortalRoot in layout). */
  id: PortalId
  children: ReactNode
}

/**
 * Renders children into a DOM node outside the current tree.
 * SSR-safe: returns null on the server and until the container exists on the client.
 * Use with a matching PortalRoot in layout (or any element with the same id).
 *
 * @example
 * <PortalRoot id={PORTAL_IDS.bodyTop} />
 */
export function Portal({ id, children }: PortalProps) {
  /** Ensure client-side only rendering to prevent hydration mismatch */
  if (typeof document === "undefined") return null

  const container = document.getElementById(id)
  if (!container) return null

  return createPortal(children, container)
}
