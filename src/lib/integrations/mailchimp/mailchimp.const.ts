export const MAILCHIMP_API_VERSION = '3.0'
// Mailchimp basic-auth convention: any non-empty string works as the username; the API key is the password.
export const MAILCHIMP_BASIC_AUTH_USER = 'anystring'
// "pending" requires the member to confirm via email (double opt-in); "subscribed" would skip confirmation.
export const MAILCHIMP_DOUBLE_OPT_IN_STATUS = 'pending'
export const MAILCHIMP_SUBSCRIPTION_TAG = 'website'
export const MAILCHIMP_ERROR_TITLE_MEMBER_EXISTS = 'Member Exists'
export const MAILCHIMP_ERROR_TITLE_FORGOTTEN_EMAIL = 'Forgotten Email Not Subscribed'
export const LOG_PREFIX = '[Mailchimp]'
