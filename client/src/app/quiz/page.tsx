'use client'

import { useState } from 'react'
import AutocompleteInput from '../../components/AutocompleteInput'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import styles from './page.module.css'
import Loader from '../../components/Loader'
import {
  roleSuggestions,
  techStackSuggestions,
  technologySuggestions,
} from '../../lib/predictions'

export default function QuizStartPage() {
  const [role, setRole] = useState('')
  const [techStack, setTechStack] = useState('')
  const [technology, setTechnology] = useState('')
  const [listingDescription, setListingDescription] = useState('')
  const [jobDescriptionUrl, setJobDescriptionUrl] = useState('')
  const [multipleChoice, setMultipleChoice] = useState(false)
  const [proficiency, setProficiency] = useState('Medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { data: session } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    // Allow generating a quiz even if only the proficiency is selected
    // so users can try generic questions by difficulty alone

    const userId = session?.user?.id || ''

    console.log('Generating quiz')
    setLoading(true)
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role,
        techStack,
        technology,
        listingDescription,
        jobDescriptionUrl,
        multipleChoice,
        proficiency,
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
        <h1 className="text-2xl font-bold text-center">Create Quiz</h1>
        <AutocompleteInput
          id="role"
          label="Role"
          placeholder="Role (optional)"
          value={role}
          suggestions={roleSuggestions}
          onChange={setRole}
        />
        <AutocompleteInput
          id="techStack"
          label="Tech Stack"
          placeholder="Tech stack (optional)"
          value={techStack}
          suggestions={techStackSuggestions}
          onChange={setTechStack}
        />
        <AutocompleteInput
          id="technology"
          label="Technologies"
          placeholder="Technologies (optional)"
          value={technology}
          suggestions={technologySuggestions}
          onChange={setTechnology}
        />
        <label htmlFor="listing" className="block text-2xl">Listing Description</label>
        <textarea
          id="listing"
          placeholder="e.g. develop APIs, maintain infra (optional)"
          className="border p-2 w-full"
          value={listingDescription}
          onChange={(e) => setListingDescription(e.target.value)}
        />
        <label htmlFor="jobUrl" className="block text-2xl">Job Description URL</label>
        <input
          id="jobUrl"
          type="url"
          placeholder="e.g. https://example.com/job, https://jobs.site/id (optional)"
          className="border p-2 w-full"
          value={jobDescriptionUrl}
          onChange={(e) => setJobDescriptionUrl(e.target.value)}
        />
        <label htmlFor="proficiency" className="block text-2xl">Proficiency</label>
        <select
          id="proficiency"
          className="border p-2 w-full"
          value={proficiency}
          onChange={(e) => setProficiency(e.target.value)}
        >
          <option value="Beginner">Beginner</option>
          <option value="Medium">Medium</option>
          <option value="Advanced">Advanced</option>
        </select>
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
      {loading && (
        <div className="mt-4 text-center" data-testid="loading">
          <Loader />
          <p className="mt-2">Generating questions...</p>
        </div>
      )}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </main>
  )
}
