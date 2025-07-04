'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import styles from './page.module.css'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    })
    if (res.ok) {
      await signIn('credentials', { redirect: false, email, password })
      router.push('/profile')
    } else {
      alert('Signup failed')
    }
  }

  return (
    <main className={styles.main}>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <label htmlFor="username" className="block">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Username"
          className="border p-2 w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="email" className="block">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password" className="block">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-center gap-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Sign Up
          </button>
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2"
            onClick={() => signIn('google', { callbackUrl: '/profile' })}
          >
            Sign up with Google
          </button>
        </div>
      </form>
    </main>
  )
}
