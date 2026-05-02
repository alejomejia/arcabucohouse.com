import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { ProductProvider } from '@/components/features/product/context'
import { Container } from '@/components/ui/container'
import { getProduct, getProductRecommendations } from '@/lib/integrations/shopify/product'
import { generateProductBreadcrumbJsonLd, generateProductJsonLd, generateProductMetadata } from '@/lib/seo/metadata'

import { ProductSection } from './_sections/product'
import { ProductDetailsTabs } from './_sections/product-details-tabs'
import { RelatedProductsCarousel } from './_sections/related-products'

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
        <ProductDetailsTabs product={product} />
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

  return <RelatedProductsCarousel products={relatedProducts} />
}
