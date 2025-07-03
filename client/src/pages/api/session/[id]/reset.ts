import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  const { id } = req.query
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid session id' })
  }
  try {
    await prisma.question.updateMany({
      where: { sessionId: id },
      data: { userCorrect: null },
    })
    await prisma.session.update({
      where: { id },
      data: { correctCount: 0 },
    })
    res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to reset session' })
  }
}
