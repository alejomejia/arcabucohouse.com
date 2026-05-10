'use client'

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { usePathname } from "next/navigation"
import { useTransitionState } from "next-transition-router"
import { useCallback, useEffect, useRef, useState, type RefObject } from "react"

import type { SplitTextRef } from "@/components/effects/split-text"
import { usePreloader } from "@/components/ui/preloader/hooks/use-preloader"
import { useDisableScroll } from "@/lib/hooks/use-disable-scroll"
import { getIsNavOpen, useNavigation } from "@/lib/utils/store"

const TOGGLE_ENABLE_DELAY = 400 //ms

const MENU_ANIMATION_OPTIONS = {
  stagger: 0.03,
  duration: 0.4,
  ease: "power3.inOut",
} as const;

// Preloader animation config - syncs with preloader
const PRELOADER_ANIMATION_CONFIG = {
  duration: 0.5,
  delay: 0.5, // Relative delay after preloader (staggered with other header elements)
  stagger: 0.05,
  ease: "gentleSlow",
} as const;

export interface UseNavigationToggleReturn {
  containerRef: RefObject<HTMLDivElement | null>
  menuRef: RefObject<SplitTextRef | null>
  closeRef: RefObject<SplitTextRef | null>
  onSplitReady: () => void
  toggle: () => void
  disabled: boolean
  open: boolean
}

/**
 * Manages navigation toggle animations and state.
 *
 * Coordinates preloader readiness, SplitText readiness, and user
 * interaction to animate between "Menu" and "Close" labels.
 *
 * @returns Object containing refs, onSplitReady, toggle function, and state
 */
export function useNavigationToggle(): UseNavigationToggleReturn {
  const pathname = usePathname()
  const { stage } = useTransitionState()
  const { navState, isNavOpen, openNav, openingNav, closingNav } = useNavigation()
  const { isReady: preloaderReady } = usePreloader()
  const [disabled, setDisabled] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<SplitTextRef>(null)
  const closeRef = useRef<SplitTextRef>(null)

  const isAnimatingRef = useRef(false)
  const hasPlayedIntroRef = useRef(false)
  const disableTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  // Track split readiness via state so useGSAP re-runs when both splits are ready
  const [splitsReady, setSplitsReady] = useState(false)
  const splitReadyCountRef = useRef(0)

  const onSplitReady = useCallback(() => {
    splitReadyCountRef.current++
    if (splitReadyCountRef.current >= 2) {
      setSplitsReady(true)
    }
  }, [])

  useDisableScroll(isNavOpen)

  // Schedule the enable of the button after a delay
  const scheduleEnable = useCallback(() => {
    clearTimeout(disableTimeoutRef.current ?? undefined)
    disableTimeoutRef.current = setTimeout(() => setDisabled(false), TOGGLE_ENABLE_DELAY)
  }, [])

  // Cleanup the timeout on unmount
  useEffect(() => {
    return () => clearTimeout(disableTimeoutRef.current ?? undefined)
  }, [])

  // Animate menu label in — runs when preloader and both splits are ready
  const { contextSafe } = useGSAP(() => {
    if (hasPlayedIntroRef.current) return
    if (!preloaderReady || !splitsReady) return
    if (!menuRef.current || !closeRef.current) return

    const menuChars = menuRef.current.getElements()
    const closeChars = closeRef.current.getElements()

    if (menuChars.length === 0 || closeChars.length === 0) return

    hasPlayedIntroRef.current = true

    // Get the container element
    const [menuContainer] = menuRef.current.getContainers()

    // Set container visible
    if (menuContainer) {
      gsap.set(menuContainer, { opacity: 1 })
    }

    // Initial state
    gsap.set(menuChars, { yPercent: 100 })

    // Animate in
    gsap.to(menuChars, {
      yPercent: 0,
      opacity: 1,
      ...PRELOADER_ANIMATION_CONFIG,
      onComplete: () => {
        scheduleEnable()
      },
    })
  }, { scope: containerRef, dependencies: [preloaderReady, splitsReady] })

  // Animate menu label out and close label in, on open
  const openAnimation = contextSafe(() => {
    if (!hasPlayedIntroRef.current) return
    if (!menuRef.current || !closeRef.current) return

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

    gsap.set(closeChars, { yPercent: 100 })

    // Animate menu label out
    gsap.to(menuChars, {
      yPercent: -100,
      ...MENU_ANIMATION_OPTIONS,
    })

    // Animate close label in
    gsap.to(closeChars, {
      delay: 0.25,
      yPercent: 0,
      ...MENU_ANIMATION_OPTIONS,
      onComplete: () => {
        isAnimatingRef.current = false
        scheduleEnable()
        openNav()
      },
    })
  })

  // Animate close label out and menu label in, on close
  const closeAnimation = contextSafe(() => {
    if (!hasPlayedIntroRef.current) return
    if (!menuRef.current || !closeRef.current) return

    const menuChars = menuRef.current.getElements()
    const closeChars = closeRef.current.getElements()

    if (menuChars.length === 0 || closeChars.length === 0) return

    // Kill any ongoing animations to prevent overlap
    gsap.killTweensOf([menuChars, closeChars])

    // Animate menu label in
    gsap.to(menuChars, {
      yPercent: 0,
      delay: 0.5,
      ...MENU_ANIMATION_OPTIONS,
    })

    // Animate close label out
    gsap.to(closeChars, {
      yPercent: 100,
      delay: 0.25,
      ...MENU_ANIMATION_OPTIONS,
      onComplete: () => {
        isAnimatingRef.current = false
        scheduleEnable()
        // Don't set to 'closed' here - let NavigationOverlay do it after its animation
      },
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

  // Primary: close on transition start, while the component is still mounted and
  // all refs are valid. Fires before next-transition-router commits the new pathname,
  // which prevents the cross-route-group remount from resetting hasPlayedIntroRef.
  useEffect(() => {
    if (stage !== 'leaving') return
    if (!hasPlayedIntroRef.current) return
    if (!getIsNavOpen()) return

    closingNav()
    closeAnimation()
  }, [stage])

  // Fallback: covers back/forward navigation that bypasses TransitionRouter.
  // By the time pathname changes after a stage-triggered close, getIsNavOpen()
  // is already false, so this is a no-op in the normal flow.
  useEffect(() => {
    if (!hasPlayedIntroRef.current) return
    if (!getIsNavOpen()) return

    closingNav()
    closeAnimation()
  }, [pathname])

  return {
    containerRef,
    menuRef,
    closeRef,
    onSplitReady,
    toggle,
    disabled,
    open: isNavOpen,
  }
}
