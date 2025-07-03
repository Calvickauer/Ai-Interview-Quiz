import { enforceQuizQuota } from '../quota'
import prisma from '../db'

jest.mock('../db', () => ({
  __esModule: true,
  default: {
    user: { findUnique: jest.fn() },
    session: { count: jest.fn() },
  },
}))

const mockDb = prisma as unknown as {
  user: { findUnique: jest.Mock }
  session: { count: jest.Mock }
}

describe('enforceQuizQuota', () => {
  it('allows admin', async () => {
    mockDb.user.findUnique.mockResolvedValue({ role: 'admin' })
    await expect(enforceQuizQuota('1')).resolves.toBeUndefined()
  })

  it('blocks when limit reached', async () => {
    mockDb.user.findUnique.mockResolvedValue({ role: 'user' })
    mockDb.session.count.mockResolvedValue(5)
    await expect(enforceQuizQuota('1')).rejects.toThrow('Quiz limit reached')
  })
})
