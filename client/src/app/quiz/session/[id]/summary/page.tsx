'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Loader from '../../../../../components/Loader'
import styles from './page.module.css'

interface Question {
  id: string
  prompt: string
  userCorrect?: boolean
}

interface SessionData {
  questions: Question[]
  correctCount: number
  totalQuestions: number
}

export default function QuizSummaryPage() {
  const params = useParams() as Record<string, string>
  const id = params.id
  const router = useRouter()
  const [data, setData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const handleRetake = async () => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/session/${id}/reset`, { method: 'POST' })
      if (res.ok) {
        router.push(`/quiz/session/${id}`)
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleNew = async () => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/session/${id}/new`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        router.push(`/quiz/session/${data.sessionId}`)
      }
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch(`/api/session/${id}`)
      if (res.ok) {
        setData(await res.json())
      }
      setLoading(false)
    }
    fetchSession()
  }, [id])

  if (loading) {
    return (
      <main className={styles.main}>
        <p>Loading summary...</p>
      </main>
    )
  }

  if (!data) {
    return (
      <main className={styles.main}>
        <p>Session not found.</p>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <h1 className="text-2xl font-bold mb-4">Quiz Summary</h1>
      <p className="mb-4">
        Correct {data.correctCount} of {data.totalQuestions}
      </p>
      <ul className="space-y-2 w-full max-w-lg">
        {data.questions.map((q) => (
          <li
            key={q.id}
            className={`${styles.card} ${q.userCorrect ? 'border-green-500' : 'border-red-500'}`}
          >
            <p>{q.prompt}</p>
            <p className="font-bold">
              {q.userCorrect ? 'Correct' : 'Incorrect'}
            </p>
          </li>
        ))}
      </ul>
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleRetake}
          disabled={actionLoading}
          className="bg-blue-500 text-white px-3 py-1 disabled:opacity-50"
        >
          Retake Quiz
        </button>
        <button
          onClick={handleNew}
          disabled={actionLoading}
          className="bg-green-500 text-white px-3 py-1 disabled:opacity-50"
        >
          New Questions
        </button>
      </div>
      {actionLoading && (
        <div className="flex flex-col items-center mt-4" data-testid="action-loading">
          <Loader />
          <p className="mt-2">Loading...</p>
        </div>
      )}
    </main>
  )
}
