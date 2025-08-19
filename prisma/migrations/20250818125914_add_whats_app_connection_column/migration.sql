-- CreateEnum
CREATE TYPE "WhatsAppConnectionStatus" AS ENUM ('OPEN', 'PENDING', 'CLOSED');

-- AlterTable
ALTER TABLE "prompts" ADD COLUMN     "whatsAppConnectionId" TEXT;

-- AlterTable
ALTER TABLE "queues" ADD COLUMN     "whatsAppConnectionId" TEXT;

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
    "userId" TEXT,
    "promptId" TEXT NOT NULL,
    "transferQueueId" TEXT,
    "timeToTransfer" TEXT,
    "expiresInactiveMessage" TEXT,
    "companyId" TEXT,
    "session" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "status" "WhatsAppConnectionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppConnection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "queues" ADD CONSTRAINT "queues_whatsAppConnectionId_fkey" FOREIGN KEY ("whatsAppConnectionId") REFERENCES "WhatsAppConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_whatsAppConnectionId_fkey" FOREIGN KEY ("whatsAppConnectionId") REFERENCES "WhatsAppConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppConnection" ADD CONSTRAINT "WhatsAppConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
