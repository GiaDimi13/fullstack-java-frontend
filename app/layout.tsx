import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '../components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Product Catalog',
  description: 'Your one-stop shop for all products',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

