//libs
import clsx from 'clsx'

//types
import type { ReactNode } from 'react'

export const Link = ({
  href,
  className,
  children,
  ariaLabel,
}: {
  href: string
  className?: string
  children: ReactNode
  ariaLabel?: string
}) => (
  <a
    href={href}
    className={clsx(
      'cursor-pointer text-muted-foreground hover:text-foreground transition-colors',
      className,
    )}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={ariaLabel}
  >
    {children}
  </a>
)
