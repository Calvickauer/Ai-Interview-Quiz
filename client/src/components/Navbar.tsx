'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const isLogged = !!token
    setLoggedIn(isLogged)
    if (isLogged) {
      const id = JSON.parse(atob(token!.split('.')[1])).id
      fetch('/api/user/profile', { headers: { 'x-user-id': id } })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) {
            setAvatarUrl(data.avatarUrl || null)
            setUsername(data.username || '')
          }
        })
        .catch(() => {})
    }
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
            {avatarUrl && (
              <img src={avatarUrl} alt="avatar" className="h-8 w-8 rounded-full" />
            )}
            {username && <span className="ml-1">{username}</span>}
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
