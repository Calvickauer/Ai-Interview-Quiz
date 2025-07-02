export interface User {
  id: string
  email: string
  password: string
  username: string
  avatarUrl?: string
  role: string
}

export interface Session {
  id: string
  userId: string
  role: string
  totalQuestions: number
  correctCount: number
  createdAt: Date
}

export interface Question {
  id: string
  sessionId: string
  prompt: string
  hint: string
  modelAnswer: string
  userCorrect?: boolean
}
