export const PORTAL_IDS = {
  bodyTop: 'body-top-portal',
  bodyBottom: 'body-bottom-portal',
} as const

export const HEADER_TOP_PADDING_CLASSNAME = "pt-16"

/** Focus ring for focusable elements placed on dark backgrounds (e.g. dialog panels, overlays). */
export const FOCUS_RING_ON_DARK_BG =
  'focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent' 

/**
 * Setup relevant layout z-index class names
 * for the different elements of the website
 */
export const Z_INDEX_CLASSNAMES = {
  preloader: "z-9999", // Always on top of all other elements
  cursor: "z-100", // Always on top of all other elements
  dialog: "z-90", // Over the main content and header
  header: "z-80", // To create a blending effect with main content
  pageTransition: "z-70", // Below header
  navigationOverlay: "z-40", // Below header
  main: "z-10", // To keep it over the footer for parallax effect
  footer: "z-0", // Bottom of all other elements for parallax effect
}