'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from '../page.module.css'

export default function VerifyPage() {
  const params = useSearchParams()
  const email = params?.get('email') || ''
  const [code, setCode] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    })
    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('token', data.token)
      router.push('/profile')
    } else {
      alert('Verification failed')
    }
  }

  return (
    <main className={styles.main}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-2xl font-bold">Verify Email</h1>
        <p>Enter the code sent to {email}</p>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="12345"
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Verify
        </button>
      </form>
    </main>
  )
}
