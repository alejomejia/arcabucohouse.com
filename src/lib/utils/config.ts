export const config = {
  env: process.env.NODE_ENV,
  // CORE
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  siteName: process.env.SITE_NAME,
  // SHOPIFY
  shopifyStoreDomain: process.env.SHOPIFY_STORE_DOMAIN,
  shopifyStorefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_API_TOKEN,
  shopifyRevalidationSecret: process.env.SHOPIFY_REVALIDATION_SECRET,
  shopifyCustomerAccountApiToken: process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_TOKEN,
  shopifyCdnBaseUrl: process.env.NEXT_PUBLIC_SHOPIFY_CDN_BASE_URL,
  // MAILCHIMP
  mailchimpApiKey: process.env.MAILCHIMP_API_KEY,
  mailchimpServerPrefix: process.env.MAILCHIMP_SERVER_PREFIX,
  mailchimpAudienceId: process.env.MAILCHIMP_AUDIENCE_ID,
  // ANALYTICS
  umamiWebsiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
}

export const isDev = config.env === "development";
export const isProd = config.env === "production";

/**
 * Required environment variables for the application to function properly
 */
export const REQUIRED_ENV_VARS = [
  'SITE_NAME',
  'NEXT_PUBLIC_BASE_URL',
  'SHOPIFY_STORE_DOMAIN',
  'SHOPIFY_STOREFRONT_ACCESS_API_TOKEN',
  'SHOPIFY_REVALIDATION_SECRET',
  'SHOPIFY_CUSTOMER_ACCOUNT_API_TOKEN',
  'MAILCHIMP_API_KEY',
  'MAILCHIMP_SERVER_PREFIX',
  'MAILCHIMP_AUDIENCE_ID',
] as const;

/**
 * Result of environment variable validation
 */
export interface EnvValidationResult {
  /** Whether all required environment variables are present */
  isValid: boolean;
  /** List of missing environment variable names */
  missing: string[];
  /** List of present environment variable names */
  present: string[];
}

/**
 * Validates that all required environment variables are present.
 * Returns a result object with validation status and missing variables.
 *
 * @returns Validation result object
 *
 * @example
 * ```ts
 * const result = validateRequiredEnvVars()
 * if (!result.isValid) {
 *   console.error('Missing env vars:', result.missing)
 * }
 * ```
 */
export function validateRequiredEnvVars(): EnvValidationResult {
  const missing: string[] = [];
  const present: string[] = [];

  REQUIRED_ENV_VARS.forEach((envVar) => {
    const value = process.env[envVar];
    if (!value || value.trim() === '') {
      missing.push(envVar);
    } else {
      present.push(envVar);
    }
  });

  return {
    isValid: missing.length === 0,
    missing,
    present,
  };
}

/**
 * Validates required environment variables and throws an error if any are missing.
 * Use this function at application startup or in critical paths where missing
 * environment variables would cause the application to fail.
 *
 * @throws {Error} If any required environment variables are missing
 *
 * @example
 * ```ts
 * // At the top of a critical file or in a startup script
 * assertRequiredEnvVars()
 * ```
 */
export function assertRequiredEnvVars(): void {
  const result = validateRequiredEnvVars();

  if (!result.isValid) {
    const errorMessage = [
      'Missing required environment variables:',
      ...result.missing.map((varName) => `  - ${varName}`),
      '',
      'Please ensure all required environment variables are set in your environment.',
    ].join('\n');

    throw new Error(errorMessage);
  }
}