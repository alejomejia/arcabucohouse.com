'use client'

import { DeleteFromCartButton } from '@/components/features/cart/delete-from-cart-button'
import { EditItemQuantityButton } from '@/components/features/cart/edit-item-quantity-button'
import type { UpdateType } from '@/components/features/cart/types'
import { Image } from '@/components/ui/image'
import { Link } from '@/components/ui/link'
import { Price } from '@/components/ui/price'
import { DEFAULT_OPTION } from '@/lib/integrations/constants'
import type { CartItem } from '@/lib/integrations/shopify/types'
import { FOCUS_RING_ON_DARK_BG } from '@/lib/styles/const'

import { AnimatedNumber } from '@/components/effects/animated-number'
import { useCursor } from '@/components/effects/cursor/cursor.context'
import { CURSOR_MEDIUM } from '@/components/effects/cursor/cursor-states'
import { useUnderlineAnimation } from '@/components/effects/underline/hooks/use-underline-animation'
import { cn } from '@/lib/utils/helpers'
import { createMerchandiseUrl } from '../helpers'

type CartItemProps = {
  item: CartItem
  onUpdateItem: (
    merchandiseId: string,
    updateType: UpdateType
  ) => void
  onCloseCart: () => void
}

/**
 * Individual cart item component displaying product image, title, variant,
 * price, and quantity controls.
 *
 * @param item - The cart line item to display
 * @param onUpdateItem - Callback to update item quantity
 * @param onCloseCart - Callback to close the cart dialog
 */
export function CartItem({ item, onUpdateItem, onCloseCart }: CartItemProps) {
  const {
    elementRef,
    underlineClassName,
    handleMouseEnter,
    handleMouseLeave,
  } = useUnderlineAnimation()
  const { setHover, setDefault } = useCursor()
  const merchandiseUrl = createMerchandiseUrl(item)

  const { merchandise, cost, quantity } = item
  const { title: variantTitle } = merchandise
  const { featuredImage, title: productTitle } = merchandise.product
  const { amount, currencyCode } = cost.totalAmount

  const hasVariantTitle = variantTitle !== DEFAULT_OPTION

  return (
    <li className="py-4 not-last:border-b border-zinc-700">
      <div className="w-full flex flex-col text-center xs:text-left xs:flex-row gap-4">
        <Link
          href={merchandiseUrl}
          className="relative aspect-5/6 w-full max-w-120 xs:max-w-40 overflow-hidden"
          onClick={onCloseCart}
          onMouseEnter={() => setHover(CURSOR_MEDIUM)}
          onMouseLeave={() => setDefault()}
        >
          <Image
            className="h-full w-full object-cover brand-gradient-primary"
            alt={featuredImage.altText || productTitle}
            src={featuredImage.url}
            fill
          />
        </Link>
        <div className="my-1 flex-1 flex flex-col justify-between gap-3">
          <div>
            <Link
              href={merchandiseUrl}
              onMouseEnter={() => setHover(CURSOR_MEDIUM)}
              onMouseLeave={() => setDefault()}
              className={cn(
                "mb-3",
                "opacity-90 hover:opacity-100 transition-opacity duration-300 ease-in-out",
                FOCUS_RING_ON_DARK_BG
              )}
            >
              <div className="flex flex-1 flex-col">
                <span className="leading-tight text-lg md:text-xl text-zinc-200">
                  {productTitle}
                </span>
                {hasVariantTitle ? (
                  <p className="text-lg md:text-base text-zinc-400">
                    {variantTitle}
                  </p>
                ) : null}
              </div>
            </Link>
            <Price
              className="text-lg md:text-2xl text-zinc-100"
              amount={amount}
              currencyCode={currencyCode}
            />
          </div>

          <div className="flex flex-col-reverse gap-8 xs:gap-4 items-center xs:flex-row xs:items-end justify-end">
            <DeleteFromCartButton item={item} optimisticUpdateAction={onUpdateItem}>
              <span
                ref={elementRef}
                onMouseEnter={(e) => {
                  handleMouseEnter(e)
                  setHover(CURSOR_MEDIUM)
                }}
                onMouseLeave={() => {
                  handleMouseLeave()
                  setDefault()
                }}
                className={cn(underlineClassName, 'text-base text-zinc-300 leading-none')}
              >
                Remove
              </span>
            </DeleteFromCartButton>
            <div className="xs:ml-auto flex h-12 flex-row border border-zinc-700">
              <EditItemQuantityButton
                item={item}
                type="minus"
                optimisticUpdateAction={onUpdateItem}
              />
              <p className="min-w-12 text-center select-none leading-none">
                <AnimatedNumber className="w-full h-full flex items-center justify-center" value={quantity} />
              </p>
              <EditItemQuantityButton
                item={item}
                type="plus"
                optimisticUpdateAction={onUpdateItem}
              />
            </div>
          </div>
        </div>
      </div>
    </li >
  )
}
