import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { ProductProvider } from '@/components/features/product/context'
import { GridTileImage } from '@/components/from-template/grid/tile'
import { Container } from '@/components/ui/container'
import { getProduct, getProductRecommendations } from '@/lib/integrations/shopify/product'
import { generateProductBreadcrumbJsonLd, generateProductJsonLd, generateProductMetadata } from '@/lib/seo/metadata'

import { ProductSection } from './_sections/product'

type ProductHandleParams = Promise<{ handle: string }>

/**
 * Generate metadata for the product page
 * @param props - The props object containing the params
 * @returns The metadata for the product page
 */
export async function generateMetadata(props: { params: ProductHandleParams }): Promise<Metadata> {
  const params = await props.params
  const product = await getProduct(params.handle)

  if (!product) return notFound()

  return generateProductMetadata(product)
}

export default async function ProductPage(props: { params: ProductHandleParams }) {
  const params = await props.params
  const product = await getProduct(params.handle)

  if (!product) return notFound()

  const productJsonLd = generateProductJsonLd(product)
  const breadcrumbJsonLd = generateProductBreadcrumbJsonLd(product)

  return (
    <ProductProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Container>
        <ProductSection product={product} />

        <div className="min-h-screen bg-zinc-200">2</div>
        <div className="min-h-screen bg-zinc-300">1</div>
        <Suspense fallback={null}>
          <RelatedProducts id={product.id} />
        </Suspense>
      </Container>
    </ProductProvider>
  )
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id)

  if (!relatedProducts.length) return null

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((product) => (
          <li
            key={product.handle}
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <Link className="relative h-full w-full" href={`/product/${product.handle}`} prefetch={true}>
              <GridTileImage
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.priceRange.maxVariantPrice.amount,
                  currencyCode: product.priceRange.maxVariantPrice.currencyCode
                }}
                src={product.featuredImage?.url}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
