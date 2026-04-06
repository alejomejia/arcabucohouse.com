import { SplitText } from '@/components/effects/split-text'
import { UnderlineButton } from '@/components/effects/underline/underline-button'
import { useCart } from '@/components/features/cart/hooks/use-cart'

import { Text } from '@/components/ui/text'
import { useCartTriggerAnimation } from '../hooks/use-cart-trigger-animation'

type CartTriggerProps = {
  onOpen: () => void
}

/**
 * Cart trigger button component that displays "Cart" with quantity badge.
 * Handles GSAP animation for the text reveal.
 *
 * @param onOpen - Callback function to open the cart dialog
 */
export function CartTrigger({ onOpen }: CartTriggerProps) {
  const { cart } = useCart()
  const quantity = cart?.totalQuantity ?? 0

  const { cartRef, onSplitReady } = useCartTriggerAnimation(quantity)

  return (
    <UnderlineButton onClick={onOpen} aria-label="Open cart">
      <SplitText
        key={quantity}
        ref={cartRef}
        type="chars"
        onReady={onSplitReady}
        className="flex items-center opacity-0"
      >
        <div className="overflow-hidden">
          <Text preset="headerLink">Cart</Text>
          {!!quantity ? (
            <Text preset="small" className="inline-block ml-1">
              [{quantity}]
            </Text>
          ) : null}
        </div>
      </SplitText>
    </UnderlineButton>
  )
}
