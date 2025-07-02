'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import styles from './page.module.css'

interface Question {
  id: string
  prompt: string
}

export default function QuizSessionPage() {
  const params = useParams() as Record<string, string>
  const id = params.id
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/session/${id}`)
        if (res.ok) {
          const data = await res.json()
          setQuestions(data.questions)
        } else {
          router.replace('/quiz')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [id, router])

  if (loading) {
    return (
      <main className={styles.main}>
        <p>Loading session...</p>
      </main>
    )
  }

  if (!questions.length) {
    return (
      <main className={styles.main}>
        <p>No questions found.</p>
      </main>
    )
  }

  const current = questions[index]
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <p>{current.prompt}</p>
      </div>
      <div className={styles.buttons}>
        <button
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="px-3 py-1 bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={index === questions.length - 1}
          onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
          className="px-3 py-1 bg-blue-500 text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  )
}
