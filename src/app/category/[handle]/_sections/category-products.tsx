"use client"

import { useGSAP } from "@gsap/react"
import gsap from 'gsap'
import { useRef } from "react"

import { UnderlineLink } from "@/components/effects/underline/underline-link"
import { ProductCard } from "@/components/products/product-card"
import { Grid } from "@/components/ui/grid"
import type { Product } from "@/lib/integrations/shopify/types"
import { useTransitionState } from "next-transition-router"

type CategoryProductsType = {
  products: Product[]
}

export function CategoryProducts({ products }: CategoryProductsType) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isReady: isTransitionReady } = useTransitionState()

  useGSAP(() => {
    if (!containerRef.current || !isTransitionReady) return

    const cards = gsap.utils.toArray("[data-product-card]")

    gsap.to(cards, {
      opacity: 1,
      delay: 0.5,
      stagger: 0.15,
      duration: 3,
      ease: "gentleSlow",
    })
  }, { scope: containerRef, dependencies: [isTransitionReady] })

  return (
    <div className="border-t border-primary-100 py-12">
      {products.length === 0 ? (
        <CategoryNoProducts />
      ) : (
        <div ref={containerRef}>
          <Grid className="gap-x-4 gap-y-12">
            {products.map((product) => (
              <div key={product.id} className="col-span-full md:col-span-8 lg:col-span-8 xl:col-span-6">
                <div className="opacity-0" data-product-card>
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </Grid>
        </div>
      )}
    </div>
  )
}

function CategoryNoProducts() {
  return (
    <Grid>
      <div className="col-span-7">
        <span className="block mb-8 w-1/2 text-xl font-semibold text-secondary-300 text-pretty">
          No products currently available in this category
        </span>
        <UnderlineLink
          className="text-lg font-semibold uppercase leading-none font-serif"
          href="/">
          Explore Homepage
        </UnderlineLink>
      </div>
      <div className="col-start-9 -col-end-1">
        <p className="text-xl font-serif">
          Our pieces are produced in limited quantities and often crafted in small batches. This category is being carefully restocked. We invite you to explore other collections while new works are being prepared.
        </p>
      </div>
    </Grid>
  )
}
