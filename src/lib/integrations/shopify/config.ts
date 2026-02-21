import { config } from "@/lib/utils/config";

const menuItemTitles = ["default", "home", "rugs", "lights", "ceramics", "projects"] as const
type MenuItemTitle = (typeof menuItemTitles)[number]

export const OVERLAY_IMAGES_SHAPE: Record<MenuItemTitle, string> = {
  default: `${config.shopifyCdnBaseUrl}/menu-overlay-default.webp`,
  home: `${config.shopifyCdnBaseUrl}/menu-overlay-home.webp`,
  rugs: `${config.shopifyCdnBaseUrl}/menu-overlay-rugs.webp`,
  lights: `${config.shopifyCdnBaseUrl}/menu-overlay-lights.webp`,
  ceramics: `${config.shopifyCdnBaseUrl}/menu-overlay-ceramics.webp`,
  projects: `${config.shopifyCdnBaseUrl}/menu-overlay-projects.webp`
}

export const SHOPIFY_CDN_ASSETS = {
  /* Vector assets */
  VECTOR_COLOMBIA: `${config.shopifyCdnBaseUrl}/vector-colombia.svg`,
  VECTOR_SOUTH_AMERICA: `${config.shopifyCdnBaseUrl}/vector-south-america.svg`,
}