/*
  Warnings:

  - You are about to drop the column `whatsappId` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `whatsappId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `whatsAppConnectionId` on the `prompts` table. All the data in the column will be lost.
  - You are about to drop the column `whatsAppConnectionId` on the `queues` table. All the data in the column will be lost.
  - You are about to drop the column `whatsAppConnectionId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `WhatsAppConnection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "prompts" DROP CONSTRAINT "prompts_whatsAppConnectionId_fkey";

-- DropForeignKey
ALTER TABLE "queues" DROP CONSTRAINT "queues_whatsAppConnectionId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_whatsAppConnectionId_fkey";

-- DropIndex
DROP INDEX "messages_whatsappId_key";

-- DropIndex
DROP INDEX "users_whatsAppConnectionId_key";

-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "whatsappId";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "whatsappId";

-- AlterTable
ALTER TABLE "prompts" DROP COLUMN "whatsAppConnectionId";

-- AlterTable
ALTER TABLE "queues" DROP COLUMN "whatsAppConnectionId";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "whatsAppConnectionId";

-- DropTable
DROP TABLE "WhatsAppConnection";

-- DropEnum
DROP TYPE "WhatsAppConnectionStatus";
