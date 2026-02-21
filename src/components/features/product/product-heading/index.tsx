import { UnderlineLink } from "@/components/effects/underline/underline-link";

import type { Product } from "@/lib/integrations/shopify/types";

type ProductHeadingProps = {
  product: Product
}

/**
 * Displays the heading section for a product page, including
 * category link, product title, and price.
 */
export function ProductHeading({ product }: ProductHeadingProps) {
  // Get the first collection if available
  const category = product.collections?.[0]
  const categoryTitle = category?.title
  const categoryPath = category?.path
  const productTitle = product.title

  return (
    <div className="flex flex-col">
      {categoryTitle && categoryPath && (
        <UnderlineLink href={categoryPath}>
          <span className="block text-3xl lg:text-base uppercase text-primary-base tracking-widest font-medium">
            {categoryTitle}
          </span>
        </UnderlineLink>
      )}
      <h1 className="block font-serif text-3xl pt-4 lg:text-6xl text-secondary-base italic text-pretty leading-none">
        {productTitle}
      </h1>
    </div>
  );
}