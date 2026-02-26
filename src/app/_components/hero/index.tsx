import { DataBoundary } from "@/components/ui/data-boundary";
import { ProductsCarousel } from "@/components/ui/products-carousel";
import { getCollectionProducts } from "@/lib/integrations/shopify/collection";

import { getMenu } from "@/lib/integrations/shopify/menu";
import { Error } from "./error";
import { HeroFooter } from "./footer";
import { HeroHeader } from "./header";
import { Loading } from "./loading";

/**
 * @TODO: Check loading state component and improve the UI
 * @TODO: Check error state component and improve the UI
 */

export async function HeroSection() {
  const categoriesMenu = await getMenu("categories-menu")
  const featuredProducts = await getCollectionProducts({
    collection: "hidden-homepage-featured-products",
  });

  return (
    <section className="pt-16 min-h-dvh flex flex-col items-center justify-end">
      <div className="grow flex flex-col justify-center">
        <HeroHeader />
        <DataBoundary
          name="home-products-carousel"
          loading={<Loading />}
          error={Error}
        >
          <ProductsCarousel products={featuredProducts} />
        </DataBoundary>
      </div>
      <DataBoundary
        name="home-hero-footer"
        loading={null}
        error={Error}>
        <HeroFooter categories={categoriesMenu} />
      </DataBoundary>
    </section>
  );
}
