/*
  Warnings:

  - The `businessHours` column on the `configurations` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "configurations" DROP COLUMN "businessHours",
ADD COLUMN     "businessHours" JSONB[] DEFAULT ARRAY[]::JSONB[];
