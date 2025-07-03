'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const [loggedIn, setLoggedIn] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('user')
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (pathname === '/loading') return
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
            if (data.role) setRole(data.role)
          }
        })
        .catch(() => {})
    }
  }, [pathname])

  if (pathname === '/loading') return null

  const handleSignOut = async () => {
    localStorage.removeItem('token')
    await fetch('/api/auth', { method: 'DELETE' })
    setLoggedIn(false)
    router.push('/login')
  }

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="w-full flex justify-between items-center">
          <Link href="/" className="text-lg font-bold" onClick={() => setMenuOpen(false)}>
            AI Quizzer
          </Link>
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
        } w-full flex-col sm:flex-row sm:flex items-center gap-12 sm:w-auto`}
      >
        <Link href="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        {loggedIn ? (
          <>
            <Link href="/quiz" onClick={() => setMenuOpen(false)}>
              Quiz
            </Link>
            <Link href="/profile" onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
            {role === 'admin' && (
              <Link href="/admin" onClick={() => setMenuOpen(false)}>
                Admin
              </Link>
            )}
            {(avatarUrl || username) && (
              <Link
                href="/profile"
                className="flex items-center gap-1"
                onClick={() => setMenuOpen(false)}
              >
                {avatarUrl && (
                  <img src={avatarUrl} alt="avatar" className="h-8 w-8 rounded-full" />
                )}
                {username && <span>{username}</span>}
              </Link>
            )}
            <button
              onClick={() => {
                setMenuOpen(false)
                handleSignOut()
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link href="/signup" onClick={() => setMenuOpen(false)}>
              Signup
            </Link>
            <Link href="/quiz" onClick={() => setMenuOpen(false)}>
              Quiz
            </Link>
          </>
        )}
      </div>
      </div>
    </nav>
  )
}
