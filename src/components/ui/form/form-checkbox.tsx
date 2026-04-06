import { CheckIcon } from '@heroicons/react/24/outline'
import { type ComponentProps, type ReactNode } from 'react'

import { cn } from '@/lib/utils/helpers'

type FormCheckboxProps = Omit<ComponentProps<'input'>, 'type'> & {
  hasError?: boolean
  children: ReactNode
}

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
            'peer-focus-visible:ring-1 peer-focus-visible:ring-zinc-400',
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
