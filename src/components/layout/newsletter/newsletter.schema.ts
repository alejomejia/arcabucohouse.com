import { z } from 'zod'

/**
 * Zod schema for the newsletter subscription form.
 *
 * Fields:
 * - `name` — full name, minimum 2 characters.
 * - `email` — valid email address.
 * - `acceptTerms` — must be `true`; ensures explicit consent before subscribing.
 */
export const newsletterSchema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.email('Enter a valid email address'),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You need to accept the terms to continue',
    }),
})

/** Inferred TypeScript type for `newsletterSchema`. Used as the `useForm` generic and the server action parameter. */
export type NewsletterFormData = z.infer<typeof newsletterSchema>
