import { type SVGProps } from "react";

/**
 * Compact single-letter Arcabuco House mark. Inherits `currentColor`.
 * Render via `Logo.Minimal` from the compound API.
 *
 * @example
 * ```tsx
 * <Logo.Minimal className="block md:hidden w-full" />
 * ```
 */
export function LogoMinimal(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 530 462" fill="currentColor" {...props}>
      <path d="M114.467 331.888v-14.109h161.957l2.24 14.109H114.467ZM0 462v-12.989c17.248 0 31.137-2.239 41.441-6.494 10.305-4.255 18.369-10.75 23.969-19.036 5.6-8.286 11.872-20.155 18.593-35.607L228.038 27.097 215.943 0h56.001l176.069 427.064c2.689 6.719 6.497 12.094 11.425 15.901 4.928 4.031 11.2 6.046 18.592 6.046H530V462H321.898v-12.989h64.066c4.032 0 6.72-1.12 8.512-3.583 1.568-2.239 1.792-5.823.448-10.525L236.103 45.909l-152.1 377.124c-2.689 7.391-1.12 12.765 4.48 16.572 5.6 3.584 16.576 6.271 32.481 7.391 15.904 1.343 37.409 2.015 64.066 2.015V462H0Z" />
    </svg>
  )
}