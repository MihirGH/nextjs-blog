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
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👨🏽‍💻</text></svg>"
        />
      </head>
      <body className={`${inter.className} bg-slate-50 px-3`}>
        <div className="bg-white">
          <Navbar />
        </div>
        <div className="mx-auto max-w-2xl py-8">{children}</div>
      </body>
    </html>
  )
}
