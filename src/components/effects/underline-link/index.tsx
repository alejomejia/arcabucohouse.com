import { Link, type LinkProps } from '@/components/ui/link'
import { cn } from '@/lib/utils/helpers'

// Underline animation TailwindCSS classes
const UNDERLINE_ANIMATION_CLASSES = [
  // Layout
  'group',
  'relative',
  'inline-block',
  'w-fit',

  // Pseudo-element setup
  'before:content-[""]',
  'before:absolute',
  'before:left-0',
  'before:-bottom-0.5',
  
  // Underline dimensions
  'before:w-full',
  'before:h-px',
  'before:bg-current',
  
  // Animation - slide from right to left
  'before:scale-x-0',
  'before:origin-right',
  'before:transition-transform',
  'before:duration-300',
  'before:[transition-timing-function:var(--custom-ease-in-out)]',
  
  // Hover state - slide in from left
  'hover:before:scale-x-100',
  'hover:before:origin-left',
].join(' ')

/**
 * Renders a link with animated underline effect on hover.
 *
 * Wraps the base Link component with a CSS-based underline animation.
 * The underline slides in from right to left on hover using a pseudo-element.
 * Uses custom easing function from CSS variable `--custom-ease-in-out`.
 *
 * @param className - Additional CSS classes to merge with underline styles
 * @param children - Link content (text or elements)
 * @param props - All other LinkProps (href, onClick, scroll, etc.)
 * @returns Link component with animated underline effect
 *
 * @example
 * ```tsx
 * <UnderlineLink href="/about" className="text-blue-600">
 *   About Us
 * </UnderlineLink>
 * ```
 */
export function UnderlineLink({ className, children, ...props }: LinkProps) {
  return (
    <Link
      className={cn(
        UNDERLINE_ANIMATION_CLASSES,
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
