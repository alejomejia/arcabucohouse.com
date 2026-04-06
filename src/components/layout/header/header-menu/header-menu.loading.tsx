import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/helpers";

export function HeaderMenuLoading() {
  const SKELETON_COUNT = 4;

  return (
    <div className={cn(
      "flex flex-col gap-4 md:gap-2 justify-center items-center",
      "md:flex-row md:gap-4"
    )}>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <Skeleton key={i} className="max-w-26 h-4" />
      ))}
    </div>
  )
}