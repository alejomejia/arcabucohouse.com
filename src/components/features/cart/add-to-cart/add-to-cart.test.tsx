import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'

import { createMockProduct, createMockVariant } from '@/lib/integrations/shopify/test-helpers'

type ChildrenProps = {
  children: ReactNode
}

// Mock functions
const mockAddCartItem = jest.fn()
const mockUpdateCartItem = jest.fn()
const mockFormAction = jest.fn()
const mockUpdateOption = jest.fn()
const mockUpdateImage = jest.fn()

// Controlled state for useProduct mock
let mockProductState: Record<string, string> = {}

// Mock cart context
jest.mock('../context', () => ({
  CartProvider: ({ children }: ChildrenProps) => children,
}))

// Mock useCart hook
jest.mock('../hooks/use-cart', () => ({
  useCart: jest.fn(() => ({
    cart: null,
    addCartItem: mockAddCartItem,
    updateCartItem: mockUpdateCartItem,
  })),
}))

// Mock product context
jest.mock('@/components/features/product/product-context', () => ({
  useProduct: jest.fn(() => ({
    state: mockProductState,
    updateOption: mockUpdateOption,
    updateImage: mockUpdateImage,
  })),
  ProductProvider: ({ children }: ChildrenProps) => children,
}))

// Mock useActionState from React
let mockMessage: string | null = null
jest.mock('react', () => {
  const actual = jest.requireActual('react')
  return {
    ...actual,
    useActionState: jest.fn(() => [mockMessage, mockFormAction]),
  }
})

// Mock server actions
jest.mock('@/components/features/cart/server/actions', () => ({
  addItem: jest.fn(),
}))

// Import after mocks are set up
import { AddToCart } from './index'

// =============================================================================
// Test Helpers
// =============================================================================

function setProductState(state: Record<string, string>) {
  mockProductState = state
}

function setActionMessage(message: string | null) {
  mockMessage = message
  // Re-mock useActionState with the new message
  const { useActionState } = require('react')
  useActionState.mockReturnValue([message, mockFormAction])
}

// =============================================================================
// Test Suite
// =============================================================================

describe('<AddToCart />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockProductState = {}
    mockMessage = null
    // Reset the useActionState mock to return null message
    const { useActionState } = require('react')
    useActionState.mockReturnValue([null, mockFormAction])
  })

  describe('Single variant product', () => {
    it('automatically selects the variant and enables the submit button', () => {
      const product = createMockProduct({
        variants: [createMockVariant({ id: 'single-variant-1' })],
      })

      render(<AddToCart product={product} />)

      const submitButton = screen.getByRole('button', { name: /add to cart/i })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).not.toBeDisabled()
    })

    it('calls addCartItem with the correct variant when form is submitted', async () => {
      const user = userEvent.setup()
      const product = createMockProduct({
        variants: [createMockVariant({ id: 'single-variant-1' })],
      })

      render(<AddToCart product={product} />)

      const submitButton = screen.getByRole('button', { name: /add to cart/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockAddCartItem).toHaveBeenCalledWith(
          expect.objectContaining({ id: 'single-variant-1' }),
          product
        )
      })
    })
  })

  describe('Multi-variant product', () => {
    it('disables submit button when no variant is selected', () => {
      const product = createMockProduct({
        variants: [
          createMockVariant({
            id: 'variant-1',
            selectedOptions: [
              { name: 'Size', value: 'M' },
              { name: 'Color', value: 'Black' },
            ],
          }),
          createMockVariant({
            id: 'variant-2',
            selectedOptions: [
              { name: 'Size', value: 'L' },
              { name: 'Color', value: 'Black' },
            ],
          }),
        ],
      })

      render(<AddToCart product={product} />)

      const submitButton = screen.getByRole('button', { name: /select an option/i })
      expect(submitButton).toBeDisabled()
    })

    it('enables submit button when matching variant is selected', () => {
      setProductState({ size: 'M', color: 'Black' })

      const product = createMockProduct({
        variants: [
          createMockVariant({
            id: 'variant-1',
            selectedOptions: [
              { name: 'Size', value: 'M' },
              { name: 'Color', value: 'Black' },
            ],
          }),
          createMockVariant({
            id: 'variant-2',
            selectedOptions: [
              { name: 'Size', value: 'L' },
              { name: 'Color', value: 'Black' },
            ],
          }),
        ],
      })

      render(<AddToCart product={product} />)

      const submitButton = screen.getByRole('button', { name: /add to cart/i })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).not.toBeDisabled()
    })

    it('calls addCartItem with the correct variant when matching options are selected', async () => {
      const user = userEvent.setup()
      setProductState({ size: 'M', color: 'Black' })

      const product = createMockProduct({
        variants: [
          createMockVariant({
            id: 'variant-1',
            selectedOptions: [
              { name: 'Size', value: 'M' },
              { name: 'Color', value: 'Black' },
            ],
          }),
          createMockVariant({
            id: 'variant-2',
            selectedOptions: [
              { name: 'Size', value: 'L' },
              { name: 'Color', value: 'Black' },
            ],
          }),
        ],
      })

      render(<AddToCart product={product} />)

      const submitButton = screen.getByRole('button', { name: /add to cart/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockAddCartItem).toHaveBeenCalledWith(
          expect.objectContaining({ id: 'variant-1' }),
          product
        )
      })
    })
  })

  describe('Out of stock product', () => {
    it('disables submit button and shows out of stock message', () => {
      const product = createMockProduct({
        availableForSale: false,
        variants: [createMockVariant()],
      })

      render(<AddToCart product={product} />)

      const submitButton = screen.getByRole('button', { name: /out of stock/i })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
      expect(screen.getByText(/out of stock/i)).toBeInTheDocument()
    })
  })

  describe('Form submission', () => {
    it('calls server action with selected variant ID', async () => {
      const user = userEvent.setup()
      const product = createMockProduct({
        variants: [createMockVariant({ id: 'variant-123' })],
      })

      render(<AddToCart product={product} />)

      const submitButton = screen.getByRole('button', { name: /add to cart/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockAddCartItem).toHaveBeenCalled()
        expect(mockFormAction).toHaveBeenCalled()
      })
    })

    it('displays form submission status message', () => {
      setActionMessage('Item added successfully')

      const product = createMockProduct({
        variants: [createMockVariant()],
      })

      render(<AddToCart product={product} />)

      // Query by aria-live attribute since we're using <p aria-live="polite">
      const statusMessage = screen.getByText('Item added successfully')
      expect(statusMessage).toBeInTheDocument()
      expect(statusMessage).toHaveAttribute('aria-live', 'polite')
      expect(statusMessage).toHaveClass('sr-only')
    })

    it('displays error message when server action fails', () => {
      setActionMessage('Error adding item to cart')

      const product = createMockProduct({
        variants: [createMockVariant()],
      })

      render(<AddToCart product={product} />)

      const statusMessage = screen.getByText('Error adding item to cart')
      expect(statusMessage).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Variant selection logic', () => {
    it('matches variant by all selected options', () => {
      setProductState({ size: 'M', color: 'Black' })

      const product = createMockProduct({
        variants: [
          createMockVariant({
            id: 'variant-1',
            selectedOptions: [
              { name: 'Size', value: 'M' },
              { name: 'Color', value: 'Black' },
            ],
          }),
          createMockVariant({
            id: 'variant-2',
            selectedOptions: [
              { name: 'Size', value: 'L' },
              { name: 'Color', value: 'Black' },
            ],
          }),
        ],
      })

      render(<AddToCart product={product} />)

      const submitButton = screen.getByRole('button', { name: /add to cart/i })
      expect(submitButton).not.toBeDisabled()
    })

    it('does not match variant when options do not fully match', () => {
      // Only one option matches, missing color - needs multiple variants to prevent auto-select
      setProductState({ size: 'M' })

      const product = createMockProduct({
        variants: [
          createMockVariant({
            id: 'variant-1',
            selectedOptions: [
              { name: 'Size', value: 'M' },
              { name: 'Color', value: 'Black' },
            ],
          }),
          createMockVariant({
            id: 'variant-2',
            selectedOptions: [
              { name: 'Size', value: 'L' },
              { name: 'Color', value: 'Black' },
            ],
          }),
        ],
      })

      render(<AddToCart product={product} />)

      const submitButton = screen.getByRole('button', { name: /select an option/i })
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('has proper aria-live region for status updates', () => {
      const product = createMockProduct({
        variants: [createMockVariant()],
      })

      render(<AddToCart product={product} />)

      // Find the status region by its aria-live attribute
      const statusRegion = document.querySelector('[aria-live="polite"]')
      expect(statusRegion).toBeInTheDocument()
      expect(statusRegion).toHaveClass('sr-only')
    })

    it('provides accessible button labels for all states', () => {
      const product = createMockProduct({
        variants: [createMockVariant()],
      })

      const { unmount } = render(<AddToCart product={product} />)

      // Enabled state
      expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument()

      unmount()

      // Test out of stock state
      render(<AddToCart product={{ ...product, availableForSale: false }} />)

      expect(screen.getByRole('button', { name: /out of stock/i })).toBeInTheDocument()
    })
  })
})
