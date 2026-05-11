const preloaderStatus = ["pending", "running", "ready"] as const;

/**
 * Status of the preloader animation sequence.
 * - "pending": Still determining if preloader should run (initial SSR/hydration)
 * - "running": Preloader animation is currently playing
 * - "ready": preloader animations can start (preloader done or was skipped)
 */
export type PreloaderStatus = typeof preloaderStatus[number];
