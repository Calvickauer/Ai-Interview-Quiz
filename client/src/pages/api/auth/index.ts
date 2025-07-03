import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../../lib/db'
import { sendEmail } from '../../../lib/email'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`[API] ${req.method} ${req.url}`)
  switch (req.method) {
    case 'POST':
      const { action, email, password, username } = req.body
      if (!email || !password || (action === 'signup' && !username)) {
        return res.status(400).json({ error: 'Invalid request' })
      }
      if (action === 'signup') {
        try {
          const existing = await prisma.user.findUnique({ where: { email } })
          if (existing) return res.status(400).json({ error: 'User exists' })
          const hashed = await bcrypt.hash(password, 10)
          const code = Math.floor(10000 + Math.random() * 90000).toString()
          const role = email.toLowerCase() === 'calvickauer@gmail.com' ? 'admin' : 'user'
          await prisma.user.create({
            data: { email, password: hashed, username, role, verificationCode: code },
          })
          await sendEmail(email, 'Verify your account', `Your verification code is ${code}`)
          return res.status(200).json({ success: true })
        } catch (e) {
          console.error(e)
          return res.status(500).json({ error: 'Signup failed' })
        }
      } else if (action === 'login') {
        try {
          const user = await prisma.user.findUnique({ where: { email } })
          if (!user) return res.status(401).json({ error: 'Invalid credentials' })
          if (!user.isVerified) return res.status(403).json({ error: 'Email not verified' })
          const valid = await bcrypt.compare(password, user.password)
          if (!valid) return res.status(401).json({ error: 'Invalid credentials' })
          const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET)
          return res.status(200).json({ token })
        } catch (e) {
          console.error(e)
          return res.status(500).json({ error: 'Login failed' })
        }
      } else {
        return res.status(400).json({ error: 'Unknown action' })
      }
    case 'DELETE':
      // logout placeholder - token is client-side only
      return res.status(200).json({ message: 'logout' })
    default:
      return res.status(405).end()
  }
}
