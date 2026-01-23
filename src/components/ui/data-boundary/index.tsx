import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense, type ReactNode } from "react";

type NamedSuspenseProps = {
  name: string;
  fallback?: ReactNode;
  children: ReactNode;
};

/**
 * A Suspense wrapper that adds a name attribute for debugging purposes.
 * The name is added as a data attribute to the fallback element, making it
 * easier to identify which Suspense boundary is active in the DOM.
 */
function NamedSuspense({ name, fallback, children }: NamedSuspenseProps) {
  return (
    <Suspense fallback={<div data-suspense={name}>{fallback}</div>}>
      {children}
    </Suspense>
  );
}

type DataBoundaryProps = {
  name: string;
  loading: ReactNode;
  error: (props: { error: Error; reset?: () => void }) => ReactNode;
  children: ReactNode;
};

/**
 * A complete data boundary that combines ErrorBoundary and Suspense.
 * This component handles both loading states (via Suspense) and error states
 * (via ErrorBoundary) in a single wrapper, keeping child components clean
 * and focused on rendering data.
 *
 * @example
 * Using error with reset function to allow users to retry:
 * ```tsx
 * <DataBoundary
 *   name="product-gallery"
 *   loading={<GallerySkeleton />}
 *   error={({ error, reset }) => (
 *     <div className="p-4 border border-red-200 rounded">
 *       <h2>Something went wrong</h2>
 *       <p>{error.message}</p>
 *       <button onClick={reset} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
 *         Try Again
 *       </button>
 *     </div>
 *   )}
 * >
 *   <Gallery images={product.images} />
 * </DataBoundary>
 * ```
 */
export function DataBoundary({ name, loading, error, children }: DataBoundaryProps) {
  return (
    <ErrorBoundary errorComponent={error}>
      <NamedSuspense name={name} fallback={loading}>
        {children}
      </NamedSuspense>
    </ErrorBoundary>
  );
}