import type { TextElement, TextVariant } from "./text.types"

/**
 * Default HTML element rendered for each `preset`. Override via the `as`
 * prop when the semantic element should differ from the visual style
 * (e.g. an `<h2>` visually styled like an `<h4>`).
 */
export const TEXT_DEFAULT_ELEMENTS: Record<TextVariant, TextElement> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  eyebrow: "span",
  cta: "span",
  lead: "p",
  body: "p",
  small: "p",
  caption: "span",
  label: "label",
  headerLink: "span",
}

/**
 * Class tokens applied for each `preset`. Pure styling — independent
 * from the rendered element above.
 */
export const TEXT_VARIANT_STYLES: Record<TextVariant, string> = {
  // Headings
  h1: "text-5xl lg:text-6xl",
  h2: "text-4xl font-semibold lg:text-5xl",
  h3: "text-3xl font-semibold leading-snug",
  h4: "text-2xl font-semibold leading-snug",
  h5: "text-xl font-semibold leading-snug",
  // Body copy
  lead: "text-xl",
  body: "text-lg text-zinc-500 leading-normal",
  small: "text-sm font-normal leading-normal",
  caption: "text-xs font-normal leading-normal",
  // Decorative / UI
  eyebrow: "text-xs uppercase tracking-widest font-semibold",
  cta: "text-lg font-semibold tracking-wide uppercase text-zinc-600",
  label: "text-sm font-semibold uppercase tracking-wider",
  headerLink: "uppercase text-sm font-semibold text-zinc-300",
}
