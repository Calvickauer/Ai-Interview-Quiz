'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import styles from './page.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    if (res?.error) {
      alert('Login failed')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <main className={styles.main}>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold">Login</h1>
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
            Login
          </button>
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2"
            onClick={() => {
              console.log('login with google')
              signIn('google', { callbackUrl: '/dashboard' })
            }}
          >
            Sign in with Google
          </button>
        </div>
      </form>
    </main>
  )
}
