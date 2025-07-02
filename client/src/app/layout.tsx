import './globals.css'
import type { ReactNode } from 'react'
import Navbar from '../components/Navbar'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
