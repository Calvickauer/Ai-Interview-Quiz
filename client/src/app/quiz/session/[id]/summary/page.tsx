'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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
  const [data, setData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)

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
    </main>
  )
}
