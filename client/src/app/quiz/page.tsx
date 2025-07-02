'use client'

import { useState } from 'react'

export default function QuizStartPage() {
  const [role, setRole] = useState('')
  const [techStack, setTechStack] = useState('')
  const [technology, setTechnology] = useState('')
  const [listingDescription, setListingDescription] = useState('')
  const [jobDescriptionUrl, setJobDescriptionUrl] = useState('')
  const [questions, setQuestions] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role,
        techStack,
        technology,
        listingDescription,
        jobDescriptionUrl,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      setQuestions(data.questions)
    } else {
      alert('Failed to start quiz')
    }
  }

  return (
    <main className="flex flex-col min-h-screen items-center p-4">
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full">
          Generate Quiz
        </button>
      </form>
      {questions && (
        <div className="mt-6 whitespace-pre-line w-full max-w-md border p-4">
          {questions}
        </div>
      )}
    </main>
  )
}
