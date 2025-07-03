'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
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
    <nav className="bg-gray-800 text-white p-4 flex flex-col sm:flex-row items-center sm:justify-between gap-2">
      <div className="w-full flex justify-between items-center">
        <div className="text-lg font-bold">AI Quizzer</div>
        <button
          className="sm:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>
      <div
        className={`${
          menuOpen ? 'flex' : 'hidden'
        } flex-col sm:flex sm:flex-row gap-4 items-center w-full sm:w-auto`}
      >
        <Link href="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        {loggedIn ? (
          <>
            <Link href="/profile" onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
            <Link href="/quiz" onClick={() => setMenuOpen(false)}>
              Quiz
            </Link>
            {avatarUrl && (
              <img src={avatarUrl} alt="avatar" className="h-8 w-8 rounded-full" />
            )}
            {username && <span className="ml-1">{username}</span>}
            <button
              onClick={() => {
                setMenuOpen(false)
                handleSignOut()
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link href="/signup" onClick={() => setMenuOpen(false)}>
              Sign Up
            </Link>
            <Link href="/quiz" onClick={() => setMenuOpen(false)}>
              Quiz
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
