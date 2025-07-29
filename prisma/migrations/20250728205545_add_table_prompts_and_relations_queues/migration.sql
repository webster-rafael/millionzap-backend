/*
  Warnings:

  - You are about to drop the column `description` on the `queues` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "queues" DROP COLUMN "description",
ADD COLUMN     "greetingMessage" TEXT,
ADD COLUMN     "integrationId" TEXT,
ADD COLUMN     "outOfOfficeHoursMessage" TEXT,
ADD COLUMN     "promptId" TEXT,
ADD COLUMN     "schedules" TEXT[];

-- CreateTable
CREATE TABLE "prompts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "maxTokens" INTEGER NOT NULL,
    "maxMessages" INTEGER NOT NULL,
    "promptTokens" INTEGER,
    "completionTokens" INTEGER,
    "totalTokens" INTEGER,
    "temperature" DOUBLE PRECISION,
    "assistantId" TEXT,
    "description" TEXT,
    "companyResume" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "queueId" TEXT NOT NULL,

    CONSTRAINT "prompts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "queues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
