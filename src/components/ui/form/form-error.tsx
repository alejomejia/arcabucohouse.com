import { type ComponentProps } from 'react'

import { cn } from '@/lib/utils/helpers'

type FormErrorProps = ComponentProps<'span'>

export function FormError({ className, ...props }: FormErrorProps) {
  return (
    <span
      className={cn('text-sm tracking-wide text-red-500', className)}
      {...props}
    />
  )
}
