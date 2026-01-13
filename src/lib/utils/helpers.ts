import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges multiple class values into a single string of class names and removes duplicates.
 * @param inputs - The class values to merge
 * @returns The merged class names
 * @example
 * ```typescript
 * const className = cn('text-red-500', 'bg-blue-500', 'font-bold')
 * // Returns: 'text-red-500 bg-blue-500 font-bold'
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
