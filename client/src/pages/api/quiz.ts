import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      // start quiz or record answer
      return res.status(200).json({ message: 'quiz placeholder' })
    default:
      return res.status(405).end()
  }
}
