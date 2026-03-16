"use client"

import { ProductCarousel } from "@/components/products/product-carousel";
import type { Product } from "@/lib/integrations/shopify/types";

type ProductsCarouselProps = {
  products: Product[]
}

export function ProductsCarousel({ products }: ProductsCarouselProps) {
  return (
    <ProductCarousel
      products={products}
      className="font-serif text-primary-base w-full"
    >
      <ProductCarousel.Heading />
      <ProductCarousel.Viewport>
        {products.map((product, i) => (
          <ProductCarousel.Slide
            key={product.handle}
            index={i}
            product={product}
          />
        ))}
      </ProductCarousel.Viewport>
      <ProductCarousel.Pagination />
    </ProductCarousel>
  )
}