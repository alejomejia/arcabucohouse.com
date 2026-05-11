import type { ButtonHTMLAttributes } from "react"

import type { LinkProps } from "@/components/ui/link"

export type UnderlineButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** When true, the custom cursor is not used on hover (default: false). */
  disableCursor?: boolean
}

export type UnderlineLinkProps = LinkProps & {
  /** When true, the custom cursor is not used on hover (default: false). */
  disableCursor?: boolean
}
