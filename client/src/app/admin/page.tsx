'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../profile/page.module.css'

interface User {
  id: string
  email: string
  username: string
  sessions: { id: string; role: string }[]
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    const userId = JSON.parse(atob(token.split('.')[1])).id
    fetch('/api/admin/users', { headers: { 'x-user-id': userId } })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => setUsers(data.users))
      .catch(() => router.replace('/'))
  }, [router])

  return (
    <main className={styles.main}>
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id} className="mb-4">
            <p className="font-semibold">{u.username || u.email}</p>
            <ul className="ml-4 list-disc">
              {u.sessions.map((s) => (
                <li key={s.id}>{s.role}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  )
}
