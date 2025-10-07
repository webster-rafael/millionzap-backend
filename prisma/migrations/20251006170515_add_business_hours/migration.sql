-- AlterTable
ALTER TABLE "configurations" ADD COLUMN     "businessHours" JSONB NOT NULL DEFAULT '[]';
