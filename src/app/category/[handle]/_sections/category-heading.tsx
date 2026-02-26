import type { ReactNode } from "react"

import { Grid } from "@/components/ui/grid"
import { Skeleton, SkeletonText } from "@/components/ui/skeleton"
import type { Category } from "@/lib/integrations/shopify/types"

type CategoryShellProps = {
  titleSlot: ReactNode
  descriptionSlot: ReactNode
}

function CategoryShell({ titleSlot, descriptionSlot }: CategoryShellProps) {
  return (
    <Grid className="py-8 lg:py-12">
      <div className="mb-4 col-span-full lg:col-span-6">
        {titleSlot}
      </div>
      <div className="col-span-full lg:col-start-9 lg:-col-end-1">
        {descriptionSlot}
      </div>
    </Grid>
  )
}

type CategoryHeadingProps = {
  category: Category
}

export function CategoryHeading({ category }: CategoryHeadingProps) {
  const { title, description } = category

  return (
    <CategoryShell
      titleSlot={
        <h1 className="block font-serif text-4xl md:text-5xl lg:text-6xl text-secondary-base italic text-pretty leading-none">
          {title}
        </h1>
      }
      descriptionSlot={
        <p className="indent-[5vw] font-serif text-xl text-primary-base">{description}</p>
      }
    />
  )
}

export function CategoryHeadingSkeleton() {
  return (
    <CategoryShell
      titleSlot={<Skeleton className="max-w-48 h-15" />}
      descriptionSlot={<SkeletonText linesCount={4} />}
    />
  )
}