/**
 * Element IDs that participate in scroll prevention when they have a scrollbar.
 * Add an entry here and use the same id on the DOM element; the element must
 * toggle the "has-scrollbar" class for prevention to apply.
 */
export const SCROLL_PREVENTION_IDS = {
  cartDialogList: "cart-dialog-list",
} as const

const PREVENTION_IDS = new Set<string>(
  Object.values(SCROLL_PREVENTION_IDS)
)

/**
 * Returns true if the node is a known prevention target and currently has a scrollbar.
 * To add new targets, add an id to SCROLL_PREVENTION_IDS and use it on the element;
 * ensure the element has the "has-scrollbar" class when it overflows.
 *
 * @param node - The node to check
 * @returns True if scroll should be prevented on this node
 */
export function shouldPreventScroll(node: Element | null): boolean {
  if (!node?.id) return false
  
  return PREVENTION_IDS.has(node.id) && node.classList.contains("has-scrollbar")
}