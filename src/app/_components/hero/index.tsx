import { DataBoundary } from "@/components/ui/data-boundary";
import { ProductSlider } from "@/components/ui/product-slider/product-slider";
import { ProductSliderHeading } from "@/components/ui/product-slider/product-slider-heading";
import { ProductSliderPagination } from "@/components/ui/product-slider/product-slider-pagination";
import { ProductSliderSlide } from "@/components/ui/product-slider/product-slider-slide";
import { ProductSliderViewport } from "@/components/ui/product-slider/product-slider-viewport";
import { getCollectionProducts } from "@/lib/integrations/shopify/collection";

import { Error } from "./error";
import { HeroHeader } from "./header";
import { Loading } from "./loading";

/**
 * @TODO: Check loading state component and improve the UI
 * @TODO: Check error state component and improve the UI
 */

export async function HeroSection() {
  const featuredProducts = await getCollectionProducts({
    collection: "hidden-homepage-featured-products",
  });

  return (
    <section className="pt-16 pb-8 min-h-screen flex flex-col items-center justify-end max-w-screen">
      <div className="grow flex flex-col justify-end w-full">
        <HeroHeader />
        <DataBoundary
          name="home-products-carousel"
          loading={<Loading />}
          error={Error}
        >
          <ProductSlider
            products={featuredProducts}
            className="font-serif text-primary-base w-full"
          >
            <ProductSliderHeading />
            <ProductSliderViewport>
              {featuredProducts.map((product, i) => (
                <ProductSliderSlide
                  key={product.handle}
                  index={i}
                  href={`/product/${product.handle}`}
                  imageSrc={product.images[0]?.url}
                  imageAlt={product.title}
                />
              ))}
            </ProductSliderViewport>
            <ProductSliderPagination />
          </ProductSlider>
        </DataBoundary>
      </div>
    </section>
  );
}
