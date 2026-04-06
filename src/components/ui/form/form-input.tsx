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
        'text-lg text-zinc-700',
        'placeholder:text-zinc-700/50',
        'focus:outline-none transition-colors duration-300',
        hasError
          ? 'border-red-400'
          : 'border-zinc-700/20 focus:border-zinc-700 not-placeholder-shown:border-zinc-700',
        className,
      )}
      {...props}
    />
  )
}
