export type ProgressLine = {
  x: number
  scaleY: number
  opacity: number
}

/** Total pixel width of the progress-bar container. */
export const PROGRESS_WIDTH = 200

/** Number of vertical lines in the pagination bar. */
export const LINE_COUNT = 18

/** Opacity range: [min when far, max when active]. */
export const OPACITY_RANGE: [min: number, max: number] = [0.1, 1]

/** Scale range: [min when far, max when active]. */
export const SCALE_RANGE: [min: number, max: number] = [0.3, 1]

/**
 * Creates a pre-allocated line buffer for use with `updateLines`.
 *
 * Call once (e.g. in a `useRef` initialiser) and pass the result into
 * `updateLines` on every frame to avoid per-frame allocations.
 */
export function createLineBuffer(): ProgressLine[] {
  return Array.from({ length: LINE_COUNT }, () => ({ x: 0, scaleY: SCALE_RANGE[0], opacity: OPACITY_RANGE[0] }))
}

/**
 * Updates line descriptors for the progress-bar pagination **in place**.
 *
 * Distributes `LINE_COUNT` lines evenly across `PROGRESS_WIDTH`. Values are
 * assigned in discrete steps based on index distance from the active line:
 * - Active (distance 0): `t = 1`   → max of each range
 * - Adjacent (distance 1): `t = 0.5` → midpoint of each range
 * - All others (distance 2+): `t = 0.25` → near the min of each range
 *
 * @param progress - Normalised scroll progress in `[0, 1]`.
 * @param out - Pre-allocated buffer created by `createLineBuffer`.
 *
 * @example
 * ```ts
 * const buffer = createLineBuffer()
 * updateLines(0, buffer)   // all lines at initial state
 * updateLines(0.5, buffer) // active line centred in the bar
 * ```
 */
export function updateLines(progress: number, out: ProgressLine[]): void {
  const centerX = progress * PROGRESS_WIDTH

  // Find the index of the line closest to centerX
  let activeIndex = 0
  let minDist = Infinity
  for (let i = 0; i < LINE_COUNT; i++) {
    const x = ((i + 0.5) / LINE_COUNT) * PROGRESS_WIDTH
    const dist = Math.abs(x - centerX)
    out[i]!.x = x
    if (dist < minDist) {
      minDist = dist
      activeIndex = i
    }
  }

  // Assign values based on discrete step distance from the active line
  for (let i = 0; i < LINE_COUNT; i++) {
    const step = Math.abs(i - activeIndex)
    const t = step === 0 ? 1 : step === 1 ? 0.5 : 0.25
    out[i]!.scaleY = SCALE_RANGE[0] + t * (SCALE_RANGE[1] - SCALE_RANGE[0])
    out[i]!.opacity = OPACITY_RANGE[0] + t * (OPACITY_RANGE[1] - OPACITY_RANGE[0])
  }
}

/**
 * One-shot convenience wrapper — allocates a fresh buffer and returns it.
 *
 * Suitable for initial render or non-hot paths. For per-frame updates prefer
 * `createLineBuffer` + `updateLines` to avoid GC pressure.
 */
export function buildLines(progress: number): ProgressLine[] {
  const out = createLineBuffer()
  updateLines(progress, out)
  return out
}
