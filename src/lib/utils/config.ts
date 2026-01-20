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
  // MAILCHIMP
  mailchimpApiKey: process.env.MAILCHIMP_API_KEY,
  mailchimpServerPrefix: process.env.MAILCHIMP_SERVER_PREFIX,
  mailchimpAudienceId: process.env.MAILCHIMP_AUDIENCE_ID,
  // ANALYTICS
  umamiWebsiteId: process.env.UMAMI_WEBSITE_ID,
}

export const isDev = config.env === "development";
export const isProd = config.env === "production";

export const SOCIAL_LINKS = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/arcabuco.house/",
  },
  {
    id: "pinterest",
    label: "Pinterest",
    href: "https://www.pinterest.com/arcabucohouse/",
  },
]

export const POLICIES_LINKS = [
  {
    id: "shipping",
    label: "Shipping",
    href: "/shipping-policy",
  },
  {
    id: "privacy",
    label: "Privacy",
    href: "/privacy-policy",
  },
  {
    id: "terms",
    label: "Terms",
    href: "/terms-of-service",
  }
]