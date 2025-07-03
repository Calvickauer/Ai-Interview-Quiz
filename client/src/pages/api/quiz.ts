import type { NextApiRequest, NextApiResponse } from 'next'
import { openai } from '../../lib/openai'
import prisma from '../../lib/db'

interface QuizRequest {
  role?: string
  techStack?: string
  technology?: string
  listingDescription?: string
  jobDescriptionUrl?: string
  multipleChoice?: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    role,
    techStack,
    technology,
    listingDescription,
    jobDescriptionUrl,
    multipleChoice = false,
  } = req.body as QuizRequest

  if (
    !role &&
    !techStack &&
    !technology &&
    !listingDescription &&
    !jobDescriptionUrl
  ) {
    return res.status(400).json({ error: 'No quiz parameters provided' })
  }

  const userId = req.headers['x-user-id'] as string | undefined
  if (!userId) {
    return res.status(401).json({ error: 'Missing user id' })
  }

  let jobDescription = ''
  if (jobDescriptionUrl) {
    try {
      const url = new URL(jobDescriptionUrl)
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new Error('Invalid protocol')
      }
      const resp = await fetch(jobDescriptionUrl)
      jobDescription = await resp.text()
    } catch (err) {
      console.error('Failed to fetch job description', err)
      return res.status(400).json({ error: 'Invalid job description URL' })
    }
  }

  const prompt = `Generate 5 interview questions for a ${role || 'developer'} role.\n` +
    (techStack ? `Tech Stack: ${techStack}.\n` : '') +
    (technology ? `Technologies: ${technology}.\n` : '') +
    (listingDescription ? `Listing Description: ${listingDescription}.\n` : '') +
    (jobDescription ? `Job Description: ${jobDescription.slice(0, 1000)}\n` : '') +
    (multipleChoice
      ? '\nReturn JSON array where each item has "prompt", "hint", "answer", and "options" (an array of 6 strings with the first option as the correct answer).'
      : '\nReturn JSON array where each item has "prompt", "hint", and "answer".')

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an interview prep assistant.' },
        { role: 'user', content: prompt },
      ],
    })

    const raw = completion.choices[0].message?.content || '[]'
    const parsed = JSON.parse(raw)
    const prompts = Array.isArray(parsed) ? parsed : []

    const session = await prisma.session.create({
      data: {
        userId,
        role: role || 'developer',
        multipleChoice,
        totalQuestions: prompts.length,
        correctCount: 0,
        questions: {
          create: prompts.map((p: any) => ({
            prompt: p.prompt || p,
            hint: p.hint || '',
            modelAnswer: p.answer || '',
            options: p.options ? JSON.stringify(p.options) : null,
          })),
        },
      },
    })

    res.status(200).json({ sessionId: session.id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to generate questions' })
  }
}
