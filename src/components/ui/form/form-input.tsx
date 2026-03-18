import { type ComponentProps } from 'react'

import { cn } from '@/lib/utils/helpers'

type FormInputProps = ComponentProps<'input'> & {
  hasError?: boolean
}

export function FormInput({ hasError, className, ...props }: FormInputProps) {
  return (
    <input
      className={cn(
        'bg-transparent border-b',
        'font-serif text-lg text-primary-base',
        'placeholder:text-primary-base/50',
        'focus:outline-none transition-colors duration-300',
        hasError
          ? 'border-red-400'
          : 'border-primary-base/20 focus:border-primary-base not-placeholder-shown:border-primary-base',
        className,
      )}
      {...props}
    />
  )
}
