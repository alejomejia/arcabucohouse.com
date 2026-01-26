import { cn } from '@/lib/utils/helpers'

import { formatPrice } from './utils'

type PriceProps = {
  /**
   * The price amount as a string (e.g., "29.99")
   */
  amount: string
  /**
   * The ISO 4217 currency code (e.g., "USD", "EUR")
   * @default "USD"
   */
  currencyCode?: string
  /**
   * Additional CSS classes for the container element
   */
  className?: string
  /**
   * Additional CSS classes for the currency code span
   */
  currencyCodeClassName?: string
} & React.ComponentProps<'p'>

/**
 * Price component that formats and displays a monetary value with currency code.
 * Uses Intl.NumberFormat for proper locale-aware currency formatting.
 *
 * @example
 * ```tsx
 * <Price
 *   amount="29.99"
 *   currencyCode="USD"
 *   className="text-lg font-bold"
 * />
 * ```
 */
export function Price({
  amount,
  currencyCode = 'USD',
  className,
  currencyCodeClassName,
  ...props
}: PriceProps) {
  const formattedPrice = formatPrice(amount, currencyCode)

  return (
    <p
      suppressHydrationWarning
      className={className}
      {...props}
    >
      {formattedPrice}
      <span className={cn('ml-1 inline', currencyCodeClassName)}>
        {currencyCode}
      </span>
    </p>
  )
}
