-- DropForeignKey
ALTER TABLE "message-ig" DROP CONSTRAINT "message-ig_conversationInstagramId_fkey";

-- AddForeignKey
ALTER TABLE "message-ig" ADD CONSTRAINT "message-ig_conversationInstagramId_fkey" FOREIGN KEY ("conversationInstagramId") REFERENCES "conversation_ig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
