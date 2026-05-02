'use client'

import { useEffect, useState } from 'react'

export const UNIT_SETS = {
  lighting: ['mm', 'in'],
  rug: ['cm', 'ft'],
} as const

export type UnitCategory = keyof typeof UNIT_SETS
export type Unit = typeof UNIT_SETS[UnitCategory][number]

const STORAGE_KEYS: Record<UnitCategory, string> = {
  lighting: 'preferred-unit-lighting',
  rug: 'preferred-unit-rug',
}

const DEFAULTS: Record<UnitCategory, Unit> = {
  lighting: 'mm',
  rug: 'cm',
}

function readStoredUnit(category: UnitCategory): Unit {
  const stored = localStorage.getItem(STORAGE_KEYS[category])
  const valid: readonly string[] = UNIT_SETS[category]
  return (stored && valid.includes(stored)) ? stored as Unit : DEFAULTS[category]
}

/**
 * Hook that manages the user's preferred measurement unit for a given product category.
 * Each category persists its preference independently in localStorage.
 *
 * @returns A tuple of the current unit, a setter, and the valid units for the category.
 */
export function useUnit(category: UnitCategory): [Unit, (unit: Unit) => void, readonly Unit[]] {
  const [unit, setUnit] = useState<Unit>(DEFAULTS[category])

  useEffect(() => {
    setUnit(readStoredUnit(category))
  }, [category])

  const updateUnit = (next: Unit) => {
    setUnit(next)
    localStorage.setItem(STORAGE_KEYS[category], next)
  }

  return [unit, updateUnit, UNIT_SETS[category]]
}
