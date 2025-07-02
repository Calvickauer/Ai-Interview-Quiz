import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // fetch history placeholder
      return res.status(200).json({ message: 'history placeholder' })
    default:
      return res.status(405).end()
  }
}
