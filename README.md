# AI Interview Prep Quizzer

AI Interview Prep Quizzer is a Next.js 14 application for generating custom interview questions with the help of OpenAI. The project uses Prisma ORM with a SQLite database by default and relies on NextAuth for authentication. Tailwind CSS provides the styling and Jest is configured for unit tests. The entire application was built by **Calvin Moldenhauer**.

## Prerequisites

- **Node.js** 18 or later
- An **OpenAI API** subscription (to access GPT models)
- Optional: a mail provider if you enable email verification

## Local Setup

1. Clone the repository and install dependencies:
   ```bash
   git clone <repo-url>
   cd Ai-Interview-Quiz/client
   npm install
   ```
2. Copy the example environment file and fill in your credentials:
   ```bash
   cp ../.env.example ../.env.local
   # or from within client:
   cp .env.example .env.local
   ```
   At a minimum set the following values:
   - `OPENAI_API_KEY` – obtain this from your OpenAI account. A paid API key is required for ChatGPT/GPT‑4 access.
   - `JWT_SECRET` and `NEXTAUTH_SECRET` – random strings used for auth tokens.
   - `DATABASE_URL` – `file:./dev.db` is fine for local SQLite. For production use a hosted database.
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` if you want Google OAuth login.
   - `NEXTAUTH_URL` – usually `http://localhost:3000` during development.
3. Run the initial Prisma migration and generate the client:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Execute linting and the Jest test suite when needed:
   ```bash
   npm run lint
   npm test
   ```

The database schema lives in `client/prisma/schema.prisma`. Modify it and run `npx prisma migrate dev` whenever you add new fields.

## Folder Structure

```
/ (root)
├── client/           # Next.js application
│   ├── src/
│   │   ├── app/      # App Router pages
│   │   └── pages/api # API routes
│   └── prisma/       # Prisma schema and migrations
├── shared/           # Shared utilities (OpenAI helper, Prisma client)
└── deploy.sh         # Vercel deployment helper
```

## Notes

- **Authentication Flow:** NextAuth handles credentials and OAuth logins.
- **Quiz Generation:** API routes invoke OpenAI (GPT‑4o models) to generate questions and to check answers.
- **Profile Management:** the `/profile` page allows avatar uploads and editing a short bio.
- **Responsive Design:** Tailwind ensures mobile and desktop views look good.
- **Testing:** Jest and React Testing Library verify components and API logic.

## Deploying to Vercel

1. Install the Vercel CLI if you have not already:
   ```bash
   npm install -g vercel
   ```
2. Log in and link the project:
   ```bash
   vercel login
   vercel link
   ```
3. Configure production environment variables in Vercel:
   - `OPENAI_API_KEY` – the same key used locally.
   - `JWT_SECRET` and `NEXTAUTH_SECRET` – keep these secure and identical to your local values if you want to reuse sessions.
   - `DATABASE_URL` – **do not** use the local SQLite file. Provision a hosted database (PostgreSQL, MySQL, etc.) and update this value accordingly.
   - `NEXTAUTH_URL` – the full HTTPS URL of your Vercel deployment.
   - Optional OAuth or email settings if you use them.
4. Update `client/prisma/schema.prisma` for your production database provider if you move away from SQLite, then run:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```
   You can integrate these commands into the `vercel-build` script so that migrations run automatically during deployment.
5. Deploy using the helper script from the repository root:
   ```bash
   ./deploy.sh
   ```
   This runs `vercel --prod` with the `client/` directory as the project root.

Once deployed, visit the Vercel URL from your dashboard. Ensure your database and OpenAI billing are configured so the API calls succeed.

## Credits

Created and maintained by **Calvin Moldenhauer**. Feel free to fork the project and adapt it for your own interview preparation needs.
