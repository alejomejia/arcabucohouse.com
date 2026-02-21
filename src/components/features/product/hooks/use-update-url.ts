"use client"

import { useRouter } from "next/navigation";

import type { ProductState } from "../types";

/**
 * Hook to update the URL with the product state.
 *
 * @returns A function to update the URL with the product state.
 */
export function useUpdateURL() {
  const router = useRouter();

  return (state: ProductState) => {
    const newParams = new URLSearchParams(window.location.search);
    
    Object.entries(state).forEach(([key, value]) => {
      newParams.set(key, value);
    });
    
    router.push(`?${newParams.toString()}`, { scroll: false });
  };
}