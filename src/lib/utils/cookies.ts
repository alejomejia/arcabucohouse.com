/**
 * Cookie utility functions for reading, writing, and deleting browser cookies.
 *
 * Handles encoding/decoding, expiration, and all standard cookie attributes.
 * Client-side only - requires browser environment.
 */

/**
 * Options for setting a cookie with standard browser cookie attributes.
 *
 * @property expires - Expiration date (overrides maxAge if both provided)
 * @property maxAge - Max age in seconds (alternative to expires)
 * @property path - Cookie path (default: '/')
 * @property domain - Cookie domain (default: current domain)
 * @property secure - Only send over HTTPS (default: false)
 * @property sameSite - SameSite policy: 'strict', 'lax', or 'none' (default: 'lax')
 */
export interface CookieOptions {
  expires?: Date
  maxAge?: number
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

/**
 * Retrieves a cookie value by name, decoding URL-encoded values.
 *
 * Returns undefined if cookie doesn't exist. Handles multiple cookies
 * with same prefix by matching exact name.
 *
 * @param name - Cookie name to retrieve
 * @returns Decoded cookie value or undefined if not found
 *
 * @example
 * ```ts
 * // Get a simple cookie
 * const userId = getCookie('userId')
 * // '12345'
 *
 * // Get a cookie that might not exist
 * const theme = getCookie('theme') ?? 'light'
 * ```
 */
export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') {
    return undefined
  }

  const cookies = document.cookie.split('; ')
  const cookie = cookies.find(c => {
    const [cookieName] = c.split('=')
    return cookieName === name
  })

  if (!cookie) {
    return undefined
  }

  const value = cookie.split('=').slice(1).join('=')
  return value ? decodeURIComponent(value) : undefined
}

/**
 * Sets a cookie with the specified name, value, and options.
 *
 * Automatically URL-encodes the value. Supports expiration, path, domain,
 * secure flag, and SameSite policy. If both expires and maxAge are provided,
 * expires takes precedence.
 *
 * @param name - Cookie name (will be trimmed)
 * @param value - Cookie value (will be URL-encoded)
 * @param options - Cookie configuration options
 *
 * @example
 * ```ts
 * // Simple cookie that expires when browser closes
 * setCookie('userId', '12345')
 *
 * // Cookie with expiration date
 * setCookie('session', 'abc123', {
 *   expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
 *   path: '/',
 *   secure: true
 * })
 *
 * // Cookie with maxAge (alternative to expires)
 * setCookie('preference', 'dark', {
 *   maxAge: 60 * 60 * 24, // 24 hours in seconds
 *   sameSite: 'strict'
 * })
 * ```
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  if (typeof document === 'undefined') {
    return
  }

  const encodedValue = encodeURIComponent(value)
  const parts: string[] = [`${name.trim()}=${encodedValue}`]

  // Expires takes precedence over maxAge
  if (options.expires) {
    parts.push(`Expires=${options.expires.toUTCString()}`)
  } else if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${options.maxAge}`)
  }

  if (options.path) {
    parts.push(`Path=${options.path}`)
  }

  if (options.domain) {
    parts.push(`Domain=${options.domain}`)
  }

  if (options.secure) {
    parts.push('Secure')
  }

  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1)}`)
  }

  document.cookie = parts.join('; ')
}

/**
 * Deletes a cookie by setting it to expire immediately.
 *
 * Uses the same path and domain as when the cookie was set (if known).
 * If the cookie was set with a specific path/domain, pass those same
 * options to ensure deletion.
 *
 * @param name - Cookie name to delete
 * @param options - Optional path and domain matching the original cookie
 *
 * @example
 * ```ts
 * // Delete a cookie at root path
 * deleteCookie('userId')
 *
 * // Delete a cookie with specific path
 * deleteCookie('session', { path: '/admin' })
 *
 * // Delete a cookie with path and domain
 * deleteCookie('preference', { path: '/', domain: '.example.com' })
 * ```
 */
export function deleteCookie(
  name: string,
  options: Pick<CookieOptions, 'path' | 'domain'> = {}
): void {
  setCookie(name, '', {
    ...options,
    expires: new Date(0),
  })
}
