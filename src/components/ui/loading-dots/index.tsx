import { cn } from '@/lib/utils/helpers'

const DOT_CLASSNAME = 'mx-px inline-block h-1 w-1 animate-blink rounded-md'

type LoadingDotsProps = {
  /** Optional className applied to each dot — typically a background color. */
  className?: string
}

/**
 * Three-dot blinking indicator for inline loading states. Pure CSS
 * animation (`animate-blink`) — server-renderable, no JS.
 *
 * @example
 * ```tsx
 * <Button disabled={pending}>
 *   {pending ? <LoadingDots className="bg-zinc-200" /> : 'Proceed to Checkout'}
 * </Button>
 * ```
 */
export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <span className="mx-2 inline-flex items-center">
      <span className={cn(DOT_CLASSNAME, className)} />
      <span className={cn(DOT_CLASSNAME, 'animation-delay-[200ms]', className)} />
      <span className={cn(DOT_CLASSNAME, 'animation-delay-[400ms]', className)} />
    </span>
  )
}
