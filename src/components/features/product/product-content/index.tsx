import { AddToCart } from "@/components/features/cart/add-to-cart";
import { Prose } from "@/components/ui/prose";
import type { Product } from "@/lib/integrations/shopify/types";

import { ProductHeading } from "../product-heading";
import { VariantSelector } from "../variant-selector";
import { ProductPrice } from "./product-price";

type ProductDescriptionProps = {
  product: Product
}

export function ProductContent({ product }: ProductDescriptionProps) {
  return (
    <div className="flex-1 flex flex-col justify-between pt-8">
      <ProductHeading product={product} />
      <div>
        <div className="mb-8">
          <ProductPrice product={product} />
          <VariantSelector
            options={product.options}
            variants={product.variants}
            category={product.category?.handle}
            productHandle={product.handle}
          />
        </div>
        {product.descriptionHtml ? (
          <Prose
            className="mb-6"
            html={product.descriptionHtml}
          />
        ) : null}
        <AddToCart product={product} />
      </div>
    </div>
  );
}
