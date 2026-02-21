import { Suspense } from "react";

import { ProductContent } from "@/components/features/product/product-content";
import { ProductContentSkeleton } from "@/components/features/product/product-content/skeleton";
import { ProductGallery } from "@/components/features/product/product-gallery";
import { Grid } from "@/components/ui/grid";
import { Image, Product } from "@/lib/integrations/shopify/types";

type ProductSectionProps = {
  product: Product
}

export function ProductSection({ product }: ProductSectionProps) {
  const galleryImages = product.images.map((image: Image) => ({
    src: image.url,
    altText: image.altText
  }))

  return (
    <div className="min-h-screen">
      <Grid>
        <div className="col-span-8">
          <div className="min-h-screen sticky top-0 flex flex-col pt-16 pb-6">
            <Suspense fallback={<ProductContentSkeleton />}>
              <ProductContent product={product} />
            </Suspense>
          </div>
        </div>
        <div className="col-start-10 col-end-25 pt-16">
          <Suspense fallback={null}>
            <ProductGallery images={galleryImages} />
          </Suspense>
        </div>
      </Grid>
    </div>
  )
}