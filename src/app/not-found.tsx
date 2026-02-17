import { UnderlineLink } from "@/components/effects/underline/underline-link";


export default function NotFound() {
  return (
    <section className="px-6 pt-16 min-h-screen flex flex-col justify-center text-primary-base">
      <div className="pb-4 border-b border-primary-100">
        <h1 className="text-xl uppercase tracking-wider font-semibold text-primary-300">Not Found</h1>
      </div>
      <div className="pt-8 flex flex-col lg:flex-row justify-between gap-10 mb-12 font-serif">
        <div className="w-full flex gap-4 md:gap-6 text-6xl md:text-9xl italic leading-none">
          <span className="lg:flex-1">Error</span>
          <span className="lg:flex-1">404</span>
        </div>
        <p className="max-w-sm text-lg text-balance">The page you are looking for does not exist or may have been moved.</p>
      </div>
      <UnderlineLink className="text-xl uppercase font-serif" href="/">
        Return to Home
      </UnderlineLink>
    </section>
  )
}
