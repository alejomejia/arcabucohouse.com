/**
 * Visual style variant for the Text component.
 *
 * - `h1`–`h5`: Semantic heading levels with descending size/weight.
 * - `eyebrow`: Small uppercase label, typically placed above a heading.
 * - `cta`: Call-to-action text, semi-bold and slightly larger than body.
 * - `lead`: Introductory paragraph, larger than regular body copy.
 * - `body`: Default paragraph text.
 * - `small`: Secondary or fine-print text.
 * - `caption`: Minimal text for image captions or metadata.
 * - `label`: Uppercase tag-style label for UI elements and form fields.
 */
export type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "eyebrow"
  | "cta"
  | "lead"
  | "body"
  | "small"
  | "caption"
  | "label"
  | "headerLink";

/**
 * HTML elements that can be rendered by the Text component via the `as` prop.
 */
export type TextElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "strong"
  | "em"
  | "blockquote"
  | "label";
