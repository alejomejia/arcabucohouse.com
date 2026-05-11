'use client'

import { useId, useMemo } from 'react'

import { cn } from '@/lib/utils/helpers'

import { FormFieldContext } from './form.context'
import type { FormFieldProps } from './form.types'

/**
 * Layout wrapper for a single form field. Allocates a stable `id` and
 * `errorId` via `useId()` and provides them — together with `hasError` —
 * to nested `Form.Label`, `Form.Input`, and `Form.Error` so the
 * `htmlFor` / `aria-describedby` / `aria-invalid` chain wires up automatically.
 *
 * @example
 * ```tsx
 * <Form.Field hasError={!!errors.email}>
 *   <Form.Label>Email</Form.Label>
 *   <Form.Input type="email" {...register('email')} />
 *   {errors.email && <Form.Error>{errors.email.message}</Form.Error>}
 * </Form.Field>
 * ```
 */
export function FormField({
  className,
  hasError = false,
  children,
  ...props
}: FormFieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  const ctx = useMemo(
    () => ({ id, errorId, hasError }),
    [id, errorId, hasError],
  )

  return (
    <FormFieldContext.Provider value={ctx}>
      <div className={cn('flex flex-col gap-4', className)} {...props}>
        {children}
      </div>
    </FormFieldContext.Provider>
  )
}
