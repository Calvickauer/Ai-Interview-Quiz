'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import styles from './page.module.css'

export default function ProfilePage() {
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [sessions, setSessions] = useState<any[]>([])
  const [editing, setEditing] = useState(false)
  const [apiAccess, setApiAccess] = useState(false)
  const [accessRequested, setAccessRequested] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user) {
      router.push('/login')
      return
    }
    fetch('/api/user/profile')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setUsername(data.username || '')
        setBio(data.bio || '')
        setAvatarUrl(data.avatarUrl || null)
        setSessions(data.sessions || [])
        setApiAccess(!!data.apiAccess)
        setAccessRequested(!!data.accessRequested)
      })
      .catch((err) => console.error('Profile fetch error', err))
  }, [router, session, status])

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

    console.log('Submitting profile', { username, bio })
    const res = await fetch('/api/user/update', {
      method: 'POST',
      body: form,
    })

    if (res.ok) {
      const data = await res.json()
      const url = data.user?.avatarUrl || data.avatarUrl
      if (url) setAvatarUrl(url)
      setAvatar(null)
      alert('Profile updated')
      setEditing(false)
    } else {
      alert('Profile update failed')
    }
  }

  const requestAccess = async () => {
    const res = await fetch('/api/user/request-token', { method: 'POST' })
    if (res.ok) {
      alert('Access requested')
      setAccessRequested(true)
    } else {
      alert('Request failed')
    }
  }

  return (
    <main className={styles.main}>
      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-4 text-center" encType="multipart/form-data">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          {avatarUrl && (
            <Image
              src={avatarUrl}
              alt="avatar"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full"
            />
          )}
          <label htmlFor="avatar" className="block">Avatar</label>
          <input
            id="avatar"
            aria-label="avatar"
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
          />
          <label htmlFor="username" className="block">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            className="border p-2 w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="bio" className="block">Bio</label>
          <textarea
            id="bio"
            placeholder="Bio"
            className="border p-2 w-full"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2">Save</button>
            <button type="button" className="px-4 py-2 border" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 text-center">
          {avatarUrl && (
            <Image
              src={avatarUrl}
              alt="avatar"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full mx-auto border-4 border-blue-500"
            />
          )}
          <h1 className="text-2xl font-semibold">{username}</h1>
          <p>{bio}</p>
          <button className="bg-blue-500 text-white px-4 py-2" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
          <div className="mt-4">
            {apiAccess ? (
              <p className="text-green-600 font-semibold">You have API access.</p>
            ) : accessRequested ? (
              <p className="text-yellow-600">Access request pending.</p>
            ) : (
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2"
                onClick={requestAccess}
              >
                Request API Access
              </button>
            )}
          </div>
        </div>
      )}
        {sessions.length > 0 && (
          <section className={styles.section}>
            <h2 className="text-xl font-semibold mb-2">Open Quizzes</h2>
            <ul className="space-y-1 mb-4">
              {sessions
                .filter((s) => s.answeredCount < s.totalQuestions)
                .map((s) => (
                  <li key={s.id}>
                    <Link className="underline" href={`/quiz/session/${s.id}`}>{`
                      ${s.role} - ${s.correctCount}/${s.totalQuestions} ${s.multipleChoice ? '(MC)' : '(Open)'}
                    `}</Link>
                  </li>
                ))}
            </ul>
            <h2 className="text-xl font-semibold mb-2">Finished Quizzes</h2>
            <ul className="space-y-1">
              {sessions
                .filter((s) => s.answeredCount === s.totalQuestions)
                .map((s) => (
                  <li key={s.id}>
                    <Link className="underline" href={`/quiz/session/${s.id}/summary`}>{`
                      ${s.role} - ${s.correctCount}/${s.totalQuestions} ${s.multipleChoice ? '(MC)' : '(Open)'}
                    `}</Link>
                  </li>
                ))}
            </ul>
          </section>
        )}
      </main>
    )
}
