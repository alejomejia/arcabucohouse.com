import { cn } from "@/lib/utils/helpers"

type SkeletonProps = {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("w-full bg-primary-100 animate-pulse", className)} />
}