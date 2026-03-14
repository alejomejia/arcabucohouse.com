import { DataBoundary } from "@/components/ui/data-boundary"
import { getMenu } from "@/lib/integrations/shopify/menu"
import { HeaderCategories, HeaderCategoriesError, HeaderCategoriesLoading } from "./header-categories"
import { OverlayTopText } from "./navigation/navigation-overlay/overlay-top-text"

/** Intermediate container for header middle content: 
 * ScrollProgressBar and OverlayTopText
 **/
export async function HeaderMiddle() {
  const categoriesMenu = await getMenu("categories-menu")

  return (
    <>
      <div className="relative z-5 w-full mx-auto">
        <DataBoundary
          name="header-categories"
          loading={<HeaderCategoriesLoading />}
          error={HeaderCategoriesError}>
          <HeaderCategories categories={categoriesMenu} />
        </DataBoundary>
      </div>
      <div className="absolute hidden md:block">
        <OverlayTopText />
      </div>
    </>
  )
}