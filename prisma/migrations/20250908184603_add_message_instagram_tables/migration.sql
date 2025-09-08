/*
  Warnings:

  - You are about to drop the column `conversationInstagramId` on the `messages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_conversationInstagramId_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "conversationInstagramId";

-- CreateTable
CREATE TABLE "MessageInstagram" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT,
    "direction" "Direction" NOT NULL,
    "messageType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "timestamp" TEXT NOT NULL,
    "companyId" TEXT,
    "plataform" TEXT,
    "conversationInstagramId" TEXT,

    CONSTRAINT "MessageInstagram_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MessageInstagram" ADD CONSTRAINT "MessageInstagram_conversationInstagramId_fkey" FOREIGN KEY ("conversationInstagramId") REFERENCES "conversation_ig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageInstagram" ADD CONSTRAINT "MessageInstagram_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageInstagram" ADD CONSTRAINT "MessageInstagram_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
