/**
 * Formats a price amount using Intl.NumberFormat with currency formatting.
 *
 * @param amount - The price amount as a string
 * @param currencyCode - The ISO 4217 currency code (e.g., 'USD', 'EUR')
 * @returns The formatted price string with currency symbol
 */
export function formatPrice(amount: string, currencyCode: string): string {
  const numericAmount = Number.parseFloat(amount)

  if (Number.isNaN(numericAmount)) {
    return amount
  }

  const hasDecimals = numericAmount % 1 !== 0

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(numericAmount)
}
