"use client"

import { UnderlineButton } from "@/components/effects/underline/underline-button";
import type { ErrorBoundaryProps } from "@/components/ui/data-boundary";
import { cn } from "@/lib/utils/helpers";

export function HeaderCategoriesError({ error, reset }: ErrorBoundaryProps) {
  return (
    <div
      className={cn(
        "w-fit mx-auto flex items-center justify-center gap-4",
        "px-8 py-2 bg-neutral-900",
      )}
    >
      <span className="text-sm font-sans text-neutral-400">
        Categories unavailable
      </span>
      <UnderlineButton type="button" onClick={reset}>
        <span className="text-sm leading-none">Try again</span>
      </UnderlineButton>
    </div>
  )
}
