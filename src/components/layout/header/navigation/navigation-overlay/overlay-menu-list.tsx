"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

import { SplitText, type SplitTextRef } from "@/components/effects/split-text"
import { Link } from "@/components/ui/link"
import type { Menu } from "@/lib/integrations/shopify/types"
import { orchestraMenuOverlay } from "@/lib/orchestra"
import { cn } from "@/lib/utils/helpers"
import { twoDigits } from "@/lib/utils/strings"

/**
 * Props for the OverlayMenuList component
 */
export interface OverlayMenuListProps {
  /** Menu items to render */
  menu: Menu[]
  /** Callback when a menu item is hovered */
  onItemHover?: (index: number) => void
  /** Callback when mouse leaves the menu */
  onMenuLeave?: () => void
  /** Additional class name */
  className?: string
}

/**
 * Menu list component with animated text reveal for navigation overlay.
 * Features character-by-character staggered animation on mount.
 */
export function OverlayMenuList({
  menu,
  onItemHover,
  onMenuLeave,
  className
}: OverlayMenuListProps) {
  const containerRef = useRef<HTMLUListElement>(null)
  const splitRefs = useRef<(SplitTextRef | null)[]>([])

  // Initialize text split animation
  useGSAP(() => {
    if (!containerRef.current) return

    // Create animation timeline
    const createAnimation = () => {
      const tl = gsap.timeline({
        ...orchestraMenuOverlay.menuList,
      })

      splitRefs.current.forEach((ref) => {
        if (!ref) return

        const chars = ref.getElements()
        if (chars.length > 0) {
          // Set initial state (characters start below)
          gsap.set(chars, { y: '100%' })
          // Animate to final position
          tl.to(chars, { y: 0, stagger: 0.05 }, '<0.1')
        }
      })
    }

    // Wait for all SplitText instances to be ready
    const checkReady = () => {
      const allReady = splitRefs.current.every(
        (ref) => ref?.isReady() ?? false
      )

      if (!allReady) {
        setTimeout(checkReady, 50)
        return
      }

      createAnimation()
    }

    checkReady()
  }, { scope: containerRef })

  return (
    <ul
      ref={containerRef}
      className={cn(
        "group/list flex flex-col items-center justify-center gap-4 h-full",
        "font-serif italic text-5xl leading-tighter",
        "md:w-fit md:h-fit md:items-start md:justify-start md:gap-2 md:text-[7vw]",
        "lg:text-7xl",
        className
      )}
      onMouseLeave={onMenuLeave}
    >
      {menu.map(({ path, title }, index) => {
        const digits = twoDigits(index + 1)

        return (
          <li key={index}>
            <Link
              href={path}
              onMouseEnter={() => onItemHover?.(index)}
              className={cn(
                "group/link relative overflow-hidden",
                "opacity-100 group-hover/list:opacity-50 hover:opacity-100",
                "transition-opacity duration-500",
                "char:translate-y-full",
              )}
            >
              <SplitText
                ref={(ref) => {
                  splitRefs.current[index] = ref
                }}
                type="chars"
              >
                <span>{title}</span>
              </SplitText>
              <div className={cn(
                "overflow-hidden leading-0",
                "-translate-y-4 font-sans not-italic",
                "hidden md:inline-block md:mx-3"
              )}>
                <span className={cn(
                  "text-sm text-neutral-500",
                  "inline-block -translate-y-8 group-hover/link:translate-y-0",
                  "transition-transform duration-300 ease-in-out"
                )}>[{digits}]</span>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
