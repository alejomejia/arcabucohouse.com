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

type PageTransitionProviderProps = {
  children: ReactNode;
}

export function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const transitionRef = useRef<HTMLDivElement>(null)

  const onLeave = useCallback((next: () => void) => {
    gsap.set(transitionRef.current, { opacity: 1, yPercent: 100 })

    const tween = gsap.to(transitionRef.current, {
      yPercent: 0,
      ...ANIMATION_CONFIG,
      onComplete: next,
    })

    return () => tween.kill()
  }, [])

  const onEnter = useCallback((next: () => void) => {
    gsap.set(transitionRef.current, { opacity: 1, yPercent: 0 })

    const tl = gsap.timeline()
      .to(transitionRef.current, {
        yPercent: -100,
        ...ANIMATION_CONFIG,
        onComplete: next,
      }).call(() => {
        requestAnimationFrame(() => startTransition(next))
      })

    return () => tl.kill()
  }, [])

  return (
    <TransitionRouter auto leave={onLeave} enter={onEnter}>
      <div
        ref={transitionRef}
        className={cn(
          "fixed inset-0",
          Z_INDEX_CLASSNAMES.pageTransition,
          "w-full h-full pointer-events-none overflow-hidden",
          "bg-primary-base opacity-0"
        )} />
      {children}
    </TransitionRouter>
  )
}