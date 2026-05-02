import type { ProductOption } from "@/lib/integrations/shopify/types"
import { cn } from "@/lib/utils/helpers"

import { CURSOR_MEDIUM, CURSOR_SMALL } from "@/components/effects/cursor/cursor-states"
import { CursorTrigger } from "@/components/effects/cursor/cursor-trigger"
import { useProduct } from "@/components/features/product/hooks/use-product"
import { useUpdateURL } from "@/components/features/product/hooks/use-update-url"
import type { Unit } from "@/lib/hooks/use-unit"

import { Combination } from "./helpers"

const ACTIVE_CLASSNAME = "bg-zinc-900 text-zinc-100 border-zinc-900"
const AVAILABLE_FOR_SALE_CLASSNAME = "text-zinc-500 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900"
const NOT_AVAILABLE_FOR_SALE_CLASSNAME = "bg-zinc-200 text-zinc-400 border-zinc-200"

const MM_TO_IN = 25.4
const CM_TO_FT = 30.48

/**
 * Formats a raw option value string for display in the chosen unit.
 * Handles compound dimension strings such as "200 x 100" by converting
 * each numeric segment independently and rejoining with " x ".
 *
 * Lighting values are stored in mm (converts to in).
 * Rug values are stored in cm (converts to ft).
 *
 * @param raw  - The original option value in its native unit.
 * @param unit - Target unit for display.
 */
function formatValue(raw: string, unit: Unit): string {
  if (unit === 'mm' || unit === 'cm') return raw

  const divisor = unit === 'in' ? MM_TO_IN : CM_TO_FT
  return raw
    .split(' ')
    .map((v: string) => isNaN(Number(v)) ? v : (Number(v) / divisor).toFixed(1).replace(/\.0$/, ''))
    .join(' ')
}

type VariantSelectorOptionProps = {
  option: ProductOption
  options: ProductOption[]
  value: string
  combinations: Combination[]
  /** Active measurement unit; when provided numeric values are formatted accordingly. */
  unit?: Unit
}

/**
 * VariantSelectorOption component that allows the user to select a variant of the product.
 *
 * @param option       - The product option.
 * @param options      - The product options.
 * @param value        - The raw value of the option (always in mm for dimension options).
 * @param combinations - The combinations of the product variants.
 * @param unit         - Measurement unit used to format numeric dimension values.
 * @returns The VariantSelectorOption component.
 */
export function VariantSelectorOption({ option, options, value, combinations, unit = 'mm' }: VariantSelectorOptionProps) {
  const { state, updateOption, removeOption } = useProduct()
  const updateURL = useUpdateURL()

  const optionNameLowerCase = option.name.toLowerCase()
  const isActive = state[optionNameLowerCase] === value

  const formAction = () => {
    if (isActive) {
      const newState = removeOption(optionNameLowerCase)
      updateURL(newState)
      return
    }

    const newState = updateOption(optionNameLowerCase, value)
    updateURL(newState)
  }

  // Base option params on current selectedOptions so we can preserve any other param state.
  const optionParams = { ...state, [optionNameLowerCase]: value }

  // Filter out invalid options and check if the option combination is available for sale.
  const filtered = Object.entries(optionParams).filter(([key, value]) =>
    options.find((option) => option.name.toLowerCase() === key && option.values.includes(value))
  )

  const isAvailableForSale = combinations.find((combination) =>
    filtered.every(([key, value]) => combination[key] === value && combination.availableForSale)
  )

  const displayValue = formatValue(value, unit)
  const title = `${option.name} ${displayValue}${!isAvailableForSale ? ' [Out of Stock]' : ''}`

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
        // Server renders with the default unit; client immediately reflects localStorage 
        // — suppress the expected mismatch on this element only.
        suppressHydrationWarning
      >
        {displayValue}
      </button>
    </CursorTrigger>
  )
}