//components
import { Navbar } from './Navbar'

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
      <body className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto max-w-3xl px-6 py-16">
          <section
            className="mb-16 animate-fade-in"
            style={{ opacity: 0, animationDelay: '0ms' }}
          >
            {children}
          </section>
        </main>
      </body>
    </html>
  )
}
