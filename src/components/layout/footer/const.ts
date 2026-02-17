import { POLICIES_LINKS } from "@/lib/constants/links";

export const START_YEAR = 2025;

export const FOOTER_COLUMNS = [
  {
    title: "Products",
    links: [
      {
        id: "rugs",
        label: "Rugs",
        href: "/collections/rugs",
      },
      {
        id: "lights",
        label: "Lights",
        href: "/collections/lights",
      },
      {
        id: "ceramics",
        label: "Ceramics",
        href: "/collections/ceramics",
      },
      {
        id: "accessories",
        label: "Accessories",
        href: "/collections/accessories",
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

export const FOOTER_COLUMN_HEADING_CLASSNAME = "text-primary-100 text-sm uppercase font-sans font-semibold tracking-wider mb-6"
