import { DataBoundary } from "@/components/ui/data-boundary";
import { getCollectionProducts } from "@/lib/integrations/shopify/collection";

import { Error } from "./error";
import { HeroHeader } from "./header";
import { Loading } from "./loading";
import { ProductsCarousel } from "./products-carousel";

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
          <ProductsCarousel products={featuredProducts} />
        </DataBoundary>
      </div>
    </section>
  );
}
