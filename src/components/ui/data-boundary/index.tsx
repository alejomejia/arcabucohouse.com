import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { ComponentType } from "react";
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

type ErrorBoundaryProps = { error: Error; reset?: () => void };

type DataBoundaryProps = {
  name: string;
  loading: ReactNode;
  /** Client Component that receives error and reset. Use a component reference so it can be passed from Server Components. */
  error: ComponentType<ErrorBoundaryProps>;
  children: ReactNode;
};

/**
 * A complete data boundary that combines ErrorBoundary and Suspense.
 * This component handles both loading states (via Suspense) and error states
 * (via ErrorBoundary) in a single wrapper, keeping child components clean
 * and focused on rendering data.
 *
 * Pass a Client Component reference for `error` when using from a Server
 * Component (e.g. error={HeroError}), not an inline function.
 *
 * @example
 * ```tsx
 * // error-ui.tsx (must be "use client")
 * export function HeroError({ error, reset }: { error: Error; reset?: () => void }) {
 *   return (
 *     <div>
 *       <p>{error.message}</p>
 *       <button onClick={reset}>Try again</button>
 *     </div>
 *   );
 * }
 *
 * // page or server component
 * <DataBoundary name="hero" loading={<Skeleton />} error={HeroError}>
 *   <Content />
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