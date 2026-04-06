import { cn } from "@/lib/utils/helpers"

type SkeletonProps = {
  className?: string
}

const SKELETON_BASE_CLASSNAME = "w-full bg-zinc-200 animate-pulse"

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn(SKELETON_BASE_CLASSNAME, className)} />
}

type SkeletonTextProps = SkeletonProps & {
  linesCount: number
}

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