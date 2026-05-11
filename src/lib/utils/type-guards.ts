/**
 * Type guard for plain object values. Excludes `null` and arrays so
 * callers can safely narrow `unknown` to `Record<string, unknown>` and
 * index its keys without further checks.
 *
 * @example
 * ```ts
 * function pluck(value: unknown) {
 *   if (!isObject(value)) return undefined
 *   return value.id // narrowed to unknown property access
 * }
 * ```
 */
export const isObject = (object: unknown): object is Record<string, unknown> => {
  return typeof object === 'object' && object !== null && !Array.isArray(object)
}
