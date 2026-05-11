import { FormCheckbox } from './form-checkbox'
import { FormError } from './form-error'
import { FormField } from './form-field'
import { FormInput } from './form-input'
import { FormLabel } from './form-label'
import type { FormProps } from './form.types'

/**
 * `<form>` element wrapper. Compose validated fields by nesting
 * `Form.Field` blocks (each one auto-wires `htmlFor` / `aria-describedby`
 * / `aria-invalid`). Standalone checkboxes use `Form.Checkbox`, which is
 * self-labeling.
 *
 * @example
 * ```tsx
 * <Form onSubmit={handleSubmit(onSubmit)} noValidate>
 *   <Form.Field hasError={!!errors.email}>
 *     <Form.Label>Email</Form.Label>
 *     <Form.Input type="email" {...register('email')} />
 *     {errors.email && <Form.Error>{errors.email.message}</Form.Error>}
 *   </Form.Field>
 *   <Form.Checkbox hasError={!!errors.acceptTerms} {...register('acceptTerms')}>
 *     I agree to the terms
 *   </Form.Checkbox>
 *   <button type="submit">Submit</button>
 * </Form>
 * ```
 */
function FormRoot(props: FormProps) {
  return <form {...props} />
}

/** @see {@link FormRoot} for full usage docs. */
export const Form = Object.assign(FormRoot, {
  /** @see {@link FormField} */
  Field: FormField,
  /** @see {@link FormLabel} */
  Label: FormLabel,
  /** @see {@link FormInput} */
  Input: FormInput,
  /** @see {@link FormError} */
  Error: FormError,
  /** @see {@link FormCheckbox} */
  Checkbox: FormCheckbox,
})

export type * from './form.types'
