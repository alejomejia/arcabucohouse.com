/**
 * Generates a random integer between `min` and `max`, both inclusive.
 *
 * @param min - Minimum value (inclusive).
 * @param max - Maximum value (inclusive).
 * @returns Random integer in `[min, max]`.
 *
 * @example
 * ```ts
 * getRandomNumber(10, 20) // e.g. 14
 * ```
 */
export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}