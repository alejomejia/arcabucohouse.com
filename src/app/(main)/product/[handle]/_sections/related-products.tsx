"use client"

import { ProductCarousel } from '@/components/products/product-carousel'
import type { Product } from '@/lib/integrations/shopify/types'

type RelatedProductsCarouselProps = {
  products: Product[]
}

export function RelatedProductsCarousel({ products }: RelatedProductsCarouselProps) {
  return (
    <section className="py-20 -mx-6">
      <ProductCarousel products={products} className="text-zinc-700 w-full">
        <ProductCarousel.Heading />
        <ProductCarousel.Viewport>
          {products.map((product, i) => (
            <ProductCarousel.Slide key={product.handle} index={i} product={product} />
          ))}
        </ProductCarousel.Viewport>
        <ProductCarousel.Pagination />
      </ProductCarousel>
    </section>
  )
}
