import { cn } from '@/lib/utils/helpers'

import { PROSE_VARIANT_CLASSES } from './prose.const'

type ProseProps = {
  /**
   * Pre-sanitized HTML string to render. See the safety invariant on
   * {@link Prose} — passing unsanitized user input here is an XSS vector.
   */
  html: string
  className?: string
}

/**
 * Renders pre-sanitized HTML with the Tailwind Typography variant table
 * applied. The single consumer in the app today is product description
 * HTML returned by the Shopify Storefront API, which Shopify sanitizes on
 * its side — see {@link https://shopify.dev/docs/api/storefront/reference/products/product#field-descriptionhtml}.
 *
 * @example
 * ```tsx
 * <Prose className="mb-6" html={product.descriptionHtml} />
 * ```
 *
 * **Safety invariant**: `html` must be sanitized before reaching this
 * component. Never pass arbitrary user input directly — pipe it through
 * a sanitizer (e.g. `isomorphic-dompurify`) at the boundary first.
 */
export function Prose({ html, className }: ProseProps) {
  return (
    <div
      className={cn(
        'prose max-w-full text-base leading-normal text-zinc-500',
        PROSE_VARIANT_CLASSES,
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
