"use client"

import { useGSAP } from "@gsap/react"
import { useCallback, useMemo, useRef } from "react"

import { ImageStack, type ImageStackRef, type StackImage } from "@/components/effects/image-stack"
import { OVERLAY_IMAGES_SHAPE } from "@/lib/integrations/shopify/config"
import type { Menu } from "@/lib/integrations/shopify/types"
import { orchestraMenuOverlay } from "@/lib/orchestra"
import { cn } from "@/lib/utils/helpers"

import { OverlayBackground } from "./overlay-background"
import { OverlayFooter } from "./overlay-footer"
import { OverlayMenuList } from "./overlay-menu-list"

/**
 * Props for the OverlayContent component
 */
export interface OverlayContentProps {
  menu: Menu[]
}

/**
 * Animation configuration for the image stack
 */
const IMAGE_ANIMATION_CONFIG = {
  debounceDelay: 500,
  revealDuration: 0.7,
  scaleDuration: 0.9,
  ease: "power3.out"
}

/**
 * Normalize menu title to match config keys: lowercase and replace spaces with dashes
 */
function normalizeMenuTitle(title: string): string {
  return title.toLowerCase().replaceAll(" ", "-")
}

/**
 * Get image source from config based on normalized menu title, fallback to default
 */
function getImageSrc(normalizedTitle: string): string {
  return OVERLAY_IMAGES_SHAPE[normalizedTitle as keyof typeof OVERLAY_IMAGES_SHAPE] || OVERLAY_IMAGES_SHAPE.default
}

/**
 * Navigation overlay content with animated menu list and image stack.
 * Hovering menu items reveals corresponding images with smooth transitions.
 */
export function OverlayContent({ menu }: OverlayContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageStackRef = useRef<ImageStackRef>(null)

  /**
   * Build images array from menu items and config
   * Index 0 = default/no hover state
   * Index 1+ = corresponds to menu items in order
   */
  const overlayImages = useMemo<StackImage[]>(() => {
    const images: StackImage[] = [
      {
        id: "default",
        src: OVERLAY_IMAGES_SHAPE.default,
        alt: "default image"
      }
    ]

    for (const item of menu) {
      const normalizedTitle = normalizeMenuTitle(item.title)

      images.push({
        id: normalizedTitle,
        src: getImageSrc(normalizedTitle),
        alt: `${normalizedTitle} image`
      })
    }

    return images
  }, [menu])

  // Initialize image stack on mount
  useGSAP(() => {
    imageStackRef.current?.initializeStack()
  }, { scope: containerRef })

  /**
   * Handle menu item hover - animate to corresponding image based on title
   * Menu index maps to image index: menuIndex + 1 (since index 0 is default)
   */
  const handleItemHover = useCallback((menuIndex: number) => {
    // Images array is built in order: default (0), then menu items (1+)
    const imageIndex = menuIndex + 1
    if (imageIndex < overlayImages.length) {
      imageStackRef.current?.animateToIndex(imageIndex)
    }
  }, [overlayImages.length])

  /**
   * Handle mouse leaving menu - return to default image
   */
  const handleMenuLeave = useCallback(() => {
    imageStackRef.current?.animateToIndex(0) // Index 0 = default image
  }, [])

  return (
    <>
      <OverlayBackground />
      <div ref={containerRef} className="relative z-20 h-full flex flex-col gap-8 md:h-full text-white">
        <div className="flex justify-between gap-6 w-full h-full">
          <div className="flex-1 py-6 md:py-16">
            <OverlayMenuList
              menu={menu}
              onItemHover={handleItemHover}
              onMenuLeave={handleMenuLeave}
            />
          </div>
          <div className={cn(
            "hidden h-full",
            "md:flex md:items-end"
          )}>
            <ImageStack
              ref={imageStackRef}
              className="aspect-2/3 max-h-[75%]"
              images={overlayImages}
              animationConfig={IMAGE_ANIMATION_CONFIG}
              initAnimationConfig={orchestraMenuOverlay.imageStack}
            />
          </div>
        </div>
        <OverlayFooter />
      </div>
    </>
  )
}
