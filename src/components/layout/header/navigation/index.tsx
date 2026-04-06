import { Suspense } from 'react';

import { SHOPIFY_MENU_HANDLERS } from '@/lib/integrations/shopify/const';
import { getMenu } from '@/lib/integrations/shopify/menu';

import { NavigationOverlay } from './navigation-overlay';
import { OverlayContent } from './navigation-overlay/overlay-content';
import { OverlayImagePreloader } from './navigation-overlay/overlay-image-preloader';
import { NavigationToggle } from './navigation-toggle';

export async function Navigation() {
  const menu = await getMenu(SHOPIFY_MENU_HANDLERS.overlay)

  return (
    <>
      <OverlayImagePreloader />
      <NavigationToggle />
      <NavigationOverlay>
        <Suspense fallback={"Loading menu..."}>
          <OverlayContent menu={menu} />
        </Suspense>
      </NavigationOverlay>
    </>
  )
}

