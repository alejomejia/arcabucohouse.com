import { FormCheckbox } from './form-checkbox'
import { FormError } from './form-error'
import { FormField } from './form-field'
import { FormInput } from './form-input'
import { FormLabel } from './form-label'

export { FormCheckbox, FormError, FormField, FormInput, FormLabel }

export const Form = Object.assign(
  {},
  {
    Field: FormField,
    Label: FormLabel,
    Input: FormInput,
    Error: FormError,
    Checkbox: FormCheckbox,
  },
)
