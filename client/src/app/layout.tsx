import './globals.css'
import type { ReactNode } from 'react'
import Navbar from '../components/Navbar'
import Providers from '../components/Providers'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head></head>
      <body className="flex flex-col min-h-screen relative">
        <Providers>
          <video
            autoPlay
            muted
            loop
            className="fixed top-0 left-0  w-full h-full object-cover z-[-1]"
          >
            <source src="/Background.mp4" type="video/mp4" />
          </video>
          <Navbar />
          <div className="flex-grow flex flex-col items-center p-4">
            <div className="mx-auto mt-20 w-full max-w-2xl bg-white bg-opacity-70 backdrop-blur-md rounded shadow p-4">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
