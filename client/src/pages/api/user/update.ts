import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import { promises as fs } from 'fs'
import path from 'path'
import prisma from '../../../lib/db'

export const config = { api: { bodyParser: false } }

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`[API] ${req.method} ${req.url}`)
  if (req.method !== 'POST') return res.status(405).end()

  const form = formidable({ multiples: false })
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: 'Form parse error' })
    }

    const { username, bio } = fields
    const file = Array.isArray(files.avatar) ? files.avatar[0] : files.avatar
    if (!username || !bio || !file) {
      return res.status(400).json({ error: 'Missing fields' })
    }

    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      await fs.mkdir(uploadsDir, { recursive: true })
      const ext = path.extname(file.originalFilename || '')
      const fileName = `${Date.now()}_${Math.random().toString(16).slice(2)}${ext}`
      await fs.copyFile(file.filepath, path.join(uploadsDir, fileName))

      const userId = req.headers['x-user-id'] as string | undefined
      if (!userId) return res.status(401).json({ error: 'Missing user id' })

      const avatarUrl = `/uploads/${fileName}`
      console.log('Updating user:', { userId, username, bio, avatarUrl })

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          username: String(username),
          bio: String(bio),
          avatarUrl,
        },
      })

      return res.status(200).json({ success: true, user: { username: user.username, bio: user.bio, avatarUrl: user.avatarUrl } })
    } catch (error) {
      console.error('USER UPDATE ERROR:', error)
      return res.status(500).json({ error: 'Failed to save profile' })
    }
  })
}
