import type { ComponentProps, ReactNode } from 'react'

export type FormProps = ComponentProps<'form'>

export type FormFieldProps = ComponentProps<'div'> & {
  /**
   * When true, child `Form.Input` applies `aria-invalid` and the error
   * border state. Propagated through `FormFieldContext`.
   */
  hasError?: boolean
}

export type FormLabelProps = ComponentProps<'label'>

export type FormInputProps = ComponentProps<'input'> & {
  /**
   * When true, renders the error border state. Falls back to
   * `FormFieldContext.hasError` when omitted.
   */
  hasError?: boolean
}

export type FormErrorProps = ComponentProps<'span'>

export type FormCheckboxProps = Omit<ComponentProps<'input'>, 'type'> & {
  /** When true, renders the error border state. */
  hasError?: boolean
  children: ReactNode
}
