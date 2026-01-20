'use client'

import { useEffect } from 'react'

import { OVERLAY_IMAGES_COLLECTION } from '@/lib/integrations/shopify/config'
import { preloadImage } from '@/lib/utils/helpers'

/**
 * Client component that preloads the default overlay image on mount.
 * This prevents flickering when the overlay menu opens, as the image
 * will already be cached in the browser.
 * 
 * This component renders nothing and only performs the preload operation.
 */
export function OverlayImagePreloader() {
  useEffect(() => {
    // Preload the default image as soon as the component mounts
    // Since Navigation is always rendered in the header, this ensures
    // the image is ready before the user clicks the menu toggle
    preloadImage(OVERLAY_IMAGES_COLLECTION.default).catch((error) => {
      // Silently fail - image will load normally when overlay opens
      // This prevents preload failures from breaking the app
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to preload overlay image:', error)
      }
    })
  }, [])

  // This component doesn't render anything
  return null
}
