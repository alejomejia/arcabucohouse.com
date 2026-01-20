import { create } from 'zustand'

const navigationState = ['open', 'opening', 'closed', 'closing'] as const
type NavState = typeof navigationState[number]

/**
 * Core store type - only contains state and basic setters.
 * Keep this minimal and focused on state management.
 */
type AppStore = {
  navState: NavState
  setNavState: (state: NavState) => void
}

/**
 * Core Zustand store - minimal state and basic setters only.
 * Use custom hooks (below) for computed values and complex logic.
 */
const useAppStore = create<AppStore>((set) => ({
  navState: 'closed',
  setNavState: (state) => set({ navState: state }),
}))

/**
 * Reactive selector hook for checking if navigation is open.
 * Use this in React components to get reactive updates.
 * 
 * @returns boolean indicating if navigation is open or opening
 * 
 * @example
 * ```tsx
 * const isNavOpen = useIsNavOpen()
 * ```
 */
const useIsNavOpen = () => {
  return useAppStore((state) => {
    const navState = state.navState
    return navState === 'open' || navState === 'opening'
  })
}

/**
 * Get the current navigation state reactively.
 * 
 * @returns The current navigation state
 * 
 * @example
 * ```tsx
 * const navState = useNavState()
 * ```
 */
const useNavState = () => {
  return useAppStore((state) => state.navState)
}

/**
 * Hook that provides navigation state actions.
 * Encapsulates all navigation state mutations in one place.
 * 
 * @returns Object with navigation action functions
 * 
 * @example
 * ```tsx
 * const { openNav, closeNav } = useNavigationActions()
 * ```
 */
const useNavigationActions = () => {
  const setNavState = useAppStore((state) => state.setNavState)

  return {
    openingNav: () => setNavState('opening'),
    openNav: () => setNavState('open'),
    closingNav: () => setNavState('closing'),
    closeNav: () => setNavState('closed'),
  }
}

/**
 * Comprehensive navigation hook that provides both state and actions.
 * Use this when you need both reading and writing navigation state.
 * 
 * @returns Object with navigation state and actions
 * 
 * @example
 * ```tsx
 * const { navState, isNavOpen, openNav, closeNav } = useNavigation()
 * ```
 */
export const useNavigation = () => {
  const navState = useNavState()
  const isNavOpen = useIsNavOpen()
  const actions = useNavigationActions()

  return {
    navState,
    isNavOpen,
    ...actions,
  }
}

/**
 * Get navigation state imperatively (outside React components).
 * Use this in callbacks, event handlers, or non-React code.
 * 
 * @returns Current navigation state
 */
export const getNavState = (): NavState => {
  return useAppStore.getState().navState
}

/**
 * Check if navigation is open imperatively (outside React components).
 * Use this in callbacks, event handlers, or non-React code.
 * 
 * @returns boolean indicating if navigation is open or opening
 */
export const getIsNavOpen = (): boolean => {
  const state = getNavState()
  return state === 'open' || state === 'opening'
}

/**
 * Set navigation state imperatively (outside React components).
 * Use this in callbacks, event handlers, or non-React code.
 */
export const setNavState = (state: NavState): void => {
  useAppStore.getState().setNavState(state)
}