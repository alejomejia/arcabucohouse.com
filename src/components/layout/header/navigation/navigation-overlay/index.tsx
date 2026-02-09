"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { type ReactNode, useRef } from "react"

import { Container } from "@/components/ui/container"
import { Portal } from "@/components/ui/portal"
import { HEADER_TOP_PADDING_CLASSNAME, PORTAL_IDS } from "@/lib/styles/const"
import { cn } from "@/lib/utils/helpers"
import { useNavigation } from "@/lib/utils/store"

const CLIP_PATH_INITIAL = "ellipse(150% 0% at 50% 0%)"
const CLIP_PATH_OPENED = "ellipse(150% 150% at 50% 50%)"

interface NavigationOverlayProps {
  children: ReactNode
}

export function NavigationOverlay({ children }: NavigationOverlayProps) {
  const { navState, closeNav } = useNavigation()
  const containerRef = useRef<HTMLDivElement>(null)

  // Animate the overlay in / out
  useGSAP(() => {
    if (!containerRef.current) return

    if (navState === 'opening') {
      gsap.set(containerRef.current, {
        clipPath: CLIP_PATH_INITIAL
      })

      gsap.to(containerRef.current, {
        clipPath: CLIP_PATH_OPENED,
        duration: 1,
        ease: "smoothSnap"
      })
    } else if (navState === 'closing') {
      gsap.to(containerRef.current, {
        clipPath: CLIP_PATH_INITIAL,
        duration: 1,
        ease: "smoothSnap",
        onComplete: () => closeNav()
      })
    }
  }, { scope: containerRef, dependencies: [navState] })

  // Only unmount when fully closed
  if (navState === "closed") return null

  return (
    <Portal id={PORTAL_IDS.bodyTop}>
      <div ref={containerRef} className={cn("fixed w-full h-screen pb-6 z-40 bg-primary-600", HEADER_TOP_PADDING_CLASSNAME)}>
        <Container className="h-full">
          {children}
        </Container>
      </div>
    </Portal>
  )
}

