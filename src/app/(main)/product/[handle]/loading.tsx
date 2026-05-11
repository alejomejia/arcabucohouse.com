import { Container } from '@/components/ui/container'
import { Skeleton, SkeletonText } from '@/components/ui/skeleton'

/**
 * Route-segment skeleton shown while the product page's data fetches.
 * Mirrors the gallery + details column layout so the eventual content
 * lands in place without a perceptible reflow.
 */
export default function Loading() {
  return (
    <Container>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 pt-24 pb-16">
        <Skeleton className="aspect-4/5 h-auto" aria-hidden />
        <div className="flex flex-col gap-6">
          <SkeletonText linesCount={2} className="h-8" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-12 w-full" />
          <SkeletonText linesCount={5} />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
    </Container>
  )
}
