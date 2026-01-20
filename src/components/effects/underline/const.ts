/**
 * Animation classes for underline sliding from left side.
 * When mouse enters from left, underline slides from right to left.
 */
export const ANIMATION_FROM_LEFT = [
  // Pseudo-element setup
  'before:left-0',

  // Animation - slide from right to left
  'before:origin-right',

  // Hover state - slide in from left
  'hover:before:origin-left',
].join(' ')

/**
 * Animation classes for underline sliding from right side.
 * When mouse enters from right, underline slides from left to right.
 */
export const ANIMATION_FROM_RIGHT = [
  // Pseudo-element setup
  'before:right-0',

  // Animation - slide from left to right
  'before:origin-left',

  // Hover state - slide in from right
  'hover:before:origin-right',
].join(' ')

/**
 * Base TailwindCSS classes for the underline animation effect.
 *
 * Creates a pseudo-element that acts as an underline, positioned below the content.
 * The underline scales from 0 to full width on hover, with smooth transitions.
 */
export const UNDERLINE_ANIMATION_CLASSES = [
  // Layout
  'group',
  'relative',
  'inline-block',
  'w-fit',

  // Pseudo-element setup
  'before:content-[""]',
  'before:absolute',
  'before:-bottom-0.5',

  // Underline dimensions
  'before:w-full',
  'before:h-px',
  'before:bg-current',

  // Animation - slide from right to left
  'before:scale-x-0',
  'before:transition-transform',
  'before:duration-300',
  'before:[transition-timing-function:var(--custom-ease-in-out)]',

  // Hover state - slide in from left
  'hover:before:scale-x-100',
].join(' ')