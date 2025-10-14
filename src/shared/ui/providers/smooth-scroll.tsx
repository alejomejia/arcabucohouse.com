'use client'

import { ReactLenis } from 'lenis/react'
import type { PropsWithChildren } from 'react'

export function SmoothScroll({ children }: PropsWithChildren) {
  return (
    <ReactLenis root options={{ duration: 1.2 }}>
      {children}
    </ReactLenis>
  )
}
