'use client'

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useCallback, useRef, useState, type RefObject } from "react"

import type { SplitTextRef } from "@/components/effects/split-text"
import { useDisableScroll } from "@/lib/hooks/use-disable-scroll"
import { orchestraNavigation } from "@/lib/orchestra"
import { useNavigation } from "@/lib/utils/store"

const MENU_ANIMATON_OPTIONS = {
  stagger: 0.03,
  duration: 0.4,
  ease: "power3.inOut"
}

export interface UseNavigationToggleReturn {
  containerRef: RefObject<HTMLDivElement | null>
  menuRef: RefObject<SplitTextRef | null>
  closeRef: RefObject<SplitTextRef | null>
  toggle: () => void
  disabled: boolean
  open: boolean
}

/**
 * Custom hook that manages navigation toggle animations and state.
 * Handles text reveal animations using GSAP SplitText and prevents
 * overlapping animations on rapid clicks.
 *
 * @returns Object containing refs, toggle function, and state
 */
export function useNavigationToggle(): UseNavigationToggleReturn {
  const { navState, isNavOpen, openNav, openingNav, closingNav } = useNavigation()
  const [disabled, setDisabled] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<SplitTextRef>(null)
  const closeRef = useRef<SplitTextRef>(null)

  const isAnimatingRef = useRef(false)

  useDisableScroll(isNavOpen)

  // Debounce setDisabled to prevent rapid clicking bugs
  const debouncedSetDisabled = useCallback(() => {
    const timeout = setTimeout(() => setDisabled(false), 200)

    return () => clearTimeout(timeout)
  }, [])

  // Animate menu label in, on mount
  const { contextSafe } = useGSAP(() => {
    if (!menuRef.current || !closeRef.current) return

    // Wait for SplitText to be ready (fonts loaded and split complete)
    const checkReady = () => {
      if (!menuRef.current?.isReady() || !closeRef.current?.isReady()) {
        // Retry after a short delay if not ready yet
        setTimeout(checkReady, 50)
        return
      }

      const menuChars = menuRef.current.getElements()
      const closeChars = closeRef.current.getElements()

      if (menuChars.length === 0 || closeChars.length === 0) return

      // Get the container element (the element with opacity-0 class)
      const [menuContainer] = menuRef.current.getContainers()

      // avoid FOUC by add opacity-0 class to text containers
      // and set opacity to 1 here before animation starts
      if (menuContainer) {
        gsap.set(menuContainer, { opacity: 1 })
      }

      // Initial state - Menu visible, Close hidden
      gsap.set(menuChars, {
        yPercent: 100,
      })

      // Menu starts below, animate in
      gsap.to(menuChars, {
        yPercent: 0,
        opacity: 1,
        ...orchestraNavigation.menu,
        onComplete: () => {
          debouncedSetDisabled()
        }
      })
    }

    checkReady()
  }, { scope: containerRef })

  // Animate menu label out and close label in, on open
  const openAnimation = contextSafe(() => {
    if (!menuRef.current || !closeRef.current) return
    if (!menuRef.current.isReady() || !closeRef.current.isReady()) return

    const menuChars = menuRef.current.getElements()
    const closeChars = closeRef.current.getElements()

    if (menuChars.length === 0 || closeChars.length === 0) return

    // Kill any ongoing animations to prevent overlap
    gsap.killTweensOf([menuChars, closeChars])

    // Set close label to visible and start below
    const [closeContainer] = closeRef.current.getContainers()

    if (closeContainer) {
      gsap.set(closeContainer, { opacity: 1 })
    }

    gsap.set(closeChars, {
      yPercent: 100,
    })

    // Animate menu label out
    gsap.to(menuChars, {
      yPercent: -100,
      ...MENU_ANIMATON_OPTIONS,
    })

    // Animate close label in
    gsap.to(closeChars, {
      delay: 0.25,
      yPercent: 0,
      ...MENU_ANIMATON_OPTIONS,
      onComplete: () => {
        isAnimatingRef.current = false
        debouncedSetDisabled()
        openNav()
      }
    })
  })

  // Animate close label out and menu label in, on close
  const closeAnimation = contextSafe(() => {
    if (!menuRef.current || !closeRef.current) return
    if (!menuRef.current.isReady() || !closeRef.current.isReady()) return

    const menuChars = menuRef.current.getElements()
    const closeChars = closeRef.current.getElements()

    if (menuChars.length === 0 || closeChars.length === 0) return

    // Kill any ongoing animations to prevent overlap
    gsap.killTweensOf([menuChars, closeChars])

    // Animate menu label in
    gsap.to(menuChars, {
      yPercent: 0,
      delay: 0.5,
      ...MENU_ANIMATON_OPTIONS,
    })

    // Animate close label out
    gsap.to(closeChars, {
      yPercent: 100,
      delay: 0.25,
      ...MENU_ANIMATON_OPTIONS,
      onComplete: () => {
        isAnimatingRef.current = false
        debouncedSetDisabled()
        // Don't set to 'closed' here - let NavigationOverlay do it after its animation
      }
    })
  })

  const toggle = () => {
    // Prevent rapid clicking during animations
    if (isAnimatingRef.current || disabled) return

    // Mark as animating and disable button
    isAnimatingRef.current = true
    setDisabled(true)

    // Update state and run appropriate animation
    if (navState === 'closed') {
      openingNav()
      openAnimation()
    } else if (navState === "open") {
      closingNav()
      closeAnimation()
    }
  }

  return {
    containerRef,
    menuRef,
    closeRef,
    toggle,
    disabled,
    open: isNavOpen,
  }
}