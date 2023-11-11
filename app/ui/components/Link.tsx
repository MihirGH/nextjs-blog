//libs
import clsx from 'clsx'

//types
import type { ReactNode } from 'react'

export const Link = ({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: ReactNode
}) => (
  <a
    href={href}
    className={clsx(
      'cursor-pointer hover:text-blue-400 hover:underline',
      className
    )}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
)
