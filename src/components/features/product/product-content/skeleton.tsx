import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export function ProductContentSkeleton() {
  return (
    <div className="flex-1 h-full flex flex-col justify-between pt-8 pb-6">
      <div className="flex flex-col gap-3">
        <ProductHeadingSkeleton />
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3 mb-3">
          <ProductDataSkeleton />
        </div>
        <ProductDescriptionSkeleton />
        <ProductAddToCartSkeleton />
      </div>
    </div>
  );
}

function ProductHeadingSkeleton() {
  return (
    <>
      <Skeleton className="max-w-24 h-6" />
      <Skeleton className="max-w-96 h-12" />
    </>
  )
}

function ProductDataSkeleton() {
  const amountOfLines = 3;

  return Array.from({ length: amountOfLines }).map((_, index) => (
    <Skeleton key={index} className="h-12" />
  ))
}

function ProductDescriptionSkeleton() {
  return <SkeletonText linesCount={7} />
}

function ProductAddToCartSkeleton() {
  return <Skeleton className="h-14" />
}