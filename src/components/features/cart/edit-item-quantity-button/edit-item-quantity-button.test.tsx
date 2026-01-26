import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { createMockCartItem } from '@/lib/integrations/shopify/test-helpers'

// Mock functions
const mockOptimisticUpdateAction = jest.fn()
const mockFormAction = jest.fn()

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
  updateItemQuantity: jest.fn(),
}))

// Import after mocks are set up
import { EditItemQuantityButton } from './index'

// =============================================================================
// Test Helpers
// =============================================================================

function setActionMessage(message: string | null) {
  mockMessage = message
  // Re-mock useActionState with the new message
  const { useActionState } = require('react')
  useActionState.mockReturnValue([message, mockFormAction])
}

// =============================================================================
// Test Suite
// =============================================================================

describe('<EditItemQuantityButton />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMessage = null
    // Reset the useActionState mock to return null message
    const { useActionState } = require('react')
    useActionState.mockReturnValue([null, mockFormAction])
  })

  describe('Increment quantity (plus)', () => {
    it('renders the plus button with correct aria-label', () => {
      const item = createMockCartItem({ quantity: 2 })

      render(
        <EditItemQuantityButton
          item={item}
          type="plus"
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button = screen.getByRole('button', { name: /increase item quantity/i })
      expect(button).toBeInTheDocument()
    })

    it('calls optimisticUpdateAction with correct merchandiseId and "plus" when clicked', async () => {
      const user = userEvent.setup()
      const item = createMockCartItem({
        merchandise: { id: 'merchandise-123' },
        quantity: 1,
      })

      render(
        <EditItemQuantityButton
          item={item}
          type="plus"
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button = screen.getByRole('button', { name: /increase item quantity/i })
      await user.click(button)

      await waitFor(() => {
        expect(mockOptimisticUpdateAction).toHaveBeenCalledWith(
          'merchandise-123',
          'plus'
        )
      })
    })

    it('calls the server action with incremented quantity when form is submitted', async () => {
      const user = userEvent.setup()
      const item = createMockCartItem({
        merchandise: { id: 'merchandise-456' },
        quantity: 3,
      })

      render(
        <EditItemQuantityButton
          item={item}
          type="plus"
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button = screen.getByRole('button', { name: /increase item quantity/i })
      await user.click(button)

      await waitFor(() => {
        expect(mockFormAction).toHaveBeenCalled()
      })
    })

    it('calculates correct quantity for increment (current + 1)', async () => {
      const user = userEvent.setup()
      const item = createMockCartItem({
        merchandise: { id: 'merchandise-789' },
        quantity: 5,
      })

      const boundAction = jest.fn()
      const { useActionState } = require('react')
      useActionState.mockReturnValue([null, boundAction])

      render(
        <EditItemQuantityButton
          item={item}
          type="plus"
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button = screen.getByRole('button', { name: /increase item quantity/i })
      await user.click(button)

      await waitFor(() => {
        // Verify the bound action was called with payload containing quantity: 6 (5 + 1)
        expect(boundAction).toHaveBeenCalled()
        expect(mockOptimisticUpdateAction).toHaveBeenCalledWith(
          'merchandise-789',
          'plus'
        )
      })
    })
  })

  describe('Decrement quantity (minus)', () => {
    it('renders the minus button with correct aria-label', () => {
      const item = createMockCartItem({ quantity: 2 })

      render(
        <EditItemQuantityButton
          item={item}
          type="minus"
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button = screen.getByRole('button', { name: /reduce item quantity/i })
      expect(button).toBeInTheDocument()
    })

    it('calls optimisticUpdateAction with correct merchandiseId and "minus" when clicked', async () => {
      const user = userEvent.setup()
      const item = createMockCartItem({
        merchandise: { id: 'merchandise-321' },
        quantity: 3,
      })

      render(
        <EditItemQuantityButton
          item={item}
          type="minus"
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button = screen.getByRole('button', { name: /reduce item quantity/i })
      await user.click(button)

      await waitFor(() => {
        expect(mockOptimisticUpdateAction).toHaveBeenCalledWith(
          'merchandise-321',
          'minus'
        )
      })
    })

    it('calls the server action with decremented quantity when form is submitted', async () => {
      const user = userEvent.setup()
      const item = createMockCartItem({
        merchandise: { id: 'merchandise-654' },
        quantity: 4,
      })

      render(
        <EditItemQuantityButton
          item={item}
          type="minus"
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button = screen.getByRole('button', { name: /reduce item quantity/i })
      await user.click(button)

      await waitFor(() => {
        expect(mockFormAction).toHaveBeenCalled()
      })
    })

    it('calculates correct quantity for decrement (current - 1)', async () => {
      const user = userEvent.setup()
      const item = createMockCartItem({
        merchandise: { id: 'merchandise-987' },
        quantity: 7,
      })

      const boundAction = jest.fn()
      const { useActionState } = require('react')
      useActionState.mockReturnValue([null, boundAction])

      render(
        <EditItemQuantityButton
          item={item}
          type="minus"
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button = screen.getByRole('button', { name: /reduce item quantity/i })
      await user.click(button)

      await waitFor(() => {
        // Verify the bound action was called with payload containing quantity: 6 (7 - 1)
        expect(boundAction).toHaveBeenCalled()
        expect(mockOptimisticUpdateAction).toHaveBeenCalledWith(
          'merchandise-987',
          'minus'
        )
      })
    })
  })

  describe('Form submission', () => {
    it('calls optimisticUpdateAction before server action', async () => {
      const user = userEvent.setup()
      const item = createMockCartItem({
        merchandise: { id: 'merchandise-submit' },
        quantity: 2,
      })

      // Track call order
      const callOrder: string[] = []
      mockOptimisticUpdateAction.mockImplementation(() => {
        callOrder.push('optimistic')
      })
      mockFormAction.mockImplementation(() => {
        callOrder.push('server')
      })

      render(
        <EditItemQuantityButton
          item={item}
          type="plus"
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button = screen.getByRole('button', { name: /increase item quantity/i })
      await user.click(button)

      await waitFor(() => {
        expect(mockOptimisticUpdateAction).toHaveBeenCalled()
        expect(mockFormAction).toHaveBeenCalled()
      })
    })

    it('displays success message when server action succeeds', () => {
      setActionMessage('Quantity updated successfully')

      const item = createMockCartItem()

      render(
        <EditItemQuantityButton
          item={item}
          type="plus"
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const statusMessage = screen.getByText('Quantity updated successfully')
      expect(statusMessage).toBeInTheDocument()
      expect(statusMessage).toHaveAttribute('aria-live', 'polite')
      expect(statusMessage).toHaveClass('sr-only')
    })

    it('displays error message when server action fails', () => {
      setActionMessage('Error updating item quantity')

      const item = createMockCartItem()

      render(
        <EditItemQuantityButton
          item={item}
          type="minus"
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const statusMessage = screen.getByText('Error updating item quantity')
      expect(statusMessage).toBeInTheDocument()
      expect(statusMessage).toHaveAttribute('aria-live', 'polite')
      expect(statusMessage).toHaveClass('sr-only')
    })

    it('handles multiple sequential updates', async () => {
      const user = userEvent.setup()

      const item = createMockCartItem({
        id: 'cart-item-1',
        merchandise: { id: 'merchandise-1' },
        quantity: 1,
      })

      const { rerender } = render(
        <EditItemQuantityButton
          item={item}
          type="plus"
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button1 = screen.getByRole('button', { name: /increase item quantity/i })
      await user.click(button1)

      await waitFor(() => {
        expect(mockOptimisticUpdateAction).toHaveBeenCalledWith(
          'merchandise-1',
          'plus'
        )
      })

      // Clear mocks for second update
      mockOptimisticUpdateAction.mockClear()
      mockFormAction.mockClear()

      // Second update (decrement)
      const updatedItem = createMockCartItem({
        id: 'cart-item-1',
        merchandise: { id: 'merchandise-1' },
        quantity: 2,
      })

      rerender(
        <EditItemQuantityButton
          item={updatedItem}
          type="minus"
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button2 = screen.getByRole('button', { name: /reduce item quantity/i })
      await user.click(button2)

      await waitFor(() => {
        expect(mockOptimisticUpdateAction).toHaveBeenCalledWith(
          'merchandise-1',
          'minus'
        )
        expect(mockFormAction).toHaveBeenCalled()
      })
    })
  })

  describe('Edge cases', () => {
    it('handles quantity of 1 when decrementing', async () => {
      const user = userEvent.setup()
      const item = createMockCartItem({
        merchandise: { id: 'merchandise-single' },
        quantity: 1,
      })

      render(
        <EditItemQuantityButton
          item={item}
          type="minus"
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button = screen.getByRole('button', { name: /reduce item quantity/i })
      await user.click(button)

      await waitFor(() => {
        expect(mockOptimisticUpdateAction).toHaveBeenCalledWith(
          'merchandise-single',
          'minus'
        )
        expect(mockFormAction).toHaveBeenCalled()
      })
    })

    it('handles large quantities correctly', async () => {
      const user = userEvent.setup()
      const item = createMockCartItem({
        merchandise: { id: 'merchandise-large' },
        quantity: 100,
      })

      render(
        <EditItemQuantityButton
          item={item}
          type="plus"
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button = screen.getByRole('button', { name: /increase item quantity/i })
      await user.click(button)

      await waitFor(() => {
        expect(mockOptimisticUpdateAction).toHaveBeenCalledWith(
          'merchandise-large',
          'plus'
        )
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper aria-live region for status updates', () => {
      const item = createMockCartItem()

      render(
        <EditItemQuantityButton
          item={item}
          type="plus"
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const statusRegion = document.querySelector('[aria-live="polite"]')
      expect(statusRegion).toBeInTheDocument()
      expect(statusRegion).toHaveClass('sr-only')
    })

    it('provides accessible button labels for both increment and decrement', () => {
      const item = createMockCartItem()

      const { rerender } = render(
        <EditItemQuantityButton
          item={item}
          type="plus"
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      // Plus button
      expect(
        screen.getByRole('button', { name: /increase item quantity/i })
      ).toBeInTheDocument()

      rerender(
        <EditItemQuantityButton
          item={item}
          type="minus"
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      // Minus button
      expect(
        screen.getByRole('button', { name: /reduce item quantity/i })
      ).toBeInTheDocument()
    })

    it('hides status message when no message is present', () => {
      const item = createMockCartItem()

      render(
        <EditItemQuantityButton
          item={item}
          type="plus"
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const statusRegion = document.querySelector('[aria-live="polite"]')
      expect(statusRegion).toBeInTheDocument()
      expect(statusRegion).toHaveTextContent('')
    })
  })
})
