import type { UseSpotlightOptions } from "./hooks/use-spotlight"

/**
 * Default progress thresholds, scales, and pin length for the spotlight
 * scroll animation. Tuning these together keeps the image-strip → mask
 * reveal → headline word reveal sequence in sync.
 */
export const SPOTLIGHT_DEFAULT_OPTIONS: Required<UseSpotlightOptions> = {
  pinHeightMultiplier: 7,
  scrub: 1,
  imageScrollEndProgress: 0.5,
  initialImagesYPercent: 5,
  maskRevealStart: 0.25,
  maskRevealEnd: 0.75,
  maskSizeMaxPercent: 600,
  maskImageScaleStart: 1.5,
  maskImageScaleEnd: 1,
  wordRevealStart: 0.75,
  wordRevealEnd: 0.95,
}
