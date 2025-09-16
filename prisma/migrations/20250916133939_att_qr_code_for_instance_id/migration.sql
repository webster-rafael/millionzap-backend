/*
  Warnings:

  - You are about to drop the column `qrCode` on the `WhatsAppConnection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WhatsAppConnection" DROP COLUMN "qrCode",
ADD COLUMN     "instanceId" TEXT;
