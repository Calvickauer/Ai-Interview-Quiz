# AI Interview Prep Quizzer

This repository contains a full-stack monorepo project to practice interview questions using AI-generated quizzes.

## Setup

1. Install dependencies inside `client/`.
   ```bash
   cd client
   npm install
   ```
2. Run Prisma database migrations.
   ```bash
   npx prisma migrate dev --name init
   ```
3. Start the development server.
   ```bash
   npm run dev
   ```

## Folder Structure

```
/ (root)
├── client/           # Next.js application
│   ├── src/
│   │   ├── app/      # App Router pages
│   │   └── pages/api # API routes
│   └── prisma/       # Prisma schema and migrations
├── shared/           # Shared utilities and types
│   ├── db.ts
│   └── types.d.ts
└── README.md
```

## Notes

- **Authentication Flow:** placeholder API routes handle signup, login and logout using sessions.
- **Quiz Endpoints:** endpoints create quizzes with OpenAI, store questions and track results.
- **OpenAI Integration:** question generation will use the OpenAI API (implementation not included).
