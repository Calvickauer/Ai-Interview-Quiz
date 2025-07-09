// shared/db.ts
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.warn('[Prisma] DATABASE_URL is not defined')
} else {
  try {
    const sanitized = databaseUrl.replace(/:\/\/([^:]*):([^@]*)@/, '://$1:****@')
    console.log(`[Prisma] Connecting to ${sanitized}`)
  } catch {
    console.log('[Prisma] Connecting to database')
  }
}

const prisma = new PrismaClient()
export default prisma
