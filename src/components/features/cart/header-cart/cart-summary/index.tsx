import { AnimatedNumber } from '@/components/effects/animated-number'
import { Price } from '@/components/ui/price'
import type { Cart } from '@/lib/integrations/shopify/types'
import { pluralize } from '@/lib/utils/strings'

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
  const { totalQuantity } = cart
  const { amount, currencyCode } = cart.cost.totalAmount

  const pluralizedQuantity = pluralize({ count: totalQuantity, singular: 'item', plural: 'items' })

  return (
    <div className="py-4 text-neutral-400 border-y border-zinc-700 mb-4">
      <div className="flex flex-col gap-4 xs:flex-row xs:gap-2 xs:items-end justify-between text-center xs:text-left">
        <div>
          <p className="text-zinc-100 text-lg font-semibold">
            Total
            <span className="inline-flex items-center gap-1 ml-1 text-zinc-400">
              <span>
                [<AnimatedNumber value={totalQuantity} />
              </span>
              <span>{pluralizedQuantity}]</span>
            </span>
          </p>
          <small className="text-base text-zinc-300">Shipping and taxes calculated at checkout</small>
        </div>
        <Price
          className="xs:text-right text-2xl text-zinc-50 -translate-y-1"
          amount={amount}
          currencyCode={currencyCode}
        />
      </div>
    </div>
  )
}
