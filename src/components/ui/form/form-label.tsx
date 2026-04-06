import { type ComponentProps } from 'react'

import { cn } from '@/lib/utils/helpers'

type FormLabelProps = ComponentProps<'label'>

export function FormLabel({ className, ...props }: FormLabelProps) {
  return (
    <label
      className={cn(
        'text-xs uppercase tracking-widest text-zinc-500 font-semibold',
        className,
      )}
      {...props}
    />
  )
}
