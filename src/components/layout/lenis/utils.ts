/**
 * Single class name for Lenis scroll prevention. Add this class to any element
 * (or an ancestor) that should consume the wheel and prevent page scroll.
 * Import this constant and use it in className when you want to prevent scroll.
 */
export const LENIS_PREVENT_CLASS = "lenis-prevent"

/**
 * Returns true if Lenis should not scroll for this wheel target.
 * Prevents when the target or any ancestor has LENIS_PREVENT_CLASS.
 *
 * @param node - Wheel event target (or node from event composed path)
 */
export function shouldPreventScroll(node: Element | null): boolean {
  if (!node) return false
  return node.closest(`.${LENIS_PREVENT_CLASS}`) !== null
}
