'use client'

import { useFormStatus } from 'react-dom'

import { useCursor } from '@/components/effects/cursor/context'
import { CURSOR_MEDIUM } from '@/components/effects/cursor/cursor-states'
import { Button } from '@/components/ui/button'
import { LoadingDots } from '@/components/ui/loading-dots'

/**
 * Checkout button component that handles form submission state.
 */
export function CheckoutButton() {
  const { setHover, setDefault } = useCursor()
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      onMouseEnter={() => setHover(CURSOR_MEDIUM)}
      onMouseLeave={() => setDefault()}
    >
      {pending ? <LoadingDots className="bg-zinc-200" /> : 'Proceed to Checkout'}
    </Button>
  )
}
