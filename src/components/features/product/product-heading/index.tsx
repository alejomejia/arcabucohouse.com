import { UnderlineLink } from "@/components/effects/underline/underline-link";
import { Text } from "@/components/ui/text";

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
  const categoryPath = category?.path.replace("category-", "")
  const productTitle = product.title

  return (
    <div className="flex flex-col gap-4">
      {categoryTitle && categoryPath && (
        <UnderlineLink href={categoryPath} className="text-zinc-500">
          <Text preset="eyebrow">
            {categoryTitle}
          </Text>
        </UnderlineLink>
      )}
      <Text preset="h1">{productTitle}</Text>
    </div>
  );
}