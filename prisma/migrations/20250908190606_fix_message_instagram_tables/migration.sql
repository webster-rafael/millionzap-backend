/*
  Warnings:

  - You are about to drop the column `plataform` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `MessageInstagram` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MessageInstagram" DROP CONSTRAINT "MessageInstagram_companyId_fkey";

-- DropForeignKey
ALTER TABLE "MessageInstagram" DROP CONSTRAINT "MessageInstagram_conversationInstagramId_fkey";

-- DropForeignKey
ALTER TABLE "MessageInstagram" DROP CONSTRAINT "MessageInstagram_userId_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "plataform";

-- DropTable
DROP TABLE "MessageInstagram";

-- CreateTable
CREATE TABLE "message-ig" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT,
    "direction" "Direction" NOT NULL,
    "messageType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "timestamp" TEXT NOT NULL,
    "companyId" TEXT,
    "plataform" TEXT,
    "conversationInstagramId" TEXT NOT NULL,

    CONSTRAINT "message-ig_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "message-ig" ADD CONSTRAINT "message-ig_conversationInstagramId_fkey" FOREIGN KEY ("conversationInstagramId") REFERENCES "conversation_ig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message-ig" ADD CONSTRAINT "message-ig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message-ig" ADD CONSTRAINT "message-ig_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
