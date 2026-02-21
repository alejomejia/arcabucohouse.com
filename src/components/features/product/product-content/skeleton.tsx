import { Skeleton } from "@/components/ui/skeleton";

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
        <div className="flex flex-col gap-3">
          <ProductDescriptionSkeleton />
        </div>
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
  const amountOfLines = 7;

  return Array.from({ length: amountOfLines }).map((_, index) => {
    return index === amountOfLines - 1 ? (
      <Skeleton key={index} className="max-w-1/3 h-4" />
    ) : (
      <Skeleton key={index} className="h-4" />
    )
  })
}

function ProductAddToCartSkeleton() {
  return <Skeleton className="h-14" />
}