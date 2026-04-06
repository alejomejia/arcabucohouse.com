import { Grid } from '@/components/ui/grid'

import { Text } from '@/components/ui/text'
import { NewsletterForm } from './newsletter-form'

/**
 * Newsletter subscription section — appears on every page before the footer.
 *
 * Renders the heading copy and delegates form logic to `NewsletterForm`, which
 * calls the `subscribeToNewsletter` server action to add members to the
 * Mailchimp audience list.
 */
export function NewsletterSection() {
  return (
    <section id="newsletter" className="border-t border-t-zinc-200 [--autofill-bg:var(--color-neutral-50)]">
      <Grid className="py-16 lg:py-28">
        <div className="col-span-12 md:col-span-7 lg:col-start-3 lg:col-span-7 flex flex-col gap-6">
          <Text preset="eyebrow" className="text-zinc-500">
            Newsletter
          </Text>
          <Text preset="h2">
            <span className="block">Our Curated</span>
            <span>Dispatches</span>
          </Text>
          <Text preset="body" className="text-zinc-500 max-w-md">
            Receive curated updates — new objects, design stories, and early access to our collections before they are revealed to the world.
          </Text>
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
