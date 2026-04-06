import { config } from '@/lib/utils/config';

export type MailchimpSubscribeResult =
  | { success: true }
  | { success: false; error: 'already_subscribed' | 'server_error' }

/**
 * Subscribes an email address to the Mailchimp audience list.
 *
 * Required environment variables:
 * MAILCHIMP_API_KEY       — Mailchimp API key
 * MAILCHIMP_SERVER_PREFIX — Data center prefix (e.g. "us21")
 * MAILCHIMP_AUDIENCE_ID   — Audience / list ID
 */
export async function subscribeMailchimpMember({
  name,
  email,
}: {
  name: string
  email: string
}): Promise<MailchimpSubscribeResult> {
  const [firstName, ...rest] = name.trim().split(' ')
  const lastName = rest.join(' ')

  const url = `https://${config.mailchimpServerPrefix}.api.mailchimp.com/3.0/lists/${config.mailchimpAudienceId}/members`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`anystring:${config.mailchimpApiKey}`).toString('base64')}`,
    },
    body: JSON.stringify({
      email_address: email,
      /* Pending instead of Subscribed allows double-opt in */
      status: 'pending',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
      tags: ['website'],
    }),
  })

  if (response.ok) {
    return { success: true }
  }

  const body = await response.json()

  if (response.status === 400 && body?.title === 'Member Exists') {
    return { success: false, error: 'already_subscribed' }
  }

  if (response.status === 400 && body?.title === 'Forgotten Email Not Subscribed') {
    return { success: false, error: 'already_subscribed' }
  }

  console.error('[Mailchimp] Unexpected response:', {
    status: response.status,
    title: body?.title,
    detail: body?.detail,
    errors: body?.errors,
  })

  return { success: false, error: 'server_error' }
}
