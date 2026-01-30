'use client'

import { useFormStatus } from 'react-dom'

import { useCursor } from '@/components/effects/cursor/context'
import { CURSOR_MEDIUM } from '@/components/effects/cursor/cursor-states'
import { LoadingDots } from '@/components/ui/loading-dots'
import { FOCUS_RING_ON_DARK_BG } from '@/lib/styles/const'
import { cn } from '@/lib/utils/helpers'

/**
 * Checkout button component that handles form submission state.
 */
export function CheckoutButton() {
  const { setHover, setDefault } = useCursor()
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "block w-full px-4 py-5",
        "text-center text-base uppercase font-semibold tracking-wider text-white",
        "bg-secondary-400 opacity-90 hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-opacity duration-300 ease-in-out",
        FOCUS_RING_ON_DARK_BG
      )}
      onMouseEnter={() => setHover(CURSOR_MEDIUM)}
      onMouseLeave={() => setDefault()}
    >
      {pending ? <LoadingDots className="bg-white" /> : 'Proceed to Checkout'}
    </button>
  )
}
