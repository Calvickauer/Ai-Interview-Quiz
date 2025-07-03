'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

  const handleRetake = async () => {
    const res = await fetch(`/api/session/${id}/reset`, { method: 'POST' })
    if (res.ok) {
      router.push(`/quiz/session/${id}`)
    }
  }

  const handleNew = async () => {
    const res = await fetch(`/api/session/${id}/new`, { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      router.push(`/quiz/session/${data.sessionId}`)
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
          className="bg-blue-500 text-white px-3 py-1"
        >
          Retake Quiz
        </button>
        <button
          onClick={handleNew}
          className="bg-green-500 text-white px-3 py-1"
        >
          New Questions
        </button>
      </div>
    </main>
  )
}
