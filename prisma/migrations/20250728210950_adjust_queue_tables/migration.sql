/*
  Warnings:

  - The `schedules` column on the `queues` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "queues" DROP COLUMN "schedules",
ADD COLUMN     "schedules" JSONB[] DEFAULT ARRAY[]::JSONB[];
