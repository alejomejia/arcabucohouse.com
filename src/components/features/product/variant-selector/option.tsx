import type { ProductOption } from "@/lib/integrations/shopify/types"
import { cn } from "@/lib/utils/helpers"

import { CURSOR_MEDIUM, CURSOR_SMALL } from "@/components/effects/cursor/cursor-states"
import { CursorTrigger } from "@/components/effects/cursor/cursor-trigger"
import { useProduct } from "@/components/features/product/hooks/use-product"
import { useUpdateURL } from "@/components/features/product/hooks/use-update-url"

import { Combination } from "./helpers"

const ACTIVE_CLASSNAME = "cursor-default bg-zinc-900 text-zinc-100 border-zinc-900"
const AVAILABLE_FOR_SALE_CLASSNAME = "text-zinc-500 border-zinc-200 hover:bg-zinc-900 hover:text-zinc-100 hover:border-zinc-900"
const NOT_AVAILABLE_FOR_SALE_CLASSNAME = "cursor-default bg-zinc-200 text-zinc-400 border-zinc-200"

type VariantSelectorOptionProps = {
  option: ProductOption
  options: ProductOption[]
  value: string
  combinations: Combination[]
}

/**
 * VariantSelectorOption component that allows the user to select a variant of the product.
 *
 * @param option - The product option.
 * @param options - The product options.
 * @param value - The value of the option.
 * @param combinations - The combinations of the product variants.
 * @returns The VariantSelectorOption component.
 */
export function VariantSelectorOption({ option, options, value, combinations }: VariantSelectorOptionProps) {
  const { state, updateOption } = useProduct()
  const updateURL = useUpdateURL()

  const formAction = () => {
    // avoid re-rendering if the option is already selected
    if (isActive) {
      return
    }

    const newState = updateOption(optionNameLowerCase, value)
    updateURL(newState)
  }

  const optionNameLowerCase = option.name.toLowerCase()

  // Base option params on current selectedOptions so we can preserve any other param state.
  const optionParams = { ...state, [optionNameLowerCase]: value }

  // Filter out invalid options and check if the option combination is available for sale.
  const filtered = Object.entries(optionParams).filter(([key, value]) =>
    options.find((option) => option.name.toLowerCase() === key && option.values.includes(value))
  )
  const isAvailableForSale = combinations.find((combination) =>
    filtered.every(([key, value]) => combination[key] === value && combination.availableForSale)
  )

  // The option is active if it's in the selected options.
  const isActive = state[optionNameLowerCase] === value

  const title = `${option.name} ${value}${!isAvailableForSale ? ' [Out of Stock]' : ''}`

  return (
    <CursorTrigger config={isAvailableForSale && !isActive ? CURSOR_MEDIUM : CURSOR_SMALL}>
      <button
        key={value}
        formAction={formAction}
        title={title}
        className={cn(
          "flex items-center justify-center",
          "min-w-12 px-3 py-2 border-2",
          "text-xs uppercase font-semibold tracking-widest",
          "transition duration-300 ease-in-out",
          {
            [ACTIVE_CLASSNAME]: isActive,
            [AVAILABLE_FOR_SALE_CLASSNAME]: !isActive && isAvailableForSale,
            [NOT_AVAILABLE_FOR_SALE_CLASSNAME]: !isAvailableForSale
          }
        )}
        disabled={!isAvailableForSale}
        aria-disabled={!isAvailableForSale}
      >
        {value}
      </button>
    </CursorTrigger>
  )
}