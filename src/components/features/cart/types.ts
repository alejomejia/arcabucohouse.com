import type { Cart, Product, ProductVariant } from "@/lib/integrations/shopify/types";

const UPDATE_TYPES = ["plus", "minus", "delete"] as const;

/**
 * Type representing the different ways to update a cart item quantity.
 */
export type UpdateType = (typeof UPDATE_TYPES)[number];

/**
 * Update type excluding the "delete" option.
 *
 * Used for quantity increment/decrement operations only.
 */
export type UpdateTypeWithoutDelete = Exclude<UpdateType, "delete">;

/**
 * Action to update an existing cart item's quantity or remove it.
 */
export type UpdateItemAction = {
  type: "UPDATE_ITEM";
  payload: { merchandiseId: string; updateType: UpdateType };
};

/**
 * Action to add a new item to the cart or increment quantity if it already exists.
 */
export type AddItemAction = {
  type: "ADD_ITEM";
  payload: { variant: ProductVariant; product: Product };
};

/**
 * Union type representing all possible cart actions.
 */
export type CartAction = UpdateItemAction | AddItemAction;

/**
 * Type definition for the cart context value.
 */
export type CartContextType = {
  cartPromise: Promise<Cart | undefined>;
};
