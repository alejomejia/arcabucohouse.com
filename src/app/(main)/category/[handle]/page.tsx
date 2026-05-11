import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { Container } from '@/components/ui/container'
import { getCategory, getCollection } from '@/lib/integrations/shopify/collection'
import { generateCategoryBreadcrumbJsonLd, generateCategoryMetadata } from '@/lib/seo/metadata'

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
  const collectionHandle = 'category-' + params.handle

  const [category, collection] = await Promise.all([
    getCategory({ collection: collectionHandle, sortKey: "BEST_SELLING", reverse: false }),
    getCollection(collectionHandle),
  ])

  // For created categories, title is required
  if (!category?.title) return notFound()

  const breadcrumbJsonLd = collection ? generateCategoryBreadcrumbJsonLd(collection) : null

  return (
    <>
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <div className="min-h-screen">
        <div className="pt-24 pb-16 bg-zinc-200">
          <Container>
            <Suspense fallback={<CategoryHeadingSkeleton />}>
              <CategoryHeading category={category} />
            </Suspense>
          </Container>
        </div>
        <Suspense fallback={null}>
          <Container>
            <CategoryProducts products={category.products} />
          </Container>
        </Suspense>
      </div>
    </>
  )

}
