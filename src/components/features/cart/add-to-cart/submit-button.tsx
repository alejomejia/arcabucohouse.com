'use client'

import { PlusIcon } from '@heroicons/react/24/outline'
import { useFormStatus } from 'react-dom'

import { useCursor } from '@/components/effects/cursor/context'
import { CURSOR_MEDIUM } from '@/components/effects/cursor/cursor-states'
import { LoadingDots } from '@/components/ui/loading-dots'
import { cn } from '@/lib/utils/helpers'

/**
 * @TODO
 * Replace LoadingDots for another loading indicator
 * more brand appropriate and elegant animations with GSAP
 */

const BUTTON_CLASSNAMES = [
  'relative w-full p-4',
  'flex items-center justify-center',
  'bg-secondary-base text-white',
  'uppercase font-semibold tracking-wide',
  'transition-all duration-300 ease-in-out',
].join(' ')

const DISABLED_CLASSNAMES = 'cursor-not-allowed opacity-60 hover:opacity-60'

type SubmitButtonProps = {
  /** Whether the product variant is available for purchase */
  availableForSale: boolean
  /** Selected variant ID, undefined if no variant is selected */
  selectedVariantId: string | undefined
}

/**
 * Submit button for adding products to cart with three states: 
 * out of stock, variant selection required, and ready to add.
 *
 * Displays loading state during form submission. 
 * Disabled when product is unavailable or no variant is selected.
 * Must be used within a form element to access form submission status.
 *
 * @param availableForSale - Controls whether product can be purchased
 * @param selectedVariantId - Currently selected variant identifier
 *
 * @example
 * ```tsx
 * <form action={handleAddToCart}>
 *   <SubmitButton 
 *     availableForSale={product.availableForSale} 
 *     selectedVariantId={selectedVariant?.id} 
 *   />
 * </form>
 * ```
 */
export function SubmitButton({
  availableForSale,
  selectedVariantId
}: SubmitButtonProps) {
  const { setHover, setDefault } = useCursor()
  const { pending } = useFormStatus()

  // Out of stock state
  if (!availableForSale) {
    return (
      <button
        type="button"
        disabled
        className={cn(BUTTON_CLASSNAMES, DISABLED_CLASSNAMES)}
        aria-label="Product is out of stock"
      >
        Out Of Stock
      </button>
    )
  }

  // Variant selection required state
  if (!selectedVariantId) {
    return (
      <button
        type="button"
        disabled
        className={cn(BUTTON_CLASSNAMES, DISABLED_CLASSNAMES)}
        aria-label="Select an option"
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    )
  }

  const pendingLabel = pending ? 'Adding to cart' : 'Add to cart'

  // Ready to submit state
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={pendingLabel}
      className={cn(
        BUTTON_CLASSNAMES,
        'hover:opacity-90',
        {
          [DISABLED_CLASSNAMES]: pending,
        }
      )}
      onMouseEnter={() => setHover(CURSOR_MEDIUM)}
      onMouseLeave={() => setDefault()}
    >
      <div className="absolute left-0 ml-4">
        {pending ? (
          <LoadingDots className="bg-white" />
        ) : (
          <PlusIcon className="h-5" />
        )}
      </div>
      {pendingLabel}
    </button>
  )
}