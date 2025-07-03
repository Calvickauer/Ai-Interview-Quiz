import prisma from './db'

export async function enforceQuizQuota(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('User not found')
  if (user.role === 'admin') return
  const count = await prisma.session.count({ where: { userId } })
  if (count >= 5) {
    throw new Error('Quiz limit reached')
  }
}
