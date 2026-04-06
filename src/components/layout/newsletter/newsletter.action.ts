'use server'

import { subscribeMailchimpMember } from '@/lib/integrations/mailchimp'

import type { NewsletterFormData } from './newsletter.schema'
import { newsletterSchema } from './newsletter.schema'

/**
 * Discriminated union returned by `subscribeToNewsletter`.
 * - `success: true` — member was subscribed.
 * - `success: false` — includes an `error` code the client can act on:
 *   - `invalid_data` — Zod validation failed server-side.
 *   - `already_subscribed` — Mailchimp reports the email already exists.
 *   - `server_error` — unexpected Mailchimp or network failure.
 */
export type NewsletterActionResult =
  | { success: true }
  | { success: false; error: 'invalid_data' | 'already_subscribed' | 'server_error' }

/**
 * Server action — validates the subscription payload and subscribes the
 * member to the Mailchimp audience list.
 *
 * The `acceptTerms` field is validated by Zod but not forwarded to Mailchimp.
 */
export async function subscribeToNewsletter(
  data: NewsletterFormData,
): Promise<NewsletterActionResult> {
  const parsed = newsletterSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, error: 'invalid_data' }
  }
  
  const result = await subscribeMailchimpMember({
    name: parsed.data.name,
    email: parsed.data.email,
  })
  
  console.log({ parsed, result })

  if (!result.success) {
    console.error('[Newsletter] Mailchimp subscription failed:', result.error)
    return { success: false, error: result.error }
  }

  return { success: true }
}
