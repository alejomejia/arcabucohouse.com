'use client'

import { cn } from '@/lib/utils/helpers'

import { useFormFieldContext } from './form.context'
import type { FormInputProps } from './form.types'

/**
 * Text input wired to the surrounding `<Form.Field>`: receives its `id`,
 * `aria-invalid`, and `aria-describedby` automatically. Pass `hasError`
 * directly to override the value coming from context.
 *
 * @example
 * ```tsx
 * <Form.Field hasError={!!errors.email}>
 *   <Form.Label>Email</Form.Label>
 *   <Form.Input type="email" placeholder="you@example.com" {...register('email')} />
 * </Form.Field>
 * ```
 *
 * @throws when rendered outside a `<Form.Field>`.
 */
export function FormInput({ hasError, className, id, ...props }: FormInputProps) {
  const ctx = useFormFieldContext()
  const isError = hasError ?? ctx.hasError

  return (
    <input
      id={id ?? ctx.id}
      aria-invalid={isError || undefined}
      aria-describedby={isError ? ctx.errorId : undefined}
      className={cn(
        'bg-transparent border-b',
        'text-lg text-zinc-700',
        'placeholder:text-zinc-700/50',
        'focus:outline-none transition-colors duration-300',
        isError
          ? 'border-red-400'
          : 'border-zinc-700/20 focus:border-zinc-700 not-placeholder-shown:border-zinc-700',
        className,
      )}
      {...props}
    />
  )
}
