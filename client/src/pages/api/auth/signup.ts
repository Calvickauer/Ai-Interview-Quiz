import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import prisma from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, password, username } = req.body as { email?: string; password?: string; username?: string }
  if (!email || !password || !username) return res.status(400).json({ error: 'Missing fields' })
  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ error: 'User exists' })
    const hashed = await bcrypt.hash(password, 10)
    const role = email.toLowerCase() === 'calvickauer@gmail.com' ? 'admin' : 'user'
    await prisma.user.create({ data: { email, password: hashed, username, role, isVerified: true } })
    res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Signup failed' })
  }
}
