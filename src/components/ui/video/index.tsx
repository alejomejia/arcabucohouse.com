'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, type VideoHTMLAttributes } from 'react'

import { cn } from '@/lib/utils/helpers'

type VideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  threshold?: number
}

/**
 * Viewport-aware video player that auto-plays when visible and pauses when scrolled out.
 *
 * Client Component — uses IntersectionObserver for viewport detection.
 * Resumes from last playback position when scrolled back into view.
 * Resets playback to the start on route navigation.
 * Defaults to `muted` and `playsInline` for cross-browser autoplay support.
 *
 * @param src - Video source URL
 * @param threshold - Viewport intersection ratio to trigger play (0–1, default: 0.5)
 * @param className - Additional CSS classes merged with base styles
 *
 * @example
 * ```tsx
 * <Video
 *   src="/hero-video.mp4"
 *   loop
 *   className="rounded-lg"
 * />
 * ```
 */
export function Video({ src, className, threshold = 0, ...props }: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const pathname = usePathname()

  // Reset video to start on route change
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = 0
    video.pause()
  }, [pathname])

  // Play/pause based on viewport visibility
  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Autoplay may be blocked by browser policy — fail silently
          })
        } else {
          video.pause()
        }
      },
      { threshold }
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
    }
  }, [threshold])

  return (
    <video
      ref={videoRef}
      src={src}
      className={cn('w-full h-full object-cover', className)}
      playsInline
      muted
      controls={false}
      {...props}
    />
  )
}
