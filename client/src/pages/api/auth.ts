import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      // signup or login placeholder
      return res.status(200).json({ message: 'auth placeholder' })
    case 'DELETE':
      // logout placeholder
      return res.status(200).json({ message: 'logout placeholder' })
    default:
      return res.status(405).end()
  }
}
