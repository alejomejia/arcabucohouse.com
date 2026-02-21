"use client";

import dynamic from "next/dynamic";

import { useDisableScroll } from "@/lib/hooks/use-disable-scroll";

import { usePreloader } from "./hooks/use-preloader";

/**
 * Only load when the component is actually rendered
 * Used only in Homepage and per session
 */
const Preloader = dynamic(
  () => import("./index").then((mod) => mod.Preloader),
  { ssr: false }
)

/**
 * Conditionally renders the Preloader based on PreloaderContext state.
 *
 * Shows the preloader only when:
 * - User lands on homepage as first route of session
 * - Preloader hasn't run yet this session
 *
 * This component should be placed inside PreloaderProvider, typically
 * in the root layout. It handles:
 * - Rendering the Preloader when needed
 * - Disabling scroll during preloader animation
 *
 * @example
 * ```tsx
 * // In layout.tsx
 * <PreloaderProvider>
 *   <PreloaderGate />
 *   {children}
 * </PreloaderProvider>
 * ```
 */
export function PreloaderGate() {
  const { status, showsPreloader } = usePreloader();

  // Disable scroll while preloader is running
  useDisableScroll(status === "running");

  // Only render preloader when it should run and hasn't completed
  if (!showsPreloader || status === "ready") {
    return null;
  }

  return <Preloader />;
}
