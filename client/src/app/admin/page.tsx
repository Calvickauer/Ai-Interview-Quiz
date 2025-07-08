'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import styles from '../profile/page.module.css'

interface User {
  id: string
  email: string
  username: string
  apiAccess: boolean
  accessRequested: boolean
  sessions: { id: string; role: string }[]
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) { router.push('/login'); return }
    fetch('/api/admin/users')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setUsers(data.users))
      .catch(() => router.replace('/'))
  }, [router, session, status])

  const updateAccess = async (id: string, grant: boolean) => {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, apiAccess: grant }),
    })
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, apiAccess: grant, accessRequested: false } : u
        )
      )
    } else {
      alert('Update failed')
    }
  }

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
            <div className="mt-2">
              {u.apiAccess ? (
                <button
                  className="px-2 py-1 bg-red-500 text-white"
                  onClick={() => updateAccess(u.id, false)}
                >
                  Revoke Access
                </button>
              ) : (
                <button
                  className="px-2 py-1 bg-green-500 text-white"
                  onClick={() => updateAccess(u.id, true)}
                >
                  {u.accessRequested ? 'Approve Request' : 'Grant Access'}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
