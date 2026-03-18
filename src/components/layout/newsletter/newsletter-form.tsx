'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { UnderlineButton } from '@/components/effects/underline/underline-button'
import { Form } from '@/components/ui/form'
import { Link } from '@/components/ui/link'
import { cn } from '@/lib/utils/helpers'

import { subscribeToNewsletter } from './newsletter.action'
import { type NewsletterFormData, newsletterSchema } from './newsletter.schema'

export function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { acceptTerms: false },
  })

  const hasErrors = !!Object.entries(errors).length

  const onSubmit = async (data: NewsletterFormData) => {
    const result = await subscribeToNewsletter(data)

    if (result.success) {
      toast.success('Welcome to Arcabuco', {
        description:
          'You will now receive early access to new collections and design insights.',
      })
      reset()
    } else if (result.error === 'already_subscribed') {
      toast('You are already subscribed', {
        description: 'This email is already receiving our curated updates.',
      })
    } else {
      toast.error('Something went quietly wrong', {
        description: 'Try once more after a few seconds.',
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8"
      noValidate
    >
      <div className="flex gap-6">
        <Form.Field className="flex-1">
          <Form.Label htmlFor="newsletter-name">Name</Form.Label>
          <Form.Input
            id="newsletter-name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            hasError={!!errors.name}
            {...register('name')}
          />
        </Form.Field>
        <Form.Field className="flex-1">
          <Form.Label htmlFor="newsletter-email">Email</Form.Label>
          <Form.Input
            id="newsletter-email"
            type="email"
            autoComplete="email"
            placeholder="your@email.com"
            hasError={!!errors.email}
            {...register('email')}
          />
        </Form.Field>
      </div>

      {/* Terms checkbox */}
      <div className="flex flex-col gap-2">
        <Form.Checkbox
          hasError={!!errors.acceptTerms}
          {...register('acceptTerms')}
        >
          I have read and agree to the{' '}
          <Link
            href="/terms-and-conditions"
            className="inline-block underline text-primary-300 hover:text-primary-base transition-colors duration-200"
          >
            Terms &amp; Conditions
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy-policy"
            className="inline-block underline text-primary-300 hover:text-primary-base transition-colors duration-200"
          >
            Privacy Policy
          </Link>
        </Form.Checkbox>
      </div>

      {hasErrors && (
        <div className="flex flex-col gap-1">
          {errors.name && <Form.Error>{errors.name.message}</Form.Error>}
          {errors.email && <Form.Error>{errors.email.message}</Form.Error>}
          {errors.acceptTerms && (
            <Form.Error>{errors.acceptTerms.message}</Form.Error>
          )}
        </div>
      )}

      {/* Submit */}
      <UnderlineButton
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'w-fit text-primary-base',
          'uppercase tracking-wider font-medium',
          'disabled:opacity-40 disabled:pointer-events-none',
        )}
      >
        {isSubmitting ? 'Sending…' : 'Subscribe'}
      </UnderlineButton>
    </form>
  )
}
