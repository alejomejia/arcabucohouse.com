import type { CursorInternalState } from "./cursor.types"

/** Default state restored on route transitions and `setDefault()` calls. */
export const DEFAULT_CURSOR_STATE: CursorInternalState = {
  state: "default",
  config: {},
}

/** Diameter (in `px`) of the default cursor dot when no hover state is active. */
export const CURSOR_DEFAULT_SIZE = 8

/** GSAP animation duration (seconds) for size and color transitions. */
export const CURSOR_ANIMATION_DURATION = 0.15

/**
 * Lerp factor controlling how quickly the cursor catches up to the pointer
 * each frame. Lower values feel smoother but lag further behind; higher
 * values track tightly. `0.15` is the tuned default.
 */
export const CURSOR_LERP_FACTOR = 0.15
