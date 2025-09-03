/*
  Warnings:

  - You are about to drop the column `isCostumer` on the `contacts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "isCostumer",
ADD COLUMN     "isCustomer" BOOLEAN DEFAULT true;
