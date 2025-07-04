'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import styles from './page.module.css'

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.replace('/login')
    }
  }, [router, session, status])

  return (
    <main className={styles.main}>
      <h1 className="text-2xl font-bold">Quiz Dashboard</h1>
    </main>
  )
}
