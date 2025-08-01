/*
  Warnings:

  - The values [AGENT] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `whatsapp_connections` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[whatsAppConnectionId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "WhatsAppConnectionStatus" AS ENUM ('OPEN', 'PENDING', 'CLOSED');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'USER');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'ADMIN';
COMMIT;

-- DropIndex
DROP INDEX "users_phone_key";

-- AlterTable
ALTER TABLE "prompts" ADD COLUMN     "whatsAppConnectionId" TEXT;

-- AlterTable
ALTER TABLE "queues" ADD COLUMN     "whatsAppConnectionId" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "phone",
ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "whatsAppConnectionId" TEXT,
ALTER COLUMN "role" SET DEFAULT 'ADMIN';

-- DropTable
DROP TABLE "whatsapp_connections";

-- CreateTable
CREATE TABLE "WhatsAppConnection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "greetingMessage" TEXT,
    "conclusionMessage" TEXT,
    "outOfOfficeHoursMessage" TEXT,
    "reviewMessage" TEXT,
    "token" TEXT,
    "queueId" TEXT NOT NULL,
    "integrationId" TEXT,
    "userId" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "transferQueueId" TEXT,
    "timeToTransfer" INTEGER NOT NULL,
    "expiresInactiveMessage" TEXT,
    "companyId" TEXT,
    "session" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "status" "WhatsAppConnectionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppConnection_userId_key" ON "WhatsAppConnection"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_whatsAppConnectionId_key" ON "users"("whatsAppConnectionId");

-- AddForeignKey
ALTER TABLE "WhatsAppConnection" ADD CONSTRAINT "WhatsAppConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "queues" ADD CONSTRAINT "queues_whatsAppConnectionId_fkey" FOREIGN KEY ("whatsAppConnectionId") REFERENCES "WhatsAppConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_whatsAppConnectionId_fkey" FOREIGN KEY ("whatsAppConnectionId") REFERENCES "WhatsAppConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
