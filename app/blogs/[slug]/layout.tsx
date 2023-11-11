import Link from 'next/link'
//types
import { ReactNode } from 'react'

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      {children}
      <Link href="/" className="py-10 text-blue-400 hover:underline">
        &larr; Back to Home
      </Link>
    </div>
  )
}
