import './globals.css'
import type { ReactNode } from 'react'
import Navbar from '../components/Navbar'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen relative">
        <video
          autoPlay
          muted
          loop
          className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
        >
          <source src="/Background.mp4" type="video/mp4" />
        </video>
        <Navbar />
        <div className="flex-grow flex flex-col items-center p-4">
          <div className="flex flex-col flex-grow w-full max-w-4xl bg-white bg-opacity-80 backdrop-blur-md rounded shadow p-4">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
