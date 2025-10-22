import { cn } from '@/shared/utils/helpers'
import { Link, type LinkProps } from '.'

const underlineLinkSharedClassname = 'inline-block transition-transform duration-300 ease-cubic-in-out'

export type UnderlineLinkProps = LinkProps & {
  disableBarrel?: boolean
}

export function UnderlineLink({ className, disableBarrel = false, children, ...props }: UnderlineLinkProps) {
  return (
    <Link className={cn('arc-underline-link group relative inline-block w-fit decoration-0', className)} {...props}>
      {disableBarrel ? (
        children
      ) : (
        <div className="relative overflow-hidden">
          <span className={cn(underlineLinkSharedClassname, 'opacity-70 translate-y-0 group-hover:-translate-y-full')}>
            {children}
          </span>
          <span
            className={cn(underlineLinkSharedClassname, 'absolute left-0 translate-y-full group-hover:translate-y-0')}
          >
            {children}
          </span>
        </div>
      )}
    </Link>
  )
}
