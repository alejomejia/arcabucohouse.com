import { cn } from "@/lib/utils/helpers"

/**
 * Mouse entered from the LEFT:
 * - Default origin-left  → re-appears from the left on mouse leave
 * - Hover origin-right   → underline collapses toward the right (exits right)
 */
export const ANIMATION_FROM_LEFT = "before:origin-left hover:before:origin-right"

/**
 * Mouse entered from the RIGHT:
 * - Default origin-right → re-appears from the right on mouse leave
 * - Hover origin-left    → underline collapses toward the left (exits left)
 */
export const ANIMATION_FROM_RIGHT = "before:origin-right hover:before:origin-left"

/**
 * Base Tailwind classes for the animated underline effect.
 *
 * The underline is always visible and slides out on hover in the direction
 * the mouse entered (controlled by `ANIMATION_FROM_LEFT` / `ANIMATION_FROM_RIGHT`).
 * Uses `--custom-ease-in-out` easing.
 */
export const UNDERLINE_ANIMATION_CLASSES = cn(
  // Layout
  "group relative inline-block w-fit",

  // Pseudo-element setup
  'before:content-[""] before:absolute before:left-0 before:-bottom-0.5',

  // Underline dimensions
  "before:w-full before:h-px before:bg-current",

  // Always visible; default origin (overridden by direction classes)
  "before:scale-x-100 before:origin-left",

  // Transition
  "before:transition-transform before:duration-300 before:[transition-timing-function:var(--custom-ease-in-out)]",

  // Disappear on hover
  "hover:before:scale-x-0",
)
