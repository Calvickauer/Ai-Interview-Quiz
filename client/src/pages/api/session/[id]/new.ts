import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/db'
import { openai } from '../../../../lib/openai'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  const { id } = req.query
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid session id' })
  }
  try {
    const session = await prisma.session.findUnique({ where: { id } })
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }

    const prompt = `Generate 5 interview questions for a ${session.role} role.\n` +
      (session.multipleChoice
        ? '\nReturn JSON array where each item has "prompt", "hint", "answer", and "options" (an array of 6 strings with the first option as the correct answer).'
        : '\nReturn JSON array where each item has "prompt", "hint", and "answer".')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an interview prep assistant.' },
        { role: 'user', content: prompt },
      ],
    })

    let raw = completion.choices[0].message?.content || '[]'
    raw = raw.replace(/```[a-z]*\n?/, '').replace(/```/g, '').trim()
    const questions = JSON.parse(raw)
    const shuffle = (arr: any[]) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }
    const prompts = Array.isArray(questions) ? questions : []

    const newSession = await prisma.session.create({
      data: {
        userId: session.userId,
        role: session.role,
        multipleChoice: session.multipleChoice,
        totalQuestions: prompts.length,
        correctCount: 0,
        questions: {
          create: prompts.map((p: any) => {
            const opts = p.options ? [...p.options] : null
            if (opts) shuffle(opts)
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

    res.status(200).json({ sessionId: newSession.id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create new session' })
  }
}
