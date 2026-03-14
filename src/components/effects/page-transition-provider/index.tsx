"use client"

import gsap from "gsap";
import { TransitionRouter } from "next-transition-router";
import { type ReactNode, startTransition, useCallback, useRef } from "react";

import { Z_INDEX_CLASSNAMES } from "@/lib/styles/const";
import { cn } from "@/lib/utils/helpers";

const ANIMATION_CONFIG = {
  duration: 1,
  ease: "power3.inOut",
}

type PageTransitionVariant = "slide" | "fade"

type PageTransitionProviderProps = {
  children: ReactNode;
  variant?: PageTransitionVariant;
}

export function PageTransitionProvider({ children, variant = "fade" }: PageTransitionProviderProps) {
  const transitionRef = useRef<HTMLDivElement>(null)

  const onLeave = useCallback((next: () => void) => {
    if (variant === "fade") {
      gsap.set(transitionRef.current, { yPercent: -100 })

      const tl = gsap.timeline()
        .to(transitionRef.current, {
          opacity: 1,
          ...ANIMATION_CONFIG,
          onComplete: () => {
            requestAnimationFrame(() => startTransition(next))
          },
        })

      return () => tl.kill()
    }

    gsap.set(transitionRef.current, { opacity: 1, yPercent: 0 })

    const tl = gsap.timeline()
      .to(transitionRef.current, {
        yPercent: -100,
        ...ANIMATION_CONFIG,
        onComplete: () => {
          requestAnimationFrame(() => startTransition(next))
        },
      })

    return () => tl.kill()
  }, [variant])

  const onEnter = useCallback((next: () => void) => {
    if (variant === "fade") {
      gsap.set(transitionRef.current, { yPercent: -100 })

      const tl = gsap.timeline()
        .to(transitionRef.current, {
          opacity: 0,
          ...ANIMATION_CONFIG,
          onComplete: () => {
            gsap.set(transitionRef.current, { opacity: 0, yPercent: 100 })
            requestAnimationFrame(() => startTransition(next))
          },
        })

      return () => tl.kill()
    }

    gsap.set(transitionRef.current, { opacity: 1, yPercent: -100 })

    const tl = gsap.timeline()
      .to(transitionRef.current, {
        yPercent: -200,
        ...ANIMATION_CONFIG,
        onComplete: () => {
          gsap.set(transitionRef.current, { yPercent: 0 })
          requestAnimationFrame(() => startTransition(next))
        },
      })

    return () => tl.kill()
  }, [variant])

  return (
    <TransitionRouter leave={onLeave} enter={onEnter} auto>
      <div
        ref={transitionRef}
        className={cn(
          "fixed inset-0",
          Z_INDEX_CLASSNAMES.pageTransition,
          "w-full h-full overflow-hidden",
          variant === "fade"
            ? "bg-neutral-50 opacity-0 translate-y-full"
            : "bg-primary-base opacity-0 translate-y-full will-change-transform"
        )} />
      {children}
    </TransitionRouter>
  )
}
