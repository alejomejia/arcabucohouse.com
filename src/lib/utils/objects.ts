import { convertToCamelCase } from "./strings"

// =============================================================================
// ARRAY & OBJECT UTILITIES
// =============================================================================

export function checkIsArray<T>(value: T): T extends unknown[] ? T[0] : T {
  return (Array.isArray(value) ? value[0] : value) as T extends unknown[]
    ? T[0]
    : T
}

/**
 * Checks if an object is empty (has no enumerable properties).
 *
 * @param obj - Object to check
 * @returns True if object is empty or null/undefined
 *
 * @example
 * ```ts
 * isEmptyObject({})        // true
 * isEmptyObject({ a: 1 })  // false
 * isEmptyObject(null)      // true
 * ```
 */
export function isEmptyObject(obj: Record<string, unknown>) {
  if (!obj) return true
  return Object.keys(obj).length === 0
}

/**
 * Checks if an array is empty or if the input is not an array.
 *
 * @param arr - Array or value to check
 * @returns True if empty array or not an array
 *
 * @example
 * ```ts
 * isEmptyArray([])      // true
 * isEmptyArray([1, 2])  // false
 * isEmptyArray('test')  // true (not an array)
 * isEmptyArray(null)    // true
 * ```
 */
export function isEmptyArray(arr: string | unknown[]) {
  if (!arr) return true
  return Array.isArray(arr) && arr.length === 0
}

export function arraytoObject(array: Record<string, unknown>[]) {
  return array.reduce((acc, currentObj) => {
    const key = Object.keys(currentObj)[0]
    if (!key) return acc

    acc[key] = currentObj[key]
    return acc
  }, {})
}

export function shortenObjectKeys(
  obj: Record<string, unknown>,
  keyword: string
) {
  const regex = new RegExp(`[^]+${keyword}(.*)`)

  for (const key in obj) {
    const match = key.match(regex)

    if (match) {
      const newKey = convertToCamelCase(match[1] ?? '')
      obj[newKey] = obj[key]
      delete obj[key]
    }
  }

  return obj
}

export function filterObjectKeys(
  obj: { [x: string]: unknown },
  keyword: string
) {
  const newObj: { [x: string]: unknown } = {}

  for (const key in obj) {
    const match = key.includes(keyword)

    if (match) {
      newObj[key] = obj[key]
    }
  }

  return newObj
}