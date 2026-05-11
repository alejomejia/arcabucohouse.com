import { Container } from '@/components/ui/container'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Route-segment skeleton shown while the category page's data fetches.
 * Mirrors the heading band + product grid layout so the eventual content
 * lands in place without a perceptible reflow.
 */
export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="pt-24 pb-16 bg-zinc-200">
        <Container>
          <Skeleton className="h-12 w-64 bg-zinc-300" aria-hidden />
        </Container>
      </div>
      <Container>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-8 py-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-4/5 h-auto" aria-hidden />
          ))}
        </div>
      </Container>
    </div>
  )
}
