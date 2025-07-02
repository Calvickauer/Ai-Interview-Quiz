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
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [results, setResults] = useState<Record<string, { correct: boolean; explanation?: string }>>({})
  const [explain, setExplain] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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

  const handleCheck = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: current.id,
          answer: answers[current.id] || '',
          explain,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setResults((r) => ({ ...r, [current.id]: data }))
      } else {
        alert('Failed to check answer')
      }
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <p>{current.prompt}</p>
      </div>
      <textarea
        className="border p-2 w-full max-w-lg mt-4"
        value={answers[current.id] || ''}
        onChange={(e) =>
          setAnswers((a) => ({ ...a, [current.id]: e.target.value }))
        }
      />
      <label className="mt-2 flex items-center gap-2">
        <input
          type="checkbox"
          checked={explain}
          onChange={(e) => setExplain(e.target.checked)}
        />
        Request explanation
      </label>
      <button
        onClick={handleCheck}
        disabled={submitting}
        className="bg-green-500 text-white px-3 py-1 mt-2 disabled:opacity-50"
      >
        Check Answer
      </button>
      {results[current.id] && (
        <div className={styles.feedback}>
          <p
            className={`font-bold ${results[current.id].correct ? 'text-green-600' : 'text-red-600'}`}
          >
            {results[current.id].correct ? 'Correct' : 'Incorrect'}
          </p>
          {results[current.id].explanation && (
            <p className="mt-2">{results[current.id].explanation}</p>
          )}
        </div>
      )}
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
