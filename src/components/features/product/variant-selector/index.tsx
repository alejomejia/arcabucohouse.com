'use client'

import { useMemo } from 'react'

import type { ProductOption, ProductVariant } from '@/lib/integrations/shopify/types'

import { getCombinations, productHasNoOptionsOrJustOneOption } from './helpers'
import { VariantSelectorOption } from './option'

type VariantSelectorProps = {
  options: ProductOption[]
  variants: ProductVariant[]
}

/**
 * VariantSelector component that allows the user to select a variant of the product.
 *
 * @param options - The product options.
 * @param variants - The product variants.
 * @returns The VariantSelector component.
 */
export function VariantSelector({ options, variants }: VariantSelectorProps) {
  const hasNoOptionsOrJustOneOption = productHasNoOptionsOrJustOneOption(options)

  if (hasNoOptionsOrJustOneOption) {
    return null
  }

  const combinations = useMemo(() => getCombinations(variants), [variants])

  return options.map((option) => (
    <form key={option.id} className="border-b border-neutral-200 py-4">
      <dl className="flex items-center gap-4">
        <dt className="basis-16 font-serif text-lg italic leading-none">
          {option.name}
        </dt>
        <dd className="flex flex-wrap gap-2">
          {option.values.map((value) => (
            <VariantSelectorOption
              key={value}
              option={option}
              options={options}
              value={value}
              combinations={combinations}
            />
          ))}
        </dd>
      </dl>
    </form>
  ))
}
