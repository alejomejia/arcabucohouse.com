'use client';

import { UnderlineButton } from "@/components/effects/underline";
import { Text } from "@/components/ui/text";

type ErrorProps = {
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  return (
    <section className="px-6 pt-16 min-h-screen flex flex-col justify-center text-zinc-700 bg-zinc-50">
      <div className="flex max-w-xl flex-col gap-4 mx-auto my-4 p-8 md:p-12 border border-zinc-200">
        <Text as="h1" className="text-3xl md:text-4xl">Oh no!</Text>
        <Text preset="body">
          There was an issue with our storefront. This could be a temporary issue, please try your
          action again.
        </Text>
        <UnderlineButton onClick={() => reset()}>
          <Text as="span" preset="cta">Try Again</Text>
        </UnderlineButton>
      </div>
    </section>
  );
}
