import { domain, SHOPIFY_GRAPHQL_API_ENDPOINT } from '@/lib/integrations/constants'
import { isShopifyError } from '@/lib/integrations/type-guards'
import { config } from '@/lib/utils/config'
import { fetchWithTimeout } from '@/lib/utils/fetch'

const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`
const key = config.shopifyStorefrontAccessToken!

/**
 * Retry policy
 * - `MAX_ATTEMPTS = 3` → up to 2 retries on top of the first attempt.
 * - Backoff: `BASE_DELAY_MS * 2^(attempt-1)` plus 0–100ms jitter, capped at
 *   `MAX_DELAY_MS`. Worst-case total backoff is ~950ms, keeping retry
 *   wall-clock under ~1s so SSR TTFB stays predictable.
 * - `PER_ATTEMPT_TIMEOUT_MS` aborts a single hung request and lets the
 *   next attempt proceed.
 */
const MAX_ATTEMPTS = 3
const BASE_DELAY_MS = 250
const MAX_DELAY_MS = 1_000
const PER_ATTEMPT_TIMEOUT_MS = 8_000

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never

/** Marker thrown internally so `withRetry` can recognise 5xx/429 responses. */
class RetryableHTTPError extends Error {
  constructor(public status: number, public retryAfter?: number) {
    super(`Retryable HTTP ${status}`)
    this.name = 'RetryableHTTPError'
  }
}

/**
 * Detects GraphQL mutations so they can bypass the retry wrapper. Cart
 * mutations (line adds, checkout transitions) aren't idempotent — a
 * retried mutation can double-add cart lines or fire a webhook twice.
 */
function isMutation(query: string): boolean {
  return /^\s*(?:#[^\n]*\n\s*)*mutation\b/.test(query)
}

function isRetryable(err: unknown): boolean {
  if (err instanceof RetryableHTTPError) return true
  // fetchWithTimeout surfaces aborts as AbortError; network failures (DNS,
  // socket hangup, etc.) come through as TypeError.
  if (err instanceof Error) {
    return err.name === 'AbortError' || err.name === 'TypeError'
  }
  return false
}

function computeDelay(err: unknown, attempt: number): number {
  if (err instanceof RetryableHTTPError && err.retryAfter !== undefined) {
    return Math.min(err.retryAfter * 1000, MAX_DELAY_MS)
  }
  const exp = BASE_DELAY_MS * Math.pow(2, attempt - 1)
  const jitter = Math.random() * 100
  return Math.min(exp + jitter, MAX_DELAY_MS)
}

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined
  const seconds = Number(value)
  return Number.isFinite(seconds) ? seconds : undefined
}

async function withRetry<T>(fn: () => Promise<T>, opts: { isRead: boolean }): Promise<T> {
  if (!opts.isRead) return fn()

  let lastErr: unknown
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (attempt === MAX_ATTEMPTS || !isRetryable(err)) throw err
      const delay = computeDelay(err, attempt)
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(`[shopifyFetch] retry attempt ${attempt}/${MAX_ATTEMPTS - 1} in ${delay}ms`, err)
      }
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  throw lastErr
}

/**
 * Executes a typed GraphQL request against the Shopify Storefront API.
 *
 * Centralizes communication with Shopify by:
 * - Sending a POST request to the configured Storefront endpoint
 * - Attaching the required Storefront access token
 * - Passing the provided GraphQL query and optional variables
 * - Normalizing and re-throwing Shopify-specific errors
 *
 * **Retry policy** ({@link withRetry}):
 * - **Reads** (`query` operations) are retried up to 2 times on transient
 *   failures: network errors, HTTP 5xx, HTTP 429 (with `Retry-After`).
 * - **Mutations** (`mutation` operations) bypass retry — they aren't
 *   guaranteed idempotent and a retried mutation can double-add cart
 *   lines or fire a webhook twice.
 * - Other 4xx responses (caller bugs: bad query, auth, schema mismatch)
 *   are not retried.
 * - GraphQL-level errors (HTTP 200 with `body.errors`) are not retried
 *   either — they're application-level, not transient.
 *
 * When multiple GraphQL errors come back, the thrown error's message
 * surfaces the count: `"First message (and 3 other GraphQL errors)"`.
 *
 * @template T - The expected GraphQL response shape (usually a Shopify operation type).
 * @param params - Request configuration.
 * @returns Object containing the HTTP status and parsed JSON body typed as `T`.
 * @throws A normalized Shopify error object on GraphQL/network failure.
 *
 * @example
 * ```ts
 * const response = await shopifyFetch<ShopifyProductOperation>({
 *   query: getProductQuery,
 *   variables: { handle: "my-product" }
 * })
 *
 * console.log(response.body.data.product)
 * ```
 */
export async function shopifyFetch<T>({
  headers,
  query,
  variables,
}: {
  headers?: HeadersInit
  query: string
  variables?: ExtractVariables<T>
}): Promise<{ status: number; body: T } | never> {
  const isRead = !isMutation(query)

  try {
    return await withRetry(async () => {
      try {
        const result = await fetchWithTimeout(endpoint, {
          method: 'POST',
          timeout: PER_ATTEMPT_TIMEOUT_MS,
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': key,
            ...headers,
          },
          body: JSON.stringify({
            ...(query && { query }),
            ...(variables && { variables }),
          }),
        })

        // Map transport-level failures to a typed marker so `withRetry`
        // recognises them; only reads retry, mutations rethrow as-is below.
        if (result.status === 429) {
          throw new RetryableHTTPError(429, parseRetryAfter(result.headers.get('Retry-After')))
        }
        if (result.status >= 500 && result.status < 600) {
          throw new RetryableHTTPError(result.status)
        }

        const body = await result.json()

        if (body.errors) {
          const [first, ...rest] = body.errors
          throw {
            ...first,
            message: rest.length
              ? `${first.message} (and ${rest.length} other GraphQL error${rest.length === 1 ? '' : 's'})`
              : first.message,
            errorsCount: body.errors.length,
          }
        }

        return { status: result.status, body }
      } catch (e) {
        // Let `withRetry` see these; do not wrap into the Shopify error
        // envelope until retries have been exhausted.
        if (e instanceof RetryableHTTPError) throw e
        if (e instanceof Error && (e.name === 'AbortError' || e.name === 'TypeError')) throw e

        // GraphQL / unknown — wrap into Shopify-style envelope and rethrow
        // (these are non-retryable application errors).
        if (isShopifyError(e)) {
          throw {
            cause: e.cause?.toString() || 'unknown',
            status: e.status || 500,
            message: e.message,
            query,
          }
        }
        throw { error: e, query }
      }
    }, { isRead })
  } catch (e) {
    // Retries exhausted: convert the still-typed retryable error into the
    // Shopify-style envelope callers expect.
    if (e instanceof RetryableHTTPError) {
      throw {
        cause: `http_${e.status}`,
        status: e.status,
        message: `Shopify request failed after ${MAX_ATTEMPTS} attempts: HTTP ${e.status}`,
        query,
      }
    }
    if (e instanceof Error && (e.name === 'AbortError' || e.name === 'TypeError')) {
      throw {
        cause: e.name,
        status: 500,
        message: `Shopify request failed after ${MAX_ATTEMPTS} attempts: ${e.message}`,
        query,
      }
    }
    throw e
  }
}
