'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function QuizStartPage() {
  const [role, setRole] = useState('')
  const [techStack, setTechStack] = useState('')
  const [technology, setTechnology] = useState('')
  const [listingDescription, setListingDescription] = useState('')
  const [jobDescriptionUrl, setJobDescriptionUrl] = useState('')
  const [multipleChoice, setMultipleChoice] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (
      !role &&
      !techStack &&
      !technology &&
      !listingDescription &&
      !jobDescriptionUrl
    ) {
      setError('Please provide at least one field to generate questions.')
      return
    }

    const token = localStorage.getItem('token')
    const userId = token ? JSON.parse(atob(token.split('.')[1])).id : ''

    setLoading(true)
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId,
      },
      body: JSON.stringify({
        role,
        techStack,
        technology,
        listingDescription,
        jobDescriptionUrl,
        multipleChoice,
      }),
    })
    setLoading(false)

    if (res.ok) {
      const data = await res.json()
      router.push(`/quiz/session/${data.sessionId}`)
    } else {
      const err = await res.json()
      setError(err.error || 'Failed to start quiz')
    }
  }

  return (
    <main className={styles.main}>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-bold">Start Quiz</h1>
        <input
          type="text"
          placeholder="Role"
          className="border p-2 w-full"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tech Stack"
          className="border p-2 w-full"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
        />
        <input
          type="text"
          placeholder="Technologies"
          className="border p-2 w-full"
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
        />
        <textarea
          placeholder="Listing Description"
          className="border p-2 w-full"
          value={listingDescription}
          onChange={(e) => setListingDescription(e.target.value)}
        />
        <input
          type="url"
          placeholder="Job Description URL"
          className="border p-2 w-full"
          value={jobDescriptionUrl}
          onChange={(e) => setJobDescriptionUrl(e.target.value)}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={multipleChoice}
            onChange={(e) => setMultipleChoice(e.target.checked)}
          />
          Multiple Choice (6 options)
        </label>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full">
          Generate Quiz
        </button>
      </form>
      {loading && <p className="mt-4">Generating questions...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </main>
  )
}
