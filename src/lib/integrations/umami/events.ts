import { trackEvent } from "./track";

export const EVENTS = {
  PRODUCT_CLICK: "product_click",
  VARIANT_CLICK: "variant_click",
  CART_ADD: "cart_add",
  CART_OPEN: "cart_open",
  CHECKOUT_BEGIN: "checkout_begin",
  NEWSLETTER_SUBSCRIBE: "newsletter_subscribe",
} as const;

type ProductClickProps = {
  handle: string;
  title: string;
  price?: string;
  currency?: string;
};

type VariantClickProps = {
  handle: string;
  optionName: string;
  value: string;
  available: boolean;
};

type CartAddProps = {
  handle: string;
  title: string;
  variantId: string;
  variantTitle: string;
  price: string;
  currency: string;
  quantity: number;
};

type CartOpenProps = {
  itemCount: number;
  cartTotal: string;
  currency: string;
};

type CheckoutBeginProps = CartOpenProps;

type NewsletterSubscribeProps = {
  source: string;
};

export const trackProductClick = (props: ProductClickProps) =>
  trackEvent(EVENTS.PRODUCT_CLICK, props);

export const trackVariantClick = (props: VariantClickProps) =>
  trackEvent(EVENTS.VARIANT_CLICK, props);

export const trackCartAdd = (props: CartAddProps) =>
  trackEvent(EVENTS.CART_ADD, props);

export const trackCartOpen = (props: CartOpenProps) =>
  trackEvent(EVENTS.CART_OPEN, props);

export const trackCheckoutBegin = (props: CheckoutBeginProps) =>
  trackEvent(EVENTS.CHECKOUT_BEGIN, props);

export const trackNewsletterSubscribe = (props: NewsletterSubscribeProps) =>
  trackEvent(EVENTS.NEWSLETTER_SUBSCRIBE, props);
