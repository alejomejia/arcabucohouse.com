"use client"

import gsap from "gsap"
import { useRef } from "react"

import { useCursor } from "@/components/effects/cursor/cursor.context"
import { CURSOR_MEDIUM } from "@/components/effects/cursor/cursor-states"
import { SplitText, type SplitTextRef } from "@/components/effects/split-text"
import { Link } from "@/components/ui/link"
import { Text } from "@/components/ui/text"
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
  const { setHover, setDefault } = useCursor()
  const splitRefs = useRef<(SplitTextRef | null)[]>([])
  const readyCountRef = useRef(0)

  // Called by each SplitText when ready — the last one triggers the timeline
  const handleSplitReady = () => {
    readyCountRef.current++
    if (readyCountRef.current < menu.length) return

    // All SplitText instances are ready — create coordinated timeline
    const tl = gsap.timeline({
      ...orchestraMenuOverlay.menuList,
    })

    splitRefs.current.forEach((ref) => {
      if (!ref) return

      const chars = ref.getElements()
      if (chars.length > 0) {
        gsap.set(chars, { y: '100%' })
        tl.to(chars, { y: 0, stagger: 0.05 }, '<0.1')
      }
    })
  }

  return (
    <ul
      className={cn(
        "group/list flex flex-col items-center justify-center h-full",
        "text-zinc-200 text-5xl md:text-[7vw] lg:text-6xl text-center md:text-left",
        "md:w-fit md:h-fit md:items-start md:justify-start",
        className
      )}
      onMouseEnter={() => setHover(CURSOR_MEDIUM)}
      onMouseLeave={() => {
        onMenuLeave?.()
        setDefault()
      }}
    >
      {menu.map(({ path, title }, index) => {
        const digits = twoDigits(index + 1)

        return (
          <li key={index} className="w-full">
            <Link
              href={path}
              onMouseEnter={() => onItemHover?.(index)}
              className={cn(
                "group/link relative overflow-clip",
                "opacity-100 group-hover/list:opacity-50 hover:opacity-100",
                "transition-opacity duration-500",
                "char:translate-y-full char:leading-tight",
              )}
            >
              <SplitText
                ref={(ref) => {
                  splitRefs.current[index] = ref
                }}
                type="chars"
                onReady={handleSplitReady}
              >
                <Text as="span">{title}</Text>
              </SplitText>
              <div className={cn(
                "overflow-hidden leading-0",
                "-translate-y-4  not-italic",
                "hidden md:inline-block md:mx-3"
              )}>
                <span className={cn(
                  "text-sm text-zinc-400",
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
