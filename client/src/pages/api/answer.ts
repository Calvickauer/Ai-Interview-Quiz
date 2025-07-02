import type { NextApiRequest, NextApiResponse } from 'next'
import { openai } from '../../lib/openai'
import prisma from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { questionId, answer, explain } = req.body as {
    questionId?: string
    answer?: string
    explain?: boolean
  }

  if (!questionId || !answer) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  try {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { session: true },
    })
    if (!question) {
      return res.status(404).json({ error: 'Question not found' })
    }

    const prompt = `You are an expert technical interviewer evaluating a candidate's answer.\\n` +
      `Question: ${question.prompt}\\n` +
      `Candidate Answer: ${answer}\\n` +
      `Respond in JSON with \\"correct\\" (true or false)` +
      (explain ? ` and \\"explanation\\" describing why.` : '.')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    })

    const parsed = JSON.parse(completion.choices[0].message?.content || '{}')
    const correct = !!parsed.correct
    await prisma.question.update({
      where: { id: questionId },
      data: { userCorrect: correct },
    })
    if (correct) {
      await prisma.session.update({
        where: { id: question.sessionId },
        data: { correctCount: { increment: 1 } },
      })
    }

    res.status(200).json({ correct, explanation: parsed.explanation })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to check answer' })
  }
}
