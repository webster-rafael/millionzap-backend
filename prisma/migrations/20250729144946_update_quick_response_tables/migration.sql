-- DropForeignKey
ALTER TABLE "quick_responses" DROP CONSTRAINT "quick_responses_queueId_fkey";

-- AddForeignKey
ALTER TABLE "quick_responses" ADD CONSTRAINT "quick_responses_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "queues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
