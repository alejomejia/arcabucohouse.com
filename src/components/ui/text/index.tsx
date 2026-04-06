import type { ElementType, HTMLAttributes, ReactNode, Ref } from "react";

import { cn } from "@/lib/utils/helpers";
import type { TextElement, TextVariant } from "./text.types";

const defaultElements: Record<TextVariant, TextElement> = {
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
  headerLink: "span"
};

const variantStyles: Record<TextVariant, string> = {
  // Headings
  h1: "text-5xl lg:text-6xl",
  h2: "text-4xl font-semibold lg:text-5xl",
  h3: "text-3xl font-semibold leading-snug",
  h4: "text-2xl font-semibold leading-snug",
  h5: "text-xl font-semibold leading-snug",
  // Body copy
  lead: "text-xl",
  body: "text-lg text-zinc-500 leading-normal", // check
  small: "text-sm font-normal leading-normal",
  caption: "text-xs font-normal leading-normal",
  // Decorative / UI
  eyebrow: "text-xs uppercase tracking-widest font-semibold",
  cta: "text-lg font-semibold tracking-wide uppercase text-zinc-600",
  label: "text-sm font-semibold uppercase tracking-wider",
  headerLink: "uppercase text-sm font-semibold text-zinc-300",
};

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
  preset?: TextVariant;
  /**
   * The HTML element to render.
   * Defaults to the semantic element associated with the chosen `preset`
   * (e.g. `"h1"` for `preset="h1"`, `"p"` for `preset="body"`).
   */
  as?: TextElement;
  children: ReactNode;
  ref?: Ref<HTMLElement>;
}

/**
 * General-purpose typography component.
 *
 * `preset` controls visual appearance; `as` controls the rendered HTML element.
 * Both are optional — use `className` alone for one-off styles not worth adding to a preset.
 *
 * @example
 * <Text preset="h1">Page title</Text>
 * <Text preset="h4" as="h2">Semantic h2, styled as h4</Text>
 * <Text preset="h2" className="text-brand-primary">Custom color override</Text>
 * <Text as="span" className="text-xl uppercase tracking-wider text-zinc-500">One-off style</Text>
 */
export function Text({ ref, preset, as, className, children, ...props }: TextProps) {
  const Tag = (as ?? (preset ? defaultElements[preset] : "p")) as ElementType;

  return (
    <Tag ref={ref} className={cn(preset && variantStyles[preset], className)} {...props}>
      {children}
    </Tag>
  );
}
