'use client'

import { createContext, useContext } from 'react'

export type FormFieldContextValue = {
  /** id attribute used by the input + label `htmlFor`. */
  id: string
  /** id of the error span associated with this field. */
  errorId: string
  /** Whether the field is currently in an error state. */
  hasError: boolean
}

/**
 * Internal context distributing `id`, `errorId`, and `hasError` from
 * `<Form.Field>` to `<Form.Label>`, `<Form.Input>`, and `<Form.Error>`
 * so they auto-wire `htmlFor`, `aria-describedby`, and `aria-invalid`
 * without manual prop threading.
 */
export const FormFieldContext = createContext<FormFieldContextValue | null>(null)

/**
 * Consume `FormFieldContext`. Throws when rendered outside `<Form.Field>`,
 * surfacing misuse at development time.
 *
 * @throws when called outside a `<Form.Field>` tree.
 */
export function useFormFieldContext(): FormFieldContextValue {
  const ctx = useContext(FormFieldContext)
  if (!ctx) {
    throw new Error(
      'Form.Label / Form.Input / Form.Error must be rendered inside <Form.Field>',
    )
  }
  return ctx
}
