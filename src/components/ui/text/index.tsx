import type { ElementType, HTMLAttributes, ReactNode, Ref } from "react"

import { cn } from "@/lib/utils/helpers"

import { TEXT_DEFAULT_ELEMENTS, TEXT_VARIANT_STYLES } from "./text.const"
import type { TextElement, TextVariant } from "./text.types"

/**
 * Props for the {@link Text} component.
 */
export interface TextProps extends HTMLAttributes<HTMLElement> {
  /**
   * Controls the visual style (Tailwind classes) applied to the text.
   * Completely independent from the rendered HTML element.
   *
   * @example
   * // h2 tag with h4 visual styles
   * <Text as="h2" preset="h4">Section title</Text>
   */
  preset?: TextVariant
  /**
   * The HTML element to render.
   * Defaults to the semantic element associated with the chosen `preset`
   * (e.g. `"h1"` for `preset="h1"`, `"p"` for `preset="body"`).
   */
  as?: TextElement
  children: ReactNode
  ref?: Ref<HTMLElement>
}

/**
 * General-purpose typography component.
 *
 * `preset` controls visual appearance; `as` controls the rendered HTML element.
 * Both are optional — use `className` alone for one-off styles not worth
 * adding to a preset.
 *
 * @example
 * <Text preset="h1">Page title</Text>
 * <Text preset="h4" as="h2">Semantic h2, styled as h4</Text>
 * <Text preset="h2" className="text-brand-primary">Custom color override</Text>
 * <Text as="span" className="text-xl uppercase tracking-wider text-zinc-500">One-off style</Text>
 */
export function Text({ ref, preset, as, className, children, ...props }: TextProps) {
  const Tag = (as ?? (preset ? TEXT_DEFAULT_ELEMENTS[preset] : "p")) as ElementType

  return (
    <Tag ref={ref} className={cn(preset && TEXT_VARIANT_STYLES[preset], className)} {...props}>
      {children}
    </Tag>
  )
}
