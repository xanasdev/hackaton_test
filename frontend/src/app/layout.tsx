import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Caspian Clean Map',
  description: 'Interactive pollution tracking platform for the Caspian Sea coastal region',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased dark">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
