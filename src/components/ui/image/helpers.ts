import { type ImageProps as NextImageProps } from 'next/image'

// Memoize helper functions to avoid blur data recreation
function toBase64 (str: string) {
  return typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str)
}

// Helper to generate blur placeholder with transparent background by default
function generateShimmer (w: number, h: number) {
  return `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="rgba(255,255,255,0.1)" offset="20%" />
        <stop stop-color="rgba(255,255,255,0.2)" offset="50%" />
        <stop stop-color="rgba(255,255,255,0.1)" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="rgba(0,0,0,0)" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>`
}

// Helper to determine if blur placeholder should be used
export function shouldUseBlurPlaceholder (
  src: NextImageProps['src'],
  placeholder: string,
  blurDataURL: string | undefined
): boolean {
  if (!src) return false
  const isSvg = typeof src === 'string' && src.includes('.svg')
  return !isSvg && placeholder === 'blur' && !blurDataURL
}

// Helper to generate blur data URL
export function generateBlurDataURL (
  shouldUse: boolean,
  aspectRatio: number | undefined,
  existingBlurDataURL: string | undefined
): string | undefined {
  if (!(shouldUse && aspectRatio)) return existingBlurDataURL

  const shimmerSvg = generateShimmer(700, Math.round(700 / aspectRatio))
  return `data:image/svg+xml;base64,${toBase64(shimmerSvg)}`
}

// Helper to determine final placeholder value
export function getFinalPlaceholder (
  shouldUse: boolean,
  aspectRatio: number | undefined,
  blurDataURL: string | undefined,
  originalPlaceholder: NextImageProps['placeholder']
): NextImageProps['placeholder'] {
  if (!shouldUse) {
    return originalPlaceholder === 'blur' && !blurDataURL ? 'empty' : originalPlaceholder
  }

  return aspectRatio || blurDataURL ? 'blur' : 'empty'
}