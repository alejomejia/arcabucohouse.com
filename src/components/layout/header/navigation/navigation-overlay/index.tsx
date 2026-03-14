"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { type ReactNode, useRef } from "react"

import { Container } from "@/components/ui/container"
import { Portal } from "@/components/ui/portal"
import { HEADER_TOP_PADDING_CLASSNAME, PORTAL_IDS, Z_INDEX_CLASSNAMES } from "@/lib/styles/const"
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

    gsap.killTweensOf(containerRef.current, "clipPath")

    if (navState === 'opening') {
      gsap.set(containerRef.current, {
        clipPath: CLIP_PATH_INITIAL,
        willChange: "clip-path",
      })

      // Defer animation by one GSAP tick so the browser can paint the newly
      // mounted Portal DOM before the clip-path animation starts.
      // Without this, the first frame is janky because mount + layout + paint
      // + animation all compete for the same frame budget.
      gsap.delayedCall(0, () => {
        if (!containerRef.current) return
        gsap.to(containerRef.current, {
          clipPath: CLIP_PATH_OPENED,
          duration: 1,
          ease: "smoothSnap",
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.willChange = "auto"
            }
          }
        })
      })
    } else if (navState === 'closing') {
      gsap.set(containerRef.current, { willChange: "clip-path" })
      gsap.to(containerRef.current, {
        clipPath: CLIP_PATH_INITIAL,
        duration: 1,
        ease: "smoothSnap",
        onComplete: () => {
          closeNav()
        }
      })
    }
  }, { scope: containerRef, dependencies: [navState] })

  // Only unmount when fully closed
  if (navState === "closed") return null

  return (
    <Portal id={PORTAL_IDS.bodyTop}>
      <div ref={containerRef} className={cn("fixed w-full h-screen pb-6 bg-primary-600", Z_INDEX_CLASSNAMES.navigationOverlay, HEADER_TOP_PADDING_CLASSNAME)}>
        <Container className="h-full">
          {children}
        </Container>
      </div>
    </Portal>
  )
}

