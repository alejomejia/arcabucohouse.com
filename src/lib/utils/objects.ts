import { convertToCamelCase } from "./strings"

// =============================================================================
// ARRAY & OBJECT UTILITIES
// =============================================================================

/**
 * Returns the first element if `value` is an array, otherwise returns
 * `value` unchanged. Useful when an API can return either a single item
 * or a collection and the caller wants the canonical "single" form.
 *
 * @example
 * ```ts
 * checkIsArray([{ id: 1 }, { id: 2 }]) // { id: 1 }
 * checkIsArray({ id: 1 })              // { id: 1 }
 * ```
 */
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

/**
 * Folds an array of single-key objects into one combined object. The
 * first key of each entry is used; entries with no enumerable keys are
 * skipped. Convenient for collapsing form-encoded `[{ a: 1 }, { b: 2 }]`
 * shapes into `{ a: 1, b: 2 }`.
 *
 * @example
 * ```ts
 * arraytoObject([{ a: 1 }, { b: 2 }]) // { a: 1, b: 2 }
 * ```
 */
export function arraytoObject(array: Record<string, unknown>[]) {
  return array.reduce((acc, currentObj) => {
    const key = Object.keys(currentObj)[0]
    if (!key) return acc

    acc[key] = currentObj[key]
    return acc
  }, {})
}

/**
 * **Mutates** `obj` in place: for every key that contains `keyword`,
 * replaces it with the camelCased remainder after the keyword. Returns
 * the same `obj` reference for chaining.
 *
 * Useful for trimming a common prefix from API field names
 * (e.g. `productTitle` → `title`).
 *
 * @example
 * ```ts
 * shortenObjectKeys({ productTitle: 'Rug', productPrice: 200 }, 'product')
 * // { title: 'Rug', price: 200 }
 * ```
 */
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

/**
 * Returns a new object containing only the entries whose keys include
 * `keyword`. Original object is not mutated.
 *
 * @example
 * ```ts
 * filterObjectKeys({ productTitle: 'Rug', userName: 'Ana' }, 'product')
 * // { productTitle: 'Rug' }
 * ```
 */
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