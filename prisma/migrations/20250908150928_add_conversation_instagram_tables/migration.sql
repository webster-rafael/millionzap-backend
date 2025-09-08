-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "conversationInstagramId" TEXT;

-- CreateTable
CREATE TABLE "ConversationInstagram" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "userId" TEXT,
    "tagId" TEXT,
    "queueId" TEXT,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "ConversationInstagram_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConversationInstagram" ADD CONSTRAINT "ConversationInstagram_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationInstagram" ADD CONSTRAINT "ConversationInstagram_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "queues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationInstagram" ADD CONSTRAINT "ConversationInstagram_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationInstagram" ADD CONSTRAINT "ConversationInstagram_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationInstagramId_fkey" FOREIGN KEY ("conversationInstagramId") REFERENCES "ConversationInstagram"("id") ON DELETE SET NULL ON UPDATE CASCADE;
