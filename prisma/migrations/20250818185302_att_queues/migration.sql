/*
  Warnings:

  - You are about to drop the column `whatsAppConnectionId` on the `queues` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "queues" DROP CONSTRAINT "queues_whatsAppConnectionId_fkey";

-- AlterTable
ALTER TABLE "queues" DROP COLUMN "whatsAppConnectionId",
ADD COLUMN     "connectionId" TEXT;

-- AddForeignKey
ALTER TABLE "queues" ADD CONSTRAINT "queues_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "WhatsAppConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
