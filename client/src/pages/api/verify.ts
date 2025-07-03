import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import prisma from '../../lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, code } = req.body as { email?: string; code?: string }
  if (!email || !code) return res.status(400).json({ error: 'Invalid request' })
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || user.verificationCode !== code) {
    return res.status(400).json({ error: 'Invalid code' })
  }
  await prisma.user.update({ where: { id: user.id }, data: { isVerified: true, verificationCode: null } })
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET)
  res.status(200).json({ token })
}
