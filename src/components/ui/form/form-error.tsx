'use client'

import { cn } from '@/lib/utils/helpers'

import { useFormFieldContext } from './form.context'
import type { FormErrorProps } from './form.types'

/**
 * Inline error message linked to its sibling `<Form.Input>` via the shared
 * `errorId`. Render this only when there's an error to display — the
 * surrounding `<Form.Field>` should also receive `hasError` so the input
 * gets `aria-invalid` and `aria-describedby` wired to this span.
 *
 * @example
 * ```tsx
 * <Form.Field hasError={!!errors.email}>
 *   <Form.Label>Email</Form.Label>
 *   <Form.Input type="email" {...register('email')} />
 *   {errors.email && <Form.Error>{errors.email.message}</Form.Error>}
 * </Form.Field>
 * ```
 *
 * @throws when rendered outside a `<Form.Field>`.
 */
export function FormError({ className, id, ...props }: FormErrorProps) {
  const { errorId } = useFormFieldContext()

  return (
    <span
      id={id ?? errorId}
      className={cn('text-sm tracking-wide text-red-500', className)}
      {...props}
    />
  )
}
