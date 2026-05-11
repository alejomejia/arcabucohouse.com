/**
 * sessionStorage key: when set, the preloader is skipped for the rest of the session.
 * Set when:
 * - Preloader completes its animation
 * - User's first page load is not the homepage
 */
export const PRELOADER_SHOWN_KEY = "preloaderShown"

/**
 * Whether to enable preloader debug mode.
 * If enabled, the preloader will be shown even if the user has already seen it.
 */
export const ENABLE_PRELOADER_DEBUG = false

/**
 * Clip-path polygons that drive the preloader's reveal animation.
 * `initial` is the fully-visible state; `final` collapses upward to expose the page.
 */
export const PRELOADER_CLIP_PATH = {
  initial: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  final: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
} as const

/**
 * GSAP timing tokens (seconds) for the preloader sequence. Kept centrally so
 * the description, counter, scale, digit-slide, and clip-reveal stages can be
 * tuned together.
 */
export const PRELOADER_TIMING = {
  descriptionDuration: 1.5,
  descriptionStagger: 0.5,
  counterDuration: 3,
  scaleDuration: 2.5,
  digitSlideDelay: 1,
  digitSlideDuration: 0.75,
  digitSlideStagger: 0.1,
  revealDuration: 1,
} as const
