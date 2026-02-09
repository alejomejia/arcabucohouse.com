/**
 * sessionStorage key: when set, the preloader is skipped for the rest of the session.
 * Set when:
 * - Preloader completes its animation
 * - User's first page load is not the homepage
 */
export const PRELOADER_SHOWN_KEY = "preloaderShown";

/**
 * Whether to enable preloader debug mode.
 * If enabled, the preloader will be shown even if the user has already seen it.
 */
export const ENABLE_PRELOADER_DEBUG = false;