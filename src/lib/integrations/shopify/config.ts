const SHOPIFY_CDN_BASE_URL = "https://cdn.shopify.com/s/files/1/0723/4578/0420/files/"

const menuItemTitles = ["default", "home", "rugs", "lights", "ceramics", "projects"] as const
type MenuItemTitle = (typeof menuItemTitles)[number]

export const OVERLAY_IMAGES_COLLECTION: Record<MenuItemTitle, string> = {
  default: `${SHOPIFY_CDN_BASE_URL}/menu-overlay-default.webp?v=1768813421`,
  home: `${SHOPIFY_CDN_BASE_URL}/menu-overlay-home.webp?v=1768813422`,
  rugs: `${SHOPIFY_CDN_BASE_URL}/menu-overlay-rugs.webp?v=1768813422`,
  lights: `${SHOPIFY_CDN_BASE_URL}/menu-overlay-lights.webp?v=1768813779`,
  ceramics: `${SHOPIFY_CDN_BASE_URL}/menu-overlay-ceramics.webp?v=1768813421`,
  projects: `${SHOPIFY_CDN_BASE_URL}/menu-overlay-projects.webp?v=1768813422`
}