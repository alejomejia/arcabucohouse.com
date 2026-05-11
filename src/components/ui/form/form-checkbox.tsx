import { CheckIcon } from '@heroicons/react/24/outline'

import { cn } from '@/lib/utils/helpers'

import { FORM_CHECKBOX_PEER_FOCUS_RING } from './form.const'
import type { FormCheckboxProps } from './form.types'

/**
 * Self-labeling checkbox: the visible `<div>` reflects the focus and checked
 * state of a hidden `<input>` via Tailwind's peer modifier. Renders its own
 * `<label>`, so it doesn't need to live inside a `<Form.Field>`.
 *
 * @example
 * ```tsx
 * <Form.Checkbox hasError={!!errors.acceptTerms} {...register('acceptTerms')}>
 *   I agree to the terms and conditions
 * </Form.Checkbox>
 * ```
 */
export function FormCheckbox({
  hasError,
  children,
  className,
  ...props
}: FormCheckboxProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative shrink-0">
        <input type="checkbox" className="peer sr-only" {...props} />
        <div
          className={cn(
            'size-6 border-2 transition-colors duration-200',
            FORM_CHECKBOX_PEER_FOCUS_RING,
            hasError
              ? 'border-red-400'
              : 'border-zinc-700 group-hover:border-zinc-700',
            'peer-checked:bg-zinc-700 peer-checked:border-zinc-700',
          )}
        />
        <CheckIcon className="size-6 p-1 absolute inset-0 text-zinc-100 opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>
      <span className={cn('block text-zinc-500 leading-none', className)}>
        {children}
      </span>
    </label>
  )
}
