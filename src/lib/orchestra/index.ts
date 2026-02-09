/**
 * Animation orchestration configurations.
 *
 * These configs define animation timing for different UI sections.
 * Delays here are RELATIVE (e.g., stagger between elements), not absolute
 * delays from page load. The intro animation system handles coordination
 * with the preloader automatically.
 */

type Orchestra = Record<string, gsap.TimelineVars>

const DEFAULT_DELAY = 0.25

/**
 * Menu overlay animations.
 * Used when the navigation menu opens/closes.
 */
export const orchestraMenuOverlay: Orchestra = {
  menuList: {
    delay: DEFAULT_DELAY,
    defaults: { ease: "gentleSlow" },
  },
  topText: {
    duration: 1,
    delay: DEFAULT_DELAY * 2,
    stagger: 0.1,
    ease: "gentleSlow",
  },
  imageStack: {
    delay: DEFAULT_DELAY * 3,
    duration: 1,
  },
  footerTexts: {
    duration: 1.5,
    delay: DEFAULT_DELAY,
    ease: "gentleSlow",
    stagger: 0.05,
  },
  backgroundVideo: {
    delay: DEFAULT_DELAY * 3,
    duration: 1.5,
  },
}
