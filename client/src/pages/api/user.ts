import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import { promises as fs } from 'fs'
import path from 'path'
import prisma from '../../../shared/db'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const form = formidable({ multiples: false })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: 'Form parse error' })
    }

    const { username, bio, role } = fields
    const file = Array.isArray(files.avatar) ? files.avatar[0] : files.avatar

    if (!username || !bio || !role || !file) {
      return res.status(400).json({ error: 'Missing fields' })
    }

    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      await fs.mkdir(uploadsDir, { recursive: true })
      const fileExt = path.extname(file.originalFilename || '')
      const fileName = `${Date.now()}_${Math.random().toString(16).slice(2)}${fileExt}`
      const dest = path.join(uploadsDir, fileName)
      await fs.copyFile(file.filepath, dest)

      const userId = req.headers['x-user-id'] as string | undefined
      if (!userId) {
        return res.status(401).json({ error: 'Missing user id' })
      }

      await prisma.user.update({
        where: { id: userId },
        data: { username: String(username), role: String(role), avatarUrl: `/uploads/${fileName}`, bio: String(bio) },
      })
      return res.status(200).json({ avatarUrl: `/uploads/${fileName}` })
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: 'Failed to save profile' })
    }
  })
}
