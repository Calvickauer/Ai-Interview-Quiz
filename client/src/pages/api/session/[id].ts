import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid session id' })
  }

  try {
    const session = await prisma.session.findUnique({
      where: { id },
      include: { questions: true },
    })
    if (!session) {
      return res.status(404).json({ error: 'Session not found' })
    }
    res.status(200).json(session)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch session' })
  }
}
