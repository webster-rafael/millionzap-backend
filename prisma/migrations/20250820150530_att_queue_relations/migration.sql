/*
  Warnings:

  - You are about to drop the column `promptId` on the `queues` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "prompt_queue_promptId_queueId_key";

-- AlterTable
ALTER TABLE "queues" DROP COLUMN "promptId";
