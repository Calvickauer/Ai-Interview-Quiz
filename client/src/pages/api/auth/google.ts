import type { NextApiRequest, NextApiResponse } from 'next'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import prisma from '../../../lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { token } = req.body as { token?: string }
  if (!token) return res.status(400).json({ error: 'Missing token' })
  try {
    const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID })
    const payload = ticket.getPayload()
    const email = payload?.email
    if (!email) return res.status(400).json({ error: 'No email from Google' })
    let user = await prisma.user.findUnique({ where: { email } })
    const role = email.toLowerCase() === 'calvickauer@gmail.com' ? 'admin' : 'user'
    if (!user) {
      user = await prisma.user.create({
        data: { email, username: payload?.name || email, password: '', role, isVerified: true },
      })
    }
    if (!user.isVerified) {
      await prisma.user.update({ where: { id: user.id }, data: { isVerified: true } })
    }
    const jwtToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET)
    res.status(200).json({ token: jwtToken })
  } catch (err) {
    console.error('Google auth failed', err)
    res.status(500).json({ error: 'Google auth failed' })
  }
}
