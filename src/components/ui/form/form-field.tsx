import { type ComponentProps } from 'react'

import { cn } from '@/lib/utils/helpers'

type FormFieldProps = ComponentProps<'div'>

export function FormField({ className, ...props }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)} {...props} />
  )
}
