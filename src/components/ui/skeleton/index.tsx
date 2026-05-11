import { cn } from "@/lib/utils/helpers"

import { SKELETON_BASE_CLASSNAME } from "./skeleton.const"

type SkeletonProps = {
  className?: string
}

/**
 * Pulsing rectangle placeholder for content that's still loading.
 * Compose by passing width/height utilities via `className`.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-8 w-40 rounded-full" />
 * ```
 */
export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn(SKELETON_BASE_CLASSNAME, className)} />
}

type SkeletonTextProps = SkeletonProps & {
  linesCount: number
}

/**
 * Vertical stack of skeleton rows with the last row shortened to suggest
 * the end of a paragraph. `className` styles each line.
 *
 * @example
 * ```tsx
 * <SkeletonText linesCount={4} />
 * ```
 */
export function SkeletonText({ linesCount, className }: SkeletonTextProps) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: linesCount }).map((_, index) => {
        return index === linesCount - 1 ? (
          <Skeleton key={index} className={cn("max-w-1/3 h-4", className)} />
        ) : (
          <Skeleton key={index} className={cn("h-4", className)} />
        )
      })}
    </div>
  )
}
