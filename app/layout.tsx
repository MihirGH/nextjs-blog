//components
import { Navbar } from './Navbar'

//fonts
import { inter } from '~/app/ui/font'

//types
import type { Metadata } from 'next'

//styles
import './globals.css'

export const metadata: Metadata = {
  title: "Mihir's Blog",
  description: 'Created by Mihir Shah',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50`}>
        <div className="bg-white">
          <Navbar />
        </div>
        <div className="mx-auto max-w-2xl py-8">{children}</div>
      </body>
    </html>
  )
}
