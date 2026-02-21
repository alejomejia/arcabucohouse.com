import type {
  CartItem,
  Image,
  Money,
  Product,
  ProductVariant,
} from './types'

/**
 * Deep partial type that makes all nested properties optional.
 */
type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

/**
 * Creates a mock Money object for testing.
 * @param overrides - Optional partial Money object to override default values
 * @returns A mock Money object
 */
export function createMockMoney(overrides?: Partial<Money>): Money {
  return {
    amount: '29.99',
    currencyCode: 'USD',
    ...overrides,
  }
}

/**
 * Creates a mock Image object for testing.
 * @param overrides - Optional partial Image object to override default values
 * @returns A mock Image object
 */
export function createMockImage(overrides?: Partial<Image>): Image {
  return {
    url: 'https://example.com/image.jpg',
    altText: 'Test image',
    width: 100,
    height: 100,
    ...overrides,
  }
}

/**
 * Creates a mock ProductVariant object for testing.
 * @param overrides - Optional partial ProductVariant object to override default values
 * @returns A mock ProductVariant object
 */
export function createMockVariant(
  overrides?: Partial<ProductVariant>
): ProductVariant {
  return {
    id: 'variant-1',
    title: 'Default Title',
    availableForSale: true,
    selectedOptions: [
      { name: 'Size', value: 'M' },
      { name: 'Color', value: 'Black' },
    ],
    price: createMockMoney(),
    ...overrides,
  }
}

/**
 * Creates a mock Product object for testing.
 * @param overrides - Optional partial Product object to override default values
 * @returns A mock Product object
 */
export function createMockProduct(overrides?: Partial<Product>): Product {
  const defaultVariant = createMockVariant()
  return {
    id: 'product-1',
    handle: 'test-product',
    title: 'Test Product',
    description: 'Test description',
    descriptionHtml: '<p>Test description</p>',
    availableForSale: true,
    featuredImage: createMockImage(),
    variants: [defaultVariant],
    images: [],
    options: [],
    priceRange: {
      maxVariantPrice: defaultVariant.price,
      minVariantPrice: defaultVariant.price,
    },
    collections: [],
    seo: {
      title: 'Test Product',
      description: 'Test description',
    },
    tags: [],
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Creates a mock CartItem object for testing.
 * @param overrides - Optional deep partial CartItem object to override default values
 * @returns A mock CartItem object
 */
export function createMockCartItem(
  overrides?: DeepPartial<CartItem>
): CartItem {
  const defaultItem: CartItem = {
    id: 'cart-item-1',
    quantity: 1,
    cost: {
      totalAmount: createMockMoney(),
    },
    merchandise: {
      id: 'merchandise-1',
      title: 'Test Product - Size M',
      selectedOptions: [
        { name: 'Size', value: 'M' },
        { name: 'Color', value: 'Black' },
      ],
      product: {
        id: 'product-1',
        handle: 'test-product',
        title: 'Test Product',
        featuredImage: createMockImage(),
      },
    },
  }

  if (!overrides) {
    return defaultItem
  }

  return {
    ...defaultItem,
    ...overrides,
    cost: overrides.cost
      ? {
          ...defaultItem.cost,
          ...overrides.cost,
          totalAmount: overrides.cost.totalAmount
            ? { ...defaultItem.cost.totalAmount, ...overrides.cost.totalAmount }
            : defaultItem.cost.totalAmount,
        }
      : defaultItem.cost,
    merchandise: overrides.merchandise
      ? {
          ...defaultItem.merchandise,
          ...overrides.merchandise,
          selectedOptions:
            overrides.merchandise.selectedOptions !== undefined
              ? (overrides.merchandise.selectedOptions as Array<{
                  name: string
                  value: string
                }>)
              : defaultItem.merchandise.selectedOptions,
          product: overrides.merchandise.product
            ? {
                ...defaultItem.merchandise.product,
                ...overrides.merchandise.product,
                featuredImage: overrides.merchandise.product.featuredImage
                  ? {
                      ...defaultItem.merchandise.product.featuredImage,
                      ...overrides.merchandise.product.featuredImage,
                    }
                  : defaultItem.merchandise.product.featuredImage,
              }
            : defaultItem.merchandise.product,
        }
      : defaultItem.merchandise,
  }
}
