'use client'

import { UnderlineButton } from '@/components/effects/underline'
import { Container } from '@/components/ui/container'
import { Text } from '@/components/ui/text'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Route-segment error boundary for `(main)/product/[handle]/`. Renders a
 * graceful "couldn't load this product" message with a retry that calls
 * Next's `reset` to re-run the server component.
 */
export default function Error({ error, reset }: ErrorProps) {
  return (
    <Container>
      <section className="min-h-[60vh] flex flex-col items-center justify-center gap-4 py-24 text-center text-zinc-700">
        <Text as="h1" className="text-3xl md:text-4xl">We couldn't load this product</Text>
        <Text preset="body" className="max-w-md text-zinc-500">
          The product details didn't come back in time. This is usually a
          temporary issue — try again in a moment.
        </Text>
        {error.digest && (
          <Text as="span" preset="caption" className="text-zinc-400">
            Reference: {error.digest}
          </Text>
        )}
        <UnderlineButton onClick={() => reset()}>
          <Text as="span" preset="cta">Try again</Text>
        </UnderlineButton>
      </section>
    </Container>
  )
}
