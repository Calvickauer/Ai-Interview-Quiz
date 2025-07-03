'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import Loader from '../../components/Loader'
import styles from './page.module.css'

export default function LoadingScreen() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }
    const userId = JSON.parse(atob(token.split('.')[1])).id
    fetch('/api/user/profile', { headers: { 'x-user-id': userId } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(() => {
        const next = params?.get('next') || '/dashboard'
        router.replace(next)
      })
      .catch(() => {
        localStorage.removeItem('token')
        router.replace('/login')
      })
  }, [router, params])

  return (
    <main className={styles.main}>
      <Loader />
      <p className="mt-2">Loading profile...</p>
    </main>
  )
}
