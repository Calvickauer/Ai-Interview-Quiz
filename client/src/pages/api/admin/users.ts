import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const userId = session?.user?.id as string | undefined
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  const requester = await prisma.user.findUnique({ where: { id: userId } })
  if (!requester || requester.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' })
  }

  if (req.method === 'GET') {
    const users = await prisma.user.findMany({
      include: { sessions: true },
    })
    return res.status(200).json({ users })
  }

  if (req.method === 'PATCH') {
    const { id, apiAccess } = req.body as { id?: string; apiAccess?: boolean }
    if (!id || apiAccess === undefined) {
      return res.status(400).json({ error: 'Missing parameters' })
    }
    await prisma.user.update({
      where: { id },
      data: { apiAccess, accessRequested: false },
    })
    return res.status(200).json({ success: true })
  }

  res.status(405).end()
}
