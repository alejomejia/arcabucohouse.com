'use client'

import { cn } from '@/lib/utils/helpers'

import { useFormFieldContext } from './form.context'
import type { FormLabelProps } from './form.types'

/**
 * Label for the input rendered inside the same `<Form.Field>`. Reads its
 * `htmlFor` from `FormFieldContext` unless explicitly overridden.
 *
 * @example
 * ```tsx
 * <Form.Field>
 *   <Form.Label>Email</Form.Label>
 *   <Form.Input type="email" {...register('email')} />
 * </Form.Field>
 * ```
 *
 * @throws when rendered outside a `<Form.Field>`.
 */
export function FormLabel({ className, htmlFor, ...props }: FormLabelProps) {
  const { id } = useFormFieldContext()

  return (
    <label
      htmlFor={htmlFor ?? id}
      className={cn(
        'text-xs uppercase tracking-widest text-zinc-500 font-semibold',
        className,
      )}
      {...props}
    />
  )
}
