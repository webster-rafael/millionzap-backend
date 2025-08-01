/*
  Warnings:

  - You are about to drop the column `avatar` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `isBlocked` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `lastSeenAt` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `contacts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "avatar",
DROP COLUMN "isBlocked",
DROP COLUMN "lastSeenAt",
DROP COLUMN "notes",
ADD COLUMN     "isCostumer" BOOLEAN DEFAULT true;
