import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import prisma from '../../../lib/db'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user) return null
        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null
        return { id: user.id, email: user.email, name: user.username, role: user.role }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      console.log('[NEXTAUTH] signIn', { provider: account?.provider, email: user.email })
      if (account?.provider === 'google') {
        const email = user.email as string
        let dbUser = await prisma.user.findUnique({ where: { email } })
        const role = email.toLowerCase() === 'calvickauer@gmail.com' ? 'admin' : 'user'
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: { email, username: user.name || email, password: '', role, isVerified: true },
          })
          console.log('[NEXTAUTH] created user for google sign in', dbUser)
        } else {
          console.log('[NEXTAUTH] found user for google sign in', dbUser)
        }
        user.id = dbUser.id
        ;(user as any).role = dbUser.role
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
        }
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
