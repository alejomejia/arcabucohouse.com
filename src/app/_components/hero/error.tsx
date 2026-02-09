"use client"

import { cn } from "@/lib/utils/helpers";

export function Error({ error, reset }: { error: Error; reset?: () => void }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        "rounded-lg border border-red-200 bg-red-50 p-8",
        "text-center"
      )}
    >
      <h2 className="text-lg font-semibold text-red-800">
        Something went wrong
      </h2>
      <p className="text-sm text-red-700">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className={cn(
          "rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white",
          "transition-colors hover:bg-red-700",
          "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        )}
      >
        Try again
      </button>
    </div>
  )
}