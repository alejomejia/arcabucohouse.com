import type { ButtonHTMLAttributes } from "react"

import { FOCUS_RING_ON_DARK_BG } from "@/lib/styles/const"
import { cn } from "@/lib/utils/helpers"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "block w-full px-4 py-5",
        "text-center text-sm uppercase font-semibold tracking-wider text-zinc-100",
        "bg-zinc-800 opacity-80 hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-opacity duration-300 ease-in-out",
        FOCUS_RING_ON_DARK_BG
      )}
      {...props}
    >
      {children}
    </button>
  )
}