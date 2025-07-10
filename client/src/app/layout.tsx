import './globals.css'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import Providers from '../components/Providers'

export const metadata: Metadata = {
  title: 'AI Quizzer',
  description:
    'Generate AI-powered interview quizzes tailored to your desired role or skillset.',
  icons: {
    icon: '/Favicon.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Favicon.png" />
      </head>
      <body className="flex flex-col min-h-screen relative font-body">
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
            <div className="mx-auto w-full max-w-2xl bg-white bg-opacity-70 backdrop-blur-md rounded shadow p-5">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
