# AI Interview Prep Quizzer

This repository contains a **Next.js** and **Prisma** based application used to
generate interview quizzes with help from AI.  The frontend lives in the
`client/` folder while shared database utilities are stored in `shared/`.
Users can sign up, log in, generate quizzes and maintain a personal profile with
an avatar and short bio.

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
4. Run the linter and test suite.
   ```bash
   npm run lint
   npm test
   ```

The application stores user data in a SQLite database using Prisma. After cloning
the repo you can inspect the `client/prisma/schema.prisma` file which describes
the database models. New fields can be added and migrations generated with
`npx prisma migrate dev`.

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
- **Profile Management:** the `/profile` page allows uploading an avatar and
  editing a short bio. The form posts `multipart/form-data` to the API route at
  `pages/api/user/update.ts` which saves the file to `public/uploads` and updates
  the authenticated user.
- **Responsive Navigation:** the top navigation bar adapts to mobile, tablet and
  desktop widths. A hamburger menu appears on small screens and there is
  generous spacing on each side. The avatar and username in the bar link to your
  profile.
- **Testing:** Jest and React Testing Library are configured inside `client/` to
  ensure pages behave as expected.
