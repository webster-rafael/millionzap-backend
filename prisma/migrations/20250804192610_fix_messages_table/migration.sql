/*
  Warnings:

  - You are about to drop the column `deliveredAt` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `sentAt` on the `messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "deliveredAt",
DROP COLUMN "readAt",
DROP COLUMN "sentAt";
