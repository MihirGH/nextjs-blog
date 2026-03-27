import Link from 'next/link'

//types
import { ReactNode } from 'react'

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      {children}
      <Link
        href="/"
        className="text-link hover:text-foreground transition-colors mt-4 inline-block font-mono text-sm"
      >
        ← Back home
      </Link>
    </div>
  )
}
