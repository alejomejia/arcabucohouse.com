/**
 * Focus ring applied to the visual checkbox state. Hooks into Tailwind's
 * `peer-focus-visible:` modifier — the actual `<input>` is visually hidden
 * (`peer sr-only`) and the styled `<div>` reflects its focus state.
 */
export const FORM_CHECKBOX_PEER_FOCUS_RING =
  'peer-focus-visible:ring-1 peer-focus-visible:ring-zinc-400'
