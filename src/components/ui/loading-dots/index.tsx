import { cn } from '@/lib/utils/helpers'

const DOT_CLASSNAME = 'mx-px inline-block h-1 w-1 animate-blink rounded-md'

type LoadingDotsProps = {
  /** Optional className applied to each dot — typically a background color. */
  className?: string
  /**
   * Visually-hidden label announced to assistive tech. Defaults to
   * `"Loading"` — override when the surrounding context already conveys
   * the action (e.g. `"Adding to cart"`) for richer status announcements.
   */
  srLabel?: string
}

/**
 * Three-dot blinking indicator for inline loading states. Pure CSS
 * animation (`animate-blink`) — server-renderable, no JS.
 *
 * Announces itself to assistive tech via `role="status"` + a
 * visually-hidden label, so a screen-reader user hears "Loading" when
 * the indicator replaces a button's normal text.
 *
 * @example
 * ```tsx
 * <Button disabled={pending}>
 *   {pending ? <LoadingDots className="bg-zinc-200" /> : 'Proceed to Checkout'}
 * </Button>
 * ```
 */
export function LoadingDots({ className, srLabel = 'Loading' }: LoadingDotsProps) {
  return (
    <span role="status" aria-live="polite" className="mx-2 inline-flex items-center">
      <span aria-hidden className={cn(DOT_CLASSNAME, className)} />
      <span aria-hidden className={cn(DOT_CLASSNAME, 'animation-delay-[200ms]', className)} />
      <span aria-hidden className={cn(DOT_CLASSNAME, 'animation-delay-[400ms]', className)} />
      <span className="sr-only">{srLabel}</span>
    </span>
  )
}
