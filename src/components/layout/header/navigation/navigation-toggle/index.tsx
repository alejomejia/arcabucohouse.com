'use client'

import { SplitText } from "@/components/effects/split-text"
import { UnderlineButton } from "@/components/effects/underline/underline-button"
import { cn } from "@/lib/utils/helpers"

import { useNavigationToggle } from "./use-navigation-toggle"

/**
 * Navigation toggle component that animates between "Menu" and "Close" labels.
 * Uses GSAP SplitText for character-by-character animations.
 */
export function NavigationToggle() {
  const {
    containerRef,
    menuRef,
    closeRef,
    onSplitReady,
    toggle,
    disabled
  } = useNavigationToggle()

  return (
    <div ref={containerRef} className="flex items-center">
      <UnderlineButton
        className={cn("transition-opacity duration-500", {
          "pointer-events-none opacity-60": disabled,
          "pointer-events-auto opacity-100": !disabled,
        })}
        onClick={toggle}
      >
        <div className="relative overflow-hidden">
          <SplitText
            ref={menuRef}
            type="chars"
            className="opacity-0"
            onReady={onSplitReady}
          >
            <span>Menu</span>
          </SplitText>
          <SplitText
            ref={closeRef}
            type="chars"
            className="opacity-0 absolute top-0 left-0"
            onReady={onSplitReady}
          >
            <span>Close</span>
          </SplitText>
        </div>
      </UnderlineButton>
    </div>
  )
}
