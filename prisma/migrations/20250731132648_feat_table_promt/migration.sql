-- DropForeignKey
ALTER TABLE "prompts" DROP CONSTRAINT "prompts_queueId_fkey";

-- AlterTable
ALTER TABLE "prompts" ALTER COLUMN "queueId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "queues"("id") ON DELETE SET NULL ON UPDATE CASCADE;
