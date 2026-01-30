'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, useState } from 'react'

import { cn } from '@/lib/utils/helpers'

export type AnimatedNumberProps = {
  /** Numeric value to display; changes are animated from previous to new. */
  value: number
  /** Tween duration in seconds. @default 0.5 */
  duration?: number
  /** GSAP easing name or function. @default "power2.out" */
  ease?: string | gsap.EaseFunction
  /** Decimal places when no custom formatter is used. @default 0 */
  decimals?: number
  /** Custom display formatter; overrides decimals. */
  formatter?: (n: number) => string
  /** Optional prefix (e.g. "$") rendered before the number. */
  prefix?: string
  /** Optional suffix (e.g. "%") rendered after the number. */
  suffix?: string
  /** ClassName for the wrapper element. */
  className?: string
  /** Render as this element. @default "span" */
  as?: 'span' | 'strong' | 'em' | 'p'
} & Omit<React.ComponentPropsWithoutRef<'span'>, 'children'>

function defaultFormat(n: number, decimals: number): string {
  if (decimals <= 0) return String(Math.round(n))
  return n.toFixed(decimals)
}

/**
 * Wraps a number and animates it toward the new value whenever it changes.
 * Uses GSAP to animate the old value out (yPercent: -100) and new value in (yPercent: 100 → 0).
 *
 * @param value - Current numeric value (changes trigger animation)
 * @param duration - Tween duration in seconds (default: 0.5)
 * @param ease - GSAP ease (default: "power2.out")
 * @param decimals - Decimal places when not using a custom formatter (default: 0)
 * @param formatter - Custom (n) => string; overrides decimals
 * @param prefix - String before the number (e.g. "$")
 * @param suffix - String after the number (e.g. "%")
 * @param as - Wrapper element type (default: "span")
 *
 * @example
 * ```tsx
 * <AnimatedNumber value={cart.totalQuantity} />
 * <AnimatedNumber value={price} decimals={2} prefix="$" />
 * <AnimatedNumber value={progress} formatter={(n) => `${Math.round(n)}%`} />
 * ```
 */
export function AnimatedNumber({
  value,
  duration = 1,
  ease,
  decimals = 0,
  formatter,
  prefix = '',
  suffix = '',
  className,
  as: Tag = 'span',
  ...rest
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [oldValue, setOldValue] = useState<number | null>(null)

  const oldRef = useRef<HTMLSpanElement>(null)
  const newRef = useRef<HTMLSpanElement>(null)
  const prevValueRef = useRef(value)

  const format = formatter ?? ((n: number) => defaultFormat(n, decimals))

  useGSAP(
    () => {
      // Skip if value hasn't actually changed
      if (prevValueRef.current === value) return

      // Set old value for display
      setOldValue(prevValueRef.current)
      setDisplayValue(value)

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        if (!oldRef.current || !newRef.current) return

        // Kill any existing tweens
        gsap.killTweensOf([oldRef.current, newRef.current])

        // Set initial states with force3D for GPU acceleration
        gsap.set(newRef.current, {
          yPercent: 100,
        })

        // Create timeline with better performance settings
        const tl = gsap.timeline({
          onComplete: () => {
            setOldValue(null) // Clean up old value after animation
          }
        })

        // Animate both simultaneously
        tl.to(oldRef.current, {
          yPercent: -100,
          duration,
          ease: ease ?? 'power2.in',
        }, 0)

        tl.to(newRef.current, {
          yPercent: 0,
          duration,
          ease: ease ?? 'power2.out',
        }, 0)
      })

      prevValueRef.current = value
    },
    { dependencies: [value], scope: Tag }
  )

  return (
    <Tag
      className={cn('relative inline-block', className)}
      {...rest}
    >
      {prefix}
      <span className={cn(
        "relative overflow-hidden",
        "w-full h-full",
        "leading-none inline-flex items-center justify-center"
      )}>
        {oldValue !== null && (
          <span
            ref={oldRef}
            className="absolute inset-0 will-change-transform"
            style={{ display: 'block' }}
          >
            {format(oldValue)}
          </span>
        )}
        <span
          ref={newRef}
          className="block will-change-transform"
        >
          {format(displayValue)}
        </span>
      </span>
      {suffix}
    </Tag>
  )
}