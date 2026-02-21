"use client"

import dynamic from "next/dynamic";
import type { ToasterProps } from "sonner";

/**
 * Dynamic import to avoid loading when not needed
 * Only load when the component is actually rendered
 */
const SonnerToaster = dynamic(
  () => import("sonner").then((mod) => mod.Toaster),
)

export function Toaster({ ...props }: ToasterProps) {
  return <SonnerToaster {...props} />
}