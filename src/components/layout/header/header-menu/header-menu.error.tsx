"use client"

import { UnderlineButton } from "@/components/effects/underline/underline-button";
import type { ErrorBoundaryProps } from "@/components/ui/data-boundary";
import { cn } from "@/lib/utils/helpers";

export function HeaderMenuError({ error, reset }: ErrorBoundaryProps) {
  return (
    <div
      className={cn(
        "w-fit mx-auto flex items-center justify-center gap-4",
        "px-8 py-2 bg-zinc-900",
      )}
    >
      <span className="text-sm text-zinc-500">
        Menu unavailable
      </span>
      <UnderlineButton type="button" onClick={reset}>
        <span className="text-sm leading-none">Try again</span>
      </UnderlineButton>
    </div>
  )
}
