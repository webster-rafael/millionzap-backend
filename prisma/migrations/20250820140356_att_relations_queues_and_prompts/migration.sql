/*
  Warnings:

  - You are about to drop the column `queueId` on the `prompts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "prompts" DROP CONSTRAINT "prompts_queueId_fkey";

-- AlterTable
ALTER TABLE "prompts" DROP COLUMN "queueId";

-- CreateTable
CREATE TABLE "prompt_queue" (
    "id" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "queueId" TEXT NOT NULL,

    CONSTRAINT "prompt_queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prompt_queue_promptId_queueId_key" ON "prompt_queue"("promptId", "queueId");

-- AddForeignKey
ALTER TABLE "prompt_queue" ADD CONSTRAINT "prompt_queue_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "prompts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_queue" ADD CONSTRAINT "prompt_queue_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "queues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
