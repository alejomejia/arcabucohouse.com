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

/**
 * Preloads an image by creating an Image element and setting its src.
 * This ensures the image is cached before it's needed, preventing flickering.
 * 
 * @param src - The image URL to preload
 * @returns Promise that resolves when the image is loaded, or rejects on error
 * 
 * @example
 * ```typescript
 * // Preload a single image
 * preloadImage('/path/to/image.jpg').then(() => {
 *   console.log('Image preloaded')
 * })
 * 
 * // Preload multiple images
 * Promise.all([
 *   preloadImage('/img1.jpg'),
 *   preloadImage('/img2.jpg')
 * ])
 * ```
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if image is already cached
    const img = new Image()
    
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`))
    img.src = src
  })
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