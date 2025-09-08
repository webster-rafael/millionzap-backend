/*
  Warnings:

  - You are about to drop the `ConversationInstagram` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ConversationInstagram" DROP CONSTRAINT "ConversationInstagram_companyId_fkey";

-- DropForeignKey
ALTER TABLE "ConversationInstagram" DROP CONSTRAINT "ConversationInstagram_queueId_fkey";

-- DropForeignKey
ALTER TABLE "ConversationInstagram" DROP CONSTRAINT "ConversationInstagram_tagId_fkey";

-- DropForeignKey
ALTER TABLE "ConversationInstagram" DROP CONSTRAINT "ConversationInstagram_userId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_conversationInstagramId_fkey";

-- DropTable
DROP TABLE "ConversationInstagram";

-- CreateTable
CREATE TABLE "conversation_ig" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "userId" TEXT,
    "tagId" TEXT,
    "queueId" TEXT,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "conversation_ig_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "conversation_ig" ADD CONSTRAINT "conversation_ig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_ig" ADD CONSTRAINT "conversation_ig_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "queues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_ig" ADD CONSTRAINT "conversation_ig_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_ig" ADD CONSTRAINT "conversation_ig_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationInstagramId_fkey" FOREIGN KEY ("conversationInstagramId") REFERENCES "conversation_ig"("id") ON DELETE SET NULL ON UPDATE CASCADE;
