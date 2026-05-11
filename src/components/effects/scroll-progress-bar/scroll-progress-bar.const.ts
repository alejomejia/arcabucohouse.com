/**
 * Clip-path polygons that drive the bar's reveal/hide states. The bar is
 * rendered behind a fixed clip-path so animating the path moves the bar
 * in or out without touching its layout.
 */
export const SCROLL_PROGRESS_BAR_CLIP_PATH = {
  /** Hidden — collapsed at the horizontal center. */
  initial: "polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)",
  /** Fully visible. */
  show: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  /** Hidden by sliding off to the right. */
  hideToRight: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
  /** Pre-positioned offscreen-left, ready to slide in. */
  setBeforeIn: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
  /** Animation target when sliding in from the left. */
  showFromLeft: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
} as const

/** GSAP timing for the initial mount reveal. */
export const SCROLL_PROGRESS_BAR_MOUNT_ANIMATION = {
  duration: 1,
  ease: "power3.inOut",
} as const
