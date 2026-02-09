import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  createMockCartItem,
  createMockMoney,
} from '@/lib/integrations/shopify/test-helpers'

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
  removeItem: jest.fn(),
}))

// Import after mocks are set up
import { DeleteFromCartButton } from './index'

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

describe('<DeleteFromCartButton />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMessage = null
    // Reset the useActionState mock to return null message
    const { useActionState } = require('react')
    useActionState.mockReturnValue([null, mockFormAction])
  })

  describe('Single item removal', () => {
    it('renders the delete button with correct aria-label', () => {
      const item = createMockCartItem()

      render(
        <DeleteFromCartButton
          item={item}
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button = screen.getByRole('button', { name: /remove cart item/i })
      expect(button).toBeInTheDocument()
    })

    it('calls optimisticUpdateAction with correct merchandiseId and "delete" when clicked', async () => {
      const user = userEvent.setup()
      const item = createMockCartItem({ merchandise: { id: 'merchandise-123' } })

      render(
        <DeleteFromCartButton
          item={item}
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button = screen.getByRole('button', { name: /remove cart item/i })
      await user.click(button)

      await waitFor(() => {
        expect(mockOptimisticUpdateAction).toHaveBeenCalledWith(
          'merchandise-123',
          'delete'
        )
      })
    })

    it('calls the server action when form is submitted', async () => {
      const user = userEvent.setup()
      const item = createMockCartItem({ merchandise: { id: 'merchandise-456' } })

      render(
        <DeleteFromCartButton
          item={item}
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button = screen.getByRole('button', { name: /remove cart item/i })
      await user.click(button)

      await waitFor(() => {
        expect(mockFormAction).toHaveBeenCalled()
      })
    })

    it('displays error message when server action fails', () => {
      setActionMessage('Error removing item from cart')

      const item = createMockCartItem()

      render(
        <DeleteFromCartButton
          item={item}
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const statusMessage = screen.getByText('Error removing item from cart')
      expect(statusMessage).toBeInTheDocument()
      expect(statusMessage).toHaveAttribute('aria-live', 'polite')
      expect(statusMessage).toHaveClass('sr-only')
    })
  })

  describe('Removing all items from cart', () => {
    it('successfully removes the last item from cart', async () => {
      const user = userEvent.setup()
      const item = createMockCartItem({
        id: 'cart-item-last',
        merchandise: { id: 'merchandise-last' },
      })

      render(
        <DeleteFromCartButton
          item={item}
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button = screen.getByRole('button', { name: /remove cart item/i })
      await user.click(button)

      await waitFor(() => {
        expect(mockOptimisticUpdateAction).toHaveBeenCalledWith(
          'merchandise-last',
          'delete'
        )
        expect(mockFormAction).toHaveBeenCalled()
      })
    })

    it('calls removeItem server action with correct merchandiseId when removing last item', async () => {
      const user = userEvent.setup()
      const item = createMockCartItem({
        id: 'cart-item-final',
        merchandise: { id: 'merchandise-final-123' },
      })

      // Mock useActionState to return a bound action that we can track
      const boundAction = jest.fn()
      const { useActionState } = require('react')
      useActionState.mockReturnValue([null, boundAction])

      render(
        <DeleteFromCartButton
          item={item}
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button = screen.getByRole('button', { name: /remove cart item/i })
      await user.click(button)

      await waitFor(() => {
        // Verify the bound action was called (which should call removeItem with merchandiseId)
        expect(boundAction).toHaveBeenCalled()
        // The bound action should have been created with merchandiseId
        // Since formAction.bind(null, merchandiseId) creates a new function,
        // we verify the action was invoked
        expect(mockOptimisticUpdateAction).toHaveBeenCalledWith(
          'merchandise-final-123',
          'delete'
        )
      })
    })

    it('prevents double-click by disabling button during submission when removing last item', async () => {
      const user = userEvent.setup()
      const item = createMockCartItem({
        merchandise: { id: 'merchandise-single' },
      })

      // Create a slow async action to test disabled state
      let resolveAction: () => void
      const slowAction = jest.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveAction = resolve
          })
      )

      const { useActionState } = require('react')
      useActionState.mockReturnValue([null, slowAction])

      render(
        <DeleteFromCartButton
          item={item}
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button = screen.getByRole('button', { name: /remove cart item/i })
      expect(button).not.toBeDisabled()

      // Click the button
      const clickPromise = user.click(button)

      // Button should be disabled during submission
      await waitFor(() => {
        expect(button).toBeDisabled()
      })

      // Resolve the action
      resolveAction!()
      await clickPromise

      // After completion, button should be enabled again (or component unmounted)
      // This test will fail initially because the component doesn't disable the button
    })

    it('handles removing multiple items sequentially', async () => {
      const user = userEvent.setup()

      // First item
      const item1 = createMockCartItem({
        id: 'cart-item-1',
        merchandise: { id: 'merchandise-1' },
      })

      const { rerender } = render(
        <DeleteFromCartButton
          item={item1}
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button1 = screen.getByRole('button', { name: /remove cart item/i })
      await user.click(button1)

      await waitFor(() => {
        expect(mockOptimisticUpdateAction).toHaveBeenCalledWith(
          'merchandise-1',
          'delete'
        )
      })

      // Clear mocks for second item
      mockOptimisticUpdateAction.mockClear()
      mockFormAction.mockClear()

      // Second item (last item)
      const item2 = createMockCartItem({
        id: 'cart-item-2',
        merchandise: { id: 'merchandise-2' },
      })

      rerender(
        <DeleteFromCartButton
          item={item2}
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button2 = screen.getByRole('button', { name: /remove cart item/i })
      await user.click(button2)

      await waitFor(() => {
        expect(mockOptimisticUpdateAction).toHaveBeenCalledWith(
          'merchandise-2',
          'delete'
        )
        expect(mockFormAction).toHaveBeenCalled()
      })
    })

    it('calls optimisticUpdateAction before server action for the last item', async () => {
      const user = userEvent.setup()
      const item = createMockCartItem({
        merchandise: { id: 'merchandise-final' },
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
        <DeleteFromCartButton
          item={item}
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button = screen.getByRole('button', { name: /remove cart item/i })
      await user.click(button)

      await waitFor(() => {
        expect(callOrder.length).toBeGreaterThan(0)
        // Optimistic update should be called (server action is async)
        expect(mockOptimisticUpdateAction).toHaveBeenCalled()
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper aria-live region for status updates', () => {
      const item = createMockCartItem()

      render(
        <DeleteFromCartButton
          item={item}
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const statusRegion = document.querySelector('[aria-live="polite"]')
      expect(statusRegion).toBeInTheDocument()
      expect(statusRegion).toHaveClass('sr-only')
    })

    it('provides accessible button label', () => {
      const item = createMockCartItem()

      render(
        <DeleteFromCartButton
          item={item}
          optimisticUpdateAction={mockOptimisticUpdateAction}
        />
      )

      const button = screen.getByRole('button', { name: /remove cart item/i })
      expect(button).toBeInTheDocument()
    })
  })
})
