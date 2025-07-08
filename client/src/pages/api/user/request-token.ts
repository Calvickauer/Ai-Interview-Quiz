import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const session = await getServerSession(req, res, authOptions)
  const userId = session?.user?.id as string | undefined
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { accessRequested: true },
    })
    res.status(200).json({ success: true })
  } catch (err) {
    console.error('TOKEN REQUEST ERROR:', err)
    res.status(500).json({ error: 'Failed to request access' })
  }
}
