/*
  Warnings:

  - You are about to drop the column `compnayId` on the `contacts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "compnayId",
ADD COLUMN     "companyId" TEXT;
