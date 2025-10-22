'use client'

import gsap from 'gsap'
import CustomEase from 'gsap/CustomEase'
import { useTempus } from 'tempus/react'

if (typeof window !== 'undefined') {
  gsap.defaults({ ease: 'none' })

  gsap.ticker.lagSmoothing(0)
  gsap.ticker.remove(gsap.updateRoot)

  // Create custom easing curves
  gsap.registerPlugin(CustomEase)

  CustomEase.create('hop', '0.9, 0, 0.1, 1')
}

export function GSAP() {
  useTempus((time) => {
    gsap.updateRoot(time / 1000)
  })

  return null
}
