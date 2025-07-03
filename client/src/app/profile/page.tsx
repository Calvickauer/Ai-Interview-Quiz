'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function ProfilePage() {
  const [avatar, setAvatar] = useState<File | null>(null)
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [sessions, setSessions] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    const userId = JSON.parse(atob(token.split('.')[1])).id
    fetch('/api/user/profile', {
      headers: { 'x-user-id': userId },
    })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        console.log('Loaded profile', data)
        setUsername(data.username || '')
        setBio(data.bio || '')
        setSessions(data.sessions || [])
      })
      .catch((err) => console.error('Profile fetch error', err))
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!avatar) {
      alert('Please select an avatar')
      return
    }
    const form = new FormData()
    form.append('avatar', avatar)
    form.append('username', username)
    form.append('bio', bio)

    const token = localStorage.getItem('token')
    console.log('Submitting profile', { username, bio })
    const res = await fetch('/api/user/update', {
      method: 'POST',
      headers: {
        'x-user-id': token ? JSON.parse(atob(token.split('.')[1])).id : ''
      },
      body: form,
    })

    if (res.ok) {
      router.push('/quiz')
    } else {
      alert('Profile update failed')
    }
  }

    return (
      <main className={styles.main}>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <input
            aria-label="avatar"
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
          />
          <input
            type="text"
            placeholder="Username"
            className="border p-2 w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <textarea
            placeholder="Bio"
            className="border p-2 w-full"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">Save</button>
        </form>
        {sessions.length > 0 && (
          <section className="mt-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Quiz History</h2>
            <ul className="space-y-1">
              {sessions.map((s) => (
                <li key={s.id}>
                  {s.role} - {s.correctCount}/{s.totalQuestions}{' '}
                  {s.multipleChoice ? '(MC)' : '(Open)'}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    )
}
