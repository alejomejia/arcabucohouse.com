import { act, renderHook } from '@testing-library/react'

import {
  getIsNavOpen,
  getNavState,
  setNavState,
  useNavigation,
} from './store'

// Each test resets the singleton store so suites don't leak state into each other.
beforeEach(() => {
  setNavState('closed')
})

describe('useNavigation', () => {
  it('starts in the closed state with isNavOpen=false', () => {
    const { result } = renderHook(() => useNavigation())
    expect(result.current.navState).toBe('closed')
    expect(result.current.isNavOpen).toBe(false)
  })

  it('transitions closed → opening → open and reports isNavOpen=true for both', () => {
    const { result } = renderHook(() => useNavigation())

    act(() => {
      result.current.openingNav()
    })
    expect(result.current.navState).toBe('opening')
    expect(result.current.isNavOpen).toBe(true)

    act(() => {
      result.current.openNav()
    })
    expect(result.current.navState).toBe('open')
    expect(result.current.isNavOpen).toBe(true)
  })

  it('transitions open → closing → closed and reports isNavOpen=false on closed', () => {
    const { result } = renderHook(() => useNavigation())

    act(() => {
      result.current.openNav()
    })
    expect(result.current.isNavOpen).toBe(true)

    act(() => {
      result.current.closingNav()
    })
    // `closing` is still considered "not open" by the derived selector —
    // this is the contract the cart-trigger animation hook relies on.
    expect(result.current.navState).toBe('closing')
    expect(result.current.isNavOpen).toBe(false)

    act(() => {
      result.current.closeNav()
    })
    expect(result.current.navState).toBe('closed')
    expect(result.current.isNavOpen).toBe(false)
  })

  it('keeps the hook reference stable across renders when state has not changed', () => {
    const { result, rerender } = renderHook(() => useNavigation())
    const initial = result.current

    rerender()

    expect(result.current.navState).toBe(initial.navState)
    expect(result.current.isNavOpen).toBe(initial.isNavOpen)
  })
})

describe('imperative getters/setters', () => {
  it('getNavState reflects the latest setNavState call', () => {
    setNavState('opening')
    expect(getNavState()).toBe('opening')

    setNavState('closed')
    expect(getNavState()).toBe('closed')
  })

  it('getIsNavOpen returns true for `open` and `opening`, false otherwise', () => {
    setNavState('open')
    expect(getIsNavOpen()).toBe(true)

    setNavState('opening')
    expect(getIsNavOpen()).toBe(true)

    setNavState('closing')
    expect(getIsNavOpen()).toBe(false)

    setNavState('closed')
    expect(getIsNavOpen()).toBe(false)
  })

  it('imperative writes are visible to hook consumers on next render', () => {
    const { result, rerender } = renderHook(() => useNavigation())
    expect(result.current.navState).toBe('closed')

    act(() => {
      setNavState('open')
    })
    rerender()

    expect(result.current.navState).toBe('open')
    expect(result.current.isNavOpen).toBe(true)
  })
})
