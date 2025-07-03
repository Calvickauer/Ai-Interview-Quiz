'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import styles from './page.module.css'

interface Question {
  id: string
  prompt: string
  hint: string
  modelAnswer: string
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
  const [showHint, setShowHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

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

  useEffect(() => {
    if (questions.length && Object.keys(results).length === questions.length) {
      router.push(`/quiz/session/${id}/summary`)
    }
  }, [results, questions.length, router, id])

  if (loading) {
    return (
      <main className={styles.main}>
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<div class="tenor-gif-embed" data-postid="22865479" data-share-method="host" data-aspect-ratio="1" data-width="100%"><a href="https://tenor.com/view/uh-stand-by-randy-marsh-south-park-s13e6-pinewood-derby-gif-22865479">Uh Stand By Randy Marsh Sticker</a>from <a href="https://tenor.com/search/uh+stand+by-stickers">Uh Stand By Stickers</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>',
          }}
        />
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

  const correctCount = Object.values(results).filter((r) => r.correct).length
  const incorrectCount = Object.values(results).filter((r) => !r.correct).length
  const current = questions[index]
  const answered = !!results[current.id]

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
      <p className="mb-2">Correct: {correctCount} | Incorrect: {incorrectCount}</p>
      <div
        className={`${styles.card} ${answered ? (results[current.id].correct ? 'border-green-500' : 'border-red-500') : ''}`}
      >
        <p>{current.prompt}</p>
        {showHint && <p className="mt-2 italic">Hint: {current.hint}</p>}
        {showAnswer && <p className="mt-2">Answer: {current.modelAnswer}</p>}
      </div>
      <textarea
        className="border p-2 w-full max-w-lg mt-4"
        value={answers[current.id] || ''}
        onChange={(e) =>
          setAnswers((a) => ({ ...a, [current.id]: e.target.value }))
        }
      />
      <div className="flex flex-col gap-2 mt-2 w-full max-w-lg">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showHint}
            onChange={(e) => setShowHint(e.target.checked)}
          />
          Show Hint
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showAnswer}
            onChange={(e) => setShowAnswer(e.target.checked)}
          />
          Reveal Answer
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={explain}
            onChange={(e) => setExplain(e.target.checked)}
          />
          Request explanation
        </label>
      </div>
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
