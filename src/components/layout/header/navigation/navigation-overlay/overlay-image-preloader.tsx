'use client'

import { useEffect, useRef } from 'react'

import { OVERLAY_IMAGES_SHAPE } from '@/lib/integrations/shopify/config'
import { isDev } from '@/lib/utils/config'
import { preloadImage } from '@/lib/utils/helpers'
import { useNavigation } from '@/lib/utils/store'

/**
 * Client component that preloads the default overlay image on mount.
 * Also preloads the rest of the overlay images when the navigation is opened.
 * This prevents flickering when the overlay menu opens, as the image
 * will already be cached in the browser, same when hovering over menu items.
 * 
 * This component renders nothing and only performs the preload operation.
 */
export function OverlayImagePreloader() {
  const { isNavOpen } = useNavigation()
  const isNavOpenRef = useRef(isNavOpen)

  // Preload the default image as soon as the component mounts
  // Since Navigation is always rendered in the header, this ensures
  // the image is ready before the user clicks the menu toggle
  useEffect(() => {
    preloadImage(OVERLAY_IMAGES_SHAPE.default).catch((error) => {
      // Silently fail - image will load normally when overlay opens
      // This prevents preload failures from breaking the app
      if (isDev) {
        console.warn('Failed to preload overlay image:', error)
      }
    })
  }, [])

  useEffect(() => {
    if (!isNavOpen || isNavOpenRef.current) return

    // Update ref to prevent preloading again if navigation is opened again
    isNavOpenRef.current = isNavOpen

    // Default image is preloaded above, so we only need to preload the rest
    const overlayImages = Object.values(OVERLAY_IMAGES_SHAPE).slice(1, Infinity)

    Promise.all(overlayImages.map(preloadImage)).catch((error) => {
      // Silently fail - image will load normally when overlay opens
      // This prevents preload failures from breaking the app
      if (isDev) {
        console.warn('Failed to preload overlay images:', error)
      }
    })
  }, [isNavOpen])

  // This component doesn't render anything
  return null
}
