/*
  Warnings:

  - You are about to drop the column `connectionId` on the `queues` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "queues" DROP CONSTRAINT "queues_connectionId_fkey";

-- AlterTable
ALTER TABLE "queues" DROP COLUMN "connectionId";

-- CreateTable
CREATE TABLE "queue_connections" (
    "id" TEXT NOT NULL,
    "queueId" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,

    CONSTRAINT "queue_connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "queue_connections_queueId_connectionId_key" ON "queue_connections"("queueId", "connectionId");

-- AddForeignKey
ALTER TABLE "queue_connections" ADD CONSTRAINT "queue_connections_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "queues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "queue_connections" ADD CONSTRAINT "queue_connections_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "WhatsAppConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
