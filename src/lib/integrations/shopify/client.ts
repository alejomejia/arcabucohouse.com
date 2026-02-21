import { domain, SHOPIFY_GRAPHQL_API_ENDPOINT } from '@/lib/integrations/constants'
import { isShopifyError } from '@/lib/integrations/type-guards'
import { config } from '@/lib/utils/config'

const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`
const key = config.shopifyStorefrontAccessToken!

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never

/**
 * Executes a typed GraphQL request against the Shopify Storefront API.
 *
 * This helper centralizes all communication with Shopify by:
 * - Sending a POST request to the configured Storefront endpoint
 * - Attaching the required Storefront access token
 * - Passing the provided GraphQL query and optional variables
 * - Normalizing and re-throwing Shopify-specific errors
 *
 * @template T - The expected GraphQL response shape (usually a Shopify operation type).
 *
 * @param {Object} params - The request configuration object.
 * @param {HeadersInit} [params.headers] - Optional additional headers to merge with the default headers.
 * @param {string} params.query - The GraphQL query or mutation string to execute.
 * @param {ExtractVariables<T>} [params.variables] - Optional variables object matching the query's expected variables.
 *
 * @returns {Promise<{ status: number; body: T }>}
 * A promise resolving to an object containing:
 * - `status`: The HTTP response status code
 * - `body`: The parsed JSON response typed as `T`
 *
 * @throws Will throw:
 * - A normalized Shopify error object if the API responds with GraphQL errors
 * - A wrapped error object for unexpected or network failures
 *
 * @example
 * const response = await shopifyFetch<ShopifyProductOperation>({
 *   query: getProductQuery,
 *   variables: { handle: "my-product" }
 * });
 *
 * console.log(response.body.data.product);
 */
export async function shopifyFetch<T>({
  headers,
  query,
  variables
}: {
  headers?: HeadersInit
  query: string
  variables?: ExtractVariables<T>
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      })
    })

    const body = await result.json()

    if (body.errors) {
      throw body.errors[0]
    }

    return {
      status: result.status,
      body
    }
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query
      }
    }

    throw {
      error: e,
      query
    }
  }
}