'use client';

import { useSearchParams } from 'next/navigation';
import { createContext, type ReactNode, useCallback, useMemo, useOptimistic } from 'react';

import type { ProductContextType, ProductState } from '../types';

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

type ProductProviderProps = {
  children: ReactNode;
}

/**
 * Provider component that wraps the application and provides product context.
 *
 * @param children - React children components
 */
export function ProductProvider({ children }: ProductProviderProps) {
  const searchParams = useSearchParams();

  const initialState = useMemo(() => {
    const params: ProductState = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  }, [searchParams]);

  const [state, setOptimisticState] = useOptimistic(
    initialState,
    (_prevState: ProductState, newState: ProductState) => newState
  );

  const updateOption = useCallback((name: string, value: string) => {
    const newState = { ...state, [name]: value };
    setOptimisticState(newState);
    return newState;
  }, [state, setOptimisticState]);

  const removeOption = useCallback((name: string) => {
    const { [name]: _, ...newState } = state;
    setOptimisticState(newState as ProductState);
    return newState as ProductState;
  }, [state, setOptimisticState]);

  const value = useMemo(
    () => ({
      state,
      updateOption,
      removeOption,
    }),
    [state]
  );

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}