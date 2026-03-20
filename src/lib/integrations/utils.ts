import { ReadonlyURLSearchParams } from 'next/navigation'
import { config } from '../utils/config'

export const baseUrl = config.baseUrl ?? 'http://localhost:3000'

/**
 * True on any non-production deployment (e.g. dev.arcabucohouse.com, localhost).
 * Used to block crawlers and hide sitemaps until the production site is live.
 *
 * Set NEXT_PUBLIC_BASE_URL=https://arcabucohouse.com in the production Coolify instance
 * and NEXT_PUBLIC_BASE_URL=https://dev.arcabucohouse.com in the dev instance.
 */
export const isDevEnvironment = !baseUrl.includes('arcabucohouse.com') || baseUrl.includes('dev.')

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString()
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`

  return `${pathname}${queryString}`
}

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = ['SHOPIFY_STORE_DOMAIN', 'SHOPIFY_STOREFRONT_ACCESS_API_TOKEN']
  const missingEnvironmentVariables = [] as string[]

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar)
    }
  })

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        '\n'
      )}\n`
    )
  }

  if (process.env.SHOPIFY_STORE_DOMAIN?.includes('[') || process.env.SHOPIFY_STORE_DOMAIN?.includes(']')) {
    throw new Error(
      'Your `SHOPIFY_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them.'
    )
  }
}
