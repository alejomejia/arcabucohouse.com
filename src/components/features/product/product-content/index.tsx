import { AddToCart } from "@/components/features/cart/add-to-cart";
import { Price } from "@/components/ui/price";
import { Prose } from "@/components/ui/prose";
import type { Product } from "@/lib/integrations/shopify/types";

import { ProductHeading } from "../product-heading";
import { VariantSelector } from "../variant-selector";

type ProductDescriptionProps = {
  product: Product
}

export function ProductContent({ product }: ProductDescriptionProps) {
  // Use the max variant price to display the product price
  const { amount, currencyCode } = product.priceRange.maxVariantPrice

  return (
    <div className="flex-1 flex flex-col justify-between pt-8">
      <ProductHeading product={product} />
      <div>
        <div className="mb-8">
          <div className="border-b border-neutral-200 py-4">
            <div className="flex items-center gap-4">
              <span className="basis-16 font-serif text-lg italic leading-none">
                Price
              </span>
              <Price className="text-xl" amount={amount} currencyCode={currencyCode} />
            </div>
          </div>
          <VariantSelector options={product.options} variants={product.variants} />
        </div>
        {product.descriptionHtml ? (
          <Prose
            className="mb-6 indent-[5vw]"
            html={product.descriptionHtml}
          />
        ) : null}
        <AddToCart product={product} />
      </div>
    </div>
  );
}
