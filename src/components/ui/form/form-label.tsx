import { type ComponentProps } from 'react'

import { cn } from '@/lib/utils/helpers'

type FormLabelProps = ComponentProps<'label'>

export function FormLabel({ className, ...props }: FormLabelProps) {
  return (
    <label
      className={cn(
        'text-xs uppercase tracking-widest text-primary-300 font-medium',
        className,
      )}
      {...props}
    />
  )
}
