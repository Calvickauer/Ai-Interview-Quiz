'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
    }
  }, [router])

  return (
    <main className={styles.main}>
      <h1 className="text-2xl font-bold">Quiz Dashboard</h1>
    </main>
  )
}
