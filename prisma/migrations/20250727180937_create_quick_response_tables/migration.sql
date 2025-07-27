-- CreateTable
CREATE TABLE "quick_responses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortcut" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "queueId" TEXT NOT NULL DEFAULT 'Atendimento',

    CONSTRAINT "quick_responses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "quick_responses" ADD CONSTRAINT "quick_responses_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "queues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
