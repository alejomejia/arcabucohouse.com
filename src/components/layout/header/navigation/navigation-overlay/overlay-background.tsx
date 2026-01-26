"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

import { BackgroundWaves } from "@/components/effects/background-waves";
import { orchestraMenuOverlay } from "@/lib/orchestra";

const DELAY_MOUNT_MS = 500 // 0.5s

export function OverlayBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMounted(true)
    }, DELAY_MOUNT_MS)

    return () => clearTimeout(timeout)
  }, [])

  useGSAP(() => {
    if (!containerRef.current || !isMounted) return

    gsap.to(containerRef.current, {
      opacity: 0.1,
      ...orchestraMenuOverlay.backgroundVideo,
    })
  }, { scope: containerRef, dependencies: [isMounted] })

  if (!isMounted) return null

  return (
    <div ref={containerRef} className="absolute inset-0 opacity-0">
      <BackgroundWaves
        lineColor="#c2bcbc"
        backgroundColor="transparent"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.5}
        tension={0.01}
        maxCursorMove={200}
        xGap={12}
        yGap={36}
      />
    </div>
  )
}