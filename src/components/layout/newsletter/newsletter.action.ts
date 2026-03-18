'use server'

import { subscribeMailchimpMember } from '@/lib/integrations/mailchimp'

import type { NewsletterFormData } from './newsletter.schema'
import { newsletterSchema } from './newsletter.schema'

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

  if (!result.success) {
    console.error('[Newsletter] Mailchimp subscription failed:', result.error)
    return { success: false, error: result.error }
  }

  return { success: true }
}
