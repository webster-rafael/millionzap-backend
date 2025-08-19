/*
  Warnings:

  - Made the column `companyId` on table `WhatsAppConnection` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `connectionId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WhatsAppConnection" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "connectionId" TEXT NOT NULL;
