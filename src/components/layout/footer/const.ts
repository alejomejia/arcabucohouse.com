import { POLICIES_LINKS } from "@/lib/constants/links";

export const START_YEAR = 2025;

export const FOOTER_COLUMNS = [
  {
    title: "Products",
    links: [
      {
        id: "rugs",
        label: "Rugs",
        href: "/category/rugs",
      },
      {
        id: "lighting",
        label: "Lighting",
        href: "/category/lighting",
      },
    ]
  },
  {
    title: "Support",
    links: [...POLICIES_LINKS]
  },
  {
    title: "Socials",
    links: [
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
      {
        id: "linkedin",
        label: "LinkedIn",
        href: "#",
      },
    ]
  },
]

export const FOOTER_COLUMN_HEADING_CLASSNAME = "text-zinc-200 text-base uppercase font-semibold tracking-wider mb-4"
