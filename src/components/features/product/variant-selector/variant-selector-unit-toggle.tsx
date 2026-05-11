import { cn } from '@/lib/utils/helpers'

import { type Unit } from '@/lib/hooks/use-unit'

type UnitToggleProps = {
  unit: Unit
  units: readonly Unit[]
  onChange: (unit: Unit) => void
}

const OPTION_BASE = 'px-1.5 py-0.5 text-[10px] font-semibold tracking-widest uppercase transition-colors duration-200'
const OPTION_ACTIVE = 'text-zinc-900'
const OPTION_INACTIVE = 'text-zinc-400 hover:text-zinc-600'

export function UnitToggle({ unit, units, onChange }: UnitToggleProps) {
  return (
    <div
      className="inline-flex items-center border border-zinc-200 divide-x divide-zinc-200 overflow-hidden"
      role="group"
      aria-label="Measurement unit"
    >
      {units.map((option) => (
        <button
          key={option}
          type="button"
          className={cn(OPTION_BASE, unit === option ? OPTION_ACTIVE : OPTION_INACTIVE)}
          onClick={() => onChange(option)}
          aria-pressed={unit === option}
          // Server renders with the default unit; client immediately reflects localStorage
          // — suppress the expected mismatch on this element only.
          suppressHydrationWarning
        >
          {option}
        </button>
      ))}
    </div>
  )
}
