import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { Container } from '@/components/ui/container'
import { getCategory, getCollection } from '@/lib/integrations/shopify/collection'
import { generateCategoryMetadata } from '@/lib/seo/metadata'

import { CategoryHeading, CategoryHeadingSkeleton } from './_sections/category-heading'
import { CategoryProducts } from './_sections/category-products'

type CategoryHandleParams = Promise<{ handle: string }>

/**
 * Generate metadata for the category page
 * @param props - The props object containing the params
 * @returns The metadata for the product page
 */
export async function generateMetadata(props: { params: CategoryHandleParams }): Promise<Metadata> {
  const params = await props.params
  const category = await getCollection('category-' + params.handle)

  if (!category) return notFound()

  return generateCategoryMetadata(category)
}

export default async function CategoryPage(props: { params: CategoryHandleParams }) {
  const params = await props.params
  const category = await getCategory({ collection: 'category-' + params.handle, sortKey: "BEST_SELLING", reverse: false })

  // For created categories, title is required
  if (!category?.title) return notFound()

  return (
    <Container className="pt-24 pb-16">
      <div className="min-h-screen">
        <Suspense fallback={<CategoryHeadingSkeleton />}>
          <CategoryHeading category={category} />
        </Suspense>
        <Suspense fallback={null}>
          <CategoryProducts products={category.products} />
        </Suspense>
      </div>
    </Container>
  )

}
