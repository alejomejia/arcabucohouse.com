import { Grid } from '@/components/ui/grid'

import { NewsletterForm } from './newsletter-form'

/**
 * Newsletter subscription section — appears on every page before the footer.
 *
 * Collects name + email and writes them to a Google Spreadsheet via server action.
 * Requires GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and
 * GOOGLE_SPREADSHEET_ID environment variables to be set.
 */
export function NewsletterSection() {
  return (
    <section id="newsletter" className="border-t border-t-primary-100 text-primary-base [--autofill-bg:var(--color-neutral-50)]">
      <Grid className="py-16 lg:py-28">
        <div className="col-span-12 md:col-span-7 lg:col-start-3 lg:col-span-7 flex flex-col gap-6">
          <p className="text-xs uppercase tracking-widest text-primary-300 font-medium">
            Newsletter
          </p>
          <h2 className="font-serif italic text-4xl lg:text-5xl text-primary-base leading-none">
            <span className="block">Our Curated</span>
            <span>Dispatches</span>
          </h2>
          <p className="text-primary-300 text-xl font-serif max-w-md">
            Receive curated updates — new objects, design stories, and early access to our collections before they are revealed to the world.
          </p>
        </div>
        <div className="col-span-12 md:col-span-9 lg:col-start-12 lg:col-span-11 flex">
          <div className="w-full">
            <NewsletterForm />
          </div>
        </div>
      </Grid>
    </section>
  )
}
