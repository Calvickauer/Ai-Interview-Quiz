'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('token'))
  }, [])

  const handleSignOut = async () => {
    localStorage.removeItem('token')
    await fetch('/api/auth', { method: 'DELETE' })
    setLoggedIn(false)
    router.push('/login')
  }

  return (
    <nav className="bg-gray-800 text-white p-4 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
      <div className="text-lg font-bold">AI Quizzer</div>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Link href="/">Home</Link>
        {loggedIn ? (
          <>
            <Link href="/profile">Profile</Link>
            <Link href="/quiz">Quiz</Link>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
            <Link href="/quiz">Quiz</Link>
          </>
        )}
      </div>
    </nav>
  )
}
