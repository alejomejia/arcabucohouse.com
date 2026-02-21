"use client"

import { useContext } from "react";

import { ProductContext } from "../context";

/**
 * Hook to access the product context.
 *
 * @returns The product context.
 */
export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}

