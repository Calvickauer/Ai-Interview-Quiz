import type { NextApiRequest, NextApiResponse } from 'next'
import { openai } from '../../../shared/openai'

interface QuizRequest {
  role?: string
  techStack?: string
  technology?: string
  listingDescription?: string
  jobDescriptionUrl?: string
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
  } = req.body as QuizRequest

  let jobDescription = ''
  if (jobDescriptionUrl) {
    try {
      const resp = await fetch(jobDescriptionUrl)
      jobDescription = await resp.text()
    } catch (err) {
      console.error('Failed to fetch job description', err)
    }
  }

  const prompt = `Generate 5 interview questions for a ${role || 'developer'} role.\n` +
    (techStack ? `Tech Stack: ${techStack}.\n` : '') +
    (technology ? `Technologies: ${technology}.\n` : '') +
    (listingDescription ? `Listing Description: ${listingDescription}.\n` : '') +
    (jobDescription ? `Job Description: ${jobDescription.slice(0, 1000)}\n` : '')

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an interview prep assistant.' },
        { role: 'user', content: prompt },
      ],
    })
    res
      .status(200)
      .json({ questions: completion.data.choices[0].message?.content })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to generate questions' })
  }
}
