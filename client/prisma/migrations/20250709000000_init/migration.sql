-- CreateTables for PostgreSQL
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "role" TEXT NOT NULL,
    "apiAccess" BOOLEAN NOT NULL DEFAULT FALSE,
    "accessRequested" BOOLEAN NOT NULL DEFAULT FALSE,
    "isVerified" BOOLEAN NOT NULL DEFAULT FALSE,
    "verificationCode" TEXT
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "proficiency" TEXT NOT NULL DEFAULT 'Medium',
    "multipleChoice" BOOLEAN NOT NULL DEFAULT FALSE,
    "totalQuestions" INTEGER NOT NULL,
    "correctCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "hint" TEXT NOT NULL,
    "modelAnswer" TEXT NOT NULL,
    "options" TEXT,
    "userCorrect" BOOLEAN,
    CONSTRAINT "Question_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
