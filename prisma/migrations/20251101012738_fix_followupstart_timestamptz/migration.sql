-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "timeToFolowUp" TIMESTAMPTZ,
ALTER COLUMN "followUpStart" SET DATA TYPE TIMESTAMPTZ;
