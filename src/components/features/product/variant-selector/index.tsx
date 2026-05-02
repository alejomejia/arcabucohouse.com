'use client'

import { useEffect, useMemo } from 'react'

import { type UnitCategory, useUnit } from '@/lib/hooks/use-unit'
import type { ProductOption, ProductVariant } from '@/lib/integrations/shopify/types'
import { useProduct } from '@/components/features/product/hooks/use-product'
import { useUpdateURL } from '@/components/features/product/hooks/use-update-url'
import type { ProductState } from '@/components/features/product/types'
import { findCheapestVariant } from '@/components/features/product/utils'

import { getCombinations, productHasNoOptionsOrJustOneOption } from './helpers'
import { VariantSelectorOption } from './option'
import { UnitToggle } from './unit-toggle'

type VariantSelectorProps = {
  options: ProductOption[]
  variants: ProductVariant[]
  category?: string
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
 * VariantSelector component that allows the user to select a variant of the product.
 * For numeric dimension options, a unit toggle is shown when the product belongs to
 * a recognised unit category (lighting: mm/in, rug: cm/ft).
 * Each category remembers its preferred unit independently.
 *
 * @param options  - The product options.
 * @param variants - The product variants.
 * @param category - The product category collection handle (e.g. "category-rugs").
 */
export function VariantSelector({ options, variants, category }: VariantSelectorProps) {
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
              />
            ))}
          </dd>
        </dl>
      </form>
    )
  })
}
