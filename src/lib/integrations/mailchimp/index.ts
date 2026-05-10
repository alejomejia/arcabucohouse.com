'use server'

import { config } from '@/lib/utils/config';
import {
  LOG_PREFIX,
  MAILCHIMP_API_VERSION,
  MAILCHIMP_BASIC_AUTH_USER,
  MAILCHIMP_DOUBLE_OPT_IN_STATUS,
  MAILCHIMP_ERROR_TITLE_FORGOTTEN_EMAIL,
  MAILCHIMP_ERROR_TITLE_MEMBER_EXISTS,
  MAILCHIMP_SUBSCRIPTION_TAG,
} from './mailchimp.const'

type MailchimpSubscribeResult =
  | { success: true }
  | { success: false; error: 'already_subscribed' | 'server_error' }

type MailchimpErrorResponseBody = {
  title?: string
  detail?: string
  errors?: unknown
}

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

  const url = `https://${config.mailchimpServerPrefix}.api.mailchimp.com/${MAILCHIMP_API_VERSION}/lists/${config.mailchimpAudienceId}/members`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${MAILCHIMP_BASIC_AUTH_USER}:${config.mailchimpApiKey}`).toString('base64')}`,
    },
    body: JSON.stringify({
      email_address: email,
      status: MAILCHIMP_DOUBLE_OPT_IN_STATUS,
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
      tags: [MAILCHIMP_SUBSCRIPTION_TAG],
    }),
  })

  if (response.ok) {
    return { success: true }
  }

  let body: MailchimpErrorResponseBody | null = null
  try {
    body = await response.json()
  } catch (err) {
    console.error(`${LOG_PREFIX} Failed to parse error response body:`, {
      status: response.status,
      err,
    })
    return { success: false, error: 'server_error' }
  }

  if (response.status === 400 && body?.title === MAILCHIMP_ERROR_TITLE_MEMBER_EXISTS) {
    return { success: false, error: 'already_subscribed' }
  }

  if (response.status === 400 && body?.title === MAILCHIMP_ERROR_TITLE_FORGOTTEN_EMAIL) {
    return { success: false, error: 'already_subscribed' }
  }

  console.error(`${LOG_PREFIX} Unexpected response:`, {
    status: response.status,
    title: body?.title,
    detail: body?.detail,
    errors: body?.errors,
  })

  return { success: false, error: 'server_error' }
}
