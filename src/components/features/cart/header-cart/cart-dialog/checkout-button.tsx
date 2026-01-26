'use client'

import { useFormStatus } from 'react-dom'

import { LoadingDots } from '@/components/ui/loading-dots'
import { cn } from '@/lib/utils/helpers'

/**
 * Checkout button component that handles form submission state.
 */
export function CheckoutButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "block w-full p-3",
        "text-center text-sm font-medium text-white",
        "bg-blue-600 rounded-full opacity-90 hover:opacity-100"
      )}
    >
      {pending ? <LoadingDots className="bg-white" /> : 'Proceed to Checkout'}
    </button>
  )
}
