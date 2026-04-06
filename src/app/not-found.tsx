import { UnderlineLink } from "@/components/effects/underline/underline-link";
import { Wrapper } from "@/components/layout/wrapper";
import { Text } from "@/components/ui/text";

export default function NotFound() {
  return (
    <Wrapper variant="minimal">
      <section className="px-6 pt-16 min-h-screen flex flex-col justify-center text-zinc-700">
        <div className="pb-4 border-b border-zinc-200">
          <Text as="h1" className="text-xl uppercase tracking-wider text-zinc-500">Not Found</Text>
        </div>
        <div className="pt-8 flex flex-col lg:flex-row justify-between gap-10">
          <div className="w-1/2">
            <Text as="span" className="text-6xl md:text-9xl">Error 404</Text>
          </div>
          <div className="w-1/2 flex flex-col gap-4">
            <Text preset="body" className="max-w-sm text-balance">The page you are looking for does not exist or may have been moved.</Text>
            <UnderlineLink href="/">
              <Text as="span" preset="cta">Return to Home</Text>
            </UnderlineLink>
          </div>
        </div>
      </section >
    </Wrapper >
  );
}
