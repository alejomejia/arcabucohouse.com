import Link from 'next/link'

import { cn } from '@/lib/utils/helpers'

export default function NotFound() {
  return (
    <div
      className={cn(
        'mx-auto my-4 flex max-w-xl flex-col items-center',
        'rounded-lg border border-neutral-200 bg-white p-8',
        'md:p-12',
        'dark:border-neutral-800 dark:bg-black'
      )}
    >
      <h2 className="text-xl font-bold">Page Not Found</h2>
      <p className="my-2 text-center">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/"
        className={cn(
          'mx-auto mt-4 flex w-full items-center justify-center',
          'rounded-full bg-blue-600 p-4',
          'tracking-wide text-white',
          'hover:opacity-90'
        )}
      >
        Go Back Home
      </Link>
    </div>
  )
}
