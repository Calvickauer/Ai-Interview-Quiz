import type { NextApiRequest, NextApiResponse } from 'next'
import { openai } from '../../lib/openai'
import prisma from '../../lib/db'
import { enforceQuizQuota } from '../../lib/quota'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

interface QuizRequest {
  role?: string
  techStack?: string
  technology?: string
  listingDescription?: string
  jobDescriptionUrl?: string
  multipleChoice?: boolean
  proficiency?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(`[API] ${req.method} ${req.url}`)
  const {
    role,
    techStack,
    technology,
    listingDescription,
    jobDescriptionUrl,
    multipleChoice = false,
    proficiency = 'Medium',
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

  const session = await getServerSession(req, res, authOptions)
  const userId = session?.user?.id as string | undefined
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || (!user.apiAccess && user.role !== 'admin')) {
    return res.status(403).json({ error: 'API access required' })
  }

  try {
    await enforceQuizQuota(userId)
  } catch (err) {
    return res.status(403).json({ error: err.message })
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
    `Difficulty: ${proficiency}.\n` +
    (multipleChoice
      ? '\nReturn JSON array where each item has "prompt", "hint", "answer", and "options" (an array of 6 strings with the first option as the correct answer). Ensure the options are similar in length and detail so the correct option is not obviously longer.'
      : '\nReturn JSON array where each item has "prompt", "hint", and "answer".')

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an interview prep assistant.' },
        { role: 'user', content: prompt },
      ],
    })

    let raw = completion.choices[0].message?.content || '[]'
    raw = raw.replace(/```[a-z]*\n?/, '').replace(/```/g, '').trim()
    console.log('Raw AI response:', raw)
    const questions = JSON.parse(raw)
    console.log('Parsed questions:', questions)
    const shuffle = (arr: any[]) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }
    const prompts = Array.isArray(questions) ? questions : []

    const session = await prisma.session.create({
      data: {
        userId,
        role: role || 'developer',
        proficiency,
        multipleChoice,
        totalQuestions: prompts.length,
        correctCount: 0,
        questions: {
          create: prompts.map((p: any) => {
            let opts = p.options ? [...p.options] : null
            if (opts) {
              opts = opts.map((o: string) => o.trim())
              // ensure the full answer is selectable by replacing the first
              // option with the answer text before shuffling
              if (p.answer) {
                opts[0] = p.answer.trim()
              }
              const others = opts.slice(1)
              if (others.length) {
                const avg = others.reduce((a, b) => a + b.length, 0) / others.length
                if (opts[0].length > avg * 1.5) {
                  const shortened = opts[0]
                    .slice(0, Math.ceil(avg * 1.2))
                    .replace(/\s+\S*$/, '')
                  opts[0] = `${shortened}...`
                }
              }
              shuffle(opts)
            }
            return {
              prompt: p.prompt || p,
              hint: p.hint || '',
              modelAnswer: p.answer || '',
              options: opts ? JSON.stringify(opts) : null,
            }
          }),
        },
      },
    })

    res.status(200).json({ sessionId: session.id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to generate questions' })
  }
}
