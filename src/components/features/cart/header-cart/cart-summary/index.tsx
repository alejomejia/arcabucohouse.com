import { Price } from '@/components/ui/price'
import type { Cart } from '@/lib/integrations/shopify/types'

type CartSummaryProps = {
  cart: Cart
}

/**
 * Cart summary component displaying cost breakdown: taxes, shipping, and total.
 *
 * Shows tax amount, shipping status (calculated at checkout), and total amount.
 * All values are formatted using the Price component with proper currency handling.
 *
 * @param cart - The cart object containing cost information (subtotal, taxes, total)
 *
 * @example
 * ```tsx
 * <CartSummary cart={cart} />
 * ```
 */
export function CartSummary({ cart }: CartSummaryProps) {
  return (
    <div className="py-4 text-sm text-neutral-400">
      <div className="mb-3 pb-1 flex items-center justify-between border-b border-neutral-700">
        <p>Taxes</p>
        <Price
          className="text-right text-base text-white"
          amount={cart.cost.totalTaxAmount.amount}
          currencyCode={cart.cost.totalTaxAmount.currencyCode}
        />
      </div>
      <div className="mb-3 py-1 flex items-center justify-between border-b border-neutral-700">
        <p>Shipping</p>
        <p className="text-right">Calculated at checkout</p>
      </div>
      <div className="mb-3 py-1 flex items-center justify-between border-b border-neutral-700">
        <p>Total</p>
        <Price
          className="text-right text-base text-white"
          amount={cart.cost.totalAmount.amount}
          currencyCode={cart.cost.totalAmount.currencyCode}
        />
      </div>
    </div>
  )
}
