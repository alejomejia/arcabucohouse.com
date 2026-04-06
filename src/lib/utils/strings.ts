/**
 * String & Object Utilities
 *
 * Helper functions for string manipulation, object operations, and refs.
 */


// =============================================================================
// STRING UTILITIES
// =============================================================================

/**
 * Converts text to URL-friendly slug format.
 *
 * @param text - Text to convert (must have toString method)
 * @returns URL-safe slug string
 *
 * @example
 * ```ts
 * slugify('Hello World!') // 'hello-world'
 * slugify('Café & Restaurant') // 'cafe-restaurant'
 * ```
 */
export function slugify(text: { toString: () => string }) {
  return text
    .toString()
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

/**
 * Converts first character to lowercase (camelCase format).
 *
 * @param inputString - String to convert
 * @returns String with lowercase first character
 *
 * @example
 * ```ts
 * convertToCamelCase('HelloWorld') // 'helloWorld'
 * ```
 */
export function convertToCamelCase(inputString: string) {
  return inputString.charAt(0).toLowerCase() + inputString.slice(1)
}

/**
 * Capitalizes the first letter of a string.
 *
 * @param inputString - String to capitalize
 * @returns String with capitalized first letter
 *
 * @example
 * ```ts
 * capitalizeFirstLetter('hello') // 'Hello'
 * capitalizeFirstLetter('world') // 'World'
 * ```
 */
export function capitalizeFirstLetter(inputString: string) {
  return inputString.charAt(0).toUpperCase() + inputString.slice(1)
}

/**
 * Formats a number as a two-digit string (padding with zero).
 *
 * @param number - Number to format
 * @returns Two-digit string representation
 *
 * @example
 * ```ts
 * twoDigits(5)  // '05'
 * twoDigits(23) // '23'
 * ```
 */
export function twoDigits(number: number) {
  return number > 9 ? `${number}` : `0${number}`
}

/**
 * Adds commas as thousands separators to numbers.
 *
 * @param x - Number to format (must have toString method)
 * @returns String with comma separators
 *
 * @example
 * ```ts
 * numberWithCommas(1234)     // '1,234'
 * numberWithCommas(1234567)  // '1,234,567'
 * ```
 */
export function numberWithCommas(x: { toString: () => string }) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Ensures a string starts with the specified prefix.
 *
 * @param stringToCheck - String to check and modify if needed
 * @param startsWith - Prefix that the string should start with
 * @returns String that starts with the specified prefix
 *
 * @example
 * ```ts
 * ensureStartsWith('world', '/')  // '/world'
 * ensureStartsWith('/world', '/') // '/world'
 * ```
 */
export const ensureStartsWith = (stringToCheck: string, startsWith: string) => {
  return stringToCheck.startsWith(startsWith) ? stringToCheck : `${startsWith}${stringToCheck}`
}

/**
 * Pluralizes a word based on the count.
 * @param count - The count of the word
 * @param singular - The singular form of the word
 * @param plural - The plural form of the word
 * @returns The pluralized word
 */

type PluralizeProps = {
  count: number;
  singular: string;
  plural?: string;
}

export const pluralize = ({count, singular, plural }: PluralizeProps) => {
  if (count === 1) return singular

  return plural ?? `${singular}s`;
};
