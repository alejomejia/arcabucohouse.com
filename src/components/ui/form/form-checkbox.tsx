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
            'peer-focus-visible:ring-1 peer-focus-visible:ring-primary-100/50',
            hasError
              ? 'border-red-400'
              : 'border-primary-base/80 group-hover:border-primary-base',
            'peer-checked:bg-primary-base peer-checked:border-primary-base',
          )}
        />
        <CheckIcon className="size-6 p-1 absolute inset-0 text-primary-100 opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>
      <span className={cn('block font-serif text-primary-300 leading-none', className)}>
        {children}
      </span>
    </label>
  )
}
