'use client'

import { useEffect, useMemo } from 'react'

import { type UnitCategory, useUnit } from '@/lib/hooks/use-unit'
import type { ProductOption, ProductVariant } from '@/lib/integrations/shopify/types'
import { useProduct } from '@/components/features/product/hooks/use-product'
import { useUpdateURL } from '@/components/features/product/hooks/use-update-url'
import type { ProductState } from '@/components/features/product/types'
import { findCheapestVariant } from '@/components/features/product/utils'

import { getCombinations, productHasNoOptionsOrJustOneOption } from './helpers'
import { VariantSelectorOption } from './variant-selector-option'
import { UnitToggle } from './variant-selector-unit-toggle'

type VariantSelectorProps = {
  options: ProductOption[]
  variants: ProductVariant[]
  category?: string
  productHandle: string
}

/** Returns true when every non-empty value in an option parses as a finite number. */
function isNumericOption(option: ProductOption): boolean {
  return option.values.length > 0 && option.values.every((v) => isFinite(parseFloat(v)))
}

function getUnitCategory(handle?: string): UnitCategory | null {
  if (handle?.toLowerCase().includes('lighting')) return 'lighting'
  if (handle?.toLowerCase().includes('rug')) return 'rug'
  return null
}

/**
 * Renders one form per product option, with each value exposed as a
 * `<VariantSelectorOption>`. For numeric dimension options on recognised
 * categories (lighting: mm/in; rug: cm/ft) a `<UnitToggle>` lets the
 * customer switch units; each category remembers its preferred unit
 * independently via `useUnit`.
 *
 * Returns `null` when the product has no options or a single trivial option.
 *
 * @param options  - The product options.
 * @param variants - The product variants.
 * @param category - The product category collection handle (e.g. "category-rugs").
 *
 * @example
 * ```tsx
 * <VariantSelector
 *   options={product.options}
 *   variants={product.variants}
 *   category={product.category?.handle}
 * />
 * ```
 */
export function VariantSelector({ options, variants, category, productHandle }: VariantSelectorProps) {
  const combinations = useMemo(() => getCombinations(variants), [variants])
  const unitCategory = getUnitCategory(category)
  const [unit, setUnit, units] = useUnit(unitCategory ?? 'lighting')

  const { state } = useProduct()
  const updateURL = useUpdateURL()

  const cheapestAvailableVariant = useMemo(() => findCheapestVariant(variants), [variants])

  useEffect(() => {
    const hasSelection = options.some(opt => state[opt.name.toLowerCase()] !== undefined)
    if (hasSelection || !cheapestAvailableVariant) return

    const newState = cheapestAvailableVariant.selectedOptions.reduce<ProductState>(
      (acc, { name, value }) => ({ ...acc, [name.toLowerCase()]: value }),
      {}
    )
    updateURL(newState)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const hasNoOptionsOrJustOneOption = productHasNoOptionsOrJustOneOption(options)
  if (hasNoOptionsOrJustOneOption) return null

  return options.map((option) => {
    const numeric = isNumericOption(option) && unitCategory !== null

    return (
      <form key={option.id} className="border-b border-neutral-200 py-3">
        <dl className="flex gap-4">
          <dt className="min-h-9 basis-24 flex flex-col items-start justify-center gap-2 shrink-0 uppercase text-xs font-semibold tracking-wider text-zinc-500">
            {option.name}
            {numeric && <UnitToggle unit={unit} units={units} onChange={setUnit} />}
          </dt>
          <dd className="min-h-9 flex flex-wrap gap-2">
            {option.values.map((value) => (
              <VariantSelectorOption
                key={value}
                option={option}
                options={options}
                value={value}
                combinations={combinations}
                unit={numeric ? unit : undefined}
                productHandle={productHandle}
              />
            ))}
          </dd>
        </dl>
      </form>
    )
  })
}
