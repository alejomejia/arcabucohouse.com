import type { UpdateType } from "@/components/features/cart/types";
import type {
  Cart,
  CartItem,
  Product,
  ProductVariant,
} from "@/lib/integrations/shopify/types";

/**
 * Calculates the total cost for an item based on quantity and unit price.
 *
 * @param quantity - The quantity of items
 * @param price - The unit price as a string
 * @returns The total cost as a string
 */
export function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

/**
 * Updates a cart item's quantity or removes it based on the update type.
 *
 * @param item - The cart item to update
 * @param updateType - The type of update: "plus", "minus", or "delete"
 * @returns The updated cart item, or null if the item should be removed
 */
export function updateCartItem(
  item: CartItem,
  updateType: UpdateType,
): CartItem | null {
  if (updateType === "delete") return null;

  const newQuantity =
    updateType === "plus" ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
  const newTotalAmount = calculateItemCost(
    newQuantity,
    singleItemAmount.toString(),
  );

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: {
        ...item.cost.totalAmount,
        amount: newTotalAmount,
      },
    },
  };
}

/**
 * Creates a new cart item or updates an existing one by incrementing quantity.
 *
 * @param existingItem - The existing cart item if it already exists in the cart
 * @param variant - The product variant to add
 * @param product - The product information
 * @returns A cart item with the appropriate quantity and cost
 */
export function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product,
): CartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const totalAmount = calculateItemCost(quantity, variant.price.amount);

  return {
    id: existingItem?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
      },
    },
  };
}

/**
 * Calculates the total quantity and cost for all items in the cart.
 *
 * @param lines - Array of cart items
 * @returns An object containing totalQuantity and cost information
 */
export function updateCartTotals(
  lines: CartItem[],
): Pick<Cart, "totalQuantity" | "cost"> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0,
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "USD";

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

/**
 * Creates an empty cart with default values.
 *
 * @returns An empty cart object
 */
export function createEmptyCart(): Cart {
  return {
    id: undefined,
    checkoutUrl: "",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "USD" },
      totalAmount: { amount: "0", currencyCode: "USD" },
      totalTaxAmount: { amount: "0", currencyCode: "USD" },
    },
  };
}
