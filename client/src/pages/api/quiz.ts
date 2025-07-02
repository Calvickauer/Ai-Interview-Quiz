import type { NextApiRequest, NextApiResponse } from 'next'
import { openai } from '../../../shared/openai'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { role } = req.body
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an interview prep assistant.' },
        { role: 'user', content: `Generate 5 ${role} interview questions.` },
      ],
    })
    res.status(200).json({ questions: completion.data.choices[0].message?.content })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to generate questions' })
  }
}
