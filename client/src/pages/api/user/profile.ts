import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`[API] ${req.method} ${req.url}`)
  if (req.method !== 'GET') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  const userId = session?.user?.id as string | undefined
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sessions: {
          include: { questions: { select: { userCorrect: true } } },
        },
      },
    })
    if (!user) return res.status(404).json({ error: 'User not found' })

    res.status(200).json({
      username: user.username,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      role: user.role,
      apiAccess: user.apiAccess,
      accessRequested: user.accessRequested,
      sessions: user.sessions.map((s) => ({
        id: s.id,
        role: s.role,
        multipleChoice: s.multipleChoice,
        totalQuestions: s.totalQuestions,
        correctCount: s.correctCount,
        answeredCount: s.questions.filter(
          (q) => q.userCorrect !== null && q.userCorrect !== undefined
        ).length,
      })),
    })
  } catch (err) {
    console.error('PROFILE ERROR:', err)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
}
