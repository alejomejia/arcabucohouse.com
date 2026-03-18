import { z } from 'zod'

export const newsletterSchema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.email('Enter a valid email address'),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You need to accept the terms to continue',
    }),
})

export type NewsletterFormData = z.infer<typeof newsletterSchema>
