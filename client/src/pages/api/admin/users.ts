import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  const userId = req.headers['x-user-id'] as string | undefined
  if (!userId) return res.status(401).json({ error: 'Missing user id' })

  const requester = await prisma.user.findUnique({ where: { id: userId } })
  if (!requester || requester.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const users = await prisma.user.findMany({
    include: { sessions: true },
  })
  res.status(200).json({ users })
}
