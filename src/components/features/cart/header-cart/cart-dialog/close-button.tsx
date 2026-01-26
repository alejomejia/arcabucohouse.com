import { XMarkIcon } from '@heroicons/react/24/outline'

import { cn } from '@/lib/utils/helpers'

type CloseButtonProps = {
  onClick: () => void
  className?: string
}

/**
 * Close button component for the cart dialog.
 *
 * @param onClick - Callback function when button is clicked
 * @param className - Additional CSS classes
 */
export function CloseButton({ onClick, className }: CloseButtonProps) {
  return (
    <button type="button" aria-label="Close cart" onClick={onClick}>
      <div className={cn(
        "relative size-11",
        "flex items-center justify-center",
        "text-white",
        "rounded-md border border-neutral-700",
        "transition-colors"
      )}>
        <XMarkIcon
          className={cn('h-6 transition-all ease-in-out hover:scale-110', className)}
        />
      </div>
    </button>
  )
}
