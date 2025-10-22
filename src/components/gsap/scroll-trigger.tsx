'use client'

import gsap from 'gsap'
import { ScrollTrigger as GSAPScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import { useEffect } from 'react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(GSAPScrollTrigger)
  GSAPScrollTrigger.clearScrollMemory('manual')
  GSAPScrollTrigger.defaults({
    markers: process.env.NODE_ENV === 'development'
  })
}

// @TODO: Move handlers to useEffectEvent hook when ready
export function ScrollTrigger() {
  const handleUpdate = () => {
    GSAPScrollTrigger.update()
  }

  const handleRefresh = () => {
    GSAPScrollTrigger.refresh()
  }

  const lenis = useLenis(handleUpdate)

  useEffect(() => {
    if (lenis) {
      handleRefresh()
    }
  }, [lenis])

  return null
}
