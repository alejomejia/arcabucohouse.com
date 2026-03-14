/**
 * ProductSlider compound component barrel.
 *
 * Import each sub-component directly from its source file when possible to
 * avoid pulling in the full module graph. This barrel exists for convenience
 * in cases where multiple parts are imported together.
 *
 * @example
 * ```tsx
 * import { 
 *  ProductSlider, 
 *  ProductSliderViewport, 
 *  ProductSliderSlide 
 * } from "@/components/ui/product-slider"
 * ```
 */
export { ProductSlider } from "./product-slider"
export { ProductSliderHeading } from "./product-slider-heading"
export { ProductSliderPagination } from "./product-slider-pagination"
export { ProductSliderSlide } from "./product-slider-slide"
export { ProductSliderViewport } from "./product-slider-viewport"

