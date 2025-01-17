'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'
import PublicHeader from '@/components/PublicHeader'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {!isDashboard && <PublicHeader />}
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
