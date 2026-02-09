/**
 * Generates a random number between a minimum and maximum value.
 *
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random number
 */
export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}