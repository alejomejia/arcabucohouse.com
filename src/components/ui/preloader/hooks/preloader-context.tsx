"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";

import { ENABLE_PRELOADER_DEBUG, PRELOADER_SHOWN_KEY } from "../preloader.const";
import type { PreloaderStatus } from "../preloader.types";

export interface PreloaderContextValue {
  /**
   * Current status of the preloader animation sequence.
   * - "pending": Still determining if preloader should run
   * - "running": Preloader is currently animating
   * - "ready": Preloader animations can start (preloader done or skipped)
   */
  status: PreloaderStatus;

  /** True when preloader animations can start (status === "ready") */
  isReady: boolean;

  /** True if the preloader is/was shown this session */
  showsPreloader: boolean;

  /**
   * Returns a Promise that resolves when preloader animations can start.
   * Resolves immediately if already ready. Use this in useGSAP
   * to coordinate animations.
   *
   * @example
   * ```tsx
   * const { waitForReady } = usePreloader();
   *
   * useGSAP(() => {
   *   let cancelled = false;
   *   waitForReady().then(() => {
   *     if (cancelled) return;
   *     gsap.to(ref.current, { opacity: 1 });
   *   });
   *   return () => { cancelled = true; };
   * }, []);
   * ```
   */
  waitForReady: () => Promise<void>;

  /**
   * Marks the preloader sequence as ready. Called by the Preloader when
   * its animation completes. Should not be called by consumer components.
   * @internal
   */
  markReady: () => void;
}

export const PreloaderContext = createContext<PreloaderContextValue | null>(
  null
);

export interface PreloaderProviderProps {
  children: ReactNode;
}

/**
 * Coordinates preloader animations across the app.
 *
 * Place this high in the component tree (e.g., in root layout).
 * It determines whether the preloader should run based on:
 * 1. Session storage (has preloader already run this session?)
 * 2. Initial route (is the first page load on homepage?)
 *
 * Consumer components use `usePreloader()` to await readiness.
 */
export function PreloaderProvider({
  children,
}: PreloaderProviderProps) {
  const pathname = usePathname();

  // Track decision state
  const [status, setStatus] = useState<PreloaderStatus>("pending");
  const [showsPreloader, setShowsPreloader] = useState(false);

  // Promise infrastructure for waitForReady()
  // Using refs to persist across renders and avoid recreating promises
  const resolveReadyRef = useRef<(() => void) | null>(null);
  const readyPromiseRef = useRef<Promise<void> | null>(null);

  // Create the promise once (stable across renders)
  if (!readyPromiseRef.current) {
    readyPromiseRef.current = new Promise<void>((resolve) => {
      resolveReadyRef.current = resolve;
    });
  }

  // Determine if preloader should run (only on initial mount)
  useLayoutEffect(() => {
    const alreadyShown = sessionStorage.getItem(PRELOADER_SHOWN_KEY) === "true";
    const isHomepage = pathname === "/";

    if (alreadyShown || !isHomepage) {
      // Skip preloader - mark as ready immediately
      if (!isHomepage && !alreadyShown) {
        // First visit was not homepage - mark session to skip future preloaders
        sessionStorage.setItem(PRELOADER_SHOWN_KEY, "true");
      }
      setShowsPreloader(false);
      setStatus("ready");
      resolveReadyRef.current?.();
    } else {
      // Show preloader
      setShowsPreloader(true);
      setStatus("running");
    }
    // Intentionally only run on mount - pathname from initial render
  }, []);

  // Mark ready callback (called by Preloader on complete)
  const markReady = useCallback(() => {
    if (!ENABLE_PRELOADER_DEBUG) {
      sessionStorage.setItem(PRELOADER_SHOWN_KEY, "true");
    }

    setStatus("ready");
    resolveReadyRef.current?.();
  }, [ENABLE_PRELOADER_DEBUG]);

  // waitForReady returns the same promise instance
  const waitForReady = useCallback(() => {
    return readyPromiseRef.current!;
  }, []);

  const value = useMemo<PreloaderContextValue>(
    () => ({
      status,
      isReady: status === "ready",
      showsPreloader,
      waitForReady,
      markReady,
    }),
    [status, showsPreloader, waitForReady, markReady]
  );

  return (
    <PreloaderContext.Provider value={value}>
      {children}
    </PreloaderContext.Provider>
  );
}