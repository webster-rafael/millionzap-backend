-- AlterTable
ALTER TABLE "WhatsAppConnection" ALTER COLUMN "timeToTransfer" DROP NOT NULL,
ALTER COLUMN "timeToTransfer" SET DATA TYPE TEXT;
