import { MIN_WRAPPERS } from "./use-products-carousel-animation"

const ERROR_PREFIX = "Products Carousel"

type SplitResult<T> = {
  middle: T
  left: T[]
  right: T[]
}

/**
 * Splits an odd-length array into middle element and left/right halves.
 * Left is reversed so closest-to-center is first.
 *
 * @throws Error if length < MIN_WRAPPERS or middle is missing
 */
export function splitElements<T extends HTMLDivElement>(elements: T[]): SplitResult<T> {
  if (elements.length < MIN_WRAPPERS) {
    throw new Error(
      `${ERROR_PREFIX}: At least ${MIN_WRAPPERS} products are required for the animation.`
    )
  }

  const [middle, ...rest] = elements

  if (!middle) {
    throw new Error(`${ERROR_PREFIX}: Middle element not found.`)
  }

  const half = Math.floor(rest.length / 2)

  return {
    middle,
    left: rest.slice(half).reverse(),
    right: rest.slice(0, half),
  }
}

/**
 * Returns the total horizontal space of a slide wrapper (width + margin-left of parent slide).
 *
 * @throws Error if parent with class "slide" is not found
 */
export function getTotalWidth(wrapper: HTMLDivElement): number {
  const parentSlide = wrapper.closest(".slide")

  if (!parentSlide) {
    throw new Error(`${ERROR_PREFIX}: Parent slide not found for width calculation.`)
  }

  const { width } = wrapper.getBoundingClientRect()

  const style = window.getComputedStyle(parentSlide)
  const gap = Number.parseFloat(style.getPropertyValue("--slide-spacing")) * 16 // 1rem = 16px

  return width + gap
}
