'use client'

import { useMemo } from 'react'

import { useSelectedVariant } from "@/components/features/product/hooks/use-selected-variant"
import { findCheapestVariant } from "@/components/features/product/utils"
import { Price } from "@/components/ui/price"
import { Text } from "@/components/ui/text"
import type { Product } from "@/lib/integrations/shopify/types"

type ProductPriceProps = {
  product: Product
}

export function ProductPrice({ product }: ProductPriceProps) {
  const selectedVariant = useSelectedVariant(product.variants)
  const cheapestVariant = useMemo(() => findCheapestVariant(product.variants), [product.variants])

  const { amount, currencyCode } = selectedVariant?.price
    ?? cheapestVariant?.price
    ?? product.priceRange.minVariantPrice
  const isExact = selectedVariant !== undefined

  return (
    <div className="border-b border-neutral-200 py-3">
      <div className="flex items-center gap-4">
        <Text as="span" className="basis-24 shrink-0 uppercase text-xs font-semibold tracking-wider text-zinc-500">
          Price
        </Text>
        <div className="flex items-center gap-2">
          {!isExact && (
            <span className="text-xs uppercase font-semibold text-zinc-400">Starting from</span>
          )}
          <Price className="text-xl text-zinc-700" amount={amount} currencyCode={currencyCode} />
        </div>
      </div>
    </div>
  )
}
