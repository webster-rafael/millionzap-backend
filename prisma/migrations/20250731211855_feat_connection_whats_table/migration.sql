/*
  Warnings:

  - Made the column `whatsAppConnectionId` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "WhatsAppConnection" DROP CONSTRAINT "WhatsAppConnection_userId_fkey";

-- DropIndex
DROP INDEX "WhatsAppConnection_userId_key";

-- AlterTable
ALTER TABLE "WhatsAppConnection" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "whatsAppConnectionId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_whatsAppConnectionId_fkey" FOREIGN KEY ("whatsAppConnectionId") REFERENCES "WhatsAppConnection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
