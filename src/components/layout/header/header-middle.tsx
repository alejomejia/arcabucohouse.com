import { DataBoundary } from "@/components/ui/data-boundary"
import { SHOPIFY_MENU_HANDLERS } from "@/lib/integrations/shopify/const"
import { getMenu } from "@/lib/integrations/shopify/menu"
import { HeaderMenu, HeaderMenuError, HeaderMenuLoading } from "./header-menu"

/** Intermediate container for header middle content: 
 * ScrollProgressBar and OverlayTopText
 **/
export async function HeaderMiddle() {
  const categoriesMenu = await getMenu(SHOPIFY_MENU_HANDLERS.main)

  return (
    <>
      <div className="relative z-5 w-full mx-auto">
        <DataBoundary
          name="header-categories"
          loading={<HeaderMenuLoading />}
          error={HeaderMenuError}>
          <HeaderMenu menu={categoriesMenu} />
        </DataBoundary>
      </div>
    </>
  )
}